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

export type RegisterPayload = {
  email: string
  password: string
}

export type RegisterResponse = {
  message: string
  user: {
    id: string
    email: string
    createdAt: string
    updatedAt: string
  }
  access_token: string
}