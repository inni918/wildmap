-- 清除 description 中的合法/未登記標籤文字
-- 把「XX縣XX鄉 — 政府合法登記露營場」和「XX縣XX鄉 — 未登記露營場」清掉
UPDATE spots SET description = NULL
WHERE description LIKE '%政府合法登記露營場%'
   OR description LIKE '%未登記露營場%';
