// render.js — Logic dùng chung cho MỌI trang ngày (dayXX/index.html).
//
// Nhiệm vụ:
//  1. Phát hiện ngày hiện tại từ URL.
//  2. fetch('./README.md') trong cùng folder.
//  3. Render markdown bằng marked, với CUSTOM RENDERER cho ```mermaid```
//     (xuất text KHÔNG escape vào <pre class="mermaid"> để Mermaid xử lý).
//  4. Sau khi inject DOM mới gọi mermaid.run() (startOnLoad đã tắt).
//  5. Dựng nav Prev/Next/Home từ data.js.
//  6. Loading state + error state rõ ràng (404 / mở bằng file://).
//
// Pin version CDN chính xác trong dayXX/index.html (marked@12, mermaid@11).

import { DAYS, TIER_LABELS } from "./data.js";
import { applyTheme, initThemeToggle, markVisited } from "./progress.js";
import { setupMermaid, renderMermaid } from "./mermaid-init.js";
import hljs from "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/+esm";

// --- Phát hiện ngày hiện tại từ URL (vd .../day07/ -> slug "day07") ---
function getCurrentSlug() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  // Tìm phần khớp dayNN trong path
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^day\d{2}$/.test(parts[i])) return parts[i];
  }
  return null;
}

// --- marked: custom renderer giữ nguyên text cho mermaid ---
function configureMarked() {
  // marked được nạp qua <script> global (window.marked)
  const renderer = new marked.Renderer();
  const defaultCode = renderer.code.bind(renderer);

  // Hỗ trợ CẢ HAI chữ ký renderer:
  //  - marked v12: code(code, infostring, escaped)  ← positional
  //  - marked v13+: code({ text, lang })            ← token object
  renderer.code = function (codeArg, infostring, escaped) {
    let text, lang;
    if (typeof codeArg === "object" && codeArg !== null) {
      text = codeArg.text;
      lang = codeArg.lang;
    } else {
      text = codeArg;
      lang = infostring;
    }
    if ((lang || "").trim().toLowerCase() === "mermaid") {
      // QUAN TRỌNG: xuất text RAW, không escape (giữ -->, &, "")
      return `<pre class="mermaid">${text}</pre>`;
    }
    return defaultCode.call(renderer, codeArg, infostring, escaped);
  };

  marked.setOptions({ renderer, gfm: true, breaks: false });
}

// --- Dựng thanh điều hướng Prev/Next/Home ---
function buildNav(idx) {
  const prev = idx > 0 ? DAYS[idx - 1] : null;
  const next = idx < DAYS.length - 1 ? DAYS[idx + 1] : null;

  const prevHtml = prev
    ? `<a class="nav-link prev" href="../${prev.slug}/">← Ngày ${prev.day}: ${prev.title}</a>`
    : `<span class="nav-link disabled">← Đầu lộ trình</span>`;
  const nextHtml = next
    ? `<a class="nav-link next" href="../${next.slug}/">Ngày ${next.day}: ${next.title} →</a>`
    : `<span class="nav-link disabled">Hết lộ trình →</span>`;

  return `
    <nav class="day-nav" aria-label="Điều hướng giữa các ngày">
      ${prevHtml}
      <a class="nav-link home" href="../index.html">⌂ Trang chủ</a>
      ${nextHtml}
    </nav>`;
}

// --- Header của trang ngày ---
function buildHeader(meta) {
  const tier = TIER_LABELS[meta.tier] || meta.tier;
  return `
    <header class="day-header">
      <div class="day-badge tier-${meta.tier}">${tier}</div>
      <div class="day-kicker">Ngày ${meta.day} / 14 · Tuần ${meta.week}</div>
      <h1 class="day-title">${meta.title}</h1>
    </header>`;
}

function renderError(container, title, detail) {
  container.innerHTML = `
    <div class="state-box state-error" role="alert">
      <h2>${title}</h2>
      <p>${detail}</p>
      <p class="hint">
        Trang này cần chạy qua <strong>web server</strong> (không mở bằng
        <code>file://</code>). Thử:
        <code>python3 -m http.server</code> rồi mở
        <code>http://localhost:8000</code>, hoặc dùng Live Server / Vercel.
      </p>
      <p><a class="nav-link home" href="../index.html">⌂ Về trang chủ</a></p>
    </div>`;
}

// --- Tô màu syntax cho code block (kiểu VSCode) bằng highlight.js ---
// Không đụng tới ```mermaid``` (đã thành <pre class="mermaid">, không có <code>).
function highlightCode(root) {
  // Map các alias không có sẵn trong bundle highlight.js sang ngôn ngữ tương đương.
  const LANG_ALIAS = { jsonc: "json", mjs: "javascript", cjs: "javascript" };

  const blocks = root.querySelectorAll("pre code");
  blocks.forEach((block) => {
    // Bỏ qua nếu nằm trong .mermaid (phòng hờ)
    if (block.closest(".mermaid")) return;

    // Đổi class language-<alias> sang ngôn ngữ highlight.js hiểu được
    const m = block.className.match(/language-([\w-]+)/);
    const lang = m && m[1] ? m[1].toLowerCase() : "";
    if (lang && LANG_ALIAS[lang]) {
      block.classList.remove(`language-${lang}`);
      block.classList.add(`language-${LANG_ALIAS[lang]}`);
    }

    try {
      hljs.highlightElement(block);
    } catch (e) {
      // Lỗi 1 block không làm hỏng cả trang
      console.error("highlight error:", e);
    }
  });
}

async function renderDay() {
  applyTheme();
  const container = document.getElementById("content");
  if (!container) return;

  const slug = getCurrentSlug();
  const idx = DAYS.findIndex((d) => d.slug === slug);
  const meta = idx >= 0 ? DAYS[idx] : null;

  if (!meta) {
    renderError(
      container,
      "Không xác định được ngày",
      "URL không khớp với folder dayNN nào."
    );
    return;
  }

  document.title = `Ngày ${meta.day} · ${meta.title}`;

  // Loading state
  container.innerHTML = `<div class="state-box state-loading">Đang tải nội dung Ngày ${meta.day}…</div>`;

  let md;
  try {
    const res = await fetch("./README.md", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    md = await res.text();
  } catch (err) {
    renderError(
      container,
      "Không tải được README.md",
      `Lỗi: ${err.message}. Có thể do mở bằng file:// hoặc thiếu file.`
    );
    return;
  }

  configureMarked();
  const bodyHtml = marked.parse(md);

  container.innerHTML = `
    ${buildHeader(meta)}
    ${buildNav(idx)}
    <article class="day-content">${bodyHtml}</article>
    ${buildNav(idx)}`;

  // Mermaid: startOnLoad=false nên phải gọi run() thủ công SAU khi inject DOM.
  // setupMermaid đăng ký hàm render để tự dựng lại đúng màu khi đổi theme.
  setupMermaid(() => renderMermaid(".day-content .mermaid"));

  // Tô màu code block kiểu VSCode (sau khi đã inject DOM)
  highlightCode(container);

  // Đánh dấu đã ghé thăm ngày này + gắn nút theme
  markVisited(meta.slug);
  initThemeToggle();
}

renderDay();
