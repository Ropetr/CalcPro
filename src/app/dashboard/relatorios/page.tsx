import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react'

const reports = [
  {
    id: 1,
    name: 'Relatório Mensal - Janeiro 2024',
    type: 'Mensal',
    project: 'Escritório ABC - Reformas',
    date: '31/01/2024',
    calculations: 15,
    totalCost: 'R$ 12.450,00',
    savings: 'R$ 1.890,00',
    status: 'Finalizado',
  },
  {
    id: 2,
    name: 'Projeto Loja XYZ - Análise Completa',
    type: 'Projeto',
    project: 'Loja XYZ - Área Principal',
    date: '28/01/2024',
    calculations: 8,
    totalCost: 'R$ 8.320,00',
    savings: 'R$ 1.240,00',
    status: 'Finalizado',
  },
  {
    id: 3,
    name: 'Comparativo de Custos - Drywall',
    type: 'Comparativo',
    project: 'Múltiplos Projetos',
    date: '25/01/2024',
    calculations: 12,
    totalCost: 'R$ 15.680,00',
    savings: 'R$ 2.340,00',
    status: 'Finalizado',
  },
  {
    id: 4,
    name: 'Residência Silva - Relatório Final',
    type: 'Projeto',
    project: 'Residência Silva - Reforma',
    date: '22/01/2024',
    calculations: 6,
    totalCost: 'R$ 4.890,00',
    savings: 'R$ 720,00',
    status: 'Em andamento',
  },
]

const quickStats = [
  {
    name: 'Relatórios Gerados',
    value: '24',
    change: '+8',
    period: 'Este mês',
    icon: FileText,
  },
  {
    name: 'Economia Total',
    value: 'R$ 18.450',
    change: '+15%',
    period: 'Este mês',
    icon: TrendingUp,
  },
  {
    name: 'Projetos Analisados',
    value: '12',
    change: '+3',
    period: 'Este mês',
    icon: BarChart3,
  },
]

export default function RelatoriosPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Acompanhe o histórico e análises dos seus projetos</p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Gerar Novo Relatório
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">{stat.name}</div>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className="ml-2 text-sm font-semibold text-green-600">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{stat.period}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Calendar className="h-4 w-4 mr-2" />
                Data
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {reports.length} relatórios encontrados
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600">{report.project}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.calculations} cálculos</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Finalizado' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{report.totalCost}</div>
                    <div className="text-xs text-green-600">Economia: {report.savings}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report CTA */}
      <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg p-8">
        <div className="text-center">
          <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gere Relatórios Personalizados</h2>
          <p className="text-gray-600 mb-6">
            Crie relatórios detalhados com análises de custos, comparativos e projeções para seus projetos
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-primary-600 font-medium py-2 px-6 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
              Ver Exemplos
            </button>
            <button className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors">
              Criar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}