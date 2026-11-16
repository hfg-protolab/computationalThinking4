-- The complete database schema of this state of the course.
-- Running it RESETS the database: every board and object is deleted.
-- Run it in the Supabase SQL Editor, or ask Claude to run it through the Supabase MCP.

drop table if exists objects;
drop table if exists boards;

create table boards (
  id         text primary key,
  name       text not null,
  created_at timestamptz not null default now()
);

-- One table for every variant: columns a variant does not have stay empty (null).
create table objects (
  id         text primary key,
  board_id   text not null references boards(id) on delete cascade,
  type       text not null,
  x          integer not null,
  y          integer not null,
  width      integer not null,
  height     integer not null,
  text       text,
  font_size  integer,
  bold       boolean,
  color      text,
  created_at timestamptz not null default now()
);

-- Only the backend (with the secret key) may read and write. Without policies,
-- the Data API gives nothing to anyone holding just the publishable key.
alter table boards enable row level security;
alter table objects enable row level security;

insert into boards (id, name) values (gen_random_uuid()::text, 'Mein erstes Board');
