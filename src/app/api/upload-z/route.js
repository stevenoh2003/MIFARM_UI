// src/app/api/upload-z/route.js
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  const { z_height } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("scara_robot");
    const result = await db.collection("commands").insertOne({ z_height });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Z Height uploaded successfully!",
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
        message: "Failed to upload Z Height.",
        error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
