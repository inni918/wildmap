-- 017: 為所有有經緯度的 spots 自動補上 Google Maps URL
-- 格式：https://www.google.com/maps?q={lat},{lng}

UPDATE spots
SET google_maps_url = 'https://www.google.com/maps?q=' || latitude || ',' || longitude
WHERE google_maps_url IS NULL
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL;
