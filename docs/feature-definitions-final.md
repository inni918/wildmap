# 特性定義最終版（2026-03-05 定案）

共 6 大類 106 項。預設所有特性通用 camping + carcamp，少部分例外再標記。

## 1. 營地特性（camp_traits）— 21 項 color: tomato

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | free_site | 免費 | 費用 |
| 2 | reservation_required | 需預約 | 預約 |
| 3 | night_arrival | 可夜衝 | 時間 |
| 4 | campfire_allowed | 可生火 | 可做的事 |
| 5 | accommodation | 提供住宿 | |
| 6 | equipment_rental | 可租裝備 | |
| 7 | food_delivery | 食材直配 | |
| 8 | glamping | 豪華露營 | |
| 9 | small_group_area | 少帳包區 | 營地空間 |
| 10 | covered_area | 雨棚露營區 | |
| 11 | car_beside_tent | 車停帳邊 | |
| 12 | power_outlet | 提供電源 | |
| 13 | managed_site | 有管理員 | |
| 14 | no_smoking | 場內禁菸 | 規範 |
| 15 | no_loud_equipment | 禁高分貝設備 | |
| 16 | no_alcohol | 禁止飲酒 | |
| 17 | child_friendly | 幼兒友善 | 友善 |
| 18 | disability_friendly | 身障者友善 | |
| 19 | pet_friendly | 寵物友善 | |
| 20 | wifi | 提供Wi-Fi | 通訊 |
| 21 | mobile_signal | 4G/5G | |

## 2. 設施與服務（facilities）— 22 項 color: turquoise

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | tap_water | 自來水 | 水源 |
| 2 | water_dispenser | 飲水機 | |
| 3 | hot_water | 熱水供應 | |
| 4 | flush_toilet | 沖水馬桶 | 衛浴 |
| 5 | squat_toilet | 蹲式廁所 | |
| 6 | shower | 淋浴間 | |
| 7 | private_bathroom | 包區獨立衛浴 | |
| 8 | hot_spring | 溫泉 | |
| 9 | hair_dryer | 吹風機 | |
| 10 | washing_machine | 洗衣機 | 洗滌 |
| 11 | spin_dryer | 脫水機 | |
| 12 | sink | 洗滌槽 | |
| 13 | refrigerator | 冰箱 | 飲食 |
| 14 | shared_kitchen | 公用廚房 | |
| 15 | food_service | 餐飲服務 | |
| 16 | convenience_store | 便利商店 | |
| 17 | outdoor_seating | 戶外桌椅 | 空間 |
| 18 | trash_bin | 垃圾桶 | |
| 19 | playground | 遊樂設施 | 娛樂 |
| 20 | basketball_court | 籃球場 | |
| 21 | sandbox | 沙坑 | |
| 22 | swimming_pool | 戲水池/泳池 | |

## 3. 周邊環境（environment）— 20 項 color: forestgreen

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | shaded | 大片樹蔭 | 植被 |
| 2 | grassland | 大片草皮 | |
| 3 | forest | 森林 | |
| 4 | river_stream | 溪流 | 水域 |
| 5 | lake | 湖泊 | |
| 6 | sandy_beach | 沙灘 | |
| 7 | waterfall | 瀑布 | |
| 8 | wild_hot_spring | 野溪溫泉 | |
| 9 | mountain_view | 山景 | 景觀 |
| 10 | ocean_view | 海景 | |
| 11 | sea_of_clouds | 雲海 | |
| 12 | panoramic_view | 視野遼闊 | |
| 13 | sunrise_view | 日出景觀 | |
| 14 | night_view | 夜景 | |
| 15 | stargazing | 適合觀星 | |
| 16 | fireflies | 螢火蟲 | 生態 |
| 17 | wildlife | 野生動物 | |
| 18 | bird_watching | 賞鳥 | |
| 19 | seasonal_flowers | 季節賞花 | 季節 |
| 20 | autumn_leaves | 賞楓 | |

## 4. 可進行活動（activities）— 18 項 color: navy

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | hiking_trails | 健行步道 | 戶外運動 |
| 2 | cycling | 自行車道 | |
| 3 | rock_climbing | 攀岩 | |
| 4 | high_ropes | 高空探索 | |
| 5 | grass_sledding | 滑草 | |
| 6 | swimming | 玩水/游泳 | 水上 |
| 7 | river_tracing | 溯溪 | |
| 8 | water_sports | 水上活動 | |
| 9 | fishing | 釣魚 | 釣魚 |
| 10 | paintball | 漆彈 | 特殊活動 |
| 11 | sky_lantern | 天燈 | |
| 12 | craft_workshop | 手作課程 | 體驗課程 |
| 13 | ecology_tour | 生態體驗 | |
| 14 | farm_experience | 農場體驗 | |
| 15 | ranch_experience | 牧場體驗 | |
| 16 | science_experience | 科學體驗 | |
| 17 | cultural_experience | 文化體驗 | |
| 18 | indigenous_activity | 原住民傳統活動 | |

## 5. 區域與限制（restrictions）— 14 項 color: fuchsia

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | indigenous_area | 原住民地區 | 區域 |
| 2 | high_mountain | 百岳 | |
| 3 | national_park | 國家公園/國家風景區 | |
| 4 | nature_reserve | 自然保護區 | |
| 5 | permit_required | 需申請進入 | 進入限制 |
| 6 | seasonal_access | 季節性開放 | |
| 7 | public_transit | 大眾運輸可抵達 | 交通方式 |
| 8 | motorcycle_ok | 機車可通行 | |
| 9 | car_ok | 小客車可通行 | |
| 10 | rv_ok | 露營車可通行/露營 | |
| 11 | trailer_ok | 露營拖車可通行/露營 | |
| 12 | 4wd_required | 僅四輪驅動通行 | |
| 13 | unpaved_road | 無鋪設道路 | |
| 14 | tent_allowed | 可搭帳篷 | 紮營 |

## 6. 注意事項（warnings）— 11 項 color: maroon

| sort | key | name_zh | 分群 |
|------|-----|---------|------|
| 1 | near_highway | 鄰近公路 | 環境 |
| 2 | poor_drainage | 排水不良 | |
| 3 | steep_terrain | 地形陡峭 | |
| 4 | gravel_ground | 碎石營地 | |
| 5 | biting_midges | 小黑蚊 | 生物 |
| 6 | mosquitoes | 蚊蟲多 | |
| 7 | leeches | 有水蛭 | |
| 8 | snakes | 蛇 | |
| 9 | bees_wasps | 蜂類 | |
| 10 | venomous_creatures | 有毒生物 | |
| 11 | wild_boar | 有山豬出沒 | |

---

## 分類名稱對照

| group_key | 中文 | 英文 | color |
|-----------|------|------|-------|
| camp_traits | 營地特性 | Camp Traits | tomato |
| facilities | 設施與服務 | Facilities & Services | turquoise |
| environment | 周邊環境 | Environment | forestgreen |
| activities | 可進行活動 | Activities | navy |
| restrictions | 區域與限制 | Restrictions | fuchsia |
| warnings | 注意事項 | Warnings | maroon |

## 設計原則
- 預設所有特性適用 camping + carcamp
- 少部分特性只適用特定分類（之後標記）
- 設施與服務：付費營地 = 營區內有；野營/車宿 = 附近有
- 之後新增特性只需 INSERT 一筆，前端自動顯示
