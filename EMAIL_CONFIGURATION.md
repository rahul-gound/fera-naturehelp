# Email Configuration Guide for Fera NatureHelp

This guide explains how to configure email settings in Supabase using Mailroo SMTP for email verification and password reset.

## Overview

This guide covers:
- Setting up Mailroo SMTP in Supabase
- Configuring email verification
- Setting up password reset functionality
- Customizing email templates with "Fera NatureHelp" branding

## Problem

Users experience the following issue:
- Account is created successfully in Supabase
- Confirmation email is received from Supabase
- When trying to login, error message says "email not confirmed"
- No verification email with "Fera NatureHelp" branding is received
- Password reset functionality is not configured

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

### Solution 2: Configure Mailroo SMTP (Recommended for Production)

For production environments, keep email confirmation enabled and configure Mailroo SMTP for email delivery:

#### Step 1: Set Up Mailroo SMTP

1. **Sign up for Mailroo**:
   - Visit [Mailroo](https://mailroo.com/) and create an account
   - Complete email verification and account setup
   - Navigate to your Mailroo dashboard

2. **Get SMTP Credentials**:
   - In Mailroo dashboard, go to **SMTP Settings** or **API Keys**
   - Generate or copy your SMTP credentials:
     - SMTP Server: `smtp.mailroo.com` (or as provided by Mailroo)
     - SMTP Port: `587` (TLS) or `465` (SSL)
     - Username: Your Mailroo email or API username
     - Password: Your SMTP password or API key

#### Step 2: Configure SMTP in Supabase

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** → **Auth** → **SMTP Settings**
4. Enable **Custom SMTP**
5. Enter Mailroo SMTP details:
   - **SMTP Host**: `smtp.mailroo.com`
   - **SMTP Port**: `587` (recommended for TLS)
   - **Username**: Your Mailroo username/email
   - **Password**: Your Mailroo SMTP password
   - **Sender email**: `noreply@yourdomain.com` (or your verified domain email)
   - **Sender name**: `Fera NatureHelp`
6. Click **Save**

**Important**: If using a custom domain with Mailroo, ensure you've:
- Verified your domain in Mailroo settings
- Added required DNS records (SPF, DKIM, DMARC)
- Used the verified domain email as sender

#### Step 2: Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"** template
3. Update the template with one of the following options:

**Option A: Basic Template (Minimal)**

```html
Subject: Confirm your signup - Fera NatureHelp

Body:
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

**Option B: Custom Branded Template (Recommended)**

```html
Subject: Verify your email for Fera NatureHelp

Body:
<h2>Welcome to Fera NatureHelp! 🌳</h2>
<p>Thank you for joining our community of nature lovers.</p>
<p>Please confirm your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #228B22; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a></p>
<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all;">{{ .ConfirmationURL }}</p>
<p>If you didn't create an account with Fera NatureHelp, you can safely ignore this email.</p>
<p>Happy planting!</p>
<p>- The Fera NatureHelp Team</p>
```

4. Click **Save**

#### Step 3: Configure Password Reset Email Template

1. Go to **Authentication** → **Email Templates**
2. Select **"Reset Password"** template
3. Update the template with the following:

**Password Reset Template (Recommended)**

```html
Subject: Reset your password - Fera NatureHelp

Body:
<h2>Password Reset Request 🔒</h2>
<p>We received a request to reset your password for your Fera NatureHelp account.</p>
<p>Click the button below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #228B22; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a></p>
<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all;">{{ .ConfirmationURL }}</p>
<p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
<p>Stay green!</p>
<p>- The Fera NatureHelp Team</p>
```

4. Click **Save**

#### Step 4: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Development: `http://localhost:8000` (or your local server)
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:8000/dashboard.html` (development - after email confirmation)
   - `http://localhost:8000/login.html?reset=true` (development - after password reset)
   - `https://yourdomain.com/dashboard.html` (production - after email confirmation)
   - `https://yourdomain.com/login.html?reset=true` (production - after password reset)
   - Add any other URLs where users might land after email actions
4. Click **Save**

## Testing

### Test Signup Flow

1. Create a new account with a real email address
2. If email confirmation is **disabled**:
   - You should be able to login immediately
3. If email confirmation is **enabled**:
   - Check your email inbox (and spam folder)
   - You should receive an email with subject "Verify your email for Fera NatureHelp"
   - Click the verification link
   - You should be redirected to the dashboard
   - You can now login successfully

### Test Password Reset Flow

1. Go to the login page and click "Forgot Password?"
2. Enter your registered email address
3. Check your email inbox (and spam folder)
4. You should receive an email with subject "Reset your password - Fera NatureHelp"
5. Click the reset password link
6. Enter your new password
7. You should be redirected to the login page
8. Login with your new password

### Verify Email Delivery

1. Create a test account
2. Check if email is received within 1-2 minutes
3. Verify the email has:
   - Correct sender name: "Fera NatureHelp"
   - Correct subject: Contains "Fera NatureHelp"
   - Working verification link
   - Proper branding
   - Sent via Mailroo SMTP

## Troubleshooting

### Email Not Received

**Check spam/junk folder**: Verification emails might be filtered
- Add sender email to contacts/whitelist
- Check email provider's spam settings

**SMTP not configured**: If using Mailroo SMTP
- Verify SMTP credentials are correct in Supabase
- Test SMTP connection in Supabase dashboard
- Check Mailroo account is active and verified
- Verify domain is configured if using custom domain
- Check email provider's sending limits
- Review Mailroo dashboard for bounced/failed emails

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
2. Ensure "Sender name" is set to "Fera NatureHelp" in SMTP settings
3. Verify all email templates use "Fera NatureHelp" in subject and body
4. Test by creating a new account or resetting password

### Mailroo SMTP Connection Issues

1. **Authentication Failed**:
   - Double-check username and password in Supabase SMTP settings
   - Ensure you're using the correct SMTP credentials from Mailroo
   - Regenerate SMTP password in Mailroo if needed

2. **Connection Timeout**:
   - Try different ports (587 for TLS, 465 for SSL)
   - Check if your server/hosting blocks SMTP ports
   - Verify Mailroo service status

3. **Domain Verification Required**:
   - If using custom domain, verify it in Mailroo dashboard
   - Add SPF, DKIM, and DMARC DNS records as shown in Mailroo
   - Wait for DNS propagation (up to 48 hours)

## Quick Reference

| Issue | Solution |
|-------|----------|
| Email not verified error | Disable email confirmation OR configure Mailroo SMTP |
| No email received | Configure Mailroo SMTP settings and check spam folder |
| Wrong email branding | Customize email templates with "Fera NatureHelp" |
| Verification link broken | Configure redirect URLs correctly in Supabase |
| Email goes to spam | Use Mailroo SMTP and configure SPF/DKIM records |
| Password reset not working | Add password reset template and redirect URL |
| SMTP authentication fails | Verify Mailroo credentials in Supabase settings |

## Best Practices

### Development
- Disable email confirmation for faster testing
- Use temporary email services for testing
- Enable detailed logging in Supabase

### Production
- Always enable email confirmation for security
- Use Mailroo SMTP for reliable email delivery
- Configure SPF, DKIM, and DMARC records for your domain
- Monitor email delivery rates in Mailroo dashboard
- Customize email templates with "Fera NatureHelp" branding
- Use your own verified domain for sender email
- Implement password reset functionality
- Test all email flows before going live

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
