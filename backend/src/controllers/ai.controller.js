import { analyzeApiResponse } from "../services/ai.service.js";

export const handleAiAnalysis = async (req, res) => {
  try {
    const { request, response } = req.body;

    const result = await analyzeApiResponse({ request, response });

    res.json({ analysis: result });
  } catch (error) {
    next(error);
  }
};