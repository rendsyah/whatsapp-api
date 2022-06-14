import { query } from "../../../config/baseFunctions";

export const getDataNasabah = () => {
    return query("SELECT name, hp FROM waba_nasabah", []);
};

export const getDataTemplateBroadcastMessage = (status: number) => {
    return query("SELECT message FROM waba_templates WHERE status = ?", [status]);
};
