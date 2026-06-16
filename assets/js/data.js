// Metadata cho 14 ngày. Là nguồn dữ liệu duy nhất điều khiển:
// - Grid card ở trang hub (index.html)
// - Điều hướng Prev/Next ở mỗi trang ngày
// - Thanh tiến độ học tập
//
// Thứ tự trong mảng = thứ tự ngày. Prev/Next suy ra từ index.

export const DAYS = [
  {
    day: 1,
    slug: "day01",
    title: "Nền tảng JavaScript cho Node & Module System",
    summary:
      "First-class functions, higher-order functions, ESM vs CommonJS, NPM/semver. Khởi tạo project Tasks API.",
    topics: ["First-class fn", "HOF", "ESM/CJS", "NPM", "semver"],
    tier: "foundational",
    week: 1,
  },
  {
    day: 2,
    slug: "day02",
    title: "Node Runtime, V8 & HTTP Server đầu tiên",
    summary:
      "Mô hình single-thread, event-driven, vì sao single-thread, vai trò V8. Dựng raw HTTP server trả JSON.",
    topics: ["Single-thread", "Event-driven", "V8", "http module"],
    tier: "foundational",
    week: 1,
  },
  {
    day: 3,
    slug: "day03",
    title: "Event Loop & Non-blocking I/O",
    summary:
      "6 phase của event loop, observer pattern, blocking vs non-blocking, libuv thread pool. Stretch: Streams & Buffers.",
    topics: ["Event Loop", "libuv", "nextTick", "setImmediate", "Streams*"],
    tier: "foundational",
    week: 1,
  },
  {
    day: 4,
    slug: "day04",
    title: "Async Patterns: Callback → Promise → async/await",
    summary:
      "Callback hell, Promise, async/await, exponential backoff, control flow. Refactor I/O của Tasks API.",
    topics: ["Callback", "Promise", "async/await", "backoff"],
    tier: "foundational",
    week: 1,
  },
  {
    day: 5,
    slug: "day05",
    title: "Error Handling đúng cách",
    summary:
      "try/catch với async, error-first callback, operational vs programmer error, unhandledRejection. Chuẩn hoá lỗi API.",
    topics: ["try/catch", "error-first", "operational error", "unhandledRejection"],
    tier: "intermediate",
    week: 1,
  },
  {
    day: 6,
    slug: "day06",
    title: "EventEmitter & Lập trình hướng sự kiện",
    summary:
      "on/emit/removeListener, tính đồng bộ khi emit, ứng dụng thực tế. Logger qua EventEmitter cho Tasks API.",
    topics: ["EventEmitter", "on/emit", "observer"],
    tier: "intermediate",
    week: 1,
  },
  {
    day: 7,
    slug: "day07",
    title: "HTTP & Nền tảng Web Service",
    summary:
      "Web service vs API, REST vs SOAP (khái niệm), sync vs async, protocol stack, status codes ↔ kết quả.",
    topics: ["Web service", "REST vs SOAP", "HTTP", "status code"],
    tier: "intermediate",
    week: 2,
  },
  {
    day: 8,
    slug: "day08",
    title: "Thiết kế REST API",
    summary:
      "HTTP methods ↔ CRUD, status codes, statelessness, thiết kế resource URL, API versioning cho Tasks API.",
    topics: ["REST", "CRUD", "statelessness", "versioning"],
    tier: "intermediate",
    week: 2,
  },
  {
    day: 9,
    slug: "day09",
    title: "Express & Middleware",
    summary:
      "Middleware chain, tách app/server, routing, error-handling middleware. Migrate Tasks API sang Express.",
    topics: ["Express", "Middleware", "Routing", "Error middleware"],
    tier: "intermediate",
    week: 2,
  },
  {
    day: 10,
    slug: "day10",
    title: "Env/Config & Database với SQLite",
    summary:
      "process.env, dotenv, NODE_ENV, 12-factor. Nối SQLite (better-sqlite3) cho CRUD tasks thật.",
    topics: ["process.env", "dotenv", "SQLite", "CRUD DB"],
    tier: "intermediate",
    week: 2,
  },
  {
    day: 11,
    slug: "day11",
    title: "Authentication & Security",
    summary:
      "Sessions/cookies vs JWT, OAuth 2.0 (khái niệm), SSL/TLS, rate limiting. Bảo vệ Tasks API.",
    topics: ["JWT", "Session", "OAuth2", "Rate limiting", "TLS"],
    tier: "advanced",
    week: 2,
  },
  {
    day: 12,
    slug: "day12",
    title: "Testing với node:test & supertest",
    summary:
      "node:test built-in, supertest cho HTTP, unit vs integration, stub/mock. Viết test cho các endpoint Tasks API.",
    topics: ["node:test", "supertest", "unit", "integration", "stub"],
    tier: "intermediate",
    week: 2,
  },
  {
    day: 13,
    slug: "day13",
    title: "Caching & Performance",
    summary:
      "HTTP cache/ETag, Redis (khái niệm), đo hiệu năng với perf_hooks & async_hooks. Thêm caching cho Tasks API.",
    topics: ["HTTP cache", "ETag", "Redis", "perf_hooks"],
    tier: "advanced",
    week: 2,
  },
  {
    day: 14,
    slug: "day14",
    title: "Concurrency, Real-time, Microservices & Tổng kết",
    summary:
      "Cluster vs Worker Threads, load balancing, WebSocket, microservices & message queue (khái niệm), checklist phỏng vấn.",
    topics: ["Cluster", "Worker Threads", "WebSocket", "Microservices", "Queue"],
    tier: "advanced",
    week: 2,
  },
];

// Nhãn hiển thị cho từng tier
export const TIER_LABELS = {
  foundational: "Nền tảng",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};
