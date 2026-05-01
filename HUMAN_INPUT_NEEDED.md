# Human Input Needed

The app runs fully in development without these keys. Provide them when deploying to production or to enable optional features.

---

## Required for Production

### `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL`
- **Purpose**: Base URL used when generating approval links sent to clients.
- **Value**: Your production domain, e.g. `https://yourapp.com`
- **Where to add**: `.env.local` (dev) or your hosting provider's environment variables (prod)

### `AUTH_SECRET`
- **Current value**: `dev-secret-change-in-production` — replace before going live.
- **Generate**: `openssl rand -base64 32`
- **Where to add**: `.env.local` / hosting env vars

---

## Email (Resend) — needed to actually send approval emails

### `RESEND_API_KEY`
- **Purpose**: Sends approval request emails to clients.
- **Get it**: resend.com -> API Keys -> Create Key
- **Where to add**: `.env.local`

### `EMAIL_FROM`
- **Purpose**: The "From" address on approval emails.
- **Format**: `"Acme Co <no-reply@yourdomain.com>"` -- domain must be verified in Resend.
- **Where to add**: `.env.local`

> Without these two keys the app still works -- approval links are generated and shown in the UI, but no email is dispatched.

---

## Billing (Stripe) -- needed to enable subscription management

### `STRIPE_SECRET_KEY`
- **Purpose**: Server-side Stripe API calls (creating checkout sessions, managing subscriptions).
- **Get it**: dashboard.stripe.com -> Developers -> API Keys -> Secret key
- **Where to add**: `.env.local`

### `STRIPE_WEBHOOK_SECRET`
- **Purpose**: Verifies that incoming webhook events came from Stripe.
- **Get it**: Stripe Dashboard -> Webhooks -> Add endpoint -> Signing secret
- **Endpoint to register**: `https://yourapp.com/api/webhooks/stripe`
- **Events to listen for**: `checkout.session.completed`, `customer.subscription.deleted`
- **Where to add**: `.env.local`

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Purpose**: Client-side Stripe.js initialisation (checkout redirect).
- **Get it**: Stripe Dashboard -> Developers -> API Keys -> Publishable key
- **Where to add**: `.env.local`

> Without Stripe keys the app still runs -- the webhook route returns 200 silently and billing features are inert.

---

## Summary table

| Variable | Required for | Breaks without? |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production approval links | Links point to localhost |
| `AUTH_SECRET` | All auth | Must change for prod |
| `RESEND_API_KEY` | Email delivery | Skipped silently |
| `EMAIL_FROM` | Email delivery | Skipped silently |
| `STRIPE_SECRET_KEY` | Billing | Inert silently |
| `STRIPE_WEBHOOK_SECRET` | Billing webhooks | Inert silently |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Billing checkout | Inert silently |
