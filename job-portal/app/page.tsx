"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobForm from "@/components/job-form"
import EmployeeForm from "@/components/employee-form"
import JobList from "@/components/job-list"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Job Portal</h1>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="job-listings">Job Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <JobForm />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeeForm />
        </TabsContent>

        <TabsContent value="job-listings" className="mt-6">
          <JobList />
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}

