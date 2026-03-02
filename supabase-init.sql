CREATE TABLE spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('camping', 'fishing', 'diving', 'surfing', 'hiking', 'carcamp')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read spots" ON spots FOR SELECT USING (true);
CREATE POLICY "Anyone can insert spots" ON spots FOR INSERT WITH CHECK (true);

INSERT INTO spots (name, description, category, latitude, longitude) VALUES
('福隆海水浴場', '東北角熱門衝浪點，夏天人多', 'surfing', 25.0229, 121.9422),
('武陵農場露營區', '高山露營，氣候涼爽，需提早訂位', 'camping', 24.3618, 121.2747),
('碧砂漁港', '基隆熱門釣魚點，有多種魚種', 'fishing', 25.1489, 121.7906);
