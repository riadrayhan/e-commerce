import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB per file (base64 inflates ~33%)
const MAX_FILES = 4;

// Images are returned as base64 data URLs and stored directly in Postgres
// alongside the product row. This survives serverless cold starts AND
// Vercel deployments (the public/uploads dir is read-only on Vercel).
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
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES} images allowed` },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== 'function') {
        return NextResponse.json({ success: false, error: 'Invalid file data' }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}. Maximum 2MB per file` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      urls.push(`data:${file.type};base64,${base64}`);
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
