const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://52916c971083428eb1fd209d197c3458.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'e37d96af82aa7f3af644724667fd514e',
    secretAccessKey: 'd07b870edf8708183606696c1e939ab51e8dccf9d9aba2ea7182c05521f9f698',
  },
})

const BUCKET = 'fornecefy-storage' // Check env

async function testR2() {
  console.log('Testing R2 connection and operations...')
  
  // 1. Create a dummy file
  const testFileName = `test-upload-${Date.now()}.txt`
  const testContent = Buffer.from('This is a test upload to R2')
  
  try {
    console.log(`1. Uploading file: ${testFileName}`)
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: testFileName,
        Body: testContent,
        ContentType: 'text/plain',
      })
    )
    console.log('✅ Upload successful!')
    
    // 2. List objects to verify it's there
    console.log('\n2. Verifying file exists in bucket...')
    const listRes = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: testFileName
      })
    )
    
    const exists = listRes.Contents && listRes.Contents.some(obj => obj.Key === testFileName)
    if (exists) {
      console.log(`✅ File ${testFileName} found in bucket.`)
    } else {
      console.error(`❌ File ${testFileName} not found in bucket!`)
      return
    }
    
    // 3. Delete the file
    console.log(`\n3. Deleting file: ${testFileName}`)
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: testFileName,
      })
    )
    console.log('✅ Delete command sent!')
    
    // 4. Verify it's gone
    console.log('\n4. Verifying file is deleted...')
    const listResAfter = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: testFileName
      })
    )
    
    const existsAfter = listResAfter.Contents && listResAfter.Contents.some(obj => obj.Key === testFileName)
    if (!existsAfter) {
      console.log(`✅ File ${testFileName} is successfully deleted from R2!`)
    } else {
      console.error(`❌ File ${testFileName} is STILL in the bucket!`)
    }
    
  } catch (err) {
    console.error('❌ Error during R2 test:', err)
  }
}

testR2()
