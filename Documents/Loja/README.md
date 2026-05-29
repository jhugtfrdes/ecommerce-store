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

Setup recomendado:

```bash
npm run setup
```

O comando cria `.env.local` com `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`.

Também podes gerar apenas uma hash:

```bash
npm run admin:hash -- "a-tua-password-segura"
```

Para Vercel, copia as mesmas variáveis para Project Settings -> Environment Variables. Para vários administradores no futuro, usa `ADMIN_USERS_JSON` com uma lista de utilizadores. Abre `/login`; `/admin` e `/admin/*` ficam protegidos por role `admin`.

Webhook local recomendado:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
// redeploy
