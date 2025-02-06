import fs from 'fs';

export class JsonReader {
    static readJson(path) {
        try {
            const data = fs.readFileSync(path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading JSON file at ${path}: ${error.message}`);
            return null;
        }
    }
}

