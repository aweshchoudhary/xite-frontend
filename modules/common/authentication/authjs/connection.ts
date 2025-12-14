import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { createTransport } from "nodemailer";
import { primaryDB } from "@/modules/common/database/prisma/connection";
import { getUserRoles } from "../server/read";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(primaryDB),
  pages: {
    newUser: "/auth-callback",
  },
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const transport = createTransport(provider.server);

        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to Your Account`,
          text: "Sign in to XED Program Management",
          html: authEmail({ url }),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const userRoles = await getUserRoles({ userId: user.id });
      session.user.roles = userRoles.data || [];
      return session;
    },
  },
  trustHost: true,
});

const authEmail = ({ url }: { url: string }) => {
  return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Sign to XED Program Management</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
            <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <tr>
                <td>
                <img src="https://emailers.xedinstitute.org/public/xed-logo-blue.png" alt="xed logo" width="80" />
                  <h2 style="color: #333333;">Welcome aboard!</h2>
                  <p style="color: #555555; font-size: 16px;">
                    Hello,
                  </p>
                  <p style="color: #555555; font-size: 16px;">
                    You can now sign in to your account using the link below. 
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" title="authentication url" aria-label="authentication url" style="background-color: #2672B9; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
                      Log In
                    </a>
                  </div>
                  <p style="color: #555555; font-size: 16px;">
                    If you have any trouble signing in or need assistance, feel free to reply to this email.
                  </p>
                  <p style="color: #555555; font-size: 16px;">
                    Thank you,<br>
                    <strong>Team XED</strong><br>
                    info@xedinstitute.org
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>`;
};
