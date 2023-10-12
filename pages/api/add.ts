import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc } from "@firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST") {
    try {
      const { title } = req.body;
      const todosCollection = collection(db, "todos");
      const newTodo = await addDoc(todosCollection, { todo: title, done: false });
      return res.status(201).json({ id: newTodo.id });
    } catch (error) {
      return res.status(500).json({ error: "Adding todo failed" });
    }
  }

  res.status(405).end(); // Return Method Not Allowed if the HTTP method is not explicitly handled
}
