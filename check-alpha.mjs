import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// Manually read .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY']
);

async function checkAlpha() {
  console.log('Checking profile for alpha@gmail.com...');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'alpha@gmail.com')
    .single();
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Profile found:', data);
  }
}

checkAlpha();
