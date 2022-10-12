// Modules
import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

const WHATSAPP_BASE_URL = process.env.WHATSAPP_BASE_URL as string;

describe("Whatsapp API", () => {
    describe("GET /api/whatsapp", () => {
        it("should GET whatsapp api", async () => {
            const response = await request(WHATSAPP_BASE_URL).get("/");

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.data).toHaveProperty("code", 200);
            expect(response.body.data).toHaveProperty("status", "success");
        });
    });

    describe("POST /api/whatsapp/message", () => {
        it("should POST whatsapp api send text/individual message", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individual",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.data).toHaveProperty("code", 200);
            expect(response.body.data).toHaveProperty("status", "success");
            expect(response.body.data).toHaveProperty("data");
            expect(response.body.data.data).toBeDefined();
        });

        it("should POST whatsapp api send text-image/individual message", async () => {
            const data = {
                to: "6281318481635",
                type: "text-image/individual",
                body: {
                    message: "hallo",
                    link: "https://cdns.klimg.com/dream.co.id/resized/640x320/news/2021/07/27/174293/70-kata-bijak-perjuangan-jadi-penyemangat-hidup-inspirasi-gapai-impian-210727i.jpg",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(response.body.data).toHaveProperty("code", 200);
            expect(response.body.data).toHaveProperty("status", "success");
            expect(response.body.data).toHaveProperty("data");
            expect(response.body.data.data).toBeDefined();
        });

        it("should POST whatsapp api and (to) is not allowed to be empty", async () => {
            const data = {
                to: "",
                type: "text/individual",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("to");
            expect(response.body.error).toHaveProperty("detail", "to is not allowed to be empty");
        });

        it("should POST whatsapp api and (to) must have at least 8 characters", async () => {
            const data = {
                to: "12345",
                type: "text/individual",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("to");
            expect(response.body.error).toHaveProperty("detail", "to must have at least 8 characters");
        });

        it("should POST whatsapp api and (to) must be numbers with type data string", async () => {
            const data = {
                to: "6281318481635as",
                type: "text/individual",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("to");
            expect(response.body.error).toHaveProperty("detail", "to must be numbers with type data string");
        });

        it("should POST whatsapp api and (type) is required", async () => {
            const data = {
                to: "6281318481635",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("type");
            expect(response.body.error).toHaveProperty("detail", "type is required");
        });

        it("should POST whatsapp api and (type) is not allowed to be empty", async () => {
            const data = {
                to: "6281318481635",
                type: "",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("type");
            expect(response.body.error).toHaveProperty("detail", "type is not exists");
        });

        it("should POST whatsapp api and (type) is not exists", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individualsss",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("type");
            expect(response.body.error).toHaveProperty("detail", "type is not exists");
        });

        it("should POST whatsapp api and (body) is required", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individual",
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("body");
            expect(response.body.error).toHaveProperty("detail", "body is required");
        });

        it("should POST whatsapp api and (message) is required", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individual",
                body: {},
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("message");
            expect(response.body.error).toHaveProperty("detail", "message is required");
        });

        it("should POST whatsapp api and (message) is not allowed to be empty", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individual",
                body: {
                    message: "",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("message");
            expect(response.body.error).toHaveProperty("detail", "message is not allowed to be empty");
        });

        it("should POST whatsapp api and (link) is not allowed", async () => {
            const data = {
                to: "6281318481635",
                type: "text/individual",
                body: {
                    message: "hallo",
                    link: "https://google.com",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("link");
            expect(response.body.error).toHaveProperty("detail", "link is not allowed");
        });

        it("should POST whatsapp api and (link) is required", async () => {
            const data = {
                to: "6281318481635",
                type: "text-image/individual",
                body: {
                    message: "hallo",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("link");
            expect(response.body.error).toHaveProperty("detail", "link is required");
        });

        it("should POST whatsapp api and (link) is not allowed to be empty", async () => {
            const data = {
                to: "6281318481635",
                type: "text-image/individual",
                body: {
                    message: "hallo",
                    link: "",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("link");
            expect(response.body.error).toHaveProperty("detail", "link is not allowed to be empty");
        });

        it("should POST whatsapp api and (link) must be a valid uri", async () => {
            const data = {
                to: "6281318481635",
                type: "text-image/individual",
                body: {
                    message: "hallo",
                    link: "abcd.com",
                },
            };

            const response = await request(WHATSAPP_BASE_URL).post("/message").send(data);

            expect(response.status).toBe(400);
            expect(response.body.error).toBeDefined();
            expect(response.body.error).toHaveProperty("code", 400);
            expect(response.body.error).toHaveProperty("status", "Bad Request");
            expect(response.body.error).toHaveProperty("errors");
            expect(response.body.error.errors).toBeDefined();
            expect(response.body.error.errors).toHaveLength(1);
            expect(response.body.error.errors[0]).toHaveProperty("params");
            expect(response.body.error.errors[0].params).toBeDefined();
            expect(response.body.error.errors[0].params).toHaveLength(1);
            expect(response.body.error.errors[0].params[0]).toBe("link");
            expect(response.body.error).toHaveProperty("detail", "link must be a valid uri");
        });
    });
});
