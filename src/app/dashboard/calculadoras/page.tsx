'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Layers, 
  Grid3X3, 
  Waves,
  Square,
  Sparkles,
  Search,
  Filter,
  Play,
  Ruler,
  Hammer,
  Package
} from 'lucide-react'

const categories = [
  { 
    id: 'divisorias', 
    name: 'Divisórias', 
    icon: Building2,
    count: 2,
    description: 'Cálculos para divisórias internas'
  },
  { 
    id: 'forros', 
    name: 'Forros', 
    icon: Layers,
    count: 3,
    description: 'Forros suspensos e rebaixados'
  },
  { 
    id: 'pisos', 
    name: 'Pisos', 
    icon: Grid3X3,
    count: 3,
    description: 'Revestimentos de piso'
  },
]

const calculatorsByCategory = {
  divisorias: [
    {
      id: 1,
      name: 'Divisória Drywall',
      description: 'Ferramenta para otimização de projetos com paredes leves. Inclui modalidade ABNT e genérica, com desenhos técnicos e gestão de cortes.',
      icon: Building2,
      color: 'bg-primary-100 text-primary-600',
      uses: 342,
      lastUsed: '2 horas atrás',
      features: ['Perfis metálicos', 'Placas de gesso', 'Massa corrida', 'Desenhos em escala', 'Gestão de cortes'],
    },
    {
      id: 2,
      name: 'Divisória Naval',
      description: 'Especializada em painéis de madeira com miolo colmeia (Divilux/Eucatex). Otimização de materiais e planos de corte visuais.',
      icon: Waves,
      color: 'bg-orange-100 text-orange-600',
      uses: 156,
      lastUsed: '1 dia atrás',
      features: ['Painéis colmeia', 'Perfis H e U', 'Kits de porta', 'Vãos de vidro', 'Manual montagem'],
    },
  ],
  forros: [
    {
      id: 3,
      name: 'Forro Drywall',
      description: 'Projetos de forros suspensos com sancas, cortineiros e iluminação. Modalidades ABNT e genérica com desenhos técnicos.',
      icon: Layers,
      color: 'bg-green-100 text-green-600',
      uses: 267,
      lastUsed: '1 dia atrás',
      features: ['Sancas abertas/fechadas', 'Cortineiros', 'Iluminação indireta', 'Perfis suspensos'],
    },
    {
      id: 4,
      name: 'Forro Modular',
      description: 'Versátil para diversos tipos: isopor, PVC, gesso, mineral, FID, Rockfon. Suporta placas de diferentes dimensões.',
      icon: Grid3X3,
      color: 'bg-purple-100 text-purple-600',
      uses: 189,
      lastUsed: '2 dias atrás',
      features: ['Múltiplos materiais', 'Perfis T', 'Modulação flexível', 'Placas personalizadas'],
    },
    {
      id: 5,
      name: 'Forro PVC',
      description: 'Otimização de comprimentos em réguas de PVC. Gestão inteligente de cortes para minimizar desperdícios.',
      icon: Square,
      color: 'bg-red-100 text-red-600',
      uses: 145,
      lastUsed: '4 dias atrás',
      features: ['Réguas PVC', 'Otimização cortes', 'Múltiplos comprimentos', 'Perfis acabamento'],
    },
  ],
  pisos: [
    {
      id: 6,
      name: 'Piso Laminado',
      description: 'Variedade completa para projetos residenciais e comerciais. Inclui todos os acessórios e perfis de acabamento.',
      icon: Ruler,
      color: 'bg-yellow-100 text-yellow-600',
      uses: 298,
      lastUsed: '3 horas atrás',
      features: ['Múltiplas marcas', 'Manta acústica', 'Perfis transição', 'Rodapés', 'Padrões instalação'],
    },
    {
      id: 7,
      name: 'Piso Vinílico',
      description: 'Detalhes técnicos completos incluindo autonivelante e hidrofugante. Para uso residencial, comercial e industrial.',
      icon: Waves,
      color: 'bg-indigo-100 text-indigo-600',
      uses: 189,
      lastUsed: '2 dias atrás',
      features: ['Autonivelante', 'Hidrofugante', 'Colas específicas', 'Múltiplas espessuras'],
    },
    {
      id: 8,
      name: 'Piso Wall',
      description: 'Simplicidade e eficiência para projetos com chapas e parafusos. Inclui banda acústica opcional para isolamento.',
      icon: Package,
      color: 'bg-gray-100 text-gray-600',
      uses: 67,
      lastUsed: '2 semanas atrás',
      features: ['Chapas Wall', 'Parafusos específicos', 'Banda acústica', 'Gestão de cortes'],
    },
  ],
}

export default function CalculadorasPage() {
  const [activeTab, setActiveTab] = useState('divisorias')
  const [searchTerm, setSearchTerm] = useState('')

  const activeCalculators = calculatorsByCategory[activeTab as keyof typeof calculatorsByCategory]
  const filteredCalculators = activeCalculators.filter(calc =>
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calculadoras</h1>
        <p className="text-gray-600">Escolha a categoria e calculadora ideal para seu projeto</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === category.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 h-5 w-5 ${
                    activeTab === category.id
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {category.name}
                  <span className={`ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                    activeTab === category.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {category.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Search within category */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Buscar em ${categories.find(c => c.id === activeTab)?.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredCalculators.length} calculadoras encontradas
          </div>
        </div>
      </div>

      {/* Category Description */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center">
          {(() => {
            const activeCategory = categories.find(c => c.id === activeTab)
            const Icon = activeCategory?.icon || Building2
            return (
              <>
                <Icon className="h-5 w-5 text-primary-600 mr-2" />
                <span className="font-medium text-gray-900">{activeCategory?.name}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{activeCategory?.description}</span>
              </>
            )
          })()}
        </div>
      </div>

      {/* Calculators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalculators.map((calc) => {
          const Icon = calc.icon
          return (
            <Link
              key={calc.id}
              href={`/dashboard/calculadoras/${calc.name.toLowerCase().replace(/\s+/g, '-').replace('ó', 'o').replace('í', 'i')}`}
              className="bg-white rounded-lg shadow border border-gray-200 hover:border-primary-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-left group cursor-pointer block"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${calc.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{calc.uses} usos</div>
                    <div className="text-xs text-gray-400">{calc.lastUsed}</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{calc.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{calc.description}</p>

                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">INCLUI:</div>
                  <div className="flex flex-wrap gap-1">
                    {calc.features.slice(0, 4).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                        {feature}
                      </span>
                    ))}
                    {calc.features.length > 4 && (
                      <span className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">+{calc.features.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCalculators.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma calculadora encontrada</h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar sua busca ou explore outras categorias
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Quick Start */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-red-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Primeira vez usando?</h2>
          <p className="text-gray-600 mb-6">
            Veja nosso guia rápido para aproveitar ao máximo suas calculadoras
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-primary-600 font-medium py-2 px-6 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
              Ver Tutorial
            </button>
            <button className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors">
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}