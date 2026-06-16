// progress.js — Dark mode + theo dõi tiến độ học, lưu bằng localStorage.
// Dùng chung cho cả trang hub (index.html) lẫn các trang ngày.

const THEME_KEY = "roadmap-theme";
const VISITED_KEY = "roadmap-visited";

// ---------- THEME ----------
export function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  // Mặc định theo hệ điều hành nếu chưa lưu
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

export function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  updateToggleLabel();
  return next;
}

function updateToggleLabel() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  btn.textContent = dark ? "☀️ Sáng" : "🌙 Tối";
  btn.setAttribute("aria-label", dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
}

// Gắn sự kiện cho nút #theme-toggle nếu có trên trang
export function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  updateToggleLabel();
  btn.addEventListener("click", toggleTheme);
}

// ---------- PROGRESS ----------
function readVisited() {
  try {
    return JSON.parse(localStorage.getItem(VISITED_KEY)) || {};
  } catch {
    return {};
  }
}

function writeVisited(obj) {
  localStorage.setItem(VISITED_KEY, JSON.stringify(obj));
}

// Đánh dấu một ngày đã được mở/học
export function markVisited(slug) {
  const v = readVisited();
  if (!v[slug]) {
    v[slug] = true;
    writeVisited(v);
  }
}

// Bật/tắt thủ công trạng thái hoàn thành (dùng cho checkbox ở hub)
export function setCompleted(slug, done) {
  const v = readVisited();
  if (done) v[slug] = true;
  else delete v[slug];
  writeVisited(v);
}

export function isCompleted(slug) {
  return !!readVisited()[slug];
}

export function getProgress(totalDays) {
  const count = Object.keys(readVisited()).length;
  const pct = totalDays ? Math.round((count / totalDays) * 100) : 0;
  return { count, pct };
}
