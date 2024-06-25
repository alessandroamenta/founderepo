"use server"

import "server-only"
import { revalidatePath, revalidateTag } from "next/cache"
import { createClient } from "@/db/supabase/server"
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"

import { enrichmentSchema, schema } from "./schema"

// Configuration object
const config = {
  aiEnrichmentEnabled: false,
  aiModel: anthropic("claude-3-haiku-20240307"), // You can change this to another model if needed
  storageBucket: "product-logos",
  cacheControl: "3600",
  allowNewTags: true,
  allowNewLabels: true,
  allowNewCategories: true,
}

export type FormState = {
  message: string
  fields?: Record<string, string>
  issues: string[]
}

type Enrichment = {
  tags: string[]
  labels: string[]
}

// Helper function to check if an error has a message
function isErrorWithMessage(error: unknown): error is Error {
  return typeof error === "object" && error !== null && "message" in error
}

// Uploads the logo file to the storage bucket
async function uploadLogoFile(
  db: any,
  logoFile: File,
  codename: string
): Promise<string> {
  const fileExt = logoFile.name.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${codename}/${fileName}`
  const fileBuffer = await logoFile.arrayBuffer()

  const { error: uploadError } = await db.storage
    .from(config.storageBucket)
    .upload(filePath, Buffer.from(fileBuffer), {
      cacheControl: config.cacheControl,
      upsert: false,
    })

  if (uploadError) {
    console.error(`Error uploading file: ${uploadError.message}`)
    throw new Error(uploadError.message)
  }

  const publicUrlResponse = db.storage
    .from(config.storageBucket)
    .getPublicUrl(filePath)
  console.log(
    `Logo file uploaded. Public URL: ${publicUrlResponse.data.publicUrl}`
  )
  return publicUrlResponse.data.publicUrl
}

// Inserts a new entry if it does not already exist
async function insertIfNotExists(
  db: any,
  table: string,
  name: string
): Promise<void> {
  console.log(`Attempting to insert ${name} into ${table}`)

  const { error } = await db
    .from(table)
    .insert([{ name }], { onConflict: "name" })

  if (error && !error.message.includes("duplicate key value")) {
    console.error(`Error inserting into ${table}: ${error.message}`)
    throw new Error(`Error inserting into ${table}: ${error.message}`)
  }

  console.log(`${name} successfully inserted or already exists in ${table}`)
}

// Generates the AI enrichment prompt with examples

// Main function to handle the form submission
export async function onSubmitToolAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("onSubmitToolAction called");
  const db = createClient();
  
  // Create a new object to store the parsed form data
  const parsedData: Record<string, any> = {};

  // Iterate through all form entries
  for (const [key, value] of formData.entries()) {
    if (key === 'targetStage') {
      // If the key is 'targetStage', get all values as an array
      parsedData[key] = formData.getAll(key);
    } else {
      // For other keys, just use the single value
      parsedData[key] = value;
    }
  }

  console.log("Parsed form data:", parsedData);
  
  const parsed = schema.safeParse(parsedData);

  if (!parsed.success) {
    console.error("Form validation failed", parsed.error);
    const fields: Record<string, string> = {}
    for (const key of Object.keys(parsedData)) {
      fields[key] = parsedData[key].toString()
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    }
  }

  try {
    const { data: authData, error: authError } = await db.auth.getUser();
    if (authError || !authData.user) {
      console.error("User authentication failed", authError);
      throw new Error("User authentication failed");
    }
    const user = authData.user;

    let logoUrl = ""
    const logoFile = formData.get("images") as File
    if (logoFile && logoFile instanceof File) {
      logoUrl = await uploadLogoFile(db, logoFile, parsed.data.programName)
    }

    const programType = parsed.data.programType || "other"
    const tags = [programType]
    const labels = [programType]

    const programData = {
      program_name: parsed.data.programName,
      website: parsed.data.website,
      program_type: parsed.data.programType,
      target_stage: parsed.data.targetStage,
      financial_support: parsed.data.financialSupport || null,
      program_length: parsed.data.programLength || null,
      location: parsed.data.location || null,
      focus_area: parsed.data.focusArea || null,
      punchline: parsed.data.punchline || null,
      description: parsed.data.description || null,
      logo_src: logoUrl || null,
      user_id: user.id,
      approved: true,
      tags,
      labels,
      categories: [parsed.data.programType],
    };

    console.log("Inserting program data:", programData);
    const { data: insertedData, error } = await db
      .from("products")
      .insert([programData])
      .select();

    if (error) {
      console.error(`Error inserting program data:`, error);
      throw new Error(error.message);
    }

    console.log("Program data successfully inserted:", insertedData);

    revalidatePath("/")
    revalidateTag("program-filters")

    return { message: "Program submitted successfully", issues: [] }
  } catch (error) {
    console.error(
      `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`
    )
    return {
      message: `Submission failed: ${
        isErrorWithMessage(error) ? error.message : "Unknown error occurred"
      }`,
      issues: [
        isErrorWithMessage(error) ? error.message : "Unknown error occurred",
      ],
    }
  }
}