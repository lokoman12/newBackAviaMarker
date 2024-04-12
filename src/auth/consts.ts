import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
  secret: '19e81c80-a507-462c-b242-5e1170b37888',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
