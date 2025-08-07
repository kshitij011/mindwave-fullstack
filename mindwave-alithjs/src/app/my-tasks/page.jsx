"use client";

import { useEffect, useState } from "react";
import { useContract } from "../contexts/ContractContext";
import { useWallet } from "../contexts/WalletContext";

const MyTasks = () => {
    const { taskStorageContract } = useContract();
    const { account, connectWallet, isConnecting } = useWallet();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [assignedExperts, setAssignedExperts] = useState([]);
    // const [solver, setSolver] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [fieldExperts, setFieldExperts] = useState([]);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [assignField, setAssignField] = useState(null);

    const buttonText = isConnecting
        ? "Connecting..."
        : account
        ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
        : "Connect Wallet";

    useEffect(() => {
        const fetchTasks = async () => {
            if (!taskStorageContract || !account) return;

            try {
                const result = await taskStorageContract.getAllTask();
                const parsedTasks = result.map((task) => ({
                    taskId: task[0].toString(),
                    task: task[1],
                    status: task[3],
                    subtasks: task[2].map((subtask) => ({
                        subtaskId: subtask[0].toString(),
                        subtask: subtask[1],
                        field: subtask[2],
                        status: subtask[3],
                    })),
                }));

                setTasks(parsedTasks);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [taskStorageContract, account]);

    const handleViewExperts = async (taskId, subtaskId) => {
        if (!taskStorageContract || !account) return;

        try {
            const experts = await taskStorageContract.getAssignedExperts(
                taskId,
                subtaskId
            );
            setAssignedExperts(experts);
            setSelectedTask(taskId);
            setSelectedSubtask(subtaskId);
            setShowModal(true);
        } catch (err) {
            console.error("Error fetching assigned experts:", err);
            setAssignedExperts([]);
            setShowModal(true);
        }
    };

    const handleAssignSubTask = async (taskId, subtaskId, field) => {
        if (!taskStorageContract || !account) return;

        try {
            console.log("=== DEBUGGING ASSIGN EXPERT ===");
            console.log("Fetching experts for field:", field);
            console.log("Contract address:", taskStorageContract.target);
            console.log("Current account:", account);
            console.log("Task ID:", taskId);
            console.log("Subtask ID:", subtaskId);

            const experts = await taskStorageContract.getFieldExperts(field);
            console.log("Raw experts from contract:", experts);
            console.log("Number of experts found:", experts.length);
            console.log("Experts array:", Array.from(experts));

            setFieldExperts(experts);
            setSelectedTask(taskId);
            setSelectedSubtask(subtaskId);
            setAssignField(field);
            setShowAssignModal(true);
        } catch (err) {
            console.error("Error fetching field experts:", err);
            console.error("Error details:", err.message);
            setFieldExperts([]);
            setShowAssignModal(true);
        }
    };

    const confirmAssignExpert = async () => {
        if (!taskStorageContract || !account || !selectedExpert) return;

        try {
            console.log("Assigning expert:", selectedExpert);
            console.log("To task:", selectedTask, "subtask:", selectedSubtask);

            const tx = await taskStorageContract.assignSubTask(
                selectedTask,
                selectedSubtask,
                selectedExpert
            );
            console.log("Assignment transaction sent:", tx.hash);
            await tx.wait();
            console.log("Assignment transaction confirmed!");

            alert("Expert assigned successfully.");
            setShowAssignModal(false);
            setSelectedExpert(null);
        } catch (err) {
            console.error("Error assigning expert:", err);
            alert("Failed to assign expert: " + err.message);
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
        <div className="p-6">
            {loading ? (
                <div className="space-y-4">
                    <div className="h-24 w-full bg-gray-200 animate-pulse rounded-md" />
                    <div className="h-24 w-full bg-gray-200 animate-pulse rounded-md" />
                </div>
            ) : tasks.length === 0 ? (
                <p className="text-gray-500">
                    You haven't created any tasks yet.
                </p>
            ) : (
                tasks.map((task, i) => (
                    <div
                        key={i}
                        className="mb-6 border border-gray-300 rounded-md shadow-sm p-4"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            {task.taskId}
                            {". "}
                            {task.task}{" "}
                            <span className="text-sm text-gray-500">
                                ({task.status})
                            </span>
                        </h3>

                        <ul className="list-disc ml-5 space-y-1">
                            {task.subtasks.map((subtask, j) => (
                                <li key={j}>
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {subtask.subtaskId}
                                            {". "}Subtask: {subtask.subtask}
                                        </p>
                                        <span className="ml-2 font-medium">
                                            Field:
                                        </span>{" "}
                                        {subtask.field}
                                        <span className="ml-2 font-medium">
                                            Status:
                                        </span>{" "}
                                        {subtask.status}
                                        <p className="flex justify-end">
                                            <button
                                                onClick={() =>
                                                    handleViewExperts(
                                                        task.taskId,
                                                        subtask.subtaskId
                                                    )
                                                }
                                                className="ml-2 font-medium bg-amber-400 hover:bg-amber-500 px-2 py-1 rounded-md"
                                            >
                                                View Assigned Expert
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAssignSubTask(
                                                        task.taskId,
                                                        subtask.subtaskId,
                                                        subtask.field
                                                    )
                                                }
                                                className="ml-2 font-medium bg-amber-400 hover:bg-amber-500 px-2 py-1 rounded-md"
                                            >
                                                Assign Expert
                                            </button>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Assigned Experts
                        </h3>
                        {assignedExperts.length === 0 ? (
                            <p className="text-gray-500">Assigned: None</p>
                        ) : (
                            <ul className="list-disc ml-5 space-y-1">
                                {assignedExperts.map((expert, i) => (
                                    <li
                                        key={i}
                                        className="text-gray-700"
                                    >
                                        {expert}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAssignModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Select Expert for "{assignField}" Field
                        </h3>

                        {/* Debug Information */}
                        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                            <p>
                                <strong>Debug Info:</strong>
                            </p>
                            <p>Field: {assignField}</p>
                            <p>Experts found: {fieldExperts.length}</p>
                            <p>Task ID: {selectedTask}</p>
                            <p>Subtask ID: {selectedSubtask}</p>
                        </div>

                        {fieldExperts.length === 0 ? (
                            <div className="text-gray-500">
                                <p className="mb-2">
                                    No experts found for this field.
                                </p>
                                <p className="text-sm">This could mean:</p>
                                <ul className="list-disc ml-5 text-sm">
                                    <li>
                                        No experts have registered for "
                                        {assignField}" field
                                    </li>
                                    <li>
                                        Experts haven't completed the assessment
                                        yet
                                    </li>
                                    <li>
                                        There might be a contract connection
                                        issue
                                    </li>
                                </ul>
                                <p className="mt-2 text-sm">
                                    To register as an expert, go to the
                                    Assessment page and complete the test for "
                                    {assignField}".
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-3 text-sm text-gray-600">
                                    Select an expert to assign to this subtask:
                                </p>
                                <ul className="space-y-2">
                                    {fieldExperts.map((expert, i) => (
                                        <li key={i}>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="expert"
                                                    value={expert}
                                                    checked={
                                                        selectedExpert ===
                                                        expert
                                                    }
                                                    onChange={() =>
                                                        setSelectedExpert(
                                                            expert
                                                        )
                                                    }
                                                />
                                                <span className="font-mono text-sm">
                                                    {expert.slice(0, 6)}...
                                                    {expert.slice(-4)}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedExpert(null);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssignExpert}
                                disabled={!selectedExpert}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Assign Expert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
