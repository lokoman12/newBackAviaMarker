export type PermissionsType = {
    isUser: boolean,
    isDispatcher: boolean,
    isAdmin: boolean;
};

export type SignInDataType = {
    userId: number;
    accessToken: string;
};

export type LoginTypeResponse = {
    username: string,
    userId: number;
    accessToken: string;
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