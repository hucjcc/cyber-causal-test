-- ============================================================
-- 赛博因果测评 · Supabase 后端一键建表（合并版）
-- 用法：在 Supabase 控制台 → SQL Editor → New query，
--       把本文件【全部内容】粘贴进去，点「Run」执行一次即可。
-- 前端通过 REST RPC 调用下面这些函数，无需 Edge Function / CLI / 密钥。
-- 管理员密码以 SHA-256 哈希存储；所有管理函数均 security definer，
-- 匿名用户只能调用函数、无法直接读表（表已开启 RLS 且无 anon 策略）。
-- ============================================================

-- 0) 哈希计算依赖（仪表盘 SQL Editor 以项目 owner 身份运行，可建扩展）
create extension if not exists pgcrypto;

-- 1) 允许使用的测试密码
create table if not exists public.passwords (
  password text primary key
);

-- 2) 每个密码的使用次数
create table if not exists public.usage (
  password text primary key references public.passwords(password) on delete cascade,
  count    int  not null default 0
);

-- 3) 原子解锁：校验密码 + 限次计数
--    返回 json：{ "ok": bool, "remaining": int, "reason": text }
create or replace function public.attempt_unlock(pw text, max_n int)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  cur int;
begin
  -- 密码是否存在
  if not exists (select 1 from public.passwords where password = pw) then
    return json_build_object('ok', false, 'reason', '密码错误，请检查后重试');
  end if;

  -- 读取当前次数（加行锁，避免并发时重复计数）
  select coalesce(count, 0) into cur
  from public.usage where password = pw for update;

  if cur is null then
    insert into public.usage(password, count) values (pw, 1);
    return json_build_object('ok', true, 'remaining', max_n - 1);
  elsif cur >= max_n then
    return json_build_object('ok', false, 'reason', format('该密码已用完（限 %s 次）', max_n));
  else
    update public.usage set count = cur + 1 where password = pw;
    return json_build_object('ok', true, 'remaining', max_n - (cur + 1));
  end if;
end;
$$;

-- 4) 权限：允许匿名（前端）调用解锁函数
grant execute on function public.attempt_unlock(text, int) to anon, authenticated;

-- 5) 表安全：禁止匿名直接读写表（只能经由上面的函数，函数以 definer 身份绕过 RLS）
alter table public.passwords enable row level security;
alter table public.usage    enable row level security;
-- 不创建任何 anon 策略 ⇒ anon 无法直接 SELECT / INSERT / UPDATE 这两张表

-- 6) 初始测试密码（之后可在后台 admin.html 自行增删；每个密码次数由前端 MAX_TESTS 控制）
insert into public.passwords (password) values
  ('test123'),
  ('ceshi888'),
  ('kaice666')
on conflict (password) do nothing;

-- 7) 后台管理：存管理员密码哈希
create table if not exists public.admin_config (
  key text primary key,
  val text
);

-- 8) 哈希辅助（immutable，不碰表）
create or replace function public.admin_pw_hash(p text) returns text
language sql immutable as $$ select encode(digest(p,'sha256'),'hex'); $$;

-- 9) 校验管理员密码
create or replace function public.admin_auth(admin_pw text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  return exists(select 1 from public.admin_config where key='admin_pw' and val=public.admin_pw_hash(admin_pw));
end; $$;

-- 10) 列出密码 + 使用次数
create or replace function public.admin_list(admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  return json_build_object('ok',true,'list', (
    select coalesce(json_agg(json_build_object('password', p.password, 'count', coalesce(u.count,0)) order by p.password), '[]'::json)
    from public.passwords p
    left join public.usage u on u.password = p.password
  ));
end; $$;

-- 11) 添加密码
create or replace function public.admin_add_password(p text, admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  if p is null or trim(p)='' then return json_build_object('ok',false,'reason','密码不能为空'); end if;
  insert into public.passwords(password) values (trim(p)) on conflict do nothing;
  return json_build_object('ok',true);
end; $$;

-- 12) 删除密码
create or replace function public.admin_remove_password(p text, admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  delete from public.passwords where password = p;
  return json_build_object('ok',true);
end; $$;

-- 13) 重置所有使用次数
create or replace function public.admin_reset_usage(admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  update public.usage set count = 0;
  return json_build_object('ok',true);
end; $$;

-- 14) 修改管理员密码
create or replace function public.admin_change_pw(old_pw text, new_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(old_pw) then return json_build_object('ok',false,'reason','原密码错误'); end if;
  if new_pw is null or trim(new_pw)='' then return json_build_object('ok',false,'reason','新密码不能为空'); end if;
  insert into public.admin_config(key, val) values ('admin_pw', public.admin_pw_hash(new_pw))
    on conflict (key) do update set val = excluded.val;
  return json_build_object('ok',true);
end; $$;

-- 15) 授权匿名调用（仅这 6 个后台函数，无法直接读表）
grant execute on function public.admin_auth(text)                  to anon, authenticated;
grant execute on function public.admin_list(text)                 to anon, authenticated;
grant execute on function public.admin_add_password(text,text)     to anon, authenticated;
grant execute on function public.admin_remove_password(text,text)  to anon, authenticated;
grant execute on function public.admin_reset_usage(text)          to anon, authenticated;
grant execute on function public.admin_change_pw(text,text)       to anon, authenticated;

-- 16) 初始管理员密码（部署时设置；之后可在后台自行修改）
insert into public.admin_config(key, val) values ('admin_pw', public.admin_pw_hash('061777'))
  on conflict (key) do update set val = excluded.val;
