import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


class FilePathResolver {

    getFilePath(fileName) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, 'data', fileName);

        if (fs.existsSync(filePath)) {
            console.log(`File exists at: ${filePath}`);
            return filePath;
        } else {
            throw new Error(`File not found at: ${filePath}`);
        }
    }
}

export const filePathResolver = new FilePathResolver();
