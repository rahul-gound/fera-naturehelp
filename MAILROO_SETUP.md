# Mailroo SMTP Setup Guide for Fera NatureHelp

This guide provides step-by-step instructions for configuring Mailroo SMTP with Supabase to enable email verification and password reset functionality for Fera NatureHelp.

## Overview

Mailroo is a reliable SMTP email service provider that integrates seamlessly with Supabase for sending transactional emails including:
- Email verification for new user signups
- Password reset emails
- Other authentication-related notifications

## Prerequisites

Before starting, ensure you have:
- A Supabase account and project set up
- Access to your Supabase project dashboard
- A domain (optional but recommended for production)

## Step 1: Sign Up for Mailroo

1. Visit [Mailroo](https://mailroo.com/) or your Mailroo provider's website
2. Click "Sign Up" or "Get Started"
3. Create your account with:
   - Email address
   - Password
   - Company/project name (use "Fera NatureHelp")
4. Verify your email address by clicking the link sent to your inbox
5. Complete your profile setup

## Step 2: Get Mailroo SMTP Credentials

### Option A: Using Mailroo Dashboard

1. Log in to your Mailroo account
2. Navigate to **Settings** or **SMTP Configuration**
3. Look for **SMTP Credentials** or **API Keys** section
4. Note down the following information:
   - **SMTP Host**: Usually `smtp.mailroo.com` (check your provider's documentation)
   - **SMTP Port**: `587` (TLS) or `465` (SSL) - TLS port 587 is recommended
   - **Username**: Your Mailroo email or provided username
   - **Password**: Your SMTP password or API key

### Option B: Generate New SMTP Credentials

If credentials aren't visible:
1. Look for an option to "Generate API Key" or "Create SMTP Password"
2. Click to generate new credentials
3. **Important**: Copy and save these credentials immediately as they may not be shown again
4. Store them securely (consider using a password manager)

## Step 3: Configure Domain (Optional but Recommended)

Using a custom domain improves email deliverability and branding.

### Add Domain in Mailroo

1. In Mailroo dashboard, go to **Domains** or **Domain Management**
2. Click **Add Domain** or **Verify Domain**
3. Enter your domain name (e.g., `naturehelp.com`)
4. Mailroo will provide DNS records to add

### Configure DNS Records

Add the following DNS records to your domain provider (e.g., GoDaddy, Namecheap, Cloudflare):

#### SPF Record
```
Type: TXT
Name: @ (or your domain)
Value: v=spf1 include:_spf.mailroo.com ~all
TTL: 3600 (or default)
```

#### DKIM Record
```
Type: TXT
Name: mailroo._domainkey (or as provided by Mailroo)
Value: (copy from Mailroo dashboard)
TTL: 3600 (or default)
```

#### DMARC Record (Optional but recommended)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
TTL: 3600 (or default)
```

**Note**: DNS propagation can take up to 48 hours, but usually completes within a few hours.

### Verify Domain in Mailroo

1. After adding DNS records, return to Mailroo dashboard
2. Click **Verify Domain** or **Check DNS Records**
3. Wait for verification to complete
4. Once verified, you can use emails from this domain

## Step 4: Configure SMTP in Supabase

### Access Supabase Auth Settings

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **Fera NatureHelp** project
3. Navigate to **Project Settings** (gear icon in sidebar)
4. Click **Auth** in the left menu
5. Scroll to **SMTP Settings** section

### Enter Mailroo SMTP Details

Click **Enable Custom SMTP** and enter:

| Field | Value |
|-------|-------|
| **Host** | `smtp.mailroo.com` (or as provided) |
| **Port** | `587` (recommended for TLS) |
| **User** | Your Mailroo username/email |
| **Password** | Your Mailroo SMTP password |
| **Sender Email** | `noreply@yourdomain.com` (use verified domain) |
| **Sender Name** | `Fera NatureHelp` |

**Important**: 
- Use port `587` with TLS/STARTTLS encryption (recommended)
- Or use port `465` with SSL encryption
- Never use port `25` (typically blocked and insecure)

### Test SMTP Connection

1. After saving SMTP settings, look for a **Test SMTP** or **Send Test Email** button
2. Enter a test email address
3. Click **Send Test**
4. Check your inbox for the test email
5. If successful, proceed to next step
6. If failed, double-check all credentials and try again

## Step 5: Customize Email Templates

### Access Email Templates

1. In Supabase Dashboard, navigate to **Authentication** → **Email Templates**
2. You'll see several template types:
   - Confirm signup
   - Invite user
   - Magic link
   - Change email address
   - Reset password

### Configure Email Confirmation Template

1. Select **"Confirm signup"** template
2. Replace the default content with:

**Subject:**
```
Verify your email for Fera NatureHelp
```

**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #228B22; margin: 0;">
        <span style="font-size: 40px;">🌳</span><br>
        Welcome to Fera NatureHelp!
      </h1>
    </div>
    
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Thank you for joining our community of nature lovers and environmental champions!
    </p>
    
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Please confirm your email address by clicking the button below to activate your account:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; padding: 15px 40px; background-color: #228B22; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold; 
                font-size: 16px;">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 12px; color: #666; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
      {{ .ConfirmationURL }}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      If you didn't create an account with Fera NatureHelp, you can safely ignore this email.
    </p>
    
    <p style="font-size: 14px; color: #228B22; font-weight: bold;">
      Happy planting! 🌱
    </p>
    
    <p style="font-size: 14px; color: #666;">
      - The Fera NatureHelp Team
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p>This is an automated email from Fera NatureHelp. Please do not reply to this email.</p>
  </div>
</div>
```

3. Click **Save**

### Configure Password Reset Template

1. Select **"Reset Password"** template
2. Replace the default content with:

**Subject:**
```
Reset your password - Fera NatureHelp
```

**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #228B22; margin: 0;">
        <span style="font-size: 40px;">🔒</span><br>
        Password Reset Request
      </h1>
    </div>
    
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      We received a request to reset your password for your Fera NatureHelp account.
    </p>
    
    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Click the button below to reset your password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; padding: 15px 40px; background-color: #228B22; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold; 
                font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 12px; color: #666; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
      </p>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #666; line-height: 1.6;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
    
    <p style="font-size: 14px; color: #228B22; font-weight: bold;">
      Stay green! 🌿
    </p>
    
    <p style="font-size: 14px; color: #666;">
      - The Fera NatureHelp Team
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p>This is an automated email from Fera NatureHelp. Please do not reply to this email.</p>
  </div>
</div>
```

3. Click **Save**

## Step 6: Configure Redirect URLs

### Set Site URL

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - **Development**: `http://localhost:8000` (or your local dev server)
   - **Production**: `https://yourdomain.com` (your actual domain)

### Add Redirect URLs

Add these URLs to the **Redirect URLs** list:

**For Development:**
```
http://localhost:8000/dashboard.html
http://localhost:8000/login.html?reset=true
http://localhost:5500/dashboard.html
http://localhost:5500/login.html?reset=true
```

**For Production:**
```
https://yourdomain.com/dashboard.html
https://yourdomain.com/login.html?reset=true
```

3. Click **Save**

## Step 7: Enable Email Confirmation

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Find **Email Auth** section
3. Check **"Enable email confirmations"**
4. Set **"Confirm email"** to **Enabled**
5. Click **Save**

## Testing Your Setup

### Test Email Verification

1. Open your Fera NatureHelp application
2. Go to the signup page
3. Create a new account with a real email address
4. Check your email inbox (and spam folder)
5. Verify you receive an email from "Fera NatureHelp"
6. Click the verification link
7. Confirm you're redirected to the dashboard
8. Try logging in - it should work

### Test Password Reset

1. Go to the login page
2. Click **"Forgot Password?"**
3. Enter your registered email
4. Click **"Send Reset Link"**
5. Check your email inbox
6. Verify you receive a password reset email from "Fera NatureHelp"
7. Click the reset link
8. Enter your new password
9. Confirm you're redirected to login
10. Login with your new password

## Troubleshooting

### Email Not Received

**Check Spam Folder:**
- Emails may be filtered as spam initially
- Mark as "Not Spam" and add sender to contacts

**Verify SMTP Connection:**
1. Go to Supabase → Project Settings → Auth → SMTP Settings
2. Look for connection status
3. Try sending a test email
4. Check Supabase logs for errors

**Check Mailroo Status:**
1. Log in to Mailroo dashboard
2. Check for any service alerts
3. Review sent emails log
4. Look for bounced or failed emails

### SMTP Authentication Errors

**Invalid Credentials:**
- Double-check username and password
- Ensure there are no extra spaces
- Try regenerating SMTP password in Mailroo

**Port Issues:**
- Try port 587 (TLS) if 465 fails
- Try port 465 (SSL) if 587 fails
- Ensure your hosting doesn't block SMTP ports

### Domain Verification Issues

**DNS Not Propagated:**
- Wait 24-48 hours for DNS changes to propagate
- Use online DNS checkers to verify records
- Check with your domain provider

**Incorrect DNS Records:**
- Verify TXT record values match exactly
- Ensure no typos in domain names
- Check that TTL is appropriate

### Email Goes to Spam

**Improve Deliverability:**
1. Verify SPF, DKIM, and DMARC records are correct
2. Use a verified custom domain
3. Avoid spam trigger words in subject lines
4. Start with small sending volumes
5. Monitor bounce rates in Mailroo

## Best Practices

### Security

- Never share SMTP credentials
- Use environment variables for credentials in code
- Rotate SMTP passwords periodically
- Monitor failed login attempts in Mailroo

### Email Deliverability

- Use a custom verified domain
- Keep SPF, DKIM, DMARC updated
- Monitor email analytics in Mailroo
- Maintain low bounce and complaint rates
- Warm up new domains gradually

### User Experience

- Use clear, branded email templates
- Include both button and text links
- Set appropriate expiration times
- Provide help links in emails
- Test emails across different clients

### Monitoring

- Check Mailroo dashboard regularly
- Review Supabase auth logs
- Monitor user feedback
- Track email delivery rates
- Set up alerts for failures

## Production Checklist

Before going live, ensure:

- [ ] Mailroo account is active and verified
- [ ] Custom domain is verified in Mailroo
- [ ] SPF, DKIM, DMARC records are configured
- [ ] SMTP credentials are correctly set in Supabase
- [ ] All email templates are customized with Fera NatureHelp branding
- [ ] Redirect URLs include production domain
- [ ] Email confirmation is enabled in Supabase
- [ ] Test email verification flow works
- [ ] Test password reset flow works
- [ ] Emails don't go to spam
- [ ] Mobile email display looks good
- [ ] All links in emails work correctly

## Support Resources

- **Mailroo Documentation**: Check your provider's docs
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Supabase SMTP Guide**: https://supabase.com/docs/guides/auth/auth-smtp
- **Email Template Guide**: https://supabase.com/docs/guides/auth/auth-email-templates

## Conclusion

You have successfully configured Mailroo SMTP with Supabase for Fera NatureHelp! Users can now:
- Receive branded email verification emails
- Reset their passwords via email
- Experience professional email communications

For ongoing management, regularly monitor your Mailroo dashboard and Supabase logs to ensure smooth operation.
