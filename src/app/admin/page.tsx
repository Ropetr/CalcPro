import { 
  Users, 
  Calculator, 
  CreditCard, 
  TrendingUp,
  Building2,
  UserCheck,
  DollarSign,
  Activity
} from 'lucide-react'

const stats = [
  {
    name: 'Usuários Ativos',
    value: '247',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Empresas Cadastradas',
    value: '89',
    change: '+5%',
    changeType: 'positive',
    icon: Building2,
  },
  {
    name: 'Receita Mensal',
    value: 'R$ 28.450',
    change: '+18%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Cálculos Realizados',
    value: '1.354',
    change: '-2%',
    changeType: 'negative',
    icon: Calculator,
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'subscription',
    company: 'Construtora ABC Ltda',
    action: 'Assinou plano Profissional',
    time: '2 horas atrás',
    icon: CreditCard,
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    type: 'user',
    company: 'Reformas XYZ',
    action: 'Novo usuário cadastrado',
    time: '4 horas atrás',
    icon: UserCheck,
    iconColor: 'text-red-600',
  },
  {
    id: 3,
    type: 'calculation',
    company: 'Drywall Pro',
    action: 'Calculadora Drywall utilizada',
    time: '6 horas atrás',
    icon: Calculator,
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    type: 'upgrade',
    company: 'Construções Silva',
    action: 'Upgrade para plano Empresarial',
    time: '1 dia atrás',
    icon: TrendingUp,
    iconColor: 'text-orange-600',
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da plataforma CalcPro</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Atividades Recentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.company}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.action}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Calculadoras Mais Usadas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <Building2 className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Divisória Drywall</span>
                </div>
                <span className="text-sm text-gray-500">342 usos</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Piso Laminado</span>
                </div>
                <span className="text-sm text-gray-500">298 usos</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Calculator className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Forro Drywall</span>
                </div>
                <span className="text-sm text-gray-500">267 usos</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Piso Vinílico</span>
                </div>
                <span className="text-sm text-gray-500">189 usos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}