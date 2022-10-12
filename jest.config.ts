import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
    preset: "ts-jest",
    verbose: true,
    bail: 1,
};

export default jestConfig;
