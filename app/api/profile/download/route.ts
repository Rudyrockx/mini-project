import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { jsPDF } from 'jspdf';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Profile Information', 20, 20);
    
    // Add content
    doc.setFontSize(12);
    let yPos = 40;
    
    doc.text(`Name: ${user.name || 'N/A'}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Email: ${user.email}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Address: ${user.address || 'N/A'}`, 20, yPos);
    yPos += 10;
    
    if (user.latitude && user.longitude) {
      doc.text(`Coordinates: ${user.latitude.toFixed(6)}, ${user.longitude.toFixed(6)}`, 20, yPos);
      yPos += 10;
    }
    
    doc.text(`Role: ${user.role}`, 20, yPos);
    yPos += 10;
    
    doc.text(`Member Since: ${new Date(user.createdAt).toLocaleDateString()}`, 20, yPos);
    
    // Convert to bytes
    const pdfBytes = doc.output('arraybuffer');

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="profile-${user.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}