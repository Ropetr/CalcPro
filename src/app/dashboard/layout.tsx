'use client'

import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  BarChart3, 
  Settings, 
  User,
  LogOut,
  Menu,
  X,
  FolderOpen,
  Code2
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getSubscriptionStatus } from '@/lib/auth'
import ProtectedRoute from '@/components/ProtectedRoute'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projetos', href: '/dashboard/projetos', icon: FolderOpen },
  { name: 'Calculadoras', href: '/dashboard/calculadoras', icon: Calculator },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: FileText },
  { name: 'Análises', href: '/dashboard/analises', icon: BarChart3 },
  { name: 'Estrutura do Projeto', href: '/dashboard/estrutura-projeto', icon: Code2 },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  
  const subscriptionInfo = user ? getSubscriptionStatus(user) : null

  return (
    <ProtectedRoute>
    <div className="client-dashboard min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/dashboard" className="flex items-center ml-4 md:ml-0">
              <img 
                src="/logo-horizontal.png" 
                alt="CalcPro" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.company}</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-gray-200">
          <div className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  subscriptionInfo?.status === 'trial' ? 'bg-yellow-400' : 
                  subscriptionInfo?.status === 'expired' ? 'bg-red-400' : 'bg-green-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {user?.subscription.plan === 'trial' ? 'Teste Gratuito' : 
                   user?.subscription.plan === 'basic' ? 'Plano Básico' :
                   user?.subscription.plan === 'pro' ? 'Plano Pro' : 'Plano Enterprise'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {subscriptionInfo?.message}
              </p>
              <Link 
                href="/dashboard/plano" 
                className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
              >
                Gerenciar plano →
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}