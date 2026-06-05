// Common Types
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  images?: string[]
  technologies: string[]
  category: 'design' | 'web' | 'mobile' | 'branding'
  link?: string
  github?: string
  featured?: boolean
  date: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  date: string
  image?: string
  readTime: number
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'expert'
  percentage?: number
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: string
  endDate?: string
  current?: boolean
  technologies?: string[]
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface SocialLink {
  name: string
  url: string
  icon?: string
}
