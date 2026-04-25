"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/store'

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Teklif Talebi',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)

  const [days, hours] = settings.workingHours.split('/').map((item) => item.trim())
  const contactInfo = [
    { icon: Phone, label: 'Telefon', value: settings.contactPhone, subValue: settings.contactPhoneSecondary },
    { icon: Mail, label: 'E-posta', value: settings.contactEmail, subValue: settings.contactEmailSecondary },
    { icon: MapPin, label: 'Adres', value: settings.address, subValue: settings.serviceArea },
    { icon: Clock, label: 'Çalışma Saatleri', value: days || settings.workingHours, subValue: hours || '' },
  ]

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setFeedback('')
    setError('')
    setReference('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const message = data.message || 'Talebiniz şu anda gönderilemedi.'
        setError(message)
        toast.error(message)
        return
      }

      const message = data.message || 'Talebiniz başarıyla alındı.'
      setFeedback(message)
      setReference(data.reference || '')
      toast.success('Talebiniz alındı.')
      setForm({
        name: '',
        phone: '',
        email: '',
        subject: 'Teklif Talebi',
        message: '',
      })
      setMarketingConsent(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="iletisim" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">İletişim</span>
          <h2 className="mb-6 text-3xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
            Sahanız için <span className="text-primary">net teklif ve planlama</span>
          </h2>
          <p className="text-lg text-muted-foreground">Lokasyon, metraj, malzeme türü ve ihtiyaç duyduğunuz iş kapsamını paylaşın; doğru ekipman ve sevkiyat planını birlikte netleştirelim.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="glass-card p-8 lg:col-span-3 lg:p-10">
            <h3 className="mb-2 text-xl font-bold text-foreground">Teklif Formu</h3>
            <p className="mb-8 text-muted-foreground">{settings.quoteNotice}</p>

            <form className="space-y-5" onSubmit={handleSubmit} aria-busy={loading}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-foreground">Ad Soyad</label>
                  <input id="contact-name" type="text" placeholder="Adınız Soyadınız" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required autoComplete="name" className="w-full border border-border/50 bg-input px-4 py-3.5 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-foreground">Telefon</label>
                  <input id="contact-phone" type="tel" placeholder="(5XX) XXX XX XX" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} required autoComplete="tel" className="w-full border border-border/50 bg-input px-4 py-3.5 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-foreground">E-posta</label>
                  <input id="contact-email" type="email" placeholder="ornek@email.com" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required autoComplete="email" className="w-full border border-border/50 bg-input px-4 py-3.5 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-foreground">Konu</label>
                  <input id="contact-subject" type="text" placeholder="Örn. Damperli nakliyat, temel kazısı, dolgu" value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} required className="w-full border border-border/50 bg-input px-4 py-3.5 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-foreground">Proje Detayları</label>
                <textarea id="contact-message" rows={4} placeholder="Saha lokasyonu, yaklaşık metraj, taşınacak malzeme, ihtiyaç duyulan makine veya çalışma tarihi hakkında kısa bilgi verin..." value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} required className="w-full resize-none border border-border/50 bg-input px-4 py-3.5 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>

              {error ? <p className="text-sm text-red-400" role="alert" aria-live="assertive">{error}</p> : null}
              {feedback ? <p className="text-sm text-emerald-300" role="status" aria-live="polite">{feedback}</p> : null}
              {reference ? <p className="text-sm text-white/55" role="status" aria-live="polite">Talep referansı: <span className="font-medium text-white">{reference}</span></p> : null}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/60">
                Kişisel verileriniz, talebinizin değerlendirilmesi ve sizinle iletişime geçilmesi amacıyla işlenmektedir. Detaylı bilgi için{' '}
                <Link href="/kvkk-aydinlatma-metni" className="font-medium text-white underline decoration-white/20 underline-offset-4 transition hover:decoration-white">
                  KVKK Aydınlatma Metni&apos;ni
                </Link>{' '}
                inceleyebilirsiniz.
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-white/65">
                <input type="checkbox" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} className="mt-1" />
                <span>Bilgilendirme ve teklif süreciyle ilgili ticari elektronik iletilerin tarafıma gönderilmesini kabul ediyorum.</span>
              </label>

              <Button size="lg" disabled={loading} className="h-14 w-full gap-2 bg-primary text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
                {loading ? 'Gönderiliyor...' : 'Teklif Talebi Gönder'}
              </Button>
            </form>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((info) => (
              <div key={info.label} className="glass-card p-6 transition-colors hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{info.label}</div>
                    {info.label === 'Telefon' ? (
                      <>
                        <a href={`tel:${String(info.value).replace(/\s+/g, '')}`} className="font-semibold text-foreground transition-colors hover:text-primary">{info.value}</a>
                        <a href={`tel:${String(info.subValue).replace(/\s+/g, '')}`} className="block text-sm text-muted-foreground transition-colors hover:text-primary">{info.subValue}</a>
                      </>
                    ) : info.label === 'E-posta' ? (
                      <>
                        <a href={`mailto:${info.value}`} className="font-semibold text-foreground transition-colors hover:text-primary">{info.value}</a>
                        <a href={`mailto:${info.subValue}`} className="block text-sm text-muted-foreground transition-colors hover:text-primary">{info.subValue}</a>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-foreground">{info.value}</div>
                        <div className="text-sm text-muted-foreground">{info.subValue}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-primary p-6">
              <h4 className="mb-2 text-lg font-bold text-primary-foreground">Hızlı Operasyon Hattı</h4>
              <p className="mb-4 text-sm text-primary-foreground/80">Acil sevkiyat, saha keşfi veya iş makinesi yönlendirmesi için doğrudan iletişime geçebilirsiniz.</p>
              <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="group flex items-center justify-between font-bold text-primary-foreground">
                <span>WhatsApp Üzerinden Ulaşın</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
