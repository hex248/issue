import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];
const JWT_ALGORITHM = "HS256";

const requireJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }
    if (secret.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters");
    }
    return secret;
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const generateToken = (userId: number) => {
    const secret = requireJwtSecret();
    return jwt.sign({ userId }, secret, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: JWT_ALGORITHM,
    });
};

export const verifyToken = (token: string) => {
    const secret = requireJwtSecret();
    return jwt.verify(token, secret, {
        algorithms: [JWT_ALGORITHM],
    }) as { userId: number };
};
