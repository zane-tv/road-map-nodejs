// hub.js — Render trang chủ (index.html): grid card 14 ngày, thanh tiến độ,
// checkbox đánh dấu hoàn thành, nút dark mode.

import { DAYS, TIER_LABELS } from "./data.js";
import {
  applyTheme,
  initThemeToggle,
  getProgress,
  isCompleted,
  setCompleted,
} from "./progress.js";

function cardHtml(meta) {
  const tier = TIER_LABELS[meta.tier] || meta.tier;
  const done = isCompleted(meta.slug);
  const topics = meta.topics
    .map((t) => `<span class="chip">${t}</span>`)
    .join("");
  return `
    <article class="card ${done ? "is-done" : ""}" data-slug="${meta.slug}">
      <div class="card-top">
        <span class="card-day">Ngày ${meta.day}</span>
        <span class="card-tier tier-${meta.tier}">${tier}</span>
      </div>
      <h3 class="card-title">
        <a href="./${meta.slug}/">${meta.title}</a>
      </h3>
      <p class="card-summary">${meta.summary}</p>
      <div class="card-chips">${topics}</div>
      <label class="card-check">
        <input type="checkbox" data-slug="${meta.slug}" ${done ? "checked" : ""} />
        Đã hoàn thành
      </label>
    </article>`;
}

function weekSection(weekNo, label) {
  const items = DAYS.filter((d) => d.week === weekNo).map(cardHtml).join("");
  return `
    <section class="week">
      <h2 class="week-title">Tuần ${weekNo} — ${label}</h2>
      <div class="grid">${items}</div>
    </section>`;
}

function renderProgress() {
  const { count, pct } = getProgress(DAYS.length);
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");
  if (bar) bar.style.width = `${pct}%`;
  if (text) text.textContent = `${count}/${DAYS.length} ngày · ${pct}%`;
}

function renderHub() {
  applyTheme();

  const root = document.getElementById("days-root");
  if (root) {
    root.innerHTML =
      weekSection(1, "Core Node & I/O") + weekSection(2, "Web, API & Scaling");
  }

  renderProgress();
  initThemeToggle();

  // Checkbox hoàn thành
  document.querySelectorAll('input[type="checkbox"][data-slug]').forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const slug = e.target.getAttribute("data-slug");
      setCompleted(slug, e.target.checked);
      const card = document.querySelector(`.card[data-slug="${slug}"]`);
      if (card) card.classList.toggle("is-done", e.target.checked);
      renderProgress();
    });
  });
}

renderHub();
