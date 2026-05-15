const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk';

async function addColumns() {
  console.log('Adding missing columns via Supabase SQL API...');

  // Use the official /sql endpoint (available on newer Supabase)
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    }
  });

  // Alternative: use the database HTTP API
  const dbPassword = 'Aparecidaaparecida17*'; // DB password
  const projectRef = 'rpinrodtgshnorolatry';

  // Use Supabase Management API (project-level)
  const mgmtUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  
  const mgmtResponse = await fetch(mgmtUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      query: `
        ALTER TABLE public.profiles 
          ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT '',
          ADD COLUMN IF NOT EXISTS min_order_value NUMERIC DEFAULT 0,
          ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral',
          ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '';
      `
    })
  });

  console.log('Management API status:', mgmtResponse.status);
  const text = await mgmtResponse.text();
  console.log('Response:', text.substring(0, 500));
}

addColumns();
