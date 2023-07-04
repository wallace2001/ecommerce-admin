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

        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }
        
        if(!name) {
            return new NextResponse("Name is required", { status: HTTP_STATUS.BAD_REQUEST });
        }
 
        if(!billboardId) {
            return new NextResponse("Billboard Id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    } catch (error: any) {
        console.log('[CATEGORIES_POST]', error);
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

        const billboard = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}