"use client"

import React, { useState } from "react"
import { PlusIcon, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useFormState } from "react-dom"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitReview, ReviewFormState } from "@/app/actions/review"

const formSchema = z.object({
  reviewerName: z.string().min(1, "Name is required"),
  reviewerEmail: z.string().email("Invalid email address"),
  programYear: z.number().int().min(1900).max(new Date().getFullYear()),
  experience: z.string().min(1, "Experience is required"),
  proof: z.string().min(1, "Proof is required"),
})

export const ReviewForm = ({ productId, programName }: { productId: string, programName: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useFormState<ReviewFormState, FormData>(submitReview, {
    message: "",
    issues: [],
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewerName: "",
      reviewerEmail: "",
      programYear: new Date().getFullYear(),
      experience: "",
      proof: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    formData.append("productId", productId)
    formData.append("programName", programName)
    formData.append("reviewerName", values.reviewerName)
    formData.append("reviewerEmail", values.reviewerEmail)
    formData.append("programYear", values.programYear.toString())
    formData.append("experience", values.experience)
    formData.append("proof", values.proof)

    await formAction(formData)
    if (state.issues.length === 0) {
      setIsOpen(false)
      form.reset()
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        className="fixed bottom-4 left-4 flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="size-4 mr-1" /> Been through this? Share your experience!
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
            </Button>
            <h2 className="text-2xl font-bold mb-4">Share Your Startup Program Journey! 🚀</h2>
            <p className="mb-4 text-sm">
              Ahoy founder! Thanks for helping out the startup community. Your insights are super valuable for aspiring entrepreneurs starting out. We appreciate your contribution! :)
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="reviewerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year you went through the program</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What was your experience like?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="The good, the bad, the awesome - anything that you believe is useful for future founders to know about this program!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quick proof showing you were part of the program</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., LinkedIn, online mention, anything"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </Form>
            {state.issues.length > 0 && (
              <div className="mt-4 text-red-500">
                {state.issues.map((issue, index) => (
                  <p key={index}>{issue}</p>
                ))}
              </div>
            )}
            {state.message && <p className="mt-4 text-green-500">{state.message}</p>}
          </div>
        </div>
      )}
    </>
  )
}