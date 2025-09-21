import jwt from "jsonwebtoken"

export default function generateAccessToken(payload:any){
    try {
        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET!);
        return accessToken;
    } catch (error) {
        throw error
    }
}