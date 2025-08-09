import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // GH Pages lives under /<repo>/
        emailRedirectTo: `${window.location.origin}/wellbeing-tracker/`,
      },
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="card p-4 space-y-3 max-w-md">
      <h2 className="text-lg font-semibold">Sign in</h2>
      <form onSubmit={send} className="flex gap-2">
        <input
          type="email"
          className="input flex-1"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Send link</button>
      </form>
      {sent && <div className="text-sm">Check your email for a magic link.</div>}
      {err && <div className="text-sm text-red-600">Error: {err}</div>}
    </div>
  );
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  return authed ? <>{children}</> : <SignIn />;
}
