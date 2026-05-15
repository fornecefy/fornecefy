import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function testR2() {
  console.log('Testing R2 connection...');
  console.log('Endpoint:', process.env.R2_ENDPOINT);
  
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('Missing R2 environment variables!');
    return;
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    const testContent = 'Hello R2! This is a test file.';
    const fileName = `test-upload-${Date.now()}.txt`;
    
    console.log(`Uploading ${fileName}...`);
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileName,
        Body: testContent,
        ContentType: 'text/plain',
      })
    );

    console.log('Upload successful!');
    
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-r2.fornecefy.com.br'}/${fileName}`;
    console.log('Test file available at:', publicUrl);
    
    // Test downloading it
    console.log('Trying to fetch it...');
    const response = await fetch(publicUrl);
    console.log('Fetch status:', response.status);
    if (response.status === 200) {
      console.log('Fetch content:', await response.text());
    } else {
      console.log('Fetch failed - public URL might be incorrect or bucket is not public.');
    }
    
  } catch (err) {
    console.error('Error testing R2:', err);
  }
}

testR2();
