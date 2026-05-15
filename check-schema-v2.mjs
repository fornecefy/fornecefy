import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log('Checking columns for table "profiles"...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles:', error);
  } else if (data && data.length > 0) {
    console.log('Available columns:', Object.keys(data[0]));
    const required = ['bio', 'logo_url', 'cover_url', 'min_order_value', 'category', 'whatsapp'];
    const missing = required.filter(col => !Object.keys(data[0]).includes(col));
    if (missing.length > 0) {
      console.log('MISSING COLUMNS:', missing);
    } else {
      console.log('All required columns exist!');
    }
  } else {
    console.log('Table empty, cannot determine columns via SELECT *. Trying RPC...');
  }
}

check();
