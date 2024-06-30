"use server"

import "server-only"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"

type FilterData = {
  categories: string[]
  labels: string[]
  tags: string[]
  countries: { name: string; code: string }[]
}

type CountryData = {
  countries: string[]
}

type CategoryData = {
  name: string
}

type LabelData = {
  name: string
}

type TagData = {
  name: string
}

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getFilters(): Promise<FilterData> {
  const { data: categoriesData, error: categoriesError } = await client
    .from("categories")
    .select("name")

  const { data: labelsData, error: labelsError } = await client
    .from("labels")
    .select("name")

  const { data: tagsData, error: tagsError } = await client
    .from("tags")
    .select("name")

  const { data: countriesData, error: countriesError } = await client
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

  const categories = categoriesData
    ? unique(
        categoriesData.map((item: CategoryData) => item.name).filter(Boolean)
      )
    : []

  const labels = labelsData
    ? unique(labelsData.map((item: LabelData) => item.name).filter(Boolean))
    : []

  const tags = tagsData
    ? unique(tagsData.map((item: TagData) => item.name).filter(Boolean))
    : []
    
    const countries = countriesData
    ? countriesData.map((item: { name: string, code: string }) => ({ name: item.name, code: item.code }))
    : []

  console.log("Processed countries:", countries);

  return { categories, labels, tags, countries }
}

export const getCachedFilters = async (): Promise<FilterData> => {
  // Directly call getFilters without caching
  return await getFilters();
}

