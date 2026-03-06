import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '免責聲明 - Wildmap',
  description: 'Wildmap 免責聲明：了解平台資訊的使用限制與風險告知。',
}

export default function DisclaimerPage() {
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
        <h1 className="text-3xl font-extrabold text-text-main mb-2">免責聲明</h1>
        <p className="text-sm text-text-secondary mb-8">最後更新日期：2026 年 3 月 6 日</p>

        {/* Important notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ 重要提示</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            Wildmap 是一個<strong>露營等戶外活動地點資訊彙整平台</strong>，提供的所有地點資訊僅供參考。
            我們不是旅行社、露營場營運者或活動組織者。在前往任何地點前，請務必自行評估安全風險並遵守當地法規。
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-text-main space-y-8">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">一、平台性質說明</h2>
            <p className="leading-relaxed text-text-secondary">
              Wildmap（以下簡稱「本平台」）為露營等戶外活動地點資訊彙整服務。本平台上呈現的地點資訊來源包括：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary mt-3">
              <li><strong>政府公開資料：</strong>依據「政府資料開放授權條款」（OGDL）取得的合法登記露營場等資料。</li>
              <li><strong>社群回報：</strong>由社群或使用者回報的地點資訊。這些資訊未經本平台實地查核。</li>
              <li><strong>使用者投稿：</strong>由平台使用者新增或編輯的地點資訊。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3">
              本平台僅進行資訊彙整與呈現，<strong>不對任何地點進行推薦、背書或保證</strong>。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">二、地點分類說明</h2>
            <p className="leading-relaxed text-text-secondary mb-4">
              本平台上的地點依據資料來源與法規狀態，區分為以下類別：
            </p>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-semibold text-green-800 mb-1">✅ 政府登記</p>
                <p className="text-sm text-green-700">
                  已取得合法登記的露營場。資料來自政府公開資料平台（data.gov.tw）或交通部觀光署露營場資訊平台。
                  「政府登記」標示僅表示該場所已辦理登記，不代表本平台對其安全性或服務品質之保證。
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-800 mb-1">⚠️ 未登記場地</p>
                <p className="text-sm text-amber-700">
                  尚未取得合法登記的露營場。這些場地可能存在用地合法性、安全設施不足等風險。
                  此資訊來自政府公開揭露的未登記露營場清單，目的為提供公眾知情權。
                  前往未登記場地前，請務必自行評估風險。
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-semibold text-blue-800 mb-1">📍 社群回報</p>
                <p className="text-sm text-blue-700">
                  由社群或使用者回報的地點。
                  這些地點未經本平台實地查核，僅為社群分享的資訊彙整。
                  在這些地點進行戶外活動前，請確認當地法規，並注意自身安全。
                  本平台不保證這些地點可合法進行特定活動。
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">三、資訊正確性</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台盡力提供正確、即時的地點資訊，但<strong>不保證</strong>任何資訊的正確性、完整性、即時性或可靠性。
              地點的營運狀態、設施、環境等隨時可能變動，本平台可能無法即時更新。
              您應在前往任何地點前，自行向該地點確認最新資訊。
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">四、戶外活動風險</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              戶外活動（包括但不限於露營、登山等）本身具有一定風險。使用者應瞭解並自行承擔以下風險：
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-text-secondary">
              <li><strong>天氣風險：</strong>颱風、豪雨、落雷、高溫等極端天氣可能危及安全。請於出發前查看氣象預報。</li>
              <li><strong>地質風險：</strong>土石流、落石、地層滑動等地質災害。特別在山區及溪邊應留意警報。</li>
              <li><strong>設施風險：</strong>未登記場地可能缺乏安全設施、消防設備或緊急逃生路線。</li>
              <li><strong>法律風險：</strong>在未經許可的區域露營或停車過夜，可能違反道路交通法規、國家公園法、森林法等規定。</li>
              <li><strong>野生動物及自然環境風險：</strong>蛇、蜂、有毒植物等自然環境中的潛在危險。</li>
            </ul>
            <p className="leading-relaxed text-text-secondary mt-3 font-medium">
              本平台不對使用者在任何地點發生的人身傷害、財產損失或其他損害負責。
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">五、使用者責任</h2>
            <p className="leading-relaxed text-text-secondary mb-3">
              使用本平台資訊時，您有以下責任：
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-text-secondary">
              <li>自行判斷地點資訊的可信度，不盲信平台上的評論或評分。</li>
              <li>在前往任何地點前，自行確認其合法性、安全性及最新狀態。</li>
              <li>遵守當地所有適用法律法規，包括但不限於環境保護、廢棄物處理、噪音管制等。</li>
              <li>做好充分的行前準備，攜帶必要的安全裝備及急救用品。</li>
              <li>留意氣象預報及自然環境警示，必要時取消行程。</li>
              <li>如遇緊急狀況，請立即撥打 <strong>119</strong>（消防救護）或 <strong>110</strong>（警察）求助。</li>
            </ol>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">六、評論與評分</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台上的評論、評分及特性投票均來自使用者，反映的是個別使用者的個人經驗與觀點。
              本平台不對評論內容的真實性、正確性或客觀性負責。
              您不應僅依據評論或評分做出前往任何地點的決定。
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">七、外部連結</h2>
            <p className="leading-relaxed text-text-secondary">
              本平台可能包含連結至外部網站或服務（如 Google Maps 導航連結）。
              我們不對外部網站或服務的內容、隱私政策或安全性負責。
              您使用外部連結所產生的風險由您自行承擔。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">八、責任限制</h2>
            <p className="leading-relaxed text-text-secondary">
              在法律允許的最大範圍內，本平台及其團隊成員不對因使用或無法使用本平台而產生的任何直接、間接、偶發、特殊或衍生性損害負責，包括但不限於利潤損失、資料遺失、人身傷害或財產損失。
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">九、資料來源聲明</h2>
            <div className="bg-surface-alt rounded-xl p-4 text-text-secondary space-y-3">
              <div>
                <p className="font-semibold text-text-main">合法登記露營場資料</p>
                <p className="text-sm">資料來源：交通部觀光署</p>
                <p className="text-sm">
                  本資料依「政府資料開放授權條款」（Open Government Data License）進行公眾釋出。
                  授權條款全文：<a href="https://data.gov.tw/license" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">https://data.gov.tw/license</a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-main">社群回報地點資料</p>
                <p className="text-sm">資料來源：社群回報彙整</p>
                <p className="text-sm">這些資訊為社群回報的彙整，未經本平台實地查核。</p>
              </div>
            </div>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-primary-dark border-b border-border pb-2 mb-4">十、免責聲明的修訂</h2>
            <p className="leading-relaxed text-text-secondary">
              我們可能不定期修訂本免責聲明。修訂後的版本將公告於本頁面，並更新「最後更新日期」。
              您繼續使用本平台即視為同意修訂後之免責聲明。
            </p>
          </section>

          {/* Emergency */}
          <section>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-bold text-red-800 mb-2">🆘 緊急求助</p>
              <p className="text-sm text-red-700 mb-2">如在戶外活動中遇到緊急狀況，請立即撥打：</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>🚒 <strong>119</strong> — 消防局（火災、救護、山難救助）</li>
                <li>🚓 <strong>110</strong> — 警察局</li>
                <li>📞 <strong>112</strong> — 緊急救難（無訊號時可撥打）</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-6 border-t border-border flex items-center gap-4 text-sm text-text-secondary">
          <Link href="/privacy" className="hover:text-primary transition-colors no-underline">隱私權政策</Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-primary transition-colors no-underline">服務條款</Link>
          <span>|</span>
          <Link href="/" className="hover:text-primary transition-colors no-underline">回首頁</Link>
        </div>
      </main>
    </div>
  )
}
