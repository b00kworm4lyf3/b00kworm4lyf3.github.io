import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

const work = defineCollection({
    loader: glob({base: './src/content/work', pattern:'**/*.{md,mdx}'}),
    schema: z.object({
        title: z.string(),
        date:  z.array(z.coerce.date()),
        tags:  z.strictObject({
            tech:  z.array(z.string()).optional(),
            focus: z.array(z.string()).optional(),
        }),
        shortDesc: z.string(),
        thumb: z.string(),
        feat:  z.boolean().default(false),
    }),
});

export const collections = {work};