import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { KeywordsService } from "./keywords.service";
import {
  CreateKeywordDefinitionDto,
  AssignKeywordDto,
} from "./dto/keyword.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";

/**
 * Keywords controller — spec §19.
 */
@ApiTags("Keywords")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard)
@Controller()
export class KeywordsController {
  constructor(private readonly service: KeywordsService) {}

  @Post("applications/:appId/keyword-definitions")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a keyword definition for an application" })
  createDefinition(
    @Param("appId") appId: string,
    @Body() dto: CreateKeywordDefinitionDto,
  ) {
    return this.service.createDefinition(appId, dto);
  }

  @Get("applications/:appId/keyword-definitions")
  @ApiOperation({ summary: "List keyword definitions for an application" })
  getDefinitions(@Param("appId") appId: string) {
    return this.service.getDefinitions(appId);
  }

  @Get("keyword-definitions/:id")
  @ApiOperation({ summary: "Get a keyword definition by ID" })
  getDefinition(@Param("id") id: string) {
    return this.service.getDefinitionById(id);
  }

  @Post("contexts-of-use/:couId/keywords")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Assign a keyword value to a Context of Use",
    description:
      "Keyword identity contributes to context group identity — spec §15.",
  })
  assignKeyword(@Param("couId") couId: string, @Body() dto: AssignKeywordDto) {
    return this.service.assignKeyword(couId, dto);
  }

  @Get("contexts-of-use/:couId/keywords")
  @ApiOperation({ summary: "Get all keywords assigned to a Context of Use" })
  getKeywords(@Param("couId") couId: string) {
    return this.service.getKeywordsForCou(couId);
  }

  @Delete("contexts-of-use/:couId/keywords/:defId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Remove a keyword assignment from a Context of Use",
  })
  removeKeyword(@Param("couId") couId: string, @Param("defId") defId: string) {
    return this.service.removeKeyword(couId, defId);
  }
}
