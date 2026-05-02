create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'strawberry',
  theme_mode text not null default 'light',
  font_family text not null default 'quicksand',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.user_preferences
add column if not exists theme_mode text not null default 'light';

alter table public.user_preferences
add column if not exists font_family text not null default 'quicksand';

alter table public.user_preferences
alter column font_family set default 'quicksand';

alter table public.user_preferences
drop constraint if exists user_preferences_theme_check;

alter table public.user_preferences
drop constraint if exists user_preferences_theme_mode_check;

alter table public.user_preferences
drop constraint if exists user_preferences_font_family_check;

update public.user_preferences
set theme = 'rose',
    updated_at = now()
where theme in ('lavender', 'sakura', 'hydrangea', 'dahlia');

update public.user_preferences
set theme = 'strawberry',
    updated_at = now()
where theme not in (
  'strawberry',
  'kiwi',
  'blueberry',
  'mango',
  'pineapple',
  'melon',
  'rose',
  'tulip',
  'sunflower',
  'orchid',
  'chamomile',
  'lily',
  'chocolate',
  'mint',
  'cotton_candy',
  'caramel',
  'walnut',
  'cheesecake'
);

update public.user_preferences
set theme_mode = 'light',
    updated_at = now()
where theme_mode not in ('light', 'dark');

update public.user_preferences
set font_family = 'quicksand',
    updated_at = now()
where font_family not in ('quicksand', 'lora', 'times');

alter table public.user_preferences
add constraint user_preferences_theme_check
check (
  theme in (
    'strawberry',
    'kiwi',
    'blueberry',
    'mango',
    'pineapple',
    'melon',
    'rose',
    'tulip',
    'sunflower',
    'orchid',
    'chamomile',
    'lily',
    'chocolate',
    'mint',
    'cotton_candy',
    'caramel',
    'walnut',
    'cheesecake'
  )
);

alter table public.user_preferences
add constraint user_preferences_theme_mode_check
check (theme_mode in ('light', 'dark'));

alter table public.user_preferences
add constraint user_preferences_font_family_check
check (font_family in ('quicksand', 'lora', 'times'));

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
