# 3D Models for BoxBoxBox Loading Screen

The BoxBoxBox loading screen features Ayrton Senna's iconic helmet as a tribute to the legendary F1 driver.

## Required 3D Models

1. `senna_helmet.glb` - Ayrton Senna's iconic yellow helmet with green and blue stripes

## About Ayrton Senna's Helmet

Ayrton Senna's helmet had a distinctive design:
- Base color: Bright yellow
- Main stripe: Green (representing Brazil)
- Secondary stripe: Blue
- Often featured sponsor logos depending on the era (Marlboro, Nacional, etc.)

## Finding 3D Models

You can source a suitable 3D model of Senna's helmet from:

- [Sketchfab](https://sketchfab.com/search?q=senna+helmet&type=models)
- [TurboSquid](https://www.turbosquid.com/Search/Index.cfm?keyword=f1+helmet)
- [CGTrader](https://www.cgtrader.com/3d-models?keywords=f1+helmet)
- [Free3D](https://free3d.com/3d-models/f1-helmet)

## Model Requirements

For optimal performance in the loading screen:

- Format: GLB or GLTF (preferred for web)
- Polygons: Keep under 50k for good performance
- Textures: 2K resolution is sufficient (2048×2048)
- Size: Keep the file under 5MB

## Creating a Simple Helmet

If you cannot find a specific Senna helmet model, you can:

1. Use any F1 helmet model and apply a custom texture with Senna's colors
2. Create a simplified helmet in Blender and texture it with Senna's iconic colors
3. Modify an existing helmet model to match Senna's design

## Fallback Behavior

If no 3D model is available, the loading screen will display a stylized CSS representation of Senna's helmet, maintaining the tribute while ensuring the application functions correctly.

---

Note: The 3D model is used purely as a tribute to celebrate Senna's legacy in Formula 1 and is not intended for commercial purposes.

# 3D Model Assets

This directory contains the 3D models used in the F1 loading experience:

## Required Model Files

1. `f1_car.glb` - Stylized F1 car model for the logo

## Model Attribution

Please ensure all 3D models are properly licensed for your project. You can obtain free or paid 3D models from:

- [Sketchfab](https://sketchfab.com/)
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)

## Format

Models should be in glTF/GLB format for optimal performance with Three.js. GLB is a binary form of glTF that includes all textures and materials in a single file.

## Optimization

For best performance:

1. Keep models under 5MB
2. Reduce polygon count while maintaining visual quality
3. Optimize textures (compress, resize)
4. Remove unnecessary bones, animations, or details

## Adding Custom Models

To add custom models:

1. Export your model in glTF/GLB format
2. Place the file in this directory
3. Update the references in the components as needed 