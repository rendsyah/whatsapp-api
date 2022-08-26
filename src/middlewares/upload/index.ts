import { NextFunction, Request, Response } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";
import appRoot from "app-root-path";

import { validateRequestMoment, randomString, responseApiError } from "../../config/lib/baseFunctions";

const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH;
const SIZE_FILE_MB = process.env.SIZE_FILE_MB ?? 0;

export const whatsappUpload = (media: string) => {
    const storage = diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb): void => {
            cb(null, `${appRoot}/..${WHATSAPP_UPLOAD_PATH}`);
        },
        filename: (req: Request, file: Express.Multer.File, cb): void => {
            const filename = `${validateRequestMoment(new Date(), "datetime2")}_${randomString(5)}`;
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
                    return res.status(400).send(responseApiError(400, `${error ? error.message : "parameter not valid!"}`, [], ""));
                }
                if (error && error.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).send(responseApiError(400, "maximum size file 10MB", [], ""));
                }
                return next();
            });
        } catch (error) {
            next(error);
        }
    };
};
