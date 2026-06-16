// mermaid-init.js — Khởi tạo & render Mermaid dùng chung cho HUB + mọi trang ngày.
//
// Tại sao tách file:
//  - DRY: 1 nơi định nghĩa themeVariables thay vì sửa 16 file HTML.
//  - Tương phản tốt trên CẢ dark lẫn light: dùng theme "base" + themeVariables
//    tùy biến (theme 'dark'/'default' mặc định cho node bị trắng/mờ trên nền site).
//  - Re-render khi đổi theme: cache source gốc của mỗi sơ đồ, dựng lại đúng màu.
//
// startOnLoad=false: hub/render.js chủ động gọi renderMermaid() sau khi DOM sẵn sàng.

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

// Cache text gốc của từng <pre class="mermaid"> để dựng lại khi đổi theme.
const sources = new WeakMap();

// Hàm render hiện hành của trang (để re-render đúng phạm vi khi toggle theme).
let rerender = () => renderMermaid();

function currentIsDark() {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark") return true;
  // Mặc định light khi chưa chọn hoặc thuộc tính chưa được đặt.
  return false;
}

function themeVariables(dark) {
  if (dark) {
    return {
      darkMode: true,
      fontFamily: FONT,
      fontSize: "15px",
      background: "#161b22",
      // Node: nền xanh-tối + viền accent + chữ sáng -> tương phản rõ
      primaryColor: "#1f2d25",
      primaryTextColor: "#e6edf3",
      primaryBorderColor: "#3fb950",
      mainBkg: "#1f2d25",
      nodeBorder: "#3fb950",
      nodeTextColor: "#e6edf3",
      secondaryColor: "#1c232c",
      secondaryTextColor: "#e6edf3",
      secondaryBorderColor: "#3a4654",
      tertiaryColor: "#11181f",
      tertiaryTextColor: "#e6edf3",
      tertiaryBorderColor: "#2a323c",
      lineColor: "#7d8a99",
      textColor: "#e6edf3",
      titleColor: "#9aa6b2",
      // Subgraph (cluster)
      clusterBkg: "#11181f",
      clusterBorder: "#2a3a30",
      // Nhãn trên cạnh
      edgeLabelBackground: "#1c232c",
    };
  }
  return {
    darkMode: false,
    fontFamily: FONT,
    fontSize: "15px",
    background: "#ffffff",
    primaryColor: "#e9f6ee",
    primaryTextColor: "#173a23",
    primaryBorderColor: "#2f9e44",
    mainBkg: "#e9f6ee",
    nodeBorder: "#2f9e44",
    nodeTextColor: "#173a23",
    secondaryColor: "#eef1f5",
    secondaryTextColor: "#1c2128",
    secondaryBorderColor: "#cdd5df",
    tertiaryColor: "#f7f8fa",
    tertiaryTextColor: "#1c2128",
    tertiaryBorderColor: "#e2e6ec",
    lineColor: "#8a96a4",
    textColor: "#1c2128",
    titleColor: "#5b6573",
    clusterBkg: "#f3f7f4",
    clusterBorder: "#cfe3d6",
    edgeLabelBackground: "#ffffff",
  };
}

function applyConfig(useMaxWidth) {
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: themeVariables(currentIsDark()),
    fontFamily: FONT,
    flowchart: {
      htmlLabels: true,
      curve: "basis",
      nodeSpacing: 34,
      rankSpacing: 52,
      padding: 16,
      useMaxWidth,
    },
  });
}

/**
 * Render mọi sơ đồ khớp `selector`.
 * @param {string} selector  CSS selector cho các <pre class="mermaid">
 * @param {object} [opts]
 * @param {boolean} [opts.useMaxWidth=true]  false = render đúng kích thước tự nhiên
 *        (cho sơ đồ rộng như lộ trình hub) rồi cuộn ngang thay vì co nhỏ chữ.
 */
export async function renderMermaid(selector = ".mermaid", opts = {}) {
  const useMaxWidth = opts.useMaxWidth !== false;
  applyConfig(useMaxWidth);

  const nodes = [...document.querySelectorAll(selector)];
  if (!nodes.length) return;

  nodes.forEach((el) => {
    // Lần đầu: lưu source gốc. Lần sau (đổi theme): dựng lại từ source.
    if (!sources.has(el)) sources.set(el, el.textContent);
    el.textContent = sources.get(el);
    el.removeAttribute("data-processed");
  });

  try {
    await mermaid.run({ nodes });
  } catch (e) {
    console.error("Mermaid render error:", e);
  }
}

/**
 * Đăng ký hàm render của trang & chạy ngay. Hàm này sẽ được gọi lại tự động
 * mỗi khi người dùng đổi theme để sơ đồ luôn khớp màu nền.
 */
export function setupMermaid(fn) {
  rerender = fn;
  return fn();
}

// Re-render khi theme đổi (progress.js phát sự kiện này).
window.addEventListener("roadmap:themechange", () => {
  // Chờ 1 frame để [data-theme] mới được áp dụng trước khi đọc màu.
  requestAnimationFrame(() => rerender());
});

window.mermaid = mermaid;
export default mermaid;
