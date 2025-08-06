import { assessment, decomposeTask } from "../agents/index.js";

export async function getAssessmentQuestions(expertise) {
    return await assessment.getQuestions(expertise);
}

export async function evaluateAssessment(questions, answers) {
    return await assessment.evaluateAnswers(questions, answers);
}

export async function decomposeProblem(problem) {
    return await decomposeTask.decompose(problem);
}
