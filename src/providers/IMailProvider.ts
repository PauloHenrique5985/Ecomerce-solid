export interface MailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface MailResult {
  /** Link para visualizar o e-mail (disponível em ambientes de teste como o Ethereal). */
  previewUrl?: string;
}

export interface IMailProvider {
  sendMail(message: MailMessage): Promise<MailResult>;
}
