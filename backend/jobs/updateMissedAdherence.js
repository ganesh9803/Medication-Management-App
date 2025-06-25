//jobs/updateMissedAdherence.js
import cron from 'node-cron';
import prisma from '../config/prismaClient.js';

// Runs every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  const now = new Date();

  try {
    const result = await prisma.adherence.updateMany({
      where: {
        status: 'pending',
        date: {
          lt: now // before today
        }
      },
      data: {
        status: 'missed'
      }
    });

    console.log(`✅ Missed adherence updated: ${result.count} entries`);
  } catch (error) {
    console.error('❌ Error updating missed adherence:', error.message);
  }
});
