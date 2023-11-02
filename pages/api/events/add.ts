import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../src/firebaseConfig";
import { collection, addDoc } from "@firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "POST") {
    try {
      const { title, date, place } = req.body;
      const todosCollection = collection(db, "events");
      const newTodo = await addDoc(todosCollection, { todo: title, date: new Date(date), place });
      return res.status(201).json({ id: newTodo.id });
    } catch (error) {
      return res.status(500).json({ error: "Adding todo failed" });
    }
  }

  res.status(405).end(); // Return Method Not Allowed if the HTTP method is not explicitly handled
}
