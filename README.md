# Dr. Filipa Carvalho - Academic Website

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Modern, responsive academic website with self-updating publications from ORCID.

## 🌐 Live Demo
Once deployed, your site will be at: `https://yourusername.github.io`

## ✨ Features

✅ Fully responsive (works on phones, tablets, desktops)
✅ Dark/light mode toggle
✅ Auto-updating publications from ORCID
✅ Clean, professional design
✅ Fast loading times
✅ SEO optimized
✅ Accessible

## 🚀 Quick Start - Deploy to GitHub Pages

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it: `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
   - For example, if your username is `fcarvalho`, name it `fcarvalho.github.io`
4. Make it **Public**
5. Click "Create repository"

### 2. Upload Your Website
1. Download all files from this folder
2. In your new repository, click "uploading an existing file"
3. Drag all files into the upload area
4. Scroll down and click "Commit changes"

### 3. Enable GitHub Pages
1. Go to your repository Settings → Pages (left sidebar)
2. Under "Source", select "Deploy from a branch"
3. Under "Branch", select `main` and `/root`
4. Click "Save"

### 4. Wait 2-3 minutes
Your website will be live at: `https://yourusername.github.io`

## 📝 Customizing Your Website

### Update Your ORCID ID
1. Open `js/publications.js`
2. Find line 2: `const ORCID_ID = '0000-0002-8355-4329';`
3. Replace with your ORCID ID (you can verify at https://orcid.org/0000-0002-8355-4329)

### Edit Your Content
All content is in easy-to-edit files:

- **About/Bio**: Edit `content/about.md`
- **Research Projects**: Edit files in `content/projects/`
- **News**: Add/edit files in `content/news/`
- **Team Members**: Edit `content/team.md`
- **Contact**: Edit `contact.html`

### Add News Items
Create a new file in `content/news/` like `2026-04-new-project.md`:

```markdown
---
title: "New Research Project Funded"
date: 2026-04-07
---

Excited to announce our new NERC-funded project investigating...
```

### Add Research Projects
Create a new file in `content/projects/` like `new-project.md`:

```markdown
---
title: "Project Name"
dates: "2026-2029"
funding: "NERC"
role: "Lead PI"
---

Project description here...
```

## 🎨 Customization Options

### Change Colors
Edit `css/style.css` - look for the `:root` section at the top:
```css
:root {
    --primary-color: #0066cc;  /* Change main blue color */
    --accent-color: #00509e;   /* Change accent blue */
}
```

### Update Profile Photo
Replace `images/profile.jpg` with your photo (recommended size: 400x400px)

### Update CV
Replace `files/CV_FCarvalho.pdf` with your latest CV

## 🔧 Advanced: Local Development

If you want to preview changes before uploading:

### Option 1: VS Code (Recommended)
1. Install [VS Code](https://code.visualstudio.com/)
2. Open this folder in VS Code: `File` → `Open Folder`
3. Install the "Live Server" extension:
   - Click Extensions icon (left sidebar)
   - Search "Live Server"
   - Click Install
4. Right-click `index.html` → `Open with Live Server`
5. Edit files in VS Code - changes appear instantly in browser!

### Option 2: Python Simple Server
```bash
cd filipa-carvalho-website
python -m http.server 8000
# Visit: http://localhost:8000
```

## 📂 Project Structure

```
filipa-carvalho-website/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles (responsive + dark mode)
├── js/
│   ├── main.js            # Navigation, dark mode, interactions
│   ├── publications.js    # ORCID integration
│   ├── content-loader.js  # Loads markdown content
│   └── marked.min.js      # Markdown parser
├── content/
│   ├── about.md           # Your biography
│   ├── projects/          # Project markdown files
│   └── news/              # News item files
├── images/
│   └── profile.svg        # Your photo (replace with .jpg)
├── files/
│   └── CV_FCarvalho.pdf   # Your CV (add your PDF)
├── QUICKSTART.md          # 5-minute setup guide
└── SETUP-GUIDE.md         # Complete documentation
```

## 📱 Features

✅ Fully responsive (works on phones, tablets, desktops)
✅ Dark/light mode toggle
✅ Auto-updating publications from ORCID
✅ Clean, professional design
✅ Fast loading times
✅ SEO optimized
✅ Accessible

## 🆘 Troubleshooting

**Website not showing?**
- Wait 5-10 minutes after enabling GitHub Pages
- Check Settings → Pages shows a green success message
- Try accessing in incognito/private browsing mode

**Publications not loading?**
- Verify your ORCID ID in `js/publications.js`
- Check browser console (F12) for errors
- ORCID API may take a moment to respond

**Need help?**
Open an issue on GitHub or contact your friendly web developer!

## 📄 License

MIT License - Feel free to use and modify!
