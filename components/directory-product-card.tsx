"use client"

import { useOptimistic } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PersonStanding, Tag, View } from "lucide-react"

import { cn } from "@/lib/utils"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/cult/minimal-card"
import { incrementClickCount } from "@/app/actions/product"

export const getBasePath = (url: string) => {
  return new URL(url).hostname.replace("www.", "").split(".")[0]
}

export const getLastPathSegment = (url: string, maxLength: number): string => {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments.pop() || ""

    if (lastSegment.length > maxLength) {
      return `/${lastSegment.substring(0, maxLength)}`
    }

    return lastSegment ? `/${lastSegment}` : ""
  } catch (error) {
    console.error("Invalid URL:", error)
    return ""
  }
}

interface Product {
  id: string
  created_at: string
  program_name: string
  website: string
  program_type: string
  financial_support: string
  program_length: string
  location: string
  focus_area: string
  target_stage: string[]
  punchline: string
  description: string
  logo_src: string
  user_id: string
  tags: string[]
  view_count: number
  approved: boolean
  labels: string[]
}

export const ResourceCard: React.FC<{
  trim?: boolean
  data: Product
  order: any
}> = ({ trim, data, order }) => {
  const [optimisticResource, addOptimisticUpdate] = useOptimistic<
    Product,
    Partial<Product>
  >(data, (currentResource, newProperties) => {
    return { ...currentResource, ...newProperties }
  })

  const handleClick = () => {
    const newClickCount = (optimisticResource.view_count || 0) + 1
    addOptimisticUpdate({ view_count: newClickCount })
    incrementClickCount(data.id)
  }

  return (
    <motion.div
      key={`resource-card-${data.id}-${order}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative break-inside-avoid w-full"
    >
      <Link
        href={`/products/${data.id}`}
        key={`/products/${data.id}`}
        className=""
        onClick={handleClick}
      >
        <div className="w-full">
          <MinimalCard
            className={cn(
              optimisticResource.view_count > 350
                ? "text-neutral-900 hover:bg-[#666BFA]"
                : "",
              "w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
            )}
          >
            {data.logo_src ? (
              <div className="overflow-hidden rounded-t-lg">
                <MinimalCardImage 
                  alt={data.program_name} 
                  src={data.logo_src} 
                  className="transition-all duration-300 ease-in-out group-hover:brightness-110 group-hover:scale-[1.03] hover:brightness-125 hover:scale-[1.05]"
                />
              </div>
            ) : null}

            <MinimalCardTitle
              className={cn(
                "font-semibold mb-0.5",
                optimisticResource.view_count > 100 ? "text-neutral-800" : ""
              )}
            >
              {data.program_name.substring(0, 30)}
            </MinimalCardTitle>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs leading-3 mb-2 text-neutral-500"
            >
              {getLastPathSegment(data.website, 10)}
            </motion.p>
            <MinimalCardDescription
              className={cn(
                "text-sm",
                optimisticResource.view_count > 100 ? "text-neutral-700" : ""
              )}
            >
              {trim ? `${data.description.slice(0, 82)}...` : data.description}
            </MinimalCardDescription>

            <MinimalCardContent>
              <div className="flex flex-wrap gap-1 mt-2">
                {data.target_stage.map((stage, index) => (
                  <span key={`stage-${index}`} className="text-xs bg-gray-200 text-black rounded-full px-2 py-1">
                    🚀 {stage}
                  </span>
                ))}
                {data.program_length && (
                  <span className="text-xs bg-gray-200 text-black rounded-full px-2 py-1">
                    ⏳ {data.program_length}
                  </span>
                )}
                {data.financial_support && (
                  <span className="text-xs bg-gray-200 text-black rounded-full px-2 py-1">
                    💰 {data.financial_support}
                  </span>
                )}
                {data.location && (
                  <span className="text-xs bg-gray-200 text-black rounded-full px-2 py-1">
                    📍 {data.location}
                  </span>
                )}
              </div>
            </MinimalCardContent>

            <MinimalCardFooter>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs text-neutral-500">{data.program_type}</span>
                <div
                  className={cn(
                    "p-1 py-1.5 px-1.5 rounded-md text-neutral-500 flex items-center gap-1",
                    optimisticResource.view_count > 100 ? "text-neutral-800" : ""
                  )}
                >
                  <p className="flex items-center gap-1 tracking-tight text-neutral pr-1 text-xs">
                    {optimisticResource.view_count || data.view_count}
                  </p>
                </div>
              </div>
            </MinimalCardFooter>
          </MinimalCard>
        </div>
      </Link>
    </motion.div>
  )
}