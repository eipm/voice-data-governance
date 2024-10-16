import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

export const createGetAbsolutePath = (importMetaUrl) => (relativePath) => {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = dirname(__filename);
    const absolutePath = resolve(__dirname, relativePath);
    return absolutePath;
};
