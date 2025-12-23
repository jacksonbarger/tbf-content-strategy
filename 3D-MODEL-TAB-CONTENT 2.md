# SolidWorks to Web: 3D Model Export Guide

## Quick Summary
Export SolidWorks model as **.STEP** → Convert in **Blender** to **.GLB** → Display with **model-viewer**

---

## Step 1: SolidWorks Export

**Export the geometry:**
1. File → Save As → **STEP AP214** (.step)
2. Save as `bottom-feeder-assembly.step`

**Document your materials (critical - they don't transfer):**

| Part | Material | Color Code |
|------|----------|------------|
| Handle/Base Plate | Stainless Steel | #C0C0C0 |
| Cables/Tubing | Yellow Plastic | #FFD700 |
| Housing | Gray Plastic | #404040 |
| Wheels/Seals | Black Rubber | #1A1A1A |
| Logo | Decal | Export as PNG |

**Export the logo:** Save as `tbf-logo.png` (1024x1024px, transparent background)

---

## Step 2: Blender Conversion

**Install:** [blender.org](https://www.blender.org/download/) (free)

**Import & Apply Materials:**
1. File → Import → STEP (or convert via FreeCAD first)
2. For each part, create material with these PBR values:

| Material | Metallic | Roughness |
|----------|----------|-----------|
| Stainless Steel | 1.0 | 0.35 |
| Yellow Plastic | 0.0 | 0.50 |
| Black Rubber | 0.0 | 0.85 |
| Gray Plastic | 0.0 | 0.40 |

**Export:**
1. File → Export → glTF 2.0
2. Format: **glTF Binary (.glb)**
3. Enable **Compress** (Draco compression)
4. Save as `bottom-feeder.glb`

**Verify:** Test at [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/)

---

## Step 3: Web Implementation

**Place file:** `/public/models/bottom-feeder.glb`

**Add to HTML:**
```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>

<model-viewer
  src="/models/bottom-feeder.glb"
  alt="The Bottom Feeder - 3D View"
  auto-rotate
  camera-controls
  shadow-intensity="1"
  style="width: 100%; height: 500px;">
</model-viewer>
```

---

## Deliverables Checklist

- [ ] `bottom-feeder.glb` (under 5MB)
- [ ] `tbf-logo.png` (1024x1024, transparent)
- [ ] Fallback image for non-WebGL browsers
- [ ] Tested on mobile (iOS Safari, Android Chrome)

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Model appears black | Set Metallic=1 for metals, use Principled BSDF shader |
| Stainless steel looks plastic | Metallic must be 1.0, not 0 |
| Logo is blurry | Use higher resolution PNG (min 1024px) |
| File too large | Enable Draco compression, use Decimate modifier |

---

## Key Color Codes

- TBF Yellow: `#FFFF00`
- Stainless Steel: `#C0C0C0`
- Body Gray: `#404040`
- Brand Black: `#171717`
