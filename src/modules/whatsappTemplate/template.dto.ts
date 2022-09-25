// Interfaces Template
export interface IWhatsappTemplateCreate {
    namespace: string;
    message: string;
}

export interface IWhatsappTemplateGet {
    id: string;
}

export interface IWhatsappTemplateGetAll {
    id: string;
}

export interface IWhatsappTemplateUpdate extends IWhatsappTemplateCreate {
    id: string;
}

export interface IWhatsappTemplateDelete {
    id: string;
}

export interface IWhatsappTemplateDownload {
    extension: string;
}
