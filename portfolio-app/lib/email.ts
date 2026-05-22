import nodemailer from 'nodemailer';
import { readData, writeData } from './data';
import type { EmailLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create nodemailer transport
 */
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send contact email
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<EmailLog> {
  const log: EmailLog = {
    id: uuidv4(),
    name,
    email,
    message,
    status: 'success',
    timestamp: new Date().toISOString(),
  };

  try {
    // Only attempt to send if SMTP credentials are configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = createTransport();
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <div style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 32px; border-radius: 12px;">
            <h2 style="color: #22d3ee; border-bottom: 1px solid #333; padding-bottom: 16px;">
              New Contact Message
            </h2>
            <p><strong style="color: #a855f7;">Name:</strong> ${name}</p>
            <p><strong style="color: #a855f7;">Email:</strong> ${email}</p>
            <div style="margin-top: 16px; padding: 16px; background: #111; border-left: 3px solid #22d3ee; border-radius: 4px;">
              <p style="color: #d4d4d4; line-height: 1.6;">${message}</p>
            </div>
            <p style="margin-top: 24px; color: #666; font-size: 12px;">
              Sent from Portfolio Contact Form
            </p>
          </div>
        `,
      });
    }

    log.status = 'success';
  } catch (error) {
    log.status = 'failed';
    log.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Save email log
  const logs = readData<EmailLog[]>('emails.json');
  logs.unshift(log);
  writeData('emails.json', logs);

  return log;
}
