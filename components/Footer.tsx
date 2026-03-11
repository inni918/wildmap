export default function Footer() {
  return (
    <footer
      style={{
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 1.6,
      }}
    >
      <p>Wildmap 地圖資訊由社群貢獻，僅供參考。</p>
      <p>露營活動請注意安全，本平台不對行程安全負責。</p>
      <p>部分場地可能未經政府合法登記，請自行確認。</p>
      <p style={{ marginTop: 4 }}>© 2026 Wildmap</p>
    </footer>
  )
}
