import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";
import { AddCareerRequestSchema } from "@/lib/types/careerFormTypes";
import { sanitizeHtml, sanitizeText } from "@/lib/utils/sanitize";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Validate request data
    const result = AddCareerRequestSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const {
      orgID,
      jobTitle,
      description,
      employmentType,
      workSetup,
      country,
      province,
      city,
      minimumSalary,
      maximumSalary,
      salaryNegotiable,
      lastEditedBy,
      createdBy,
      status,
    } = result.data;

    // Sanitize HTML fields
    const sanitizedDescription = sanitizeHtml(description);
    const sanitizedJobTitle = sanitizeText(jobTitle);
    const sanitizedEmploymentType = sanitizeText(employmentType);
    const sanitizedWorkSetup = sanitizeText(workSetup);
    const sanitizedCountry = sanitizeText(country);
    const sanitizedProvince = sanitizeText(province);
    const sanitizedCity = sanitizeText(city);

    const { db } = await connectMongoDB();

    // Get organization details
    const orgDetails = await db
      .collection("organizations")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(orgID),
          },
        },
        {
          $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
              {
                $addFields: {
                  _id: { $toString: "$_id" },
                },
              },
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$planId"] },
                },
              },
            ],
            as: "plan",
          },
        },
        {
          $unwind: "$plan",
        },
      ])
      .toArray();

    if (!orgDetails || orgDetails.length === 0) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if organization has reached the maximum number of jobs for their plan
    const totalActiveCareers = await db
      .collection("careers")
      .countDocuments({ orgID, status: "active" });

    if (
      totalActiveCareers >=
      orgDetails[0].plan.jobLimit + (orgDetails[0].extraJobSlots || 0)
    ) {
      return NextResponse.json(
        { error: "You have reached the maximum number of jobs for your plan" },
        { status: 400 }
      );
    }

    // Create career data
    const career = {
      id: guid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
      lastEditedBy,
      createdBy,
      orgID,
      status: status || "inactive",
      jobTitle: sanitizedJobTitle,
      description: sanitizedDescription,
      employmentType: sanitizedEmploymentType,
      workSetup: sanitizedWorkSetup,
      country: sanitizedCountry,
      province: sanitizedProvince,
      city: sanitizedCity,
      minimumSalary,
      maximumSalary,
      salaryNegotiable,
    };

    await db.collection("careers").insertOne(career);

    return NextResponse.json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
