import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { StorageModule } from '../storage/storage.module';
import { WebsiteService } from './website.service';
import { PagesService } from './pages.service';
import { ContentService } from './content.service';
import { NavigationService } from './navigation.service';
import { MediaService } from './media.service';
import { DomainsService } from './domains.service';
import { PublicationLinksService } from './publication-links.service';
import { PublicApiService } from './public-api.service';
import { InstitutionalWebController } from './institutional-web.controller';
import { PublicController } from './public.controller';

@Module({
  imports: [PrismaModule, AuditModule, StorageModule],
  providers: [
    WebsiteService,
    PagesService,
    ContentService,
    NavigationService,
    MediaService,
    DomainsService,
    PublicationLinksService,
    PublicApiService,
  ],
  controllers: [InstitutionalWebController, PublicController],
  exports: [WebsiteService, PublicApiService],
})
export class InstitutionalWebModule {}
