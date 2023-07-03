import { HTTP_STATUS } from "@/app/constants/enums/HTTP_STATUS_ENUM";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if(!name) {
            return new NextResponse("Name is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error: any) {
        console.log('STORE_PATCH', error);
        return new NextResponse("Internal error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: HTTP_STATUS.BAD_REQUEST });
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error: any) {
        console.log('STORE_DELETE', error);
        return new NextResponse("Internal error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}