---
title: "CSCI4239 Homework 1: NDC to RGB Shader"
date: 2026-01-13
tags:
  Course: ["CSCI4239", "Advanced Computer Graphics"]
  Topic: ["OpenGL", "GLSL Shaders"]
summary: "Getting the trivial NDC to RGB shader working, then going further by adding my falling-stars particle system from last semester."
draft: false
---

## Goals

I want to make sure I understand the basic concepts first so will be initially working on making it look/work similarly to what we were shown in class. Once I get that working though I want to try to do a quick implementation of my falling stars particles that I made with P5.js last year.

## Reflection

The basic NDC to RGB shader was pretty straightforward, especially after I gave up trying to do it completely in the frag shader...

<!-- YouTube embed — just paste the iframe, global.css handles sizing -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" title="Star particle system demo" allowfullscreen></iframe>

Getting the NDC to RGB color swap to work was simple, but calculating a star shape for my point sprites was an absolute brainteaser!

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

[Link to GitHub Repo](https://github.com/b00kworm4lyf3/CSCI4239-hw1-NDC2RGB)
