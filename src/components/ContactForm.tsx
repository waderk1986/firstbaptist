import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

// TODO: replace with the n8n webhook URL when wired up.
// For now the form no-ops and shows a success state after a brief delay.
const N8N_WEBHOOK_URL: string | null = null;

export default function ContactForm() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    try {
      if (N8N_WEBHOOK_URL) {
        const res = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'fbcdelta.org' }),
        });
        if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 650));
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form submit failed:', err);
      setStatus('error');
    }
  };

  const isSending = status === 'sending';
  const isDone = status === 'success';

  return (
    <section
      id="contact"
      className="side relative z-10 overflow-hidden"
      style={{
        background: 'var(--color-bone)',
        paddingTop: 'clamp(4rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 10% 0%, rgba(197,74,44,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(124,143,107,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1040px] grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <p className="text-rust mb-6 text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
            Say Hello
          </p>
          <h2
            className="font-display text-ink mb-6 leading-[1.08]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
          >
            Drop a line.
            <br />
            <em className="font-italic text-sage-d italic">
              We&rsquo;ll write back.
            </em>
          </h2>
          <p
            className="font-italic text-ink-mid mb-8"
            style={{ fontSize: '1rem', lineHeight: 1.8 }}
          >
            Questions about Sundays, a prayer request, or just want to say
            you&rsquo;re thinking of stopping by — this goes straight to the
            office. We read every one.
          </p>
          <div className="text-ink-mid flex flex-col gap-1.5 text-[0.88rem]">
            <span>
              <span className="text-ink-soft">Mail · </span>
              <a
                href="mailto:deltafbc@yahoo.com"
                className="text-sage-d hover:text-rust-d font-semibold transition-colors"
              >
                deltafbc@yahoo.com
              </a>
            </span>
            <span>
              <span className="text-ink-soft">Phone · </span>
              <a
                href="tel:9708743847"
                className="text-sage-d hover:text-rust-d font-semibold transition-colors"
              >
                (970) 874-3847
              </a>
            </span>
            <span>
              <span className="text-ink-soft">Drop by · </span>
              1250 Pioneer Rd, Delta CO 81416
            </span>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[14px] bg-white/70 p-6 backdrop-blur-sm sm:p-8"
          style={{
            border: '1.5px solid rgba(18,20,24,0.08)',
            boxShadow:
              '0 1px 0 rgba(247,241,227,0.9) inset, 0 12px 32px rgba(18,20,24,0.06)',
          }}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              id="cf-name"
              required
              value={form.name}
              onChange={onChange('name')}
              disabled={isSending || isDone}
              autoComplete="name"
            />
            <Field
              label="Email"
              id="cf-email"
              type="email"
              required
              value={form.email}
              onChange={onChange('email')}
              disabled={isSending || isDone}
              autoComplete="email"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Phone (optional)"
              id="cf-phone"
              type="tel"
              value={form.phone}
              onChange={onChange('phone')}
              disabled={isSending || isDone}
              autoComplete="tel"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="cf-message"
              className="text-ink-soft mb-1.5 block text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
            >
              Message
            </label>
            <textarea
              id="cf-message"
              required
              rows={5}
              value={form.message}
              onChange={onChange('message')}
              disabled={isSending || isDone}
              className="text-ink placeholder:text-ink-soft/60 border-ink/10 focus:border-rust/55 w-full resize-y rounded-[10px] border-[1.5px] bg-white/80 px-3.5 py-2.5 font-sans text-[0.95rem] transition-colors outline-none disabled:opacity-60"
              placeholder="Anything on your mind."
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-rust-d flex items-center gap-1.5 text-[0.8rem] font-semibold"
                >
                  <AlertCircle className="size-4" strokeWidth={2} />
                  Something went wrong. Try again or email us directly.
                </motion.p>
              )}
              {status === 'success' && (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sage-d flex items-center gap-1.5 text-[0.85rem] font-semibold"
                >
                  <CheckCircle2 className="size-4" strokeWidth={2} />
                  Got it — we&rsquo;ll be in touch.
                </motion.p>
              )}
              {status === 'idle' && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-ink-soft text-[0.72rem] italic"
                >
                  We don&rsquo;t share your info. Ever.
                </motion.p>
              )}
              {status === 'sending' && <span key="send" />}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={
                reduced || isSending || isDone ? undefined : { y: -1 }
              }
              whileTap={{ scale: isSending || isDone ? 1 : 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              disabled={isSending || isDone}
              className="bg-rust text-bone hover:bg-rust-d ml-auto inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-2.5 text-[0.85rem] font-semibold tracking-wide transition-colors disabled:opacity-70"
            >
              {isSending ? (
                <>
                  <span
                    aria-hidden="true"
                    className="border-bone/40 border-t-bone block size-3.5 animate-spin rounded-full border-[1.5px]"
                  />
                  Sending…
                </>
              ) : isDone ? (
                <>
                  <CheckCircle2 className="size-4" strokeWidth={2} />
                  Sent
                </>
              ) : (
                <>
                  <Send className="size-4" strokeWidth={2} />
                  Send
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
}

function Field({
  label,
  id,
  type = 'text',
  required,
  value,
  onChange,
  disabled,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-ink-soft mb-1.5 block text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
      >
        {label}
        {required && <span className="text-rust ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className="text-ink placeholder:text-ink-soft/60 border-ink/10 focus:border-rust/55 w-full rounded-[10px] border-[1.5px] bg-white/80 px-3.5 py-2.5 font-sans text-[0.95rem] transition-colors outline-none disabled:opacity-60"
      />
    </div>
  );
}
