// src/app/api/get-logs/route.js
import clientPromise from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("scara_robot");
    const collection = db.collection("commands");

    // Fetch all commands, sorted by timestamp
    const allCommands = await collection.find().sort({ _id: 1 }).toArray();

    return new Response(JSON.stringify(allCommands), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch logs",
        error,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
