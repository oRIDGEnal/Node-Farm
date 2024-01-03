const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemp = require("./assets/js_modules/replaceTemp");

///////////////////////////////////////////////
// Server
///////////////////////////////////////////////

// READFILES
const tempOverviewPath = `${__dirname}/assets/templates/template-overview.html`;
const tempOverviewBuffer = fs.readFileSync(tempOverviewPath);
const tempOverview = tempOverviewBuffer.toString(); // Convert Buffer to string

const tempProductPath = `${__dirname}/assets/templates/template-product.html`;
const tempProductBuffer = fs.readFileSync(tempProductPath);
const tempProduct = tempProductBuffer.toString(); // Convert Buffer to string

const tempCardPath = `${__dirname}/assets/templates/template-card.html`;
const tempCardBuffer = fs.readFileSync(tempCardPath);
const tempCard = tempCardBuffer.toString(); // Convert Buffer to string

const data = fs.readFileSync(`${__dirname}/assets/dev-data/data.json`);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// console.log(slugs);

// STARTING OF SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Replace placeholders in each card template and join them into a single string
    const cardsHtml = dataObj
      .map((el) => replaceTemp(tempCard.toString(), el))
      .join("");

    // Replace the placeholder in the overview template with the cardsHtml
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output); // Send the modified overview HTML

    // PRODUCTS
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

    // ERROR 404
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Listening for requests on port 5000");
});
