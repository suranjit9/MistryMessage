import {resend} from '@/lib/Resend';
import VerificationEmail from '../../email/VerifycationEmail';
import { ApiRespones } from '@/types/ApiRespones';

export const sendVerifyEmail = async (email: string, username: string, verifyCode: string): Promise<ApiRespones> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return {
            success: true,
            message: 'Email sent successfully',
            }
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        return { success: false, message: 'Error sending email' };
    }
}
