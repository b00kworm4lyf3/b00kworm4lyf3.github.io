---
title: "Reefcraft Water & Fish Shaders"
date: "Summer 2025"
shortDescription: "Custom WGSL shaders for water flow and fish schooling visualization."
thumbnail: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/portfolio/reefcraft_school_screenshot.png"
hero: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/portfolio/reefcraft_school_screenshot.png"
tags:
  Type: ["Shaders"]
  Tech: ["WGSL", "Python", "pygfx"]
featured: true
shaderCanvas: false   # set true + add shaderScript if you want a live demo here
links:
  - label: "GitHub"
    url: "https://github.com/yourusername/reefcraft-shaders"
gallery:
  - src: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/portfolio/reefcraft_school_screenshot.png"
    alt: "School of fish facing into current"
  - src: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/portfolio/reefcraft_glow_screenshot.png"
    alt: "Glowing water particles"
---

As part of my technical art internship on the Reefcraft coral visualization project, I developed custom WGSL point sprite shaders for visualizing water flow and animating schools of fish. Starting from pygfx's existing point material pipeline, I extended and modified the shaders to create two visual effects: glowing particles that drift along the currents, and fish-shaped sprites that orient themselves into them.

## Starting Point: pygfx Point Sprites

Both shaders began as modifications of pygfx's PointsMaterial pipeline. The existing code handled the vertex shader setup for billboard quads, size calculations across different coordinate spaces, and the binding infrastructure for passing data to the GPU. I kept this foundation and focused my work on the fragment shader.

## Fish Shader: Custom SDF & Billboard Orientation

The fish shader required more substantial changes...

<!-- 
  Images inline in the narrative — just use Cloudinary URLs directly.
  The global.css styles img tags site-wide so they'll look right.
-->

![Fish facing into current](https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/portfolio/reefcraft_school_screenshot.png)

## GPU Particle System

I built a custom particle system using VAOs, VBOs, and GLSL shaders...

```glsl
vec2 p = gl_PointCoord * 2.0 - 1.0;
float angle = atan(p.y, p.x);
float dist = length(p);

float slice = mod(angle, TAU / 5.0) / (TAU / 5.0);
float r = mix(inR, outR, abs(slice * 2.0 - 1.0));
float alpha = 1.0 - step(r, dist);
if (alpha < 0.01) discard;

gl_FragColor = vec4(colour, alpha);
```
