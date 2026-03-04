-- Migration 026: 從露營趣補充海拔資料
-- 來源: https://www.camptrip.com.tw
-- 日期: 2026-03-05
-- 只更新目前海拔為 NULL 的營地

-- 奎輝營地 (來自露營趣: 奎輝營地)
UPDATE spots SET elevation = 390 WHERE id = '5ee4319b-0cc6-48c1-b020-36ebd1738456' AND elevation IS NULL;
-- 南庄麒麟山露營區 (來自露營趣: 南庄麒麟山露營區)
UPDATE spots SET elevation = 400 WHERE id = '3923dfb6-1f55-4d81-9bd0-dc610a9087da' AND elevation IS NULL;
-- 天際線茶園營地 (來自露營趣: 天際線茶園營地)
UPDATE spots SET elevation = 350 WHERE id = '106b1bed-34f6-4aa5-bfb6-2400bdcad2c3' AND elevation IS NULL;
-- 函館露營區 (來自露營趣: 函館露營區)
UPDATE spots SET elevation = 1000 WHERE id = 'd78186c0-23a2-469d-b6a2-97d8f91e53db' AND elevation IS NULL;
-- 拉拉山芘雅尚露營區 (來自露營趣: 拉拉山芘雅尚露營區)
UPDATE spots SET elevation = 1200 WHERE id = '67c345cc-0bae-4088-b7ff-f75752bd3fad' AND elevation IS NULL;
-- 比該溪生態露營區 (來自露營趣: 比該溪生態露營區)
UPDATE spots SET elevation = 1000 WHERE id = '6fea5b5d-6302-4cb5-8a4a-68a908d8ad41' AND elevation IS NULL;
-- 樂窩露營區 (來自露營趣: 樂窩露營區)
UPDATE spots SET elevation = 200 WHERE id = '0a9eb031-cb70-4ebd-9630-1a78ee6a6bc1' AND elevation IS NULL;
-- 大山拾光露營地 (來自露營趣: 大山拾光露營地)
UPDATE spots SET elevation = 300 WHERE id = 'c927317d-57e0-4b19-9b4c-ad8dd0187e85' AND elevation IS NULL;
-- 亞霧香草營區 (來自露營趣: 亞霧香草營區)
UPDATE spots SET elevation = 650 WHERE id = '596361b2-afcb-4eba-915b-22e89411f7a0' AND elevation IS NULL;
-- 山林野地露營區 (來自露營趣: 山林野地露營區)
UPDATE spots SET elevation = 450 WHERE id = '764ff180-9bde-4fc1-bc12-987cbdb021a3' AND elevation IS NULL;
-- 悅日松林 (來自露營趣: 悅日松林)
UPDATE spots SET elevation = 950 WHERE id = '99d90794-04c1-4bb2-9602-c83f81bc50ea' AND elevation IS NULL;
-- 拾階莊園 (來自露營趣: 拾階莊園)
UPDATE spots SET elevation = 200 WHERE id = 'ad70ee60-460d-4157-bf1b-e88c70cb6f6e' AND elevation IS NULL;
-- 流霞谷親水烤肉園區 (來自露營趣: 流霞谷親水烤肉園區)
UPDATE spots SET elevation = 700 WHERE id = '2326c713-dab2-4ee2-a187-72430bf6066b' AND elevation IS NULL;
-- 木村的家露營區 (來自露營趣: 木村的家露營區)
UPDATE spots SET elevation = 1400 WHERE id = '49020019-dec6-458a-8903-9c62bc1c44f2' AND elevation IS NULL;
-- 木偶精靈休閒農莊 (來自露營趣: 木偶精靈休閒農莊)
UPDATE spots SET elevation = 300 WHERE id = 'cc95bda5-dc1f-427c-ab59-2176a804aee1' AND elevation IS NULL;