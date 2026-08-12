// app/api/services/route.ts
import { NextResponse } from "next/server";
import { getServices } from "@/lib/services";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") || "";

    const services = getServices(context);

    return NextResponse.json({ services }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}