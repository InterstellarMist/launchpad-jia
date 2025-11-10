import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";
import { UpdateCareerRequestSchema } from "@/lib/types/careerFormTypes";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const result = UpdateCareerRequestSchema.safeParse(requestData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const { _id, ...dataUpdates } = result.data;
    dataUpdates.updatedAt = new Date();

    const { db } = await connectMongoDB();

    await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(_id) }, { $set: dataUpdates });

    return NextResponse.json({
      message: "Career updated successfully",
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}
