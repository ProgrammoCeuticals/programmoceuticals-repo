import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: Transporter;
  private from!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const host = this.config.get<string>('SMTP_HOST', 'smtp.example.com');
    const port = this.config.get<number>('SMTP_PORT', 587);
    const user = this.config.get<string>('SMTP_USER', '');
    const pass = this.config.get<string>('SMTP_PASS', '');
    this.from = this.config.get<string>('SMTP_FROM', 'noreply@rims.io');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass } : undefined,
    });
  }

  async sendMail(opts: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      });
      this.logger.log(`[EMAIL] Sent "${opts.subject}" → ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `[EMAIL] Failed to send "${opts.subject}" → ${opts.to}: ${(err as Error).message}`,
      );
      throw err;
    }
  }

  // ── Typed helpers ──────────────────────────────────────────────────────────

  async sendInvitation(to: string, token: string, appUrl: string): Promise<void> {
    const link = `${appUrl}/accept-invitation/${token}`;
    await this.sendMail({
      to,
      subject: 'You have been invited to RIMS',
      html: `
        <p>You have been invited to join RIMS.</p>
        <p><a href="${link}">Accept Invitation</a></p>
        <p>This link expires in 48 hours.</p>
      `,
    });
  }

  async sendPasswordReset(to: string, token: string, appUrl: string): Promise<void> {
    const link = `${appUrl}/reset-password/${token}`;
    await this.sendMail({
      to,
      subject: 'Reset your RIMS password',
      html: `
        <p>A password reset was requested for your account.</p>
        <p><a href="${link}">Reset Password</a></p>
        <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
      `,
    });
  }

  async sendWorkflowNotification(opts: {
    to: string;
    title: string;
    body: string;
    actionUrl?: string;
    appUrl: string;
  }): Promise<void> {
    const actionHtml = opts.actionUrl
      ? `<p><a href="${opts.appUrl}${opts.actionUrl}">View in RIMS</a></p>`
      : '';
    await this.sendMail({
      to: opts.to,
      subject: opts.title,
      html: `<p>${opts.body}</p>${actionHtml}`,
    });
  }
}
