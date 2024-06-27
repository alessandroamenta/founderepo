import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="mt-2 w-full">
        <div
          className={cn(
            "relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-accent/20 before:opacity-0 before:ring-2 before:ring-neutral-100/40 before:transition dark:before:border-yellow-400/40 dark:before:ring-2 dark:before:ring-yellow-900/40",
            "textarea-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[10px] after:shadow-white/5 after:transition",
            "focus-within:before:opacity-100 focus-within:after:shadow-neutral-100/20 dark:after:shadow-white/5 dark:focus-within:after:shadow-yellow-500/30"
          )}
        >
          <textarea
            className={cn(
              "w-full text-base",
              "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-100 dark:focus:ring-neutral-900",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "textarea-shadow rounded-[10px] !outline-none",
              "relative border border-black/5 bg-white/90 py-3 px-4 shadow-black/5 placeholder:text-stone-400 focus:bg-white",
              "text-stone-800 dark:bg-neutral-800/70 dark:text-neutral-100 dark:shadow-black/10 dark:placeholder:text-stone-500",
              "min-h-[100px] resize-y",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }