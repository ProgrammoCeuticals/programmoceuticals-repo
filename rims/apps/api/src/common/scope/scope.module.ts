import { Global, Module } from '@nestjs/common';
import { ScopeContextService } from './scope-context.service';

@Global()
@Module({
  providers: [ScopeContextService],
  exports: [ScopeContextService],
})
export class ScopeModule {}
