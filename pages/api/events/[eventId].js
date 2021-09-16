import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const { eventId } = req.query;
  if (req.method === "GET") {
    const data = getCommentByEventId(eventId);

    res.status(200).json({ message: "Fetching Data Success!", data });
  } else if (req.method === "POST") {
    const obj = { ...req.body, eventId };
    writeCommentIntoEventId(obj);

    res.status(201).json({ message: "Saving Comment Success!" });
  }
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
  console.log(data);
  const resData = data.filter((comments) => comments.eventId === eventId);
  console.log(resData);
  return resData;
}

function writeCommentIntoEventId(commentObj) {
  const filePath = makeFilePath();
  const data = getFileData(filePath);
  console.log(commentObj);
  data.push({
    ...commentObj,
    id: new Date().toISOString(),
  });
  fs.writeFileSync(makeFilePath(), JSON.stringify(data));
}
