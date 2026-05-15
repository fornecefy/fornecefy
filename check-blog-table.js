const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS for checking

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBlogPosts() {
  console.log('Checking blog_posts in project:', supabaseUrl)
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching blog_posts:', error.message, error.code)
    if (error.code === 'PGRST116') {
        console.log('Table exists but is empty or single() failed.')
    } else if (error.code === '42P01') {
        console.log('Table DOES NOT EXIST.')
    }
  } else {
    console.log('blog_posts table is OK. Count:', data.length)
  }
}

checkBlogPosts()
