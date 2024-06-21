import React from "react"
import Link from "next/link"
import { PlusIcon, Twitter } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "./ui/button"
import { NextIcon, SupabaseIcon } from "./ui/icons"
import Script from 'next/script';

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center md:items-start md:px-2 justify-center gap-2 md:ml-12">
      <div className="flex items-center space-x-2">
        <h1 className="text-5xl font-black text-left">Founderepo</h1>

      </div>
      <div className="flex flex-col items-center md:items-start md:mt-4">
        <Badge className="hidden md:block" variant="default">
          A way for aspiring founders to get started
        </Badge>
        <div className="flex w-full items-center mt-2 justify-center md:justify-start">
          <span className="mx-2 text-xl font-bold text-left">
            Directory of all the startup programs out there.
          </span>
        </div>
        <p className="mt-2 text-center md:text-left text-muted-foreground text-sm md:text-base px-2">
          We help founders who are starting out to get into the startup bubbe. Fast.
        </p>
      </div>
      <div className="flex mt-4 mb-4 space-x-4">
        <Button variant="secondary" asChild>
          <Link href="#tally-open=mD1o7X&tally-emoji-text=👋&tally-emoji-animation=tada" className="flex items-center text-black">
            <PlusIcon className="size-4 mr-1" /> Submit tool
          </Link>
        </Button>
        <a
          href="https://x.com/nolansym"
          target="_blank"
          rel="noreferrer"
          className="flex items-center"
        >
          <Twitter className="size-4 mr-1" />
          updates
        </a>
      </div>
      {children}
      <script async src="https://tally.so/widgets/embed.js"></script>
    </div>
  )
}
