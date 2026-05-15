"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; userType?: UserType }>
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        console.log('AuthContext: Verificando sessão ativa...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('AuthContext: Sessão encontrada para', session.user.email)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profile) {
            console.log('AuthContext: Perfil carregado com sucesso:', profile.type)
            setUser({
              id: session.user.id,
              name: profile.name,
              email: session.user.email!,
              type: profile.type,
              company: profile.company,
              phone: profile.phone,
              cnpj: profile.cnpj,
              state: profile.state,
            })
          } else {
            console.warn('AuthContext: Perfil não encontrado no banco.')
            // Fallback para caso o perfil não seja carregado
            setUser({
              id: session.user.id,
              name: session.user.email!.split('@')[0],
              email: session.user.email!,
              type: 'comprador',
              company: '',
              phone: '',
              cnpj: '',
              state: '',
            })
          }
        } else {
          console.log('AuthContext: Nenhuma sessão ativa.')
          setUser(null)
        }
      } catch (error) {
        console.error('AuthContext: Erro ao verificar usuário:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Evento de autenticação:', event)
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            type: profile.type,
            company: profile.company,
            phone: profile.phone,
            cnpj: profile.cnpj,
            state: profile.state,
          })
        } else {
          console.log('AuthContext: Sessão encontrada, mas sem perfil na tabela profiles.')
          setUser({
            id: session.user.id,
            name: 'Usuário',
            email: session.user.email!,
            type: 'comprador',
            company: '',
            phone: '',
            cnpj: '',
            state: '',
          })
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        console.log('AuthContext: Usuário deslogado.')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; userType?: UserType }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profile) {
          const userData: User = {
            id: data.user.id,
            name: profile.name,
            email: data.user.email!,
            type: profile.type,
            company: profile.company,
            phone: profile.phone,
            cnpj: profile.cnpj,
            state: profile.state,
          }
          setUser(userData)
          return { success: true, userType: profile.type }
        } else {
          // Usuário existe na auth mas não tem perfil (ex: master admin inicial)
          setUser({
            id: data.user.id,
            name: 'Usuário',
            email: data.user.email!,
            type: 'comprador', // Default fallback
            company: '',
            phone: '',
            cnpj: '',
            state: '',
          })
          return { success: true }
        }
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro inesperado' }
    }
  }

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    // 1. Sign up user in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
        }
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (authData.user) {
      // 2. Create profile in public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            type: userData.type,
            company: userData.company,
            phone: userData.phone,
            cnpj: userData.cnpj,
            state: userData.state,
          }
        ])

      if (profileError) {
        // Fallback or cleanup if needed
        console.error('Error creating profile:', profileError)
        return { success: false, error: "Erro ao criar perfil. Por favor, contate o suporte." }
      }
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
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
