# 🔐 Social Authentication Setup Guide

## Tổng quan

Dự án sử dụng Supabase Authentication với hỗ trợ social login (Google, GitHub). Hướng dẫn này sẽ giúp bạn khắc phục lỗi "Unsupported provider" và cấu hình social auth.

## 🚨 Lỗi thường gặp

### Lỗi "Unsupported provider: provider is not enabled"

Lỗi này xảy ra khi:

- Social provider chưa được bật trong Supabase Dashboard
- OAuth credentials chưa được cấu hình đúng
- Redirect URLs chưa được thêm

## 📋 Hướng dẫn khắc phục

### Bước 1: Bật Google OAuth trong Supabase

1. **Truy cập Supabase Dashboard**

   - Đăng nhập vào [supabase.com](https://supabase.com)
   - Chọn project của bạn

2. **Vào Authentication → Providers**

   - Tìm phần **Google**
   - Click nút **Enable**

3. **Cấu hình Google OAuth:**
   ```
   Client ID: [Từ Google Cloud Console]
   Client Secret: [Từ Google Cloud Console]
   ```

### Bước 2: Bật GitHub OAuth trong Supabase

1. **Trong cùng trang Providers**
2. **Tìm GitHub và click Enable**
3. **Điền thông tin GitHub OAuth:**
   ```
   Client ID: [Từ GitHub OAuth Apps]
   Client Secret: [Từ GitHub OAuth Apps]
   ```

### Bước 3: Cập nhật Redirect URLs

**Trong Supabase Dashboard:**

- Vào **Authentication → Settings**
- Thêm vào **Redirect URLs**:
  ```
  http://localhost:3000
  https://your-domain.com (khi deploy)
  ```

## 🔑 Tạo OAuth Applications

### Google OAuth Setup

1. **Vào Google Cloud Console:**

   - Truy cập [console.cloud.google.com](https://console.cloud.google.com)
   - Tạo project mới hoặc chọn existing

2. **Bật Google+ API:**

   - Vào **APIs & Services → Library**
   - Tìm và bật **Google+ API**

3. **Tạo OAuth 2.0 Credentials:**

   - Vào **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client IDs**
   - Chọn **Web application**

4. **Cấu hình OAuth consent screen:**

   - Điền thông tin ứng dụng
   - Thêm scopes: `email`, `profile`, `openid`

5. **Thêm Redirect URI:**
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

### GitHub OAuth Setup

1. **Vào GitHub Settings:**

   - Truy cập GitHub.com
   - Vào **Settings → Developer settings → OAuth Apps**

2. **Tạo New OAuth App:**

   - **Authorization callback URL:**
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```

3. **Lấy Client ID và Secret:**
   - Copy **Client ID** và **Client Secret**
   - Điền vào Supabase Dashboard

## 🧪 Test Social Authentication

### Bước 1: Cập nhật .env.local

```bash
# Đảm bảo có các biến này
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Bước 2: Khởi động development server

```bash
npm run dev
```

### Bước 3: Test authentication

1. **Mở trình duyệt:** `http://localhost:3000`
2. **Click UserMenu** (góc trên phải)
3. **Chọn "Đăng nhập"**
4. **Thử social login buttons**

### Bước 4: Kiểm tra Console

- Mở Developer Tools (F12)
- Kiểm tra Console tab để xem lỗi
- Nếu có lỗi, kiểm tra lại cấu hình OAuth

## 🔍 Troubleshooting

### Lỗi phổ biến:

**1. "Invalid login credentials"**

- Kiểm tra Client ID và Secret
- Đảm bảo Redirect URLs đúng

**2. "OAuth callback URL mismatch"**

- Kiểm tra lại Authorization callback URL
- Đảm bảo đúng format: `https://your-project.supabase.co/auth/v1/callback`

**3. "OAuth consent screen not configured"**

- Cấu hình OAuth consent screen trong Google Cloud Console
- Publish app nếu cần thiết

### Debug Steps:

1. **Kiểm tra Supabase logs:**

   - Vào Supabase Dashboard → Authentication → Logs

2. **Kiểm tra browser console:**

   - Mở Developer Tools → Console

3. **Verify environment variables:**
   - Đảm bảo .env.local có đúng cấu hình

## 🚀 Production Deployment

### Cập nhật Redirect URLs cho production:

```bash
# Thêm domain thật vào Supabase
https://yourdomain.com
https://www.yourdomain.com
```

### Cập nhật OAuth applications:

**Google Cloud Console:**

- Thêm production domain vào Redirect URIs

**GitHub OAuth Apps:**

- Cập nhật Authorization callback URL với production domain

## 📚 Tài liệu tham khảo

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)

## 🆘 Hỗ trợ

Nếu vẫn gặp vấn đề:

1. **Kiểm tra lại từng bước** trong hướng dẫn
2. **So sánh với Supabase docs** chính thức
3. **Test với Supabase demo project** trước
4. **Liên hệ support** nếu cần thiết

---

**Chúc bạn thành công! 🎉**
