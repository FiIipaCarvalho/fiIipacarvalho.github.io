# Multi-Page Website Structure

## 🌐 Your Website Now Has Separate Pages!

Instead of a single scrolling page, your website now has dedicated pages for each section:

### Pages Created:
- **index.html** - Home page with your profile
- **research.html** - Research themes
- **publications.html** - Self-updating publications from ORCID
- **projects.html** - Current and past projects
- **people.html** - Team members, students, and alumni
- **news.html** - News and updates
- **contact.html** - Contact information and form

## 👥 People Page - How It Works

The People page (`people.html`) displays three sections:

### 1. Staff (4 people)
Grid layout with profile photos, names, roles, and NOC profile links

### 2. PhD Students (4 people)
Grid layout showing current students with start years and affiliations

### 3. Alumni (3 people)  
Detailed cards with photos, thesis titles, current positions, and LinkedIn links

## 📸 Adding Team Member Photos

### Quick Guide:

1. **Prepare photos**: 300x300px square images
2. **Name them correctly**:
   - `tommy-ryan-keogh.jpg`
   - `flavien-petit.jpg`
   - `hans-hilder.jpg`
   - etc. (see `images/team/README.md` for full list)
3. **Upload to**: `images/team/` folder
4. **Done!** Photos appear automatically

**No photo?** A placeholder silhouette shows instead (won't break the site)

### Detailed Instructions:
See `images/team/README.md` for:
- Photo specifications
- How to crop and resize
- Upload methods
- Troubleshooting

## 🔧 Editing Team Information

### To Add a New Team Member:

1. Open `people.html`
2. Find the appropriate section (Staff, Students, or Alumni)
3. Copy an existing person-card div
4. Update the information:
   ```html
   <div class="person-card">
       <div class="person-photo">
           <img src="images/team/firstname-lastname.jpg" alt="FirstName LastName"
                onerror="this.src='images/team/placeholder.svg'">
       </div>
       <div class="person-info">
           <h3>FirstName LastName</h3>
           <p class="person-role">Their Role</p>
           <div class="person-links">
               <a href="https://..." target="_blank">Profile Link</a>
           </div>
       </div>
   </div>
   ```

### To Add an Alumni Member:

```html
<div class="alumni-card">
    <div class="alumni-photo">
        <img src="images/team/firstname-lastname.jpg" alt="FirstName LastName"
             onerror="this.src='images/team/placeholder.svg'">
    </div>
    <div class="alumni-info">
        <h3>FirstName LastName</h3>
        <p class="alumni-degree">PhD, 2025</p>
        <p class="alumni-thesis">"Thesis Title Here"</p>
        <p class="alumni-institution">University Name</p>
        <p class="alumni-current">Currently: Position at Institution</p>
        <div class="person-links">
            <a href="https://linkedin.com/..." target="_blank">LinkedIn</a>
        </div>
    </div>
</div>
```

## 📝 Current Pages Status

### ✅ Fully Built:
- **people.html** - Complete with your team data
- **index.html** - Updated with multi-page navigation

### 🚧 Need Content (Templates Ready):
- **research.html** - Will show your 3 research themes
- **publications.html** - ORCID publications (already working)
- **projects.html** - Current and past projects
- **news.html** - News items
- **contact.html** - Contact form and info

## 🎨 Design Features

### People Page Highlights:
- **Responsive grid** - Adapts to screen size
- **Professional cards** - Clean, modern design
- **Hover effects** - Cards lift on hover
- **Automatic fallback** - Placeholder if photo missing
- **Mobile optimized** - Stacks nicely on phones

### Navigation:
- **Active page highlighting** - Shows current page
- **Mobile menu** - Hamburger menu on small screens
- **Consistent across pages** - Same nav everywhere

## 🔄 How Multi-Page Affects Publishing

### Same as Before:
1. Upload all files to GitHub
2. Enable GitHub Pages
3. Site goes live

### New Benefit:
- Each page has its own URL
- Can share direct links (e.g., `yoursite.com/people.html`)
- Better for SEO
- Faster page loads (smaller individual pages)

## 📂 File Structure Now:

```
website/
├── index.html (home)
├── research.html
├── publications.html
├── projects.html
├── people.html ← NEW!
├── news.html
├── contact.html
├── css/
│   └── style.css (updated with people styles)
├── js/
│   ├── main.js
│   ├── publications.js
│   └── content-loader.js
├── images/
│   ├── profile.svg
│   └── team/ ← NEW!
│       ├── placeholder.svg
│       ├── README.md
│       └── (add photos here)
└── content/
    └── about.md
```

## 🚀 Next Steps

1. **Download the new ZIP** (includes all pages)
2. **Upload to GitHub** (replaces old files)
3. **Add team photos** to `images/team/`
4. **Test the site** - click through all pages
5. **Share!**

## 💡 Tips

- **Start with placeholders**: Site works fine without photos
- **Add photos gradually**: Upload as you get them
- **Test locally first**: Use VS Code Live Server
- **Mobile check**: Test on your phone

## 🆘 Common Questions

**Q: Do I need to upload everything again?**
A: Yes, the structure changed. Easier to re-upload all files.

**Q: Will my publications still auto-update?**
A: Yes! The publications.html page still connects to ORCID.

**Q: Can I remove a page I don't want?**
A: Yes, just delete the HTML file and remove from navigation.

**Q: Photos not showing?**
A: Check filename matches exactly (case-sensitive, with hyphens).

---

**Your professional academic website is now multi-page and includes a beautiful team showcase! 🎉**
