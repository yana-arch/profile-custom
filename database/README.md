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

### Bước 4: Setup User Synchronization

**Quan trọng:** Để authentication hoạt động đúng với custom users table:

**Cách 1: Sử dụng Supabase Dashboard (khuyên dùng)**

1. Vào **SQL Editor** trong Supabase
2. Chạy từng lệnh sau đây:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role has full access" ON users FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON users TO anon, authenticated;

-- Function to auto-create user record
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync auth.users with custom users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user record
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', users.full_name),
    updated_at = NEW.updated_at,
    last_login = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();
```

**Cách 2: Sử dụng file SQL (nếu cách 1 không hoạt động)**

- Copy nội dung từ file `database/setup_rls.sql`
- Paste và chạy trong SQL Editor

### Bước 5: Row Level Security (RLS)

RLS đã được setup ở bước trước. Bạn có thể kiểm tra **Authentication** → **Policies**.

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
