import { NextResponse } from 'next/server';
import { startCronJobs } from '@/lib/cron';

// Initialize cron job when server starts
startCronJobs();

export async function GET() {
  return NextResponse.json({ message: 'Cron jobs initialized' });
}