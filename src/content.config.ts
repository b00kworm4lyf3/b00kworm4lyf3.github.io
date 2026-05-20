import { defineCollection, z } from 'astro:content';

// ─── Work / Projects ──────────────────────────────────────────────────────────
const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),                        // e.g. "October 2018" or "2024-04"
    shortDescription: z.string(),
    thumbnail: z.string(),                   // Cloudinary URL
    hero: z.string().optional(),             // Cloudinary URL, falls back to thumbnail
    tags: z.record(z.string(), z.array(z.string())), // { "Type": ["Shaders"], "Tech": ["WGSL"] }
    featured: z.boolean().default(false),

    // Optional: top-of-page gallery (Cloudinary URLs)
    // Images within the process narrative go inline in the MD body instead
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
    })).optional(),

    // Optional: link to live demo, GitHub, etc.
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).optional(),

    // Optional: embed a shader canvas on this page
    shaderCanvas: z.boolean().default(false),
    shaderScript: z.string().optional(),     // path to the JS/TS file to mount
  }),
});

// ─── Blog Posts ───────────────────────────────────────────────────────────────
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.record(z.string(), z.array(z.string())), // { "Course": ["CSCI4239"], "Topic": ["GLSL"] }
    summary: z.string().optional(),          // shown on the card before expanding
    draft: z.boolean().default(false),       // set true to hide from listing
  }),
});

export const collections = { work, blog };
