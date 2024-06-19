// Note: 
// 1.Why write the interface?
// Becouse I will accease user data in token and Session or JWT enywhere , Thats reson i cheange interface Next-auth (Nextauth to User Module )

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface User{
        _id?:string;
        username?: string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
    }
    interface Session {
        user:{
            _id?:string;
            username?: string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
        }& DefaultSession['user']
    }
}

// 2nd Methord to write interface ..............

declare module "next-auth/jwt"{
    interface JWT{
            _id?:string;
            username?: string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
    }
}

