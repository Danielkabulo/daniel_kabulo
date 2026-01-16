# Authentication System - Post-Deployment Testing Guide

## Overview
This guide provides step-by-step instructions for testing the new JWT-based authentication system after deployment.

## Prerequisites

Before testing, ensure the following environment variables are configured on your deployment platform (Netlify, Vercel, etc.):

```bash
# Required for Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required for JWT authentication
JWT_SECRET=a-secure-random-string-minimum-32-characters-long
```

**IMPORTANT**: Generate a strong JWT_SECRET using:
```bash
openssl rand -base64 32
```

## Step 1: Initialize Database

Execute the SQL script in your Supabase SQL editor:

1. Go to your Supabase project → SQL Editor
2. Open and run: `db/users_table.sql`
3. Verify the `users` table was created successfully

## Step 2: Create Initial Admin Account

Make a POST request to initialize the admin account:

```bash
curl -X POST https://your-app.netlify.app/api/auth/init-admin
```

Expected response:
```json
{
  "success": true,
  "message": "Admin created",
  "admin": {
    "id": "...",
    "email": "johnym@kamoacopper",
    "name": "Johnny M (Admin)",
    "role": "admin"
  }
}
```

If admin already exists:
```json
{
  "message": "Admin already exists"
}
```

## Step 3: Test Login Page

1. Navigate to: `https://your-app.netlify.app/login`
2. Verify the full-screen login page displays with:
   - Mining-themed design (copper/amber colors)
   - Email input field
   - Password input field with show/hide toggle
   - "Se connecter" button
   - Animated background blobs
   - Grid pattern overlay

## Step 4: Test Admin Login

1. Enter credentials:
   - Email: `johnym@kamoacopper`
   - Password: `Johnnyka@4569801`
2. Click "Se connecter"
3. Verify:
   - Loading spinner appears during authentication
   - Upon success, redirected to `/admin/users`
   - Admin users page displays with header and user list

## Step 5: Test Admin User Management

On the `/admin/users` page, verify:

1. **Header displays**:
   - Kamoa Supervision logo
   - "Gestion des utilisateurs" title
   - Logout button
   - Current user info

2. **User table shows**:
   - Column headers: Email, Nom complet, Rôle, Statut, Date de création
   - Initial admin user row
   - Proper formatting of role badges and status

3. **Create User button** is visible

## Step 6: Test User Creation

1. Click "Créer un utilisateur" button
2. Modal appears with form fields:
   - Email
   - Nom complet
   - Mot de passe
   - Confirmer mot de passe
   - Rôle (dropdown: User/Admin)

3. Test validation:
   - Try mismatched passwords → error message
   - Try password < 8 characters → error message
   - Try invalid email format → error message
   - Try duplicate email → error message

4. Create a valid user:
   - Email: `testuser@kamoacopper`
   - Name: `Test User`
   - Password: `TestPass123`
   - Confirm Password: `TestPass123`
   - Role: `user`
   - Click "Créer"

5. Verify:
   - Success message appears
   - Modal closes automatically
   - New user appears in the table
   - Table refreshes with new user data

## Step 7: Test Logout and Re-login

1. Click "Déconnexion" button
2. Verify:
   - Redirected to `/login`
   - Token removed from localStorage (check DevTools)
   - Cannot access `/admin/users` without login

3. Log in again with the newly created user:
   - Email: `testuser@kamoacopper`
   - Password: `TestPass123`
   - Verify redirected to `/` (home page) instead of `/admin/users`

## Step 8: Test Admin-Only Access

1. While logged in as regular user, try to access:
   - `/admin/users` directly via URL
   - Verify: Access denied or redirect to home page

2. Try API endpoints as regular user:
   ```bash
   # Get token from DevTools localStorage
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-app.netlify.app/api/admin/list-users
   ```
   - Verify: 403 Forbidden response

## Step 9: Test Token Expiration

JWT tokens expire after 24 hours. To test expiration handling:

1. Log in successfully
2. Wait 24 hours OR manually expire the token:
   - Open DevTools → Application → Local Storage
   - Find `auth_token`
   - Modify the expiration in the token payload
3. Refresh the page
4. Verify: Token is removed and redirected to login

## Step 10: Test Security

Verify the following security measures:

1. **Password Hashing**:
   - Check Supabase `users` table
   - Verify `password_hash` column contains bcrypt hashes (starts with `$2b$`)
   - Original passwords are NOT stored

2. **JWT Token**:
   - Decode token from localStorage (use jwt.io)
   - Verify payload contains: userId, email, name, role
   - Verify expiration (exp) is set to 24 hours from creation

3. **API Protection**:
   - Try accessing admin APIs without token → 401 Unauthorized
   - Try accessing admin APIs with expired token → 401 Unauthorized
   - Try accessing admin APIs with invalid token → 401 Unauthorized

## Common Issues and Troubleshooting

### Issue: "Configuration serveur manquante"
- **Cause**: JWT_SECRET not configured
- **Solution**: Add JWT_SECRET to environment variables

### Issue: "Admin already exists" when trying to create admin
- **Cause**: Admin was already initialized
- **Solution**: This is expected behavior. Use existing admin credentials.

### Issue: Build fails with "Missing NEXT_PUBLIC_SUPABASE_*"
- **Cause**: Supabase environment variables not configured
- **Solution**: Add all required Supabase environment variables

### Issue: Login works but redirects to wrong page
- **Cause**: Role-based redirect logic issue
- **Solution**: Check that JWT payload includes correct role

### Issue: Can't create users - "Erreur serveur"
- **Cause**: Database connection issue or missing service role key
- **Solution**: Verify SUPABASE_SERVICE_ROLE_KEY is correctly configured

## Success Criteria

✅ All tests pass successfully:
- [x] Database table created
- [x] Admin account initialized
- [x] Login page displays correctly with full-screen design
- [x] Admin can log in and access `/admin/users`
- [x] Admin can create new users
- [x] Regular users can log in but cannot access admin pages
- [x] Logout works correctly
- [x] Passwords are securely hashed
- [x] JWT tokens expire after 24 hours
- [x] API endpoints are protected with JWT verification

## Next Steps

After successful testing:

1. **Change Admin Password** (Future enhancement):
   - Implement password change endpoint
   - Have admin change default password

2. **User Management Enhancements** (Optional):
   - Add edit user functionality
   - Add delete user functionality
   - Add user search/filter
   - Add pagination for large user lists

3. **Monitoring**:
   - Monitor failed login attempts
   - Set up alerts for security events
   - Review user creation logs

## Support

For issues or questions:
- Check application logs in deployment platform
- Review Supabase logs for database errors
- Verify all environment variables are correctly set
