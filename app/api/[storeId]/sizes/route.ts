import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: {storeId: string} }
) {
    try {
        const { userId } = auth();
        const body = await request.json();

        const { name, value } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }
        
        if(!name) {
            return new NextResponse("Name is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
          }      

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: HTTP_STATUS.FORBIDDEN })
        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);

    } catch (error: any) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {sizeId: string} }
) {
    try {

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const color = await prismadb.size.findMany({
            where: {
                storeId: params.sizeId
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}