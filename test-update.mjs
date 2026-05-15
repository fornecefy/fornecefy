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

async function checkRLS() {
  const { data, error } = await supabase.rpc('get_policies'); // This might not work if the RPC isn't there
  // Instead, let's try a simpler approach: check if we can update a row using the service role key
  console.log('Testing update with SERVICE_ROLE_KEY...');
  
  // Get first profile
  const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
  if (profiles && profiles.length > 0) {
    const testId = profiles[0].id;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ bio: 'Test Bio ' + Date.now() })
      .eq('id', testId);
    
    if (updateError) {
      console.error('Update failed with service role:', updateError);
    } else {
      console.log('Update successful with service role!');
    }
  }
}

checkRLS();
