export enum HttpResponseStatus {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
    BadGateway = 502,
}

export enum MediaTypes {
    image = "image",
    video = "video",
    application = "docs",
}
