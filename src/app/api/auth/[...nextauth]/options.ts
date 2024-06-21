import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions} from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOption : NextAuthOptions={
    
    providers:[
        CredentialsProvider(
            {
                id:"Credentials",
                name:"Credentials",
                credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials:any):Promise<any>{
                    await dbConnect()
                    try {
                    const user = await UserModel.findOne({
                    // Note Find user or email for sign in Purpas
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier}

                            ]
                        })
                        if(!user){
                            throw new Error("No user found With Email")
                        }
                        if(user.isVerified){
                            throw new Error("Please Verified your E-mail")
                        }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect Password");
                    }
                    } catch (error:any) {
                        throw new Error(error)
                    }
                }
            })
    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username
            }
            return session
        }
        },
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAURH_SECRET, 
}



