// app/error.tsx
'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }:{ error: Error & { digest?: string }, reset: ()=>void }) {
  useEffect(() => { console.error('GLOBAL_ERROR', error); }, [error]);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">App crashed</h2>
      <p className="opacity-70 text-sm mt-2">{error.message}</p>
      <button className="underline mt-4" onClick={() => reset()}>Reload</button>
    </div>
  );
}
