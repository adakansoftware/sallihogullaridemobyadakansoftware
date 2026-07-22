import { getServiceHref, serviceDetails } from '@/lib/services-data'

export const siteQuickLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/about', label: 'Hakkımızda' },
  { href: '/services', label: 'Hizmetler' },
  { href: '/projects', label: 'Projeler' },
  { href: '/fleet', label: 'Filomuz' },
  { href: '/contact', label: 'İletişim' },
]

export const siteStats = [
  { value: '25+', label: 'Yıl', sublabel: 'Sahada biriken hafriyat ve nakliyat deneyimi' },
  { value: '30+', label: 'Araç', sublabel: 'İş makinesi, kamyon ve taşıma ekipmanı' },
  { value: '7/24', label: 'Takip', sublabel: 'Şantiye akışı ve sevkiyat koordinasyonu' },
  { value: 'Adana', label: 'Merkez', sublabel: 'Adana ve çevre illerde saha erişimi' },
  { value: '1999', label: 'Kuruluş', sublabel: 'Yerel saha bilgisi ve operasyon disiplini' },
]

export const serviceCards = serviceDetails.map((service) => ({
  title: service.title,
  description: service.description,
  image: service.image,
  href: getServiceHref(service.slug),
}))

export const fleetStats = [
  { value: '30+', label: 'Araç ve Makine' },
  { value: '7', label: 'İş Makinesi' },
  { value: 'Planlı', label: 'Bakım ve Hazırlık' },
  { value: '23+', label: 'Nakliye Ekipmanı' },
]

export const fleetItems = [
  {
    name: 'Ekskavatör',
    count: '5',
    capacity: '13-36 Ton',
    description:
      'Temel kazısı, yükleme, kanal açma ve zemin hazırlığında farklı saha koşullarına göre yönlendirilen Sumitomo SH 360, Sumitomo SH 210 ve Case CX130C ekskavatör grubu.',
    specs: ['Sumitomo SH 360 x2', 'Sumitomo SH 210 x2', 'Case CX130C x1'],
    image: '/images/excavator.jpg',
  },
  {
    name: 'Beko Loder',
    count: '2',
    capacity: 'Saha Destek',
    description:
      'Dar alan kazısı, geri dolgu, yükleme ve saha içi düzenleme işlerinde kullanılan Hidromek HMK 102 B Alpha ve Hidromek HMK 102 S Alpha beko loder desteği.',
    specs: ['Hidromek HMK 102 B Alpha x1', 'Hidromek HMK 102 S Alpha x1', 'Geri Dolgu ve Yükleme'],
    image: '/images/backhoe.jpg',
  },
  {
    name: 'Damperli Nakliye Filosu',
    count: '17',
    capacity: 'Damperli Nakliye',
    description:
      'Hafriyat, dolgu, kum, taş, mıcır ve toprak sevkiyatında düzenli yükleme ve döküm akışı için kullanılan Mercedes Arocs, Mercedes Axor ve BMC Pro damperli kamyon grubu.',
    specs: ['Arocs 3345 x4', 'Axor 3340 x12', 'BMC Pro 827 x1'],
    image: '/images/dump-truck.jpg',
  },
  {
    name: 'Çekici ve Dorse',
    count: '5',
    capacity: 'Damperli Dorse / Lowbed',
    description:
      'Malzeme sevkiyatı, ekipman taşıma ve lowbed nakliyat işlerinde güzergah, yükleme güvenliği ve teslim planına göre kullanılan Axor 1840 çekici, damperli dorse ve lowbed altyapısı.',
    specs: ['Axor 1840 x2', 'Damperli Dorse x2', 'Lowbed x1'],
    image: '/images/fleet-tir-damper.png',
  },
  {
    name: 'Arazöz',
    count: '1',
    capacity: 'Su Tankeri / Arazöz',
    description: 'Şantiye içi sulama, yol temizliği, toz kontrolü ve saha destek ihtiyaçları için kullanılan Ford 2524 su tankeri / arazöz.',
    specs: ['Ford 2524 x1', 'Su Tankeri / Arazöz', 'Toz Kontrolü'],
    image: '/images/fleet-arazoz-truck.png',
  },
  {
    name: 'Toprak Silindiri',
    count: '1',
    capacity: 'Zemin Sıkıştırma',
    description:
      'Dolgu, yol altyapısı, saha düzenleme ve platform hazırlığında zemin sıkıştırma ihtiyacını kontrollü şekilde karşılayan Sakai marka toprak silindiri desteği.',
    specs: ['Sakai', 'Toprak Silindiri', 'Zemin Sıkıştırma'],
    image: '/images/fleet-silindir-sakai.jpg',
  },
]

export const whyChooseUsReasons = [
  {
    title: 'Sahaya Göre Net Plan',
    description: 'Giriş-çıkış noktası, yükleme alanı, döküm güzergahı ve günlük çalışma temposu ekip sahaya girmeden önce netleştirilir.',
    stat: 'Planlı Başlangıç',
  },
  {
    title: 'Doğru Makine, Doğru Zaman',
    description: 'Kazı, dolgu, yükleme ve nakliye işleri için zemin yapısına, alan genişliğine ve işin kapsamına uygun makine-kamyon dengesi kurulur.',
    stat: 'İşe Uygun Ekip',
  },
  {
    title: 'Takvime Bağlı Çalışma',
    description: 'Makine, kamyon ve saha ekibi aynı günlük programda ilerler; bekleme, boş sefer ve dağınık çalışma riski azaltılır.',
    stat: 'Günlük Kontrol',
  },
  {
    title: 'Sahada Ulaşılabilir Ekip',
    description: 'Şantiye sorumlusu ile doğrudan temas kurulur; günlük ihtiyaç, değişiklik ve saha durumu hızlı şekilde paylaşılır.',
    stat: 'Net İletişim',
  },
  {
    title: 'İhtiyaca Göre Ekipman',
    description: 'Küçük ölçekli kazıdan yoğun saha içi taşımaya kadar ekipman ve kamyon sayısı işin gerçek ihtiyacına göre şekillendirilir.',
    stat: 'Esnek Plan',
  },
  {
    title: 'Sevkiyat Disiplini',
    description: 'Damperli nakliyat, malzeme kabulü ve saha içi yönlendirme kontrollü ilerletilerek kamyon beklemesi ve zaman kaybı azaltılır.',
    stat: 'Düzenli Sevk',
  },
]

export const certifications = [
  'İş öncesi saha keşfi ve erişim kontrolü',
  'Makine, kamyon ve sevkiyat koordinasyonu',
  'Planlı bakım ve ekipman hazırlığı',
  'Günlük saha akışı ve iş takibi',
]

export const collaborationPrinciples = [
  {
    title: 'Ön Kontrol',
    body: 'Saha görülmeden, malzeme türü ve çalışma alanı netleşmeden program yapılmaz; işin erişimi, yükleme noktası ve sevkiyat akışı baştan belirlenir.',
    accent: 'Sahaya göre hazırlık',
  },
  {
    title: 'Günlük Koordinasyon',
    body: 'Şantiye ekibi, kamyon yönlendirmesi ve makine çalışması aynı iletişim hattında takip edilir; değişiklikler büyümeden sahada karşılık bulur.',
    accent: 'Tek plan, tek takip',
  },
  {
    title: 'Teslim Disiplini',
    body: 'Amaç yalnızca makine göndermek değil; işi düzenli, kontrollü ve sahadaki takvime uyumlu şekilde tamamlamaktır.',
    accent: 'İş bitirme odağı',
  },
]

export const partnerSectors = ['Konut Şantiyeleri', 'Sanayi Sahaları', 'Altyapı İşleri', 'Parsel Hazırlığı', 'Yol ve Dolgu Çalışmaları']

export const serviceDecisionGuides = [
  {
    title: 'Kazı başlıyor, saha netleşmedi',
    summary: 'İşin kapsamı belli olsa da makine, kamyon ve günlük ilerleme temposu henüz net değilse önce kazı ve sevkiyat kurgusunu birlikte ele almak gerekir.',
    recommended: ['Hafriyat ve Kazı İşleri', 'Ekskavatör Çalışmaları', 'Damperli Nakliyat'],
    focus: 'Kazı sınırı, makine erişimi, yükleme noktası ve günlük kamyon çevrimi',
  },
  {
    title: 'Dar alan ama hızlı ilerleme gerekiyor',
    summary: 'Alan sınırlıysa ve kısa çevrimli saha müdahaleleri gerekiyorsa ağır kurgu yerine çevik ekipman planı daha verimli olur.',
    recommended: ['Beko Loder Desteği', 'Damperli Nakliyat', 'Arazöz / Su Tankeri'],
    focus: 'Manevra alanı, giriş-çıkış kolaylığı, kısa süreli yükleme ve saha düzeni',
  },
  {
    title: 'Malzeme akışı işin hızını belirliyor',
    summary: 'Sorun kazıda değil; çıkan veya gelen malzemenin ritminde ise işin omurgası nakliye ve saha kabul düzeni olur.',
    recommended: ['Damperli Nakliyat', 'Dolgu ve Zemin Hazırlığı', 'Arazöz / Su Tankeri'],
    focus: 'Yükleme ritmi, döküm veya kabul noktası, gün içi sefer dengesi',
  },
  {
    title: 'Makine sahaya taşınacak veya yeni etap açılacak',
    summary: 'Ekipman transferi, yeni etap başlangıcı veya şantiyeler arası kurulum varsa teslim zamanı ve güzergah uyumu kritik hale gelir.',
    recommended: ['Lowbed Nakliyat', 'Altyapı Kazıları', 'Ekskavatör Çalışmaları'],
    focus: 'Makine sevki, etap geçişi, teslim saati ve sahaya hazır başlangıç',
  },
]

export const operationsModelSteps = [
  {
    step: '01',
    title: 'Saha okuma',
    description: 'Konum, erişim, zemin yapısı, yükleme noktası ve çalışma sınırı iş başlamadan önce netleştirilir.',
  },
  {
    step: '02',
    title: 'Ekipman dengesi',
    description: 'İşin hacmine göre makine, kamyon ve destek araçları birbiriyle uyumlu olacak şekilde planlanır.',
  },
  {
    step: '03',
    title: 'Günlük akış',
    description: 'Kazı, yükleme, sevkiyat, dolgu veya saha desteği tek bir günlük üretim akışına bağlanır.',
  },
  {
    step: '04',
    title: 'Sahada takip',
    description: 'Değişen ihtiyaçlar büyümeden ele alınır; program ve saha gerçekliği arasındaki fark yakından takip edilir.',
  },
]

export const servicePromises = [
  {
    title: 'Sadece araç değil operasyon düzeni',
    body: 'Ekipman göndermekle yetinmeyip o ekipmanın gün içinde nasıl değer üreteceğini de planlıyoruz.',
  },
  {
    title: 'Tekliften önce doğru çerçeve',
    body: 'Fiyat konuşulmadan önce işin çerçevesini netleştirmek, sonradan yaşanacak sürprizleri azaltır.',
  },
  {
    title: 'Teslim temposuna uyum',
    body: 'Özellikle baskılı takvimlerde amaç yalnızca çalışmak değil, işin ilerleme ritmini korumaktır.',
  },
]

export const riskControlItems = [
  {
    risk: 'Sahaya yanlış ekipman girmesi',
    effect: 'İş yavaşlar, manevra zorlaşır ve gün içi verim düşer.',
    control: 'Erişim, zemin yapısı, iş hacmi ve günlük hedefe göre ekipman dengesi iş başlamadan kurulur.',
  },
  {
    risk: 'Kamyon beklemesi veya düzensiz sefer',
    effect: 'Kazı ve yükleme ritmi bozulur, zaman kaybı artar.',
    control: 'Yükleme süresi, döküm mesafesi ve saha çıkışı birlikte değerlendirilerek çevrim planı yapılır.',
  },
  {
    risk: 'İş başladıktan sonra kapsamın değişmesi',
    effect: 'Program sapar, ekip ve araç kullanımı verimsizleşir.',
    control: 'Başlangıçta kritik saha bilgileri toplanır; değişken alanlar günlük koordinasyonla takip edilir.',
  },
  {
    risk: 'Teslim baskısı altında dağınık ilerleme',
    effect: 'Birçok ekip çalışsa da işin toplam ilerleme ritmi düşer.',
    control: 'Günlük üretim akışı tek plana bağlanır ve öncelikler sahadaki sıraya göre netleştirilir.',
  },
]

export const quoteReadinessChecklist = [
  'Konum veya açık saha lokasyonu',
  'Yaklaşık metraj, kazı derinliği ya da taşınacak hacim',
  'Malzeme tipi: toprak, moloz, kum, dolgu veya karma içerik',
  'Sahadan çıkış gerekip gerekmediği',
  'Başlangıç tarihi ve hedeflenen iş süresi',
  'Saha erişimi: dar alan, rampa, yoğun trafik veya etaplı çalışma bilgisi',
]

export const projectReadinessBlocks = [
  {
    title: 'İşe başlamadan önce',
    description: 'Sahaya dair belirsizlikleri azaltmak için erişim, hacim, zemin ve günlük tempo birlikte değerlendirilir.',
  },
  {
    title: 'İş sürerken',
    description: 'Makine, kamyon ve destek araçları aynı akışa bağlanır; sahadaki değişiklikler büyümeden yönetilir.',
  },
  {
    title: 'Teslime yaklaşırken',
    description: 'Kalan iş hacmi ve saha öncelikleri yeniden okunarak son aşamadaki yığılma ve bekleme azaltılır.',
  },
]

export const serviceComparisonRows = [
  {
    service: 'Hafriyat ve Kazı İşleri',
    bestFor: 'Temel başlangıcı, saha açılışı ve hacimli kazı düzeni',
    siteNeed: 'Kazı sınırı ve sevkiyat birlikte yönetilecekse',
    planningWeight: 'Yüksek',
  },
  {
    service: 'Ekskavatör Çalışmaları',
    bestFor: 'Derinlik, erişim ve yükleme gücünün kritik olduğu işler',
    siteNeed: 'Makine gücü ve tonaj seçimi belirleyiciyse',
    planningWeight: 'Yüksek',
  },
  {
    service: 'Beko Loder Desteği',
    bestFor: 'Dar alan, kısa çevrim ve pratik saha müdahaleleri',
    siteNeed: 'Manevra kolaylığı ağır güçten daha önemliyse',
    planningWeight: 'Orta',
  },
  {
    service: 'Damperli Nakliyat',
    bestFor: 'Malzeme çıkışı veya kabul temposu işin hızını belirliyorsa',
    siteNeed: 'Günlük sefer ritmi ve saha çevrimi kritikse',
    planningWeight: 'Yüksek',
  },
  {
    service: 'Lowbed Nakliyat',
    bestFor: 'Makine transferi ve etap geçişi gereken sahalar',
    siteNeed: 'Teslim saati ve güzergah uyumu önemliyse',
    planningWeight: 'Orta',
  },
  {
    service: 'Dolgu ve Zemin Hazırlığı',
    bestFor: 'Sonraki imalatların başlaması için saha kotu hazırlanacaksa',
    siteNeed: 'Serim, tesviye ve sıkıştırma birlikte düşünülüyorsa',
    planningWeight: 'Yüksek',
  },
]

export const projectMaturitySignals = [
  {
    title: 'Hazır olmayan proje sinyali',
    indicators: ['Metraj belirsiz', 'Saha erişimi konuşulmamış', 'Malzeme tipi net değil'],
    outcome: 'Teklif yüzeyde kalır ve iş başladıktan sonra kapsam kayması yaşanabilir.',
  },
  {
    title: 'Hazırlanan proje sinyali',
    indicators: ['Kazı veya taşıma hacmi tahmin edilmiş', 'Başlangıç takvimi belirlenmiş', 'Saha giriş-çıkışı düşünülmüş'],
    outcome: 'Doğru ekipman eşleşmesi ve daha gerçekçi çalışma planı kurulabilir.',
  },
  {
    title: 'Olgun proje sinyali',
    indicators: ['Günlük hedef tanımlı', 'Sevkiyat veya kabul noktası belli', 'Etap sırası net'],
    outcome: 'İşin toplam ritmi korunur, saha değişse bile plan daha kontrollü güncellenir.',
  },
]

export const kickoffQuestionGroups = [
  {
    title: 'Saha tanımı',
    questions: ['İş tam olarak nerede yapılacak?', 'Giriş-çıkış genişliği nasıl?', 'Aynı anda kaç araç sahada çalışabilir?'],
  },
  {
    title: 'İş hacmi',
    questions: ['Yaklaşık metraj veya kazı hacmi nedir?', 'Çıkan ya da gelen malzeme türü nedir?', 'İş tek seferde mi etap etap mı ilerleyecek?'],
  },
  {
    title: 'Takvim baskısı',
    questions: ['Başlangıç tarihi kesin mi?', 'Günlük hedef üretim var mı?', 'Başka ekiplerin çalışması bu işe bağlı mı?'],
  },
]

export const coordinationTriggers = [
  {
    trigger: 'Kazı hacmi beklenenden yüksek çıkarsa',
    response: 'Kamyon çevrimi ve çalışma süresi yeniden dengelenir; işin ritmi bozulmadan yeni yük dağılımı kurulur.',
  },
  {
    trigger: 'Saha erişimi gün içinde daralırsa',
    response: 'Makine sırası, yükleme yönü veya daha çevik ekipman kullanımı yeniden değerlendirilir.',
  },
  {
    trigger: 'Teslim tarihi öne çekilirse',
    response: 'Öncelikli alanlar ayrıştırılır ve günlük üretim hedefi buna göre sıkılaştırılır.',
  },
  {
    trigger: 'Malzeme kabul veya döküm noktası değişirse',
    response: 'Sefer süresi, kamyon adedi ve gün içi yükleme temposu yeni rotaya göre güncellenir.',
  },
]

export const mediaGalleryItems = [
  {
    type: 'image',
    title: 'Kazı ve yükleme çalışması',
    category: 'Hafriyat',
    image: '/images/gallery-1.jpg',
    tall: true,
  },
  {
    type: 'image',
    title: 'Şantiye çalışma alanı',
    category: 'Saha Planı',
    image: '/images/hero-main.jpg',
  },
  {
    type: 'image',
    title: 'Damperli sevkiyat akışı',
    category: 'Nakliyat',
    image: '/images/gallery-2.jpg',
  },
  {
    type: 'image',
    title: 'Yükleme ve malzeme yönetimi',
    category: 'Ekipman Kullanımı',
    image: '/images/gallery-3.jpg',
  },
  {
    type: 'image',
    title: 'Saha düzenleme görünümü',
    category: 'Zemin Hazırlığı',
    image: '/images/gallery-4.jpg',
    tall: true,
  },
  {
    type: 'image',
    title: 'Lowbed nakliyat hazırlığı',
    category: 'Ağır Taşıma',
    image: '/images/lowbed.jpg',
  },
]

export const footerServiceLinks = serviceDetails.map((service) => ({
  label: service.title,
  href: getServiceHref(service.slug),
}))
