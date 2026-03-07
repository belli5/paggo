"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, Settings, User } from "lucide-react"
import Image from "next/image"
import { useAuthUser } from "@/hooks/use-auth-user"

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Documentos",
    href: "/documents",
    icon: FileText,
  },
]

const bottomItems = [
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthUser()

  return (
    <aside className="flex h-screen w-72 flex-col justify-between bg-black px-4 py-6 text-white">
        <div>
            <div className="mb-10 flex items-center gap-3 px-2">
            <div className="relative mb-6 flex h-22 w-22 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-2">
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

            <nav className="space-y-2">
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
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-4">

            {/* Card do usuário */}
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                <User size={18} />
                </div>

                <div>
                <p className="text-sm font-semibold text-white">
                    {user?.email ?? "Usuário"}
                </p>
                <p className="text-xs text-zinc-400">
                    {user?.email ?? "email@exemplo.com"}
                </p>
                </div>
            </div>

            {/* Configurações */}
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
            </nav>

        </div>
    </aside>
  )
}