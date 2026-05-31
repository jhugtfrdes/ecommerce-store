# Noir Atelier

Loja ecommerce moderna em Next.js 15, TypeScript, TailwindCSS, Stripe e Supabase.

## Começar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Supabase

1. Cria um projeto Supabase.
2. Executa `supabase/schema.sql` no SQL Editor.
3. Copia `.env.example` para `.env.local`.
4. Preenche:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Para promover um utilizador a admin:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

## Vercel

Adiciona as mesmas variáveis em Project Settings -> Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

O registo e login usam Supabase Auth, por isso funcionam em produção sem filesystem local.

## Stripe

Substitui os `stripePriceId` por Price IDs reais do Stripe quando quiseres usar preços geridos pelo Stripe. Se deixares os IDs com `replace`, a API cria `price_data` dinamicamente a partir da tabela `products`.

Webhook local recomendado:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
