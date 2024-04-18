import {z} from "zod";

export const MessagesSchema = z.object({
   content: z
   .string()
   .min(13, "Message must be at least 13 characters long")
   .max(200, "Message must be at most 200 characters long"),
   
})