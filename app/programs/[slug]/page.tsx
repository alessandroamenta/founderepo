import { notFound } from "next/navigation"
import { FadeIn } from "@/components/cult/fade-in"
import { getProductById } from "@/app/actions/product"
import { getReviewsForProduct } from "@/app/actions/review"
import { ProductDetails } from "./details"

const ProductIdPage = async ({ params }: { params: { slug: string } }) => {
  let data = await getProductById(params.slug)

  if (!data || data.length === 0) {
    notFound()
  }

  const reviews = await getReviewsForProduct(params.slug)

  return (
    <>
      <div className="z-10">
        <div className="py-4 w-full relative mx-auto max-w-6xl">
          <FadeIn>
            <ProductDetails product={data[0]} reviews={reviews} />
          </FadeIn>
        </div>
      </div>
    </>
  )
}

export default ProductIdPage