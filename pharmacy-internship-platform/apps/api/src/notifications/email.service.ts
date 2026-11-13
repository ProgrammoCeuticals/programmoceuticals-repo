import { Injectable, Logger } from '@nestjs/common';

/**
 * EmailService — stub for Phase 1.
 *
 * In production, replace the console logging with a real provider:
 *   - EMAIL_PROVIDER=sendgrid → SendGrid
 *   - EMAIL_PROVIDER=ses      → AWS SES
 *   - EMAIL_PROVIDER=smtp     → Nodemailer SMTP
 *
 * The method signatures are the stable interface; only the send implementation changes.
 * All methods are fire-and-forget in callers — do NOT await them in business transactions.
 * Use the NotificationOutbox instead for reliable delivery.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly provider = process.env['EMAIL_PROVIDER'] ?? 'console';
  private readonly fromAddress = process.env['EMAIL_FROM'] ?? 'noreply@pharmintern.ng';
  private readonly fromName = process.env['EMAIL_FROM_NAME'] ?? 'PharmIntern NG';

  async sendEmailVerification(toEmail: string, token: string): Promise<void> {
    const link = `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'}/verify-email?token=${token}`;
    this.log('email_verification', toEmail, { link });
  }

  async sendPasswordReset(toEmail: string, token: string): Promise<void> {
    const link = `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'}/reset-password?token=${token}`;
    this.log('password_reset', toEmail, { link });
  }

  async sendApplicationReceived(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('application_received', toEmail, context);
  }

  async sendApplicationStatusChanged(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('application_status_changed', toEmail, context);
  }

  async sendOfferIssued(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('offer_issued', toEmail, context);
  }

  async sendOfferAccepted(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('offer_accepted', toEmail, context);
  }

  async sendOfferDeclined(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('offer_declined', toEmail, context);
  }

  async sendOfferExpired(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('offer_expired', toEmail, context);
  }

  async sendCompetingApplicationClosed(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('competing_application_closed', toEmail, context);
  }

  async sendVerificationStatusChanged(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('verification_status_changed', toEmail, context);
  }

  async sendInterviewInvitation(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('interview_invitation', toEmail, context);
  }

  async sendPlacementCreated(toEmail: string, context: Record<string, unknown>): Promise<void> {
    this.log('placement_created', toEmail, context);
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private log(template: string, toEmail: string, context: Record<string, unknown>): void {
    if (this.provider === 'console') {
      this.logger.log(
        `[EMAIL STUB] from=${this.fromName} <${this.fromAddress}> ` +
        `to=${toEmail} template=${template} ctx=${JSON.stringify(context)}`,
      );
    }
    // TODO: implement real providers here
  }
}
