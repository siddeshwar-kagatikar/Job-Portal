"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios" // Import Axios for API calls
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JobForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    companyId: "", // Updated for company object
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.location || !formData.minSalary || !formData.maxSalary || !formData.companyId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        minSalary: parseFloat(formData.minSalary),
        maxSalary: parseFloat(formData.maxSalary),
        company: { id: parseInt(formData.companyId) },
      }

      await axios.post("http://localhost:8080/jobs", jobData)

      setFormData({
        title: "",
        description: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        companyId: "",
      })

      toast({
        title: "Success",
        description: "Job has been added successfully",
      })
    } catch (err) {
      setError(err)
      toast({
        title: "Error",
        description: "Failed to add job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Job</CardTitle>
        <CardDescription>Enter the details for a new job posting</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId">Company ID *</Label>
            <Input id="companyId" name="companyId" value={formData.companyId} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary (USD) *</Label>
              <Input id="minSalary" name="minSalary" type="number" value={formData.minSalary} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (USD) *</Label>
              <Input id="maxSalary" name="maxSalary" type="number" value={formData.maxSalary} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Job"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
