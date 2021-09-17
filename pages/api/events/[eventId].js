import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";

const ATLAS_NAME = process.env.ATLAS_ID;
const ATLAS_PASSWORD = process.env.ATLAS_SECRET;
const DATABASE_NAME = `events`;

export default async function handler(req, res) {
  const { eventId } = req.query;
  const client = await MongoClient.connect(
    `mongodb+srv://${ATLAS_NAME}:${ATLAS_PASSWORD}@cluster0.r2ftk.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`
  );

  if (req.method === "GET") {
    const db = client.db();
    const documents = await db
      .collection("comments")
      .find({ eventId })
      .sort({ _id: -1 })
      .toArray(); // -1 : desc / 1 : asc / 0 : not sort
    // const data = getCommentByEventId(eventId);

    res
      .status(200)
      .json({ message: "Fetching Data Success!", data: documents });
  } else if (req.method === "POST") {
    const obj = { ...req.body, eventId };

    const db = client.db();
    const result = await db.collection("comments").insertOne(obj);
    // writeCommentIntoEventId(obj);

    obj.id = result.insertedId;

    res.status(201).json({ message: "Saving Comment Success!", comment: obj });
  }

  client.close();
}

function makeFilePath() {
  return path.join(process.cwd(), "data", "comments.json");
}

function getFileData(filePath) {
  const fileData = fs.readFileSync(filePath);
  return JSON.parse(fileData);
}

function getCommentByEventId(eventId) {
  const filePath = makeFilePath();
  const data = getFileData(filePath);
  return data.filter((comments) => comments.eventId === eventId);
}

function writeCommentIntoEventId(commentObj) {
  const filePath = makeFilePath();
  const data = getFileData(filePath);

  data.push({
    ...commentObj,
    id: new Date().toISOString(),
  });
  fs.writeFileSync(makeFilePath(), JSON.stringify(data));
}
