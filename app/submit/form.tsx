"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUploader } from "@/components/cult/file-drop"
import { GradientHeading } from "@/components/cult/gradient-heading"

import { StyledButton } from "../login/submit-button"
import { onSubmitToolAction } from "./action"
import { schema } from "./schema"

// To trigger async toast
const p = () => new Promise((resolve) => setTimeout(() => resolve(""), 900))

const programTypes = [
  { label: "Accelerator", value: "accelerator" },
  { label: "Incubator", value: "incubator" },
  { label: "Venture builders/startup studio", value: "venture_builders_startup_studio" },
  { label: "Fellowships/Grants", value: "fellowships_grants" },
  { label: "Other", value: "other" },
]

const targetStages = [
  { label: "Day 0", value: "ideation_stage" },
  { label: "Pre-Seed", value: "pre_seed" },
  { label: "Pre-Seed to Seed", value: "pre-seed_to_seed" },
  { label: "Series A", value: "series_a" },
  { label: "Series B", value: "series_b" },
  { label: "Late-Stage", value: "late_stage" },
]

export const SubmitTool = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [state, formAction] = useFormState(onSubmitToolAction, {
    message: "",
    issues: [],
  })

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      programName: "",
      website: "",
      programType: "",
      financialSupport: "",
      programLength: "",
      location: "",
      focusArea: "",
      targetStage: [],
      punchline: "",
      description: "",
      images: [],
      logo_src: "",
      ...(state?.fields ?? {}),
    },
  })

  const { isValid } = form.formState

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message && state.issues.length < 1) {
      toast.success(state.message)
    } else if (state.issues.length >= 1) {
      toast.error(state.issues.join(", "))
      setLoading(false)
    }
    setLoading(false)
  }, [state.message, state.issues])

  return (
    <Form {...form}>
      {state?.issues && (
        <div className="text-red-500">
          <ul>
            {state.issues.map((issue) => (
              <li key={issue} className="flex gap-1">
                <X fill="red" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        ref={formRef}
        className="space-y-8"
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault()
          setLoading(true)
          toast.promise(p, { loading: "Submitting..." })
          form.handleSubmit(async (data) => {
            let formData = new FormData(formRef.current!)
            const logoFile = form.getValues("images")
            if (logoFile.length > 0) {
              formData.set("images", logoFile[0])
            }
            setLoading(false)
            await formAction(formData)
            router.push("/")
          })(evt)
        }}
      >
        <GradientHeading size="xs">
          Tell us about your program
        </GradientHeading>
        <FormField
          control={form.control}
          name="programName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of the program</FormLabel>
              <FormControl>
                <Input placeholder="YC, Techstars, Plug and Play..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.ycombinator.com/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="programType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of program</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="financialSupport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial support</FormLabel>
              <FormControl>
                <Input placeholder="YC does 500k at 7% equity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="programLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program length</FormLabel>
              <FormControl>
                <Input placeholder="3 months for YC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="If in person where? Is remote also..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="focusArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus area</FormLabel>
              <FormControl>
                <Input placeholder="AI, climate tech, tech in general" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<FormField
  control={form.control}
  name="targetStage"
  render={() => (
    <FormItem>
      <FormLabel>Target stage</FormLabel>
      <div className="space-y-2">
        {targetStages.map((stage) => (
          <FormField
            key={stage.value}
            control={form.control}
            name="targetStage"
            render={({ field }) => {
              return (
                <FormItem
                  key={stage.value}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(stage.value) ?? false}
                      onCheckedChange={(checked) => {
                        const updatedValue = field.value ?? [];
                        return checked
                          ? field.onChange([...updatedValue, stage.value])
                          : field.onChange(
                              updatedValue.filter(
                                (value) => value !== stage.value
                              )
                            )
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {stage.label}
                  </FormLabel>
                </FormItem>
              )
            }}
          />
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
        <FormField
          control={form.control}
          name="punchline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programs's punchline (&lt;10 words)</FormLabel>
              <FormControl>
                <Input placeholder="Program's punchline" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>A short description here (~70 words)</FormLabel>
              <FormControl>
                <Input placeholder="A short description here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Logo file (.jpg or .png format, 128x128)</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

      <StyledButton 
        type="submit"
      >
        Submit
      </StyledButton>
      </form>
    </Form>
  )
}

export default SubmitTool