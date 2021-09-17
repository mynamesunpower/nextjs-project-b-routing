import { MongoClient } from "mongodb";

const ATLAS_NAME = process.env.ATLAS_ID;
const ATLAS_PASSWORD = process.env.ATLAS_SECRET;
const DATABASE_NAME = `events`;

export async function connectDatabase() {
  return await MongoClient.connect(
    `mongodb+srv://${ATLAS_NAME}:${ATLAS_PASSWORD}@cluster0.r2ftk.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`
  );
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  return await db.collection(collection).insertOne(document);
}

export async function getAllDocuments(client, collection, filter, sort) {
  const db = client.db();
  return await db.collection(collection).find(filter).sort(sort).toArray(); // -1 : desc / 1 : asc / 0 : not sort
}
