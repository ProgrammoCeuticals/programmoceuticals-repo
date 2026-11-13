import { Module } from "@nestjs/common";
import { KeywordsController } from "./keywords.controller";
import { KeywordsService } from "./keywords.service";

/**
 * Keywords module — spec §19.
 *
 * KeywordDefinitions are application-scoped.
 * ContextKeywords assign keyword values to Contexts of Use.
 * Keyword identity is part of context group normalization — spec §15.
 */
@Module({
  controllers: [KeywordsController],
  providers: [KeywordsService],
  exports: [KeywordsService],
})
export class KeywordsModule {}
