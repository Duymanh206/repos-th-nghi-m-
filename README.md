# Hệ thống tuyển dụng nội bộ — Frontend
Team K3S4_N3. Skeleton React + TypeScript + Vite; chưa có trang nghiệp vụ.

## Chạy
Node.js đáp ứng engines của dependency và npm. 
- `npm ci` → `npm run dev`. 
- Build: `npm run build`
- Lint: `npm run lint`
- Preview: `npm run preview`

Chưa cấu hình test runner; `tests/` dành cho test bổ sung theo Subtask. Sao chép `.env.example` thành `.env` nếu cần. `VITE_API_BASE_URL` chuẩn bị cho API client sau này, hiện skeleton chưa gọi API. Biến `VITE_*` được đưa vào client, không đặt secret.

---

## Subtask [TKNHTTDNB1-584](https://ttcs-k3s4-n3.atlassian.net/browse/TKNHTTDNB1-584)
Kiểm tra kết nối REST API, chưa có nghiệp vụ hoặc authentication.

### Chạy cùng Backend
Dùng Node.js đáp ứng engines của dependencies, chạy `npm ci`.
Sao chép `.env.example` thành `.env`: `VITE_API_BASE_URL=http://localhost:8080/api`.

Trong repository Backend, cấu hình PostgreSQL qua `.env`, đặt `SERVER_PORT=8080`, `CORS_ALLOWED_ORIGINS=http://localhost:5173`, chạy `./mvnw.cmd spring-boot:run` (Linux/macOS: `sh ./mvnw spring-boot:run`).

Chạy `npm run dev`, mở `http://localhost:5173` và bấm **Kiểm tra kết nối Backend**.
Trong Network của trình duyệt, kiểm tra `GET http://localhost:8080/api/health`, HTTP 200 và JSON `{"status":"UP"}`.

Vite cố định port 5173 và báo lỗi nếu port bị chiếm để không vô tình lệch origin CORS. Đổi `.env` cần khởi động lại Vite; build production cần cấu hình URL trước `npm run build`. Biến `VITE_*` được đưa vào client, không đặt secret.

### Cách gọi API
- `src/services/api.ts` là client fetch dùng chung, lấy base URL từ môi trường, timeout 10 giây và chuẩn hóa lỗi HTTP/network/JSON.
- `src/services/healthService.ts` gọi `getJson('/health')` và kiểm tra contract status: `"UP"`.
- `src/App.tsx` hiển thị trạng thái chờ/thành công/lỗi; không tạo dữ liệu nghiệp vụ giả. Không dùng proxy, cookies, token hoặc authentication.

Nếu có lỗi kết nối: kiểm tra Backend/PostgreSQL, URL, port và origin CORS. Trình duyệt không luôn phân biệt được lỗi mạng với lỗi CORS; xem Network/Console để xác định.

### Kiểm tra
- `npm test`: Vitest kiểm tra URL/contract và lỗi 4xx/5xx/network/timeout/JSON/configuration bằng fetch mock.
- `npm run build`: TypeScript và Vite production build.
- `npm run lint`: Oxlint.
- `npm run preview`: mặc định origin khác dev; nếu kiểm tra API qua preview cần cấu hình Backend cho origin đó.

Mock tests không chứng minh kết nối runtime hoặc CORS trong browser. Cần chạy hai ứng dụng và PostgreSQL để kiểm tra thực tế.

### Git Flow
`main` ổn định, `develop` tích hợp, được tạo từ `main` khi initialization. Mỗi Jira Subtask có branch riêng chứa Subtask ID: `feature/`, `bugfix/`, `refactor/`, `chore/`. 

Branch cá nhân → PR → Branch `feature/TKNHTTDNB1-584-integrate-api` được tạo từ `develop`. Branch cá nhân `feature/bugfix/refactor/chore` → PR + review ít nhất một thành viên + CI/test → `develop`. `Develop` ổn định → PR + review → `main`. 

Không push trực tiếp `main`/`develop`. Conflict xử lý trên branch cá nhân, test/build lại trước merge.

