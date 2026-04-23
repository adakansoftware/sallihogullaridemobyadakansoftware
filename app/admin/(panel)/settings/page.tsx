import { SettingsForm } from '@/components/admin/SettingsForm'
import { readSettings } from '@/lib/store'

export default async function AdminSettingsPage() {
  const settings = await readSettings()

  return (
    <div>
      <div className="mb-6">
        <div className="section-eyebrow mb-4">Kurumsal Ayarlar</div>
        <h1 className="font-display text-6xl text-white">Site Ayarları</h1>
        <p className="mt-3 max-w-3xl text-white/60">Marka, iletişim ve ana sayfa metinlerini buradan güncelleyin.</p>
      </div>

      <div className="industrial-border max-w-5xl rounded-[32px] bg-white/[0.04] p-6">
        <SettingsForm initialValues={settings} />
      </div>
    </div>
  )
}
