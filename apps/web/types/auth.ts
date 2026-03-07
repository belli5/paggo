export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  user: {
    id: string
    email: string
    createdAt: string
    updatedAt: string
  }
  access_token: string
}