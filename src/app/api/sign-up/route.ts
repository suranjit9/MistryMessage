import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username,email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isverified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                  success: false,
                  message: "User already exists" 
                },
                { status: 400 }
                );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email, isverified: true });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByEmail) {
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                      success: false,
                      message: "User already exists" 
                    },
                    { status: 400 }
                    );  
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifiedCode = verifyCode;
                existingUserVerifiedByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifiedCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();
        }

        const emailResponse = await sendVerifyEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                  success: false,
                  message: "Error sending email" 
                },
                { status: 500 }
                );
        }

        return Response.json(
            {
              success: true,
              message: "User registered successfully" 
            },
            { status: 200 }
            );
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