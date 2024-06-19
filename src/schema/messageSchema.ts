import {z} from "zod";

export const MessagesSchema = z.object({
   content: z
   .string()
   .min(1, "Message must be at least 1 characters long")
   .max(200, "Message must be at most 200 characters long"),
   
})