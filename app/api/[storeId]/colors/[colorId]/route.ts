import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: {storeId: string, colorId: string} }
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

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: {storeId: string, colorId: string} }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {colorId: string} }
) {
    try {

        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    } catch (error: any) {
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}