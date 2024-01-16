import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestDto } from './test.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('test')
@ApiTags('test')
export class TestController {
  @Get()
  @ApiOperation({ summary: 'Получить приветствие по числу' })
  @ApiResponse({ status: 200, description: 'Успешный ответ' })
  @ApiResponse({ status: 400, description: 'Некорректное значение числа' })
  getHello(@Query() testDto: TestDto): string {
    const numericValue = testDto.number;

    if (isNaN(numericValue) || numericValue < 1 || numericValue > 5) {
      throw new HttpException('Пожалуйста, введите число от 1 до 5.', HttpStatus.BAD_REQUEST);
    }

    const phrases = [
      'Привет!',
      'Здравствуйте!',
      'Добрый день!',
      'Приветствую!',
      'Здорово!',
    ];

    return phrases[numericValue - 1];
  }
}