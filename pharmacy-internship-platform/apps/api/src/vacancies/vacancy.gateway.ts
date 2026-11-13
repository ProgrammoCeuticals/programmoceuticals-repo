import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * VacancyGateway
 *
 * Broadcasts committed vacancy count changes to all connected clients.
 *
 * IMPORTANT: WebSocket events are UI hints only. Clients must refetch
 * authoritative counts from GET /vacancies/:id/counts after reconnecting.
 * Never use WS events alone for critical business decisions.
 */
@WebSocketGateway({
  cors: {
    origin: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
      .split(',')
      .map((o: string) => o.trim()),
    credentials: true,
  },
  namespace: '/ws/v1',
})
export class VacancyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(VacancyGateway.name);

  handleConnection(client: Socket) {
    this.logger.debug(`WS connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`WS disconnected: ${client.id}`);
  }

  /** Called after any committed vacancy count change */
  broadcastCounts(vacancy: {
    id: string;
    totalPositions: number;
    reservedPositions: number;
    confirmedPositions: number;
    updatedAt: Date;
  }) {
    const payload = {
      vacancyId: vacancy.id,
      totalPositions: vacancy.totalPositions,
      reservedPositions: vacancy.reservedPositions,
      confirmedPositions: vacancy.confirmedPositions,
      availablePositions:
        vacancy.totalPositions - vacancy.reservedPositions - vacancy.confirmedPositions,
    };
    this.server.emit('vacancy.counts.updated', payload);
  }

  broadcastApplicationStatus(applicationId: string, status: string) {
    this.server.emit('application.status.updated', { applicationId, status });
  }

  broadcastOfferStatus(offerId: string, status: string) {
    this.server.emit('offer.status.updated', { offerId, status });
  }

  broadcastNewNotification(userId: string, notificationId: string, title: string | null, eventType: string) {
    // Emit to user-specific room — client must join room `user:${userId}` on connect
    this.server.to(`user:${userId}`).emit('notification.new', {
      notificationId,
      title,
      eventType,
    });
  }
}
