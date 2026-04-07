# Project System Guide

## 🎯 How the Project System Works

Your website now has a sophisticated project system that:
- ✅ **Auto-fetches publications from ORCID**
- ✅ **Tags publications to projects** via simple config file
- ✅ **Assigns team members to projects** via config file
- ✅ **Creates individual project pages** with team + publications
- ✅ **Easy to maintain** - edit JSON files, not HTML

---

## 📁 System Architecture

```
data/
├── projects.json              # Project metadata (titles, dates, descriptions)
├── project-publications.json  # Tags publications to projects
└── project-teams.json         # Assigns team to projects

projects/
├── rebels.html               # Individual project pages
├── polomints.html
├── partitrics.html
└── ...

js/
└── project-page.js           # Loads data and populates pages
```

---

## 📝 Adding Publications to a Project

### **Step 1: Publication appears in ORCID automatically**

The system fetches from your ORCID profile automatically.

### **Step 2: Tag it to a project**

Edit `data/project-publications.json`:

```json
{
  "publications": [
    {
      "title": "Your paper title",
      "doi": "10.1234/example",
      "projects": ["rebels", "partitrics"]
    }
  ]
}
```

**That's it!** Publication now shows on ReBELS and PARTITRICS project pages.

---

## 👥 Assigning Team to Projects

Edit `data/project-teams.json`:

```json
{
  "project_teams": {
    "rebels": {
      "pi": ["Filipa Carvalho"],
      "staff": ["Tommy Ryan-Keogh", "Flavien Petit"],
      "students": ["Hans Hilder", "Daniel Bangay"],
      "alumni": []
    }
  }
}
```

**Team members auto-populate on project pages with photos!**

---

## 🆕 Creating a New Project Page

### **Method 1: Copy existing page (Easiest)**

1. Copy `projects/rebels.html` → `projects/newproject.html`
2. Edit these parts:

```html
<!-- Change PROJECT_ID -->
<script>
    const PROJECT_ID = 'newproject';  // ← Change this
</script>

<!-- Update title and description -->
<h1 class="page-title">New Project Name</h1>
<p class="page-subtitle">Full project title</p>

<!-- Update meta bar -->
<div class="project-meta-bar">
    <div class="meta-item"><strong>Duration:</strong> 2024-2027</div>
    <div class="meta-item"><strong>Funding:</strong> £XXX</div>
    ...
</div>

<!-- Update description -->
<div class="project-description">
    <h2>Project Overview</h2>
    <p>Your project description here...</p>
</div>
```

3. Add to `data/projects.json`:

```json
{
  "id": "newproject",
  "title": "PROJECT",
  "fullTitle": "Full Project Name",
  "status": "current",
  "dates": "2024-2027",
  "funding": "Funder, £XXX",
  "role": "PI",
  "description": "Brief description",
  "website": "https://...",
  "themes": ["biophysical"]
}
```

4. Add team in `data/project-teams.json`
5. Tag publications in `data/project-publications.json`

**Done!**

---

## 🔧 Editing Project Information

### **To update project description:**
Edit the project's HTML file directly (e.g., `projects/rebels.html`)

### **To update team:**
Edit `data/project-teams.json`

### **To add publications:**
Edit `data/project-publications.json`

### **To update metadata (dates, funding):**
Edit both:
- The HTML file's meta-bar
- `data/projects.json` for consistency

---

## 📊 Current Projects Setup

I've created data files for these projects:

**Current:**
- ReBELS (2023-2028) - Page created ✅
- POLOMINTS (2024-2029)
- PARTITRICS (2023-2026)
- IDAPro (2023-2026)
- GLIDERS I (2025-2026)
- GLIDERS II (2026-2027)
- APART (2025-2026)

**Past:**
- TechOceans (2021-2024)
- BIARRITZ (2018-2020)
- GOCART (2017-2018)
- COMICS (2017-2018)
- CUSTARD (2018)
- PAL-LTER (2011-2015)
- FIRe-Glider (2015-2018)

**You need to:**
1. Create individual HTML pages for each (copy rebels.html template)
2. Write project descriptions
3. Assign team members
4. Tag publications

---

## 🎨 Customizing Project Pages

### **Add Photos:**

```html
<div class="project-photos">
    <h2>Fieldwork Photos</h2>
    <div class="photo-grid-small">
        <img src="../images/fieldwork/rebels/photo1.jpg" alt="Description">
        <img src="../images/fieldwork/rebels/photo2.jpg" alt="Description">
    </div>
</div>
```

### **Add More Sections:**

```html
<div class="project-objectives">
    <h2>Research Objectives</h2>
    <ul>
        <li>Objective 1</li>
        <li>Objective 2</li>
    </ul>
</div>
```

---

## 🔍 How Publications Get Matched

The system matches publications in two ways:

1. **By DOI** (exact match):
   ```json
   {"doi": "10.1002/lom3.10380", "projects": ["fire-glider"]}
   ```

2. **By Title** (substring match):
   ```json
   {"title": "FIRe glider", "projects": ["fire-glider"]}
   ```

**Best practice:** Use DOI when available (more reliable)

---

## 📋 To-Do Checklist

- [ ] Create HTML pages for remaining projects (copy rebels.html)
- [ ] Write descriptions for each project
- [ ] Assign team members in project-teams.json
- [ ] Tag all publications in project-publications.json
- [ ] Add project photos to images/projects/
- [ ] Update main projects.html page to list all projects

---

## 💡 Tips

- **Keep JSON valid** - Use JSONLint.com to check syntax
- **Name files consistently** - Use lowercase with hyphens
- **Test locally** - Use Live Server in VS Code before pushing
- **Commit often** - Small commits are easier to debug

---

## 🆘 Troubleshooting

**Publications not showing?**
- Check DOI/title matches exactly
- Check project ID is correct
- Open browser console (F12) for errors

**Team not showing?**
- Check names match exactly in project-teams.json
- Check photo filenames match (lowercase, hyphens)

**Page not loading?**
- Check PROJECT_ID is defined
- Check data files are valid JSON
- Check file paths are correct (../ for files in projects/ folder)

---

**The foundation is built! Now you can create project pages and tag content easily.** 🚀
