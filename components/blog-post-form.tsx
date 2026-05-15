"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Upload, 
  Loader2, 
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layout,
  Type,
  FileText,
  Search,
  Tag,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface BlogPostFormProps {
  postId?: string
  onClose: () => void
  onSuccess: () => void
}

export function BlogPostForm({ postId, onClose, onSuccess }: BlogPostFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category: 'Geral',
    status: 'draft',
    seo_title: '',
    seo_description: '',
    tags: [] as string[]
  })

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    setIsFetching(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single()
      
      if (error) throw error
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          cover_image: data.cover_image || '',
          category: data.category || 'Geral',
          status: data.status || 'draft',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          tags: data.tags || []
        })
      }
    } catch (err: any) {
      setError('Erro ao buscar artigo: ' + err.message)
    } finally {
      setIsFetching(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: !postId ? generateSlug(title) : prev.slug
    }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, cover_image: data.url }))
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Título, slug e conteúdo são obrigatórios.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        cover_image: formData.cover_image,
        category: formData.category,
        status: formData.status,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        tags: formData.tags,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        author_id: user?.id
      }

      if (postId) {
        const { error: dbError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('blog_posts')
          .insert([postData])
        if (dbError) throw dbError
      }

      onSuccess()
    } catch (err: any) {
      setError('Erro ao salvar artigo: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-muted/30 border-b p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{postId ? 'Editar Artigo' : 'Novo Artigo para o Blog'}</h2>
            <p className="text-sm text-muted-foreground">Crie conteúdo relevante para atrair novos parceiros</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 text-sm font-medium border border-destructive/20">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Título do Artigo</Label>
                <Input 
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Ex: Como escolher fornecedores de moda"
                  className="h-12 text-lg font-bold rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">Resumo (Excerpt)</Label>
                <Textarea 
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Uma breve descrição para aparecer na listagem..."
                  className="min-h-[100px] rounded-xl resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">Conteúdo (HTML aceito)</Label>
                <Textarea 
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escreva seu artigo aqui..."
                  className="min-h-[400px] rounded-xl font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Sidebar / Options */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-4">
              <Label className="text-sm font-bold">Imagem de Capa</Label>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/10 bg-muted/30 group">
                {formData.cover_image ? (
                  <>
                    <img src={formData.cover_image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}>
                        Trocar Imagem
                      </Button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-primary/5 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs font-bold text-muted-foreground">Upload JPG/PNG</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <Card className="border-border/40 shadow-none rounded-2xl bg-muted/20">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Categoria</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Moda">Moda</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Estratégia">Estratégia</SelectItem>
                      <SelectItem value="Logística">Logística</SelectItem>
                      <SelectItem value="Casa e Estilo">Casa e Estilo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">Slug da URL</Label>
                  <Input 
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className="h-11 rounded-xl bg-background"
                  />
                  <p className="text-[10px] text-muted-foreground">fornecefy.com.br/blog/{formData.slug}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-background rounded-xl border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold">Publicar Agora</span>
                  </div>
                  <Switch 
                    checked={formData.status === 'published'}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'published' : 'draft' }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card className="border-border/40 shadow-none rounded-2xl bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">SEO Avançado</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4 pt-0">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">SEO Title (Google)</Label>
                  <Input 
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="Meta title personalizado"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">Meta Description</Label>
                  <Textarea 
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Descrição para buscadores"
                    className="min-h-[80px] text-xs rounded-xl resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>Cancelar</Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Salvar Artigo
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
