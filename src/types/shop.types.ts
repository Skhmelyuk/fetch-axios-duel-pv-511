export interface ProductDTO {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface CreateProductPayload {
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface RequestLogEntry {
  id: string
  time: string
  status: "info" | "success" | "abort" | "error"
  message: string
}

export interface ReviewDTO {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface CreateReviewPayload {
  postId: number
  name: string
  email: string
  body: string
}
