import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get file from request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars', // Store in 'avatars' folder
          resource_type: 'auto',
          max_file_size: 5242880, // 5MB limit
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const uploadResult = result as any;
    const avatarUrl = uploadResult.secure_url;

    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
    });

    console.log('Avatar uploaded:', avatarUrl);
    return NextResponse.json({ 
      success: true, 
      avatarUrl,
      message: 'Avatar uploaded successfully' 
    });
  } catch (error) {
    console.error(' Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar', details: String(error) },
      { status: 500 }
    );
  }
}