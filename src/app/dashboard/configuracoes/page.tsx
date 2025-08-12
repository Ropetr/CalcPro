'use client'

import { useState } from 'react'
import {
  Settings,
  Building2,
  Palette,
  Shield,
  CreditCard,
  User,
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getSubscriptionStatus } from '@/lib/auth'

interface ConfigData {
  empresa: {
    nome: string
    cnpj: string
    endereco: string
    telefone: string
    email: string
    logo: string | null
  }
  interface: {
    tema: 'claro' | 'escuro'
    idioma: 'pt-BR' | 'en-US'
    ordemCalculadoras: string[]
    atalhosTeclado: boolean
  }
  seguranca: {
    senhaAtual: string
    novaSenha: string
    confirmarSenha: string
  }
}

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const subscriptionInfo = user ? getSubscriptionStatus(user) : null
  
  const [activeSection, setActiveSection] = useState<'empresa' | 'interface' | 'seguranca' | 'plano'>('empresa')
  const [showPasswords, setShowPasswords] = useState({ atual: false, nova: false, confirmar: false })
  const [saved, setSaved] = useState(false)

  const [config, setConfig] = useState<ConfigData>({
    empresa: {
      nome: user?.company || '',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: user?.email || '',
      logo: null
    },
    interface: {
      tema: 'claro',
      idioma: 'pt-BR',
      ordemCalculadoras: [
        'divisoria-drywall',
        'divisoria-naval', 
        'forro-drywall',
        'forro-modular',
        'forro-pvc',
        'piso-laminado',
        'piso-vinilico',
        'piso-wall'
      ],
      atalhosTeclado: true
    },
    seguranca: {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    }
  })

  const sections = [
    {
      id: 'empresa',
      name: 'Dados da Empresa',
      icon: Building2,
      description: 'Informações da empresa para relatórios e PDFs'
    },
    {
      id: 'interface',
      name: 'Preferências da Interface',
      icon: Palette,
      description: 'Personalização da aparência e comportamento'
    },
    {
      id: 'seguranca',
      name: 'Segurança',
      icon: Shield,
      description: 'Configurações de senha e segurança da conta'
    },
    {
      id: 'plano',
      name: 'Plano e Faturamento',
      icon: CreditCard,
      description: 'Informações do plano e histórico de pagamentos'
    }
  ]

  const calculadorasNomes = {
    'divisoria-drywall': 'Divisória Drywall',
    'divisoria-naval': 'Divisória Naval',
    'forro-drywall': 'Forro Drywall',
    'forro-modular': 'Forro Modular',
    'forro-pvc': 'Forro PVC',
    'piso-laminado': 'Piso Laminado',
    'piso-vinilico': 'Piso Vinílico',
    'piso-wall': 'Piso Wall'
  }

  const handleSave = () => {
    // Simular salvamento
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          empresa: { ...prev.empresa, logo: e.target?.result as string }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const moveCalculadora = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...config.interface.ordemCalculadoras]
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    }
    setConfig(prev => ({
      ...prev,
      interface: { ...prev.interface, ordemCalculadoras: newOrder }
    }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-8 w-8 mr-3" />
          Configurações
        </h1>
        <p className="text-gray-600 mt-2">
          Personalize sua experiência no CalcPro
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            
            {/* Dados da Empresa */}
            {activeSection === 'empresa' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Building2 className="h-6 w-6 mr-2" />
                  Dados da Empresa
                </h2>
                
                <div className="space-y-6">
                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo da Empresa
                    </label>
                    <div className="flex items-center space-x-4">
                      {config.empresa.logo ? (
                        <img 
                          src={config.empresa.logo} 
                          alt="Logo" 
                          className="h-16 w-16 object-contain border rounded-lg"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="btn-secondary cursor-pointer flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {config.empresa.logo ? 'Alterar Logo' : 'Upload Logo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Empresa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={config.empresa.nome}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, nome: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="Nome da empresa"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        value={config.empresa.cnpj}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, cnpj: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={config.empresa.endereco}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, endereco: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="Endereço completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={config.empresa.telefone}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, telefone: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={config.empresa.email}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, email: e.target.value }
                        }))}
                        className="input-field"
                        placeholder="contato@empresa.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferências da Interface */}
            {activeSection === 'interface' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Palette className="h-6 w-6 mr-2" />
                  Preferências da Interface
                </h2>
                
                <div className="space-y-6">
                  {/* Tema */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tema da Interface
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          interface: { ...prev.interface, tema: 'claro' }
                        }))}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          config.interface.tema === 'claro'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">Tema Claro</div>
                        <div className="text-sm text-gray-500">Interface clara e limpa</div>
                      </button>
                      <button
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          interface: { ...prev.interface, tema: 'escuro' }
                        }))}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          config.interface.tema === 'escuro'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">Tema Escuro</div>
                        <div className="text-sm text-gray-500">Interface dark mode (em breve)</div>
                      </button>
                    </div>
                  </div>

                  {/* Idioma */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={config.interface.idioma}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        interface: { ...prev.interface, idioma: e.target.value as 'pt-BR' | 'en-US' }
                      }))}
                      className="input-field"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                    </select>
                  </div>

                  {/* Atalhos de Teclado */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.interface.atalhosTeclado}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          interface: { ...prev.interface, atalhosTeclado: e.target.checked }
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Habilitar atalhos de teclado (TAB, ENTER)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      TAB = Nova medida, ENTER = Calcular, SHIFT+TAB = Novo ambiente
                    </p>
                  </div>

                  {/* Ordem das Calculadoras */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ordem das Calculadoras no Menu
                    </label>
                    <div className="space-y-2">
                      {config.interface.ordemCalculadoras.map((calc, index) => (
                        <div key={calc} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{calculadorasNomes[calc as keyof typeof calculadorasNomes]}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveCalculadora(index, 'up')}
                              disabled={index === 0}
                              className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveCalculadora(index, 'down')}
                              disabled={index === config.interface.ordemCalculadoras.length - 1}
                              className="text-xs px-2 py-1 border rounded disabled:opacity-50"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança */}
            {activeSection === 'seguranca' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Segurança
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Alteração de Senha
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Para sua segurança, sempre use uma senha forte com pelo menos 8 caracteres.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.atual ? 'text' : 'password'}
                          value={config.seguranca.senhaAtual}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            seguranca: { ...prev.seguranca, senhaAtual: e.target.value }
                          }))}
                          className="input-field pr-10"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, atual: !prev.atual }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.atual ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.nova ? 'text' : 'password'}
                          value={config.seguranca.novaSenha}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            seguranca: { ...prev.seguranca, novaSenha: e.target.value }
                          }))}
                          className="input-field pr-10"
                          placeholder="Digite sua nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, nova: !prev.nova }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.nova ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirmar ? 'text' : 'password'}
                          value={config.seguranca.confirmarSenha}
                          onChange={(e) => setConfig(prev => ({
                            ...prev,
                            seguranca: { ...prev.seguranca, confirmarSenha: e.target.value }
                          }))}
                          className="input-field pr-10"
                          placeholder="Confirme sua nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirmar ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {config.seguranca.novaSenha && config.seguranca.confirmarSenha && (
                      <div className={`text-sm ${
                        config.seguranca.novaSenha === config.seguranca.confirmarSenha
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {config.seguranca.novaSenha === config.seguranca.confirmarSenha
                          ? '✓ Senhas coincidem'
                          : '✗ Senhas não coincidem'
                        }
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Histórico de Login</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <div className="flex justify-between">
                          <span>Último acesso: Hoje às 14:30</span>
                          <span className="text-green-600">● Ativo</span>
                        </div>
                        <div className="text-xs text-gray-500">IP: 192.168.1.100 • Chrome/Windows</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plano e Faturamento */}
            {activeSection === 'plano' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-6 w-6 mr-2" />
                  Plano e Faturamento
                </h2>
                
                <div className="space-y-6">
                  {/* Plano Atual */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user?.subscription.plan === 'trial' ? 'Teste Gratuito' : 
                           user?.subscription.plan === 'basic' ? 'Plano Básico' :
                           user?.subscription.plan === 'pro' ? 'Plano Pro' : 'Plano Enterprise'}
                        </h3>
                        <p className="text-gray-600">{subscriptionInfo?.message}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscriptionInfo?.status === 'trial' ? 'bg-yellow-100 text-yellow-800' : 
                        subscriptionInfo?.status === 'expired' ? 'bg-red-100 text-red-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {subscriptionInfo?.status === 'trial' ? 'Teste' : 
                         subscriptionInfo?.status === 'expired' ? 'Expirado' : 'Ativo'}
                      </div>
                    </div>
                  </div>

                  {/* Recursos Inclusos */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Recursos Inclusos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">8 Calculadoras Profissionais</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Geração de PDFs</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Sistema de Projetos</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Relatórios Detalhados</span>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex space-x-4">
                    <button className="btn-primary">
                      Atualizar Plano
                    </button>
                    <button className="btn-secondary">
                      Ver Histórico de Pagamentos
                    </button>
                  </div>

                  {/* Próxima Cobrança */}
                  {user?.subscription.plan !== 'trial' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900">Próxima Cobrança</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        R$ 29,90 em {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão Salvar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  {saved && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span className="text-sm">Configurações salvas com sucesso!</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}