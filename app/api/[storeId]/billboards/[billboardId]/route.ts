import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: {storeId: string, billboardId: string} }
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

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[BILLBOARDS_PATCH]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: {storeId: string, billboardId: string} }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[BILLBOARDS_DELETE]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {billboardId: string} }
) {
    try {

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}