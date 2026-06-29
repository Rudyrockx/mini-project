import cron from 'node-cron';
import prisma from './db';



let cronJob: ReturnType<typeof cron.schedule> | null = null;

export function startCronJobs() {
  if (cronJob) {
    console.log('Cron job already running');
    return;
  }

  // Run every minute
  cronJob = cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find all expired active plans
      const expiredSubscriptions = await prisma.userSubscription.findMany({
        where: {
          isActive: true,
          expiresAt: {
            lt: now, // Less than current time
          },
        },
      });

      if (expiredSubscriptions.length > 0) {
        // Deactivate expired plans
        await prisma.userSubscription.updateMany({
          where: {
            id: {
              in: expiredSubscriptions.map((sub) => sub.id),
            },
          },
          data: {
            isActive: false,
          },
        });

        console.log(
          `[Cron] Expired ${expiredSubscriptions.length} plan(s) at ${now.toISOString()}`
        );
      }
    } catch (error) {
      console.error('[Cron] Error expiring plans:', error);
    }
  });

  console.log('[Cron] Plan expiration job started');
}

export function stopCronJobs() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('[Cron] Plan expiration job stopped');
  }
}