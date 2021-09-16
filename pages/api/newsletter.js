export default function handler(request, response) {
  if (request.method === "POST") {
    const { email } = request.body;

    // data treat
    console.log(email);
    // response setting
    response
      .status(201)
      .json({ message: "Register Success!", registeredEmail: email });
  }
}
