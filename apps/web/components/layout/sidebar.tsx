"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, Settings, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useAuthUser } from "@/hooks/use-auth-user"
import { useHistoryDocuments } from "@/hooks/use-history-documents"
import { DocumentItem } from "@/types/historico"
import { useRouter } from "next/navigation"

type SidebarProps = {
  onSelectDocument: (document: DocumentItem) => void
  selectedDocumentId?: string
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
]

const bottomItems = [
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar({
  onSelectDocument,
  selectedDocumentId,
}: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthUser()
  const router = useRouter()

    function handleLogout() {
    localStorage.removeItem("user")
    localStorage.removeItem("token") // se você salvar token
    localStorage.clear() // opcional

    router.push("/")
    }

  const { documents, loading, error } = useHistoryDocuments({
    userId: user?.id,
  })

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col justify-between bg-black px-4 py-6 text-white">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="relative flex h-22 w-22 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
            <Image
              src="/logo-removebg-preview.png"
              alt="Logo Paggo"
              height={80}
              width={80}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-base font-semibold">Paggo OCR</h1>
            <p className="text-xs text-zinc-400">Painel interno</p>
          </div>
        </div>

        <nav className="mb-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-zinc-950/60 p-3">
          <div className="mb-3 flex items-center gap-2 px-1">
            <FileText size={16} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Histórico</h2>
          </div>

          <div className="space-y-2">
            {loading && (
              <p className="px-1 text-xs text-zinc-500">Carregando histórico...</p>
            )}

            {error && (
              <p className="px-1 text-xs text-red-400">{error}</p>
            )}

            {!loading && !error && documents.length === 0 && (
              <p className="px-1 text-xs text-zinc-500">
                Nenhum documento enviado ainda.
              </p>
            )}

            {!loading &&
              !error &&
              documents.map((doc) => {
                const isSelected = selectedDocumentId === doc.id

                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => onSelectDocument(doc)}
                    className={`block w-full rounded-xl border px-3 py-3 text-left transition ${
                      isSelected
                        ? "border-zinc-600 bg-zinc-800 text-white"
                        : "border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <p className="truncate text-sm font-medium">{doc.filename}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDate(doc.createdAt)}
                    </p>
                  </button>
                )
              })}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
            <User size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.email ?? "Usuário"}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {user?.email ?? "email@exemplo.com"}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-zinc-900 hover:text-red-300"
            >
            <LogOut size={18} />
            <span>Sair</span>
        </button>
        </nav>
      </div>
    </aside>
  )
}