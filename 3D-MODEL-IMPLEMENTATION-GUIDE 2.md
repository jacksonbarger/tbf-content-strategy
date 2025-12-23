# The Bottom Feeder - 3D Gyroscopic Model Implementation Guide

## Overview

This guide provides step-by-step instructions for exporting a SolidWorks CAD model of The Bottom Feeder pool vacuum and implementing it as an interactive, rotating 3D viewer on the website.

**Goal**: Create a gyroscopic (user-controllable, rotating) 3D render with accurate materials including:
- Stainless steel components
- Yellow tubing/cables
- The Bottom Feeder logo
- Plastic housings and rubber parts

---

## Table of Contents

1. [Required Software](#required-software)
2. [Phase 1: SolidWorks Export](#phase-1-solidworks-export)
3. [Phase 2: Blender Conversion](#phase-2-blender-conversion)
4. [Phase 3: Web Implementation](#phase-3-web-implementation)
5. [Material Reference Chart](#material-reference-chart)
6. [Troubleshooting](#troubleshooting)

---

## Required Software

| Software | Purpose | Cost |
|----------|---------|------|
| SolidWorks | Source CAD model | (already owned) |
| Blender 4.x | Convert to web format + apply materials | Free - [blender.org](https://www.blender.org/download/) |
| Text Editor | Edit HTML/code | Free (VS Code recommended) |

**Optional but helpful**:
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/) - Preview GLB files in browser
- [Squoosh](https://squoosh.app/) - Compress texture images

---

## Phase 1: SolidWorks Export

### Step 1.1: Prepare the Assembly

Before exporting, ensure your SolidWorks model is ready:

1. **Open the full assembly** (not individual parts)
2. **Simplify if needed**: Hide internal components not visible from outside
3. **Check scale**: Ensure the model is in real-world units (meters preferred for web)

### Step 1.2: Export Geometry

1. Go to **File → Save As**
2. Select format: **STEP AP214 (.step, .stp)**
   - Why STEP? It preserves the full assembly structure and is universally compatible
3. Click **Options** and ensure:
   - ☑ Export assembly as: **Multi-body part** or **Assembly**
   - ☑ Include curves
4. Save the file (e.g., `bottom-feeder-assembly.step`)

### Step 1.3: Document Your Materials

Create a reference list of all appearances/materials in your model. This is CRITICAL because SolidWorks materials don't transfer automatically.

**Create a table like this**:

| Part Name | SolidWorks Appearance | Target Material | Notes |
|-----------|----------------------|-----------------|-------|
| Main Housing | Gray Plastic | Matte plastic | Dark gray #333333 |
| Handle Base Plate | Stainless Steel - Brushed | Brushed metal | Metallic finish |
| Battery Cable | Yellow | Yellow rubber/plastic | #FFD700 or #FFFF00 |
| Portability Cord | Yellow | Yellow rubber | Same as cable |
| Wheels | Black Rubber | Matte rubber | Very rough surface |
| Logo Area | Decal | Image texture | See logo file |
| Filter Housing | Translucent Plastic | Semi-transparent | If applicable |
| Motor Assembly | Aluminum | Metallic gray | Metallic=1 |

### Step 1.4: Export Textures & Decals

1. **Logo**: Export as PNG with transparency
   - Recommended size: 1024x1024 or 2048x2048 pixels
   - File: `tbf-logo.png`

2. **Any other decals**: Export each as a separate PNG

3. **Note UV placement**: Take a screenshot of where each decal is positioned

### Step 1.5: Export Reference Images

Take screenshots from SolidWorks showing the model from multiple angles. These will be your reference when applying materials in Blender:

- Front view
- Side view
- Top view
- Any detail shots of textured areas

---

## Phase 2: Blender Conversion

### Step 2.1: Install Blender

1. Download from [blender.org](https://www.blender.org/download/)
2. Install and open Blender
3. Delete the default cube (select it, press `X`, confirm)

### Step 2.2: Import the STEP File

1. Go to **File → Import → STL/STEP**
   - Note: You may need the **CAD Importer add-on** for STEP files
   - Alternative: Use [FreeCAD](https://www.freecad.org/) to convert STEP → OBJ, then import OBJ into Blender

2. If using FreeCAD as intermediary:
   ```
   FreeCAD: File → Import → Select your .step file
   FreeCAD: File → Export → Select .obj format
   Blender: File → Import → Wavefront (.obj)
   ```

3. After import, the model should appear in the viewport

### Step 2.3: Organize the Model

1. In the **Outliner** panel (top right), rename parts clearly:
   - `Housing_Main`
   - `Handle_StainlessSteel`
   - `Cable_Yellow`
   - etc.

2. Select all objects, press `Ctrl+A` → **Apply All Transforms**

3. Check scale: The model should be roughly real-world size (a pool vacuum is ~12-18 inches)

### Step 2.4: Apply PBR Materials

For each part, create a new material with these settings:

#### Stainless Steel (Handle, Base Plate, Metal Parts)

```
Material Name: StainlessSteel_Brushed
Shader: Principled BSDF
├── Base Color: #C0C0C0 (silver gray)
├── Metallic: 1.0
├── Roughness: 0.35 (for brushed finish)
└── Specular: 0.5
```

To create in Blender:
1. Select the stainless steel part
2. Go to **Materials** tab (sphere icon in Properties panel)
3. Click **New**
4. Name it "StainlessSteel_Brushed"
5. Set the values above in the Principled BSDF node

#### Yellow Tubing/Cable

```
Material Name: Yellow_Tubing
Shader: Principled BSDF
├── Base Color: #FFD700 (golden yellow) or #FFFF00 (pure yellow)
├── Metallic: 0.0
├── Roughness: 0.5
└── Specular: 0.3
```

#### Black Rubber (Wheels, Seals)

```
Material Name: Black_Rubber
Shader: Principled BSDF
├── Base Color: #1A1A1A (near black)
├── Metallic: 0.0
├── Roughness: 0.85
└── Specular: 0.1
```

#### Gray Plastic (Housing)

```
Material Name: Gray_Plastic
Shader: Principled BSDF
├── Base Color: #404040 (dark gray)
├── Metallic: 0.0
├── Roughness: 0.4
└── Specular: 0.4
```

#### Logo Decal

1. Select the surface where the logo goes
2. Enter **Edit Mode** (`Tab`)
3. Select the faces for the logo area
4. Press `U` → **Unwrap** or **Project from View**
5. In the **Shader Editor**, add:
   - Image Texture node → Load `tbf-logo.png`
   - Connect to Base Color of Principled BSDF
6. Adjust UV mapping in the **UV Editor** to position correctly

### Step 2.5: Optimize for Web

1. **Reduce polygon count** (if model is very detailed):
   - Select object
   - Add **Decimate** modifier
   - Set ratio to 0.5 or lower
   - Apply modifier

2. **Target file size**: Aim for under 5MB for fast loading, ideally under 2MB

3. **Merge close vertices**:
   - Edit Mode → Select All (`A`)
   - Mesh → Merge → By Distance

### Step 2.6: Export as GLB

1. **Select all visible objects** (`A` in Object Mode)

2. Go to **File → Export → glTF 2.0 (.glb/.gltf)**

3. In the export settings panel (right side):
   ```
   Format: glTF Binary (.glb)    ← IMPORTANT: Choose .glb not .gltf

   Include:
   ☑ Selected Objects
   ☑ Visible Objects
   ☐ Active Collection

   Transform:
   ☑ +Y Up

   Data:
   ☑ Apply Modifiers

   Materials:
   ☑ Export Materials
   Format: Placeholder   ← or "Export" if you have image textures

   Compression:
   ☑ Compress           ← Enables Draco compression for smaller files
   ```

4. Save as `bottom-feeder.glb`

5. **Verify the export**:
   - Open [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/)
   - Drag and drop your GLB file
   - Check that all materials appear correctly

---

## Phase 3: Web Implementation

### Option A: Using `<model-viewer>` (Recommended - Simplest)

This is Google's web component for 3D models. It works on all modern browsers and requires no JavaScript knowledge.

#### Step 3A.1: Add the Model File

Place `bottom-feeder.glb` in your website's public folder:
```
/public/models/bottom-feeder.glb
```

Or for Shopify:
```
Settings → Files → Upload bottom-feeder.glb
Copy the CDN URL
```

#### Step 3A.2: Add the HTML

```html
<!-- Add this in the <head> section -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>

<!-- Add this where you want the 3D viewer to appear -->
<model-viewer
  id="bottom-feeder-3d"
  src="/models/bottom-feeder.glb"
  alt="The Bottom Feeder Cordless Battery Powered Pool Vacuum - Interactive 3D Model"
  auto-rotate
  rotation-per-second="30deg"
  camera-controls
  touch-action="pan-y"
  shadow-intensity="1"
  shadow-softness="0.5"
  exposure="1"
  environment-image="neutral"
  style="width: 100%; height: 500px; background-color: #f5f5f5;"
>
  <!-- Loading indicator -->
  <div class="progress-bar" slot="progress-bar">
    <div class="update-bar"></div>
  </div>

  <!-- Fallback for browsers without WebGL -->
  <div slot="poster" style="display: flex; align-items: center; justify-content: center; height: 100%;">
    <img src="/images/bottom-feeder-fallback.jpg" alt="The Bottom Feeder" style="max-width: 100%;">
  </div>
</model-viewer>

<style>
  model-viewer {
    --poster-color: transparent;
  }

  model-viewer .progress-bar {
    display: block;
    width: 33%;
    height: 10%;
    max-height: 2%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 25px;
    box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.9);
  }

  model-viewer .update-bar {
    background-color: #FFD700; /* Yellow to match branding */
    width: 0%;
    height: 100%;
    border-radius: 25px;
    transition: width 0.3s;
  }
</style>
```

#### Step 3A.3: Advanced Options

```html
<!-- Full-featured implementation -->
<model-viewer
  src="/models/bottom-feeder.glb"
  alt="The Bottom Feeder - 3D View"

  <!-- Rotation -->
  auto-rotate
  rotation-per-second="30deg"

  <!-- User interaction -->
  camera-controls
  touch-action="pan-y"
  disable-zoom          <!-- Remove if you want zoom -->

  <!-- Camera positioning -->
  camera-orbit="45deg 55deg 2.5m"
  min-camera-orbit="auto auto 1m"
  max-camera-orbit="auto auto 5m"

  <!-- Lighting & shadows -->
  shadow-intensity="1"
  shadow-softness="0.8"
  exposure="1.0"

  <!-- Performance -->
  loading="lazy"
  reveal="auto"

  <!-- AR support (mobile) -->
  ar
  ar-modes="webxr scene-viewer quick-look"

  style="width: 100%; height: 600px;"
>
</model-viewer>
```

---

### Option B: Using Sketchfab (No Code Required)

If you want to avoid any coding:

1. Create account at [sketchfab.com](https://sketchfab.com)
2. Upload your GLB file
3. Configure viewer settings (background, lighting, etc.)
4. Copy the embed code
5. Paste into your website

---

### Option C: Using Spline (Design Tool)

1. Import your GLB into [spline.design](https://spline.design)
2. Add lighting, camera controls
3. Export for web or get embed code

---

## Material Reference Chart

### PBR Values Quick Reference

| Material | Base Color | Metallic | Roughness | Notes |
|----------|-----------|----------|-----------|-------|
| Stainless Steel (polished) | #D4D4D4 | 1.0 | 0.15 | Mirror-like |
| Stainless Steel (brushed) | #C0C0C0 | 1.0 | 0.35 | Most common |
| Stainless Steel (matte) | #B0B0B0 | 1.0 | 0.55 | Industrial look |
| Yellow Plastic | #FFD700 | 0.0 | 0.45 | Slightly glossy |
| Yellow Rubber | #E6C200 | 0.0 | 0.70 | Matte finish |
| Black Rubber | #1A1A1A | 0.0 | 0.85 | Very matte |
| Gray Plastic (dark) | #404040 | 0.0 | 0.40 | Standard plastic |
| Gray Plastic (light) | #808080 | 0.0 | 0.40 | Standard plastic |
| Aluminum | #A8A8A8 | 1.0 | 0.30 | Slightly textured |
| Clear Plastic | #FFFFFF | 0.0 | 0.10 | Add transparency |

### Color Codes for The Bottom Feeder Brand

| Element | Hex Code | RGB |
|---------|----------|-----|
| TBF Yellow | #FFFF00 | 255, 255, 0 |
| TBF Yellow (alt) | #FFD700 | 255, 215, 0 |
| Body Gray | #333333 | 51, 51, 51 |
| Accent Black | #171717 | 23, 23, 23 |

---

## Troubleshooting

### Model appears black or with no materials

**Cause**: Materials didn't export correctly from Blender

**Fix**:
1. In Blender, ensure each material uses **Principled BSDF** shader
2. Check that Base Color is not pure black (use #1A1A1A minimum)
3. Re-export with "Export Materials" checked

### Model is too large/small in the viewer

**Cause**: Scale mismatch between SolidWorks and web units

**Fix**:
1. In Blender, select all objects
2. Press `S` to scale, type the multiplier (e.g., `0.01` to shrink)
3. Press `Ctrl+A` → Apply Scale
4. Re-export

### Logo texture is blurry

**Cause**: Low resolution source image

**Fix**:
1. Use minimum 1024x1024 PNG for logo
2. Ensure proper UV mapping (logo should fill the UV space)

### File size too large (>10MB)

**Cause**: Too many polygons or uncompressed textures

**Fix**:
1. Use Decimate modifier in Blender (ratio 0.3-0.5)
2. Enable Draco compression when exporting GLB
3. Resize textures to 1024x1024 or 512x512

### Model-viewer shows blank white screen

**Cause**: WebGL not supported or file path incorrect

**Fix**:
1. Verify the GLB file path is correct
2. Check browser console for errors (F12)
3. Ensure file is accessible (not blocked by CORS)
4. Add the poster/fallback image for unsupported browsers

### Stainless steel looks like plastic

**Cause**: Metallic value not set to 1.0

**Fix**:
1. In Blender, select the metal parts
2. In Material properties, set Metallic = 1.0
3. Adjust Roughness for desired finish (lower = shinier)

---

## File Checklist

Before deployment, ensure you have:

- [ ] `bottom-feeder.glb` - The optimized 3D model (target: <5MB)
- [ ] `tbf-logo.png` - Logo texture (1024x1024, transparent background)
- [ ] `bottom-feeder-fallback.jpg` - Static image for non-WebGL browsers
- [ ] Material reference document (which parts are which material)
- [ ] Test on mobile devices (iOS Safari, Android Chrome)

---

## Deployment Paths

### For Vercel

1. Place GLB in `/public/models/`
2. Reference as `/models/bottom-feeder.glb`
3. Deploy normally

### For Shopify

1. Go to Settings → Files
2. Upload `bottom-feeder.glb`
3. Copy the CDN URL (e.g., `https://cdn.shopify.com/s/files/...`)
4. Use that full URL in the `src` attribute

### For Generic Hosting

1. Upload GLB to your server or CDN
2. Ensure CORS headers allow the file to be loaded
3. Set correct MIME type: `model/gltf-binary`

---

## Support Resources

- [Model-Viewer Documentation](https://modelviewer.dev/)
- [Blender glTF Export Guide](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models) - For testing
- [glTF Validator](https://github.khronos.org/glTF-Validator/) - Check for errors

---

*Document Version: 1.0*
*Created: December 2024*
*For: The Bottom Feeder Website Team*
