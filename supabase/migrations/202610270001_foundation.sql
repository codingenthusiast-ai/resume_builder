-- Initial account-storage foundation. Not required by the guest workflow.
-- Apply to a dedicated development project; client account flows are a later milestone.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 created_at timestamptz not null default now()
);
create table public.resumes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Untitled resume',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (id,user_id)
);
create table public.resume_versions (
 id uuid primary key default gen_random_uuid(),
 resume_id uuid not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 structured_json jsonb not null,
 template_id text not null check (template_id in ('classic','modern')),
 schema_version integer not null default 1,
 created_at timestamptz not null default now(),
 foreign key (resume_id,user_id) references public.resumes(id,user_id) on delete cascade
);
create table public.analyses (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 report_json jsonb not null,
 rubric_version text not null default 'v1',
 created_at timestamptz not null default now()
);
create index resumes_user_created on public.resumes(user_id,created_at desc);
create index analyses_user_created on public.analyses(user_id,created_at desc);
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.analyses enable row level security;
create policy "Own profile" on public.profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Own resumes" on public.resumes for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Read own versions" on public.resume_versions for select to authenticated using ((select auth.uid())=user_id);
create policy "Insert own immutable versions" on public.resume_versions for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Delete own versions" on public.resume_versions for delete to authenticated using ((select auth.uid())=user_id);
create policy "Own analyses" on public.analyses for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
-- Intentionally no public document bucket and no guest database rows.
