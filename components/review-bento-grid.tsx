import React, { useState } from 'react'
import { format } from 'date-fns'
import { motion } from "framer-motion"
import { User } from 'lucide-react'
import Masonry from 'react-masonry-css'

import { cn } from "@/lib/utils"
import MinimalCard, {
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardTitle,
} from "@/components/cult/minimal-card"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  reviewer_name: string
  experience: string
  created_at: string
}

const ReviewCard: React.FC<Review> = ({ reviewer_name, experience, created_at }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <MinimalCard className="w-full h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] bg-white dark:bg-[#1E1E1E]">
        <MinimalCardTitle className="font-semibold mb-2 flex items-center text-neutral-900 dark:text-neutral-200">
          <User className="mr-2 h-4 w-4" />
          {reviewer_name}
        </MinimalCardTitle>
        <MinimalCardDescription className="text-sm text-neutral-800 dark:text-neutral-400">
          {experience}
        </MinimalCardDescription>
        <MinimalCardFooter>
          <span className="text-xs text-neutral-500 dark:text-neutral-500">
            {format(new Date(created_at), 'MMMM d, yyyy')}
          </span>
        </MinimalCardFooter>
      </MinimalCard>
    </motion.div>
  )
}

export const ReviewBentoGrid: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 9)

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="w-full mx-auto max-w-7xl bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="p-3">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding"
        >
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </Masonry>
        {reviews.length > 9 && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="text-neutral-800 dark:text-neutral-200"
            >
              {showAll ? "View Less" : "View All"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}