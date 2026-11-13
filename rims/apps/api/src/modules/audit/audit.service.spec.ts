import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditService', () => {
  let service: AuditService;
  let prismaMock: {
    auditEvent: {
      create: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      auditEvent: {
        create: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  describe('log', () => {
    it('creates an audit event record', async () => {
      prismaMock.auditEvent.create.mockResolvedValue({ id: 'audit-id' });

      await service.log({
        tenantId: 'tenant-uuid',
        actorId: 'user-uuid',
        action: 'USER_LOGIN',
        resourceType: 'User',
        resourceId: 'user-uuid',
        outcome: 'SUCCESS' as any,
      });

      expect(prismaMock.auditEvent.create).toHaveBeenCalledTimes(1);
    });

    it('never throws even when prisma throws', async () => {
      prismaMock.auditEvent.create.mockRejectedValue(new Error('DB connection lost'));

      // Must not throw
      await expect(
        service.log({
          tenantId: 'tenant-uuid',
          action: 'TEST_ACTION',
          resourceType: 'Test',
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe('list', () => {
    it('returns paginated result', async () => {
      const events = [{ id: 'e1', action: 'LOGIN', createdAt: new Date() }];
      prismaMock.auditEvent.count.mockResolvedValue(1);
      prismaMock.auditEvent.findMany.mockResolvedValue(events);

      const result = await service.list('tenant-uuid', 1, 20, {}, 'req-id');

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(20);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.requestId).toBe('req-id');
    });
  });
});
