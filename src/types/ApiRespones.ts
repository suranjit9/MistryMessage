import { Message } from "@/model/User";
export interface ApiRespones {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;

}