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
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials (SMTP_USER/SMTP_PASS) are not configured in environment variables.');
    }

    const transporter = createTransport();
    
    // Define admin notification email
    const adminMail = transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'prajwalchaudhari89@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `New Portfolio Contact Message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from Portfolio Contact Form`,
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

    // Define visitor confirmation email
    const visitorMail = transporter.sendMail({
      from: `"Prajwal Chaudhari" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Message Received Successfully - Thank you for contacting me`,
      text: `Hi ${name},\n\nThank you for reaching out. I have successfully received your message and will review it shortly. You can expect a response within 24-48 hours.\n\nCOPY OF YOUR MESSAGE:\n"${message}"\n\nIf you need to add details, simply reply to this email.\n\nBest regards,\nPrajwal Chaudhari\nFull Stack Developer`,
      html: `
        <div style="font-family: monospace; background: #030712; color: #f3f4f6; padding: 40px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1f2937;">
          <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); height: 4px; border-radius: 4px 4px 0 0; margin: -40px -20px 40px -20px;"></div>
          
          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #22d3ee; text-align: center;">
            Message Received Successfully
          </h1>
          <p style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px; text-align: center;">
            Thank you for contacting me
          </p>

          <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin-bottom: 20px;">
            Hi <strong>${name}</strong>,
          </p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin-bottom: 24px;">
            Thank you for reaching out. I have successfully received your message and will review it shortly. You can expect a response within 24-48 hours.
          </p>

          <div style="background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: left;">
            <h3 style="color: #22d3ee; font-size: 12px; margin-top: 0; margin-bottom: 12px; letter-spacing: 1px;">
              COPY OF YOUR MESSAGE:
            </h3>
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
              "${message}"
            </p>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 32px;">
            If you need to add details, simply reply to this email.
          </p>

          <hr style="border: 0; border-top: 1px solid #1f2937; margin-bottom: 24px;" />

          <p style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 4px; letter-spacing: 1px;">
            Prajwal Chaudhari
          </p>
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px 0;">
            Full Stack Developer
          </p>
        </div>
      `,
    });

    // Send both in parallel
    await Promise.all([adminMail, visitorMail]);

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
