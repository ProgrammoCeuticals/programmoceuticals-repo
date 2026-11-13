class EmailService {
  async sendConfirmation(reg) {
    console.log(`[EMAIL SKIPPED] Confirmation → ${reg.email}`);
  }

  async sendProofReceived(reg) {
    console.log(`[EMAIL SKIPPED] Proof received → ${reg.email}`);
  }

  async sendRejection(reg, reason) {
    console.log(`[EMAIL SKIPPED] Rejection → ${reg.email} | Reason: ${reason}`);
  }

  async sendAdminNotification(reg) {
    console.log(`[EMAIL SKIPPED] Admin notification → ${reg.surname} ${reg.firstname}`);
  }
}

module.exports = new EmailService();
