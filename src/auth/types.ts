export type PermissionsType = {
    isUser: boolean,
    isDispatcher: boolean,
    isAdmin: boolean;
};

export type LoginTypeResponse = {
    userId: number;
    permissions: PermissionsType;
};

export type JwtTokenType = {
    accessToken: string;
    refreshToken: string;
};

export type JwtPayload = {
  sub: number;
  username: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };