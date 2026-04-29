create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  currency text default 'COP',
  monthly_income numeric default 0,
  fixed_expenses numeric default 0,
  variable_expenses numeric default 0,
  debt_budget numeric default 0,
  extra_payment_capacity numeric default 0,
  urgency_level text check (urgency_level in ('low','medium','high','critical')),
  onboarding_completed boolean default false,
  access_status text check (access_status in ('pending_payment','active','payment_failed','refunded','blocked')) default 'pending_payment',
  access_type text check (access_type in ('lifetime')) null,
  lifetime_access_granted_at timestamptz null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  entity text,
  debt_type text check (debt_type in ('credit_card','personal_loan','payroll_loan','installment_purchase','vehicle_loan','mortgage','informal_loan','other')),
  balance numeric not null check (balance >= 0),
  monthly_payment numeric not null check (monthly_payment >= 0),
  interest_rate numeric default 0,
  interest_rate_type text check (interest_rate_type in ('monthly','annual','unknown')) default 'unknown',
  remaining_months int,
  due_day int check (due_day >= 1 and due_day <= 31),
  status text check (status in ('current','due_soon','late','collections')) default 'current',
  days_past_due int default 0,
  allows_extra_payments boolean default true,
  prepayment_penalty boolean default false,
  stress_level text check (stress_level in ('low','medium','high','critical')) default 'medium',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  debt_id uuid references public.debts(id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  payment_type text check (payment_type in ('minimum','extra','full')) default 'minimum',
  paid_at date default current_date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.access_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text,
  provider_payment_id text,
  amount numeric not null check (amount > 0),
  currency text default 'COP',
  product_name text default 'Ruta Cero - Acceso Vitalicio',
  payment_status text check (payment_status in ('pending','approved','failed','cancelled','refunded')) default 'pending',
  checkout_url text,
  paid_at timestamptz null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  target_amount numeric default 0,
  current_amount numeric default 0,
  target_date date,
  status text check (status in ('active','completed','paused')) default 'active',
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  debt_id uuid references public.debts(id) on delete set null,
  type text check (type in ('due_date','risk','opportunity','late','strategy','education')),
  title text not null,
  message text not null,
  severity text check (severity in ('info','warning','danger','success')) default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  strategy_type text check (strategy_type in ('snowball','avalanche','consolidation','refinance','aggressive','balanced','emergency','hybrid')),
  estimated_months int,
  estimated_interest numeric default 0,
  total_payment numeric default 0,
  recommendation text,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists debts_set_updated_at on public.debts;
create trigger debts_set_updated_at
before update on public.debts
for each row execute function public.set_updated_at();

drop trigger if exists access_payments_set_updated_at on public.access_payments;
create trigger access_payments_set_updated_at
before update on public.access_payments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, access_status, onboarding_completed)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'pending_payment', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.debts enable row level security;
alter table public.debt_payments enable row level security;
alter table public.access_payments enable row level security;
alter table public.goals enable row level security;
alter table public.alerts enable row level security;
alter table public.strategies enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create policy "debts_select_own" on public.debts for select using (auth.uid() = user_id);
create policy "debts_insert_own" on public.debts for insert with check (auth.uid() = user_id);
create policy "debts_update_own" on public.debts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "debts_delete_own" on public.debts for delete using (auth.uid() = user_id);

create policy "debt_payments_select_own" on public.debt_payments for select using (auth.uid() = user_id);
create policy "debt_payments_insert_own" on public.debt_payments for insert with check (auth.uid() = user_id);
create policy "debt_payments_update_own" on public.debt_payments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "debt_payments_delete_own" on public.debt_payments for delete using (auth.uid() = user_id);

create policy "access_payments_select_own" on public.access_payments for select using (auth.uid() = user_id);
create policy "access_payments_insert_own" on public.access_payments for insert with check (auth.uid() = user_id);
create policy "access_payments_update_own" on public.access_payments for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "access_payments_delete_own" on public.access_payments for delete using (auth.uid() = user_id);

create policy "goals_select_own" on public.goals for select using (auth.uid() = user_id);
create policy "goals_insert_own" on public.goals for insert with check (auth.uid() = user_id);
create policy "goals_update_own" on public.goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals_delete_own" on public.goals for delete using (auth.uid() = user_id);

create policy "alerts_select_own" on public.alerts for select using (auth.uid() = user_id);
create policy "alerts_insert_own" on public.alerts for insert with check (auth.uid() = user_id);
create policy "alerts_update_own" on public.alerts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "alerts_delete_own" on public.alerts for delete using (auth.uid() = user_id);

create policy "strategies_select_own" on public.strategies for select using (auth.uid() = user_id);
create policy "strategies_insert_own" on public.strategies for insert with check (auth.uid() = user_id);
create policy "strategies_update_own" on public.strategies for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "strategies_delete_own" on public.strategies for delete using (auth.uid() = user_id);

create index if not exists debts_user_id_idx on public.debts(user_id);
create index if not exists debt_payments_user_id_idx on public.debt_payments(user_id);
create index if not exists access_payments_user_id_idx on public.access_payments(user_id);
create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists alerts_user_id_idx on public.alerts(user_id);
create index if not exists strategies_user_id_idx on public.strategies(user_id);
