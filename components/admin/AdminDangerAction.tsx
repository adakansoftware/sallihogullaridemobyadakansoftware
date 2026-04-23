"use client";

import { type MouseEvent, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type AdminDangerActionProps = {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => Promise<void>
  className?: string
}

export function AdminDangerAction({
  triggerLabel,
  title,
  description,
  confirmLabel,
  onConfirm,
  className = '',
}: AdminDangerActionProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')

    try {
      await onConfirm()
      setOpen(false)
      toast.success('Islem tamamlandi.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Islem tamamlanamadi.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className={className} type="button">
          {triggerLabel}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#090909] p-0 text-white shadow-[0_24px_80px_-28px_rgba(0,0,0,0.8)]">
        <div className="rounded-[28px] border border-white/8 bg-white/[0.025] p-7">
          <AlertDialogHeader className="text-left">
            <div className="section-eyebrow mb-3">Onay gerekli</div>
            <AlertDialogTitle className="font-display text-3xl text-white">{title}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm leading-7 text-white/60">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error ? (
            <div role="alert" className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <AlertDialogFooter className="mt-7">
            <AlertDialogCancel className="h-11 rounded-2xl border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">
              Vazgec
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-premium h-11 rounded-2xl border-amber-300/30 bg-[linear-gradient(135deg,rgba(245,158,11,0.92),rgba(217,119,6,0.94))] px-5 text-[0.75rem] text-black hover:brightness-110"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Isleniyor...' : confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
