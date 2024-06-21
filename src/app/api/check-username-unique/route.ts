import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schema/signUpSchema";


const UsernameQuerySchema = z.object({
    username:usernameValidation
});

export async function GET(request: Request){
    // Connect DataBase...........
    await dbConnect();
    try {
        // get full url . EX: localhost:3000/api/sign-up?username=jhdfjh....
        const {searchParams} = new URL(request.url)
        // find username from URL..............
        const queryParams ={
            username:searchParams.get("username")
        }
        // validate with Zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        // TODO: remove clg
        console.log(result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success:false,
                    message:usernameErrors?.length>0? usernameErrors.join(','):"Invalid query parameters"
                },
                {
                    status:400
                }
            )
        }
        const {username} = result.data;
        const existingVerifiedUsername = await UserModel.findOne({username,isVerified:true})
        if (existingVerifiedUsername) {
            return Response.json(
                {
                    success:false,
                    message:"user Name is alredy token"
                },
                {
                    status:400
                }
            )
        }
        return Response.json(
            {
                success:true,
                message:"user Name is Unique"
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Erro Checking Username " , error)
        return Response.json(
            {
                success:false,
                message:"Erro Checking Username "
            },
            {
                status:500
            }
        )
    }
}

