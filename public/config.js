// =============================================================
// Supabase 配置 —— 部署到 GitHub Pages 前请填入你的项目信息
// 这里的 anon key 是「公开安全」的（专为前端设计），可以提交到仓库；
// service_role key 切勿出现在前端代码中。
//
// 在 Supabase 控制台 → Project Settings → API 中可找到下面两项。
// 填好后把 USE_SUPABASE 改为 true（本地用 node server.js 调试时可保持 false）。
// =============================================================
window.APP_CONFIG = {
  USE_SUPABASE: true,                                         // ← 已上线 Supabase，开启
  SUPABASE_URL: "https://nttovdfecwpyvgxhwevh.supabase.co",    // ← 你的 Project URL
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50d292ZGZlY3dweXZneGh3dmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMzU2MDcsImV4cCI6MjEwODkxMTYwN30.G9TnUl5Y_9iLpNv4pcAR-Gj8N6PGy-DHR4NIxvkDDfY", // ← 你的 anon / public key
  MAX_TESTS: 3                                               // 每个密码可接入次数
};
