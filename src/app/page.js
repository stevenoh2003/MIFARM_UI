"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [fieldOne, setFieldOne] = useState("");
  const [fieldTwo, setFieldTwo] = useState("");
  const [fieldThree, setFieldThree] = useState("");
  const [fieldFour, setFieldFour] = useState("");
  const [logs, setLogs] = useState([]);

  const handleFirstCommand = async () => {
    const z_height = fieldOne;

    try {
      const response = await fetch("/api/upload-z", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ z_height }),
      });
      const data = await response.json();
      console.log(data.message);
      fetchLogs(); // Refresh logs after command is sent
    } catch (error) {
      console.error("Error uploading Z Height:", error);
    }
  };

  const handleSecondCommand = async () => {
    const joint1 = fieldTwo;
    const joint2 = fieldThree;
    const gripper = fieldFour;

    try {
      const response = await fetch("/api/upload-joints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joint1, joint2, gripper }),
      });
      const data = await response.json();
      console.log(data.message);
      fetchLogs(); // Refresh logs after command is sent
    } catch (error) {
      console.error("Error uploading joint values:", error);
    }
  };

  // Fetch all logs from the database
  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/get-logs");
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch logs on mount and set up real-time updates
  useEffect(() => {
    fetchLogs(); // Fetch all logs immediately
    const interval = setInterval(fetchLogs, 2000); // Check for new logs every 2 seconds
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div className="flex min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <main className="flex flex-col gap-8 w-1/2">
        <div className="text-4xl font-bold mb-6 text-blue-600">MIFARM</div>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={fieldOne}
            onChange={(e) => setFieldOne(e.target.value)}
            placeholder="Enter Z Height"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFirstCommand}
            className="rounded-lg border-none bg-blue-600 text-white py-3 hover:bg-blue-700 transition-colors"
          >
            Send Z Height
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <input
            type="number"
            value={fieldTwo}
            onChange={(e) => setFieldTwo(e.target.value)}
            placeholder="Enter Joint 1"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={fieldThree}
            onChange={(e) => setFieldThree(e.target.value)}
            placeholder="Enter Joint 2"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            value={fieldFour}
            onChange={(e) => setFieldFour(e.target.value)}
            placeholder="Enter Gripper"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSecondCommand}
            className="rounded-lg border-none bg-green-600 text-white py-3 hover:bg-green-700 transition-colors"
          >
            Send Joint Values
          </button>
        </div>
      </main>

      <aside className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Recent Movements</h2>
        <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={log._id} className="mb-2 p-2 border-b">
                {log.z_height ? (
                  <p>Z Height: {log.z_height}</p>
                ) : (
                  <p>
                    Joint 1: {log.joint1}, Joint 2: {log.joint2}, Gripper:{" "}
                    {log.gripper}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No recent movements found.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
