import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();

    const { email, password, address } = (await req.json()) as {
      email: string;
      password: string;
      address: string;
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return NextResponse.json({
        message: "User already exist...",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed_password,
        address: address,
      },
    });

    return NextResponse.json({
      message: "Success",
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
