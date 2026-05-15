import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export async function GET(req: NextRequest) {
  try {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })

    const fileName = `test-${Date.now()}.txt`
    const fileContent = 'Hello R2!'

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: fileContent,
        ContentType: 'text/plain',
      })
    )

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-r2.fornecefy.com.br'}/${fileName}`
    
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 })
  }
}
