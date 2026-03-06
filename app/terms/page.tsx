import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '服務條款 - Wildmap',
  description: 'Wildmap 使用者服務條款：使用本平台前，請詳閱本服務條款。',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo/wildmap-logo.svg" alt="Wildmap" className="w-7 h-7" />
            <span className="text-lg font-bold text-primary-dark">Wildmap</span>
          </Link>
          <Link
            href="/map"
            className="text-sm text-primary hover:text-primary-dark transition-colors no-underline"
          >
            返回地圖
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <h1 className="text-3xl font-extrabold text-text-main mb-2">服務條款</h1>
        <p className="text-sm text-text-secondary mb-8">最後更新日期：2026 年 3 月 6 日</p>

        <div className="prose prose-sm max-w-none text-text-main space-y-8">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">一、總則</h2>
            <p className="leading-relaxed text-text-secondary">
              歡迎使用 Wildmap（以下簡稱「本平台」或「我們」）。本服務條款（以下簡稱「本條款」）構成您（以下簡稱「使用者」或「您」）與本平台之間關於使用本服務的完整協議。當您註冊帳號、登入或以任何方式使用本平台時，即表示您已閱讀、瞭解並同意遵守本條款。如您不同意本條款的任何內容，請勿使用本平台。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">二、服務描述</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              Wildmap 是一個台灣露營等戶外活動地點資訊彙整平台，提供以下服務：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>露營場地地圖瀏覽與搜尋</li>
              <li>地點詳細資訊查看（設施、環境、特性等）</li>
              <li>使用者評論、評分與特性投票</li>
              <li>照片上傳與分享</li>
              <li>收藏與個人化功能</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              本平台為<strong>資訊彙整服務</strong>，非旅行社、旅遊服務業者或露營場營運者。平台上呈現的地點資訊來自政府公開資料、社群回報及使用者投稿，僅供參考，不構成任何推薦或保證。
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">三、帳號註冊與管理</h2>
            <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>您須年滿 7 歲方可註冊使用本平台。未滿 18 歲之使用者，須經法定代理人同意後方可使用。</li>
              <li>您應提供真實、正確的註冊資訊，並於資訊變更時及時更新。</li>
              <li>您有責任妥善保管您的帳號密碼。透過您的帳號進行的所有活動，均視為您本人之行為。</li>
              <li>若您發現帳號遭未授權使用，應立即通知我們。</li>
              <li>我們保留在您違反本條款時，暫停或終止您的帳號的權利。</li>
            </ol>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">四、使用者行為規範</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              使用本平台時，您同意遵守以下規範：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>不得上傳或發布虛假、不實、誤導性的地點資訊或評論。</li>
              <li>不得發布誹謗、侮辱、歧視、仇恨、色情或暴力內容。</li>
              <li>不得侵害他人的著作權、商標權、隱私權或其他合法權益。</li>
              <li>不得上傳含有病毒、惡意程式碼或其他有害內容的檔案。</li>
              <li>不得以自動化方式（如爬蟲、機器人）大量存取或擷取平台內容。</li>
              <li>不得冒充他人身份，包括冒充商家進行認領。</li>
              <li>不得利用本平台從事任何違法活動。</li>
              <li>不得干擾或破壞本平台之正常運作。</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">五、使用者生成內容（UGC）授權</h2>
            <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>
                <strong>著作權歸屬：</strong>您在本平台上傳或發布的所有內容（包括但不限於評論、照片、評分、投票，以下簡稱「使用者內容」），其著作權仍歸您所有。
              </li>
              <li>
                <strong>授權範圍：</strong>您上傳或發布使用者內容時，即授予本平台一項<strong>非專屬、全球性、免授權金、可轉授權</strong>的使用權，得以重製、公開傳輸、改作（包括製作縮圖、裁切、格式轉換等）、散布及以其他方式利用您的使用者內容，以供本平台營運及推廣之用。此授權於您刪除該內容時終止，但因技術原因（如快取或備份）已被複製的內容除外。
              </li>
              <li>
                <strong>內容保證：</strong>您保證您上傳的使用者內容為您本人創作或已取得合法授權，不侵害任何第三人的智慧財產權或其他合法權益。
              </li>
              <li>
                <strong>侵權責任：</strong>若因您上傳的使用者內容致本平台遭受第三人的侵權請求或訴訟，您應負擔本平台因此所生之一切損害及費用。
              </li>
            </ol>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">六、著作權侵權通知與取下機制</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              本平台依據《著作權法》第 90-4 條至第 90-10 條規定，建立通知-取下（Notice and Takedown）機制：
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>
                <strong>侵權通知：</strong>若您認為本平台上有內容侵害您的著作權，請以書面或電子郵件方式通知我們，並提供以下資訊：
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>您的真實姓名、聯繫方式</li>
                  <li>涉嫌侵權內容的具體位置（如網址或截圖）</li>
                  <li>您對涉嫌侵權內容享有著作權的說明及相關證據</li>
                  <li>聲明您係基於善意確信該內容未經授權使用</li>
                  <li>聲明以上資訊真實正確，如有虛偽願負法律責任</li>
                </ul>
              </li>
              <li>
                <strong>處理程序：</strong>我們收到合格的侵權通知後，將於合理時間內移除或限制存取涉嫌侵權之內容，並通知上傳者。
              </li>
              <li>
                <strong>回復通知：</strong>內容上傳者若認為其內容並未侵權，得提出回復通知。我們將於收到回復通知後轉知通知人，若通知人未於 10 個工作天內提起訴訟，我們得恢復該內容。
              </li>
              <li>
                <strong>三振條款：</strong>使用者若經查證有三次以上侵害他人著作權之行為，本平台得終止其帳號之全部或部分服務。
              </li>
            </ol>
            <div className="bg-surface-alt rounded-xl p-4 mt-4 text-text-secondary">
              <p><strong>著作權侵權通知聯繫窗口</strong></p>
              <p>電子郵件：<a href="mailto:copyright@wildmap.tw" className="text-primary hover:text-primary-dark">copyright@wildmap.tw</a></p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">七、商家認證免責</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台上的商家資訊（包括露營場名稱、地址、聯繫方式等）主要來自政府公開資料及使用者提供。即使某些商家已通過本平台的「認領」驗證程序，該驗證僅表示商家身份經初步確認，<strong>不構成本平台對該商家之背書、推薦或保證</strong>。您在與任何商家交易前，應自行評估其可靠性。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">八、免責聲明</h2>
            <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>本平台上的地點資訊僅供參考，<strong>不構成任何推薦、保證或建議</strong>。</li>
              <li>本平台上呈現的地點包含「合法登記」、「未登記」及「社群回報」等不同類別，使用者在前往任何地點前，應自行確認該地點的合法性及安全性。</li>
              <li>本平台不保證任何資訊的正確性、完整性或即時性。</li>
              <li>您使用本平台資訊所做的任何決定，均由您自行承擔風險。</li>
              <li>本平台不對您因使用或信賴平台資訊而遭受的任何損害負責。</li>
            </ol>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">九、服務變更與終止</h2>
            <ol className="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>我們保留隨時修改、暫停或終止本平台全部或部分服務的權利，恕不另行個別通知。</li>
              <li>我們保留隨時修訂本條款的權利。修訂後的條款將公告於本頁面。您在修訂後繼續使用本平台，即視為同意修訂後之條款。</li>
              <li>若有重大變更，我們將透過電子郵件或平台公告方式通知您。</li>
            </ol>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十、智慧財產權</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台的整體設計、程式碼、商標、標誌及其他內容（不含使用者內容）之智慧財產權，均屬本平台所有或經合法授權使用。未經我們書面同意，您不得複製、修改、散布或以其他方式使用上述內容。
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十一、準據法與管轄法院</h2>
            <p className="leading-relaxed text-text-secondary">
              本條款以中華民國法律為準據法。因本條款所生之爭議，以台灣台北地方法院為第一審管轄法院。
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十二、聯繫方式</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              如您對本服務條款有任何疑問，請透過以下方式聯繫我們：
            </p>
            <div className="bg-surface-alt rounded-xl p-4 text-text-secondary">
              <p><strong>Wildmap 團隊</strong></p>
              <p>電子郵件：<a href="mailto:contact@wildmap.tw" className="text-primary hover:text-primary-dark">contact@wildmap.tw</a></p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-border flex items-center gap-4 text-sm text-text-secondary">
          <Link href="/privacy" className="hover:text-primary transition-colors no-underline">隱私權政策</Link>
          <span>|</span>
          <Link href="/disclaimer" className="hover:text-primary transition-colors no-underline">免責聲明</Link>
          <span>|</span>
          <Link href="/" className="hover:text-primary transition-colors no-underline">回首頁</Link>
        </div>
      </main>
    </div>
  )
}
