import { z } from "zod";

// Film validation schema
export const filmSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  category: z.string().min(1, "Category is required"),
  tagline: z
    .string()
    .min(1, "Tagline is required")
    .max(200, "Tagline must be less than 200 characters")
    .refine((val) => {
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
      return wordCount <= 50;
    }, "Tagline must not exceed 50 words"),
  thumbnail: z
    .string()
    .min(1, "Thumbnail is required")
    .refine(
      (val) =>
        val.startsWith("/uploads/") || z.string().url().safeParse(val).success,
      "Invalid thumbnail URL or path"
    ),
  videoUrl: z.string().url("Invalid video URL"),
});

export type FilmFormData = z.infer<typeof filmSchema>;

// Team validation schema
export const teamSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position too long"),
  image: z.string().min(1, "Image is required"),
});

export type TeamFormData = z.infer<typeof teamSchema>;

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  logo: z.string().min(1, "Logo is required"),
});

export type ClientFormData = z.infer<typeof clientSchema>;
