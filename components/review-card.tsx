import React from 'react'
import { format } from 'date-fns'
import { CardDescription } from "@/components/ui/card"

interface ReviewCardProps {
  reviewerName: string
  experience: string
  createdAt: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ reviewerName, experience, createdAt }) => {
  return (
    <div className="w-full p-6 rounded-[36px] border border-black/10 space-y-4 bg-white dark:bg-[#1E1E1E] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)_inset,0_0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_-0.5px_0.5px_rgba(255,255,255,0.1)_inset,0_0.5px_1px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]">
      <CardDescription className="text-xl tracking-tight text-neutral-800 dark:text-neutral-400">
        {experience}
      </CardDescription>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          {reviewerName}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {format(new Date(createdAt), 'MMMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}