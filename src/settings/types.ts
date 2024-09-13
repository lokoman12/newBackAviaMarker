import { PartialType, OmitType, PickType, IntersectionType } from '@nestjs/mapped-types';
import { ISetting } from "src/db/models/settings";

export class SettingsDto implements ISetting {
  id: number;
  name: string;
  username: string;
  groupname: string;
  value: string;
}

export class CreateSettingsDto extends PickType(SettingsDto, ['name', 'username', 'groupname', 'value'] as const) { }

export class UpdateSettingsDto extends IntersectionType(
  PickType(SettingsDto, ['id',] as const),
  PartialType(PickType(SettingsDto, ['name', 'username', 'groupname', 'value'] as const))
) { };
