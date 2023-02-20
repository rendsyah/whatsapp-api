export interface ICreateIncoming {
    mediaId: number;
    from: string;
    to: string;
    message: string;
    attachment: string;
    rcvdTime: string;
    platform: string;
    status: string;
    isAck: number;
}
