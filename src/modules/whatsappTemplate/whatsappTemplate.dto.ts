// Interfaces Template
export interface IRequestCreateTemplate {
    namespace: string;
    message: string;
    channelId: string;
}

export interface IRequestGetTemplate {
    id: string;
}

export interface IRequestGetAllTemplate {
    id: string;
}

export interface IRequestUpdateTemplate extends IRequestCreateTemplate {
    id: string;
}

export interface IRequestDeleteTemplate {
    id: string;
}

export interface IRequestDownloadTemplate {
    extension: string;
}

export interface IResponseTemplateService {
    data: unknown;
}
