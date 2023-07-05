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

        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
         } = body;

         if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
          }
      
          if (!name) {
            return new NextResponse("Name is required", { status: 400 });
          }
      
          if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
          }
      
          if (!price) {
            return new NextResponse("Price is required", { status: 400 });
          }
      
          if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
          }
      
          if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
          }
      
          if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
              name,
              price,
              isFeatured,
              isArchived,
              categoryId,
              colorId,
              sizeId,
              storeId: params.storeId,
              images: {
                createMany: {
                  data: [
                    ...images.map((image: { url: string }) => image),
                  ],
                },
              },
            },
          });

        return NextResponse.json(product);

    } catch (error: any) {
        console.log('[PRODUCTS_POST]', error);
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

        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(product);

    } catch (error: any) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal Error", { status: HTTP_STATUS.INTERNAL_ERROR });
    }
}