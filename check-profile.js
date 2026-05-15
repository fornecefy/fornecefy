require('dotenv').config({ path: '../FORNECEFY V2/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProfile() {
  const email = 'fornecefy@gmail.com';
  console.log(`Checking profile for ${email}...`);
  
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: 'admin' // Assumindo que a senha é admin baseado em conversas anteriores
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }

  console.log('Auth success, fetching profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError.message);
    console.log('Hint: Check if profiles table exists and has RLS policies.');
  } else {
    console.log('Profile found:', profile);
  }
}

checkProfile();
