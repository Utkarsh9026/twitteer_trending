import { getTrendingTopics } from "../services/scraper.services.js";

export const fetchTrends = async (req, res) => {
  try {
    await getTrendingTopics();
    res.status(200).send("Trends fetched and saved successfully.");
  } catch (error) {
    res.status(500).send("Error fetching trends.");
  }
};
