import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large (max 1MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    // Construct the public URL (assuming the bucket has public access or a custom domain)
    // If using Cloudflare R2 workers or public bucket:
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-r2.fornecefy.com.br'}/${fileName}`

    return NextResponse.json({ url: publicUrl, fileName })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'No url provided' }, { status: 400 })
    }

    // A URL pública contém o nome do arquivo no final.
    // Exemplo: https://pub-r2.fornecefy.com.br/170000000-imagem.jpg
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]

    if (!fileName) {
       return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
      })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
