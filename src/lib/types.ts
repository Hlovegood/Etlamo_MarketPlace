export type Role = 'client' | 'planner' | 'admin'
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected'

export interface VerificationApplication {
  business: string
  location: string
  yearsExp: number
  specialties: string[]
  website: string
  bio: string
  licenseNumber: string
  idFileName: string
  insuranceFileName: string
  referenceName: string
  referenceContact: string
  submittedAt: number
  reviewedAt?: number
  rejectionReason?: string
}

export interface User {
  id: string
  role: Role
  name: string
  email: string
  password: string
  avatar?: string
  location: string
  createdAt: number
  bio?: string
  // planner-only
  business?: string
  specialties?: string[]
  yearsExp?: number
  priceFrom?: number
  website?: string
  verification?: VerificationStatus
  application?: VerificationApplication
  /** seeded accounts reply automatically so the demo feels alive */
  demoPersona?: boolean
}

export interface Project {
  id: string
  plannerId: string
  title: string
  category: string
  location: string
  date: string
  guests: number
  description: string
  images: string[]
  tags: string[]
  likedBy: string[]
  baseLikes: number
  views: number
  createdAt: number
}

export interface EventRequest {
  id: string
  clientId: string
  title: string
  type: string
  date: string
  location: string
  guests: number
  budget: string
  description: string
  needs: string[]
  status: 'open' | 'closed'
  createdAt: number
}

export interface Thread {
  id: string
  clientId: string
  plannerId: string
  requestId?: string
  projectId?: string
  updatedAt: number
  lastRead: Record<string, number>
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  text: string
  createdAt: number
}

export interface DB {
  users: User[]
  projects: Project[]
  requests: EventRequest[]
  threads: Thread[]
  messages: Message[]
}
