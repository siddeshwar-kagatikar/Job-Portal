export interface Job {
  id: number
  title: string
  description: string
  location: string
  salary: number
  company: string
  requirements: string
}

export interface Employee {
  id: number
  name: string
  email: string
  skills: string
  jobId: number
}

export interface Review {
  id: number
  jobId: number
  employeeId: number
  rating: number
  text: string
  employeeName?: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string>
}

