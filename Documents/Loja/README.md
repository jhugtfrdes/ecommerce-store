# Noir Atelier

Loja ecommerce moderna em Next.js 15, TypeScript, TailwindCSS e Stripe.

## Começar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Stripe

Cria um ficheiro `.env.local` com base em `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=scrypt:replace_salt:replace_hash
ADMIN_SESSION_SECRET=replace_with_a_long_random_secret
```

O catálogo está em `lib/products.ts`. Para produção, substitui os `stripePriceId` por Price IDs reais do Stripe. Se deixares os IDs com `replace`, a API cria `price_data` dinamicamente a partir do catálogo local.

## Admin

Gera uma hash para a password:

```bash
npm run admin:hash -- "a-tua-password-segura"
```

Define `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET` em `.env.local`. Para vários administradores no futuro, usa `ADMIN_USERS_JSON` com uma lista de utilizadores. Abre `/admin/login`; `/admin` e `/admin/*` ficam protegidos por sessão em cookie HttpOnly.

Webhook local recomendado:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
// redeploy
