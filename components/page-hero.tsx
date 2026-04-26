import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  image: string
  primaryCta?: {
    href: string
    label: string
  }
}

export function PageHero({ eyebrow, title, description, image, primaryCta }: PageHeroProps) {
  const isExternal = Boolean(primaryCta?.href.startsWith('http'))

  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover" priority quality={95} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="pointer-events-none absolute -top-12 right-[12%] h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-[18%] h-72 w-72 rounded-full bg-primary/6 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="glass-surface mb-8 inline-flex items-center gap-4 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</span>
          </div>

          <h1 className="max-w-4xl text-4xl leading-[0.95] font-black tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl xl:text-[5rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground lg:text-xl">{description}</p>

          {primaryCta ? (
            <div className="mt-10">
              {isExternal ? (
                <a href={primaryCta.href} target="_blank" rel="noreferrer" className="btn-premium inline-flex min-h-14 max-w-full items-center gap-3 whitespace-normal px-6 text-center sm:px-8">
                  {primaryCta.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              ) : (
                <Link href={primaryCta.href} className="btn-premium inline-flex min-h-14 max-w-full items-center gap-3 whitespace-normal px-6 text-center sm:px-8">
                  {primaryCta.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
