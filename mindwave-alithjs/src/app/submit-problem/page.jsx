"use client";
import { useState } from "react";
import Link from "next/link";
import { useContract } from "../contexts/ContractContext";
import { useWallet } from "../contexts/WalletContext";

export default function SubmitProblem() {
    const [problem, setProblem] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [subtasks, setSubtasks] = useState([]);
    const { taskStorageContract } = useContract();
    const [isSavedToBlockchain, setIsSavedToBlockchain] = useState(false);

    const { account, connectWallet, isConnecting } = useWallet();

    const buttonText = isConnecting
        ? "Connecting..."
        : account
        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
        : "Connect Wallet";

    const handleSubmit = async () => {
        if (!problem.trim()) {
            setMessage("❌ Please describe the problem.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");
        setSubtasks([]);

        try {
            const res = await fetch(
                "http://localhost:3000/api/agent/assessment/decompose",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem }),
                }
            );

            const text = await res.text(); // ✅ Read once
            console.log("Raw response text:", text);

            let data;
            try {
                data = JSON.parse(text);
                console.log("Parsed JSON:", data);
            } catch (err) {
                console.error("❌ Failed to parse JSON:", err);
                setMessage("❌ Invalid response from server.");
                return;
            }

            if (res.ok) {
                setMessage(
                    "✅ Problem submitted successfully. Subtasks identified below."
                );
                setSubtasks(Array.isArray(data) ? data : data.subtasks || []);
            } else {
                setMessage(data.error || "❌ Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Could not submit problem. Try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveToBlockchain = async () => {
        if (!taskStorageContract) {
            setMessage("❌ Smart contract not available.");
            return;
        }

        try {
            const subtaskDescriptions = subtasks.map((s) => s.subtask);
            const fields = subtasks.map((s) => s.field);

            const tx = await taskStorageContract.addTask(
                problem,
                subtaskDescriptions,
                fields
            );
            setMessage("⏳ Saving task to blockchain...");

            await tx.wait(); // Wait for transaction to be mined
            setMessage(
                "✅ Task successfully saved to blockchain! Check My tasks section."
            );
            setSubtasks([]); // Optionally clear UI
            setProblem("");
        } catch (error) {
            console.error("❌ Error saving task:", error);
            setMessage("❌ Failed to save task. Check console.");
        }
    };

    if (!account) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Your tasks are displayed here!
                </h2>
                <p className="text-gray-600 mb-6">
                    Please connect your wallet to continue
                </p>
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    onClick={connectWallet}
                >
                    {buttonText}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="my-4 bg-white shadow-2xl rounded-3xl p-6 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Submit a Problem
                </h1>

                {subtasks.length === 0 && (
                    <>
                        <textarea
                            rows={8}
                            placeholder="Describe the problem you're facing..."
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 text-lg"
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`mt-6 w-full py-3 rounded-xl text-lg font-semibold text-white transition ${
                                isSubmitting
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting ? "Submitting..." : "Decompose Task"}
                        </button>
                    </>
                )}

                {message && (
                    <div className="mt-3 text-sm font-medium text-red-600">
                        {message}
                    </div>
                )}

                {subtasks.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            🧩 Suggested Subtasks & Fields:
                        </h2>
                        <ul className="space-y-3">
                            {subtasks.map((task, idx) => (
                                <li
                                    key={idx}
                                    className="p-4 border rounded-lg shadow-md bg-gray-50 shadow-gray-200"
                                >
                                    <p className="text-gray-800 font-medium">
                                        🔹 Task: {task.subtask}
                                    </p>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm text-gray-600 mt-1">
                                            🏷️ Field: {task.field}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {!isSubmitting &&
                    subtasks.length > 0 &&
                    !isSavedToBlockchain && (
                        <button
                            onClick={handleSaveToBlockchain}
                            className="mt-6 w-full py-3 rounded-xl text-lg font-semibold text-white bg-green-600 hover:bg-green-700"
                        >
                            Save to Blockchain
                        </button>
                    )}

                {isSavedToBlockchain && (
                    <div className="mt-6 text-green-700 text-lg font-semibold text-center">
                        ✅ Task has been saved to the blockchain. Check MyTasks!
                    </div>
                )}
            </div>
        </div>
    );
}

// How can we reduce urban air pollution in large cities using technology while considering economic feasibility and social acceptance?

// Task: Develop AI-driven predictive models for optimizing urban traffic flow to minimize emissions

// 🏷️ Field: AI/transportation engineering

// Find Experts
// 🔹 Task: Evaluate the economic impact of deploying air purification technologies like smog-free towers and photocatalytic pavements

// 🏷️ Field: environmental economics

// Find Experts
// 🔹 Task: Design public engagement strategies to increase acceptance of low-emission zones and vehicle restrictions

// 🏷️ Field: social innovation

// Find Experts
// 🔹 Task: Implement IoT-based air quality monitoring systems to provide real-time pollution data to city residents

// 🏷️ Field: IoT/data science
