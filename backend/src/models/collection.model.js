import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  method: String,
  url: String,
  headers: Object,
  body: Object,
});

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    requests: [requestSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);