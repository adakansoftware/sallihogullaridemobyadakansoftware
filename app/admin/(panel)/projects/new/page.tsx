import { ProjectForm } from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="section-eyebrow mb-4">Yeni Kayıt</div>
        <h1 className="font-display text-6xl text-white">Proje Oluştur</h1>
        <p className="mt-3 max-w-3xl text-white/60">Yeni referans projesini temel bilgiler ve kapak görseliyle oluşturun.</p>
      </div>

      <div className="industrial-border max-w-4xl rounded-[32px] bg-white/[0.04] p-6">
        <ProjectForm mode="create" />
      </div>
    </div>
  )
}
