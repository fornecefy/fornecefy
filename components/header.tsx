"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Package, User, Heart, LogIn, LogOut, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { useAuth } from '@/lib/auth-context'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { getFavoriteProductsCount } = useFavorites()
  const { user, logout } = useAuth()
  
  const totalItems = getTotalItems()
  const favoritesCount = getFavoriteProductsCount()

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Fornecefy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/favoritos">
              <Button variant="ghost" size="sm" className="relative gap-2">
                <Heart className="h-4 w-4" />
                Favoritos
                {favoritesCount > 0 && (
                  <Badge className="h-5 min-w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/carrinho">
              <Button variant="ghost" size="sm" className="relative gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orçamento
                {totalItems > 0 && (
                  <Badge className="h-5 min-w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.email === 'fornecefy@gmail.com' ? 'Admin' : user.name.split(' ')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email === 'fornecefy@gmail.com' ? 'Master Admin' : user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.email === 'fornecefy@gmail.com' ? (
                    <DropdownMenuItem asChild>
                      <Link href="/master-admin" className="cursor-pointer font-medium text-primary">
                        <User className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                  ) : user.type === 'fornecedor' ? (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <Building2 className="mr-2 h-4 w-4" />
                        Painel do Fornecedor
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem asChild>
                    <Link href="/favoritos" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Meus Favoritos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/favoritos">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="py-2 border-b border-border mb-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  {user.type === 'fornecedor' && (
                    <Link
                      href="/dashboard"
                      className="py-2 text-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Painel do Fornecedor
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="py-2 text-left text-destructive"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="py-2 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="py-2 text-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar-se
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
