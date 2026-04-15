import Collection from "../models/collection.model.js";

export const createCollection = async (data) => {
  return await Collection.create(data);
};

export const getCollections = async () => {
  return await Collection.find().sort({ createdAt: -1 });
};

export const addRequestToCollection = async (collectionId, requestData) => {
  return await Collection.findByIdAndUpdate(
    collectionId,
    { $push: { requests: requestData } },
    { new: true }
  );
};