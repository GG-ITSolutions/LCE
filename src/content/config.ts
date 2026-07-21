import { defineCollection, z } from 'astro:content';

const team = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      department: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      linkedin: z.string().url().optional(),
      image: image(),
      order: z.number(),
      hasProfile: z.boolean().default(false),
    }),
});

export const collections = { team };
