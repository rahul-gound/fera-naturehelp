# Email Configuration Guide for NatureHelp

This guide explains how to configure email settings in Supabase to resolve email verification issues.

## Problem

Users experience the following issue:
- Account is created successfully in Supabase
- Confirmation email is received from Supabase
- When trying to login, error message says "email not confirmed"
- No verification email with "NatureHelp" or "fera-naturehelp" branding is received

## Root Cause

Supabase requires email verification by default before users can login. The issue occurs because:
1. Email confirmation is enabled in Supabase settings
2. SMTP settings may not be configured properly
3. Email templates are using default Supabase branding

## Solution

Choose one of the following solutions based on your environment:

### Solution 1: Disable Email Confirmation (Recommended for Development)

This is the quickest solution for development and testing:

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Scroll down to **Email Auth** section
5. **Uncheck** the option "Enable email confirmations"
6. Click **Save**

**Result**: Users can login immediately after signup without needing to verify their email.

### Solution 2: Configure Email Delivery (Recommended for Production)

For production environments, keep email confirmation enabled and configure proper email delivery:

#### Step 1: Configure SMTP Settings

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Choose your email provider:
   - **SendGrid**: Enter API key
   - **AWS SES**: Enter AWS credentials
   - **Mailgun**: Enter domain and API key
   - **Custom SMTP**: Enter server details
3. Configure sender details:
   - **Sender email**: noreply@yourdomain.com
   - **Sender name**: NatureHelp
4. Click **Save**

#### Step 2: Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"** template
3. Update the template:

```html
Subject: Verify your email for NatureHelp - fera-naturehelp

Body:
<h2>Welcome to NatureHelp! 🌳</h2>
<p>Thank you for joining our community of nature lovers.</p>
<p>Please confirm your email address by clicking the button below:</p>
<a href="{{ .ConfirmationURL }}">Verify Email Address</a>
<p>If you didn't create an account with NatureHelp, you can safely ignore this email.</p>
<p>Happy planting!</p>
<p>- The NatureHelp Team</p>
```

4. Click **Save**

#### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Development: `http://localhost:8000` (or your local server)
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:8000/dashboard.html` (development)
   - `https://yourdomain.com/dashboard.html` (production)
   - Add any other URLs where users might land after email confirmation
4. Click **Save**

## Testing

### Test Signup Flow

1. Create a new account with a real email address
2. If email confirmation is **disabled**:
   - You should be able to login immediately
3. If email confirmation is **enabled**:
   - Check your email inbox (and spam folder)
   - You should receive an email with subject "Verify your email for NatureHelp - fera-naturehelp"
   - Click the verification link
   - You should be redirected to the dashboard
   - You can now login successfully

### Verify Email Delivery

1. Create a test account
2. Check if email is received within 1-2 minutes
3. Verify the email has:
   - Correct sender name: "NatureHelp"
   - Correct subject: Contains "NatureHelp" or "fera-naturehelp"
   - Working verification link
   - Proper branding

## Troubleshooting

### Email Not Received

**Check spam/junk folder**: Verification emails might be filtered
- Add sender email to contacts/whitelist
- Check email provider's spam settings

**SMTP not configured**: If using custom email provider
- Verify SMTP credentials are correct
- Test SMTP connection
- Check email provider's sending limits

**Rate limiting**: Supabase has sending limits
- Wait a few minutes before requesting another email
- Check Supabase logs for delivery errors

### "Email Not Confirmed" Error Persists

1. **Verify email confirmation is disabled** (if using Solution 1)
2. **Check user's email_confirmed_at field** in Supabase:
   - Go to Authentication → Users
   - Find the user
   - Check if "Email Confirmed At" has a value
   - If null, user hasn't confirmed email yet
3. **Resend confirmation email**:
   - In Supabase Dashboard → Authentication → Users
   - Find the user
   - Click "Resend confirmation email"

### Email Contains Wrong Branding

1. Update email templates as described in Solution 2
2. Ensure "Sender name" is set to "NatureHelp" in SMTP settings
3. Test by creating a new account

## Quick Reference

| Issue | Solution |
|-------|----------|
| Email not verified error | Disable email confirmation OR configure SMTP |
| No email received | Configure SMTP settings and check spam folder |
| Wrong email branding | Customize email templates |
| Verification link broken | Configure redirect URLs correctly |
| Email goes to spam | Use reputable SMTP provider and configure SPF/DKIM |

## Best Practices

### Development
- Disable email confirmation for faster testing
- Use temporary email services for testing
- Enable detailed logging in Supabase

### Production
- Always enable email confirmation for security
- Use a reputable email service provider
- Configure SPF, DKIM, and DMARC records
- Monitor email delivery rates
- Customize email templates with your branding
- Use your own domain for sender email

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

## Support

If you continue to experience issues:
1. Check Supabase Dashboard logs: **Logs** → **Auth**
2. Review browser console for errors
3. Verify all configuration steps were completed
4. Contact Supabase support if needed
