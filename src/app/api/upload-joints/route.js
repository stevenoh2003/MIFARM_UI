// src/app/api/upload-joints/route.js
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  const { joint1, joint2, gripper } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("scara_robot");
    const result = await db
      .collection("commands")
      .insertOne({ joint1, joint2, gripper });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Joint values uploaded successfully!",
        result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to upload joint values.",
        error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
