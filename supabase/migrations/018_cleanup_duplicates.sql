-- 清除重複 + 測試資料
DELETE FROM spots WHERE id = '2abfc22b-6bef-4bf6-8f4f-a16380941a81'; -- 1234 (test data)
DELETE FROM spots WHERE id = 'eb45f0de-b14b-436c-be45-7dbb79481c5b'; -- 1234 (test data)
DELETE FROM spots WHERE id = '9a57b958-f37f-4b69-a410-572f6141a33a'; -- 大樹下露營區 (dup, keeping certified)
DELETE FROM spots WHERE id = '980606f3-65d0-4b50-bfab-3911b8c7dca9'; -- 山頂動人 (dup, keeping first)
DELETE FROM spots WHERE id = 'bf1e33ed-1800-4465-ae66-ce4665778f6b'; -- 左岸民宿露營區 (dup, keeping first)
DELETE FROM spots WHERE id = '75e8560c-e620-439b-8616-b18177f29000'; -- 星空幽谷休閒露營農莊 (dup, keeping certified)
DELETE FROM spots WHERE id = '90f839f1-6e1a-4e9c-ba5b-66d6d4974c81'; -- 梅花湖休閒農場 (dup, keeping certified)
-- 共刪除 7 筆
DELETE FROM spots WHERE id = 'b4800bd7-6326-42cf-a004-3f795263a2ce'; -- 河畔露營區 (dup, keeping first)
DELETE FROM spots WHERE id = '41badff3-fbac-4ae8-9b65-301a9c13e0c6'; -- 湖櫻養生休閒農場 (dup, keeping certified)
DELETE FROM spots WHERE id = '977f408f-13f6-40fb-a0fd-592e9a119ad2'; -- 烏巴克藝術空間 (dup, keeping certified)
DELETE FROM spots WHERE id = 'a7dcbeba-9503-474f-845e-d036c939aba3'; -- 福濃休閒農場露營區 (dup, keeping certified)
DELETE FROM spots WHERE id = '74f5606c-eaa3-46a6-8b02-7e6b0893066c'; -- 蘋果農莊 (dup, keeping certified)
DELETE FROM spots WHERE id = '6f0da712-ad3e-45bb-8c75-d79de7e412c1'; -- 裡冷溪探索園區 (dup, keeping certified)
DELETE FROM spots WHERE id = '6828825e-85d8-4304-a819-70e62a525e09'; -- 輕風椰林露營區 (dup, keeping certified)
DELETE FROM spots WHERE id = '969d2bb2-bf4a-45d5-8f58-c2270f906183'; -- 飛牛牧場休閒農場 (dup, keeping certified)
DELETE FROM spots WHERE id = 'c65eefa7-eb38-49e4-b65b-c3810d5fb956'; -- 食水窩露營區 (dup, keeping first)
-- 共補充刪除 9 筆
