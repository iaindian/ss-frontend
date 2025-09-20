# AI Image Pack — Frontend

Production-ready Next.js frontend per spec: dark neon theme, Stripe checkout, auth screens, attributes, pack grid, orders with polling, structured logs.

## Quickstart

```bash
pnpm i # or npm i / yarn
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_API_BASE_URL` to your backend origin. The app expects these endpoints:
- `GET /packs`
- `GET /me`
- `GET /attributes`
- `PUT /attributes`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`

### Payments
The frontend supports two flows:
1) **Hosted checkout**: backend returns `{ checkout_url }` from `POST /orders`.
2) **PaymentIntent**: backend returns `{ client_secret }`; we use `@stripe/stripe-js` to confirm the payment.

### Logging
- Configure `NEXT_PUBLIC_LOG_LEVEL` (debug|info|warn|error).
- Optional UI toasts for logs: set `NEXT_PUBLIC_ENABLE_DEBUG_TOASTS=true`.
- All API calls and key UI actions emit logs with context.

### Styling
- TailwindCSS with neon green primary (#39ff14) and dark background.
- Minimal shadcn-style UI primitives in `components/ui/*`.

### Auth
The app assumes cookie-based sessions (backend sets httpOnly cookies on `/login`). After successful login, we redirect to `/attributes`.

### File Uploads (Reference Face)
We send a base64 data URL in `reference_image_base64` within the JSON body to `PUT /attributes` for simplicity. If your backend requires multipart or presigned URLs, adjust `attributes/page.tsx` accordingly.

### Error Boundaries & Resilience
- Global error boundary in `app/error.tsx`.
- Retries for 5xx responses in `lib/api.ts`.
- Polling hook for orders with clean-up.

## Scripts
- `pnpm dev` — local dev at http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve built app

## Lint & Format
Add ESLint/Prettier as desired.
