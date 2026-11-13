import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageService } from "@ectd/ectd-storage";
import { STORAGE_SERVICE } from "./storage.token";

/**
 * StorageModule — global, provides StorageService via STORAGE_SERVICE token.
 *
 * spec §43: No public document buckets. No permanent direct storage URLs.
 * All file access goes through this abstraction — never expose filesystem
 * paths via the API.
 *
 * To swap to S3 in production:
 *   1. Implement S3StorageService implementing StorageService interface.
 *   2. Replace LocalStorageService with S3StorageService here.
 *   3. No changes needed in any consumer.
 */
@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: (config: ConfigService) => {
        const root = config.get<string>(
          "app.storage.root",
          "/tmp/ectd-storage",
        );
        return new LocalStorageService(root);
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
