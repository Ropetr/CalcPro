// src/App.js
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CalculadorasMenu, CalculadoraForroPVC } from './pages/Calculadoras';

// Temporariamente definindo o AuthContext aqui
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [usuario] = useState({
    nome: 'Usuário Teste',
    email: 'usuario@teste.com',
    id: 1
  });

  return (
    <AuthContext.Provider value={{ usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          
          <Routes>
            {/* Rota principal - redireciona para calculadoras */}
            <Route path="/" element={<Navigate to="/calculadoras" />} />
            
            {/* Menu de calculadoras */}
            <Route path="/calculadoras" element={<CalculadorasMenu />} />
            
            {/* Calculadora específica de Forro PVC */}
            <Route path="/calculadoras/pvc" element={<CalculadoraForroPVC />} />
            
            {/* Página 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-xl text-gray-600 mt-4">Página não encontrada</p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
export { AuthContext };