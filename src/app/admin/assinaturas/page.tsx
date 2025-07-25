import { Search, Filter, MoreHorizontal, CreditCard, Calendar, TrendingUp, AlertCircle } from 'lucide-react'

const assinaturas = [
  {
    id: 1,
    empresa: 'Construtora ABC Ltda',
    plano: 'Profissional',
    valor: 'R$ 129,00',
    status: 'Ativa',
    proximoVencimento: '15/02/2024',
    metodo: 'Cartão ****1234',
    inicioAssinatura: '15/01/2024',
  },
  {
    id: 2,
    empresa: 'Reformas XYZ',
    plano: 'Essencial',
    valor: 'R$ 49,00',
    status: 'Ativa',
    proximoVencimento: '08/02/2024',
    metodo: 'PIX',
    inicioAssinatura: '08/01/2024',
  },
  {
    id: 3,
    empresa: 'Drywall Pro',
    plano: 'Empresarial',
    valor: 'R$ 299,00',
    status: 'Ativa',
    proximoVencimento: '22/02/2024',
    metodo: 'Boleto',
    inicioAssinatura: '22/12/2023',
  },
  {
    id: 4,
    empresa: 'Construções Silva',
    plano: 'Profissional',
    valor: 'R$ 129,00',
    status: 'Teste',
    proximoVencimento: '25/01/2024',
    metodo: 'Teste Grátis',
    inicioAssinatura: '20/01/2024',
  },
  {
    id: 5,
    empresa: 'Obras & Reformas',
    plano: 'Essencial',
    valor: 'R$ 49,00',
    status: 'Vencida',
    proximoVencimento: '10/01/2024',
    metodo: 'Cartão ****5678',
    inicioAssinatura: '10/12/2023',
  },
]

const resumoFinanceiro = {
  receitaMensal: 'R$ 28.450,00',
  assinaturasAtivas: 89,
  taxaCancelamento: '3,2%',
  ticketMedio: 'R$ 157,00'
}

export default function AdminAssinaturas() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
            <p className="text-gray-600">Gerencie planos, pagamentos e renovações</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
              <p className="text-2xl font-semibold text-gray-900">{resumoFinanceiro.receitaMensal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Assinaturas Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">{resumoFinanceiro.assinaturasAtivas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Taxa Cancelamento</p>
              <p className="text-2xl font-semibold text-gray-900">{resumoFinanceiro.taxaCancelamento}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Ticket Médio</p>
              <p className="text-2xl font-semibold text-gray-900">{resumoFinanceiro.ticketMedio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar assinaturas..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {assinaturas.length} assinaturas
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próximo Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assinaturas.map((assinatura) => (
                <tr key={assinatura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assinatura.empresa}
                    </div>
                    <div className="text-sm text-gray-500">
                      Desde {assinatura.inicioAssinatura}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assinatura.plano === 'Empresarial' 
                        ? 'bg-purple-100 text-purple-800'
                        : assinatura.plano === 'Profissional'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {assinatura.plano}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assinatura.valor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assinatura.status === 'Ativa' 
                        ? 'bg-green-100 text-green-800'
                        : assinatura.status === 'Teste'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {assinatura.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {assinatura.proximoVencimento}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                      {assinatura.metodo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando 1 a {assinaturas.length} de {assinaturas.length} assinaturas
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                Anterior
              </button>
              <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}