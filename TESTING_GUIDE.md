# Manual Testing Guide for Email Verification Fix

This guide provides step-by-step instructions to manually test the email verification fix.

## Prerequisites

1. Access to Supabase Dashboard for your project
2. A test email address you can access
3. Local web server running (e.g., `python -m http.server 8000`)

## Test Scenarios

### Scenario 1: Email Confirmation Disabled (Development Mode)

**Setup:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Uncheck "Enable email confirmations"
3. Save the settings

**Test Steps:**
1. Open the application in a browser
2. Click "Login" or navigate to `/login.html`
3. Switch to "Sign Up" tab
4. Enter test credentials:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123456`
5. Click "Create Account"

**Expected Results:**
- ✅ Success message: "Account created successfully! You can now login."
- ✅ Automatically switches to Login tab after 3 seconds
- ✅ Email is pre-filled in login form
- ✅ You can login immediately without email verification
- ✅ Redirected to dashboard after successful login

### Scenario 2: Email Confirmation Enabled (Production Mode)

**Setup:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Check "Enable email confirmations"
3. Configure SMTP settings (or use Supabase's default)
4. Save the settings

**Test Steps - Signup:**
1. Open the application in a browser
2. Navigate to `/login.html`
3. Switch to "Sign Up" tab
4. Enter test credentials with a real email you can access
5. Click "Create Account"

**Expected Results - Signup:**
- ✅ Success message: "Account created! Please check your email to verify your account before logging in."
- ✅ Automatically switches to Login tab after 3 seconds
- ✅ Email is pre-filled in login form

**Test Steps - Email Verification:**
1. Check your email inbox (and spam folder)
2. Look for verification email from Supabase
3. Click the verification link in the email

**Expected Results - Email:**
- ✅ Email is received within 1-2 minutes
- ✅ Email subject contains "Confirm your signup" (default) or custom text
- ✅ Verification link works and redirects to application

**Test Steps - Login Before Verification:**
1. Try to login without clicking the verification link
2. Enter your email and password
3. Click "Login"

**Expected Results - Login Before Verification:**
- ✅ Error message: "Please verify your email before logging in. Check your inbox for a confirmation email from NatureHelp."
- ✅ Login is blocked
- ✅ Error message is clear and helpful

**Test Steps - Login After Verification:**
1. Click the verification link in your email
2. Return to the login page
3. Enter your email and password
4. Click "Login"

**Expected Results - Login After Verification:**
- ✅ Success message: "Login successful! Redirecting..."
- ✅ Redirected to dashboard after 1 second
- ✅ Dashboard shows user information
- ✅ Navigation shows user's name and logout option

### Scenario 3: Error Handling

**Test Invalid Credentials:**
1. Navigate to `/login.html`
2. Enter invalid email and password
3. Click "Login"

**Expected Results:**
- ✅ Error message: "Login failed. Please check your credentials." or similar
- ✅ No redirect occurs
- ✅ Form fields remain editable

**Test Duplicate Signup:**
1. Try to signup with an email that already exists
2. Click "Create Account"

**Expected Results:**
- ✅ Error message from Supabase (e.g., "User already registered")
- ✅ No redirect occurs
- ✅ Form fields remain editable

### Scenario 4: Navigation and Auth State

**Test Authenticated Navigation:**
1. Login successfully
2. Check the navigation menu

**Expected Results:**
- ✅ Navigation shows user's name or email
- ✅ Navigation shows "Logout" button
- ✅ No "Login" link visible

**Test Unauthenticated Navigation:**
1. Logout or open site in incognito mode
2. Check the navigation menu

**Expected Results:**
- ✅ Navigation shows "Login" link
- ✅ No user name or "Logout" visible

**Test Protected Pages:**
1. Logout
2. Try to access `/dashboard.html` directly

**Expected Results:**
- ✅ Redirected to `/login.html`
- ✅ Cannot access dashboard without authentication

## Browser Console Checks

Open browser developer tools (F12) and check for:

**During Signup:**
- ✅ No JavaScript errors in console
- ✅ Log message: "Supabase client initialized"
- ✅ No network errors

**During Login:**
- ✅ No JavaScript errors in console
- ✅ Successful API calls to Supabase
- ✅ No CORS errors

## Checklist

- [ ] Tested signup with email confirmation disabled
- [ ] Tested signup with email confirmation enabled
- [ ] Verified email is received with correct branding
- [ ] Tested login before email verification (error shown)
- [ ] Tested login after email verification (success)
- [ ] Tested error messages are clear and helpful
- [ ] Verified navigation updates based on auth state
- [ ] Verified protected pages redirect to login
- [ ] Checked browser console for errors
- [ ] Tested in multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile devices (responsive design)

## Common Issues and Solutions

### Issue: No email received
- Check spam/junk folder
- Verify SMTP settings in Supabase
- Check Supabase logs for delivery errors

### Issue: Verification link doesn't work
- Verify redirect URLs are configured correctly
- Check Site URL in Supabase settings
- Ensure link hasn't expired

### Issue: "Supabase not initialized" error
- Check that Supabase CDN script loads before auth.js
- Verify Supabase URL and API key are correct
- Check browser console for script loading errors

### Issue: Still shows "email not confirmed" after verification
- Clear browser cache and cookies
- Check user's email_confirmed_at field in Supabase Dashboard
- Try resending confirmation email from Supabase Dashboard

## Performance Checks

- [ ] Signup completes in < 3 seconds
- [ ] Login completes in < 2 seconds
- [ ] Email received in < 2 minutes
- [ ] Page loads are fast (< 1 second)
- [ ] No memory leaks (check browser dev tools)

## Documentation Verification

- [ ] README.md has clear authentication setup instructions
- [ ] EMAIL_CONFIGURATION.md guide is comprehensive
- [ ] SUPABASE_SETUP.md has all necessary setup steps
- [ ] All documentation links work correctly
- [ ] Instructions are clear and easy to follow

## Sign-off

After completing all tests:
- **Tester Name**: _______________
- **Date**: _______________
- **Test Environment**: _______________
- **Test Result**: PASS / FAIL
- **Notes**: _______________
