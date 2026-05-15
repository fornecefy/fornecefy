const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rpinrodtgshnorolatry.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5OTcwMiwiZXhwIjoyMDk0MDc1NzAyfQ.UwqaEUYQ4B9_yQRmt5moLEMwShokZyT9vagOh6eVCsk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Get sample row to see columns
  const { data: cols, error: colsErr } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (colsErr) {
    console.error('Error fetching profiles:', colsErr.message);
  } else {
    console.log('Profiles columns (from sample row):');
    if (cols && cols.length > 0) {
      console.log(Object.keys(cols[0]));
      console.log('Sample data:', cols[0]);
    } else {
      console.log('Table exists but is empty.');
    }
  }

  // Test the exact update
  console.log('\n--- Testing update with all fields ---');
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({
      name: 'Test',
      logo_url: 'test',
      cover_url: 'test',
      bio: 'test',
      min_order_value: 0,
      state: 'SP',
      category: 'Geral',
      phone: '123',
      slug: 'test-slug'
    })
    .eq('id', '190d73ed-566a-43a8-937e-45b07f55147b');

  if (updateErr) {
    console.error('Update error:', updateErr.message);
    console.error('Update error code:', updateErr.code);
    console.error('Update error details:', updateErr.details);
  } else {
    console.log('Update succeeded!');
  }
}

checkSchema();
