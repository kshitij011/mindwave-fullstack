// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract TaskStorage {

    struct Subtasks{
        uint subtaskId;
        string subtask;
        string field;
        string status;
    }

    struct Tasks{
        uint taskId;
        string task;
        Subtasks[] subtasks;
        string status;
    }

    // tasks[] public taskList;

    // tasks created by users
    mapping(address => Tasks[]) private createdTasks;

    // "Blockchain" => expert addresses
    mapping(string => address[]) public fieldExperts;

    // taskCreatorAddress => taskId => subtaskId => assigned experts
    mapping(address => mapping(uint => mapping(uint => address[]))) public assignedExperts;

    // consumes around 1m gas = 0.35 usd
    function addTask(string memory _task, string[] memory _subtask, string[] memory _fields) public {
        require(_subtask.length == _fields.length, "Mismatch in subtasks and fields");

        uint newId = createdTasks[msg.sender].length;

        // Step 1: Create the task without subtasks
        createdTasks[msg.sender].push();
        Tasks storage newTask = createdTasks[msg.sender][newId];
        newTask.taskId = newId;
        newTask.task = _task;
        newTask.status = "Open";

        // Step 2: Push subtasks one by one
        for (uint i = 0; i < _subtask.length; i++) {
            newTask.subtasks.push(Subtasks({
                subtaskId: i,
                subtask: _subtask[i],
                field: _fields[i],
                status: "Open"
            }));
        }
    }

    function getFieldExperts(string memory field) public view returns(address[] memory) {
        return fieldExperts[field];
    }

    function assignSubTask(uint _taskId, uint _subtaskId, address _solver) public{
        assignedExperts[msg.sender][_taskId][_subtaskId].push(_solver);
    }

    // function completeSubtask(...)

    function getAllTask() public view returns(Tasks[] memory){

        Tasks[] memory allTasks = createdTasks[msg.sender];
        return allTasks;
    }

    // rewardSolver(...)

    function getAssignedExperts(uint _taskId, uint _subtaskId) public view returns(address[] memory){
        return assignedExperts[msg.sender][_taskId][_subtaskId];
    }

    function registerExpert(string memory field) public {
        fieldExperts[field].push(msg.sender);
    }

    // // Get all tasks assigned to a specific expert address
    // function getAssignedTasksForExpert(address expertAddress) public view returns(
    //     address[] memory assigners,
    //     uint[] memory taskIds,
    //     uint[] memory subtaskIds
    // ) {
    //     // We need to iterate through all possible assigners to find tasks assigned to this expert
    //     // This is a simplified approach - in a production system you might want to maintain a reverse mapping

    //     // For now, we'll return empty arrays as this would be expensive to compute
    //     // A better approach would be to maintain a separate mapping: expertAddress => assignment[]
    //     address[] memory tempAssigners = new address[](0);
    //     uint[] memory tempTaskIds = new uint[](0);
    //     uint[] memory tempSubtaskIds = new uint[](0);

    //     return (tempAssigners, tempTaskIds, tempSubtaskIds);
    // }

    // // Alternative: Get assignments for a specific expert from a specific assigner
    // function getAssignedTasksForExpertFromAssigner(address expertAddress, address assignerAddress) public view returns(
    //     uint[] memory taskIds,
    //     uint[] memory subtaskIds
    // ) {
    //     // This is more efficient as we only check one assigner
    //     uint[] memory foundTaskIds = new uint[](0);
    //     uint[] memory foundSubtaskIds = new uint[](0);

    //     // Get all tasks from this assigner
    //     Tasks[] memory tasks = createdTasks[assignerAddress];

    //     for (uint i = 0; i < tasks.length; i++) {
    //         for (uint j = 0; j < tasks[i].subtasks.length; j++) {
    //             // Check if this expert is assigned to this subtask
    //             address[] memory assignedExperts = assignedExperts[assignerAddress][i][j];
    //             for (uint k = 0; k < assignedExperts.length; k++) {
    //                 if (assignedExperts[k] == expertAddress) {
    //                     // Found an assignment - add to arrays
    //                     uint[] memory newTaskIds = new uint[](foundTaskIds.length + 1);
    //                     uint[] memory newSubtaskIds = new uint[](foundSubtaskIds.length + 1);

    //                     // Copy existing arrays
    //                     for (uint l = 0; l < foundTaskIds.length; l++) {
    //                         newTaskIds[l] = foundTaskIds[l];
    //                         newSubtaskIds[l] = foundSubtaskIds[l];
    //                     }

    //                     // Add new assignment
    //                     newTaskIds[foundTaskIds.length] = i;
    //                     newSubtaskIds[foundSubtaskIds.length] = j;

    //                     foundTaskIds = newTaskIds;
    //                     foundSubtaskIds = newSubtaskIds;
    //                 }
    //             }
    //         }
    //     }

    //     return (foundTaskIds, foundSubtaskIds);
    // }

}