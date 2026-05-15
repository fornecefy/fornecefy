import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
  console.log('Testing blog_posts fetch...')
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Data count:', data?.length)
    if (data && data.length > 0) {
      console.log('First post title:', data[0].title)
    }
  }
}

test()
