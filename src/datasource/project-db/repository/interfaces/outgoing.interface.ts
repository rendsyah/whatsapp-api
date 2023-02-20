export interface ICreateOutgoing {
    mediaId: number;
    from: string;
    to: string;
    message: string;
    attachment: string;
    sentTime: string;
    status: string;
    isAck: number;
}

export interface IUpdateManySentOutgoing {
    to: string;
    status: string;
    isAck: number;
}

export interface IUpdateManyReadOutgoing extends IUpdateManySentOutgoing {}
