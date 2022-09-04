// Modules
import { NextFunction, Request, Response } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";
import appRoot from "app-root-path";

// Interfaces
import { IResponseApiError } from "../../config/lib/baseFunctions.interface";

// Providers
import { validateRequestMoment, randomCharacters, responseApiError } from "../../config/lib/baseFunctions";

// Upload Environments
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH;
const SIZE_FILE_MB = process.env.SIZE_FILE_MB ?? 0;

// Upload Middleware
export const whatsappUpload = (media: string) => {
    const storage = diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb): void => {
            cb(null, `${appRoot}/..${WHATSAPP_UPLOAD_PATH}`);
        },
        filename: (req: Request, file: Express.Multer.File, cb): void => {
            const filename = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
            cb(null, `${filename}.${file.originalname.split(".")[1]}`);
        },
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
        if (file.fieldname === "file" && !file.originalname.match(/\.(xlsx|csv)$/i)) {
            return cb(new Error("file not allowed!"));
        }
        if (file.fieldname === "image" && !file.originalname.match(/\.(jpe?g|png)$/i)) {
            return cb(new Error("image not allowed!"));
        }
        cb(null, true);
    };

    const maxSize = +SIZE_FILE_MB * 1000 * 1000;

    const uploadMedia = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).single(media);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            uploadMedia(req, res, (error) => {
                if (!req.file) {
                    const requestApiError = {
                        code: 400,
                        message: `${error ? error.message : "parameter not valid!"}`,
                        params: [],
                        detail: "",
                    };
                    return res.status(400).send(responseApiError(requestApiError as IResponseApiError));
                }
                if (error && error.code === "LIMIT_FILE_SIZE") {
                    const requestApiError = {
                        code: 400,
                        message: "maximum size file 10MB",
                        params: [],
                        detail: "",
                    };
                    return res.status(400).send(responseApiError(requestApiError as IResponseApiError));
                }
                return next();
            });
        } catch (error) {
            next(error);
        }
    };
};
