import { sendApiRequest } from "../services/api.service.js";

export const handleApiRequest = async (req, res) => {
try {
  const { method, url, headers, body } = req.body;

  const result = await sendApiRequest({ method, url, headers, body });

  res.json(result);
  } catch (error) {
    next(error);
  }
};