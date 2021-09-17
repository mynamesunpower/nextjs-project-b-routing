import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";
import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../api/db-util";

export default async function handler(req, res) {
  const { eventId } = req.query;

  let client;
  try {
    client = await connectDatabase();
    console.log("client connected!");
  } catch (e) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { eventId },
        { _id: -1 }
      );
      res
        .status(200)
        .json({ message: "Fetching Data Success!", data: documents });
    } catch (e) {
      res.status(500).json({ message: "Getting comments failed." });
    }
    // const data = getCommentByEventId(eventId);
  } else if (req.method === "POST") {
    const obj = { ...req.body, eventId };

    let result;
    try {
      result = await insertDocument(client, "comments", obj);
      obj._id = result.insertedId;
      res
        .status(201)
        .json({ message: "Saving Comment Success!", comment: obj });
    } catch (e) {
      res.status(500).json({ message: "Inserting comment failed!" });
    }
    // writeCommentIntoEventId(obj);
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
