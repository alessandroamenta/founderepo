import { z } from "zod"

export const schema = z.object({
  programName: z.string().trim().min(1, { message: "Program name is required." }),
  website: z.string().trim().url({ message: "Invalid URL." }),
  programType: z.string().trim().min(1, { message: "Program type is required." }),
  financialSupport: z.string().trim().optional(),
  programLength: z.string().trim().optional(),
  location: z.string().trim().optional(),
  countries: z.array(z.string()).min(1, { message: "At least one country is required." }),
  isRemote: z.boolean().optional(),
  focusArea: z.string().trim().optional(),
  targetStage: z.array(z.string()).min(1, { message: "At least one target stage is required." }),
  punchline: z.string().trim().max(30, { message: "Punchline must be less than 10 words." }).optional(),
  description: z.string().trim().optional(),
  images: z.any().optional(),
  logo_src: z.any().optional(),
  tags: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
})

export const enrichmentSchema = z.object({
  tags: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
})