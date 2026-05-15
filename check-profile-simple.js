const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTk3MDIsImV4cCI6MjA5NDA3NTcwMn0.p7w4cwwN60wxNBt-6wwUvJCFZPs5m5UsL00ozJDAbAY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfile() {
  const email = 'fornecefy@gmail.com';
  console.log(`Checking profile for ${email}...`);
  
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: 'Aparecidaaparecida17*'
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }

  console.log('Auth success (User ID: ' + user.id + '), fetching profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  if (profileError) {
    console.error('Profile fetch error:', profileError.message);
  } else if (!profile || profile.length === 0) {
    console.log('Profile NOT FOUND in table "profiles".');
    
    // Check if table exists
    const { error: tableError } = await supabase.from('profiles').select('count');
    if (tableError) {
        console.error('Table check error:', tableError.message);
    } else {
        console.log('Profiles table exists but is empty or user is missing.');
    }
  } else {
    console.log('Profile found:', profile[0]);
  }
}

checkProfile();
