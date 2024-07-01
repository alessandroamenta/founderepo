"use server"

import "server-only"
import { cache } from "react"
import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"

export async function getFilters() {
  const db = createClient()
  const { data: categoriesData, error: categoriesError } = await db
    .from("categories")
    .select("name")

  const { data: labelsData, error: labelsError } = await db
    .from("labels")
    .select("name")

  const { data: tagsData, error: tagsError } = await db
    .from("tags")
    .select("name")

  const { data: countriesData, error: countriesError } = await db
    .from("countries")
    .select("name, code")

  if (categoriesError || labelsError || tagsError || countriesError) {
    console.error(
      "Error fetching filters:",
      categoriesError,
      labelsError,
      tagsError,
      countriesError
    )
    return { categories: [], labels: [], tags: [], countries: [] }
  }

  const unique = (array: string[]) => [...new Set(array)]

  return {
    categories: categoriesData.map((item: { name: string }) => item.name).filter(Boolean),
    labels: labelsData.map((item: { name: string }) => item.name).filter(Boolean),
    tags: tagsData.map((item: { name: string }) => item.name).filter(Boolean),
    countries: countriesData.map((item: { name: string, code: string }) => ({ name: item.name, code: item.code })),
  }
}

export const getProducts = cache(
  async (
    searchTerm?: string,
    category?: string,
    label?: string,
    tag?: string,
    countryCode?: string,
    isRemote?: boolean
  ) => {
    const db = createClient()
    let query = db.from("products").select("*")

    if (searchTerm) {
      query = query.or(
        `program_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,punchline.ilike.%${searchTerm}%`
      )
    }

    if (category) {
      query = query.eq("categories", category)
    }

    if (label) {
      query = query.contains("labels", [label])
    }

    if (tag) {
      query = query.contains("tags", [tag])
    }

    if (countryCode) {
      query = query.contains("countries", [countryCode])
    }

    if (isRemote !== undefined) {
      query = query.eq("is_remote", isRemote)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error searching resources:", error)
      return []
    }

    return data
  }
)

export async function getProductById(id?: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
  if (error) {
    console.error("Error fetching resources:", error)
    return []
  }

  console.log(data)
  return data
}

export async function incrementClickCount(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("increment_product_view_count", {
    product_id: id,
  })

  if (error) {
    console.error("Error incrementing click count:", error)
  } else {
    console.log("Click count incremented:", data)
  }

  revalidatePath("/programs")
}
