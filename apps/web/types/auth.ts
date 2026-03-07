export type User = {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  user: User
  access_token: string
}