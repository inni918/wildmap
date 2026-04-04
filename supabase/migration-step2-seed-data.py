#!/usr/bin/env python3
"""
Wildmap Migration Step 2: 匯入種子資料到新 Schema
在 Supabase Dashboard 執行完 step1 SQL 後，在本地跑此腳本

用法: python3 /tmp/wildmap-backup/migration-step2-seed-data.py
"""

import json
import os
import urllib.request
import urllib.error
import sys
import time

BASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/") + "/rest/v1"
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}
BACKUP_DIR = "/tmp/wildmap-backup"

def api_post(table, records, batch_size=50):
    """批次 POST 到 REST API"""
    total = len(records)
    success = 0
    errors = []
    for i in range(0, total, batch_size):
        batch = records[i:i+batch_size]
        data = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(
            f"{BASE_URL}/{table}",
            data=data,
            headers=HEADERS,
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as resp:
                success += len(batch)
                if (i // batch_size) % 5 == 0 or i + batch_size >= total:
                    print(f"  {table}: {success}/{total}")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            errors.append(f"batch {i}: {e.code} {err_body[:300]}")
            print(f"  ❌ {table} batch {i}: {e.code} {err_body[:200]}")
            # 如果是 409 conflict，繼續；其他錯誤停止
            if e.code == 409:
                success += len(batch)  # 可能部分成功
                continue
            break
        # 避免 rate limit
        time.sleep(0.1)
    return success, errors

def transform_spots(old_spots):
    """舊 spots → 新 schema 格式"""
    # status mapping: published → active, suspended → hidden
    status_map = {
        'published': 'active',
        'suspended': 'hidden',
        'active': 'active',
        'hidden': 'hidden',
        'closed': 'closed',
        'pending': 'pending',
    }
    # quality mapping: new → new, official → verified
    quality_map = {
        'new': 'new',
        'official': 'verified',
        'verified': 'verified',
        'featured': 'featured',
    }
    
    new_spots = []
    for s in old_spots:
        # 從 address 提取 city
        city = None
        address = s.get('address', '') or ''
        if address:
            # 台灣地址通常以 縣/市 開頭
            for suffix in ['市', '縣']:
                idx = address.find(suffix)
                if idx >= 0 and idx < 6:
                    city = address[:idx+1]
                    break
        
        # spot_type 映射
        is_free = s.get('is_free')
        if is_free is True:
            spot_type = 'free'
        else:
            spot_type = 'paid'
        
        new_spot = {
            'id': s['id'],
            'name': s['name'],
            'description': s.get('description'),
            'lat': s['latitude'],
            'lng': s['longitude'],
            'address': s.get('address'),
            'city': city,
            'district': None,
            'category': s.get('category', 'camping'),
            'spot_type': spot_type,
            'status': status_map.get(s.get('status', 'published'), 'active'),
            'altitude': s.get('elevation'),
            'website': s.get('website'),
            'facebook': s.get('facebook'),
            'instagram': s.get('instagram'),
            'line_id': s.get('line_id'),
            'email': s.get('email'),
            'google_maps_url': s.get('google_maps_url'),
            'gov_certified': s.get('gov_certified', False),
            # created_by 設 NULL（因為舊 seed user 00000...01 不在 auth.users 裡）
            'created_by': None,
            'quality_level': quality_map.get(s.get('quality', 'new'), 'new'),
            'view_count': s.get('view_count', 0),
            'created_at': s.get('created_at'),
            'updated_at': s.get('updated_at'),
        }
        new_spots.append(new_spot)
    return new_spots

def transform_feature_definitions(old_fds):
    """舊 feature_definitions → 新 schema 格式"""
    # group_key → category mapping
    category_map = {
        'camp_traits': 'campsite',
        'facilities': 'facilities',
        'environment': 'environment',
        'activities': 'activities',
        'restrictions': 'notes',
        'warnings': 'notes',
        'zones': 'zones',
        'campsite': 'campsite',
        'notes': 'notes',
    }
    
    new_fds = []
    for fd in old_fds:
        cat = category_map.get(fd.get('group_key', ''), 'notes')
        new_fd = {
            'id': fd['id'],
            'name': fd.get('name_zh', fd.get('key', '')),
            'description': fd.get('name_en'),
            'category': cat,
            'icon_name': fd.get('icon'),
            'color': fd.get('color'),
            'sort_order': fd.get('sort_order', 0),
            'applicable_types': fd.get('applicable_categories', []),
            'is_active': True,
        }
        new_fds.append(new_fd)
    return new_fds

def transform_feature_votes(old_fvs):
    """舊 feature_votes → 新 schema（去掉 weight，去掉沒有 user_id 的）"""
    new_fvs = []
    seen = set()
    for fv in old_fvs:
        uid = fv.get('user_id')
        if not uid:
            continue
        # 去重（spot_id, feature_id, user_id 必須唯一）
        key = (fv['spot_id'], fv['feature_id'], uid)
        if key in seen:
            continue
        seen.add(key)
        
        new_fv = {
            'id': fv['id'],
            'spot_id': fv['spot_id'],
            'feature_id': fv['feature_id'],
            'user_id': uid,
            'vote': fv['vote'],
            'created_at': fv.get('created_at'),
        }
        new_fvs.append(new_fv)
    return new_fvs


def main():
    print("=" * 60)
    print("Wildmap Migration Step 2: 匯入種子資料")
    print("=" * 60)
    
    results = {}
    errors_all = {}
    
    # === 1. feature_definitions (no FK dependencies) ===
    print("\n[1/3] 匯入 feature_definitions...")
    with open(f"{BACKUP_DIR}/feature_definitions.json") as f:
        old_fds = json.load(f)
    new_fds = transform_feature_definitions(old_fds)
    count, errs = api_post("feature_definitions", new_fds, batch_size=50)
    results['feature_definitions'] = count
    errors_all['feature_definitions'] = errs
    print(f"  ✅ feature_definitions: {count}/{len(new_fds)}")
    
    # === 2. spots (FK: created_by → users, 但我們設 NULL) ===
    print("\n[2/3] 匯入 spots...")
    with open(f"{BACKUP_DIR}/spots.json") as f:
        old_spots = json.load(f)
    new_spots = transform_spots(old_spots)
    count, errs = api_post("spots", new_spots, batch_size=50)
    results['spots'] = count
    errors_all['spots'] = errs
    print(f"  ✅ spots: {count}/{len(new_spots)}")
    
    # === 3. feature_votes (FK: spot_id → spots, feature_id → feature_definitions, user_id → users) ===
    # ⚠️ feature_votes 的 user_id 必須存在於 users 表
    # 舊資料的 user_id 可能不在新 users 表裡，需要先確認
    print("\n[3/3] 匯入 feature_votes...")
    print("  ⚠️ feature_votes 需要 users 表有對應 user_id")
    print("  先檢查現有 users...")
    
    # 取得新 users 表的 user_ids
    req = urllib.request.Request(
        f"{BASE_URL}/users?select=id",
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            existing_users = json.load(resp)
            user_ids = set(u['id'] for u in existing_users)
            print(f"  現有 users: {len(user_ids)} 筆")
    except Exception as e:
        print(f"  ❌ 無法查詢 users: {e}")
        user_ids = set()
    
    with open(f"{BACKUP_DIR}/feature_votes.json") as f:
        old_fvs = json.load(f)
    new_fvs = transform_feature_votes(old_fvs)
    
    if not user_ids:
        print("  ⚠️ users 表為空，feature_votes 無法匯入（FK constraint）")
        print("  feature_votes 需要等 users 資料就緒後再匯入")
        results['feature_votes'] = 0
        errors_all['feature_votes'] = ['No users in table - FK constraint']
    else:
        # 只匯入 user_id 存在的 feature_votes
        valid_fvs = [fv for fv in new_fvs if fv['user_id'] in user_ids]
        skipped = len(new_fvs) - len(valid_fvs)
        if skipped > 0:
            print(f"  ⚠️ 跳過 {skipped} 筆 (user_id 不在 users 表)")
        
        if valid_fvs:
            count, errs = api_post("feature_votes", valid_fvs, batch_size=50)
            results['feature_votes'] = count
            errors_all['feature_votes'] = errs
            print(f"  ✅ feature_votes: {count}/{len(valid_fvs)} (跳過 {skipped})")
        else:
            results['feature_votes'] = 0
            errors_all['feature_votes'] = ['All user_ids missing from users table']
            print("  ⚠️ 所有 feature_votes 的 user_id 都不在 users 表中")
    
    # === Summary ===
    print("\n" + "=" * 60)
    print("匯入完成！摘要：")
    print("=" * 60)
    for table, count in results.items():
        status = "✅" if not errors_all.get(table) else "⚠️"
        print(f"  {status} {table}: {count} 筆")
        for err in errors_all.get(table, []):
            print(f"      ❌ {err[:100]}")
    
    return results, errors_all


if __name__ == '__main__':
    results, errors = main()
