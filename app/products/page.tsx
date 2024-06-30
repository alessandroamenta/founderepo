import { ReactElement } from "react"
import { BoxIcon, Hash, Search, TagIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { GradientHeading } from "@/components/cult/gradient-heading"
import { ResourceCardGrid } from "@/components/directory-card-grid"
import { GlobeIcon } from "lucide-react"

import { NavSidebar } from "../../components/nav"
import { getCachedFilters } from "../actions/cached_actions"
import { getProducts } from "../actions/product"

export const dynamic = "force-dynamic"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    search?: string
    category?: string
    label?: string
    tag?: string
    country?: string
    remote?: string
  }
}): Promise<ReactElement> {
  const { search, category, label, tag, country, remote } = searchParams
  const data = await getProducts(search, category, label, tag, country, remote === "true")
  let filters = await getCachedFilters()
  
  console.log("Filters in ProductsPage:", filters);

  return (
    <>
    <NavSidebar
      categories={filters.categories}
      labels={filters.labels}
      tags={filters.tags}
      countries={filters.countries}
    />

      <div className="max-w-full pt-4">
        <FadeIn>
          <ResourceCardGrid sortedData={data} filteredFeaturedData={null}>
            {search || category || label || tag || country || remote ? (
              <div className="md:mr-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  {/* ... (existing icon code) ... */}
                  {country && <GlobeIcon className="mr-1 bg-neutral-800 fill-green-300/30 stroke-green-500 size-6 p-1 rounded-full" />}
                  {remote && <BoxIcon className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-blue-500 size-6 p-1 rounded-full" />}
                  {search ? "search" : ""}
                  {category ? "category" : ""}
                  {label ? "label" : ""}
                  {tag ? "tag" : ""}
                  {country ? "country" : ""}
                  {remote ? "remote" : ""}
                </div>
                <GradientHeading size="xxl">
                  {search || category || label || tag || country || (remote ? "Remote" : "")}
                </GradientHeading>
              </div>
            ) : null}
          </ResourceCardGrid>
        </FadeIn>
      </div>
    </>
  )
}