import Link from 'next/link'
import { Calculator, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">CalcPro</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Sistema completo de calculadoras técnicas para divisórias, forros e pisos. 
              Desenvolvido para profissionais da construção civil que buscam precisão e eficiência.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3" />
                <span>contato@calcpro.app.br</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-3" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Calculadoras</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculadoras/divisoria-drywall" className="text-gray-400 hover:text-white transition-colors">
                  Divisória Drywall
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/divisoria-naval" className="text-gray-400 hover:text-white transition-colors">
                  Divisória Naval
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/forro-drywall" className="text-gray-400 hover:text-white transition-colors">
                  Forro Drywall
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/forro-modular" className="text-gray-400 hover:text-white transition-colors">
                  Forro Modular
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/forro-pvc" className="text-gray-400 hover:text-white transition-colors">
                  Forro PVC
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/piso-laminado" className="text-gray-400 hover:text-white transition-colors">
                  Piso Laminado
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/piso-vinilico" className="text-gray-400 hover:text-white transition-colors">
                  Piso Vinílico
                </Link>
              </li>
              <li>
                <Link href="/calculadoras/piso-wall" className="text-gray-400 hover:text-white transition-colors">
                  Piso Wall
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/precos" className="text-gray-400 hover:text-white transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="text-gray-400 hover:text-white transition-colors">
                  Suporte
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 CalcPro. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/termos" className="text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}