import { ApiProperty } from '@nestjs/swagger';

export class TestDto {
  @ApiProperty({
    description: 'Число от 1 до 5',
    minimum: 1,
    maximum: 5,
    default: 1,
  })
  readonly number: number;
}