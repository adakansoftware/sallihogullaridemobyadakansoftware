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

export const serviceCards = [
  {
    title: 'Hafriyat ve Kazı İşleri',
    description: 'Temel kazısı, kanal açma, parsel temizliği ve hafriyat çıkarma işlerinde kazı sınırı, makine erişimi, yükleme noktası ve döküm sevkiyatı işe başlamadan sahada netleştirilir.',
    image: '/images/project-1.jpg',
  },
  {
    title: 'Ekskavatör Çalışmaları',
    description: 'Kazı, yükleme, kırma, tesviye ve zemin hazırlığında zeminin durumuna, çalışma alanına ve günlük programa göre doğru ekskavatör gücü sahaya yönlendirilir.',
    image: '/images/excavator.jpg',
  },
  {
    title: 'Beko Loder Desteği',
    description: 'Dar alan kazıları, geri dolgu, küçük ölçekli yükleme, saha içi düzeltme ve malzeme toparlama işlerinde hızlı hareket eden beko loder desteği sağlanır.',
    image: '/images/backhoe.jpg',
  },
  {
    title: 'Damperli Nakliyat',
    description: 'Toprak, moloz, taş, kum, mıcır ve dolgu malzemesi taşımalarında kamyon akışı; yükleme noktası, döküm sahası ve günlük iş temposuna göre kurulur.',
    image: '/images/dump-truck.jpg',
  },
  {
    title: 'Lowbed Nakliyat',
    description: 'Ekskavatör, beko loder ve ağır ekipman sevkiyatında yükleme güvenliği, güzergah uygunluğu ve teslim saati dikkate alınarak lowbed planı hazırlanır.',
    image: '/images/lowbed.jpg',
  },
  {
    title: 'Dolgu ve Zemin Hazırlığı',
    description: 'Yol, altyapı, parsel ve şantiye hazırlıklarında dolgu sevkiyatı, serim düzeni, sıkıştırma ihtiyacı ve tesviye süreci aynı saha planında ele alınır.',
    image: '/images/project-2.jpg',
  },
]

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
    description: 'Temel kazısı, yükleme, kanal açma ve zemin hazırlığında farklı saha koşullarına göre yönlendirilen Sumitomo SH 360, Sumitomo SH 210 ve Case CX130C ekskavatör grubu.',
    specs: ['Sumitomo SH 360 x2', 'Sumitomo SH 210 x2', 'Case CX130C x1'],
    image: '/images/excavator.jpg',
  },
  {
    name: 'Beko Loder',
    count: '2',
    capacity: 'Saha Destek',
    description: 'Dar alan kazısı, geri dolgu, yükleme ve saha içi düzenleme işlerinde kullanılan Hidromek 4CX ve 3CX beko loder desteği.',
    specs: ['Hidromek 4CX x1', 'Hidromek 3CX x1', 'Geri Dolgu ve Yükleme'],
    image: '/images/backhoe.jpg',
  },
  {
    name: 'Damperli Nakliye Filosu',
    count: '17',
    capacity: 'Damperli Nakliye',
    description: 'Hafriyat, dolgu, kum, taş, mıcır ve toprak sevkiyatında düzenli yükleme ve döküm akışı için kullanılan Mercedes Arocs, Mercedes Axor ve BMC Pro damperli kamyon grubu.',
    specs: ['Arocs 3345 x4', 'Axor 3340 x12', 'BMC Pro 827 x1'],
    image: '/images/dump-truck.jpg',
  },
  {
    name: 'Çekici ve Dorse',
    count: '5',
    capacity: 'Damperli Dorse / Lowbed',
    description: 'Malzeme sevkiyatı, ekipman taşıma ve lowbed nakliyat işlerinde güzergah, yükleme güvenliği ve teslim planına göre kullanılan Axor 1840 çekici, damperli dorse ve lowbed altyapısı.',
    specs: ['Axor 1840 x2', 'Damperli Dorse x2', 'Lowbed x1'],
    image: '/images/lowbed.jpg',
  },
  {
    name: 'Arazöz',
    count: '1',
    capacity: 'Su Tankeri / Arazöz',
    description: 'Şantiye içi sulama, yol temizliği, toz kontrolü ve saha destek ihtiyaçları için kullanılan Ford 2524 su tankeri / arazöz.',
    specs: ['Ford 2524 x1', 'Su Tankeri / Arazöz', 'Toz Kontrolü'],
    image: '/images/dump-truck.jpg',
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

export const footerServiceLinks = [
  'Hafriyat ve Kazı İşleri',
  'Damperli Nakliyat',
  'Dolgu ve Zemin Hazırlığı',
  'İş Makinesi Desteği',
  'Lowbed Nakliyat',
  'Arazöz / Su Tankeri',
  'Altyapı Kazıları',
]
