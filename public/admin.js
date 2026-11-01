// 后台管理页面逻辑：自动适配两种后端
//  - 配置了 Supabase（config.js 的 USE_SUPABASE=true）→ 走 REST RPC
//  - 本地调试（默认）→ 走 server.js 的 /api/admin/*
(function () {
  const cfg = window.APP_CONFIG || {};
  const useSb = !!(cfg.USE_SUPABASE && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  let adminPw = '';

  const $ = (s) => document.querySelector(s);
  const loginSec = $('#loginSec'), dashSec = $('#dashSec');
  const loginMsg = $('#loginMsg'), dashMsg = $('#dashMsg'), listEl = $('#list');

  function showMsg(t, ok) {
    const el = dashSec.classList.contains('hide') ? loginMsg : dashMsg;
    el.textContent = t || '';
    el.style.color = ok ? 'var(--cyan)' : '#ff5c8a';
  }

  // ---------- 后端调用抽象 ----------
  async function sbRpc(fn, body) {
    const r = await fetch(cfg.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': cfg.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + cfg.SUPABASE_ANON_KEY
      },
      body: JSON.stringify(body)
    });
    return r.json();
  }
  async function localApi(path, method, body) {
    const opt = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opt.body = JSON.stringify(body);
    const r = await fetch(path, opt);
    return r.json();
  }
  // fn: Supabase 函数名；payload: 参数对象
  async function call(fn, payload) {
    if (useSb) return sbRpc(fn, payload);
    const map = {
      admin_auth:            ['/api/admin/login', 'POST', { admin: payload.admin_pw }],
      admin_list:            ['/api/admin/list?admin=' + encodeURIComponent(adminPw), 'GET', null],
      admin_add_password:    ['/api/admin/add', 'POST', { password: payload.p, admin: adminPw }],
      admin_remove_password: ['/api/admin/remove', 'POST', { password: payload.p, admin: adminPw }],
      admin_reset_usage:     ['/api/admin/reset', 'POST', { admin: adminPw }],
      admin_change_pw:       ['/api/admin/changepw', 'POST', { admin: payload.old_pw, newpw: payload.new_pw }]
    };
    const [p, m, b] = map[fn];
    return localApi(p, m, b);
  }

  // ---------- 界面动作 ----------
  async function doLogin() {
    const pw = $('#adminInput').value.trim();
    if (!pw) { showMsg('请输入管理密码', false); return; }
    const res = await call('admin_auth', { admin_pw: pw });
    if (res && res.ok) {
      adminPw = pw;
      loginSec.classList.add('hide');
      dashSec.classList.remove('hide');
      loginMsg.textContent = '';
      await refresh();
    } else {
      showMsg('管理密码错误', false);
    }
  }

  async function refresh() {
    const res = await call('admin_list', { admin_pw: adminPw });
    if (!res || !res.ok) { showMsg(res && res.reason || '加载失败', false); return; }
    listEl.innerHTML = '';
    (res.list || []).forEach((it) => {
      const row = document.createElement('div');
      row.className = 'row';
      const pw = document.createElement('span'); pw.className = 'pw'; pw.textContent = it.password;
      const ct = document.createElement('span'); ct.className = 'ct'; ct.textContent = '已用 ' + it.count + ' 次';
      const btn = document.createElement('button'); btn.className = 'del'; btn.textContent = '删除';
      btn.onclick = async () => {
        const r = await call('admin_remove_password', { p: it.password });
        if (r && r.ok) { showMsg('已删除 ' + it.password, true); await refresh(); }
        else showMsg((r && r.reason) || '删除失败', false);
      };
      row.appendChild(pw); row.appendChild(ct); row.appendChild(btn);
      listEl.appendChild(row);
    });
  }

  async function doAdd() {
    const np = $('#addInput').value.trim();
    if (!np) { showMsg('请输入新密码', false); return; }
    const r = await call('admin_add_password', { p: np });
    if (r && r.ok) { showMsg('已添加 ' + np, true); $('#addInput').value = ''; await refresh(); }
    else showMsg((r && r.reason) || '添加失败', false);
  }
  async function doReset() {
    if (!confirm('确定把所有密码的使用次数清零？')) return;
    const r = await call('admin_reset_usage', { admin_pw: adminPw });
    if (r && r.ok) { showMsg('已重置所有次数', true); await refresh(); }
    else showMsg((r && r.reason) || '重置失败', false);
  }
  async function doChange() {
    const o = $('#oldPw').value.trim(), n = $('#newPw').value.trim();
    if (!o || !n) { showMsg('请填写原密码和新密码', false); return; }
    const r = await call('admin_change_pw', { old_pw: o, new_pw: n });
    if (r && r.ok) { showMsg('管理密码已修改，请用新密码重新登录', true); adminPw = n; setTimeout(logout, 900); }
    else showMsg((r && r.reason) || '修改失败', false);
  }
  function logout() {
    adminPw = '';
    dashSec.classList.add('hide');
    loginSec.classList.remove('hide');
    $('#adminInput').value = '';
    loginMsg.textContent = '';
  }

  $('#loginBtn').onclick = doLogin;
  $('#addBtn').onclick = doAdd;
  $('#resetBtn').onclick = doReset;
  $('#chgBtn').onclick = doChange;
  $('#logoutBtn').onclick = logout;
})();
