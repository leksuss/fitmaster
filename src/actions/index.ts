import { ActionError, defineAction } from 'astro:actions';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Функция для получения переменной окружения
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
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
      contact: z.string().min(3, 'Укажите способ связи (телефон, email, Telegram)')
    }),
    handler: async ({ name, contact }) => {
      try {

        // Создаем транспорт для отправки email
        const transporter = nodemailer.createTransport({
          host: getEnvVar('SMTP_HOST'),
          port: parseInt(getEnvVar('SMTP_PORT', '587')),
          secure: getEnvVar('SMTP_SECURE', 'false') === 'true',
          auth: {
            user: getEnvVar('SMTP_USER'),
            pass: getEnvVar('SMTP_PASS')
          }
        });

        // Формируем содержимое письма
        const emailContent = `
Новая заявка на консультацию с сайта

Имя: ${name}
Контакт: ${contact}

---
Отправлено: ${new Date().toLocaleString('ru-RU')}
        `.trim();

        // Отправляем email
        await transporter.sendMail({
          from: `"Сайт Влад - Хелс-коуч" <${getEnvVar('SMTP_USER')}>`,
          to: getEnvVar('RECIPIENT_EMAIL'),
          subject: `Новое сообщение от ${name}`,
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