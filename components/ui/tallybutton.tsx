import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import Link from "next/link"


export function TallyButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full"
      asChild
    >
      <Link href="#tally-open=mVlgpl&tally-layout=modal&tally-emoji-text=👋&tally-emoji-animation=wave">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Open Tally form</span>
        </div>
      </Link>
    </Button>
  )
}