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
    // 兼容两种后端返回：本地 {ok:true} / Supabase 裸布尔 true
    if (res === true || res === 'true' || (res && res.ok)) {
      adminPw = pw;
      loginSec.classList.add('hide');
      dashSec.classList.remove('hide');
      loginMsg.textContent = '';
      await refresh();
    } else {
      let detail = '';
      try { detail = '（后端返回：' + JSON.stringify(res).slice(0, 140) + '）'; } catch (e) {}
      showMsg('管理密码错误' + detail, false);
    }
  }

  const MAX = (cfg.MAX_TESTS && cfg.MAX_TESTS > 0) ? cfg.MAX_TESTS : 3;  // 每个密码总次数上限
  let allRows = [];  // 全量密码记录（含 batch / created_at）

  // 当前筛选条件下的记录
  function getFiltered() {
    const fb = $('#filterBatch').value;
    const fs = $('#filterStatus').value;
    return allRows.filter((it) => {
      const used = it.count || 0;
      const avail = MAX - used;
      if (fb && (it.batch || '手动/初始') !== fb) return false;
      if (fs === 'ok' && avail <= 0) return false;
      if (fs === 'no' && avail > 0) return false;
      return true;
    });
  }

  // 时间格式化：2026-11-04T14:12:25+00:00 → 2026-11-04 22:12:25（本地时区）
  function fmtDate(s) {
    if (!s) return '—';
    const d = new Date(s);
    if (isNaN(d)) return s;
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
           p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }

  // 渲染批次下拉（去重排序）
  function populateBatchFilter() {
    const sel = $('#filterBatch');
    const cur = sel.value;
    const batches = Array.from(new Set(allRows.map((it) => it.batch || '手动/初始'))).sort();
    sel.innerHTML = '<option value="">全部批次</option>' +
      batches.map((b) => '<option value="' + b + '">' + b + '</option>').join('');
    sel.value = cur;
  }

  // 渲染列表（按当前筛选）
  function renderList() {
    const rows = getFiltered();
    listEl.innerHTML = '';
    if (!rows.length) { listEl.innerHTML = '<div class="hint">没有符合条件的密码</div>'; return; }
    rows.forEach((it) => {
      const used = it.count || 0;
      const avail = Math.max(0, MAX - used);
      const row = document.createElement('div');
      row.className = 'row';
      const pw = document.createElement('span'); pw.className = 'pw'; pw.textContent = it.password;
      const bt = document.createElement('span'); bt.className = 'bt'; bt.textContent = it.batch || '手动/初始'; bt.title = it.batch || '手动/初始';
      const st = document.createElement('span'); st.className = 'st ' + (avail > 0 ? 'ok' : 'no'); st.textContent = avail > 0 ? '可用' : '已用完';
      const ct = document.createElement('span'); ct.className = 'ct'; ct.textContent = '已用 ' + used + ' / ' + MAX;
      const btn = document.createElement('button'); btn.className = 'del'; btn.textContent = '删除';
      btn.onclick = async () => {
        const r = await call('admin_remove_password', { p: it.password });
        if (r && r.ok) { showMsg('已删除 ' + it.password, true); await refresh(); }
        else showMsg((r && r.reason) || '删除失败', false);
      };
      row.appendChild(pw); row.appendChild(bt); row.appendChild(st); row.appendChild(ct); row.appendChild(btn);
      listEl.appendChild(row);
    });
  }

  async function refresh() {
    const res = await call('admin_list', { admin_pw: adminPw });
    if (!res || !res.ok) { showMsg(res && res.reason || '加载失败', false); return; }
    allRows = res.list || [];
    populateBatchFilter();
    renderList();
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

  // ---------- 批量生成测评密码 ----------
  let lastGen = [];  // 本次生成的密码，用于导出
  async function doGenerate() {
    const n = parseInt($('#genCount').value, 10);
    if (!n || n < 1 || n > 200) { showMsg('请输入 1-200 之间的数量', false); return; }
    showMsg('正在生成…', true);
    const r = await call('admin_generate_passwords', { n: n, admin_pw: adminPw });
    if (r && r.ok) {
      lastGen = r.list || [];
      $('#genInfo').textContent = '已生成 ' + lastGen.length + ' 个密码（已自动入库）：';
      const gl = $('#genList'); gl.innerHTML = '';
      lastGen.forEach(p => { const d = document.createElement('div'); d.textContent = p; gl.appendChild(d); });
      $('#genResult').classList.remove('hide');
      showMsg('生成成功，共 ' + lastGen.length + ' 个', true);
      await refresh();  // 刷新主列表，显示新密码
    } else {
      showMsg((r && r.reason) || '生成失败', false);
    }
  }
  async function doExport() {
    if (!lastGen.length) { showMsg('没有可导出的密码，请先生成', false); return; }
    const text = lastGen.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '测评密码_' + lastGen.length + '个.txt';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
    showMsg('已导出 ' + lastGen.length + ' 个密码', true);
  }

  // 导出 Excel（当前筛选结果），含自动筛选，可用/已用完/批次/生成时间等字段
  async function doExportXlsx() {
    if (typeof XLSX === 'undefined') { showMsg('Excel 组件未加载（请检查网络后刷新页面）', false); return; }
    const rows = getFiltered();
    if (!rows.length) { showMsg('没有可导出的密码', false); return; }
    const data = rows.map((it) => {
      const used = it.count || 0;
      const avail = Math.max(0, MAX - used);
      return {
        '密码': it.password,
        '批次': it.batch || '手动/初始',
        '生成时间': fmtDate(it.created_at),
        '已用次数': used,
        '总次数上限': MAX,
        '可用次数': avail,
        '状态': avail > 0 ? '可用' : '已用完'
      };
    });
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ['密码', '批次', '生成时间', '已用次数', '总次数上限', '可用次数', '状态']
    });
    ws['!cols'] = [
      { wch: 22 }, { wch: 24 }, { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }
    ];
    // 开启首行自动筛选（Excel 中可点列头按批次/状态筛选）
    const range = XLSX.utils.decode_range(ws['!ref']);
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '测评密码');
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    XLSX.writeFile(wb, '测评密码_' + rows.length + '条_' + ts + '.xlsx');
    showMsg('已导出 ' + rows.length + ' 条（含自动筛选）', true);
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
  $('#genBtn').onclick = doGenerate;
  $('#exportBtn').onclick = doExport;
  $('#exportXlsxBtn').onclick = doExportXlsx;
  $('#filterBatch').onchange = renderList;
  $('#filterStatus').onchange = renderList;
  $('#logoutBtn').onclick = logout;
})();
