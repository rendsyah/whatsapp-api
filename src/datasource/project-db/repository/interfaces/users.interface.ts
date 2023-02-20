export interface IGetOneUser {
    username: string;
}

export interface ICreateUser {
    username: string;
    password: string;
    role: string;
}

export interface IUpdateUserLogin {
    id: string;
    hashToken: string;
}
