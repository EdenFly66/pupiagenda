create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null default 'info'
    check (type in ('info', 'improvement', 'warning', 'maintenance', 'release')),
  is_active boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_announcements_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row
execute function public.set_announcements_updated_at();

alter table public.announcements enable row level security;

drop policy if exists "announcements_select_active_authenticated" on public.announcements;

create policy "announcements_select_active_authenticated"
on public.announcements
for select
to authenticated
using (
  is_active = true
  and published_at <= now()
  and published_at >= now() - interval '30 days'
);

revoke all on public.announcements from anon;
revoke all on public.announcements from authenticated;
grant select on public.announcements to authenticated;
