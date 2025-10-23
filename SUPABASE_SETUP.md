# Supabase Setup Instructions

## 🚀 Quick Setup Guide for Supabase Authentication

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Create a new project with:
   - Project name: `codeconvert-pro`
   - Database password: (choose a strong password)
   - Region: (select nearest to your users)

### Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Update Your Configuration Files

Replace the placeholder values in these files:

#### auth.js
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // Replace with your Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Anon Key
```

#### signup.js
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // Replace with your Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Anon Key
```

### Step 4: Configure Authentication Providers

#### Email/Password Authentication (Already Enabled)
✅ Email/Password authentication is enabled by default.

#### Google OAuth (Optional)
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Google**
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

#### GitHub OAuth (Optional)
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **GitHub**
3. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - New OAuth App
   - Authorization callback URL: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### Step 5: Configure Email Settings

1. Go to **Authentication** → **Email Templates**
2. Customize email templates for:
   - Confirmation email
   - Password reset
   - Email change

3. Configure SMTP (Optional, for custom email domain):
   - Go to **Settings** → **Auth**
   - Enable custom SMTP
   - Add your SMTP credentials

### Step 6: Set Up Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your Site URL: `http://localhost:3000` (or your production URL)
3. Add Redirect URLs:
   - `http://localhost:3000/index.html`
   - `http://localhost:3000/login.html`
   - Add production URLs when deploying

### Step 7: Create User Profile Table (Optional)

Create a table to store additional user information:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 8: Test Your Setup

1. Open `signup.html` in your browser
2. Try creating a new account
3. Check your email for verification (if enabled)
4. Try logging in with `login.html`

### Step 9: Security Best Practices

1. **Never commit your Supabase keys to Git**
   - Add `auth.js` and `signup.js` to `.gitignore` if they contain real keys
   - Use environment variables in production

2. **Enable Email Confirmation**
   - Go to **Authentication** → **Providers** → **Email**
   - Enable "Confirm email"

3. **Set Password Requirements**
   - Go to **Authentication** → **Policies**
   - Set minimum password length (recommended: 8+ characters)

4. **Enable Rate Limiting**
   - Already configured in Supabase by default

5. **Use HTTPS in Production**
   - Always use HTTPS for your production site

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check that you copied the correct Anon Public Key
- Make sure there are no extra spaces in the key

### "Invalid Project URL" Error
- Verify the URL format: `https://xxxxx.supabase.co`
- Don't include trailing slashes

### Email Not Sending
- Check spam folder
- Verify email templates are enabled
- Consider setting up custom SMTP

### OAuth Not Working
- Verify redirect URLs are correctly configured
- Check OAuth provider credentials
- Ensure providers are enabled in Supabase dashboard

## 📝 Environment Variables (Production)

For production, use environment variables instead of hardcoded values:

```javascript
// Use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';
```

---

Made with ❤️ for CodeConvert Pro
