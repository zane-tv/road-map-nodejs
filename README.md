# Roadmap 14 ngày Intern Node.js

Lộ trình học Node.js cô đọng trong 14 ngày dành cho intern: từ **event loop** & **async I/O** tới **REST API**, **authentication**, **testing**, **caching** và **scaling**. Mỗi ngày là một bài học có mục tiêu rõ ràng, câu hỏi phỏng vấn cần trả lời, lý thuyết cốt lõi, sơ đồ Mermaid trực quan, và một phần của project **Tasks API** xây dần xuyên suốt.

## 🚀 Cách chạy

Site fetch file `README.md` của mỗi ngày và render động bằng marked.js + Mermaid, nên **phải chạy qua một web server** (không mở trực tiếp bằng `file://`).

```bash
# Cách 1: Python (có sẵn trên macOS/Linux)
python3 -m http.server 8000
# rồi mở http://localhost:8000

# Cách 2: dùng Live Server của VS Code (chuột phải index.html → Open with Live Server)

# Cách 3: npx serve
npx serve .
```

> Cần kết nối internet để tải marked.js và Mermaid từ CDN.

## 🗺️ Lộ trình

### Tuần 1 — Core Node & I/O

| Ngày | Chủ đề |
|---|---|
| [01](./day01/) | Nền tảng JavaScript cho Node & Module System |
| [02](./day02/) | Node Runtime, V8 & HTTP Server đầu tiên |
| [03](./day03/) | Event Loop & Non-blocking I/O |
| [04](./day04/) | Async Patterns: Callback → Promise → async/await |
| [05](./day05/) | Error Handling đúng cách |
| [06](./day06/) | EventEmitter & Lập trình hướng sự kiện |

### Tuần 2 — Web, API & Scaling

| Ngày | Chủ đề |
|---|---|
| [07](./day07/) | HTTP & Nền tảng Web Service |
| [08](./day08/) | Thiết kế REST API |
| [09](./day09/) | Express & Middleware |
| [10](./day10/) | Env/Config & Database với SQLite |
| [11](./day11/) | Authentication & Security |
| [12](./day12/) | Testing với node:test & supertest |
| [13](./day13/) | Caching & Performance |
| [14](./day14/) | Concurrency, Real-time, Microservices & Tổng kết |

## 🛠️ Project xuyên suốt: Tasks API

Một REST API quản lý công việc (tasks) được xây dần qua mỗi ngày, biến lý thuyết thành sản phẩm thực:

```
raw HTTP server → file I/O async → error handling → EventEmitter logger
→ REST design → Express → SQLite → JWT auth + rate limiting
→ testing → caching → scaling
```

Yêu cầu: **Node.js 20/22 LTS**, dùng **ESM** (`"type": "module"`).

## 📂 Cấu trúc

```
.
├── index.html          # Trang chủ điều hướng + sơ đồ lộ trình + tiến độ
├── assets/
│   ├── css/style.css   # Style dùng chung (dark/light mode)
│   └── js/
│       ├── data.js     # Metadata 14 ngày
│       ├── render.js   # Fetch + render markdown/Mermaid + điều hướng
│       ├── hub.js      # Logic trang chủ
│       └── progress.js # Dark mode + theo dõi tiến độ (localStorage)
└── dayXX/
    ├── index.html      # Shell mỏng, render README.md cùng folder
    └── README.md       # Nội dung bài học (xem đẹp cả trên GitHub)
```

## ✨ Tính năng

- **Dark mode** — lưu lựa chọn trên trình duyệt.
- **Thanh tiến độ** — đánh dấu hoàn thành từng ngày, lưu bằng `localStorage`.
- **Mermaid** — sơ đồ trực quan trong từng bài, hiển thị cả trên site lẫn GitHub.
- **Điều hướng Prev/Next** giữa các ngày.
