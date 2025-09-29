import { Injectable } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { User } from '../../domain/entities/user.entity';
import { Business } from '../../domain/entities/business.entity';

export interface NotificationData {
  type: 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'RESERVATION_REMINDER' | 'RESERVATION_UPDATED';
  reservation: Reservation;
  user: User;
  business: Business;
  message?: string;
  channels: ('email' | 'sms' | 'whatsapp')[];
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  messageId?: string;
  error?: string;
}

@Injectable()
export class NotificationService {
  async sendNotification(data: NotificationData): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const channel of data.channels) {
      try {
        const result = await this.sendToChannel(channel, data);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          channel,
          error: error.message
        });
      }
    }

    return results;
  }

  async sendReservationConfirmation(reservation: Reservation, user: User, business: Business): Promise<NotificationResult[]> {
    const message = this.generateConfirmationMessage(reservation, business);
    
    return await this.sendNotification({
      type: 'RESERVATION_CONFIRMED',
      reservation,
      user,
      business,
      message,
      channels: ['email', 'whatsapp']
    });
  }

  async sendReservationCancellation(reservation: Reservation, user: User, business: Business): Promise<NotificationResult[]> {
    const message = this.generateCancellationMessage(reservation, business);
    
    return await this.sendNotification({
      type: 'RESERVATION_CANCELLED',
      reservation,
      user,
      business,
      message,
      channels: ['email', 'whatsapp']
    });
  }

  async sendReservationReminder(reservation: Reservation, user: User, business: Business): Promise<NotificationResult[]> {
    const message = this.generateReminderMessage(reservation, business);
    
    return await this.sendNotification({
      type: 'RESERVATION_REMINDER',
      reservation,
      user,
      business,
      message,
      channels: ['email', 'sms']
    });
  }

  async sendReservationUpdate(reservation: Reservation, user: User, business: Business, changes: string): Promise<NotificationResult[]> {
    const message = this.generateUpdateMessage(reservation, business, changes);
    
    return await this.sendNotification({
      type: 'RESERVATION_UPDATED',
      reservation,
      user,
      business,
      message,
      channels: ['email', 'whatsapp']
    });
  }

  private async sendToChannel(channel: string, data: NotificationData): Promise<NotificationResult> {
    switch (channel) {
      case 'email':
        return await this.sendEmail(data);
      case 'sms':
        return await this.sendSMS(data);
      case 'whatsapp':
        return await this.sendWhatsApp(data);
      default:
        throw new Error(`Unsupported notification channel: ${channel}`);
    }
  }

  private async sendEmail(data: NotificationData): Promise<NotificationResult> {
    // TODO: Implementar integración con servicio de email (SendGrid, AWS SES, etc.)
    console.log(`📧 Email sent to ${data.user.email.value}: ${data.message}`);
    
    return {
      success: true,
      channel: 'email',
      messageId: `email_${Date.now()}`
    };
  }

  private async sendSMS(data: NotificationData): Promise<NotificationResult> {
    // TODO: Implementar integración con servicio de SMS (Twilio, AWS SNS, etc.)
    console.log(`📱 SMS sent to ${data.user.phone?.value || 'N/A'}: ${data.message}`);
    
    return {
      success: true,
      channel: 'sms',
      messageId: `sms_${Date.now()}`
    };
  }

  private async sendWhatsApp(data: NotificationData): Promise<NotificationResult> {
    // TODO: Implementar integración con WhatsApp Business API
    console.log(`💬 WhatsApp sent to ${data.user.phone?.value || 'N/A'}: ${data.message}`);
    
    return {
      success: true,
      channel: 'whatsapp',
      messageId: `whatsapp_${Date.now()}`
    };
  }

  private generateConfirmationMessage(reservation: Reservation, business: Business): string {
    const startDate = new Date(reservation.startDate).toLocaleDateString('es-ES');
    const endDate = new Date(reservation.endDate).toLocaleDateString('es-ES');
    const totalAmount = `${reservation.totalAmount.amount} ${reservation.totalAmount.currency}`;

    if (reservation.type === 'HOTEL') {
      return `
🏨 ¡Reserva confirmada en ${business.name}!

📅 Check-in: ${startDate}
📅 Check-out: ${endDate}
👥 Huéspedes: ${reservation.guests}
💰 Total: ${totalAmount}
🆔 Código de reserva: ${reservation.id}

¡Esperamos verte pronto! Si tienes alguna pregunta, no dudes en contactarnos.

Gracias por elegir ${business.name}.
      `.trim();
    } else {
      return `
🍽️ ¡Reserva confirmada en ${business.name}!

📅 Fecha: ${startDate}
🕐 Hora: ${new Date(reservation.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
👥 Comensales: ${reservation.guests}
💰 Total: ${totalAmount}
🆔 Código de reserva: ${reservation.id}

¡Esperamos verte pronto! Si tienes alguna pregunta, no dudes en contactarnos.

Gracias por elegir ${business.name}.
      `.trim();
    }
  }

  private generateCancellationMessage(reservation: Reservation, business: Business): string {
    const startDate = new Date(reservation.startDate).toLocaleDateString('es-ES');
    const totalAmount = `${reservation.totalAmount.amount} ${reservation.totalAmount.currency}`;

    return `
❌ Reserva cancelada en ${business.name}

📅 Fecha: ${startDate}
🆔 Código de reserva: ${reservation.id}
💰 Reembolso: ${totalAmount}

Tu reembolso será procesado en 3-5 días hábiles.

Si tienes alguna pregunta, no dudes en contactarnos.

Gracias por elegir ${business.name}.
    `.trim();
  }

  private generateReminderMessage(reservation: Reservation, business: Business): string {
    const startDate = new Date(reservation.startDate).toLocaleDateString('es-ES');
    const startTime = new Date(reservation.startDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    if (reservation.type === 'HOTEL') {
      return `
🏨 Recordatorio de reserva - ${business.name}

📅 Check-in: ${startDate}
👥 Huéspedes: ${reservation.guests}
🆔 Código de reserva: ${reservation.id}

¡Te esperamos mañana! Si necesitas hacer algún cambio, contáctanos.

Gracias por elegir ${business.name}.
      `.trim();
    } else {
      return `
🍽️ Recordatorio de reserva - ${business.name}

📅 Fecha: ${startDate}
🕐 Hora: ${startTime}
👥 Comensales: ${reservation.guests}
🆔 Código de reserva: ${reservation.id}

¡Te esperamos mañana! Si necesitas hacer algún cambio, contáctanos.

Gracias por elegir ${business.name}.
      `.trim();
    }
  }

  private generateUpdateMessage(reservation: Reservation, business: Business, changes: string): string {
    const startDate = new Date(reservation.startDate).toLocaleDateString('es-ES');
    const totalAmount = `${reservation.totalAmount.amount} ${reservation.totalAmount.currency}`;

    return `
📝 Reserva actualizada - ${business.name}

📅 Fecha: ${startDate}
🆔 Código de reserva: ${reservation.id}
💰 Total: ${totalAmount}

Cambios realizados:
${changes}

Si tienes alguna pregunta, no dudes en contactarnos.

Gracias por elegir ${business.name}.
    `.trim();
  }
}



