# Content Management System (CMS) Guide

## Overview

The Site Settings / Admin Settings page has been transformed into a **full-featured Content Management System (CMS)** that allows you to manage all frontend content through a single, intuitive interface.

## 🎯 Key Features

### ✅ What You Can Edit

The CMS allows you to edit **all** frontend content, including:

1. **Hero Section**
   - Main title and subtitle
   - Description text
   - Badge text
   - Hero image

2. **About Section**
   - Title and subtitle
   - Description, mission, and vision statements
   - About image (optional)

3. **Why Choose Us Section**
   - Section title, subtitle, and description
   - Three feature cards (each with title and description)

4. **Footer Content**
   - Footer tagline and description
   - Copyright text
   - Business hours
   - Contact information (phone, email, address, WhatsApp)
   - Social media links (Facebook, Instagram)

5. **Company Information**
   - Company name
   - Company logo URL
   - Year established

6. **Call-to-Action (CTA) Section**
   - CTA title and description
   - Button text

7. **Statistics Section**
   - Four customizable stats (each with value, label, and suffix)
   - Examples: "30+ Years Experience", "100% Quality Guarantee", etc.

8. **SEO & Metadata**
   - Meta title
   - Meta description

## 🚀 How to Use the CMS

### Accessing the CMS

1. Log in to the admin panel
2. Navigate to **Site Settings** from the admin menu
3. You'll see multiple tabs for different content sections

### Editing Content

1. **Select a Tab**: Choose the section you want to edit (Hero, About, Features, etc.)
2. **Edit Fields**: Update any text field, textarea, or URL
3. **Save Changes**: Click the "Save Changes" button at the bottom
4. **View Live**: Changes are immediately reflected on the frontend

### Managing Images

#### Option 1: Use Image URLs
- Enter direct URLs to images (e.g., `https://example.com/image.jpg`)
- Use local paths (e.g., `/logo.jpeg`)

#### Option 2: Upload to Gallery
1. Go to **Admin Gallery** page
2. Upload your images there
3. Copy the image URL from the gallery
4. Paste it into the Site Settings field

### Best Practices

1. **Test Changes**: After saving, visit the public website to verify changes
2. **Image Quality**: Use high-quality images for hero and logo
3. **SEO**: Keep meta titles under 60 characters and descriptions under 160 characters
4. **Consistency**: Maintain consistent tone and style across all sections
5. **Backup**: Use the "Reset to Defaults" button cautiously - it will restore all default values

## 📋 Content Sections Breakdown

### Hero Section
- **Purpose**: First impression, main message
- **Impact**: High - visitors see this first
- **Tips**: Keep title short and impactful, description should be 2-3 sentences

### About Section
- **Purpose**: Company introduction and values
- **Impact**: Medium - builds trust
- **Tips**: Be authentic, highlight what makes you unique

### Why Choose Us / Features
- **Purpose**: Showcase competitive advantages
- **Impact**: High - influences purchase decisions
- **Tips**: Focus on benefits, not just features

### Footer
- **Purpose**: Navigation, contact info, legal
- **Impact**: Medium - always visible
- **Tips**: Keep contact info up-to-date, test phone/email links

### CTA Section
- **Purpose**: Drive conversions (quotes, contacts)
- **Impact**: High - direct call to action
- **Tips**: Use action-oriented language, create urgency

### Stats Section
- **Purpose**: Build credibility with numbers
- **Impact**: Medium - adds social proof
- **Tips**: Use real, verifiable numbers

## 🔄 Content Flow

```
Admin Edits in Site Settings
        ↓
Saves to Database (MongoDB)
        ↓
Frontend Fetches Settings
        ↓
Displays Updated Content
```

## 📊 Database Schema

All settings are stored in a single MongoDB document with the following structure:

```javascript
{
  // Hero Section
  heroTitle: String,
  heroSubtitle: String,
  heroDescription: String,
  heroBadgeText: String,
  heroImage: String,
  
  // About Section
  aboutTitle: String,
  aboutSubtitle: String,
  aboutDescription: String,
  aboutMission: String,
  aboutVision: String,
  aboutImage: String,
  
  // Why Choose Us
  whyChooseTitle: String,
  whyChooseSubtitle: String,
  whyChooseDescription: String,
  
  // Features (3 features)
  feature1Title: String,
  feature1Description: String,
  feature2Title: String,
  feature2Description: String,
  feature3Title: String,
  feature3Description: String,
  
  // Contact Info
  contactPhone: String,
  contactEmail: String,
  contactAddress: String,
  whatsappNumber: String,
  businessHours: String,
  
  // Social Media
  facebookUrl: String,
  instagramUrl: String,
  
  // Footer
  footerTagline: String,
  footerDescription: String,
  footerCopyrightText: String,
  
  // Company Info
  companyName: String,
  companyLogo: String,
  companyEstablished: String,
  
  // CTA
  ctaTitle: String,
  ctaDescription: String,
  ctaButtonText: String,
  
  // Stats (4 stats)
  stat1Value: String,
  stat1Label: String,
  stat1Suffix: String,
  // ... (stat2, stat3, stat4)
  
  // SEO
  metaTitle: String,
  metaDescription: String
}
```

## 🛠️ Technical Implementation

### Frontend Components Using CMS

1. **Hero3D.tsx** - Hero section
2. **Home.tsx** - Features, stats, CTA sections
3. **Footer.tsx** - Footer content
4. **AdminSiteSettings.tsx** - CMS interface

### API Endpoints

- `GET /api/site-settings` - Fetch all settings (public)
- `PUT /api/site-settings` - Update settings (admin only)
- `POST /api/site-settings/reset` - Reset to defaults (admin only)

### Hook

```typescript
import { useSiteSettings } from '../hooks/useSiteSettings';

const { settings, isLoading, updateSettings, resetSettings } = useSiteSettings();
```

## 🔐 Security

- Only authenticated admin users can edit settings
- Public users can only read settings
- Input validation on backend
- XSS protection through React's built-in escaping

## 🐛 Troubleshooting

### Changes Not Showing Up?

1. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check Network Tab**: Ensure API call is successful
3. **Verify Authentication**: Make sure you're logged in as admin
4. **Check Console**: Look for JavaScript errors

### Images Not Loading?

1. **Verify URL**: Make sure the image URL is accessible
2. **Check File Path**: Ensure local paths are correct (e.g., `/logo.jpeg`)
3. **CORS Issues**: If using external URLs, ensure CORS is enabled
4. **File Format**: Use supported formats (JPG, PNG, WebP)

### Settings Not Saving?

1. **Check Network**: Ensure PUT request to `/api/site-settings` succeeds
2. **Verify Token**: Admin JWT token should be valid
3. **Check Required Fields**: Some fields may have validation rules
4. **Server Logs**: Check backend console for errors

## 📱 Gallery Management

The Gallery page allows you to:

1. **Upload Images**: Add images for products, gallery displays, etc.
2. **Categorize**: Organize images by category
3. **Delete**: Remove unwanted images
4. **Copy URLs**: Use image URLs in Site Settings

### Gallery Workflow

```
Upload Image via Gallery
        ↓
Image stored with URL
        ↓
Copy URL from Gallery
        ↓
Paste into Site Settings field
        ↓
Image displays on frontend
```

## 🎨 Customization Tips

### Hero Section
- Use a high-resolution image (minimum 1920x1080)
- Ensure text contrast is good
- Keep title under 50 characters for mobile

### Footer
- Test all links regularly
- Update business hours for holidays
- Keep social media links current

### Stats
- Use impressive but honest numbers
- Update regularly as business grows
- Include context (e.g., "Since 1990")

### CTA
- Create urgency ("Get Your Free Quote Today")
- Be specific ("Request Custom Timber Quote")
- Make it stand out visually

## 📈 Analytics & Monitoring

### What to Track

1. **CTA Click-Through Rate**: Monitor quote requests
2. **Phone Clicks**: Track calls from footer
3. **Social Media Clicks**: Measure social engagement
4. **Time on Site**: See if content keeps visitors engaged

### Recommended Tools

- Google Analytics
- Hotjar (heat maps)
- Google Search Console (SEO)

## 🔄 Regular Maintenance

### Weekly
- [ ] Review and respond to contact form submissions
- [ ] Check for broken links
- [ ] Monitor site performance

### Monthly
- [ ] Update stats if numbers change
- [ ] Refresh testimonials
- [ ] Update gallery with new project photos
- [ ] Review and update product information

### Quarterly
- [ ] Review all content for accuracy
- [ ] Update business hours for seasonal changes
- [ ] Refresh hero section for seasonal promotions
- [ ] Update meta descriptions for SEO

### Annually
- [ ] Update copyright year
- [ ] Review company information
- [ ] Major content overhaul if needed
- [ ] Professional photography update

## 🆘 Support

If you encounter issues:

1. **Check This Guide**: Most common questions are answered here
2. **Browser Console**: Look for error messages
3. **Server Logs**: Check backend logs for API errors
4. **Network Tab**: Verify API requests/responses

## 🎓 Training Resources

### For Admins
1. Learn basic HTML/Markdown for text formatting
2. Understand image optimization
3. Learn basic SEO principles
4. Familiarize with your target audience

### For Developers
1. Review `useSiteSettings.ts` hook implementation
2. Study `SiteSettings.js` model schema
3. Understand React Context for state management
4. Learn MongoDB for database management

## ✅ Success Checklist

- [ ] All text content is accurate and up-to-date
- [ ] All images load properly
- [ ] Contact information is current
- [ ] Social media links work
- [ ] Business hours are correct
- [ ] Meta tags are optimized for SEO
- [ ] Footer displays correctly
- [ ] CTA buttons work properly
- [ ] Stats are impressive and accurate
- [ ] Mobile responsiveness is verified

---

**Last Updated**: January 2026

**System Version**: 2.0 (Full CMS Implementation)
