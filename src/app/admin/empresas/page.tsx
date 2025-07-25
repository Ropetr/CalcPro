import { Search, Plus, Filter, MoreHorizontal, Building2, Users, Calendar } from 'lucide-react'

const empresas = [
  {
    id: 1,
    nome: 'Construtora ABC Ltda',
    email: 'contato@construtorabc.com.br',
    plano: 'Profissional',
    usuarios: 5,
    status: 'Ativo',
    dataRegistro: '15/01/2024',
    ultimoAcesso: '2 horas atrás',
  },
  {
    id: 2,
    nome: 'Reformas XYZ',
    email: 'admin@reformasxyz.com',
    plano: 'Essencial',
    usuarios: 1,
    status: 'Ativo',
    dataRegistro: '08/01/2024',
    ultimoAcesso: '1 dia atrás',
  },
  {
    id: 3,
    nome: 'Drywall Pro',
    email: 'vendas@drywallpro.com.br',
    plano: 'Empresarial',
    usuarios: 15,
    status: 'Ativo',
    dataRegistro: '22/12/2023',
    ultimoAcesso: '3 horas atrás',
  },
  {
    id: 4,
    nome: 'Construções Silva',
    email: 'silva@construcoes.net',
    plano: 'Profissional',
    usuarios: 8,
    status: 'Teste',
    dataRegistro: '20/01/2024',
    ultimoAcesso: '5 minutos atrás',
  },
  {
    id: 5,
    nome: 'Obras & Reformas',
    email: 'contato@obrasreformas.com',
    plano: 'Essencial',
    usuarios: 2,
    status: 'Inativo',
    dataRegistro: '10/12/2023',
    ultimoAcesso: '1 semana atrás',
  },
]

export default function AdminEmpresas() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
            <p className="text-gray-600">Gerencie todas as empresas cadastradas na plataforma</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </button>
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
                  placeholder="Buscar empresas..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {empresas.length} empresas cadastradas
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
                  Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {empresa.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {empresa.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      empresa.plano === 'Empresarial' 
                        ? 'bg-purple-100 text-purple-800'
                        : empresa.plano === 'Profissional'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {empresa.plano}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {empresa.usuarios}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      empresa.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800'
                        : empresa.status === 'Teste'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {empresa.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {empresa.ultimoAcesso}
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
              Mostrando 1 a {empresas.length} de {empresas.length} empresas
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