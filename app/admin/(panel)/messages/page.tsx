import { AdminMessagesManager } from '@/components/admin/AdminMessagesManager'
import { readMessages } from '@/lib/store'

export default async function AdminMessagesPage() {
  const messages = await readMessages()
  const unreadCount = messages.filter((message) => !message.isRead).length

  return (
    <div className="space-y-8">
      <div>
        <div className="section-eyebrow mb-4">Talep Yönetimi</div>
        <h1 className="font-display text-6xl text-white">Mesajlar</h1>
        <p className="mt-3 max-w-3xl text-white/60">Teklif taleplerini ve iletişim mesajlarını buradan takip edin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Toplam Mesaj</div>
          <div className="mt-3 text-4xl font-black text-white">{messages.length}</div>
        </div>
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Okunmamış</div>
          <div className="mt-3 text-4xl font-black text-white">{unreadCount}</div>
        </div>
        <div className="industrial-border rounded-[24px] bg-white/[0.04] p-5">
          <div className="data-label text-white/40">Bugün Gelen</div>
          <div className="mt-3 text-4xl font-black text-white">
            {messages.filter((item) => new Date(item.createdAt).toDateString() === new Date().toDateString()).length}
          </div>
        </div>
      </div>

      <AdminMessagesManager messages={messages} />
    </div>
  )
}
