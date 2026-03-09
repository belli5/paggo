"use client"

import Sidebar from "@/components/layout/sidebar"
import { FileText, Brain, BarChart3, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const documentsPerMonth = [
  { month: "Jan", docs: 20 },
  { month: "Fev", docs: 35 },
  { month: "Mar", docs: 28 },
  { month: "Abr", docs: 50 },
  { month: "Mai", docs: 45 },
]

const fileTypes = [
  { name: "PDF", value: 60 },
  { name: "JPG", value: 25 },
  { name: "PNG", value: 15 },
]

const COLORS = ["#000000", "#555555", "#999999"]

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar
        onSelectDocument={() => {}}
        selectedDocumentId={undefined}
      />

      <section className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-600">
            Visão ilustrativa de métricas da plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-zinc-700" />
              <span className="text-sm text-zinc-500">Documentos</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">128</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-zinc-700" />
              <span className="text-sm text-zinc-500">Resumos</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">86</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-zinc-700" />
              <span className="text-sm text-zinc-500">Tempo médio</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">12s</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-zinc-700" />
              <span className="text-sm text-zinc-500">Precisão</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">94%</h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">
              Documentos processados por mês
            </h3>

            <div className="overflow-x-auto">
              <BarChart width={500} height={250} data={documentsPerMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="docs" fill="#000000" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">
              Tipos de arquivos enviados
            </h3>

            <div className="flex justify-center">
              <PieChart width={400} height={250}>
                <Pie
                  data={fileTypes}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {fileTypes.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-zinc-900">
            Últimas análises
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-sm text-zinc-700">invoice-marco.pdf</span>
              <span className="text-sm font-medium text-green-600">
                Processado
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-sm text-zinc-700">nota-fiscal.jpg</span>
              <span className="text-sm font-medium text-yellow-600">
                Em análise
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className="text-sm text-zinc-700">contrato.pdf</span>
              <span className="text-sm font-medium text-green-600">
                Processado
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}