import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="site-section relative py-24 overflow-hidden -mt-20">
      
      {/* Background Image - Planta Baixa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/Banner.png)'
        }}
      ></div>
      
      {/* Jateado sobre a imagem */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/20 via-white/15 to-black/5"></div>
      
      {/* Degradê de transição no final do banner */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-20 pb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight text-shadow-strong">
            CalcPro
          </h1>
          
          <div className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-shadow-strong">
            <p className="mb-3">
              <span className="text-white font-bold">Sistema para cálculo de</span>{' '}
              <span className="text-red-600 font-bold">Divisórias, Forros e Pisos.</span>
            </p>
            <p>
              <span className="text-white font-bold">Gestão Inteligente e Ágil, com</span>{' '}
              <span className="text-red-600 font-bold">Precisão.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/registro" className="btn-primary text-lg px-10 py-4 flex items-center group">
              <span className="mr-3">Começar Teste Grátis</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#calculadoras" className="btn-accent text-lg px-8 py-4 font-semibold">
              Ver Calculadoras
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}