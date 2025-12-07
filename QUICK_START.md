# Quick Start Guide - Fera NatureHelp

This guide will help you get Fera NatureHelp up and running quickly with email verification and password reset functionality.

## Prerequisites

- A Supabase account ([Sign up here](https://supabase.com))
- A Mailroo account ([Sign up here](https://mailroo.com))
- A text editor or IDE
- A web browser

## 5-Minute Setup

### 1. Clone and Open Project (1 min)

```bash
git clone https://github.com/rahul-gound/fera-naturehelp.git
cd fera-naturehelp
```

Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

### 2. Configure Supabase (2 min)

1. Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Project Settings** → **API**
3. Copy your:
   - Project URL
   - Anon/Public key

4. Update `js/supabase.js`:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

5. Run the database setup:
   - Go to **SQL Editor** in Supabase
   - Copy SQL from `SUPABASE_SETUP.md`
   - Execute the scripts

### 3. Configure Mailroo SMTP (2 min)

1. Get your Mailroo SMTP credentials:
   - Host: `smtp.mailroo.com`
   - Port: `587`
   - Username: (from Mailroo dashboard)
   - Password: (from Mailroo dashboard)

2. Configure in Supabase:
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Enable Custom SMTP
   - Enter Mailroo credentials
   - Sender: `noreply@yourdomain.com`
   - Name: `Fera NatureHelp`

3. Customize email templates:
   - Go to **Authentication** → **Email Templates**
   - Update "Confirm signup" template (copy from `EMAIL_CONFIGURATION.md`)
   - Update "Reset Password" template (copy from `EMAIL_CONFIGURATION.md`)

### 4. Test Everything (1 min)

1. **Test Signup:**
   - Go to `/login.html`
   - Click "Sign Up"
   - Create a test account
   - Check email for verification link

2. **Test Password Reset:**
   - Go to `/login.html`
   - Click "Forgot Password?"
   - Enter your email
   - Check email for reset link

## Development Mode (Skip Email Verification)

For faster development, you can disable email verification:

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Under **Email Auth**, uncheck "Enable email confirmations"
3. Users can now login immediately after signup

**Note:** Re-enable for production!

## Common Issues

### Issue: "Supabase not initialized"
**Solution:** Check that `js/supabase.js` has correct credentials

### Issue: No verification email received
**Solution:** 
- Check spam folder
- Verify SMTP settings in Supabase
- Check Mailroo account is active

### Issue: "Email not confirmed" error
**Solution:** 
- Either disable email confirmation (dev only)
- Or ensure user clicked verification link

## Next Steps

- 📖 Read [MAILROO_SETUP.md](MAILROO_SETUP.md) for complete Mailroo configuration
- 📖 Read [EMAIL_CONFIGURATION.md](EMAIL_CONFIGURATION.md) for email template customization
- 📖 Read [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for database schema details
- 🧪 Read [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing instructions

## Feature Overview

✅ Email verification for new users  
✅ Password reset via email  
✅ Secure authentication with Supabase  
✅ Branded emails with Fera NatureHelp identity  
✅ Plant tracking and leaderboard  
✅ CO2 absorption calculation  
✅ Donation management  
✅ Personal dashboard  

## Support

If you encounter issues:
1. Check documentation files in the repository
2. Review Supabase logs: **Logs** → **Auth**
3. Review browser console for JavaScript errors
4. Check Mailroo dashboard for email delivery status

## Production Deployment

Before deploying to production:
- [ ] Configure custom domain in Mailroo
- [ ] Add SPF, DKIM, DMARC DNS records
- [ ] Update redirect URLs with production domain
- [ ] Enable email confirmation in Supabase
- [ ] Test all authentication flows
- [ ] Update SUPABASE_URL in code
- [ ] Secure environment variables

Happy planting! 🌳🌱
