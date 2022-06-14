import { connection } from "./database/connectionDb";

export const query = (query: string, params: any[]) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
            if (err) {
                return reject({
                    query,
                    params,
                    err,
                });
            }
            return resolve(res);
        });
    });
};
