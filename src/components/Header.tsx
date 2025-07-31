'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Calculator } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isOnLight, setIsOnLight] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      
      // Se passou de 900px, está em fundo claro
      setIsOnLight(scrollPosition > 900)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Verificar posição inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${!isOnLight ? 'bg-white/50 border-0 backdrop-blur-xl' : 'glass-card border-0 backdrop-blur-xl'} shadow-lg sticky top-0 z-50 header-adaptive ${isOnLight ? 'on-light' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                {/* Logo única - texto chumbo sempre */}
                <img 
                  src="/logo-horizontal.png" 
                  alt="CalcPro" 
                  className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#calculadoras" className="nav-link font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Calculadoras
            </Link>
            <Link href="/#precos" className="nav-link font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Preços
            </Link>
            <Link href="/#sobre" className="nav-link font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Sobre
            </Link>
            <Link href="/login" className="nav-link font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
              Login
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-link p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card border-t border-white/20">
            <Link
              href="/#calculadoras"
              className="block px-3 py-2 nav-link font-medium rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadoras
            </Link>
            <Link
              href="/#precos"
              className="block px-3 py-2 nav-link font-medium rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="/#sobre"
              className="block px-3 py-2 nav-link font-medium rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 nav-link font-medium rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}