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
  env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
);

async function testSelect() {
  console.log('Testing SELECT on profiles with ANON_KEY...');
  const { data, error } = await supabase.from('profiles').select('id, name, type').limit(5);
  if (error) {
    console.error('SELECT failed:', error.message);
  } else {
    console.log('SELECT successful, found', data.length, 'profiles');
    console.log('Sample:', data);
  }
}

testSelect();
