import { MongoClient } from "mongodb";

const ATLAS_NAME = process.env.ATLAS_ID;
const ATLAS_PASSWORD = process.env.ATLAS_SECRET;
const DATABASE_NAME = `events`;

export default async function handler(request, response) {
  if (request.method === "POST") {
    const { email } = request.body;

    // data validation
    if (!email || !email.includes("@")) {
      response.status(422).json({ message: "Invalid Email Address." }); // 422 Invalid Input.
      return;
    }

    // data treating!
    const client = await MongoClient.connect(
      `mongodb+srv://${ATLAS_NAME}:${ATLAS_PASSWORD}@cluster0.r2ftk.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`
    );
    const db = client.db();

    await db.collection("newsletter").insertOne({ email: email });

    client.close();
    // response setting
    response
      .status(201)
      .json({ message: "Register Success!", registeredEmail: email });
  }
}
