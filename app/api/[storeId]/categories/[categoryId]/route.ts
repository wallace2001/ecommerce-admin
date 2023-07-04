import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: {storeId: string, categoryId: string} }
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

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);

    } catch (error: any) {
        console.log('[CATEGORIES_PATCH]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: {storeId: string, categoryId: string} }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: HTTP_STATUS.BAD_REQUEST });
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);

    } catch (error: any) {
        console.log('[Categories_DELETE]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function GET(
    request: Request,
    { params }: { params: {categoryId: string} }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const billboard = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error: any) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}