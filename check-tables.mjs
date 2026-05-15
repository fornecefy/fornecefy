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

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables'); // Custom RPC
  if (error) {
    // If RPC fails, try standard queries
    console.log('Fetching profiles...');
    const { error: pErr } = await supabase.from('profiles').select('id').limit(1);
    console.log('Profiles table exists:', !pErr);
    
    console.log('Fetching products...');
    const { error: prErr } = await supabase.from('products').select('id').limit(1);
    console.log('Products table exists:', !prErr);
    if (prErr) console.log('Products Error:', prErr.message);
  }
}

checkTables();
