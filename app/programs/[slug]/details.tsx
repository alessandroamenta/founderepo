"use client"

import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Blocks,
  ExternalLink,
} from "lucide-react"
import { ReviewBentoGrid } from '@/components/review-bento-grid'
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { ReviewForm } from "@/app/submit/reviewForm"
import { ReviewCard } from "@/components/review-card"

interface Product {
  id: string
  created_at: string
  program_name: string
  website: string
  program_type: string | null
  financial_support: string | null
  program_length: string | null
  location: string | null
  focus_area: string | null
  target_stage: string[]
  punchline: string | null
  description: string | null
  logo_src: string | null
  user_id: string
  view_count: number
  approved: boolean
  featured: boolean
}

interface Review {
  id: string
  reviewer_name: string
  experience: string
  created_at: string
}

export const ProductDetails = ({ product, reviews }: { product: Product, reviews: Review[] }) => (
  <div className={cn("py-4 relative flex flex-col h-full")}>
    <div className="w-full gap-8 py-6 relative items-center">
      <div className="grid grid-cols-6 md:grid-cols-12 gap-8 w-full">
          <div className="space-y-6 col-span-6 md:col-span-5 md:mt-12 z-10">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Programs</BreadcrumbLink>/
                <BreadcrumbLink href={`/programs/${product.id}`}>
                  {product.program_name.substring(0, 20)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <CardTitle className="text-6xl tracking-tighter font-extrabold text-neutral-900 dark:text-neutral-200">
              {product.punchline || product.program_name}
            </CardTitle>
            {product.program_type && (
              <CardDescription className="md:text-xl text-lg tracking-tight text-neutral-800 text-balance dark:text-neutral-400 flex gap-2 items-center ">
                <Blocks className="stroke-1 size-8" />{" "}
                <span className="flex-wrap">{product.program_type}</span>
              </CardDescription>
            )}

            <Link
              href={`/programs`}
              className="py-4 md:flex items-center text-2xl font-semibold text-yellow-500  z-10 hidden"
            >
              <ArrowLeft className="mr-2" /> Back to all programs
            </Link>
          </div>

          <div
            className={cn(
              "w-full col-span-7 p-3 md:p-7 rounded-[36px] md:rounded-[58px] border border-black/10 space-y-10",
              "bg-white dark:bg-[#1E1E1E]  shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]"
            )}
          >
          {product.logo_src && (
            <div className="w-full aspect-[37/18] p-1 md:p-2 rounded-[26px] md:rounded-[34px] bg-[#3d3d3d] overflow-hidden">
              <img
                className="w-full h-full rounded-[22px] md:rounded-[30px] object-cover object-center"
                src={product.logo_src}
                alt={`${product.program_name} image`}
              />
            </div>
            )}
            {product.description && (
              <CardDescription className="text-2xl tracking-tight leading-tight text-neutral-800 text-balance dark:text-neutral-400">
                {product.description}
              </CardDescription>
            )}

            <div className="space-y-4">
              {product.financial_support && (
                <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
                  <strong>Financial Support:</strong> {product.financial_support}
                </CardDescription>
              )}
              {product.program_length && (
                <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
                  <strong>Program Length:</strong> {product.program_length}
                </CardDescription>
              )}
              {product.location && (
                <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
                  <strong>Location:</strong> {product.location}
                </CardDescription>
              )}
              {product.focus_area && (
                <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
                  <strong>Focus Area:</strong> {product.focus_area}
                </CardDescription>
              )}
              {product.target_stage && product.target_stage.length > 0 && (
                <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
                  <strong>Target Stage:</strong> {product.target_stage.join(", ")}
                </CardDescription>
              )}
            </div>

            {product.website && (
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full flex items-center justify-center py-6 text-lg rounded-[44px]"
              >
                <a
                  href={product.website}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="font-semibold">Check out site</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Link
      href={`/`}
      className="py-4 md:hidden items-center text-2xl font-semibold text-yellow-500  z-10 w-full flex"
    >
      <ArrowLeft className="mr-2" /> Back to all programs
    </Link>
    
    {/* Reviews section */}
    {reviews && reviews.length > 0 && (
  <div className="mt-12 space-y-6">
    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-200">Founder Experiences/Reviews</h2>
    <ReviewBentoGrid reviews={reviews} />
  </div>
)}

    
    <ReviewForm productId={product.id} programName={product.program_name} />
    <div className="absolute top-36 md:top-0 left-[-10%] right-0 h-[400px] w-[300px]  md:h-[500px] md:w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,235,59,.15),rgba(255,255,255,0))]"></div>
  </div>
)