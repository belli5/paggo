import RegisterForm from "@/components/auth/register-form"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Lado esquerdo - Cadastro */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          <RegisterForm />
        </div>
      </section>

      {/* Lado direito - Área visual */}
      <section className="hidden lg:flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950 via-black to-zinc-900" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
          <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-4">
            <Image
              src="/logo-removebg-preview.png"
              alt="Logo Paggo"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-white">Paggo OCR</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
            Plataforma para upload, leitura e análise inteligente de documentos.
          </p>
        </div>
      </section>
    </main>
  )
}