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
    let mounted = true;

    const fetchProfile = async (sessionUser: any) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle()
        
        if (profile && mounted) {
          setUser({
            id: sessionUser.id,
            name: profile.name,
            email: sessionUser.email!,
            type: profile.type,
            company: profile.company,
            phone: profile.phone,
            cnpj: profile.cnpj,
            state: profile.state,
          })
        } else if (mounted) {
          // Fallback to suppliers table
          const { data: supplierProfile } = await supabase
            .from('suppliers')
            .select('name')
            .eq('user_id', sessionUser.id)
            .maybeSingle()

          setUser({
            id: sessionUser.id,
            name: supplierProfile?.name || sessionUser.email!.split('@')[0],
            email: sessionUser.email!,
            type: supplierProfile ? 'fornecedor' : 'comprador',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        fetchProfile(session.user)
      } else if (mounted) {
        setIsLoading(false)
      }
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event)
      if (session?.user && mounted) {
        fetchProfile(session.user)
      } else if (mounted) {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
          .maybeSingle()
        
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
          // Fallback: Verifica se existe na tabela suppliers
          const { data: supplierProfile } = await supabase
            .from('suppliers')
            .select('name')
            .eq('user_id', data.user.id)
            .maybeSingle()

          if (supplierProfile) {
            setUser({
              id: data.user.id,
              name: supplierProfile.name || 'Fornecedor',
              email: data.user.email!,
              type: 'fornecedor',
            })
            return { success: true, userType: 'fornecedor' }
          }

          // Se não existir em nenhum lugar, é comprador
          setUser({
            id: data.user.id,
            name: 'Usuário',
            email: data.user.email!,
            type: 'comprador',
            company: '',
            phone: '',
            cnpj: '',
            state: '',
          })
          return { success: true, userType: 'comprador' }
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
            category: 'Geral', // Default category
          }
        ])

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Mesmo com erro no profile, o usuário foi criado no Auth.
        // Vamos permitir que ele entre, mas avisamos do erro.
        setUser({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          type: userData.type as any, // Usa o tipo que ele tentou cadastrar
          company: userData.company,
        })
        return { success: true }
      }
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    // Limpa dados locais ao deslogar para evitar estados "fantasma"
    localStorage.removeItem('fornecefy_favorite_products')
    localStorage.removeItem('fornecefy_favorite_suppliers')
    localStorage.removeItem('fornecefy_cart_items')
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
