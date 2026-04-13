create table if not exists "admin_sessions" (
  "id" text primary key,
  "user_id" uuid not null references "login_credentials" ("id") on delete cascade on update cascade,
  "email" text not null,
  "expires_at" timestamptz not null,
  "revoked_at" timestamptz,
  "created_at" timestamptz not null default now()
);

create index if not exists "admin_sessions_user_id_idx" on "admin_sessions" ("user_id");
create index if not exists "admin_sessions_expires_at_idx" on "admin_sessions" ("expires_at");