import { Search, Plus, Filter, MoreHorizontal, User, Building2, Shield } from 'lucide-react'

const usuarios = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@construtorabc.com.br',
    empresa: 'Construtora ABC Ltda',
    cargo: 'Engenheiro',
    permissoes: ['Drywall', 'Forro Drywall', 'Piso Laminado'],
    status: 'Ativo',
    ultimoAcesso: '1 hora atrás',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@reformasxyz.com',
    empresa: 'Reformas XYZ',
    cargo: 'Orçamentista',
    permissoes: ['Divisória Naval'],
    status: 'Ativo',
    ultimoAcesso: '2 horas atrás',
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    email: 'carlos@drywallpro.com.br',
    empresa: 'Drywall Pro',
    cargo: 'Supervisor',
    permissoes: ['Todas'],
    status: 'Ativo',
    ultimoAcesso: '30 minutos atrás',
  },
  {
    id: 4,
    nome: 'Ana Costa',
    email: 'ana@construcoes.net',
    empresa: 'Construções Silva',
    cargo: 'Arquiteta',
    permissoes: ['Forro Modular', 'Piso Vinílico'],
    status: 'Ativo',
    ultimoAcesso: '4 horas atrás',
  },
  {
    id: 5,
    nome: 'Pedro Lima',
    email: 'pedro@obrasreformas.com',
    empresa: 'Obras & Reformas',
    cargo: 'Técnico',
    permissoes: ['Piso Wall'],
    status: 'Inativo',
    ultimoAcesso: '1 semana atrás',
  },
]

export default function AdminUsuarios() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600">Gerencie todos os usuários e suas permissões</p>
          </div>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
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
                  placeholder="Buscar usuários..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {usuarios.length} usuários cadastrados
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissões
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
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {usuario.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {usuario.cargo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      {usuario.empresa}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {usuario.permissoes.includes('Todas') ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          <Shield className="h-3 w-3 mr-1" />
                          Todas
                        </span>
                      ) : (
                        usuario.permissoes.slice(0, 2).map((permissao, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {permissao}
                          </span>
                        ))
                      )}
                      {usuario.permissoes.length > 2 && !usuario.permissoes.includes('Todas') && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{usuario.permissoes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.ultimoAcesso}
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
              Mostrando 1 a {usuarios.length} de {usuarios.length} usuários
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