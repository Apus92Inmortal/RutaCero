# Ruta Cero - Project Memory

Last updated: 2026-06-28

This file is the handoff context for future Codex chats working in this repository.
Do not include private keys, service-role keys, webhook secrets, passwords, or session tokens here.

## Product

Ruta Cero is a Spanish-language fintech SaaS-style web app that helps users organize, analyze, and eliminate debt through personalized repayment plans.

Core product identity:

- Name: Ruta Cero
- Slogan: Tu plan inteligente para salir de deudas
- Commercial product: Ruta Cero - Acceso Vitalicio
- Monetization: one-time lifetime access payment only
- Price: $49.900 COP
- Required commercial copy: Paga una sola vez y recibe acceso de por vida. Sin suscripciones. Sin cobros mensuales.
- Do not implement monthly subscriptions, recurring billing, monthly plans, or subscription UI.

## Official Visual Identity

- Primary color: `#0B2C4A`
- Success/progress: `#2ECC71`
- Background: `#F4F7FA`
- Primary text: `#1F2937`
- Secondary text: `#52616B`
- Danger: `#E74C3C`
- Warning: `#F1C40F`
- Recommended typeface: Inter or similar
- Product style: modern, clean, fintech, responsive, mobile-first

Official UI/UX reference:

- The official UI/UX manual is `docs/manuals/official/Manual_UIUX_Ruta_Cero_v1_1_Oficial.pdf`.
- Version: v1.1.
- Status: Oficial - uso controlado.
- It replaces the previous UI/UX manual that was not aligned to the Manual Maestro de Documentacion Ruta Cero v1.0.
- The previous UI/UX manual is archived only as deprecated history in `docs/manuals/deprecated/` and must not be used as the current design-system reference.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- Recharts
- React Hook Form + Zod

Important local instruction:

- `AGENTS.md` says this Next.js version has breaking changes. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/`.

## Supabase Project

Supabase project:

- Name: Ruta Cero
- Project ref: `iqnqimwycoglhiphhsgx`
- Region: `sa-east-1`
- Project URL: `https://iqnqimwycoglhiphhsgx.supabase.co`
- Dashboard: `https://supabase.com/dashboard/project/iqnqimwycoglhiphhsgx`

Local `.env.local` is configured and must stay private.

Known environment variable names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYMENT_PROVIDER`
- `PAYMENT_SECRET_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

Auth state verified earlier:

- Email confirmation was disabled for development.
- Signups can return a session immediately.
- A profile is created automatically after signup with `access_status = 'pending_payment'`.
- Service role key exists locally, but must never be exposed.

Security:

- Supabase RLS is enabled on all required public tables.
- RLS policies restrict users to their own records.
- Latest advisor run during this thread showed only Auth leaked-password protection warning. That is an Auth setting, not an app code compile blocker.

## Database Tables

Main tables:

- `profiles`
- `debts`
- `debt_payments`
- `access_payments`
- `goals`
- `alerts`
- `strategies`

Access rules:

- User is created before payment.
- New profile starts as `access_status = 'pending_payment'`.
- Approved access payment changes profile to:
  - `access_status = 'active'`
  - `access_type = 'lifetime'`
  - `lifetime_access_granted_at = now()`

Do not use `payments` for debt payments. Debt payments use `debt_payments`. App access payments use `access_payments`.

## Current User/Test Profile State

The user account found in Supabase:

- Name: Aldo Altamar
- Email: `a3c@hotmail.es`
- Profile id: `4816c7a3-8c37-45f8-8c11-891c8aafcdba`
- Access manually activated as lifetime for testing.
- An approved manual access payment was inserted for $49.900 COP.
- Onboarding completed after the user entered salary data.

Do not modify this profile unless explicitly requested.

## Implemented App Areas

Public routes:

- `/`
- `/login`
- `/register`
- `/checkout`
- `/payment-required`
- `/payment-pending`
- `/payment-success`
- `/payment-failed`

Protected routes:

- `/app`
- `/app/onboarding`
- `/app/profile`
- `/app/profile/financial-plan`
- `/app/debts`
- `/app/debts/new`
- `/app/debts/[id]`
- `/app/summary`
- `/app/simulator`
- `/app/strategies`
- `/app/calendar`
- `/app/alerts`
- `/app/recommendations`
- `/app/education`
- `/app/goals`
- `/app/reports`

API routes:

- `/api/payments/create-checkout`
- `/api/payments/webhook`

## Recent UX Change: Profile / Financial Plan

The user noticed that the initial onboarding financial form felt like a temporary configuration panel and was hard to find later.

Implemented change:

- Added `Perfil` to the desktop sidebar.
- Added `Perfil` to the mobile bottom navigation set.
- Added `/app/profile`.
- Added `/app/profile/financial-plan`.
- Reused the existing `OnboardingForm` for both first setup and later financial-plan updates.
- Added `redirectTo` support so updates from Perfil return to `/app/profile`.

Files changed for this UX change:

- `src/lib/constants.ts`
- `src/components/app-shell.tsx`
- `src/components/forms/onboarding-form.tsx`
- `src/lib/actions/profile.ts`
- `src/app/(app)/app/profile/page.tsx`
- `src/app/(app)/app/profile/financial-plan/page.tsx`
- `README.md`

Verification after this change:

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Next.js build recognized `/app/profile` and `/app/profile/financial-plan`.

Browser plugin note:

- The in-app browser/Node browser runtime failed in this environment with a Windows sandbox spawn error. Use server/build checks or another browser method if needed.

## Other Current Local Changes

There are uncommitted local changes from earlier Supabase/Auth work:

- `src/app/api/payments/create-checkout/route.ts`
- `src/components/forms/register-form.tsx`
- `src/lib/actions/auth.ts`
- `supabase/schema.sql`

These were intentional changes from the Supabase setup and should not be reverted without review.

## Financial Engine

Financial logic is separated in:

- `src/lib/financial-engine.ts`

Do not mix core financial calculations directly into visual components. Use the pure engine functions for debt totals, ratios, recommendations, simulations, strategy comparisons, consolidation evaluation, and dashboard guidance.

## Next Chat Objective

Start the next chat by reading this file, `README.md`, `AGENTS.md`, and the current navigation/components.

Primary next objective:

- Use `docs/manuals/official/Manual_UIUX_Ruta_Cero_v1_1_Oficial.pdf` as the authoritative design system reference for future UI work.
- Next recommended step: audit the current app against the manual and align any copy, accents/encoding, missing empty states, and component inconsistencies without introducing subscription UI.
