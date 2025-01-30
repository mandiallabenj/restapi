import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "IgR2k)_%T]k%)SfoS_1_W)h~MEe#N7";

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "3h" });
};

export const verifyToken = (token: string): any => {

    const secretKey = process.env.JWT_SECRET || 'IgR2k)_%T]k%)SfoS_1_W)h~MEe#N7';
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        // Handle token verification errors (e.g., expired token, invalid token)
        console.error("Token verification error:", error);
        return null; // Or throw an error if you prefer
    }
};