import { useState } from 'react'
import { BadgeCheck, Check, Clock, FileCheck2, FileUp, ShieldCheck, ShieldX, UserRound, XCircle } from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { useI18n } from '../lib/i18n'
import { SPECIALTIES } from '../lib/seed'
import { cx, timeAgo } from '../lib/format'
import { Avatar, Button, Chip, Container, Empty, Modal, PageHeader, Verified, useToast } from '../components/ui'

const STEPS = ['Business', 'Credentials', 'Review']

export function Verify() {
  const { me } = useStore()
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)

  if (!me || me.role !== 'planner')
    return (
      <Container className="py-24">
        <Empty
          icon={<ShieldCheck size={24} />}
          title="Verification is for planners"
          body={me ? 'Client accounts don’t need verification.' : 'Create a planner account to apply for the verified badge.'}
          action={<Button onClick={() => navigate(me ? '/dashboard' : '/signup?role=planner')}>{me ? t('nav_dashboard', 'Go to dashboard') : t('how_planner_cta', 'Join as a planner')}</Button>}
        />
      </Container>
    )

  const status = me.verification ?? 'none'
  if (status === 'none' || editing) return <VerifyForm me={me} onDone={() => setEditing(false)} />
  return <VerifyStatus me={me} onResubmit={() => setEditing(true)} />
}

function VerifyForm({ me, onDone }) {
  const { submitVerification } = useStore()
  const { t } = useI18n()
  const toast = useToast()
  const prev = me.application
  const [step, setStep] = useState(0)
  const [f, setF] = useState({
    business: prev?.business ?? me.business ?? '',
    location: prev?.location ?? me.location ?? '',
    yearsExp: prev?.yearsExp ?? me.yearsExp ?? 1,
    specialties: prev?.specialties ?? me.specialties ?? [],
    website: prev?.website ?? me.website ?? '',
    bio: prev?.bio ?? me.bio ?? '',
    licenseNumber: prev?.licenseNumber ?? '',
    idFileName: prev?.idFileName ?? '',
    insuranceFileName: prev?.insuranceFileName ?? '',
    referenceName: prev?.referenceName ?? '',
    referenceContact: prev?.referenceContact ?? '',
  })
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const stepValid = [
    f.business.trim() && f.location.trim() && f.specialties.length > 0 && f.bio.trim().length >= 30,
    f.licenseNumber.trim() && f.idFileName && f.insuranceFileName && f.referenceName.trim() && f.referenceContact.trim(),
    true,
  ][step]

  const submit = () => {
    submitVerification(f)
    toast('Application submitted')
    onDone()
  }

  const stepLabels = [
    t('verify_step_business', 'Business'),
    t('verify_step_credentials', 'Credentials'),
    t('verify_step_review', 'Review'),
  ]

  return (
    <Container className="max-w-[760px]">
      <PageHeader eyebrow={t('nav_verification', 'Planner verification')} title={t('verify_badge_title', 'Get your verified badge.')} sub={t('verify_badge_sub', 'Verified planners can message clients, appear in search and show the badge on every project.')} />
      {me.verification === 'rejected' && me.application?.rejectionReason && (
        <div className="mb-8 rounded-2xl bg-[#fbeaea] dark:bg-[#3a1b1b] px-5 py-4 text-[14px] text-[#c4271b] dark:text-[#ff8a8a]">
          <strong>Previous application declined:</strong> {me.application.rejectionReason}
        </div>
      )}

      {/* Stepper */}
      <ol className="mb-10 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3">
            <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition', i < step ? 'bg-azure text-white' : i === step ? 'bg-ink dark:bg-azure text-white' : 'bg-mist dark:bg-card-border/60 text-silver')}>
              {i < step ? <Check size={15} strokeWidth={3} /> : i + 1}
            </span>
            <span className={cx('text-[14px] font-medium', i <= step ? 'text-ink' : 'text-silver')}>{stepLabels[i] ?? s}</span>
            {i < STEPS.length - 1 && <span className={cx('h-px flex-1', i < step ? 'bg-azure' : 'bg-hairline dark:bg-card-border')} />}
          </li>
        ))}
      </ol>

      <div key={step} className="animate-rise space-y-5">
        {step === 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business name" value={f.business} onChange={(v) => set('business', v)} placeholder="Avery Events Co." />
              <Field label="Primary city" value={f.location} onChange={(v) => set('location', v)} placeholder="Chicago, IL" />
              <div>
                <label className="label">Years of experience</label>
                <input type="number" min={0} className="field" value={f.yearsExp} onChange={(e) => set('yearsExp', Number(e.target.value))} />
              </div>
              <Field label="Website or Instagram" value={f.website} onChange={(v) => set('website', v)} placeholder="averyevents.com" />
            </div>
            <div>
              <label className="label">{t('specialties_aesthetic', 'Specialties')}</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => {
                  const on = f.specialties.includes(s)
                  return (
                    <Chip key={s} active={on} onClick={() => set('specialties', on ? f.specialties.filter((x) => x !== s) : [...f.specialties, s])}>
                      {on && <Check size={13} />} {s}
                    </Chip>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="label">About your business</label>
              <textarea rows={5} className="field resize-none leading-relaxed" value={f.bio} onChange={(e) => set('bio', e.target.value)} placeholder="What kind of events you plan, your style, and what clients love about working with you." />
              <p className="mt-1.5 text-[12px] text-silver">Shown on your public profile. {f.bio.trim().length < 30 && `At least 30 characters (${f.bio.trim().length}/30).`}</p>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Business licence or registration number" value={f.licenseNumber} onChange={(v) => set('licenseNumber', v)} placeholder="e.g. IL-BL-0049231" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Upload label="Government-issued ID" hint="Passport or driver’s licence" value={f.idFileName} onChange={(v) => set('idFileName', v)} />
              <Upload label="Liability insurance" hint="Certificate of insurance" value={f.insuranceFileName} onChange={(v) => set('insuranceFileName', v)} />
            </div>
            <div className="rounded-3xl bg-mist dark:bg-card dark:border dark:border-card-border p-5">
              <p className="text-[15px] font-semibold text-ink">Past client reference</p>
              <p className="mt-0.5 text-[13px] text-graphite">We’ll send them a short, two-question email.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Name & event" value={f.referenceName} onChange={(v) => set('referenceName', v)} placeholder="Nadia Torres (wedding, 2025)" />
                <Field label="Email or phone" value={f.referenceContact} onChange={(v) => set('referenceContact', v)} placeholder="nadia@email.com" />
              </div>
            </div>
          </>
        )}

        {step === 2 && <ApplicationSummary app={{ ...f, submittedAt: Date.now() }} />}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-black/[0.06] dark:border-card-border pt-6">
        <Button variant="secondary" onClick={() => (step === 0 ? navigate('/dashboard') : setStep(step - 1))}>
          {step === 0 ? t('verify_finish_later', 'Finish later') : t('verify_back', 'Back')}
        </Button>
        {step < 2 ? (
          <Button size="lg" disabled={!stepValid} onClick={() => setStep(step + 1)}>
            {t('verify_continue', 'Continue')}
          </Button>
        ) : (
          <Button size="lg" onClick={submit}>
            <ShieldCheck size={17} /> {t('verify_submit', 'Submit for review')}
          </Button>
        )}
      </div>
    </Container>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function Upload({ label, hint, value, onChange }) {
  return (
    <label className={cx('flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-8 text-center transition', value ? 'border-azure/40 bg-azure/[0.04]' : 'border-hairline dark:border-card-border hover:border-silver')}>
      <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0].name)} />
      {value ? <FileCheck2 size={26} className="text-azure" /> : <FileUp size={26} className="text-silver" />}
      <span className="mt-3 text-[15px] font-semibold text-ink">{label}</span>
      <span className="mt-0.5 max-w-full truncate text-[13px] text-graphite">{value || hint}</span>
      <span className="mt-2 text-[13px] text-link">{value ? 'Replace file' : 'Choose file'}</span>
    </label>
  )
}

export function ApplicationSummary({ app }) {
  const rows = [
    ['Business', app.business],
    ['City', app.location],
    ['Experience', `${app.yearsExp} ${app.yearsExp === 1 ? 'year' : 'years'}`],
    ['Website', app.website || '—'],
    ['Specialties', app.specialties.join(', ')],
    ['Licence no.', app.licenseNumber],
    ['ID document', app.idFileName],
    ['Insurance', app.insuranceFileName],
    ['Reference', `${app.referenceName} · ${app.referenceContact}`],
  ]
  return (
    <div className="overflow-hidden rounded-3xl border border-black/[0.07] dark:border-card-border bg-white dark:bg-card">
      <dl className="divide-y divide-black/[0.06] dark:divide-card-border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[130px_1fr] gap-4 px-5 py-3.5 text-[14px]">
            <dt className="text-graphite">{k}</dt>
            <dd className="font-medium break-words text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="bg-mist dark:bg-surface px-5 py-4 text-[14px] leading-relaxed text-graphite">{app.bio}</p>
    </div>
  )
}

function VerifyStatus({ me, onResubmit }) {
  const { t } = useI18n()
  const status = me.verification
  const app = me.application
  const stages = [
    { t: 'Application submitted', d: app ? timeAgo(app.submittedAt) : '', done: true },
    { t: 'Identity & business review', d: status === 'pending' ? 'In progress · usually 24–48 hours' : 'Complete', done: status !== 'pending' },
    { t: status === 'rejected' ? 'Not approved' : 'Verified', d: status === 'verified' ? 'Badge active on your profile' : status === 'rejected' ? 'See details below' : 'Pending', done: status === 'verified', failed: status === 'rejected' },
  ]
  return (
    <Container className="max-w-[760px]">
      <div className="pt-16 pb-6 text-center">
        <div className={cx('mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full', status === 'verified' ? 'bg-azure/10' : status === 'pending' ? 'bg-[#fff4e5] dark:bg-[#342410]' : 'bg-[#fbeaea] dark:bg-[#3a1b1b]')}>
          {status === 'verified' ? <BadgeCheck size={40} className="text-azure" /> : status === 'pending' ? <Clock size={36} className="text-amber" /> : <ShieldX size={36} className="text-[#c4271b]" />}
        </div>
        <h1 className="mt-6 text-[40px] leading-tight font-semibold tracking-[-0.03em] md:text-[48px] text-ink">
          {status === 'verified' ? t('verify_status_verified', 'You’re verified.') : status === 'pending' ? t('verify_status_pending', 'Application in review.') : t('verify_status_rejected', 'Not approved yet.')}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[17px] text-graphite">
          {status === 'verified'
            ? t('verify_sub_verified', 'Your profile and projects are public, and you can now message clients directly.')
            : status === 'pending'
              ? t('verify_sub_pending', 'Our trust team is checking your details. Meanwhile you can keep building your portfolio.')
              : t('verify_sub_rejected', 'Update your application with the requested changes and resubmit.')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {status === 'verified' && <Button size="lg" onClick={() => navigate('/requests')}>{t('hero_cta_requests', 'Browse client requests')}</Button>}
          {status === 'pending' && <Button size="lg" onClick={() => navigate('/portfolio/new')}>{t('dash_add_project', 'Add a project')}</Button>}
          {status === 'rejected' && <Button size="lg" onClick={onResubmit}>Update & resubmit</Button>}
          <Button size="lg" variant="secondary" onClick={() => navigate(`/planner/${me.id}`)}>
            {t('nav_my_profile', 'View profile')}
          </Button>
        </div>
      </div>

      <ol className="mx-auto mt-10 max-w-md space-y-0">
        {stages.map((s, i) => (
          <li key={s.t} className="relative flex gap-4 pb-8 last:pb-0">
            {i < stages.length - 1 && <span className={cx('absolute top-8 left-[15px] rtl:left-auto rtl:right-[15px] h-[calc(100%-2rem)] w-0.5', s.done ? 'bg-azure' : 'bg-hairline dark:bg-card-border')} />}
            <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', s.failed ? 'bg-[#c4271b] text-white' : s.done ? 'bg-azure text-white' : 'border-2 border-hairline dark:border-card-border bg-white dark:bg-card')}>
              {s.failed ? <XCircle size={16} /> : s.done ? <Check size={15} strokeWidth={3} /> : null}
            </span>
            <div className="pt-1">
              <p className="text-[15px] font-semibold text-ink">{s.t}</p>
              <p className="text-[13px] text-graphite">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      {status === 'rejected' && app?.rejectionReason && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#fbeaea] dark:bg-[#3a1b1b] px-5 py-4 text-[14px] text-[#c4271b]">
          <strong>Reviewer note:</strong> {app.rejectionReason}
        </div>
      )}

      {status === 'pending' && (
        <div className="mx-auto mt-12 flex max-w-md items-center gap-3 rounded-2xl border border-dashed border-hairline dark:border-card-border px-5 py-4 text-[13px] text-graphite">
          <UserRound size={18} className="shrink-0" />
          <span className="flex-1">Prototype tip: sign in as the trust team admin to approve this application.</span>
          <button onClick={() => navigate('/admin')} className="cursor-pointer font-medium text-link hover:underline">
            Open queue
          </button>
        </div>
      )}

      {app && (
        <details className="mx-auto mt-10 max-w-[600px]">
          <summary className="cursor-pointer text-center text-[15px] text-link">View submitted application</summary>
          <div className="mt-5">
            <ApplicationSummary app={app} />
          </div>
        </details>
      )}
    </Container>
  )
}

export function Admin() {
  const { db, me, signInAs, reviewVerification } = useStore()
  const { t } = useI18n()
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const [rejecting, setRejecting] = useState(null)
  const [reason, setReason] = useState('')

  if (me?.role !== 'admin')
    return (
      <Container className="py-24">
        <Empty
          icon={<ShieldCheck size={24} />}
          title="Trust team only"
          body="This is where planner applications are reviewed. In the prototype you can switch to the demo admin account."
          action={<Button onClick={() => signInAs('admin')}>Sign in as demo admin</Button>}
        />
      </Container>
    )

  const apps = db.users
  .filter((u) => u.role === 'planner' && u.application)
  .filter((u) => (tab === 'pending' ? u.verification === 'pending' : u.verification !== 'pending'))
  .sort((a, b) => b.application.submittedAt - a.application.submittedAt)
  const pendingCount = db.users.filter((u) => u.verification === 'pending').length

  return (
    <Container className="max-w-[960px]">
      <PageHeader
        eyebrow="Trust & safety"
        title="Verification queue"
        sub={`${pendingCount} application${pendingCount === 1 ? '' : 's'} waiting for review.`}
        right={
          <div className="inline-flex rounded-[10px] bg-[#e8e8ed]/70 dark:bg-card-border/60 p-0.5">
            {['pending', 'reviewed'].map((tItem) => (
              <button key={tItem} onClick={() => setTab(tItem)} className={cx('cursor-pointer rounded-lg px-4 py-1.5 text-[13px] font-medium capitalize', tab === tItem ? 'bg-white dark:bg-card text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]' : 'text-graphite')}>
                {tItem}
              </button>
            ))}
          </div>
        }
      />
      {apps.length === 0 ? (
        <Empty icon={<Check size={24} />} title="All caught up" body={tab === 'pending' ? 'No applications need review right now.' : 'Nothing reviewed yet.'} />
      ) : (
        <div className="space-y-5">
          {apps.map((u) => (
            <article key={u.id} className="animate-rise rounded-[28px] border border-black/[0.07] dark:border-card-border bg-white dark:bg-card p-6">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <Avatar user={u} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[19px] font-semibold tracking-tight text-ink">
                    {u.application.business} {u.verification === 'verified' && <Verified />}
                  </p>
                  <p className="text-[13px] text-graphite">
                    {u.name} · {u.email} · submitted {timeAgo(u.application.submittedAt)}
                  </p>
                </div>
                {u.verification === 'pending' ? (
                  <div className="flex gap-2">
                    <Button variant="danger" onClick={() => { setRejecting(u); setReason('') }}>
                      Decline
                    </Button>
                    <Button
                      onClick={() => {
                        reviewVerification(u.id, true)
                        toast(`${u.application.business} is now verified`)
                      }}
                    >
                      <BadgeCheck size={16} /> Approve
                    </Button>
                  </div>
                ) : (
                  <span className={cx('rounded-full px-3 py-1 text-[13px] font-medium', u.verification === 'verified' ? 'bg-azure/10 text-azure' : 'bg-[#fbeaea] dark:bg-[#3a1b1b] text-[#c4271b]')}>
                    {u.verification === 'verified' ? 'Approved' : 'Declined'}
                  </span>
                )}
              </div>
              <ApplicationSummary app={u.application} />
            </article>
          ))}
        </div>
      )}

      <Modal open={!!rejecting} onClose={() => setRejecting(null)} width="max-w-md">
        <div className="p-7">
          <h3 className="text-[22px] font-semibold tracking-tight text-ink">Decline application</h3>
          <p className="mt-1 text-[14px] text-graphite">The planner will see this note and can resubmit.</p>
          <textarea rows={4} autoFocus className="field mt-5 resize-none" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The insurance certificate has expired. Please upload a current one." />
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejecting(null)}>
              {t('contact_cancel', 'Cancel')}
            </Button>
            <Button
              variant="dark"
              disabled={!reason.trim()}
              onClick={() => {
                reviewVerification(rejecting.id, false, reason.trim())
                toast('Application declined')
                setRejecting(null)
              }}
            >
              Decline
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  )
}