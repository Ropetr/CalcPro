import { 
  Calculator, 
  FileText, 
  Scissors, 
  Users, 
  Shield, 
  Zap,
  BarChart3,
  Settings
} from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: 'Cálculos Especializados',
    description: 'Algoritmos desenvolvidos especificamente para cada sistema construtivo, garantindo precisão máxima.'
  },
  {
    icon: FileText,
    title: 'Desenhos Técnicos',
    description: 'Geração automática de plantas e detalhes executivos em escala, funcionando como manual de montagem.'
  },
  {
    icon: Scissors,
    title: 'Gestão de Cortes',
    description: 'Otimização inteligente de cortes e reaproveitamento de sobras para minimizar desperdícios.'
  },
  {
    icon: Users,
    title: 'Multi-usuário',
    description: 'Controle de acesso por usuário com permissões específicas para cada calculadora contratada.'
  },
  {
    icon: Shield,
    title: 'Normas ABNT',
    description: 'Modo rigoroso seguindo as normas ABNT e modo flexível para adaptações específicas.'
  },
  {
    icon: Zap,
    title: 'Resultados Instantâneos',
    description: 'Processamento rápido com lista completa de materiais e orçamento em segundos.'
  },
  {
    icon: BarChart3,
    title: 'Relatórios Detalhados',
    description: 'Relatórios completos com quantitativos, custos e especificações técnicas.'
  },
  {
    icon: Settings,
    title: 'Painel Administrativo',
    description: 'Controle total sobre usuários, módulos contratados e configurações da conta.'
  }
]

export default function Features() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher o CalcPro?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvido por especialistas para especialistas. Todas as funcionalidades 
            que você precisa para otimizar seus projetos de construção.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Gestão Inteligente de Materiais
              </h3>
              <p className="text-gray-600 mb-6">
                Nossa tecnologia analisa cada projeto e otimiza o uso de materiais, 
                indicando exatamente onde utilizar cada peça para minimizar desperdícios 
                e reduzir custos.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="ml-3 text-gray-700">Aproveitamento máximo de peças</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="ml-3 text-gray-700">Identificação de sobras reutilizáveis</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="ml-3 text-gray-700">Plano de corte otimizado</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Economia Típica</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Redução de desperdício</span>
                  <span className="font-semibold text-green-600">15-25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Economia em materiais</span>
                  <span className="font-semibold text-green-600">10-20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tempo de orçamento</span>
                  <span className="font-semibold text-blue-600">-80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}