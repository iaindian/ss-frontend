'use client'
export default function TutorialPage() {
  return (
    <div className="prose prose-invert max-w-3xl space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Getting Started</h1>
        <ol className="mt-3 list-decimal pl-6 space-y-2 text-sm opacity-90">
          <li>Upload a clear reference face in <strong>Attributes</strong>.</li>
          <li>Fill your attributes accurately (age, hair, skin tone, etc.).</li>
          <li>Pick a Pack → review → <strong>Generate</strong>.</li>
          <li>Pay (or use free credits) and we’ll email when it’s done.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-3 space-y-4">
          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer font-medium">How long does generation take?</summary>
            <p className="mt-2 text-sm opacity-80">Usually a few minutes. You’ll get an email when it’s ready.</p>
          </details>
          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer font-medium">Can I change my reference face?</summary>
            <p className="mt-2 text-sm opacity-80">Yes—upload a new one in Attributes. Your old face is archived for cleanup.</p>
          </details>
          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer font-medium">Do unused credits expire?</summary>
            <p className="mt-2 text-sm opacity-80">Free credits don’t expire for 30 days; paid credits don’t expire.</p>
          </details>
          <details className="rounded-lg border border-border p-4">
            <summary className="cursor-pointer font-medium">What’s the license?</summary>
            <p className="mt-2 text-sm opacity-80">Personal use/sharing unless otherwise stated in a Pack.</p>
          </details>
        </div>
      </section>
    </div>
  )
}
