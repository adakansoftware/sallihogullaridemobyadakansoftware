export type FleetModel = {
  name: string
  quantity: string
  role: string
  details: string
  image?: string
}

export type FleetItem = {
  slug: string
  name: string
  count: string
  capacity: string
  description: string
  specs: string[]
  image: string
  detailTitle: string
  detailDescription: string
  models: FleetModel[]
}

export const fleetItems: FleetItem[] = [
  {
    slug: 'ekskavator',
    name: 'Ekskavatör',
    count: '5',
    capacity: '13-36 Ton',
    description:
      'Temel kazısı, yükleme, kanal açma ve zemin hazırlığında farklı saha koşullarına göre yönlendirilen Sumitomo SH 360, Sumitomo SH 210 ve Case CX130C ekskavatör grubu.',
    specs: ['Sumitomo SH 360 x2', 'Sumitomo SH 210 x2', 'Case CX130C x1'],
    image: '/images/excavator.jpg',
    detailTitle: 'Ekskavatör filosunun model dağılımı',
    detailDescription:
      'Kazı derinliği, erişim alanı, yükleme temposu ve zemin koşuluna göre ekskavatör grubunu farklı modellerle sahaya planlı şekilde dağıtıyoruz.',
    models: [
      {
        name: 'Sumitomo SH 360',
        quantity: '2 Adet',
        role: 'Ağır kazı ve yükleme',
        details:
          'Geniş hacimli kazı, sert zemin açma ve kamyon yükleme temposunun yüksek olduğu sahalarda kullanılan ana ekskavatör grubudur.',
        image: '/images/project-hika-excavator-1.jpg',
      },
      {
        name: 'Sumitomo SH 210',
        quantity: '2 Adet',
        role: 'Dengeli saha operasyonu',
        details:
          'Kanal açma, temel kazı ve orta ölçekli yükleme işlerinde hareket kabiliyeti ile verimli çalışan operasyon modelidir.',
        image: '/images/project-hika-excavator-3.jpg',
      },
      {
        name: 'Case CX130C',
        quantity: '1 Adet',
        role: 'Dar alan ve hassas kazı',
        details:
          'Alan kısıtlı şantiyelerde, kontrollü kazı ve zemin düzenleme gereken noktalarda daha hassas müdahale için kullanılır.',
        image: '/images/project-hika-excavator-5.jpg',
      },
    ],
  },
  {
    slug: 'beko-loder',
    name: 'Beko Loder',
    count: '2',
    capacity: 'Saha Destek',
    description:
      'Dar alan kazısı, geri dolgu, yükleme ve saha içi düzenleme işlerinde kullanılan Hidromek HMK 102 B Alpha ve Hidromek HMK 102 S Alpha beko loder desteği.',
    specs: ['Hidromek HMK 102 B Alpha x1', 'Hidromek HMK 102 S Alpha x1', 'Geri Dolgu ve Yükleme'],
    image: '/images/backhoe.jpg',
    detailTitle: 'Beko loder grubunun saha görevleri',
    detailDescription:
      'Dar alan erişimi, kısa mesafeli yükleme ve saha içi düzenleme ihtiyaçlarında iki farklı beko loder modeliyle hızlı destek sağlıyoruz.',
    models: [
      {
        name: 'Hidromek HMK 102 B Alpha',
        quantity: '1 Adet',
        role: 'Kazma ve geri dolgu',
        details:
          'Dar çalışma alanlarında kazma, hendek düzeltme ve geri dolgu uygulamalarında sahaya esnek destek verir.',
        image: '/images/backhoe.jpg',
      },
      {
        name: 'Hidromek HMK 102 S Alpha',
        quantity: '1 Adet',
        role: 'Yükleme ve saha düzenleme',
        details:
          'Malzeme toplama, saha içi taşıma ve düzenleme işlerinde günlük şantiyenin akışını hızlandırır.',
        image: '/images/backhoe.jpg',
      },
      {
        name: 'Operasyon Kapsamı',
        quantity: '2 Makine ile',
        role: 'Esnek saha desteği',
        details:
          'İki makine birlikte planlandığında aynı anda hem kazma hem yükleme yapılarak saha içi bekleme süresi azaltılır.',
        image: '/images/backhoe.jpg',
      },
    ],
  },
  {
    slug: 'damperli-nakliye-filosu',
    name: 'Damperli Nakliye Filosu',
    count: '17',
    capacity: 'Damperli Nakliye',
    description:
      'Hafriyat, dolgu, kum, taş, mıcır ve toprak sevkiyatında düzenli yükleme ve döküm akışı için kullanılan Mercedes Arocs, Mercedes Axor ve BMC Pro damperli kamyon grubu.',
    specs: ['Arocs 3345 x4', 'Axor 3340 x12', 'BMC Pro 827 x1'],
    image: '/images/dump-truck.jpg',
    detailTitle: 'Damperli nakliye filosunun araç dağılımı',
    detailDescription:
      'Sevkiyat temposu, yükleme noktası ve döküm rotasına göre farklı tonaj ve kullanım yapısına sahip kamyonları aynı plan altında yönetiyoruz.',
    models: [
      {
        name: 'Mercedes Arocs 3345',
        quantity: '4 Adet',
        role: 'Yoğun sevkiyat hattı',
        details:
          'Yüksek hacimli hafriyat ve dolgu taşımalarında günlük sirkülasyonu korumak için ana sevkiyat omurgasını oluşturur.',
        image: '/images/dump-truck.jpg',
      },
      {
        name: 'Mercedes Axor 3340',
        quantity: '12 Adet',
        role: 'Saha ana taşıma gücü',
        details:
          'Toprak, kum, taş ve mıcır taşımalarında filonun büyük bölümünü oluşturarak düzenli sevkiyat akışı sağlar.',
        image: '/images/dump-truck.jpg',
      },
      {
        name: 'BMC Pro 827',
        quantity: '1 Adet',
        role: 'Tamamlayıcı destek aracı',
        details:
          'Planlanan sevkiyat temposuna destek vererek farklı saha yoğunluklarında operasyon esnekliği sunar.',
        image: '/images/dump-truck.jpg',
      },
    ],
  },
  {
    slug: 'cekici-ve-dorse',
    name: 'Çekici ve Dorse',
    count: '5',
    capacity: 'Damperli Dorse / Lowbed',
    description:
      'Malzeme sevkiyatı, ekipman taşıma ve lowbed nakliyat işlerinde güzergah, yükleme güvenliği ve teslim planına göre kullanılan Axor 1840 çekici, damperli dorse ve lowbed altyapısı.',
    specs: ['Axor 1840 x2', 'Damperli Dorse x2', 'Lowbed x1'],
    image: '/images/fleet-tir-damper.png',
    detailTitle: 'Çekici ve dorse altyapısının taşıma kalemleri',
    detailDescription:
      'Ağır ekipman nakli, uzun mesafe malzeme sevkiyatı ve yük güvenliği gerektiren işlerde farklı taşıma ekipmanlarını birlikte kullanıyoruz.',
    models: [
      {
        name: 'Mercedes Axor 1840',
        quantity: '2 Adet',
        role: 'Çekici ana gücü',
        details:
          'Damperli dorse ve lowbed taşımalarında rota planına uygun çekiş gücünü ve operasyon devamlılığını sağlar.',
        image: '/images/fleet-tir-damper.png',
      },
      {
        name: 'Damperli Dorse',
        quantity: '2 Adet',
        role: 'Malzeme sevkiyatı',
        details:
          'Toplu malzeme taşıma, kontrollü boşaltım ve düzenli sevkiyat akışı gereken operasyonlarda kullanılır.',
        image: '/images/fleet-tir-damper.png',
      },
      {
        name: 'Lowbed',
        quantity: '1 Adet',
        role: 'Ağır ekipman nakli',
        details:
          'İş makinesi ve ağır saha ekipmanlarının emniyetli şekilde lokasyonlar arasında taşınması için kullanılır.',
        image: '/images/lowbed.jpg',
      },
    ],
  },
  {
    slug: 'arazoz',
    name: 'Arazöz',
    count: '1',
    capacity: 'Su Tankeri / Arazöz',
    description: 'Şantiye içi sulama, yol temizliği, toz kontrolü ve saha destek ihtiyaçları için kullanılan Ford 2524 su tankeri / arazöz.',
    specs: ['Ford 2524 x1', 'Su Tankeri / Arazöz', 'Toz Kontrolü'],
    image: '/images/fleet-arazoz-truck.png',
    detailTitle: 'Arazöz aracının kullanım kapsamı',
    detailDescription:
      'Şantiye içi toz kontrolü, yol sulama ve temizlik ihtiyaçlarında tek araçla birden fazla saha destek görevini karşılıyoruz.',
    models: [
      {
        name: 'Ford 2524',
        quantity: '1 Adet',
        role: 'Su tankeri platformu',
        details:
          'Saha içi sulama, servis yolu ıslatma ve şantiyede operasyonu destekleyen temel arazöz aracıdır.',
        image: '/images/fleet-arazoz-truck.png',
      },
      {
        name: 'Toz Kontrolü',
        quantity: 'Görev Modu',
        role: 'Çalışma alanı konforu',
        details:
          'Yükleme, boşaltım ve kamyon geçiş yoğunluğu olan alanlarda tozun kontrol altında tutulmasını sağlar.',
        image: '/images/fleet-arazoz-truck.png',
      },
      {
        name: 'Yol ve Saha Temizliği',
        quantity: 'Görev Modu',
        role: 'Saha düzeni',
        details:
          'Şantiye içi yolların temiz tutulması ve malzeme kaynaklı kirlenmenin azaltılması için destek verir.',
        image: '/images/fleet-arazoz-truck.png',
      },
    ],
  },
  {
    slug: 'toprak-silindiri',
    name: 'Toprak Silindiri',
    count: '1',
    capacity: 'Zemin Sıkıştırma',
    description:
      'Dolgu, yol altyapısı, saha düzenleme ve platform hazırlığında zemin sıkıştırma ihtiyacını kontrollü şekilde karşılayan Sakai marka toprak silindiri desteği.',
    specs: ['Sakai', 'Toprak Silindiri', 'Zemin Sıkıştırma'],
    image: '/images/fleet-silindir-sakai.jpg',
    detailTitle: 'Toprak silindirinin uygulama detayları',
    detailDescription:
      'Dolgu oturtma, saha platformu hazırlama ve yol alt yapısında zeminin kontrollü sıkıştırılması için silindir desteği sunuyoruz.',
    models: [
      {
        name: 'Sakai Silindir',
        quantity: '1 Adet',
        role: 'Zemin sıkıştırma',
        details:
          'Dolgu alanlarında katmanların oturması ve üst uygulamaya uygun zemin dayanımının sağlanması için kullanılır.',
        image: '/images/fleet-silindir-sakai.jpg',
      },
      {
        name: 'Platform Hazırlığı',
        quantity: 'Uygulama Alanı',
        role: 'Saha düzleme sonrası sıkıştırma',
        details:
          'Şantiye içi platformların makine ve kamyon trafiğine hazır hale gelmesinde düzenli bir son aşama sunar.',
        image: '/images/fleet-silindir-sakai.jpg',
      },
      {
        name: 'Yol Alt Yapısı',
        quantity: 'Uygulama Alanı',
        role: 'Taşıyıcı zemin kurulumu',
        details:
          'Servis yolu ve alt yapı çalışmalarında malzemenin kontrollü oturmasına yardımcı olur.',
        image: '/images/fleet-silindir-sakai.jpg',
      },
    ],
  },
]

export function getFleetHref(slug: string) {
  return `/fleet/${slug}`
}

export function findFleetBySlug(slug: string) {
  return fleetItems.find((item) => item.slug === slug)
}
