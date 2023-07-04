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

        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }
        
        if(!label) {
            return new NextResponse("Label is required", { status: HTTP_STATUS.BAD_REQUEST });
        }
 
        if(!imageUrl) {
            return new NextResponse("Image is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {storeId: string} }
) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}