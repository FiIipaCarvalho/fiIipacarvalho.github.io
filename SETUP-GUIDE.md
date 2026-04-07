# Complete Setup Guide for Your Academic Website

## 📋 Table of Contents
1. [Quick Deployment to GitHub Pages](#quick-deployment)
2. [Customizing Your Content](#customizing-content)
3. [Adding Your Profile Photo](#profile-photo)
4. [Updating Publications](#publications)
5. [Managing Projects](#projects)
6. [Adding News Items](#news)
7. [Advanced Customization](#advanced)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Deployment to GitHub Pages {#quick-deployment}

### Step 1: Create Your GitHub Repository

1. **Sign in to GitHub** at https://github.com
2. Click the **"+"** icon in the top right → **"New repository"**
3. **Repository name**: `yourusername.github.io`
   - Replace `yourusername` with your actual GitHub username
   - Example: If your username is `fcarvalho`, name it `fcarvalho.github.io`
4. **Visibility**: Make it **Public**
5. **Initialize**: Leave checkboxes unchecked (no README, no .gitignore)
6. Click **"Create repository"**

### Step 2: Upload Your Website Files

**Option A: Via Web Interface (Easiest)**
1. In your new repository, click **"uploading an existing file"**
2. Drag ALL files and folders from this website folder
3. Wait for the upload to complete
4. Scroll down and click **"Commit changes"**

**Option B: Via Git Command Line**
```bash
cd filipa-carvalho-website
git init
git add .
git commit -m "Initial commit - Academic website"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository **Settings** (top menu)
2. Click **"Pages"** in the left sidebar
3. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **"Save"**
5. Wait 2-3 minutes for deployment

### Step 4: Access Your Website

Your website will be live at: `https://yourusername.github.io`

You can also use a custom domain (e.g., filipacarvalho.com) by:
1. Purchasing a domain
2. Adding it in Settings → Pages → Custom domain
3. Configuring DNS records with your domain provider

---

## ✏️ Customizing Your Content {#customizing-content}

### Update Your ORCID ID

1. Open `js/publications.js`
2. Find line 2:
```javascript
const ORCID_ID = '0000-0002-8355-4329';
```
3. Replace with your ORCID ID
4. Save and commit

Your publications will now automatically update from your ORCID profile!

### Edit Your Biography

1. Open `content/about.md`
2. Edit the markdown content
3. Use markdown formatting:
   - `**bold text**`
   - `*italic text*`
   - `### Heading`
   - `[link text](URL)`
4. Save and commit

### Update Contact Information

1. Open `index.html`
2. Search for "filcar [at] noc.ac.uk"
3. Replace with your email
4. Update address, phone, and other contact details
5. Save and commit

---

## 📸 Adding Your Profile Photo {#profile-photo}

### Required Specifications
- **Size**: 400x400 pixels (square)
- **Format**: JPG or PNG
- **File name**: `profile.jpg` or `profile.png`
- **Location**: `images/` folder

### Upload Steps
1. Prepare your photo (crop to square, resize to 400x400)
2. Name it `profile.jpg`
3. Upload to the `images/` folder in your repository
4. If using PNG, update `index.html`:
   - Find: `<img src="images/profile.jpg"`
   - Change to: `<img src="images/profile.png"`

---

## 📚 Updating Publications {#publications}

### Automatic Updates from ORCID
Your publications automatically update from ORCID! Just:
1. Keep your ORCID profile updated
2. Website refreshes data on each visit

### Manual Publications (Optional)

If you want to add publications not in ORCID:

1. Open `js/publications.js`
2. Find the `loadFallbackPublications()` function
3. Add your publication:
```javascript
{
    title: "Your Paper Title",
    authors: "Carvalho, F., et al.",
    year: 2026,
    journal: "Journal Name",
    doi: "10.xxxx/xxxxx",
    url: "https://..."
}
```

---

## 🔬 Managing Projects {#projects}

### Add a New Current Project

1. Open `js/content-loader.js`
2. Find the `currentProjects` array
3. Add your project:
```javascript
{
    title: "PROJECT-NAME",
    fullName: "Full Project Title",
    dates: "2026-2029",
    funding: "NERC",
    role: "Lead PI",
    description: "Brief description of the project...",
    url: "https://project-website.com",
    status: "current"
}
```

### Move Project to Past

1. Cut the project from `currentProjects`
2. Paste into `pastProjects` array
3. Change `status: "current"` to `status: "past"`

---

## 📰 Adding News Items {#news}

### Quick Method

1. Open `js/content-loader.js`
2. Find the `newsItems` array (around line 200)
3. Add new item at the top:
```javascript
{
    date: "2026-04",
    title: "Your News Title",
    content: "Brief description of the news..."
}
```

### Advanced Method (Markdown Files)

Create a new file in `content/news/`:
```markdown
---
title: "New Grant Awarded"
date: 2026-04-07
---

Excited to announce our new research grant from...
```

---

## 🎨 Advanced Customization {#advanced}

### Change Color Scheme

Edit `css/style.css`, lines 7-16:
```css
:root {
    --primary-color: #0066cc;  /* Main blue - change to your color */
    --accent-color: #00509e;   /* Darker blue for hover effects */
}
```

Color picker: https://htmlcolorcodes.com/

### Change Fonts

Edit `index.html`, line 16:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap" rel="stylesheet">
```

Then update `css/style.css`, lines 20-21:
```css
--font-sans: 'Your-Font', sans-serif;
```

Browse fonts: https://fonts.google.com/

### Add Google Analytics

Add before `</head>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Get your ID from: https://analytics.google.com/

---

## 🐛 Troubleshooting {#troubleshooting}

### Website Not Showing?

**Check:**
1. Repository name is exactly `yourusername.github.io`
2. GitHub Pages is enabled (Settings → Pages)
3. Wait 5-10 minutes after enabling Pages
4. Try incognito/private browsing mode
5. Check Actions tab for deployment status

### Publications Not Loading?

**Solutions:**
1. Verify ORCID ID in `js/publications.js`
2. Make sure ORCID profile is public
3. Check browser console (F12) for errors
4. ORCID API may be temporarily down - wait and retry

### Dark Mode Not Working?

**Fix:**
1. Clear browser cache (Ctrl/Cmd + Shift + R)
2. Check if browser supports localStorage
3. Try different browser

### Mobile Menu Not Opening?

**Fix:**
1. Check if JavaScript is enabled
2. Clear cache and reload
3. Try different mobile browser

### Images Not Displaying?

**Check:**
1. File names are correct (case-sensitive)
2. Files are in correct folders
3. Image paths in HTML are correct
4. Images are under 5MB each

---

## 🔄 Updating Your Website

After making any changes:

### Via Web Interface
1. Navigate to the file in GitHub
2. Click the pencil icon (Edit)
3. Make your changes
4. Scroll down, click "Commit changes"
5. Website updates automatically in 1-2 minutes

### Via Git
```bash
git add .
git commit -m "Update: description of changes"
git push
```

---

## 📱 Testing Locally (Optional)

Want to preview before publishing?

### Method 1: VS Code + Live Server
1. Install [VS Code](https://code.visualstudio.com/)
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

### Method 2: Python Simple Server
```bash
cd filipa-carvalho-website
python -m http.server 8000
```
Visit: http://localhost:8000

---

## 🆘 Getting Help

**Website Issues:**
- Check GitHub Pages Status: https://www.githubstatus.com/
- GitHub Pages Docs: https://docs.github.com/en/pages

**Questions:**
- Open an issue in your repository
- Search existing solutions online
- Contact: web development communities

---

## 📋 Checklist for Launch

- [ ] Repository created and files uploaded
- [ ] GitHub Pages enabled
- [ ] ORCID ID updated
- [ ] Biography customized
- [ ] Profile photo added
- [ ] Contact information updated
- [ ] Test on desktop and mobile
- [ ] Share your new website!

---

**Your website URL:** `https://yourusername.github.io`

**Enjoy your new professional academic website! 🎉**
