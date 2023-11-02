import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../src/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "@firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const { name, done } = req.body;
      const todosRef = collection(db, "events");
      const q = query(todosRef, where("todo", "==", name));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return res.status(404).json({ error: "Todo not found" });
      }
      const todoDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "todos", todoDoc.id), { done });
      return res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Updating todo failed" });
    }
  }

  res.status(405).end(); // Return Method Not Allowed if the HTTP method is not explicitly handled
}
