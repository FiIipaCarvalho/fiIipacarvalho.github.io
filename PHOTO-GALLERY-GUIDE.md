# 📸 Photo Gallery - Complete Guide

## 🎉 What You Have

A professional photo gallery with:
- ✅ **15 Fieldwork albums** (all your expeditions)
- ✅ **6 Nature portfolios** (wildlife, landscapes, underwater)
- ✅ **Tab switching** (Fieldwork / Nature)
- ✅ **Masonry grid layout** (Pinterest-style)
- ✅ **Lightbox viewer** (fullscreen with prev/next)
- ✅ **Optional captions** (show if present, hide if not)
- ✅ **Date & location display**
- ✅ **Mobile responsive**
- ✅ **Lazy loading** (fast performance)

## 📁 How to Add Photos

### Simple Method (No Captions)

1. **Create album folder**:
   ```
   images/fieldwork/rebels1-jc268-2024/
   ```

2. **Add photos**:
   ```
   images/fieldwork/rebels1-jc268-2024/
   ├── cover.jpg  (thumbnail for album card)
   ├── photo1.jpg
   ├── photo2.jpg
   ├── photo3.jpg
   └── photos.txt (list of filenames)
   ```

3. **Create `photos.txt`**:
   ```
   photo1.jpg
   photo2.jpg
   photo3.jpg
   ```

**Done!** Photos appear in gallery automatically.

---

### Advanced Method (With Captions)

Create `info.json` in the album folder:

```json
{
  "title": "ReBELS 1",
  "description": "Labrador Sea expedition, November 2024",
  "cover": "cover.jpg",
  "photos": [
    {
      "file": "glider-deployment.jpg",
      "caption": "Deploying Seaglider in rough seas",
      "location": "Labrador Sea",
      "date": "2024-11-15"
    },
    {
      "file": "ice-station.jpg",
      "caption": "CTD station near ice edge",
      "location": "57°N, 52°W",
      "date": "2024-11-16"
    },
    {
      "file": "sunset.jpg"
      // No caption? Works fine - just shows photo
    }
  ]
}
```

**All fields optional except `file`!**

---

## 📂 Album Folder Structure

```
images/
├── fieldwork/
│   ├── glider-deployments/
│   │   ├── cover.jpg
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── photos.txt OR info.json
│   ├── seafarers-2011/
│   ├── na-vice-2012/
│   ├── pal-lter-palmer-2012-2013/
│   ├── pal-lter-wap-2014/
│   ├── pal-lter-wap-2015/
│   ├── mesohux-2017/
│   ├── comics1-dy086-2017/
│   ├── gocart2-2018/
│   ├── comics2-dy090-2018/
│   ├── custard1-dy096-2018/
│   ├── pap-dy130-2022/
│   ├── biocarbon-dy180-2024/
│   ├── rebels1-jc268-2024/
│   └── rebels2-jc268-2025/
│
└── nature/
    ├── antarctica-wildlife/
    ├── antarctic-landscapes/
    ├── underwater-wildlife/
    ├── whales-dolphins/
    ├── birds/
    └── landscapes/
```

---

## 🎨 Photo Specifications

### Recommended Sizes:
- **Cover image**: 600x400px (landscape)
- **Gallery photos**: 1200-2000px on longest side
- **File size**: Under 2MB each (optimize before uploading)

### Accepted Formats:
- JPG (best for photos)
- PNG (if needed for transparency)
- WebP (modern browsers)

---

## 📝 Two Ways to Organize

### Option 1: Simple List (photos.txt)
**Best for:** Quick uploads, no captions needed

```
cover.jpg
img001.jpg
img002.jpg
img003.jpg
```

### Option 2: Rich Metadata (info.json)
**Best for:** Detailed albums with stories

```json
{
  "title": "Album Title",
  "description": "Album description",
  "cover": "cover.jpg",
  "photos": [
    {
      "file": "photo1.jpg",
      "caption": "Photo description",
      "location": "Location name",
      "date": "2024-11-15"
    }
  ]
}
```

---

## 🔄 Workflow for Adding a New Album

### Step 1: Prepare Photos Locally
1. Select and edit photos
2. Resize if needed (1200-2000px)
3. Rename for organization (optional)
4. Choose one for cover image

### Step 2: Create Folder Structure
```bash
my-album/
├── cover.jpg
├── 01-glider-prep.jpg
├── 02-deployment.jpg
├── 03-recovery.jpg
└── photos.txt
```

### Step 3: Create photos.txt
```
01-glider-prep.jpg
02-deployment.jpg
03-recovery.jpg
```

### Step 4: Upload to GitHub
1. Go to your repository
2. Navigate to `images/fieldwork/` or `images/nature/`
3. Click "Add file" → "Upload files"
4. Drag the entire album folder
5. Commit changes

**Done!** Album appears on website in 1-2 minutes.

---

## ✨ Adding Captions Later

Already have photos uploaded? Add captions anytime:

1. Create `info.json` in the album folder
2. List all photos with captions
3. Upload `info.json`
4. Refresh website - captions appear!

**Photos without captions still work!**

---

## 🎯 Smart Filename Tricks

The system auto-extracts info from filenames:

```
2024-11-15-glider-deployment.jpg
  ↓ Becomes
Date: November 15, 2024
Caption: Glider deployment (if no caption in JSON)
```

Format: `YYYY-MM-DD-description.jpg`

---

## 📱 How It Looks

### Album Browser:
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│  COVER   │ │  COVER   │ │  COVER   │
│  IMAGE   │ │  IMAGE   │ │  IMAGE   │
│──────────│ │──────────│ │──────────│
│ ReBELS 1 │ │ COMICS 1 │ │Antarctica│
│ (2024)   │ │ (2017)   │ │ Wildlife │
│ 50 photos│ │ 35 photos│ │ 120photos│
└──────────┘ └──────────┘ └──────────┘
```

### Gallery View (Masonry):
```
┌────┐ ┌──────┐ ┌────┐
│    │ │      │ │    │
│ 1  │ │  2   │ │ 3  │
│    │ │      │ │    │
└────┘ │      │ └────┘
┌──────┐ │      │ ┌────┐
│      │ └──────┘ │    │
│  4   │ ┌────┐  │ 5  │
│      │ │ 6  │  │    │
└──────┘ └────┘  └────┘
```

### Lightbox:
```
┌─────────────────────────────┐
│ ✕                    [3/50] │
│                             │
│      ◄   [  PHOTO  ]   ►    │
│                             │
│ Deploying glider in storm   │
│ Labrador Sea • Nov 15, 2024 │
└─────────────────────────────┘
```

---

## ⌨️ Keyboard Navigation

In lightbox:
- **← →** : Previous / Next photo
- **Esc** : Close lightbox
- **Click outside** : Close

---

## 🎨 Changing Layout Style

### Current: Pinterest (Masonry)
3 columns on desktop, adapts to screen size

### Want Instagram Grid Instead?

Edit `css/gallery.css`:
```css
/* Change from masonry to grid */
.photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
}

.photo-item {
    aspect-ratio: 1;  /* Square photos */
}
```

### Want Slideshow Focus?
Just ask and I'll provide the CSS!

---

## 🔧 Troubleshooting

### Photos not showing?
- Check folder name matches exactly (case-sensitive)
- Verify `photos.txt` or `info.json` exists
- Check file paths are correct
- Wait 2 minutes for GitHub Pages to update

### Cover image not loading?
- Make sure `cover.jpg` exists in album folder
- Check filename matches what's in `info.json`
- Placeholder shows automatically if missing

### Captions not appearing?
- Verify `info.json` syntax (use JSONLint.com)
- Check quotes are correct
- Make sure file is named `info.json` exactly

### Album not in list?
- Folder name must match ID in `js/gallery.js`
- Check spelling and hyphens
- Clear browser cache

---

## 📊 Performance Tips

### For 50-200 Photos Per Album:

1. **Resize before upload**: 1200-2000px max
2. **Optimize file size**: Use TinyPNG.com or similar
3. **Progressive JPEGs**: Better for web
4. **Lazy loading**: Already built-in! ✅

### Batch Processing Tools:
- **Mac**: Preview (select all → Tools → Adjust Size)
- **Windows**: IrfanView or FastStone
- **Online**: Squoosh.app, TinyPNG.com
- **Command line**: ImageMagick
  ```bash
  mogrify -resize 1600x1600> -quality 85 *.jpg
  ```

---

## 🌟 Advanced Features

### Want to add later:

- **EXIF data display** (camera, lens, settings)
- **Map view** (photos on a map)
- **Search/filter** (by location, date, keyword)
- **Download button** (original high-res)
- **Share links** (individual photos)
- **Slideshow mode**

Just let me know!

---

## 📋 Quick Reference

### Minimal Album Setup:
```
1. Create folder: images/fieldwork/my-album/
2. Add photos + cover.jpg
3. Create photos.txt with filenames
4. Upload to GitHub
5. Done!
```

### Full-Featured Album:
```
1. Create folder with photos
2. Create info.json with captions/dates/locations
3. Upload to GitHub
4. Enjoy rich metadata!
```

---

## ✅ Checklist for First Album

- [ ] Choose album (e.g., ReBELS 1)
- [ ] Select 10-50 best photos
- [ ] Pick cover image
- [ ] Resize to ~1600px
- [ ] Create folder locally
- [ ] Create photos.txt or info.json
- [ ] Upload to GitHub
- [ ] Test on website
- [ ] Add captions (optional, later)

---

**Your photo gallery is ready! Start with one album to test, then add the rest.** 🌊📸

**Questions? Check the examples in this guide or ask!**
