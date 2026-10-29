# Hệ thống quản lý món ăn trên nền tảng đám mây

## Thông tin sinh viên

- Họ tên: **Phạm Chí Nguyên**
- MSSV: **236945**
- Học phần: **Điện toán đám mây**

## Giới thiệu

Dự án xây dựng hệ thống quản lý món ăn gồm:

- Frontend sử dụng React + Vite
- Backend sử dụng Node.js + Express
- Cơ sở dữ liệu MongoDB Atlas
- Quản lý mã nguồn bằng GitHub
- Đóng gói ứng dụng bằng Docker
- Lưu trữ Docker image trên Docker Hub
- Triển khai frontend và backend trên Render

## Công nghệ sử dụng

- React
- Vite
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Docker
- Docker Hub
- Render
- Git / GitHub

## Cấu trúc dự án

```text
236945_PhamChiNguyen/
├── backend/
│   ├── models/
│   │   └── Food.js
│   ├── routes/
│   │   └── foodRoutes.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## MongoDB Atlas

- Database: `236945_PhamChiNguyen`
- Collection: `foods`
- Cluster: `PhamChiNguyen236945`

Thông tin xác thực MongoDB được lưu bằng biến môi trường và không được đưa lên GitHub.

## Backend API

Backend hỗ trợ các API:

| Method | Endpoint                | Chức năng                   |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/foods`            | Lấy danh sách món ăn        |
| GET    | `/api/foods/:id`        | Xem chi tiết món ăn         |
| POST   | `/api/foods`            | Thêm món ăn                 |
| PUT    | `/api/foods/:id`        | Cập nhật món ăn             |
| DELETE | `/api/foods/:id`        | Xóa món ăn                  |
| GET    | `/api/foods?search=pho` | Tìm kiếm món ăn             |
| GET    | `/health`               | Kiểm tra trạng thái backend |

## Chạy Backend Local

Di chuyển vào thư mục backend:

```bash
cd backend
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Chạy backend:

```bash
npm start
```

Backend local:

```text
http://localhost:5000
```

## Chạy Frontend Local

Di chuyển vào thư mục frontend:

```bash
cd frontend
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Chạy frontend:

```bash
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Docker Backend

Docker image:

```text
phamchinguyen236945/backend:1.0
```

Build:

```bash
docker build -t phamchinguyen236945/backend:1.0 ./backend
```

Chạy container:

```bash
docker run -d -p 5000:5000 --env-file ./backend/.env phamchinguyen236945/backend:1.0
```

Docker Hub:

https://hub.docker.com/r/phamchinguyen236945/backend

## Docker Frontend

Docker image production:

```text
phamchinguyen236945/frontend:2.0
```

Build frontend với backend Render:

```bash
docker build --build-arg VITE_API_URL=https://api-236945.onrender.com -t phamchinguyen236945/frontend:2.0 ./frontend
```

Docker Hub:

https://hub.docker.com/r/phamchinguyen236945/frontend

## Render Backend

Backend API:

https://api-236945.onrender.com

Health Check:

https://api-236945.onrender.com/health

Foods API:

https://api-236945.onrender.com/api/foods

Docker Backend:

```text
phamchinguyen236945/backend:1.0
```

## Render Frontend

Frontend:

https://web-236945.onrender.com

Backend được frontend sử dụng:

https://api-236945.onrender.com

Docker Frontend:

```text
phamchinguyen236945/frontend:2.0
```

## GitHub Repository

https://github.com/PhamChiNguyen236945/236945_PhamChiNguyen

## Các chức năng đã hoàn thành

- Hiển thị danh sách món ăn
- Xem chi tiết món ăn
- Thêm món ăn mới
- Cập nhật món ăn
- Xóa món ăn
- Tìm kiếm món ăn theo tên, loại hoặc vùng miền
- Kiểm tra dữ liệu đầu vào
- Không cho phép trùng `foodId`
- Hiển thị loading và thông báo kết quả
- Kết nối MongoDB Atlas
- Docker hóa backend
- Docker hóa frontend
- Push image lên Docker Hub
- Deploy backend lên Render
- Deploy frontend lên Render
- Kiểm tra API thông qua URL công khai

## Bảo mật

Không lưu các thông tin sau trong repository công khai:

- Mật khẩu MongoDB
- MongoDB connection string có thông tin xác thực
- Access token
- File `.env`

Các thông tin nhạy cảm được cấu hình thông qua biến môi trường.
