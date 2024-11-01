export type PermissionsType = {
    isEngineer: boolean,
    isDispatcher: boolean,
    isDirector: boolean;
};

export type SignInDataType = {
    userId: number;
    accessToken: string;
    permissions?: PermissionsType;
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