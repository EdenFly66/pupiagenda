alter table public.feedback
add column if not exists target_version text not null default 'backlog';

alter table public.feedback
add column if not exists admin_decision text;

alter table public.feedback
alter column status set default 'pending';

alter table public.feedback
alter column priority set default 'medium';

alter table public.feedback
alter column target_version set default 'backlog';

alter table public.feedback
drop constraint if exists feedback_status_check;

alter table public.feedback
drop constraint if exists feedback_priority_check;

alter table public.feedback
drop constraint if exists feedback_target_version_check;

update public.feedback
set status = case
  when status in ('new', 'pending') then 'pending'
  when status in ('in_review', 'reviewed') then 'reviewed'
  when status = 'planned' then 'planned'
  when status = 'in_progress' then 'in_progress'
  when status = 'done' then 'done'
  when status in ('closed', 'rejected') then 'rejected'
  else 'pending'
end,
updated_at = now();

update public.feedback
set priority = case
  when priority in ('low', 'medium', 'high', 'critical') then priority
  else 'medium'
end,
updated_at = now();

update public.feedback
set target_version = case
  when target_version in ('backlog', 'v2.1', 'v2.2', 'v3.0') then target_version
  else 'backlog'
end,
updated_at = now();

alter table public.feedback
add constraint feedback_status_check
check (status in ('pending', 'reviewed', 'planned', 'in_progress', 'done', 'rejected'));

alter table public.feedback
add constraint feedback_priority_check
check (priority in ('low', 'medium', 'high', 'critical'));

alter table public.feedback
add constraint feedback_target_version_check
check (target_version in ('backlog', 'v2.1', 'v2.2', 'v3.0'));

create or replace view public.feedback_admin_view as
select
  feedback.id,
  feedback.user_id,
  auth_users.email,
  feedback.title,
  feedback.message,
  feedback.category,
  feedback.priority,
  feedback.status,
  feedback.target_version,
  feedback.admin_notes,
  feedback.admin_decision,
  feedback.created_at,
  feedback.updated_at
from public.feedback
left join auth.users as auth_users
  on auth_users.id = feedback.user_id;

grant select on public.feedback_admin_view to authenticated;
