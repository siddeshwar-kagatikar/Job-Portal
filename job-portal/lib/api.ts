import axios from "axios"
import type { Job, Employee, Review, ApiError } from "./types"

// Base URL for the API
const API_BASE_URL = "http://localhost:8080/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Error handler helper
const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
      errors: error.response.data.errors,
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      status: 0,
      message: "No response from server. Please check your connection.",
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: 0,
      message: error.message || "An unknown error occurred",
    }
  }
}

// Jobs API
export const jobsApi = {
  getAll: async (): Promise<Job[]> => {
    try {
      const response = await api.get("/jobs")
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  getById: async (id: number): Promise<Job> => {
    try {
      const response = await api.get(`/jobs/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  create: async (job: Omit<Job, "id">): Promise<Job> => {
    try {
      const response = await api.post("/jobs", job)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// Employees API
export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    try {
      const response = await api.get("/employees")
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  getById: async (id: number): Promise<Employee> => {
    try {
      const response = await api.get(`/employees/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  create: async (employee: Omit<Employee, "id">): Promise<Employee> => {
    try {
      const response = await api.post("/employees", employee)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  getJobsByEmployeeId: async (id: number): Promise<Job[]> => {
    try {
      const response = await api.get(`/employees/${id}/jobs`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

// Reviews API
export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    try {
      const response = await api.get("/reviews")
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  getByJobId: async (jobId: number): Promise<Review[]> => {
    try {
      const response = await api.get(`/jobs/${jobId}/reviews`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  create: async (review: Omit<Review, "id">): Promise<Review> => {
    try {
      const response = await api.post("/reviews", review)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  canEmployeeReviewJob: async (employeeId: number, jobId: number): Promise<boolean> => {
    try {
      const response = await api.get(`/employees/${employeeId}/can-review/${jobId}`)
      return response.data
    } catch (error) {
      return false
    }
  },
}

