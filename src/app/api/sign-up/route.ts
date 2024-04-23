import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username,email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isverified: true });
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            {
              success: false,
              message: "Error registering user" 
            },

             { status: 500 }
            );
    }
}