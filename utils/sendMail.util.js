import { Queue, Worker } from "bullmq";
import { defaultQueueConfig, redisConnection } from "../config/queue.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

//Workers
export const handler = new Worker(
  emailQueueName,
  async (job) => {
    console.log("The email worker data is : ", job.data);
    //if passed array of user entries, send email to each user
    const data = job.data;
    data?.map(async (item) => {
      await sendEmail(item.toEmail, item.subject, item.body);
    });
  },
  { connection: redisConnection }
);

//Listeners
handler.on("completed", (job) => {
  logger.info({ job: job, message: "Job completed" });
  console.log(`Job number ${job.id} is completed`);
});

handler.on("failed", (job) => {
  console.log(`Job number ${job.id} is failed`);
});
