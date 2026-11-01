-- ============================================================
-- 赛博因果测评 · 后台管理（Supabase 端）
-- 在 SQL Editor 中把本文件全部内容执行一次即可（需先执行 0001_init.sql）。
-- 前端 admin.html 通过 REST RPC 调用下面这些函数，无需 Edge Function / CLI / 密钥。
-- 说明：管理员密码以 SHA-256 哈希存储；所有管理函数均 security definer，
--       匿名用户只能调用函数、无法直接读表（表已开启 RLS 且无 anon 策略）。
-- ============================================================

-- 0) 哈希计算依赖
create extension if not exists pgcrypto;

-- 1) 存管理员密码哈希
create table if not exists public.admin_config (
  key text primary key,
  val text
);

-- 2) 哈希辅助（immutable，不碰表）
create or replace function public.admin_pw_hash(p text) returns text
language sql immutable as $$ select encode(digest(p,'sha256'),'hex'); $$;

-- 3) 校验管理员密码
create or replace function public.admin_auth(admin_pw text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  return exists(select 1 from public.admin_config where key='admin_pw' and val=public.admin_pw_hash(admin_pw));
end; $$;

-- 4) 列出密码 + 使用次数
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

-- 5) 添加密码
create or replace function public.admin_add_password(p text, admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  if p is null or trim(p)='' then return json_build_object('ok',false,'reason','密码不能为空'); end if;
  insert into public.passwords(password) values (trim(p)) on conflict do nothing;
  return json_build_object('ok',true);
end; $$;

-- 6) 删除密码
create or replace function public.admin_remove_password(p text, admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  delete from public.passwords where password = p;
  return json_build_object('ok',true);
end; $$;

-- 7) 重置所有使用次数
create or replace function public.admin_reset_usage(admin_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(admin_pw) then return json_build_object('ok',false,'reason','未授权'); end if;
  update public.usage set count = 0;
  return json_build_object('ok',true);
end; $$;

-- 8) 修改管理员密码
create or replace function public.admin_change_pw(old_pw text, new_pw text) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_auth(old_pw) then return json_build_object('ok',false,'reason','原密码错误'); end if;
  if new_pw is null or trim(new_pw)='' then return json_build_object('ok',false,'reason','新密码不能为空'); end if;
  insert into public.admin_config(key, val) values ('admin_pw', public.admin_pw_hash(new_pw))
    on conflict (key) do update set val = excluded.val;
  return json_build_object('ok',true);
end; $$;

-- 9) 授权匿名调用（仅这 6 个函数，无法直接读表）
grant execute on function public.admin_auth(text)            to anon, authenticated;
grant execute on function public.admin_list(text)           to anon, authenticated;
grant execute on function public.admin_add_password(text,text) to anon, authenticated;
grant execute on function public.admin_remove_password(text,text) to anon, authenticated;
grant execute on function public.admin_reset_usage(text)    to anon, authenticated;
grant execute on function public.admin_change_pw(text,text) to anon, authenticated;

-- 10) 初始管理员密码（部署时设置；之后可在后台自行修改）
insert into public.admin_config(key, val) values ('admin_pw', public.admin_pw_hash('061777'))
  on conflict (key) do update set val = excluded.val;
