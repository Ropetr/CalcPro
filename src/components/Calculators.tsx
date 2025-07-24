import { 
  Building2, 
  Anchor, 
  Layers, 
  Grid3X3, 
  Waves,
  PaintBucket,
  Sparkles,
  Square
} from 'lucide-react'

const calculators = [
  {
    category: 'Divisórias',
    items: [
      {
        icon: Building2,
        name: 'Drywall',
        description: 'Cálculo completo para divisórias em drywall com gestão de cortes e desenhos técnicos.',
        features: ['Modo ABNT e Genérico', 'Gestão de sobras', 'Desenhos em escala']
      },
      {
        icon: Anchor,
        name: 'Naval',
        description: 'Sistemas Divilux e similares com painéis de madeira e perfis metálicos.',
        features: ['Perfis H e U', 'Kits de porta', 'Otimização de painéis']
      }
    ]
  },
  {
    category: 'Forros',
    items: [
      {
        icon: Layers,
        name: 'Drywall',
        description: 'Forros suspensos em drywall com sancas, cortineiros e iluminação.',
        features: ['Sancas abertas/fechadas', 'Cortineiros', 'Isolamento acústico']
      },
      {
        icon: Grid3X3,
        name: 'Modulares',
        description: 'Forros modulares em isopor, PVC, gesso, mineral, FID e Rockfon.',
        features: ['Múltiplos materiais', 'Dimensões variadas', 'Estrutura T']
      },
      {
        icon: Waves,
        name: 'PVC',
        description: 'Forros em régua de PVC com otimização de comprimentos.',
        features: ['Réguas variadas', 'Perfis de acabamento', 'Gestão de cortes']
      }
    ]
  },
  {
    category: 'Pisos',
    items: [
      {
        icon: PaintBucket,
        name: 'Laminado',
        description: 'Pisos laminados residenciais e comerciais com todos os acessórios.',
        features: ['Múltiplas marcas', 'Perfis de acabamento', 'Mantas acústicas']
      },
      {
        icon: Sparkles,
        name: 'Vinílico',
        description: 'Pisos vinílicos com preparo de base, autonivelante e hidrofugante.',
        features: ['Preparo completo', 'Base regularizada', 'Todos os perfis']
      },
      {
        icon: Square,
        name: 'Piso Wall',
        description: 'Sistema simplificado para pisos em chapas com parafusos.',
        features: ['Cálculo direto', 'Banda acústica', 'Simplicidade']
      }
    ]
  }
]

export default function Calculators() {
  return (
    <section id="calculadoras" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            8 Calculadoras Especializadas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada calculadora foi desenvolvida com algoritmos específicos para garantir 
            a máxima precisão em cada tipo de sistema construtivo.
          </p>
        </div>

        <div className="space-y-12">
          {calculators.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((calculator, index) => {
                  const Icon = calculator.icon
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                          <Icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {calculator.name}
                        </h4>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {calculator.description}
                      </p>
                      
                      <div className="space-y-2">
                        {calculator.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Funcionalidades Comuns a Todas as Calculadoras
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-3">Recursos Técnicos</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Desenhos técnicos em escala
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Plano de cortes otimizado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Manual de montagem visual
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Gestão de sobras e reaproveitamento
                  </li>
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 mb-3">Recursos de Gestão</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Orçamento detalhado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Lista completa de materiais
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Relatórios em PDF
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Histórico de projetos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}