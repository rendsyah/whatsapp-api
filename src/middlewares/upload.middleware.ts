// Modules
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import appRootPath from "app-root-path";

// Interfaces
import { IRequestDataError } from "../config/lib/base.dto";

// Commons
import { validateRequestMoment, randomCharacters, responseApiError } from "../config/lib/baseFunctions";

// Upload Environments
const WHATSAPP_UPLOAD_PATH = process.env.WHATSAPP_UPLOAD_PATH as string;
const WHATSAPP_SIZE_FILE_MB = process.env.WHATSAPP_SIZE_FILE_MB as string;

// Upload Middleware
export const whatsappUpload = (media: string) => {
    const storage = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb): void => {
            cb(null, `${appRootPath}/..${WHATSAPP_UPLOAD_PATH}`);
        },
        filename: (req: Request, file: Express.Multer.File, cb): void => {
            const filename = `${validateRequestMoment(new Date(), "datetime2")}_${randomCharacters(5, "alphanumeric")}`;
            cb(null, `${filename}.${file.originalname.split(".")[1]}`);
        },
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
        if (file.fieldname === "file" && !file.originalname.match(/\.(xlsx|csv)$/i)) {
            return cb(new Error("file not allowed!"));
        }
        if (file.fieldname === "image" && !file.originalname.match(/\.(jpe?g|png)$/i)) {
            return cb(new Error("image not allowed!"));
        }

        cb(null, true);
    };

    const maxSize = +WHATSAPP_SIZE_FILE_MB * 1000 * 1000;

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
                if (!req.file || (error && error.code === "LIMIT_FILE_SIZE")) {
                    const requestResponseData: IRequestDataError = {
                        code: 400,
                        status: "Bad Request",
                        params: "",
                        detail: error?.message ?? "",
                    };

                    return res.status(400).send(responseApiError(requestResponseData));
                }

                return next();
            });
        } catch (error) {
            next(error);
        }
    };
};
