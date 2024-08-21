const {chromium} = require("playwright");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "",
    pass: ""
  }
})

(async () => {
  let browser = await chromium.launch();

  let page = await browser.newPage();
  await page.setViewportSize({width: 1280, height: 1080});
  await page.goto("https://www.weather.gov");
  let heading = await page.getByRole('heading');
  let headerText = await heading.textContent();

  await page.goto("https://www.weather.gov/briefing");
  await page.locator(".div-half img").first().screenshot({path: "forecast-map.png"});
  await page.locator(".div-half .div-half a").first().click();
  let content = await page.locator("pre").textContent();

  let contentArray = content.split("...");
  let trimmedArray = contentArray.slice(1);
  let mappedArray = 
    trimmedArray.map(element => element.replace(/(\r\n|\n|\r)/gm, " ").trim())
    .map(element => element.replace("  ", " "));
  console.log(mappedArray.toString());
  await browser.close();
})();