// app/(main)/packs/error.tsx
'use client';
import { useEffect } from 'react';

export default function PacksError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error('[packs:error]', error), [error]);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Pack page crashed</h1>
      <p className="opacity-70 mt-2">{error.message}</p>
      <button className="underline mt-4" onClick={() => reset()}>Reload</button>
    </div>
  );
}
