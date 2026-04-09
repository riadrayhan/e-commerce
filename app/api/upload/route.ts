import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per file

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      console.error('FormData parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'Failed to parse upload data. File may be too large.' },
        { status: 400 }
      );
    }

    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 }
      );
    }

    if (files.length > 4) {
      return NextResponse.json(
        { success: false, error: 'Maximum 4 images allowed' },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== 'function') {
        return NextResponse.json(
          { success: false, error: 'Invalid file data' },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}. Maximum 5MB per file` },
          { status: 400 }
        );
      }
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg';
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${sanitizedName}`;

      // Save file to public/uploads/
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      // Return URL path (not base64)
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
