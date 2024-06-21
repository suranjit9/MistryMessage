import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(request: Request) {
    console.log("POST request received to register user");
    await dbConnect();
    
    try {
        const { username, email, password } = await request.json()
        console.log("Request body:", { username, email, password });

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isverified: true });
        console.log("Existing user verified by username:", existingUserVerifiedByUsername);
        // UserName Verified chack for alredy have or no 
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                  success: false,
                  message: "User already exists" 
                },
                { status: 400 }
                );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Verification code:", verifyCode);
        if (existingUserVerifiedByEmail) {
          // already VerifiedByEmail 
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                      success: false,
                      message: "User already exists whit this Email" 
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
          // if no account then  at first create new user Account 
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);
            console.log(expiryDate);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifiedCode:verifyCode,
                verifiedCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();
        }
        // Send VerifiCation Email---------

        const emailResponse = await sendVerifyEmail(email, username, verifyCode);
        console.log("Email response:", emailResponse);
        if (!emailResponse.success) {
            return Response.json(
                {
                  success: false,
                  message: emailResponse.message
                },
                { status: 500 }
                );
        }

        return Response.json(
            {
              success: true,
              message: "User registered successfully. Please verify your email" 
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
