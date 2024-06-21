import {resend} from '@/lib/Resend';
import VerificationEmail from '../../email/VerifycationEmail';
import { ApiRespones } from '@/types/ApiRespones';

export const sendVerifyEmail = async (email: string, username: string, verifyCode: string): Promise<ApiRespones> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'verification your Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return {
            success: true,
            message: 'verification sending email sent successfully',
            }
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        return { success: false, message: 'Failed to send verification sending email' };
    }
}
