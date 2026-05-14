"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type UserType = 'fornecedor' | 'comprador'

export interface User {
  id: string
  name: string
  email: string
  type: UserType
  company?: string
  phone?: string
  cnpj?: string
  state?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@fornecedor.com',
    password: '123456',
    type: 'fornecedor',
    company: 'Fashion Brasil',
    phone: '(11) 99999-9999',
    cnpj: '12.345.678/0001-90',
    state: 'São Paulo',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@comprador.com',
    password: '123456',
    type: 'comprador',
    company: 'Loja da Maria',
    phone: '(21) 98888-8888',
    cnpj: '98.765.432/0001-10',
    state: 'Rio de Janeiro',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('fornecefy_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('fornecefy_user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      return false
    }
    
    const newUser: User = {
      id: String(Date.now()),
      name: userData.name,
      email: userData.email,
      type: userData.type,
      company: userData.company,
      phone: userData.phone,
      cnpj: userData.cnpj,
      state: userData.state,
    }
    
    mockUsers.push({ ...newUser, password: userData.password })
    setUser(newUser)
    localStorage.setItem('fornecefy_user', JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fornecefy_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
