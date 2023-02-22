// Define Auth Tokens Interface
export interface IAuthTokens {
    sub: string;
    username: string;
    role: string;
}

// Define Auth Response Interface
export interface IAuthResponse {
    message?: string;
    access_token?: string;
    refresh_token?: string;
}
