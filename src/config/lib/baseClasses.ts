export class ErrorException extends Error {
    public code: number;
    public status: string;

    constructor(public readonly params: string, public readonly detail: string) {
        super();
        this.code = 0;
        this.status = "";
        this.params = params;
        this.detail = detail;
    }
}

export class InternalServerErrorException extends ErrorException {
    constructor(public readonly params: string, public readonly detail: string) {
        super(params, detail);
        this.code = 500;
        this.status = "Internal Server Error";
        this.params = params;
        this.detail = detail;
    }
}

export class NotFoundException extends ErrorException {
    constructor(public readonly params: string, public readonly detail: string) {
        super(params, detail);
        this.code = 404;
        this.status = "Not Found";
        this.params = params;
        this.detail = detail;
    }
}

export class BadRequestException extends ErrorException {
    constructor(public readonly params: string, public readonly detail: string) {
        super(params, detail);
        this.code = 400;
        this.status = "Bad Request";
        this.params = params;
        this.detail = detail;
    }
}
