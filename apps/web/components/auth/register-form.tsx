"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRegister } from "@/hooks/use-register"

export default function RegisterForm() {
  const router = useRouter()
  const { register, loading, error } = useRegister()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLocalError("")

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.")
      return
    }

    const result = await register({
      email,
      password,
    })

    if (result) {
      router.push("/chat")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-500">Criar conta</p>
        <h1 className="text-3xl font-bold text-zinc-900">Cadastrar na plataforma</h1>
        <p className="text-sm text-zinc-500">
          Preencha os dados para acessar o sistema.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-black"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-zinc-700"
          >
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm outline-none transition focus:border-black"
            required
          />
        </div>
      </div>

      {(localError || error) && (
        <p className="text-sm text-red-600">{localError || error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Já possui conta?{" "}
        <Link href="/" className="font-semibold text-black hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}