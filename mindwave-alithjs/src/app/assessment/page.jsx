"use client";

import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useContract } from "../contexts/ContractContext";

function Assessment() {
    const { account, connectWallet, isConnecting } = useWallet();
    const { taskStorageContract } = useContract();
    const [expertise, setExpertise] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState("idle"); // 'idle' | 'in-progress' | 'completed'
    const [scorePercentage, setScorePercentage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const fields = [
        "AI",
        "Machine Learning",
        "Blockchain",
        "Software Engineering",
        "Transportation",
        "Economics",
        "Media",
        "Law",
        "Politics",
        "Finance",
        "Cybersecurity",
        "Data Science",
        "Cloud Computing",
        "Energy",
        "Healthcare",
        "Education",
        "Marketing",
        "Psychology",
        "Design",
        "Agriculture",
        "Environmental Science",
        "Robotics",
        "Biotechnology",
        "IoT",
    ];

    const buttonText = isConnecting
        ? "Connecting..."
        : account
        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
        : "Connect Wallet";

    const handleAnswerChange = (index, value) => {
        setAnswers((prev) => ({ ...prev, [index]: value }));
    };

    const handleGetQuestions = async () => {
        if (!expertise.trim())
            return alert("Please enter your field of expertise.");
        setLoading(true);
        const res = await fetch(
            "http://localhost:3000/api/agent/assessment/questions",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expertise }),
            }
        );

        const data = await res.json();
        setQuestions(data.questions || []);
        setAnswers({});
        setFeedback(null);
        setLoading(false);
        setStage("in-progress");
    };

    const handleSubmitAnswers = async () => {
        setIsSubmitting(true);
        const payload = {
            qaPairs: questions.map((q, index) => ({
                question: q.question,
                answer: answers[index] || "",
            })),
        };

        const res = await fetch(
            "http://localhost:3000/api/agent/assessment/evaluate",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        const result = await res.json();
        setFeedback(result.feedback);

        // Calculate percentage score
        const totalScore = result.feedback.reduce(
            (sum, item) => sum + (item.score || 0),
            0
        );
        const percentage = (totalScore / (result.feedback.length * 10)) * 100;
        setScorePercentage(percentage);

        setStage("completed");
        setIsSubmitting(false);
    };

    async function handleMintMIT() {
        if (!taskStorageContract || !account) return;
        try {
            console.log("Registering as expert for field:", expertise);
            const tx = await taskStorageContract.registerExpert(expertise);
            console.log("Transaction sent:", tx.hash);
            await tx.wait(); // wait for transaction to be mined
            console.log("Transaction confirmed!");
            setIsRegistered(true); // mark as registered
            alert("Successfully registered as expert in " + expertise + "!");
        } catch (err) {
            console.error("Error registering as expert:", err);
            alert("Failed to register as expert: " + err.message);
        }
    }

    if (!account) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Welcome to the Assessment Portal
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
        <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Knowledge Assessment
                </h1>

                {stage === "idle" && (
                    <>
                        <p className="text-gray-600 mb-4">
                            Select your field of expertise to begin your
                            assessment.
                        </p>
                        <select
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-700"
                        >
                            <option value="">-- Choose a field --</option>
                            {fields.map((field, idx) => (
                                <option
                                    key={idx}
                                    value={field}
                                >
                                    {field}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleGetQuestions}
                            disabled={loading || !expertise}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Generating..." : "Start Assessment"}
                        </button>
                    </>
                )}

                {stage === "in-progress" && questions.length > 0 && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitAnswers();
                        }}
                        className="space-y-6"
                    >
                        <p className="text-gray-600 mb-6">
                            Answer the following questions to the best of your
                            ability:
                        </p>
                        {questions.map((q, index) => (
                            <div
                                key={index}
                                className="space-y-2"
                            >
                                <label className="font-medium text-gray-800">
                                    Q{index + 1}. {q.question}
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Write your answer here..."
                                    value={answers[index] || ""}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                                isSubmitting
                                    ? "bg-green-400 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        >
                            {isSubmitting
                                ? "Getting results..."
                                : "Submit Answers"}
                        </button>
                    </form>
                )}

                {stage === "completed" && feedback && (
                    <div className="mt-10 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Your Results
                        </h2>
                        {feedback.map((item, index) => (
                            <div
                                key={index}
                                className="p-5 border rounded-lg bg-gray-100 shadow-sm"
                            >
                                <p className="font-semibold text-gray-800">
                                    {index + 1}. {item.question}
                                </p>
                                <p className="mt-2 text-green-700 font-medium">
                                    Score: {item.score}/10
                                </p>
                                <p className="mt-1 italic text-gray-600">
                                    Feedback: {item.feedback}
                                </p>
                            </div>
                        ))}

                        {/* Total Score */}
                        {scorePercentage !== null && (
                            <div className="text-xl font-semibold text-gray-800">
                                Total Score: {scorePercentage.toFixed(2)}%
                            </div>
                        )}

                        {/* Retry button */}
                        <button
                            onClick={() => {
                                setStage("idle");
                                setExpertise("");
                                setQuestions([]);
                                setAnswers({});
                                setFeedback(null);
                                setScorePercentage(null);
                            }}
                            className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                        >
                            Take Another Test
                        </button>

                        {/* Conditional Mint Button */}
                        {/* Conditional Mint Button */}
                        {scorePercentage >= 75 && (
                            <>
                                {isRegistered ? (
                                    <div className="mt-4 w-full text-center text-green-600 font-semibold">
                                        ✅ You are now registered as an expert
                                        in <strong>{expertise}</strong>!
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleMintMIT}
                                        className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                                    >
                                        Register as Expert
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Assessment;
