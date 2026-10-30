-- ============================================================
-- 赛博因果测评 · Supabase 后端（后端逻辑 + 数据库）
-- 使用方式：在 Supabase 控制台的「SQL Editor」中，把本文件全部内容
--           粘贴进去执行一次即可。前端通过 REST RPC 调用
--           public.attempt_unlock，无需 Edge Function / CLI / 密钥。
-- ============================================================

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

-- 4) 权限：允许匿名（前端）调用此函数 —— 这就是唯一的「后端入口」
grant execute on function public.attempt_unlock(text, int) to anon, authenticated;

-- 5) 表安全：禁止匿名直接读写表（只能经由上面的函数，函数以 definer 身份绕过 RLS）
alter table public.passwords enable row level security;
alter table public.usage    enable row level security;
-- 不创建任何 anon 策略 ⇒ anon 无法直接 SELECT / INSERT / UPDATE 这两张表

-- 6) 初始密码（按需修改；每个密码的可接入次数由前端 config.js 的 MAX_TESTS 控制，默认 3）
insert into public.passwords (password) values
  ('test123'),
  ('ceshi888'),
  ('kaice666')
on conflict (password) do nothing;
