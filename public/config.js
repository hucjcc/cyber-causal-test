// =============================================================
// Supabase 配置 —— 部署到 GitHub Pages 前请填入你的项目信息
// 这里的 anon key 是「公开安全」的（专为前端设计），可以提交到仓库；
// service_role key 切勿出现在前端代码中。
//
// 在 Supabase 控制台 → Project Settings → API 中可找到下面两项。
// 填好后把 USE_SUPABASE 改为 true（本地用 node server.js 调试时可保持 false）。
// =============================================================
window.APP_CONFIG = {
  USE_SUPABASE: false,                                       // ← 部署上线后改为 true
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",       // ← 你的 Project URL
  SUPABASE_ANON_KEY: "YOUR-ANON-KEY",                          // ← 你的 anon / public key
  MAX_TESTS: 3                                               // 每个密码可接入次数
};
