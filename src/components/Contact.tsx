import { useState } from 'react'
import { Lock, MessageCircle, Send } from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { firstName } from '../lib/format'
import type { User } from '../lib/types'
import { Avatar, Button, Modal, Verified } from './ui'

/**
 * Gated "Message" action. Handles signed-out users, unverified planners,
 * existing conversations and composing a first message.
 */
export function ContactButton({
  other,
  requestId,
  projectId,
  label,
  size = 'md',
  className,
  draft,
}: {
  other: User
  requestId?: string
  projectId?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  draft?: string
}) {
  const { me, db, openThread } = useStore()
  const [open, setOpen] = useState<'compose' | 'locked' | null>(null)
  const [text, setText] = useState(draft ?? '')

  if (me && me.role === other.role) return null
  if (me?.role === 'admin') return null

  const existing =
    me &&
    db.threads.find(
      (t) =>
        (me.role === 'client' ? t.clientId === me.id && t.plannerId === other.id : t.plannerId === me.id && t.clientId === other.id) &&
        (requestId ? t.requestId === requestId : true),
    )

  const onClick = () => {
    if (!me) {
      const here = window.location.hash.slice(1) || '/'
      navigate(`/signup?next=${encodeURIComponent(here)}&role=${other.role === 'planner' ? 'client' : 'planner'}`)
      return
    }
    if (me.role === 'planner' && me.verification !== 'verified') return setOpen('locked')
    if (existing) return navigate(`/messages/${existing.id}`)
    setText(draft ?? '')
    setOpen('compose')
  }

  const send = () => {
    if (!text.trim()) return
    const id = openThread({ otherId: other.id, requestId, projectId, text: text.trim() })
    setOpen(null)
    navigate(`/messages/${id}`)
  }

  return (
    <>
      <Button size={size} onClick={onClick} className={className}>
        <MessageCircle size={size === 'sm' ? 14 : 17} />
        {existing ? 'Open conversation' : (label ?? `Message ${firstName(other.name)}`)}
      </Button>

      <Modal open={open === 'compose'} onClose={() => setOpen(null)}>
        <div className="p-7">
          <div className="flex items-center gap-3">
            <Avatar user={other} size={44} />
            <div>
              <p className="flex items-center gap-1.5 text-[17px] font-semibold">
                {other.role === 'planner' ? other.business : other.name}
                {other.verification === 'verified' && <Verified />}
              </p>
              <p className="text-[13px] text-graphite">{other.role === 'planner' ? other.name : 'Client'}</p>
            </div>
          </div>
          <label className="label mt-6">Your message</label>
          <textarea
            autoFocus
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="field resize-none leading-relaxed"
            placeholder={
              other.role === 'planner'
                ? 'Tell them about your event: date, guest count, the feel you’re going for…'
                : 'Introduce yourself and share how you’d approach their event…'
            }
          />
          <p className="mt-2 text-[12px] text-silver">Messages stay on Fête until you choose to share contact details.</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={send} disabled={!text.trim()}>
              <Send size={15} /> Send
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={open === 'locked'} onClose={() => setOpen(null)} width="max-w-md">
        <div className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
            <Lock size={24} className="text-graphite" />
          </div>
          <h3 className="mt-5 text-[22px] font-semibold tracking-tight">Verification required</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-graphite">
            {me?.verification === 'pending'
              ? 'Your application is being reviewed. You’ll be able to message clients as soon as you’re verified.'
              : 'To keep clients safe, only verified planners can reach out. It takes about five minutes to apply.'}
          </p>
          <Button className="mt-7 w-full" size="lg" onClick={() => navigate('/verify')}>
            {me?.verification === 'pending' ? 'View application status' : 'Get verified'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
