import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../src/firebaseConfig";
import { collection, getDocs, query, where } from "@firebase/firestore";

import { startOfToday, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.method === "GET") {
    try {
      const periodName = req.query?.periodName as string;
      const periodNumber = Number(req.query?.periodNumber) || 0;

      let startDate: Date | null;
      let endDate: Date | null;

      switch (periodName) {
        case "week":
          startDate = startOfWeek(addDays(startOfToday(), 7 * periodNumber));
          endDate = endOfWeek(addDays(startOfToday(), 7 * (periodNumber+1)));
          break;
        case "weekend":
          startDate = startOfWeek(addDays(startOfToday(),( 7 * (periodNumber+1))-1));
          endDate = endOfWeek(addDays(startOfToday(), 7 * (periodNumber+1)));
          endDate = addDays(endDate, -1);
          break;
        case "month":
          startDate = startOfMonth(addDays(startOfToday(), 30 * periodNumber));
          endDate = endOfMonth(addDays(startOfToday(), 30 * (periodNumber+1)));
          break;
        default:
          startDate = null;
          endDate = null;
          break;
      }
      const eventsCollection = collection(db, "events");
      let q = startDate && endDate ? query(eventsCollection, where("date", ">=", startDate), where("date", "<=", endDate)) : eventsCollection;
      const eventsSnapshot = await getDocs(q);
      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      console.log(events)
      return res.status(200).json(events);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Fetching events failed" });
    }
  }

  // Handle other HTTP methods such as POST, PUT, DELETE similarly
  
  res.status(405).end(); // Return Method Not Allowed if the HTTP method is not explicitly handled
}
