const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTk3MDIsImV4cCI6MjA5NDA3NTcwMn0.p7w4cwwN60wxNBt-6wwUvJCFZPs5m5UsL00ozJDAbAY' // anon key

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  console.log('Testing login with fornecefy@gmail.com ...')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'fornecefy@gmail.com',
    password: 'Aparecidaaparecida17*',
  })

  if (error) {
    console.error('❌ Login failed:', error.message)
  } else {
    console.log('✅ Login successful!')
    console.log('User ID:', data.user.id)
  }
}

testLogin()
