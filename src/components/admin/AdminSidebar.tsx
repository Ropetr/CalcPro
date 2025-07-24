'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Calculator,
  Settings,
  BarChart3,
  FileText,
  Headphones
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Empresas', href: '/admin/empresas', icon: Building2 },
  { name: 'Usuários', href: '/admin/usuarios', icon: Users },
  { name: 'Assinaturas', href: '/admin/assinaturas', icon: CreditCard },
  { name: 'Calculadoras', href: '/admin/calculadoras', icon: Calculator },
  { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
  { name: 'Logs', href: '/admin/logs', icon: FileText },
  { name: 'Suporte', href: '/admin/suporte', icon: Headphones },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 pt-16">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <Calculator className="h-8 w-8 text-primary-400" />
            <span className="ml-2 text-xl font-bold text-white">CalcPro</span>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@calcpro.app.br</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}