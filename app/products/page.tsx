import { ReactElement } from "react"
import { BoxIcon, Hash, Search, TagIcon, GlobeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FadeIn } from "@/components/cult/fade-in"
import { GradientHeading } from "@/components/cult/gradient-heading"
import { ResourceCardGrid } from "@/components/directory-card-grid"
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

  // Function to get the country info from its code
  const getCountryInfo = (code: string) => {
    const countryObj = filters.countries.find(c => c.code === code)
    return countryObj ? { name: countryObj.name, flag: countryObj.flag } : { name: code, flag: '' }
  }

  // Construct the filter description
  let filterDescription = ""
  let countryFlag = ""
  if (category) {
    filterDescription += category
  }
  if (country) {
    const countryInfo = getCountryInfo(country)
    filterDescription += category ? ` in ${countryInfo.name}` : countryInfo.name
    countryFlag = countryInfo.flag
  }
  if (remote === "true") {
    filterDescription += filterDescription ? " (Remote)" : "Remote"
  }

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
            {filterDescription ? (
              <div className="md:mr-auto mx-auto flex flex-col items-center md:items-start">
                <div className="flex mb-1 justify-center md:justify-start">
                  {category && <BoxIcon className="mr-1 bg-neutral-800 fill-yellow-300/30 stroke-yellow-500 size-6 p-1 rounded-full" />}
                  {country && <GlobeIcon className="mr-1 bg-neutral-800 fill-green-300/30 stroke-green-500 size-6 p-1 rounded-full" />}
                  {remote === "true" && <BoxIcon className="mr-1 bg-neutral-800 fill-blue-300/30 stroke-blue-500 size-6 p-1 rounded-full" />}
                </div>
                <GradientHeading size="lg" className="flex items-center">
                {filterDescription}
                {countryFlag && (
                  <span className="ml-2 text-2xl" style={{ color: 'initial' }}>
                    {countryFlag}
                  </span>
                )}
              </GradientHeading>
              </div>
            ) : null}
          </ResourceCardGrid>
        </FadeIn>
      </div>
    </>
  )
}