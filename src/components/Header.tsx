'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Calculator } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo-horizontal.png" 
                alt="CalcPro" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#calculadoras" className="text-gray-700 hover:text-primary-600 font-medium">
              Calculadoras
            </Link>
            <Link href="/#precos" className="text-gray-700 hover:text-primary-600 font-medium">
              Preços
            </Link>
            <Link href="/#sobre" className="text-gray-700 hover:text-primary-600 font-medium">
              Sobre
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium">
              Login
            </Link>
            <Link href="/registro" className="btn-primary">
              Teste Grátis
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              href="/#calculadoras"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadoras
            </Link>
            <Link
              href="/#precos"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
            <Link
              href="/#sobre"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/registro"
              className="block px-3 py-2 btn-primary m-3"
              onClick={() => setIsMenuOpen(false)}
            >
              Teste Grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}