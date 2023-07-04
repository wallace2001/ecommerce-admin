import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: {storeId: string, sizeId: string} }
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
 
        if(!value) {
            return new NextResponse("Value is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const color = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: {storeId: string, sizeId: string} }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const sizes = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(sizes);

    } catch (error: any) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {sizeId: string} }
) {
    try {

        if (!params.sizeId) {
            return new NextResponse("Billboard id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const color = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}