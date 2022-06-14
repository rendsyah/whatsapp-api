export const replaceMessage = (message: string, name: string): string => {
    return message.replace("{1}", name.split(" ")[0]);
};

export const replaceHp = (hp: string): string => {
    const checkNumberHp = hp.substring(0, 2);

    if (checkNumberHp === "62") return hp + "@c.us";
    return hp.replace(checkNumberHp, "628") + "@c.us";
};
