import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename: only allow alphanumeric, dash, underscore
      const extMatch = file.name.match(/\.(jpe?g|png|webp|gif)$/i);
      const ext = extMatch ? extMatch[0].toLowerCase() : '.jpg';
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filepath = path.join(uploadDir, safeName);

      await writeFile(filepath, buffer);
      urls.push(`/uploads/${safeName}`);
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
