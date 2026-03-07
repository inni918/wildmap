import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '隱私權政策 - Wildmap',
  description: 'Wildmap 隱私權政策：了解我們如何蒐集、處理及保護您的個人資料。',
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-extrabold text-text-main mb-2">隱私權政策</h1>
        <p className="text-sm text-text-secondary mb-8">最後更新日期：2026 年 3 月 6 日</p>

        <div className="prose prose-sm max-w-none text-text-main space-y-8">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">一、前言</h2>
            <p className="leading-relaxed text-text-secondary">
              Wildmap（以下簡稱「本平台」或「我們」）致力於保護您的個人資料。本隱私權政策依據《中華民國個人資料保護法》（以下簡稱「個資法」）及相關法令制定，說明我們如何蒐集、處理、利用及保護您的個人資料。當您註冊帳號或使用本平台服務時，即表示您已閱讀、瞭解並同意接受本隱私權政策的所有條款。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">二、蒐集的個人資料類別</h2>
            <p className="leading-relaxed text-text-secondary mb-4">
              依據個資法第 8 條規定，我們在此告知您，本平台可能蒐集以下類別的個人資料：
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-surface-alt">
                    <th className="text-left px-4 py-2 font-semibold text-text-main border-b border-border">資料類別</th>
                    <th className="text-left px-4 py-2 font-semibold text-text-main border-b border-border">蒐集方式</th>
                    <th className="text-left px-4 py-2 font-semibold text-text-main border-b border-border">說明</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">電子郵件地址</td>
                    <td className="px-4 py-2">註冊 / Google OAuth</td>
                    <td className="px-4 py-2">帳號識別與通知</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">顯示名稱</td>
                    <td className="px-4 py-2">用戶輸入 / Google 帳號</td>
                    <td className="px-4 py-2">社群互動顯示</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">大頭貼照片</td>
                    <td className="px-4 py-2">Google OAuth 授權</td>
                    <td className="px-4 py-2">個人檔案顯示</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">位置資訊</td>
                    <td className="px-4 py-2">瀏覽器定位 API（需用戶授權）</td>
                    <td className="px-4 py-2">地圖定位、搜尋附近地點</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">IP 位址</td>
                    <td className="px-4 py-2">自動蒐集</td>
                    <td className="px-4 py-2">安全防護、流量統計</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">使用者上傳的照片</td>
                    <td className="px-4 py-2">用戶主動上傳</td>
                    <td className="px-4 py-2">地點照片分享</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">Cookie 及瀏覽紀錄</td>
                    <td className="px-4 py-2">自動蒐集</td>
                    <td className="px-4 py-2">改善使用體驗</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">瀏覽行為資料</td>
                    <td className="px-4 py-2">自動蒐集（需同意 Cookie）</td>
                    <td className="px-4 py-2">查看地點、搜尋、篩選等互動行為</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-text-main mt-6 mb-3">行為資料收集</h3>
            <p className="leading-relaxed text-text-secondary mb-3">
              為了改善推薦品質及優化使用體驗，本平台在您同意 Cookie 使用後，會收集以下瀏覽行為資料：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>查看地點：</strong>您瀏覽的地點詳情頁面及停留時間。</li>
              <li><strong>搜尋行為：</strong>您輸入的搜尋關鍵字及使用的篩選條件。</li>
              <li><strong>地圖互動：</strong>地圖瀏覽範圍及縮放層級（不記錄精確 GPS 位置）。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              上述資料用於：分析熱門地點與趨勢、改善搜尋與推薦結果、優化平台功能與介面。所有行為資料皆以匿名或去識別化方式處理，不會用於辨識您的真實身份。
            </p>
            <p className="leading-relaxed text-text-secondary mt-2">
              您可以隨時透過瀏覽器設定清除 Cookie 來停止行為資料的收集。未來我們也將在個人設定中提供關閉行為追蹤的選項。
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">三、蒐集目的</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              本平台蒐集您的個人資料，係基於以下特定目的：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>帳號管理：</strong>提供註冊、登入、身份驗證等帳號管理功能。</li>
              <li><strong>服務提供：</strong>提供地圖瀏覽、地點搜尋、評論投票、照片上傳等核心服務。</li>
              <li><strong>個人化體驗：</strong>記錄收藏地點、投票紀錄，提供個人化推薦。</li>
              <li><strong>安全維護：</strong>防止濫用、偵測異常行為，維護平台安全。</li>
              <li><strong>服務改善：</strong>分析使用行為，改善平台功能與使用體驗。</li>
              <li><strong>通知聯繫：</strong>寄送重要服務通知、安全警告或政策變更通知。</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">四、個人資料的利用期間、地區、對象及方式</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>利用期間：</strong>自蒐集之日起，至您申請刪除帳號或本平台終止服務為止。帳號刪除後，我們將於 30 天內刪除或匿名化處理您的個人資料，但法律另有規定者不在此限。</li>
              <li><strong>利用地區：</strong>中華民國（台灣）境內。本平台使用的雲端服務供應商（Supabase、Vercel）可能將資料儲存於境外伺服器，我們已確認該等供應商符合相當之個資保護標準。</li>
              <li><strong>利用對象：</strong>本平台及依法有權機關。未經您的同意，我們不會將您的個人資料提供予第三方行銷使用。</li>
              <li><strong>利用方式：</strong>以自動化機器或其他非自動化之方式，於蒐集之特定目的範圍內為合理利用。</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">五、第三方服務</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              本平台使用以下第三方服務，這些服務可能會處理您的部分個人資料：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>Supabase：</strong>提供資料庫、身份驗證及檔案儲存服務。Supabase 遵循 SOC 2 Type II 安全標準。</li>
              <li><strong>Vercel：</strong>提供網站部署與 CDN 服務。Vercel 遵循 SOC 2 Type II 安全標準。</li>
              <li><strong>Google OAuth：</strong>提供第三方登入服務。僅取得您授權的基本資料（電子郵件、顯示名稱、大頭貼）。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              各第三方服務的隱私權政策，請參閱其官方網站。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">六、您的權利</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              依據個資法第 3 條，您就您的個人資料享有以下權利：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>查詢或請求閱覽：</strong>您可以查詢我們持有的您的個人資料。</li>
              <li><strong>請求製給複本：</strong>您可以請求我們提供您的個人資料副本。</li>
              <li><strong>請求補充或更正：</strong>若您的資料有錯誤或不完整，您可以請求更正。</li>
              <li><strong>請求停止蒐集、處理或利用：</strong>您可以請求我們停止對您資料的蒐集、處理或利用。</li>
              <li><strong>請求刪除：</strong>您可以請求我們刪除您的個人資料。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              如欲行使上述權利，請透過本政策末尾所列的聯繫方式與我們聯繫。我們將於收到您的請求後 15 個工作天內回覆處理。
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">七、Cookie 使用說明</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              本平台使用 Cookie 及類似技術來改善您的使用體驗。我們使用的 Cookie 類型包括：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>必要性 Cookie：</strong>維持登入狀態、安全驗證等平台運作所必需之功能。</li>
              <li><strong>功能性 Cookie：</strong>記錄您的偏好設定（如地圖位置、篩選條件）。</li>
              <li><strong>分析性 Cookie：</strong>匿名統計使用者行為，用於改善平台服務。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              您可以透過瀏覽器設定拒絕或刪除 Cookie，但部分平台功能可能因此無法正常運作。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">八、資料安全措施</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              我們採取以下措施保護您的個人資料安全：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li>全站採用 HTTPS 加密傳輸。</li>
              <li>密碼經過雜湊加密處理，我們無法得知您的原始密碼。</li>
              <li>資料庫存取設有嚴格的列級安全政策（Row Level Security）。</li>
              <li>定期檢視並更新安全措施。</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">九、未成年人保護</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台不會在知情的情況下蒐集未滿 7 歲兒童的個人資料。年滿 7 歲但未滿 18 歲之未成年人使用本平台服務，應取得法定代理人之同意。若我們發現在未經法定代理人同意下蒐集了未成年人的個人資料，我們將立即刪除該資料。
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十、不提供個資對權益之影響</h2>
            <p className="leading-relaxed text-text-secondary">
              您可以自由選擇是否提供個人資料予本平台。若您選擇不提供電子郵件地址，將無法註冊帳號及使用需要登入的功能（如評論、投票、上傳照片、收藏等）。您仍可在未登入的狀態下瀏覽地圖及查看地點資訊。
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十一、隱私權政策修訂</h2>
            <p className="leading-relaxed text-text-secondary">
              我們可能不定期修訂本隱私權政策。修訂後的版本將公告於本頁面，並更新「最後更新日期」。若有重大變更，我們將透過電子郵件或平台公告方式通知您。建議您定期查閱本政策以瞭解最新內容。
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十二、聯繫方式</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              如您對本隱私權政策有任何疑問，或欲行使您的個資權利，請透過以下方式聯繫我們：
            </p>
            <div className="bg-surface-alt rounded-xl p-4 text-text-secondary">
              <p><strong>Wildmap 團隊</strong></p>
              <p>電子郵件：<a href="mailto:privacy@wildmap.tw" className="text-primary hover:text-primary-dark">privacy@wildmap.tw</a></p>
            </div>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十三、準據法</h2>
            <p className="leading-relaxed text-text-secondary">
              本隱私權政策以中華民國法律為準據法，並以台灣台北地方法院為第一審管轄法院。
            </p>
          </section>
        </div>

        {/* 政府資料顯名聲明 */}
        <div className="mt-10 bg-surface-alt rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-primary-dark mb-3">政府資料開放授權聲明</h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-3">
            本平台部分地點資料來自<strong>政府資料開放平台</strong>（
            <a href="https://data.gov.tw" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">data.gov.tw</a>
            ），包括但不限於交通部觀光署公開之露營場資料。
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            上述資料依據<strong>政府資料開放授權條款</strong>（Open Government Data License, OGDL）使用。
            本平台對該等資料之後續加值應用（如社群投票、評論、特性標註等）係由本平台用戶產生，不代表原始資料提供機關之立場。
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-border flex items-center gap-4 text-sm text-text-secondary">
          <Link href="/terms" className="hover:text-primary transition-colors no-underline">服務條款</Link>
          <span>|</span>
          <Link href="/disclaimer" className="hover:text-primary transition-colors no-underline">免責聲明</Link>
          <span>|</span>
          <Link href="/" className="hover:text-primary transition-colors no-underline">回首頁</Link>
        </div>
      </main>
    </div>
  )
}
