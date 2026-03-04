-- 015: 更新已匯入的合法露營場：設定 gov_certified = true 並補入聯絡資訊
-- 來源：gov-campsites.csv 中「符合相關法規露營場」的資料

-- 先將已匯入的合法露營場（quality = official）標記為 gov_certified = true
UPDATE spots SET gov_certified = true WHERE quality = 'official' AND category = 'camping';

UPDATE spots SET phone = '039892809', website = 'https://www.facebook.com/daozhuangfarm/?locale=zh_TW' WHERE name = '稻庄休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0928219582' WHERE name = '鄉野沐田休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '039222000', website = 'https://www.huago.tw/archives/listings/%E5%BA%84%E8%85%B3%E6%89%80%E5%9C%A8%E4%BC%91%E9%96%92%E8%BE%B2%E5%A0%B4' WHERE name = '庄腳所在休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0912581913' WHERE name = '水旅居露營' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0932263488' WHERE name = '大礁溪星海露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '039616866' WHERE name = '合樂露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0975028669' WHERE name = '鷗漫景觀營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0911820455' WHERE name = '山谷樂生態露營園區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0987954899', website = 'https://www.facebook.com/people/%E5%B1%B1%E6%B0%91%E6%B2%BB97%E6%BC%AB%E6%B4%BB%E7%87%9F%E5%9C%B0/100091120017495/' WHERE name = '山民治97漫活營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '038655678', website = 'https://www.liyulakeglmping.com/' WHERE name = '花蓮鯉魚潭露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0930596580' WHERE name = '石梯坪露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '082313100' WHERE name = '金門金寧_中山林露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492803308', website = 'https://www.cingjing.gov.tw/mien/ins.php?index_id=26' WHERE name = '小瑞士花園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492273797', website = 'https://forest18.com.tw/' WHERE name = '森十八休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492227211', website = 'https://www.facebook.com/shuijing.farm/?ref=br_rs' WHERE name = '水鏡農莊休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0423375309' WHERE name = '埔里春天休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0937598809' WHERE name = '緣溪行露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0423593968', website = 'https://www.facebook.com/7ks2015/' WHERE name = '七口灶休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492461169' WHERE name = '水秀休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492461001', website = 'https://www.facebook.com/Baishencoffee/' WHERE name = '百勝村休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492462052' WHERE name = '地球村休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492461311', website = 'https://www.atayal.com.tw/zh-tw' WHERE name = '泰雅渡假村' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0919055082' WHERE name = '日月潭貓囒山露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0492899996', website = 'http://www.facebook.com/sunmoonlakeresorts/' WHERE name = '日月潭日月山莊休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET website = 'https://www.cyes.ptc.edu.tw/nss/p/index' WHERE name = '青葉國小露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087993521', website = 'https://project-treeline.com/park' WHERE name = '屏東三地門_賽嘉營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087992220' WHERE name = '賽嘉國小露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087230100', website = 'https://thcdc.hakka.gov.tw/8268/' WHERE name = '六堆園區露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '088869696', website = 'http://www.taiwanchoco.com.tw/' WHERE name = '阿信巧克力休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '088866669', website = 'http://www.oglamping.com/' WHERE name = 'OâGLAMPING墾丁貓鼻頭露營莊園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '088866558', website = 'https://www.bayforesthotel.com/camping/' WHERE name = '趣漫步休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '088897858', website = 'https://www.facebook.com/source.farm00' WHERE name = '根源自然生態休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0911934682' WHERE name = '大漢山休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087956611', website = 'https://www.dalukuanland.com/' WHERE name = '屏東高樹_大路觀主題樂園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087990383', website = 'https://www.facebook.com/indafarm/posts/2569051519906096' WHERE name = '穎達生態休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET website = 'https://www.eles.ptc.edu.tw/nss/p/index' WHERE name = '長榮百合國小露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087993520', website = 'http://www.elfvillage-tw.com/index.php?lang=cht' WHERE name = '屏東瑪家_涼山露營區(遊憩區)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087898822', website = 'https://www.facebook.com/bada.com.tw/' WHERE name = '屏東潮州_8大森林樂園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087872388', website = 'https://www.facebook.com/p/ï¼E5ï¼B4ï¼99ï¼E5ï¼B7ï¼9Dï¼E9ï¼9Cï¼B2ï¼E7ï¼87ï¼9Fï¼E5ï¼8Dï¼80-100063616435842/' WHERE name = '崙川露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '087214446', website = 'http://yoyuan.blogspot.tw/' WHERE name = '柚園生態休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037875766', website = 'https://bmr.bluemagpie.com.tw/index.htm' WHERE name = '山板樵休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037875766', website = 'https://www.easycamp.com.tw/Store_871.html' WHERE name = '山板樵-楓橋夜泊露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037951784', website = 'https://www.facebook.com/sky951784/' WHERE name = '老官道休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0928681629', website = 'https://www.facebook.com/aa0928681629/' WHERE name = '嵐湖休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037951196', website = 'http://yu-huo-yi-jing.mmweb.tw/?ptype=n2p' WHERE name = '新美休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0932579127', website = 'https://www.facebook.com/sky951784/' WHERE name = '老官道農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037783790', website = 'http://www.flyscoot.com/index.php/zhtw/promo-fares-tw.html?utm_source=ex_tw&utm_medium=fb_offers&utm_campaign=070113_33_off_promocode_scootbiz' WHERE name = '藍鵲休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037747711', website = 'https://greenforest168.weebly.com/' WHERE name = '揚昊休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0932552997' WHERE name = '自家烘焙咖啡休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '037931323' WHERE name = '貓頭鷹生態休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0937098227', website = 'https://ca-va.weebly.com' WHERE name = 'CaVa休閒露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0989344266', website = 'https://kiwicamping.weebly.com' WHERE name = 'Kiwi休閒露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0939378160', website = 'https://www.easycamp.com.tw/Store_2542.html' WHERE name = '谷力農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0987839083' WHERE name = '樂見山露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0986065371', website = 'https://www.farm99.com/' WHERE name = '九斗休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '034750606', website = 'https://taoyuanleisureagriculturefanpage.tycg.gov.tw/wordpress/%E6%B1%9F%E9%99%B5%E6%97%A5%E8%A7%80%E4%BC%91%E9%96%92%E8%BE%B2%E5%A0%B4/' WHERE name = '江陵日觀休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '034713030', website = 'https://www.orchard-villa.com/' WHERE name = '桃禧漫遊渡假露營園區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '034112777', website = 'https://www.camptrip.com.tw/camp/%E9%9A%86%E6%B3%89%E8%BE%B2%E8%8E%8A-%E5%93%88%E6%AF%94%E5%B1%8B%E9%9C%B2%E7%87%9F%E5%8D%80/' WHERE name = '隆泉莊園休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '034711752' WHERE name = '桃園市石門營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0286663360' WHERE name = '桃野星晴' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '033242610', website = 'https://m.icamping.app/store/tlk473' WHERE name = '桃蘆坑休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '077812858' WHERE name = '忠義營地(大寮區忠義國小)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '076883361', website = 'https://www.spa-grand.com.tw/' WHERE name = '遠山望月露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '076775068', website = 'https://www.yonglinfarm.com.tw/' WHERE name = '永齡有機休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0936170224' WHERE name = '貴梅B露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0926180522' WHERE name = '美濃美真園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '076831115', website = 'http://www.kaohsiungfarm.com.tw/' WHERE name = '高雄同學農場-遊騎兵特戰基地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0935325217' WHERE name = '梅園野營秘境露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0985200985' WHERE name = '山中水手露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0927130130' WHERE name = '東九道露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '067800698' WHERE name = '露營樂2號店(狩獵帳)旗津旗艦店' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0937806900' WHERE name = '角宿休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0224582688', website = 'https://www.facebook.com/LAPOPOTW/' WHERE name = '拉波波村' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '055523606' WHERE name = '樟湖十字關露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '055825789' WHERE name = '劍湖山世界' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0965808832' WHERE name = '石壁休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0226681589' WHERE name = '熊空森林休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0919572909' WHERE name = '頂埔休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0224991791', website = 'http://www.lonmen.tw/' WHERE name = '龍門露營渡假基地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0224934016', website = 'http://www.ping-lingfarm.com.tw/' WHERE name = '雙溪平林休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0917153878', website = 'https://www.facebook.com/Andydreamcafe/?locale=zh_TW' WHERE name = '築夢山城休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0988909769', website = 'https://www.facebook.com/dashanbei/?locale=zh_TW' WHERE name = '大山背休閒農場_大山背小曠野營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '053600959', website = 'https://ezgo.ardswc.gov.tw/zh-TW/Front/Agri/Detail/1449' WHERE name = '向禾休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0978996796', website = 'https://guipuglamping.com/' WHERE name = '歸樸露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0983669502', website = 'https://www.dajiataqin.com/' WHERE name = '踏親露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0426868513', website = 'https://www.nayangbeach.com.tw/?gclid=CjwKCAjw88yxBhBWEiwA7cm6pcAL90yTnoCsfMug_Q_OEDPRo8KrxzAyZ1UuRnRPBXykyl9cfHhCABoCQHQQAvD_BwE' WHERE name = '大安濱海樂園露營區(向海那漾)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0422390685', website = 'https://www.facebook.com/tcc.scout.campside/' WHERE name = '中正露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0426805581', website = 'https://www.agb.com.tw/' WHERE name = '中華民國農會休閒綜合農牧場(森渼原)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0965070550', website = 'https://www.facebook.com/BerLintTree.Good/' WHERE name = '柏冷翠休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0983057773', website = 'https://reurl.cc/OreMrv' WHERE name = '哈露米露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0425981070', website = 'https://www.fushoushan.com.tw/camping/?parent_id=2260' WHERE name = '福壽山農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0425901470', website = 'https://camping.wuling-farm.com.tw/camp/' WHERE name = '武陵農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0927388178', website = 'https://reurl.cc/EVgQx0' WHERE name = '望向芸端露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0963038449' WHERE name = '五福畊讀休閒農場(暫停營業)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0928915963', website = 'https://www.facebook.com/dragonflyvalleyfamily/' WHERE name = '蜻蜓谷休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0963156323', website = 'https://www.facebook.com/Smile20140201' WHERE name = '微笑休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0425872191', website = 'http://www.tsfa.com.tw' WHERE name = '東勢林場遊樂區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0437022557', website = 'https://www.chanshuo.tw/slowlysunset/' WHERE name = '高美濕地露營區(蟬說-夕陽漫漫)(暫停營業)' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0425810352' WHERE name = '新社蓮園休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0425818230' WHERE name = '新龍崗露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0932658222', website = 'http://www.nalu.com.tw/about.asp' WHERE name = '小路休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0228629588', website = 'https://www.star-fountain.com/' WHERE name = '菁山遊憩區露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET website = 'https://gisweb.taipei.gov.tw/TPCamp/Default.aspx' WHERE name = '碧山露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET website = 'https://gisweb.taipei.gov.tw/TPCamp/Default.aspx' WHERE name = '貴子坑露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0223076929', website = 'http://華中露營場.tw' WHERE name = '華中露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0963871968', website = 'https://www.facebook.com/bixilian/?locale=zh_TW' WHERE name = '比西里岸露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '089510961' WHERE name = '知本森林遊樂區野營活動場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '089324377', website = 'https://www.toyugi.com.tw/' WHERE name = '東遊季溫泉渡假村' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0978733216', website = 'https://www.facebook.com/Simplefarm599/?locale=zh_TW' WHERE name = '心泊一隅露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0901258367', website = 'https://xuanmuju.com/' WHERE name = '軒沐居露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '089671133' WHERE name = '紫坪露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0919607617' WHERE name = '小野柳露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '065760121', website = 'https://www.farm.com.tw/' WHERE name = '走馬瀨休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '067865355', website = 'https://www.facebook.com/vanaheim.love.manor/?locale=zh_TW' WHERE name = '雙春濱海遊憩區-Vanaheim愛莊園' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '065732880' WHERE name = '曲水左鎮露營場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0937697591' WHERE name = '瓦樣山巷露營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0928720635' WHERE name = '艾恩露營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '065742510' WHERE name = '以琳露營地' AND category = 'camping' AND quality = 'official';
UPDATE spots SET website = 'https://www.facebook.com/happyfarm.url.tw/?locale=zh_TW' WHERE name = '關子嶺開心休閒農場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '066858088', website = 'https://www.facebook.com/wu.shu.lin.hong.sheng.lu.ying.qu' WHERE name = '烏樹林鴻盛露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '066231896', website = 'https://hollandvillage.jamall.tw/' WHERE name = '德元埤荷蘭村' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '066858088', website = 'https://www.taisugar.com.tw/resting/jianshanpi/CP2.aspx?n=11897' WHERE name = '柳營尖山埤鴻盛露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '065901325', website = 'https://htp.tainan.gov.tw/' WHERE name = '虎頭埤風景區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '065753431', website = 'http://tsengwen.cyh.org.tw/' WHERE name = '曾文青年活動中心' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '0933914636', website = 'https://docs.google.com/forms/d/1dDMByZo_8pwQdj9up2-jV1M9h_h7WGlenMu-RkHLLCI/viewform?edit_requested=true' WHERE name = '梅嶺神秘氣場' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '069933669' WHERE name = '員貝樂營露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '069950789', website = 'https://event.startravel.com.tw/penghu/camp/' WHERE name = '灣山露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '069553355' WHERE name = '坐望著海露營區' AND category = 'camping' AND quality = 'official';
UPDATE spots SET phone = '069920475' WHERE name = '湖西苗圃童軍露營地' AND category = 'camping' AND quality = 'official';

-- Total: 129 spots updated with contact info
