import { MongoClient } from "mongodb";
import { connectDatabase, insertDocument } from "../../api/db-util";
export default async function handler(request, response) {
  if (request.method === "POST") {
    const { email } = request.body;

    // data validation
    if (!email || !email.includes("@")) {
      response.status(422).json({ message: "Invalid Email Address." }); // 422 Invalid Input.
      return;
    }

    // data treating!
    let client;
    try {
      client = await connectDatabase();
      console.log("client connected!");
    } catch (e) {
      response
        .status(500)
        .json({ message: "Connecting to the database failed!" });
      return;
    }

    try {
      await insertDocument(client, "newsletter", { email: email });
      client.close();
    } catch (e) {
      response.status(500).json({ message: "Inserting data failed!" });
      return;
    }

    // response setting
    response
      .status(201)
      .json({ message: "Register Success!", registeredEmail: email });
  }
}
