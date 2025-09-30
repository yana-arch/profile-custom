# Database Setup Guide

## Tổng quan

Dự án sử dụng **Supabase** (PostgreSQL) để quản lý dữ liệu đa người dùng, thay thế localStorage hiện tại.

## Cấu trúc Database

### Các bảng chính:

1. **`users`** - Thông tin người dùng và xác thực
2. **`profiles`** - Dữ liệu profile của từng user (JSONB)
3. **`templates`** - Template cộng đồng
4. **`template_categories`** - Danh mục template
5. **`profile_shares`** - Chia sẻ profile công khai
6. **`user_sessions`** - Quản lý phiên đăng nhập
7. **`css_validations`** - Validate CSS tùy chỉnh

## 🚀 Hướng dẫn Setup

### Bước 1: Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới:
   - **Name**: `dynamic-profile` hoặc tên phù hợp
   - **Database Password**: Lưu lại mật khẩu này
   - **Region**: Chọn region gần nhất (ví dụ: Singapore)

### Bước 2: Chạy Database Migration

1. Vào **Supabase Dashboard** → **SQL Editor**
2. Copy toàn bộ nội dung từ `migrations/001_initial_schema.sql`
3. Paste vào SQL Editor và chạy (`Run`)

### Bước 3: Cấu hình Authentication

1. Vào **Authentication** → **Settings**
2. Cấu hình:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: Thêm các URL cần thiết
   - Bật **Email Confirmations** nếu cần

### Bước 4: Row Level Security (RLS)

Supabase sẽ tự động enable RLS. Để cấu hình policies:

1. Vào **Authentication** → **Policies**
2. Hoặc chạy SQL policies từ file `migrations/001_initial_schema.sql`

### Bước 5: Lấy API Keys

1. Vào **Settings** → **API**
2. Copy các keys:
   - **Project URL** (SUPABASE_URL)
   - **Anon public key** (SUPABASE_ANON_KEY)
   - **Service role key** (SUPABASE_SERVICE_ROLE_KEY)

## 🔧 Cấu hình Environment Variables

Tạo file `.env.local` trong dự án:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📝 Các bước tiếp theo

Sau khi setup xong database:

1. **Cài đặt Supabase client** trong dự án React
2. **Tạo authentication service** để quản lý đăng nhập/đăng xuất
3. **Tạo profile service** để sync dữ liệu với Supabase
4. **Cập nhật App.tsx** để sử dụng authentication
5. **Test các tính năng** cơ bản

## 🔒 Bảo mật

- **RLS**: Đã được cấu hình để bảo vệ dữ liệu
- **CORS**: Supabase xử lý tự động
- **API Keys**: Không commit service role key lên Git
- **Rate Limiting**: Supabase có sẵn rate limiting

## 📊 Monitoring

- **Supabase Dashboard**: Theo dõi usage, performance
- **Logs**: Kiểm tra authentication logs
- **Metrics**: Database performance metrics

## 🛠️ Development Workflow

1. Phát triển local với hot reload
2. Test với dữ liệu thật trên Supabase
3. Deploy khi sẵn sàng production

## 📚 Tài liệu tham khảo

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
