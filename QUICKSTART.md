# 🚀 QUICK START - Get Your Website Live in 5 Minutes!

## What You're Getting

✅ Modern, responsive academic website
✅ Auto-updating publications from ORCID
✅ Dark/light mode toggle
✅ Mobile-friendly design
✅ Professional layout inspired by eleanorfrajka.com
✅ Easy content management
✅ Free hosting on GitHub Pages

---

## Step 1️⃣: Create GitHub Account (if needed)

Go to https://github.com and sign up for free

---

## Step 2️⃣: Create Your Repository

1. Click **+** (top right) → **New repository**
2. Name it: `YOUR-USERNAME.github.io`
   - Example: `fcarvalho.github.io`
   - ⚠️ Replace YOUR-USERNAME with your actual GitHub username!
3. Make it **Public**
4. Click **Create repository**

---

## Step 3️⃣: Upload Your Website

### Easy Method (Drag & Drop):

1. Click **"uploading an existing file"** link in your repository
2. Open this folder on your computer
3. Select ALL files and folders (Ctrl+A / Cmd+A)
4. Drag them into the browser window
5. Wait for upload to finish
6. Click **"Commit changes"**

### Command Line Method:
```bash
cd filipa-carvalho-website
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
git push -u origin main
```

---

## Step 4️⃣: Enable GitHub Pages

1. Go to **Settings** (top menu in your repository)
2. Click **Pages** (left sidebar)
3. Under "Source":
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

---

## Step 5️⃣: Wait & Visit! ⏱️

⏰ Wait 2-3 minutes for GitHub to build your site

🌐 Visit: `https://YOUR-USERNAME.github.io`

🎉 Your website is LIVE!

---

## 📝 First Things to Customize

### 1. Update Your ORCID ID (Publications will auto-load!)

Edit `js/publications.js` → Line 2:
```javascript
const ORCID_ID = '0000-0002-8355-4329'; // Change to YOUR ORCID
```

### 2. Add Your Photo

- Create a 400x400px square photo
- Name it `profile.jpg`
- Upload to `images/` folder
- Replace the placeholder

### 3. Edit Your Biography

Edit `content/about.md` with your information

### 4. Update Contact Info

Edit `index.html` → Search for "filcar@noc.ac.uk" and replace with your email

---

## 🎨 Optional Customizations

### Change Colors
Edit `css/style.css` → Lines 7-8:
```css
--primary-color: #0066cc;  /* Your color here */
```

### Add Google Analytics
Get your tracking ID from https://analytics.google.com
Add to `index.html` before `</head>`

---

## 🆘 Troubleshooting

**Website not showing?**
- Wait 5-10 minutes
- Check Settings → Pages shows green "success"
- Try incognito/private mode

**Publications not loading?**
- Verify your ORCID ID is correct
- Make sure ORCID profile is public
- Check browser console (F12) for errors

---

## 📚 Full Documentation

See **SETUP-GUIDE.md** for complete instructions on:
- Managing projects
- Adding news items
- Advanced customization
- Using a custom domain
- And much more!

---

## 🔄 Making Updates

After editing any file:

1. Go to the file in GitHub
2. Click the ✏️ pencil icon
3. Make changes
4. Click "Commit changes"
5. Wait 1-2 minutes → Changes are live!

---

## ✨ Your Website Features

- **Responsive**: Perfect on phone, tablet, desktop
- **Fast**: Optimized for quick loading
- **Accessible**: Screen reader friendly
- **SEO Ready**: Search engine optimized
- **Dark Mode**: Automatic theme switching
- **Self-Updating**: Publications load from ORCID

---

**Need Help?**
- Read SETUP-GUIDE.md for detailed instructions
- Check GitHub Pages documentation
- Search your error message online

**Congratulations! You now have a professional academic website! 🎓**
