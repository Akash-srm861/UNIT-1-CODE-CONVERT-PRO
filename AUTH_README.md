# 🔐 Login System with Supabase Integration

## ✨ Features

✅ **Email/Password Authentication**
- Secure user registration and login
- Password strength indicator
- Email verification support
- Password reset functionality

✅ **Social Authentication**
- Google OAuth login
- GitHub OAuth login

✅ **User Experience**
- Beautiful, modern UI design
- Real-time form validation
- Loading states and error handling
- Remember me functionality
- Password visibility toggle

✅ **Security**
- JWT-based authentication
- Secure password hashing
- Session management
- Rate limiting (via Supabase)

## 🚀 Quick Start

### 1. Set Up Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Get your credentials from **Settings** → **API**:
   - Project URL
   - Anon Public Key

### 2. Configure Your App

Edit `supabase-config.js` and replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here',
};
```

### 3. Run Your App

Simply open the HTML files in your browser:

- `login.html` - Login page
- `signup.html` - Registration page
- `index.html` - Main app (redirects after login)

Or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/login.html`

## 📁 Project Structure

```
├── login.html              # Login page
├── signup.html             # Registration page
├── auth.js                 # Login authentication logic
├── signup.js               # Registration authentication logic
├── supabase-config.js      # Supabase configuration (EDIT THIS!)
├── SUPABASE_SETUP.md       # Detailed setup instructions
└── index.html              # Main application
```

## 🎯 Usage

### User Registration

1. Navigate to `signup.html`
2. Fill in:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Confirm Password
3. Accept terms and conditions
4. Click "Create Account"
5. Verify email (if enabled in Supabase)

### User Login

1. Navigate to `login.html`
2. Enter email and password
3. Optionally check "Remember me"
4. Click "Sign In"

### Social Login

1. Click "Google" or "GitHub" button
2. Complete OAuth flow
3. Auto-redirect to app after authentication

### Password Reset

1. On login page, click "Forgot Password?"
2. Enter your email
3. Check inbox for reset link
4. Follow link to reset password

## 🔧 Customization

### Change Redirect URLs

Edit the redirect URLs in `auth.js` and `signup.js`:

```javascript
redirectTo: window.location.origin + '/dashboard.html'
```

### Customize Email Templates

1. Go to Supabase Dashboard
2. **Authentication** → **Email Templates**
3. Customize confirmation and reset emails

### Add More OAuth Providers

Supabase supports:
- Google ✅ (configured)
- GitHub ✅ (configured)
- Facebook
- Twitter
- Discord
- And more...

## 🔐 Security Features

- **Password Requirements**: Minimum 6 characters (customizable)
- **Password Strength Indicator**: Visual feedback
- **Email Verification**: Optional email confirmation
- **Rate Limiting**: Built-in via Supabase
- **HTTPS Required**: For production deployments
- **JWT Tokens**: Automatic token refresh
- **Session Management**: Persistent or session-based storage

## 📱 Responsive Design

The login and signup pages are fully responsive and work on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check `supabase-config.js` has correct credentials
- Ensure no extra spaces in the keys

### Emails Not Sending
- Check spam folder
- Enable SMTP in Supabase settings
- Verify email templates are active

### OAuth Not Working
- Configure OAuth providers in Supabase dashboard
- Add correct redirect URLs
- Check provider credentials

### CORS Errors
- Add your domain to allowed URLs in Supabase
- Use a local server (not file:// protocol)

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript/auth-signup)

## 🎨 UI Features

- Gradient backgrounds
- Smooth animations
- Loading spinners
- Toast notifications
- Password strength meter
- Form validation feedback
- Hover effects
- Focus states

## 📝 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure `supabase-config.js`
3. ✅ Test user registration
4. ✅ Test user login
5. Configure OAuth providers (optional)
6. Customize email templates
7. Add user profile page
8. Implement protected routes
9. Add user dashboard
10. Deploy to production

## 🌐 Deployment

For production deployment:

1. Update redirect URLs in Supabase dashboard
2. Add production domain to allowed URLs
3. Enable email confirmation
4. Set up custom SMTP (recommended)
5. Use HTTPS only
6. Consider using environment variables

## 💡 Pro Tips

- Enable two-factor authentication in Supabase
- Use strong password policies
- Implement rate limiting on your backend
- Log authentication events
- Monitor failed login attempts
- Regular security audits

---

Made with ❤️ for CodeConvert Pro Learning Platform
