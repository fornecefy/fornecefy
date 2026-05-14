const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  console.log('Creating admin user...')
  
  // 1. Create User in Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'fornecefy@gmail.com',
    password: 'Aparecidaaparecida17*',
    email_confirm: true,
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
        console.log('User already exists in Auth. Updating password and confirming...')
        
        // Find user by email
        const { data: users, error: listError } = await supabase.auth.admin.listUsers()
        const user = users.users.find(u => u.email === 'fornecefy@gmail.com')
        
        if (user) {
            await supabase.auth.admin.updateUserById(user.id, {
                password: 'Aparecidaaparecida17*',
                email_confirm: true
            })
            console.log('User updated.')
            await ensureProfile(user.id)
        }
    } else {
        console.error('Error creating user:', authError)
    }
  } else {
    console.log('User created:', authData.user.id)
    await ensureProfile(authData.user.id)
  }
}

async function ensureProfile(userId) {
    const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        
    if (!profile) {
        console.log('Creating profile...')
        await supabase.from('profiles').insert([
            { id: userId, email: 'fornecefy@gmail.com', name: 'Master Admin', type: 'admin' }
        ])
        console.log('Profile created.')
    } else {
        console.log('Profile already exists. Updating type to admin...')
        await supabase.from('profiles').update({ type: 'admin', name: 'Master Admin' }).eq('id', userId)
        console.log('Profile updated.')
    }
}

createAdmin()
