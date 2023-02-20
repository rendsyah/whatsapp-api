export interface IAuthTokens {
    sub: string;
    username: string;
    role: string;
}

export interface IAuthResponse {
    message?: string;
    access_token?: string;
    refresh_token?: string;
}
