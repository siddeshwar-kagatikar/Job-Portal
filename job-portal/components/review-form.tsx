"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee, Review, ApiError } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { StarIcon, Loader2, AlertCircle } from "lucide-react"
import { employeesApi, reviewsApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReviewFormProps {
  jobId: number
  onSubmit: (review: Review) => void
  onCancel: () => void
}

export default function ReviewForm({ jobId, onSubmit, onCancel }: ReviewFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    employeeId: "",
    rating: 5,
    text: "",
  })
  const [eligibleEmployees, setEligibleEmployees] = useState<Employee[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchEligibleEmployees = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get all employees assigned to this job
        const employees = await employeesApi.getAll()
        const jobEmployees = employees.filter((emp) => emp.jobId === jobId)

        // Filter out employees who have already reviewed this job
        const eligibleEmps = []
        for (const emp of jobEmployees) {
          const canReview = await reviewsApi.canEmployeeReviewJob(emp.id, jobId)
          if (canReview) {
            eligibleEmps.push(emp)
          }
        }

        setEligibleEmployees(eligibleEmps)
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEligibleEmployees()
  }, [jobId])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleEmployeeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, employeeId: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.employeeId || !formData.text) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newReview = await reviewsApi.create({
        jobId,
        employeeId: Number.parseInt(formData.employeeId),
        rating: formData.rating,
        text: formData.text,
      })

      toast({
        title: "Success",
        description: "Review has been submitted successfully",
      })

      onSubmit(newReview)
    } catch (err) {
      const apiError = err as ApiError

      toast({
        title: "Error",
        description: apiError.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading eligible employees...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (eligibleEmployees.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-3 border rounded-md">
        No eligible employees to review this job. Employees can only review jobs they are assigned to, and only once.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Employee *</label>
        <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {eligibleEmployees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
              <StarIcon
                className={`h-6 w-6 ${star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Review Text *</label>
        <Textarea
          value={formData.text}
          onChange={handleTextChange}
          placeholder="Write your review..."
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  )
}

