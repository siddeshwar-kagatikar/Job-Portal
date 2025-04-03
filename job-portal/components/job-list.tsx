"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axios from "axios"
import { Loader2, Trash2, AlertCircle, Edit } from "lucide-react"

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get("http://localhost:8080/jobs")
      setJobs(response.data)
    } catch (err) {
      setError("Failed to fetch jobs")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await axios.delete(`http://localhost:8080/jobs/${id}`)
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id))
    } catch (err) {
      alert("Failed to delete job")
    }
  }

  const updateJob = async () => {
    if (!editingJob) return

    try {
      await axios.put(`http://localhost:8080/jobs/${editingJob.id}`, editingJob)
      setJobs((prevJobs) => prevJobs.map((job) => (job.id === editingJob.id ? editingJob : job)))
      setEditingJob(null)
    } catch (err) {
      alert("Failed to update job")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">No Jobs Available</h2>
        <p className="text-muted-foreground">Please add jobs to see them listed here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Job Listings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Min Salary</TableHead>
            <TableHead>Max Salary</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.id}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>${job.minSalary.toLocaleString()}</TableCell>
              <TableCell>${job.maxSalary.toLocaleString()}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Job Modal */}
      {editingJob && (
        <Dialog open={true} onOpenChange={() => setEditingJob(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editingJob.title}
                onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                placeholder="Job Title"
              />
              <Input
                value={editingJob.description}
                onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                placeholder="Description"
              />
              <Input
                type="number"
                value={editingJob.minSalary}
                onChange={(e) => setEditingJob({ ...editingJob, minSalary: Number(e.target.value) })}
                placeholder="Min Salary"
              />
              <Input
                type="number"
                value={editingJob.maxSalary}
                onChange={(e) => setEditingJob({ ...editingJob, maxSalary: Number(e.target.value) })}
                placeholder="Max Salary"
              />
              <Input
                value={editingJob.location}
                onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
              <Button onClick={updateJob}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
