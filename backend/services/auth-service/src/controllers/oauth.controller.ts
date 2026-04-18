import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@packages/shared/prisma";

type GoogleProfile = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  email_verified?: boolean;
};

const googleCallbackController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const tokenResult =
      await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        request,
      );

    const accessToken = tokenResult.token.access_token;
    const refreshToken = tokenResult.token.refresh_token;

    if (!accessToken) {
      return reply
        .code(400)
        .send({ error: "Failed to obtain access token from Google" });
    }

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!profileResponse.ok) {
      return reply.code(400).send({ error: "Failed to fetch Google profile" });
    }

    const profile = (await profileResponse.json()) as GoogleProfile;

    if (!profile.email) {
      return reply.code(400).send({ error: "Google account has no email" });
    }

    const provider = "google";
    const providerAccountId = profile.sub;

    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { User: true },
    });

    let user = existingAccount?.User ?? null;

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.email,
            fname: profile.given_name || profile.name || "Google",
            lname: profile.family_name || "User",
            verified: Boolean(profile.email_verified),
            password: null,
          },
        });
      }

      await prisma.account.create({
        data: {
          userId: user.id,
          provider,
          providerAccountId,
          accessToken: accessToken ?? null,
          refreshToken: refreshToken ?? null,
        },
      });
    }

    const token = await reply.jwtSign(
      {
        userId: user.id,
        firstName: user.fname,
        lastName: user.lname,
        email: user.email,
        role : user.role,
      },
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    const redirectUrl =
      process.env.FRONTEND_LOGIN_SUCCESS_URL ||
      "http://localhost:3000?loginMethod=google";
    return reply.redirect(redirectUrl);
  } catch (error: any) {
    request.log.error(error);
    const failUrl =
      process.env.FRONTEND_LOGIN_FAIL_URL ||
      "http://localhost:3000/login?error=social_login_failed";
    return reply.redirect(failUrl);
  }
};

export default googleCallbackController;
