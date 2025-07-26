'use client'

import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  FileText,
  Building2,
  Activity,
  BarChart3,
  ArrowUpRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import VerificationBanner from '@/components/VerificationBanner'

const stats = [
  {
    name: 'Cálculos Este Mês',
    value: '47',
    change: '+23%',
    changeType: 'positive',
    icon: Calculator,
  },
  {
    name: 'Projetos Ativos',
    value: '12',
    change: '+8%',
    changeType: 'positive',
    icon: Building2,
  },
  {
    name: 'Economia Estimada',
    value: 'R$ 3.240',
    change: '+15%',
    changeType: 'positive',
    icon: TrendingUp,
  },
  {
    name: 'Tempo Economizado',
    value: '24h',
    change: '+12%',
    changeType: 'positive',
    icon: Clock,
  },
]

const recentCalculations = [
  {
    id: 1,
    type: 'Divisória Drywall',
    project: 'Escritório ABC - Sala 204',
    area: '45m²',
    materials: 'Perfis, Placas, Massa',
    time: '2 horas atrás',
    cost: 'R$ 1.240,00',
  },
  {
    id: 2,
    type: 'Forro Drywall',
    project: 'Loja XYZ - Área Principal',
    area: '120m²',
    materials: 'Perfis, Placas, Parafusos',
    time: '1 dia atrás',
    cost: 'R$ 2.890,00',
  },
  {
    id: 3,
    type: 'Piso Laminado',
    project: 'Residência Silva - Quarto',
    area: '16m²',
    materials: 'Laminado, Manta, Rodapé',
    time: '2 dias atrás',
    cost: 'R$ 980,00',
  },
]

const quickActions = [
  {
    name: 'Nova Calculadora',
    description: 'Iniciar novo cálculo',
    href: '/dashboard/calculadoras',
    icon: Calculator,
    color: 'bg-primary-100 text-primary-600',
  },
  {
    name: 'Ver Relatórios',
    description: 'Análises detalhadas',
    href: '/dashboard/relatorios',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Análise de Custos',
    description: 'Comparar preços',
    href: '/dashboard/analises',
    icon: BarChart3,
    color: 'bg-purple-100 text-purple-600',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <VerificationBanner />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, {user?.name?.split(' ')[0] || 'Usuário'}!</h1>
        <p className="text-gray-600">Acompanhe seus projetos e economize tempo com nossas calculadoras</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Calculations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Cálculos Recentes</h3>
                <a href="/dashboard/relatorios" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Ver todos →
                </a>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {recentCalculations.map((calc) => (
                  <div key={calc.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{calc.type}</h4>
                        <span className="text-sm font-semibold text-gray-900">{calc.cost}</span>
                      </div>
                      <p className="text-sm text-gray-600">{calc.project}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                        <span>{calc.area}</span>
                        <span>•</span>
                        <span>{calc.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900">{action.name}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Usage Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo de Uso</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cálculos realizados</span>
                  <span className="font-medium text-gray-900">47 / 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '47%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Relatórios gerados</span>
                  <span className="font-medium text-gray-900">12 / 50</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Plano ativo até 15/02/2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}