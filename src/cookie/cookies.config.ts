import { registerAs } from '@nestjs/config';

export const TEST_CONFIG_KEY = 'test';

export default registerAs(TEST_CONFIG_KEY, () => ({
  test: 123,
}));