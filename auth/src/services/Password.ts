import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString("hex");
        const buffers = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffers.toString("hex")}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [ hashedPassword, salt ] = storedPassword.split(".");
        const buffers = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buffers.toString() === hashedPassword;
    }
}