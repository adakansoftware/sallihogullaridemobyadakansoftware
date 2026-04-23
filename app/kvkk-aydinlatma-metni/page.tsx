import type { Metadata } from 'next'
import { SiteFrame } from '@/components/site-frame'
import { getCanonicalUrl } from '@/lib/seo'
import { readSettings } from '@/lib/store'

export const metadata: Metadata = {
  title: 'KVKK Aydinlatma Metni',
  description: 'Iletisim ve teklif formlari kapsaminda islenen kisisel verilere iliskin aydinlatma metni.',
  alternates: {
    canonical: getCanonicalUrl('/kvkk-aydinlatma-metni'),
  },
  openGraph: {
    url: getCanonicalUrl('/kvkk-aydinlatma-metni'),
  },
}

export default async function KvkkPage() {
  const settings = await readSettings()

  return (
    <SiteFrame settings={settings}>
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-8">
          <div className="glass-card p-8 md:p-10 lg:p-12">
            <div className="section-eyebrow mb-4">KVKK</div>
            <h1 className="font-display text-4xl text-white md:text-5xl">Kisisel Verilerin Korunmasi Aydinlatma Metni</h1>
            <div className="mt-8 space-y-8 text-sm leading-8 text-white/72 md:text-base">
              <p>
                6698 sayili Kisisel Verilerin Korunmasi Kanunu (“KVKK”) uyarinca, kisisel verileriniz veri sorumlusu sifatiyla{' '}
                <span className="font-semibold text-white">{settings.companyName || '[SIRKET UNVANI]'}</span> tarafindan islenebilecektir.
              </p>

              <div>
                <h2 className="text-lg font-semibold text-white">Islenen veriler</h2>
                <p className="mt-2">Ad-soyad, telefon, e-posta, firma adi, mesaj/talep icerigi, islem guvenligi verileri.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Isleme amaclari</h2>
                <p className="mt-2">
                  Iletisim taleplerinin alinmasi ve cevaplanmasi, teklif/hizmet taleplerinin degerlendirilmesi, musteri iliskileri sureclerinin
                  yurutulmesi, bilgi guvenligi sureclerinin yurutulmesi, hukuki yukumluluklerin yerine getirilmesi, olasi uyusmazliklarda ispat
                  sureclerinin yurutulmesi.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Toplama yontemi ve hukuki sebep</h2>
                <p className="mt-2">
                  Veriler; internet sitesi formlari ve elektronik iletisim kanallari uzerinden elektronik ortamda toplanir. KVKK m.5 kapsaminda
                  sozlesmenin kurulmasi/ifasi, hukuki yukumluluklerin yerine getirilmesi, bir hakkin tesisi/kullanilmasi/korunmasi ve veri
                  sorumlusunun mesru menfaati hukuki sebeplerine dayanilarak islenebilir.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Aktarim</h2>
                <p className="mt-2">
                  Kisisel veriler, mevzuata uygun olarak yetkili kamu kurum ve kuruluslarina, hukuken yetkili mercilere, teknik hizmet alinan
                  tedarikcilere ve is surecleri kapsaminda hizmet alinan is ortaklarina aktarilabilir.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Saklama</h2>
                <p className="mt-2">
                  Kisisel veriler, isleme amacinin gerektirdigi sure ve ilgili mevzuattaki saklama sureleri boyunca muhafaza edilir; sonrasinda
                  silinir, yok edilir veya anonim hale getirilir.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Haklar</h2>
                <p className="mt-2">
                  Ilgili kisi, KVKK m.11 kapsamindaki haklarini kullanabilir; verilerinin islenip islenmedigini ogrenme, bilgi talep etme,
                  duzeltme, silme/yok etme, aktarilan ucuncu kisileri ogrenme, otomatik analiz sonucuna itiraz etme ve zararin giderilmesini talep
                  etme haklarina sahiptir.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Basvuru</h2>
                <p className="mt-2">
                  Basvurular{' '}
                  <a href={`mailto:${settings.contactEmail || '[E-POSTA]'}`} className="text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white">
                    {settings.contactEmail || '[E-POSTA]'}
                  </a>{' '}
                  ve/veya <span className="font-medium text-white">{settings.address || '[ADRES]'}</span> uzerinden yapilabilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
