"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().uuid(),
  programName: z.string(),
  reviewerName: z.string().min(1, "Name is required"),
  reviewerEmail: z.string().email("Invalid email address"),
  programYear: z.number().int().min(1900).max(new Date().getFullYear()),
  experience: z.string().min(1, "Experience is required"),
  proof: z.string().min(1, "Proof is required"),
})

export type ReviewFormState = {
  message: string
  issues: string[]
}

export async function submitReview(
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const db = createClient()

  const parsedData = {
    productId: formData.get("productId"),
    programName: formData.get("programName"),
    reviewerName: formData.get("reviewerName"),
    reviewerEmail: formData.get("reviewerEmail"),
    programYear: parseInt(formData.get("programYear") as string),
    experience: formData.get("experience"),
    proof: formData.get("proof"),
  }

  const parsed = reviewSchema.safeParse(parsedData)

  if (!parsed.success) {
    console.error("Form validation failed", parsed.error)
    return {
      message: "Invalid form data",
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  try {
    const reviewData = {
      product_id: parsed.data.productId,
      program_name: parsed.data.programName,
      reviewer_name: parsed.data.reviewerName,
      reviewer_email: parsed.data.reviewerEmail,
      program_year: parsed.data.programYear,
      experience: parsed.data.experience,
      proof: parsed.data.proof,
    }

    console.log("Inserting review data:", reviewData)
    const { data: insertedData, error } = await db
      .from("reviews")
      .insert([reviewData])
      .select()

    if (error) {
      console.error(`Error inserting review data:`, error)
      throw new Error(error.message)
    }

    console.log("Review data successfully inserted:", insertedData)

    revalidatePath(`/products/${parsed.data.productId}`)

    return { message: "Review submitted successfully", issues: [] }
  } catch (error) {
    console.error(`Submission failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`)
    return {
      message: `Submission failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      issues: [error instanceof Error ? error.message : "Unknown error occurred"],
    }
  }
}

export async function getReviewsForProduct(productId: string) {
  const db = createClient()
  
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data
}
