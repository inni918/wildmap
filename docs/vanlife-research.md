# 台灣車宿（車泊／車露）生態研究報告

> 研究日期：2026-03-05
> 研究員：市場研究員（subagent）
> 目的：為 WildMap 平台冷啟動提供資料來源地圖

---

## 1. 台灣車宿資料來源總整理

### 1.1 車宿專門平台

#### 🔵 台灣車宿聯盟 — vanlife.tw
- **URL**：https://www.vanlife.tw/
- **定位**：台灣最具規模的車宿聯盟平台
- **特色**：
  - 免費會員制（終身免費）
  - 分為「站點」「泊點」「澡點」「營地」「特店」「景點」「美食」「好物」「車輛」九大類別
  - 以業主免抽傭、免成本模式吸引特約商家
  - 網站基於 Apache/Debian，內容以 SPA 渲染（資料難直接爬取）
- **爬取難度**：⚠️ 中等（需登入才能看到完整地點列表）
- **資料結構性**：有結構，但需登入後爬取

#### 🟢 98車旅人 — 98vanlife.com
- **URL**：https://98vanlife.com
- **定位**：車宿知識型媒體 + 地點推薦
- **特色**：
  - 大量高品質車宿地點推薦文章
  - 每個地點提供：名稱、地址、GPS座標、Google Maps連結
  - 涵蓋：海邊車宿、山林車宿、車宿露營區
  - Instagram 帳號 @98vanlife 也有豐富素材
- **已確認地點（海邊類範例）**：
  | 地點 | 地址 | GPS座標 |
  |------|------|---------|
  | 宜蘭朝陽社區發展協會 | 宜蘭縣蘇澳鎮朝陽路40號 | 24.461522, 121.815974 |
  | 新北福隆東興宮 | 新北市貢寮區東興街3號 | 25.110071, 121.928129 |
  | 台中大安濱海樂園 | 台中市大安區北汕路86號 | 24.383407, 120.584765 |
  | 嘉義東石漁人碼頭 | 嘉義縣東石鄉觀海三路308號 | 23.451764, 120.134470 |
  | 屏東大鵬灣潮口平台 | 屏東縣東港鎮紅樹林復育溼地公園旁 | 22.452896, 120.458449 |
- **爬取難度**：✅ 低（靜態文章，結構清晰，有GPS座標）

#### 🟡 愛露營（icamping.tw）
- **URL**：https://icamping.tw
- **定位**：台灣主要露營訂位平台
- **特色**：
  - 設有「車露專區」分類
  - 有大量露營區介紹文章
  - 與元三露營車合作推廣車露
  - 文章含推薦車露露營區（有結構化資訊）
- **重要車露系列文章**：
  - 全台精選十大車露露營區：https://icamping.tw/campervancamping/
  - 新竹十大車露露營區：https://icamping.tw/campervancamping02/
  - 九家風格車露露營區：https://icamping.tw/campervancamping03/
  - Top.6車露露營區指南：https://icamping.tw/campervancamping04/
- **爬取難度**：✅ 低（WordPress 建站，文章結構佳）

#### 🟡 98vanlife 車宿露營區清單（結構化文章）
- **已知車宿友善露營區（帶地址）**：
  | 名稱 | 地區 | 特色 |
  |------|------|------|
  | 九號森霖 | 南投國姓鄉 | B區+VIP區車宿，寵物友善 |
  | 福山星月露營區 | 嘉義阿里山 | 觀星賞月，禮一至禮四開放車泊 |
  | qaluvu卡魯夫休閒農場 | 屏東牡丹鄉 | 車床天地特約，採果趣 |
  | 橘園山谷秘境 | 苗栗獅潭鄉 | 車床特約，螢火蟲季 |
  | 空島露營區 | 嘉義中埔鄉 | 落羽松，車露友善 |
  | 觀星賞月營地 | 新竹 | 車露友善 |
  | 樹語天境 | 南投 | 車宿友善 |
  | 清境瑞士小花園 | 南投清境 | 車宿友善 |
  | 華中露營場 | 台北 | 河濱，車宿友善 |
  | 甜蜜點休閒莊園 | 新北 | 車宿友善 |

### 1.2 車宿社群

#### FB「車床天地」社團
- **性質**：Facebook 非公開社團
- **特色**：
  - 台灣最大車宿社群之一
  - 設有「車床天地會員卡」系統，多個露營區接受持卡優惠
  - 已知提供「車床天地總圖」Google Maps 自訂地圖
  - **重要！Google Maps 地圖**：
    - URL：`https://www.google.com/maps/d/viewer?mid=1Q3JWYBEf6JQC8M4ei6cEojTesjg`
    - 這張地圖已有前人整理的車宿地點，可用 KML 方式匯出
- **爬取難度**：⚠️ 高（FB 社團需登入，但 Google Maps 可公開存取）

#### FB 其他相關社團（待深入調查）
- 「台灣露營地圖交流」
- 「台灣車宿愛好者」
- 各縣市車宿相關地方社團

#### Instagram 車宿 KOL
- @98vanlife — 98車旅人官方帳號，定期分享地點
- @vanlife.tw — 台灣車宿聯盟

### 1.3 露營車租賃業者（有潛在地點資料）
以下業者文章中常包含推薦車宿地點：

| 業者名稱 | 取車地點 | 聯繫方式 |
|---------|---------|---------|
| 日日好露營車 GOODGOODVAN | 台北關渡 | Facebook / LINE |
| SCD Camp 露營車出租 | 桃園龜山 | LINE (@223gqwgu) |
| 夢築露營車 | 台南 | Facebook |
| LazyingLife 享呆 | 新北新店 | LINE (@513wwepa) |
| Mini Kamper | 新北淡水 | LINE (@648artjj) |
| Vantel 美學車中泊 | 台北/台中/花蓮 | LINE (@vantel) |
| 九歐旅行家 | 台中南屯 | Klook |
| 岠陽國際租賃 | 新北三重 | Facebook |

### 1.4 部落格型資料來源（非結構化但可手動整理）

| 來源 | URL | 說明 |
|------|-----|------|
| 98車旅人 | https://98vanlife.com/find-a-campground-post006/ | 車宿地點類型分析 |
| 98車旅人 | https://98vanlife.com/close-to-seaside-post013/ | 5個海邊免費車宿點（含座標）|
| 98車旅人 | https://98vanlife.com/campervan-friendly-camping-area/ | 10個車宿露營區（含地址）|
| 98車旅人 | https://98vanlife.com/van-life-15-frequently-asked-questions-post012/ | 車宿FAQ（含地點分類說明）|

---

## 2. 政府開放資料可用清單

### 2.1 政府開放資料存取說明

**重要限制**：
- `data.gov.tw` API v2 需要 API Key（`Authorization` header），免費但需申請
- `tdx.transportdata.tw`（交通部 TDX）需 OAuth token，免費申請制
- 部分縣市政府 API 有安全防火牆（如新北市政府）

### 2.2 已確認可存取的政府資料

#### ✅ 台北市政府停車場 API（無需金鑰）
- **資料名稱**：台北市路外公共停車場
- **存取方式**：直接呼叫（免 API Key）
- **API URL**：
  ```
  https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json
  ```
- **驗證狀態**：✅ **2026-03-05 確認可存取**
- **資料格式**：JSON
- **資料欄位**：id、area（行政區）、name、type、summary、address、tel、payex、tw97x、tw97y、totalcar、totalmotor、totalbike、totalbus、Pregnancy_First、Handicap_First
- **更新頻率**：每日

#### ⚠️ MOTC TDX 交通部運輸資料流通服務（需申請 API Token）
- **平台網址**：https://tdx.transportdata.tw
- **申請方式**：免費，登入後取得 Client ID + Secret
- **車宿相關資料集**：
  
  | 資料集名稱 | API 端點 | 說明 |
  |-----------|---------|------|
  | 路外停車場 | `/api/basic/v2/Parking/OffStreet/ParkingLot` | 各縣市路外停車場 |
  | 旅遊露營區 | `/api/basic/v2/Tourism/CampingArea` | 全台露營區資料 |
  | 旅遊景點 | `/api/basic/v2/Tourism/ScenicSpot` | 全台景點 |
  | 旅遊旅館 | `/api/basic/v2/Tourism/Hotel` | 旅館資料 |
  
  - **Base URL**：`https://tdx.transportdata.tw`
  - **完整 API 文件**：https://tdx.transportdata.tw/api-service/swagger

#### ⚠️ data.gov.tw 政府開放資料平台（需 API Key）
- **平台網址**：https://data.gov.tw
- **申請方式**：免費，官網申請 API Key
- **搜尋方式**：POST `https://data.gov.tw/api/v2/rest/dataset`，帶 `Authorization: Bearer {KEY}` header
- **建議搜尋關鍵字**：
  - `停車場` — 各縣市路外停車場
  - `休息站` — 高速公路休息站
  - `服務區` — 高速公路服務區
  - `露營` — 露營區
  - `河濱公園` — 河濱公園停車場

### 2.3 其他可能的政府資料來源

| 資料類型 | 來源單位 | 說明 |
|---------|---------|------|
| 高速公路服務區 | 交通部高速公路局 freeway.gov.tw | 含停車格數、設施資訊，需進一步抓取 |
| 國道服務區即時資訊 | tisvcloud.freeway.gov.tw | TISVCLOUD 雲端服務，需查正確端點 |
| 國家森林遊樂區 | 林務局 recreation.forest.gov.tw | 含部分露營區資訊 |
| 觀光景點停車場 | 交通部觀光署參山國家風景區 trimt-nsa.gov.tw | 有停車場即時狀況 API（/zh-tw/crowd-flow/?type=parking）|
| 國家公園露營 | 內政部營建署 np.cpami.gov.tw | 需進一步調查 |

### 2.4 台北市停車資料欄位範例

```json
{
  "id": "139",
  "area": "士林區",
  "name": "捷運芝山站停車場(北側)",
  "type": "1",
  "summary": "計有30個小型車格",
  "address": "台北市士林區福國路70號",
  "tel": "02-26550818",
  "payex": "小型車全日月租：4,000元/月...",
  "tw97x": "302730.752",
  "tw97y": "2777139.53",
  "totalcar": 30,
  "totalmotor": 0
}
```
> 座標系統為 TWD97，需轉換至 WGS84 供地圖使用

---

## 3. 國外平台功能參考

### 3.1 iOverlander（https://ioverlander.com）

**定位**：全球越野旅者地點分享平台  
**資料量**：涵蓋全球幾乎所有國家，台灣也有少量標記  
**平台特色**：
- ✅ 無商業廣告，旅者主導的地點資料
- ✅ 多元地點分類（不只停車/露營）
- ✅ **離線地圖**（不需網路也能使用）
- ✅ Pro 版支援更多離線地圖下載
- ✅ 社群審核機制（有100位版主，累積審核30,000小時）
- ✅ 強調環境責任（Responsibility Pact）
- ⭐ **地點類型**（涵蓋極廣）：
  - 野營地（Wild camp）
  - 露營場
  - 停車過夜點
  - 水源點
  - 維修廠
  - 超市購物
  - 加油站
  - WiFi 點
  - 淋浴點
  - 洗衣點
  - 醫療
  - 邊境口岸
  - 警告/危險點

**對 WildMap 的啟發**：
- 台灣版可以學習其「旅者共創」模式
- 地點類型應擴展至「澡點」「補給點」等生活需求類別
- 離線功能在台灣山區有重要性

### 3.2 Park4Night（https://park4night.com）

**定位**：歐洲最大自駕露營者地點分享平台  
**主要市場**：歐洲（法語系社群起源，現已多語言）  
**平台特色**：
- ✅ 地點類型豐富（含付費露營地、免費停車點、農場）
- ✅ 有「責任旅行者公約」（The Responsible Traveller's Charter）
- ✅ Park4Night+ 付費訂閱版，解鎖更多功能
- ✅ 地點有用戶評分 + 文字評論
- ✅ 社群氛圍強，有常態露友群體

**對 WildMap 的啟發**：
- 地點評論機制（不用星等，只用文字評論）值得參考
- 付費訂閱模式可作為商業模式參考

### 3.3 Campendium（https://campendium.com）

**定位**：北美 RV（露營車）過夜地點平台，現與 Roadtrippers 整合  
**資料量**：16,000+ 過夜停車地點，50,000+ 露營場  
**平台特色**：
- ✅ 整合 Roadtrippers 路線規劃功能
- ✅ 附帶手機訊號地圖（Cell coverage maps）
- ✅ 公共土地地圖（Public land maps）
- ✅ 廢水傾倒站地圖（Dump site locations）
- ✅ 煙霧地圖（Smoke maps）

**對 WildMap 的啟發**：
- 整合「手機訊號強度」資訊，對台灣山區車宿者有重大實用價值
- 「廢水處理站」概念在台灣可對應「清水站」「廢水處理點」

### 3.4 FreeRoam App

- **URL**：https://freeroam.app（目前 DNS 無法解析，可能已下線或改名）
- **性質**：免費野外停車地點分享 App
- **備註**：可能已停止服務或更名，需進一步確認

### 3.5 其他值得參考的國外平台

| 平台 | URL | 特色 |
|-----|-----|------|
| Freecampsites.net | https://freecampsites.net | 美國免費野營地 |
| WikiCamps | https://wikicamps.com.au | 澳洲最大露營社群 |
| Hipcamp | https://hipcamp.com | 私有土地露營預訂平台 |
| Harvest Hosts | https://harvesthosts.com | 農場/酒莊/博物館過夜 |

---

## 4. 建議的車宿特性標籤（參考國外平台）

### 4.1 地點類型標籤

| 標籤 | 說明 | 參考來源 |
|------|------|---------|
| `野營地` | 非正式的野外停車過夜點 | iOverlander |
| `車宿露營區` | 有收費的露營區，允許車宿 | 台灣本地 |
| `廟宇廣場` | 宮廟停車場，通常有免費廁所 | 98vanlife |
| `海邊停車場` | 臨海停車場，可欣賞海景 | 98vanlife |
| `河濱停車場` | 河濱公園停車場 | 本地研究 |
| `觀光景區停車場` | 國家風景區停車場 | 本地研究 |
| `高速公路服務區` | 國道服務區，24小時設施 | 本地研究 |
| `漁人碼頭` | 漁港停車場 | 98vanlife |
| `農場民宿` | 友善車宿農場，如 Harvest Hosts 概念 | 國外參考 |

### 4.2 設施標籤（Amenity Tags）

| 標籤 | 符號建議 | 說明 |
|------|---------|------|
| `有廁所` | 🚻 | 有公共廁所可使用 |
| `24小時廁所` | 🕐 | 全天候廁所 |
| `有淋浴` | 🚿 | 可洗澡 |
| `有電源` | ⚡ | 可充電 |
| `有水源` | 💧 | 飲用水或洗滌用水 |
| `有Wi-Fi` | 📶 | 可連網 |
| `有垃圾桶` | 🗑️ | 方便處理垃圾 |
| `可開伙` | 🍳 | 允許煮食 |
| `可車邊帳` | ⛺ | 可展開車邊帳 |
| `可車尾帳` | 🚐 | 可展開車尾帳 |
| `有便利商店` | 🏪 | 步行可達超商 |
| `海景` | 🌊 | 可欣賞海景 |
| `山景` | ⛰️ | 可欣賞山景 |
| `夜景` | 🌃 | 有夜景觀賞點 |
| `觀星` | ⭐ | 光害少，適合觀星 |
| `寵物友善` | 🐕 | 允許攜帶寵物 |

### 4.3 實用資訊標籤

| 標籤 | 說明 |
|------|------|
| `免費` | 停車免費 |
| `收費` | 需收費（可記錄費用）|
| `需預約` | 需事先聯繫 |
| `手機訊號` | 4G/5G 訊號強度（弱/中/強）|
| `平整地面` | 地面平整度（利於睡眠）|
| `碎石地` | 碎石鋪面 |
| `草地` | 草地停車 |
| `安全性` | 治安狀況評分 |
| `噪音` | 噪音程度（安靜/普通/吵）|
| `隱蔽性` | 停車隱蔽程度 |

### 4.4 台灣特有分類

| 類型 | 說明 | 例子 |
|------|------|------|
| 宮廟廣場 | 廟宇廣場24小時免費廁所 | 福隆東興宮、東石先天宮 |
| 車床天地特約 | 持車床天地會員卡享優惠 | qaluvu卡魯夫農場、橘園山谷秘境 |
| 台灣車宿聯盟特約 | vanlife.tw 聯盟認證 | vanlife.tw 站點清單 |
| 河濱公園 | 各縣市河濱公園停車場 | 台北華中露營場等 |

---

## 5. 冷啟動策略建議

### 5.1 資料取得優先順序（高→低）

**第一階段：馬上可執行（1-2週）**

1. **抓取 98vanlife.com 所有文章**
   - 目前已有：5個海邊免費車宿點（含GPS座標）
   - 估計可取得：約50-100個結構化地點
   - 方法：用 BeautifulSoup/Scrapy 爬取所有文章，提取地址＋GPS座標
   - 法律風險：⚠️ 低（公開內容，非商業用途，署名原始資料來源）

2. **轉換 車床天地 Google Maps 總圖**
   - URL：`https://www.google.com/maps/d/viewer?mid=1Q3JWYBEf6JQC8M4ei6cEojTesjg`
   - 可透過 KML 匯出功能取得所有地點
   - 方法：`https://www.google.com/maps/d/kml?mid=1Q3JWYBEf6JQC8M4ei6cEojTesjg`
   - 估計資料量：可能有數十到數百個地點
   - 法律風險：⚠️ 中（社群共創內容，需標明來源）

3. **爬取 icamping.tw 車露系列文章**
   - 已知4篇系列文章，估計含20-40個車宿露營區
   - 方法：針對性抓取上述已知 URL
   - 資料類型：有名稱、地址、特色、設施

**第二階段：申請 API 後執行（2-4週）**

4. **申請 TDX API Token**
   - 網址：https://tdx.transportdata.tw
   - 可取得：全台路外停車場、官方露營區
   - 建議重點：`CampingArea`（官方露營區）+ `ParkingLot`（路外停車場）

5. **申請 data.gov.tw API Key**
   - 網址：https://data.gov.tw
   - 搜尋關鍵字：停車場、服務區、休息站、河濱

6. **抓取台北市停車場（免申請）**
   - URL：`https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json`
   - 立即可用，含座標（TWD97 格式，需轉換）

**第三階段：社群經營（4週以後）**

7. **邀請 vanlife.tw 台灣車宿聯盟合作**
   - 提供互利合作：WildMap 幫助曝光，vanlife.tw 提供地點清單

8. **在 FB「車床天地」社團宣傳徵集**
   - 請社群成員協助標記、驗證地點

9. **聯繫 98vanlife 媒體合作**
   - 98vanlife 是主要的車宿媒體，合作可大幅增加可信度

### 5.2 建議的 MVP 資料集

以下資料可組合成 WildMap 第一版地點資料庫：

| 來源 | 預估地點數 | 資料品質 | 獲取難度 |
|------|----------|---------|---------|
| 98vanlife.com 文章 | 50-100 | 高（有GPS） | 低 |
| 車床天地 Google Maps | 50-200+ | 中（待確認） | 低 |
| icamping.tw 車露文章 | 20-40 | 高（有地址）| 低 |
| vanlife.tw 泊點清單 | 未知 | 高 | 中（需登入）|
| TDX 官方露營區 | 200-500 | 中（官方認證）| 中 |
| 台北市停車場 | 1000+ | 高（官方資料）| 低 |

**建議起始目標**：200個高品質車宿點（以社群驗證資料為主），涵蓋北、中、南、東各地區。

### 5.3 關鍵差異化建議

基於研究，台灣目前車宿平台的痛點：

1. **地點散落各處**：FB社團、部落格、Google Maps 各自為政，沒有統一入口
2. **地點資訊不完整**：廁所狀況、廁所24小時與否、有無水源往往需要到現場才知道
3. **更新不即時**：部落格文章可能已過時，廟宇廣場可能已關閉
4. **沒有手機訊號資訊**：台灣山區訊號差，出發前需要知道

**WildMap 差異化機會**：
- ⭐ 即時社群回報（廁所「昨天剛確認可用」）
- ⭐ 標準化設施標籤（廁所/淋浴/電/水/Wi-Fi）
- ⭐ 手機訊號強度資訊
- ⭐ 整合 vanlife.tw 聯盟特約優惠
- ⭐ 離線地圖功能（台灣山區必要）

---

## 附錄：原始資料摘要

### A. iOverlander 地點類型清單（供參考）
根據官網 /features 說明：
- Campgrounds（露營場）
- Wild camps（野地露營）
- Mechanics（維修廠）
- Restaurants（餐廳）
- Hotels（旅館）
- Propane（桶裝瓦斯）
- Water（水源）
- WiFi（網路）
- Shopping（購物）
- Laundry（洗衣）
- Showers（淋浴）
- Doctors（醫療）
- Tourist Attractions（景點）
- Border Crossings（邊境口岸）
- Warnings（警告點）
- Checkpoints（檢查站）
- Insurance（保險）
- Storage（寄存）
- Shipping（托運）
- Consulates（領事館）
- Banks（銀行）

### B. Campendium 功能清單（供參考）
- 16,000+ overnight RV parking locations
- 50,000+ campground maps
- Cell coverage maps（手機訊號地圖）
- Public land maps（公共土地地圖）
- Smoke maps（煙霧地圖）
- Dump site locations（廢水傾倒站）

### C. 台北市停車場 API 資料結構
```
GET https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json
```
欄位：id, area, name, type, summary, address, tel, payex, tw97x, tw97y, totalcar, totalmotor, totalbike, totalbus, Pregnancy_First, Handicap_First

座標轉換：TWD97 → WGS84 需使用 proj4 或相應函式庫

---

*報告完成時間：2026-03-05 04:30 GMT+8*
