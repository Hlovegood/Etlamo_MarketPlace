import { useState } from 'react'
import { Check, ImagePlus, Lock, Upload, X } from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { CATEGORIES, SAMPLE_LIBRARY } from '../lib/seed'
import { cx, readImage } from '../lib/format'
import { Button, Chip, Container, Empty, PageHeader, SmoothInput, useToast } from '../components/ui'

export default function NewProject() {
  const { me, addProject } = useStore()
  const { t } = useI18n()
  const toast = useToast()
  const [f, setF] = useState({ title: '', category: 'Wedding', location: '', date: '', guests: '', description: '', tags: '' })
  const [images, setImages] = useState([])
  const [busy, setBusy] = useState(false)

  if (me?.role !== 'planner')
    return (
      <Container className="py-24">
        <Empty icon={<Lock size={24} />} title="Portfolios are for planners" body="Create a planner account to publish your work." action={<Button onClick={() => navigate(me ? '/dashboard' : '/signup?role=planner')}>{me ? t('nav_dashboard', 'Go to dashboard') : t('how_planner_cta', 'Join as a planner')}</Button>} />
      </Container>
    )

  const valid = f.title.trim() && f.location.trim() && f.description.trim() && images.length > 0
  const toggle = (src) => setImages((xs) => (xs.includes(src) ? xs.filter((x) => x !== src) : [...xs, src]))

  const upload = async (files) => {
    if (!files?.length) return
    setBusy(true)
    try {
      const data = await Promise.all([...files].slice(0, 6).map((file) => readImage(file)))
      setImages((xs) => [...xs, ...data])
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const p = addProject({
      title: f.title.trim(),
      category: f.category,
      location: f.location.trim(),
      date: f.date ? new Date(f.date + '-01T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent',
      guests: Number(f.guests) || 0,
      description: f.description.trim(),
      images,
      tags: f.tags.split(',').map((item) => item.trim()).filter(Boolean),
    })
    toast(me.verification === 'verified' ? 'Project published' : 'Project saved. It goes live once you’re verified.')
    navigate(`/project/${p.id}`)
  }

  return (
    <Container className="max-w-[880px]">
      <PageHeader eyebrow={t('nav_add_project', 'New project')} title="Show your work." sub="Big, beautiful images do the talking. Add a few words about the brief and how you delivered it." />
      {me.verification !== 'verified' && (
        <p className="-mt-2 mb-8 rounded-2xl bg-[#fff4e5] dark:bg-[#342410] dark:border dark:border-[#5a3e1a] px-5 py-3.5 text-[14px] text-[#7a4100] dark:text-[#ffbe76]">
          {t('dash_keep_adding_projects', 'You can build your portfolio now. Projects appear in Explore once your verification is approved.')}
        </p>
      )}
      <form onSubmit={submit} className="space-y-8">
        <div>
          <label className="label">Images <span className="font-normal text-silver">· the first one is your cover</span></label>
          {images.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((src, i) => (
                <div key={src.slice(-40) + i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist dark:bg-card-border/60">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-white/90 dark:bg-black/90 px-2 py-0.5 text-[11px] font-semibold text-ink">Cover</span>}
                  <button type="button" onClick={() => setImages((xs) => xs.filter((_, j) => j !== i))} aria-label="Remove" className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-hairline dark:border-card-border px-6 py-10 text-center transition hover:border-azure">
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
            <Upload size={26} className="text-silver" />
            <span className="mt-3 text-[15px] font-semibold text-ink">{busy ? 'Processing…' : 'Upload photos'}</span>
            <span className="text-[13px] text-graphite">JPG or PNG, up to 6 at a time</span>
          </label>
          <p className="mt-5 mb-3 flex items-center gap-1.5 text-[13px] font-medium text-graphite">
            <ImagePlus size={14} /> Or pick from the sample library
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {SAMPLE_LIBRARY.map((src) => {
              const on = images.includes(src)
              return (
                <button key={src} type="button" onClick={() => toggle(src)} className={cx('relative aspect-square cursor-pointer overflow-hidden rounded-xl transition', on && 'ring-3 ring-azure ring-offset-2')}>
                  <img src={src.replace('w=1400', 'w=300')} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {on && (
                    <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-azure text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="label">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={f.category === c} onClick={() => setF({ ...f, category: c })}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="t">Project title</label>
          <SmoothInput id="t" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Rooftop Vows at Golden Hour" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="l">Location</label>
            <SmoothInput id="l" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="City, State" />
          </div>
          <div>
            <label className="label" htmlFor="d">When</label>
            <SmoothInput id="d" type="month" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="g">Guests</label>
            <SmoothInput id="g" type="number" min={0} value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} placeholder="120" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="desc">The story</label>
          <textarea id="desc" rows={5} className="field resize-none leading-relaxed" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="The brief, the design decisions, and what made it special." />
        </div>
        <div>
          <label className="label" htmlFor="tags">Tags <span className="font-normal text-silver">· comma separated</span></label>
          <SmoothInput id="tags" value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="Garden, Black tie, Candlelight" />
        </div>
        <div className="flex justify-end gap-2 border-t border-black/[0.06] dark:border-card-border pt-6">
          <Button type="button" variant="secondary" size="lg" onClick={() => history.back()}>
            {t('contact_cancel', 'Cancel')}
          </Button>
          <Button type="submit" size="lg" disabled={!valid}>
            {me.verification === 'verified' ? 'Publish project' : 'Save project'}
          </Button>
        </div>
      </form>
    </Container>
  )
}