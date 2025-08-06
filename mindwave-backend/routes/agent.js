import express from "express";
import {
    getAssessmentQuestions,
    evaluateAssessment,
    decomposeProblem,
} from "../services/agentService.js";

const router = express.Router();

router.post("/assessment/questions", async (req, res) => {
    try {
        const { expertise } = req.body;
        const questionsRaw = await getAssessmentQuestions(expertise);
        const cleaned = questionsRaw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        const questions = JSON.parse(cleaned);
        res.json({ questions }); // <- Fixed line
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.post("/assessment/evaluate", async (req, res) => {
    try {
        const { qaPairs, expertise } = req.body;

        if (!qaPairs || !Array.isArray(qaPairs)) {
            return res.status(400).json({ error: "qaPairs must be an array." });
        }

        const questions = qaPairs.map((qa) => ({ question: qa.question }));
        const answers = qaPairs.map((qa) => qa.answer);

        const feedback = await evaluateAssessment(
            questions,
            answers,
            expertise
        );
        res.json({ feedback });
    } catch (err) {
        console.error("Error evaluating answers:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.post("/assessment/decompose", async (req, res) => {
    const { problem } = req.body;
    const result = await decomposeProblem(problem);
    res.json(result);
});

export default router;
