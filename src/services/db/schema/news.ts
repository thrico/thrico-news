import { Schema, model, Document } from "mongoose";

export interface INews extends Document {
  url: string;
  title: string;
  description: string;
  content: string;
  category: string;
  source: {
    name: string;
    url: string;
  };
  image: string;
  summary: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const newsSchema = new Schema<INews>(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    source: {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
    summary: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const FeedNews = model<INews>("FeedNews", newsSchema);
