import { ActionError, defineAction } from 'astro:actions';
import { getSecret } from 'astro:env/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Переменные окружения читаем через getSecret (серверные секреты)
function requireSecret(name: string, defaultValue?: string): string {
  const value = getSecret(name) ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export const server = {
  sendEmail: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
      contact: z.string().min(3, 'Укажите способ связи (телефон, email, Telegram)'),
      requestType: z.string().min(1),
      question: z.string().optional().default(''),
    }),
    handler: async ({ name, contact, requestType, question }) => {
      try {

        // Создаем транспорт для отправки email
        const transporter = nodemailer.createTransport({
          host: requireSecret('SMTP_HOST'),
          port: parseInt(requireSecret('SMTP_PORT', '587')),
          secure: requireSecret('SMTP_SECURE', 'false') === 'true',
          auth: {
            user: requireSecret('SMTP_USER'),
            pass: requireSecret('SMTP_PASS'),
          },
        });

        // Формируем содержимое письма
        const lines: string[] = [];
        lines.push(`Заявка: ${requestType}`);
        lines.push('');
        lines.push(`Имя: ${name}`);
        lines.push(`Контакт: ${contact}`);
        if (question && question.trim().length > 0) {
          lines.push('');
          lines.push('Вопрос:');
          lines.push(question.trim());
        }
        lines.push('');
        lines.push('---');
        lines.push(`Отправлено: ${new Date().toLocaleString('ru-RU')}`);

        const emailContent = lines.join('\n');

        // Отправляем email
        await transporter.sendMail({
          from: `"Сайт Влад - Хелс-коуч" <${requireSecret('SMTP_USER')}>`,
          to: requireSecret('RECIPIENT_EMAIL'),
          subject: `Заявка: ${requestType} — от ${name}`,
          text: emailContent,
          html: emailContent.replace(/\n/g, '<br>')
        });

        return { 
          success: true, 
          message: 'Заявка успешно отправлена! Влад свяжется с тобой в течение 24 часов.' 
        };

      } catch (error) {
        console.error('Email sending error:', error);
        
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Произошла ошибка при отправке сообщения. Попробуйте снова или свяжитесь напрямую.'
        });
      }
    }
  })
};