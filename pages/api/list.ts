import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/firebaseConfig";
import { collection, getDocs, query, where } from "@firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filter = req.query.filter === "true";

  if (req.method === "GET") {
    try {
      const todosCollection = collection(db, "todos");
      const q = filter ? query(todosCollection, where("done", "==", false)) : todosCollection;
      const todosSnapshot = await getDocs(q);
      const todos = todosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json(todos);
    } catch (error) {
      return res.status(500).json({ error: "Fetching todos failed" });
    }
  }

  // Handle other HTTP methods such as POST, PUT, DELETE similarly
  
  res.status(405).end(); // Return Method Not Allowed if the HTTP method is not explicitly handled
}
