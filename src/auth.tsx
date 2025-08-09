import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <form onSubmit={sendLink} className="flex gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <button className="bg-black text-white px-3 py-2 rounded">Send link</button>
      {sent && <span>Check your email.</span>}
    </form>
  );
}
