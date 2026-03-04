# Wildmap — 完整用戶流程圖

> 使用 Mermaid 語法，可在 GitHub 直接渲染。

---

## A. 認證流程

### A1. Email 註冊 → 登入 → 忘記密碼

```mermaid
flowchart TD
    Start([用戶進入平台]) --> HasAccount{有帳號？}

    HasAccount -->|否| Register[點擊「註冊」Tab]
    Register --> FillReg[填寫：顯示名稱 + Email + 密碼 + 確認密碼]
    FillReg --> ValidReg{表單驗證}
    ValidReg -->|名稱為空| ErrName[❌ 請輸入顯示名稱]
    ValidReg -->|密碼 < 6 字| ErrPwd[❌ 密碼至少需要 6 個字元]
    ValidReg -->|密碼不一致| ErrMatch[❌ 密碼不一致]
    ValidReg -->|Email 已註冊| ErrDup[❌ 此 Email 已註冊]
    ValidReg -->|通過| SubmitReg[送出註冊]
    ErrName --> FillReg
    ErrPwd --> FillReg
    ErrMatch --> FillReg
    ErrDup --> FillReg
    SubmitReg --> RegSuccess[✅ 註冊成功，導向首頁]

    HasAccount -->|是| Login[點擊「登入」Tab]
    Login --> FillLogin[填寫：Email + 密碼]
    FillLogin --> ValidLogin{驗證}
    ValidLogin -->|帳號密碼錯誤| ErrLogin[❌ 登入失敗]
    ValidLogin -->|成功| LoginSuccess[✅ 登入成功，導向首頁]
    ErrLogin --> FillLogin

    FillLogin --> Forgot[點擊「忘記密碼？」]
    Forgot --> ForgotPage[/forgot-password 頁面]
    ForgotPage --> FillEmail[填寫 Email]
    FillEmail --> SendReset[寄送重設密碼信]
    SendReset --> CheckInbox[📧 提示用戶檢查信箱]
    CheckInbox --> BackLogin[返回登入頁]
```

### A2. Google OAuth 登入

```mermaid
flowchart TD
    Start([用戶點擊「使用 Google 帳號繼續」]) --> Redirect[跳轉至 Google 授權頁]
    Redirect --> Auth{Google 授權}
    Auth -->|拒絕| Cancel[返回登入頁]
    Auth -->|同意| Callback[/auth/callback 處理回調]
    Callback --> Exchange[exchangeCodeForSession]
    Exchange --> IsNew{第一次登入？}
    IsNew -->|是| CreateProfile[自動建立 users profile<br/>display_name = Google 名稱<br/>avatar_url = Google 頭像<br/>level = 1, points = 0]
    IsNew -->|否| Skip[略過]
    CreateProfile --> Home[✅ 導向首頁]
    Skip --> Home
```

### A3. 手機登入（未來）

```mermaid
flowchart TD
    Start([用戶點擊「使用手機號碼登入」]) --> Toast[⚠️ Toast：手機登入功能即將推出]

    subgraph 未來規劃
        Phone[輸入手機號碼] --> SendOTP[發送 OTP 簡訊]
        SendOTP --> InputOTP[輸入驗證碼]
        InputOTP --> Verify{驗證}
        Verify -->|成功| Success[✅ 登入成功]
        Verify -->|失敗| Retry[重新輸入]
    end
```

### A4. 登出

```mermaid
flowchart TD
    Start([用戶點擊頭像]) --> Menu[展開下拉選單]
    Menu --> Logout[點擊「登出」]
    Logout --> ClearSession[清除 Session]
    ClearSession --> Home[返回首頁（未登入狀態）]
```

---

## B. 地圖瀏覽流程

### B1. 首頁地圖 → 篩選 → 點地標 → 看詳情

```mermaid
flowchart TD
    Start([進入首頁]) --> LoadMap[載入地圖<br/>初始：台灣全島<br/>lng=121.0 lat=23.8 zoom=7]
    LoadMap --> FetchSpots[從 Supabase 載入所有地標]
    FetchSpots --> ShowMarkers[地圖上顯示 emoji 標記]
    ShowMarkers --> UserAction{用戶操作}

    UserAction -->|拖曳/縮放| MoveMap[更新地圖視角]
    MoveMap --> UserAction

    UserAction -->|點擊分類篩選| CatFilter[選擇類型：<br/>全部/露營/車宿/釣魚/潛水/衝浪/登山]
    CatFilter --> FilterResult[篩選地標，更新地圖標記]
    FilterResult --> ShowCount[Header 顯示：N 個地點]
    ShowCount --> UserAction

    UserAction -->|點擊特性篩選| FeaturePanel[展開特性篩選面板]
    FeaturePanel --> SelectFeatures[選擇特性<br/>六大類別/多選]
    SelectFeatures --> QueryVotes[查詢 feature_votes<br/>計算 ≥60% 的 spot_ids]
    QueryVotes --> IntersectFilter[取交集：所有選中特性都滿足]
    IntersectFilter --> FilterResult

    UserAction -->|點擊地標 emoji| ShowPopup[彈出 Popup 卡片]
    ShowPopup --> PopupContent[顯示：<br/>📍 名稱 + 類型 + 品質標籤<br/>📝 描述<br/>🧭 經緯度<br/>💰 免費/付費]
    PopupContent --> ClickDetail{點擊「查看特性詳情 →」}
    ClickDetail --> OpenDetail[開啟 SpotDetail 底部面板]

    OpenDetail --> DetailView[特性一覽 Tab]
    DetailView --> ShowFeatureGroups[分類顯示已確認特性<br/>六色 icon + 確認人數]

    OpenDetail --> VoteTab[投票特性 Tab]
    VoteTab --> IsLoggedIn{已登入？}
    IsLoggedIn -->|否| LockMsg[🔒 顯示「登入後即可投票」]
    IsLoggedIn -->|是| ShowVoting[顯示所有可投票特性<br/>✅有 / ❌沒有]
```

### B2. 特性篩選細節

```mermaid
flowchart TD
    Start([點擊「▸ 特性篩選」]) --> Expand[展開篩選面板]
    Expand --> ShowGroups[顯示六大類別：<br/>🔴 營地特性<br/>🟢 營區設施<br/>🟩 周邊環境<br/>🔵 可進行活動<br/>🟣 區域限制<br/>🟤 注意事項]
    ShowGroups --> ClickFeature[點擊特性 Tag]
    ClickFeature --> Toggle{已選取？}
    Toggle -->|是| Deselect[取消選取]
    Toggle -->|否| Select[選取（亮綠色）]
    Select --> Badge[篩選按鈕顯示數字徽章]
    Badge --> HasSelected{有選取特性？}
    HasSelected -->|是| ShowClear[顯示「清除全部」按鈕]
    HasSelected -->|否| HideClear[隱藏「清除全部」]
    ShowClear --> QueryDB[查詢 feature_votes 並篩選]
    HideClear --> ShowAll[顯示所有地標]
```

---

## C. 地標管理流程

### C1. 新增地標

```mermaid
flowchart TD
    Start([用戶點擊地圖空白處]) --> IsLoggedIn{已登入？}
    IsLoggedIn -->|否| LoginPrompt[顯示登入提示<br/>🔒 需要登入<br/>「使用 Google 登入」按鈕]
    LoginPrompt --> GoogleLogin[Google 快速登入]
    GoogleLogin --> ReturnModal[返回新增流程]

    IsLoggedIn -->|是| OpenModal[開啟 AddSpotModal<br/>顯示點擊位置經緯度]
    ReturnModal --> OpenModal

    OpenModal --> SelectCategory[選擇地點類型<br/>🏕️露營 🚐車宿 🎣釣魚<br/>🤿潛水 🏄衝浪 🏔️登山]
    SelectCategory --> FillName[填寫地點名稱 *必填]
    FillName --> FillOptional[填寫選填資訊：<br/>簡介、地址、電話、社群連結]
    FillOptional --> Submit{送出}

    Submit -->|名稱為空| ErrEmpty[❌ 請輸入地點名稱]
    ErrEmpty --> FillName
    Submit -->|成功| InsertDB[寫入 Supabase spots 表]
    InsertDB --> RefreshMap[重新載入地標]
    RefreshMap --> CloseModal[關閉 Modal]
    Submit -->|失敗| ErrInsert[❌ 新增失敗，請再試一次]
    ErrInsert --> FillOptional
```

### C2. 編輯地標（中期）

```mermaid
flowchart TD
    Start([用戶在地標詳情點擊「編輯」]) --> CheckLevel{用戶等級 ≥ Lv3？}
    CheckLevel -->|否| Deny[❌ 需要 Lv3 以上才能編輯]
    CheckLevel -->|是| IsOwner{是地標創建者<br/>或商家擁有者？}

    IsOwner -->|是| DirectEdit[直接編輯]
    IsOwner -->|否| SuggestEdit[提交編輯建議]

    DirectEdit --> EditForm[編輯表單：<br/>名稱、描述、地址、類型等]
    EditForm --> SaveDirect[直接儲存]
    SaveDirect --> RecordHistory[記錄 spot_edits 版本歷史]
    RecordHistory --> Success[✅ 編輯成功]

    SuggestEdit --> EditForm2[編輯表單 + 修改說明]
    EditForm2 --> SubmitSuggestion[提交建議]
    SubmitSuggestion --> PendingReview[狀態：pending<br/>等待管理員審核]
    PendingReview --> ReviewResult{審核結果}
    ReviewResult -->|核准| Adopted[✅ 建議被採納<br/>+10 積分]
    ReviewResult -->|駁回| Rejected[❌ 建議被駁回<br/>通知用戶原因]
```

### C3. 地標生命週期

```mermaid
stateDiagram-v2
    [*] --> 新建 : 用戶建立

    新建 --> 已發布 : Lv3+ 用戶直接發布
    新建 --> 待審核 : Lv1~Lv2 需 Lv3+ 確認

    待審核 --> 已發布 : Lv3+ 用戶確認
    待審核 --> 已拒絕 : 審核不通過

    已發布 --> 隱藏審核中 : 累積 3+ 同類檢舉
    已發布 --> 待驗證 : 6 個月無更新
    已發布 --> 已關閉 : 確認永久關閉

    隱藏審核中 --> 已發布 : 審核：維持
    隱藏審核中 --> 已發布 : 審核：修正後恢復
    隱藏審核中 --> 已關閉 : 審核：確認關閉

    待驗證 --> 已發布 : 有用戶更新/留言
    待驗證 --> 已關閉 : 確認已關閉

    已關閉 --> [*] : 灰色顯示，保留歷史

    note right of 已關閉 : 永不真正刪除（soft delete）
    note right of 待驗證 : 標記「資料可能過時」
```

---

## D. 特性投票流程

### D1. 投票特性

```mermaid
flowchart TD
    Start([進入地標詳情頁]) --> SeeFeatures[查看「特性一覽」Tab<br/>顯示已確認特性]
    SeeFeatures --> ClickVote[切換至「投票特性」Tab]
    ClickVote --> LoggedIn{已登入？}

    LoggedIn -->|否| Lock[🔒 登入後即可投票]
    LoggedIn -->|是| ShowAll[顯示所有適用特性<br/>依六大類別分組]

    ShowAll --> ChooseFeature[選擇一項特性]
    ChooseFeature --> HasVoted{已投過？}
    HasVoted -->|是| ShowMyVote[顯示我的投票 + 目前結果<br/>可以改票]
    HasVoted -->|否| Vote{投票}

    Vote -->|✅ 有| VoteYes[記錄 vote=true]
    Vote -->|❌ 沒有| VoteNo[記錄 vote=false]

    VoteYes --> UpdateDB[寫入 feature_votes<br/>UNIQUE spot_id + feature_id + user_id]
    VoteNo --> UpdateDB
    UpdateDB --> AddPoints[+2 積分]
    AddPoints --> Refresh[重新計算投票結果]
    Refresh --> DisplayLogic{投票比例}

    DisplayLogic -->|有票 ≥ 60%| ShowConfirmed[✅ 顯示為已確認]
    DisplayLogic -->|總票數 < 3| ShowPending[❓ 顯示為待確認]
    DisplayLogic -->|否則| Hide[不顯示]
```

### D2. 回報錯誤特性

```mermaid
flowchart TD
    Start([用戶在特性一覽中看到錯誤特性]) --> ClickReport[點擊「回報不正確」]
    ClickReport --> SelectFeature[從已有特性中選擇「不正確」的項目]
    SelectFeature --> VoteNo[投票 ❌ 沒有]
    VoteNo --> CalcRatio{回報比例}

    CalcRatio -->|≥ 30% 且 ≥ 3 人| MarkSuspect[標記 ❓ 存疑]
    CalcRatio -->|≥ 60%| AutoHide[⚠️ 自動隱藏該特性]
    CalcRatio -->|< 30%| NoAction[維持現狀]

    AutoHide --> DeductPoints[原投票者積分：全額扣回<br/>不倒扣]
    MarkSuspect --> ShowWarning[特性顯示存疑標記 ❓]
```

---

## E. 用戶互動流程（MVP-B）

### E1. 評分

```mermaid
flowchart TD
    Start([進入地標詳情 → 評分區]) --> LoggedIn{已登入？}
    LoggedIn -->|否| Lock[🔒 登入後才能評分]
    LoggedIn -->|是| HasRated{已評過？}

    HasRated -->|是| ShowMyRating[顯示我的評分<br/>可修改]
    HasRated -->|否| SelectStars[選擇 1-5 星]

    SelectStars --> Submit[送出評分]
    ShowMyRating --> ChangeStars[修改星等]
    ChangeStars --> Submit

    Submit --> UpdateDB[寫入/更新 ratings<br/>UNIQUE spot_id + user_id]
    UpdateDB --> RecalcAvg[重新計算平均評分]
    RecalcAvg --> ShowResult[顯示：⭐ 4.2（52 人評分）]
```

### E2. 留言

```mermaid
flowchart TD
    Start([進入地標詳情 → 留言區]) --> ShowComments[顯示留言列表<br/>最新在前]
    ShowComments --> LoggedIn{已登入？}

    LoggedIn -->|否| ReadOnly[只能閱讀留言]
    LoggedIn -->|是| WriteComment[輸入留言]

    WriteComment --> Validate{驗證}
    Validate -->|空白| ErrEmpty[❌ 請輸入留言內容]
    Validate -->|通過| CheckNewUser{新帳號 24h 內？}

    CheckNewUser -->|是，已留言 5 則| ErrLimit[⚠️ 新帳號每日留言上限 5 則]
    CheckNewUser -->|否 or 未達上限| Submit[送出留言]

    Submit --> InsertDB[寫入 comments 表]
    InsertDB --> AddPoints{留言字數}
    AddPoints -->|≥ 200 字| Points10[+5 +5 = 10 積分]
    AddPoints -->|< 200 字| Points5[+5 積分]

    ShowComments --> CheckIn{有 GPS 打卡？}
    CheckIn -->|是| VerifiedBadge[留言標記 ✅ 已到訪]
```

### E3. 上傳照片（= 打卡）

```mermaid
flowchart TD
    Start([進入地標詳情 → 照片區]) --> ShowPhotos[顯示照片 Grid]
    ShowPhotos --> LoggedIn{已登入？}

    LoggedIn -->|否| ViewOnly[只能瀏覽照片]
    LoggedIn -->|是| CheckLevel{Lv2+ ？}

    CheckLevel -->|否| LevelLock[❌ 需 Lv2 才能上傳照片]
    CheckLevel -->|是| Upload[點擊上傳按鈕]

    Upload --> SelectPhoto[選擇照片]
    SelectPhoto --> AddCaption[輸入說明文字（選填）]
    AddCaption --> UploadStorage[上傳至 Supabase Storage]
    UploadStorage --> InsertDB[寫入 spot_images 表]
    InsertDB --> AddPoints[+5 積分]
    AddPoints --> RefreshGrid[刷新照片 Grid]
```

### E4. 撰寫遊記（中期）

```mermaid
flowchart TD
    Start([地標詳情 → 點擊「撰寫遊記」]) --> CheckLevel{Lv2+ ？}
    CheckLevel -->|否| Deny[❌ 需 Lv2 才能撰寫遊記]
    CheckLevel -->|是| Editor[Markdown 編輯器]

    Editor --> FillTitle[填寫標題]
    FillTitle --> WriteContent[撰寫內容<br/>支援 Markdown + 插入照片]
    WriteContent --> Preview[預覽]
    Preview --> Submit[送出]

    Submit --> InsertDB[寫入 trip_reports 表]
    InsertDB --> AddPoints[+15 積分]
    AddPoints --> Published[✅ 遊記發布]
```

### E5. 收藏地標（中期）

```mermaid
flowchart TD
    Start([地標 Popup 或詳情頁]) --> ClickFav[點擊 ❤️ 收藏]
    ClickFav --> LoggedIn{已登入？}

    LoggedIn -->|否| Lock[🔒 登入後才能收藏]
    LoggedIn -->|是| IsFaved{已收藏？}

    IsFaved -->|是| Remove[取消收藏]
    IsFaved -->|否| Add[加入收藏]

    Add --> InsertDB[寫入 favorites 表<br/>UNIQUE user_id + spot_id]
    Remove --> DeleteDB[刪除 favorites 記錄]

    InsertDB --> Toast[❤️ 已收藏]
    DeleteDB --> Toast2[已取消收藏]
```

---

## F. 個人頁面流程

### F1. 查看個人頁面

```mermaid
flowchart TD
    Start([點擊頭像 → 個人頁面]) --> LoadProfile[載入用戶資料]
    LoadProfile --> ShowInfo[顯示：<br/>👤 頭像 + 暱稱<br/>⭐ 等級 Lv.X + 積分<br/>📊 積分進度條<br/>📅 加入日期]

    ShowInfo --> Tabs{切換 Tab}

    Tabs -->|成就| Achievements[成就徽章展示<br/>已解鎖 / 未解鎖<br/>四大類別：探索/貢獻/社群/特殊<br/>銅/銀/金框]
    Tabs -->|動態| Activities[活動動態牆<br/>到訪/新增地標/上傳照片/寫遊記]
    Tabs -->|統計| Stats[分類統計<br/>🏕️ 露營 Lv2 · 80分<br/>🎣 釣魚 Lv1 · 20分<br/>...]
    Tabs -->|收藏| FavList[收藏地標列表]
```

### F2. 追蹤其他用戶（中期）

```mermaid
flowchart TD
    Start([查看其他用戶頁面 /user/id]) --> ShowProfile[顯示用戶資料 + 公開成就]
    ShowProfile --> LoggedIn{已登入？}

    LoggedIn -->|否| ViewOnly[只能查看]
    LoggedIn -->|是| FollowBtn[顯示「追蹤」按鈕]

    FollowBtn --> Click[點擊追蹤]
    Click --> IsFollowing{已追蹤？}
    IsFollowing -->|否| Follow[追蹤<br/>寫入 follows 表]
    IsFollowing -->|是| Unfollow[取消追蹤<br/>刪除 follows 記錄]

    Follow --> Notify[📬 通知被追蹤者]
```

---

## G. 商家流程（遠期）

### G1. 聲明擁有權

```mermaid
flowchart TD
    Start([商家發現自己的營地已在 Wildmap]) --> ClickClaim[點擊「聲明擁有權」]
    ClickClaim --> LoggedIn{已登入？}

    LoggedIn -->|否| LoginFirst[先登入]
    LoggedIn -->|是| FillClaim[填寫聲明表單]

    FillClaim --> UploadProof[上傳營業登記證明]
    UploadProof --> Submit[送出聲明]
    Submit --> Pending[狀態：pending<br/>等待管理員審核]

    Pending --> Review{管理員審核}
    Review -->|核准| Approved[✅ 商家認證通過<br/>claimed_by = user_id<br/>role = business]
    Review -->|駁回| Rejected[❌ 認證被駁回<br/>通知原因]

    Approved --> OriginalCreator[原創建者獲得貢獻分數]
    Approved --> BusinessDashboard[進入商家管理面板]
```

### G2. 商家訂閱

```mermaid
flowchart TD
    Start([商家管理面板]) --> ViewPlans[查看訂閱方案]

    ViewPlans --> Free[免費方案<br/>✅ 編輯基本資訊<br/>✅ 回覆評論<br/>✅ 基本數據]
    ViewPlans --> Basic[基礎方案 💰<br/>+ 發公告<br/>+ 促銷活動<br/>+ 進階數據<br/>+ 照片置頂]
    ViewPlans --> Pro[專業方案 💰💰<br/>+ 訂房系統<br/>+ 營位管理<br/>+ 推播通知<br/>+ 首頁推薦]

    Basic --> Payment[線上付款]
    Pro --> Payment
    Payment --> Activate[啟用訂閱<br/>寫入 business_subscriptions]
    Activate --> UnlockFeatures[解鎖對應功能]
```

### G3. 訂房系統（遠期）

```mermaid
flowchart TD
    Start([用戶進入營地詳情]) --> HasBooking{營地有開放訂房？}
    HasBooking -->|否| NoBooking[無訂房功能]
    HasBooking -->|是| ViewCalendar[查看可訂日期]

    ViewCalendar --> SelectDate[選擇日期]
    SelectDate --> SelectSite[選擇營位]
    SelectSite --> FillInfo[填寫訂房資訊<br/>人數、需求等]
    FillInfo --> Confirm[確認訂單]
    Confirm --> Payment[線上付款]
    Payment --> BookingSuccess[✅ 訂房成功<br/>📬 通知商家 + 用戶]
```

---

## H. 管理員流程

### H1. 處理檢舉

```mermaid
flowchart TD
    Start([管理員進入 /admin/reports]) --> LoadQueue[載入檢舉佇列]
    LoadQueue --> ShowList[顯示待處理檢舉列表<br/>按時間排序]
    ShowList --> SelectReport[選擇一則檢舉]

    SelectReport --> ViewDetail[查看檢舉詳情：<br/>📋 檢舉類型<br/>📝 檢舉描述<br/>🎯 被檢舉對象<br/>👤 檢舉者]

    ViewDetail --> Action{處理決定}
    Action -->|維持| Dismiss[駁回檢舉<br/>status = dismissed]
    Action -->|修正| Fix[修正內容<br/>status = resolved]
    Action -->|刪除| Remove[隱藏/刪除內容<br/>status = resolved]

    Fix --> NotifyReporter[📬 通知檢舉者：已處理]
    Remove --> NotifyReporter
    Remove --> NotifyOwner[📬 通知內容擁有者：被移除]
    Dismiss --> NotifyReporter

    NotifyReporter --> AddReporterPoints[檢舉被確認有效 +5 積分]
```

### H2. 審核商家認證

```mermaid
flowchart TD
    Start([管理員進入 /admin/business]) --> LoadClaims[載入待審核聲明]
    LoadClaims --> ShowList[顯示聲明列表]
    ShowList --> SelectClaim[選擇一則聲明]

    SelectClaim --> ViewProof[查看：<br/>📄 營業登記證明<br/>🏕️ 對應地標<br/>👤 申請者]

    ViewProof --> Decision{審核決定}
    Decision -->|核准| Approve[✅ 核准<br/>claimed_by = user_id<br/>user.role = business]
    Decision -->|駁回| Reject[❌ 駁回<br/>填寫原因]

    Approve --> NotifyBusiness[📬 通知商家]
    Reject --> NotifyBusiness
```

### H3. 管理用戶

```mermaid
flowchart TD
    Start([管理員進入 /admin/users]) --> SearchUser[搜尋用戶<br/>Email / 暱稱 / ID]
    SearchUser --> ViewUser[查看用戶詳情：<br/>等級、積分、活動紀錄]
    ViewUser --> Action{管理操作}

    Action -->|警告| SendWarning[📬 發送警告通知]
    Action -->|封鎖| BlockUser[封鎖帳號<br/>積分歸零]
    Action -->|解鎖| UnblockUser[解除封鎖]
    Action -->|調整等級| ChangeLevel[手動調整等級/積分]
```

---

## I. 全域流程：自動化規則

```mermaid
flowchart TD
    subgraph 防弊系統
        NewAccount[新帳號 24h 內] --> Limit[限制：最多 2 個地標 + 5 則留言]
        SameIP[同 IP 大量新增] --> AutoFlag[自動標記審核]
        ExtremeRating[連續全 1 星或全 5 星] --> Filter[極端評分過濾]
        DailyPoints[每日積分] --> Cap[上限 100 分]
    end

    subgraph 自動升級
        Points[積分累積] --> Check{檢查等級}
        Check -->|≥ 50| Lv2[升級 Lv2 開拓者]
        Check -->|≥ 200| Lv3[升級 Lv3 嚮導]
        Check -->|≥ 500| Lv4[升級 Lv4 守護者]
        Check -->|≥ 1000| Lv5[升級 Lv5 先驅者]
    end

    subgraph 地標品質自動升級
        NewSpot[🟡 新建] -->|3+ 人投票| Verified[🟢 社群驗證<br/>投票者各 +5 分]
        Verified -->|10+ 人驗證 + 照片 + 評分| Featured[⭐ 精選<br/>創建者 +30 分]
    end

    subgraph 檢舉自動化
        Reports[同地標累積 3 則同類檢舉] --> AutoHide[自動隱藏<br/>進入審核佇列]
    end
```

---

*最後更新：2026-03-04*
