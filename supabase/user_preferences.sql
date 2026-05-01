create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'strawberry'
    check (
      theme in (
        'strawberry',
        'blueberry',
        'kiwi',
        'mango',
        'peach',
        'cherry',
        'grape',
        'pineapple',
        'watermelon',
        'orange',
        'green_apple',
        'lemon'
      )
    ),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "preferences_select_own" on public.user_preferences;
drop policy if exists "preferences_insert_own" on public.user_preferences;
drop policy if exists "preferences_update_own" on public.user_preferences;

create policy "preferences_select_own"
on public.user_preferences
for select
using (user_id = auth.uid());

create policy "preferences_insert_own"
on public.user_preferences
for insert
with check (user_id = auth.uid());

create policy "preferences_update_own"
on public.user_preferences
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

grant select, insert, update on public.user_preferences to authenticated;
