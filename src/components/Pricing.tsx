import Link from 'next/link'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Essencial',
    price: 'R$ 49',
    period: '/mês',
    description: 'Perfeito para pequenos projetos',
    features: [
      '1 usuário',
      '1 calculadora à escolha',
      'Desenhos técnicos',
      'Gestão de cortes',
      'Suporte por email',
      'Histórico de 30 dias'
    ],
    cta: 'Começar Teste',
    popular: false
  },
  {
    name: 'Profissional',
    price: 'R$ 129',
    period: '/mês',
    description: 'Ideal para profissionais e empresas',
    features: [
      'Até 5 usuários',
      '4 calculadoras à escolha',
      'Todos os desenhos técnicos',
      'Gestão avançada de cortes',
      'Relatórios detalhados',
      'Suporte prioritário',
      'Histórico ilimitado',
      'Modo ABNT completo'
    ],
    cta: 'Começar Teste',
    popular: true
  },
  {
    name: 'Empresarial',
    price: 'R$ 299',
    period: '/mês',
    description: 'Para grandes empresas e construtoras',
    features: [
      'Usuários ilimitados',
      'Todas as 8 calculadoras',
      'Recursos completos',
      'API de integração',
      'Suporte 24/7',
      'Treinamento incluso',
      'Relatórios personalizados',
      'Consultoria técnica'
    ],
    cta: 'Começar Teste',
    popular: false
  }
]

export default function Pricing() {
  return (
    <section id="precos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planos que se adaptam ao seu negócio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comece com 5 dias grátis em qualquer plano. Sem compromisso, sem cartão de crédito.
          </p>
          
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Teste gratuito de 5 dias em todos os planos
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                plan.popular ? 'border-primary-500' : 'border-gray-200'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/registro"
                className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Garantia de Satisfação
            </h3>
            <p className="text-gray-600 mb-6">
              Teste o CalcPro por 5 dias completamente grátis. Se não ficar satisfeito, 
              cancele a qualquer momento sem custos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Dados Seguros</h4>
                <p className="text-sm text-gray-600">Seus dados protegidos com criptografia SSL</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Sem Compromisso</h4>
                <p className="text-sm text-gray-600">Cancele a qualquer momento</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Suporte Completo</h4>
                <p className="text-sm text-gray-600">Ajuda sempre que precisar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}