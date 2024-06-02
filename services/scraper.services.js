import "dotenv/config";
import { Builder, By } from "selenium-webdriver";
import axios from "axios";
const proxyMeshUrl = process.env.PROXY_MESH_URL;
import { generateUniqueId } from "../utils/generateUniqueId.utils.js";
import Trend from "../models/trends.models.js";

export const getTrendingTopics = async () => {
  const uniqueId = generateUniqueId();

  let ipAddress;
  // Fetch new IP address from ProxyMesh
  try {
    console.log(proxyMeshUrl);
    const response = await axios.get(proxyMeshUrl);
    ipAddress = response.data;
  } catch (error) {
    console.error("Error fetching IP address from ProxyMesh:", error);
    return;
  }

  // Set up Selenium WebDriver with proxy
  const options = new chrome.Options();
  options.addArguments(`--proxy-server=${ipAddress}`);

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get("https://twitter.com/login");
    // Perform login
    await driver
      .findElement(By.name("session[username_or_email]"))
      .sendKeys(process.env.TWITTER_USERNAME);
    await driver
      .findElement(By.name("session[password]"))
      .sendKeys(process.env.TWITTER_PASSWORD);
    await driver
      .findElement(By.css('div[data-testid="LoginForm_Login_Button"]'))
      .click();

    // Wait for the homepage to load and display trending topics
    await driver.sleep(5000);

    let trends = await driver.findElements(
      By.css('section[aria-labelledby="accessible-list-0"] span span')
    );
    let topTrends = [];
    for (let i = 0; i < 5; i++) {
      topTrends.push(await trends[i].getText());
    }

    // Save the trends to MongoDB
    const endTime = new Date();
    const trendData = new Trend({
      uniqueId,
      trend1: topTrends[0],
      trend2: topTrends[1],
      trend3: topTrends[2],
      trend4: topTrends[3],
      trend5: topTrends[4],
      endTime,
      ipAddress,
    });
    await trendData.save();
    console.log("Trends saved to database:", topTrends);
  } finally {
    await driver.quit();
  }
};
