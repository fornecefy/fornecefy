const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setup() {
  console.log('Setting up blog in project:', supabaseUrl)

  const sql = `
    -- 1. Create table
    CREATE TABLE IF NOT EXISTS public.blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image TEXT,
        author_id TEXT REFERENCES public.profiles(id),
        status TEXT DEFAULT 'draft',
        is_featured BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        category TEXT DEFAULT 'Geral',
        tags TEXT[] DEFAULT '{}',
        seo_title TEXT,
        seo_description TEXT,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- 2. Enable RLS
    ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

    -- 3. Policies
    DROP POLICY IF EXISTS "Posts publicados são visíveis por todos" ON public.blog_posts;
    CREATE POLICY "Posts publicados são visíveis por todos" ON public.blog_posts
        FOR SELECT USING (status = 'published');

    DROP POLICY IF EXISTS "Admins podem tudo" ON public.blog_posts;
    CREATE POLICY "Admins podem tudo" ON public.blog_posts
        FOR ALL USING (
            auth.uid() IS NOT NULL AND 
            (SELECT role FROM profiles WHERE id = auth.uid()::text) = 'admin'
        );
  `

  console.log('Please run this SQL in your Supabase SQL Editor:')
  console.log(sql)
  
  // Try to run a simple insert to test if table exists
  const { error } = await supabase.from('blog_posts').select('id').limit(1)
  if (error && error.code === '42P01') {
    console.error('\nERROR: The table public.blog_posts DOES NOT EXIST in this project yet.')
  } else if (error) {
    console.error('\nERROR connecting to table:', error.message)
  } else {
    console.log('\nSUCCESS: The table already exists and is accessible.')
  }
}

setup()
