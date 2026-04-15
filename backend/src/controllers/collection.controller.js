import {
  createCollection,
  getCollections,
  addRequestToCollection,
} from "../services/collection.service.js";

export const createNewCollection = async (req, res) => {
  const collection = await createCollection(req.body);
  res.json(collection);
};

export const fetchCollections = async (req, res) => {
  const collections = await getCollections();
  res.json(collections);
};

export const addRequest = async (req, res) => {
  const { id } = req.params;
  const updated = await addRequestToCollection(id, req.body);
  res.json(updated);
};