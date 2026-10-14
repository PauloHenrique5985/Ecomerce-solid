import nodemailer from 'nodemailer';
import { IMailProvider, MailMessage, MailResult } from './IMailProvider';
import { getMailClient } from '../lib/mail';

/** Única classe que conhece o Nodemailer/Ethereal. */
export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<MailResult> {
    const mailer = await getMailClient();
    const info = await mailer.sendMail(message);

    // getTestMessageUrl retorna `false` quando não há preview disponível
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    return { previewUrl };
  }
}
