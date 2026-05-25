-- Thailand Travel Journal · Supabase schema
-- Run in Supabase Dashboard → SQL Editor

-- 1) Enable Anonymous sign-in: Authentication → Providers → Anonymous → Enable

-- 2) Run this file

create table if not exists public.travel_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 48),
  caption text check (caption is null or char_length(caption) <= 200),
  tags text[] not null default '{}',
  excerpt text not null,
  plan jsonb not null,
  published_at timestamptz not null default now(),
  like_count int not null default 0 check (like_count >= 0)
);

create index if not exists travel_notes_published_at_idx
  on public.travel_notes (published_at desc);

alter table public.travel_notes enable row level security;

drop policy if exists "travel_notes_public_read" on public.travel_notes;
create policy "travel_notes_public_read"
  on public.travel_notes for select
  using (true);

drop policy if exists "travel_notes_insert_own" on public.travel_notes;
create policy "travel_notes_insert_own"
  on public.travel_notes for insert
  with check (auth.uid() = user_id);

drop policy if exists "travel_notes_update_own" on public.travel_notes;
create policy "travel_notes_update_own"
  on public.travel_notes for update
  using (auth.uid() = user_id);

-- Like: one per user per note (requires signed-in user, including anonymous)
create table if not exists public.travel_note_likes (
  note_id uuid not null references public.travel_notes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (note_id, user_id)
);

alter table public.travel_note_likes enable row level security;

drop policy if exists "likes_public_read" on public.travel_note_likes;
create policy "likes_public_read"
  on public.travel_note_likes for select
  using (true);

drop policy if exists "likes_insert_own" on public.travel_note_likes;
create policy "likes_insert_own"
  on public.travel_note_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.travel_note_likes;
create policy "likes_delete_own"
  on public.travel_note_likes for delete
  using (auth.uid() = user_id);

-- RPC: toggle like and sync like_count on travel_notes
create or replace function public.toggle_travel_note_like(p_note_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_count int;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  if exists (
    select 1 from public.travel_note_likes
    where note_id = p_note_id and user_id = v_uid
  ) then
    delete from public.travel_note_likes
    where note_id = p_note_id and user_id = v_uid;
  else
    insert into public.travel_note_likes (note_id, user_id)
    values (p_note_id, v_uid);
  end if;

  select count(*)::int into v_count
  from public.travel_note_likes
  where note_id = p_note_id;

  update public.travel_notes
  set like_count = v_count
  where id = p_note_id;

  return v_count;
end;
$$;

grant execute on function public.toggle_travel_note_like(uuid) to anon, authenticated;
