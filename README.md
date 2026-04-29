# Ruta Cero

Ruta Cero es una app web fintech para organizar, analizar y eliminar deudas mediante planes personalizados. El producto está diseñado como **Ruta Cero - Acceso Vitalicio**: pago único por acceso de por vida, sin suscripciones y sin cobros mensuales.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase Auth + PostgreSQL
- Recharts
- React Hook Form + Zod

## Instalación

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

Crea `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYMENT_PROVIDER=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de `supabase/schema.sql` en el SQL Editor.
3. Configura las variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
4. Para el flujo inmediato de registro a checkout, usa confirmación de correo desactivada durante desarrollo o ajusta el flujo de verificación según tu política de Auth.

El SQL crea:

- `profiles`
- `debts`
- `debt_payments`
- `access_payments`
- `goals`
- `alerts`
- `strategies`

También activa RLS y políticas para que cada usuario solo gestione sus propios registros.

## Pagos

La cuenta se crea primero con `access_status = 'pending_payment'`. El checkout vive en `/checkout` y llama a:

- `POST /api/payments/create-checkout`
- `POST /api/payments/webhook`

La integración real con Bold, Wompi, PayU u otra pasarela queda preparada en `src/app/api/payments/create-checkout/route.ts`. El webhook debe enviar un estado `approved` para activar:

```text
access_status = active
access_type = lifetime
lifetime_access_granted_at = now()
```

Ejemplo de webhook local:

```bash
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -H "x-payment-webhook-secret: TU_SECRET" \
  -d "{\"user_id\":\"UUID_DEL_USUARIO\",\"provider_payment_id\":\"ID_DEL_PAGO\",\"status\":\"approved\"}"
```

## Comandos

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Rutas principales

- `/` landing pública
- `/login` y `/register`
- `/checkout`
- `/payment-required`, `/payment-pending`, `/payment-success`, `/payment-failed`
- `/app`
- `/app/onboarding`
- `/app/debts`
- `/app/simulator`
- `/app/strategies`
- `/app/calendar`
- `/app/alerts`
- `/app/recommendations`
- `/app/education`
- `/app/goals`
- `/app/reports`

## Motor financiero

La lógica financiera vive en `src/lib/financial-engine.ts` e incluye cálculo de deuda total, ratios, priorización, recomendación mensual, simulación de bola de nieve, avalancha, comparación de estrategias y evaluación de consolidación.

## Estado de esta versión

La app compila, tiene flujo visual de acceso vitalicio, Auth preparada con Supabase, rutas protegidas, CRUD base de deudas, onboarding, dashboard, simulador, comparador, calendario, alertas, recomendaciones, educación, metas y reporte mensual preparado para PDF futuro.
