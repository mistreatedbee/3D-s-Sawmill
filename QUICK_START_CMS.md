# CMS Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Initialize the Database (First Time Only)
```bash
cd server
npm run seed
```
This creates default content for your entire website.

### Step 2: Start the Backend
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

### Step 3: Start the Frontend
```bash
# In a new terminal
npm run dev
```
Website runs on `http://localhost:5173`

### Step 4: Log In as Admin
- Go to `http://localhost:5173`
- Click "Login"
- Email: `admin@3dsawmill.com`
- Password: `admin123`

### Step 5: Edit Your Content
1. Click on **"Site Settings"** in the admin menu
2. Choose any tab (Hero, About, Footer, etc.)
3. Edit the content
4. Click **"Save Changes"**
5. Visit the homepage - your changes are live! 🎉

---

## 📝 What You Can Edit

### Content Sections (Click the tabs)
1. **Hero Section** - Main banner with title, subtitle, description
2. **About Section** - Company info, mission, vision
3. **Why Choose Us** - Features and benefits (3 cards)
4. **Contact Info** - Phone, email, address, hours, social media
5. **Footer Content** - Tagline, description, copyright
6. **Company Info** - Name, logo, established year
7. **CTA Section** - Call-to-action title, description, button
8. **Stats Section** - 4 statistics boxes
9. **SEO & Metadata** - Page title and description for Google

---

## 🎨 Managing Images

### Method 1: Direct URLs
Enter image URLs directly in Site Settings:
```
/logo.jpeg
https://example.com/image.jpg
```

### Method 2: Upload via Gallery
1. Go to **Admin Gallery** page
2. Click "Add Image"
3. Enter image URL, title, category
4. Click "Add"
5. Copy the URL and paste into Site Settings

---

## ✅ Checklist: Customize Your Website

- [ ] Update company name
- [ ] Update contact phone number
- [ ] Update email address
- [ ] Update physical address
- [ ] Update business hours
- [ ] Add social media links (Facebook, Instagram)
- [ ] Update hero title and description
- [ ] Update about section text
- [ ] Update three "Why Choose Us" features
- [ ] Update four statistics
- [ ] Update CTA (call-to-action) text
- [ ] Update footer tagline and description
- [ ] Update copyright text
- [ ] Update SEO meta title and description
- [ ] Upload company logo via gallery
- [ ] Upload hero image via gallery

---

## 💡 Quick Tips

1. **Save Often**: Click "Save Changes" after each edit
2. **Test Changes**: Visit the homepage to see updates
3. **Mobile Check**: Test on mobile devices too
4. **Image URLs**: Use Gallery page to manage images
5. **Reset Option**: "Reset to Defaults" if you need to start over

---

## 🆘 Common Issues

**Q: Changes not showing?**
A: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Q: Can't save changes?**
A: Make sure you're logged in as admin

**Q: Images not loading?**
A: Check the image URL is correct and accessible

**Q: Forgot admin password?**
A: Re-run `npm run seed` to reset (resets all data)

---

## 📚 More Information

- **Full Guide**: See `CMS_GUIDE.md`
- **Implementation Details**: See `CMS_IMPLEMENTATION_SUMMARY.md`
- **Admin Features**: See `ADMIN_CONTENT_MANAGEMENT.md`

---

## 🎉 You're All Set!

Your website now has a powerful CMS. Start editing content and make it yours!

**Happy editing! 🚀**
