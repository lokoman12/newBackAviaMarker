export type PermissionsType = {
    isUser: boolean,
    isDispatcher: boolean,
    isAdmin: boolean;
};

export type LoginTypeResponse = {
    userId: number;
    permissions: PermissionsType;
};