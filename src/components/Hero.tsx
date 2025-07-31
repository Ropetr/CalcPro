import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800"></div>
      
      {/* Background Image - Planta Baixa */}
      <div 
        className="absolute inset-0 opacity-[0.12] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/blueprint-background.jpg)'
        }}
      ></div>
      
      {/* Glass Fumê */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 backdrop-blur-[1px]"></div>
      
      {/* Toque de Vermelho */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Calculadoras Técnicas
            <span className="block text-3xl md:text-4xl text-white/80 font-normal mt-2">para Construção Civil</span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Sistema completo para cálculo de materiais em divisórias, forros e pisos. 
            Gestão inteligente de cortes e orçamentos precisos.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/registro" className="btn-primary text-lg px-10 py-4 flex items-center group">
              <span className="mr-3">Começar Teste Grátis</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#calculadoras" className="btn-accent text-lg px-8 py-4 font-semibold">
              Ver Calculadoras
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm mb-16">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-white/80">5 dias grátis • Sem cartão</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-white/80">8 calculadoras especializadas</span>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cálculos Especializados</h3>
            <p className="text-white/60 text-sm">Algoritmos desenvolvidos para cada sistema construtivo</p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Gestão Inteligente</h3>
            <p className="text-white/60 text-sm">Otimização de cortes e redução de desperdícios</p>
          </div>
        </div>
      </div>
    </section>
  )
}