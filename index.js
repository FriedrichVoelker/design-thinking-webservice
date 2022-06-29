const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();


const frontendroutes = require("./frontend/routes.json");
const apiroutes = require("./api/routes.json");

const AuthUtil = require("./api/util/AuthUtil");

const PORT = process.env.PORT || 50057;
const requestListener = function (req, res) {
  let found = false;
  if (
    req.url.toLowerCase().startsWith("/statics") ||
    req.url.toLowerCase().startsWith("/lang")
  ) {
    let filepath = "frontend" + req.url;
    fs.readFile(filepath, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      found = true;
      res.writeHead(200);
      res.end(data);
      return;
    });
    return;
  }


  if(req.url != "/" && req.url.endsWith("/")){
    req.url = req.url.substring(0, req.url.length - 1);
  }

  if (req.url.toLowerCase().startsWith("/api")) {
    // Todo: Api

    let currRoute = req.url.split("/api")[1];
    Object.entries(apiroutes).forEach(async ([key, route]) => {
      if (
        currRoute.toLowerCase() == route.url ||
        (route.aliases != null &&
          route.aliases.length > 0 &&
          route.aliases.includes(currRoute.toLowerCase()))
      ) {

        if(!route.methods){
          route.methods = ["POST"];
        }
        if(!route.methods.includes(req.method)){
          found = true;
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({error: "Method not allowed"}));
          return;
        }

        if (route.return) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(route.return));
        } else if (route.function) {
          const API = require(route.function.filepath);
          found = true;
          let data = [];
          if (route.function.needParams) {
            data.body = await getBodyData(req);
            // console.log(data.body)
          }

          if (route.function.needsAuth) {
            let auth = await new AuthUtil().checkAuth(
              req.headers.authorization
            );
            if (!auth) {
              res.writeHead(401, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Invalid token" }));
              return;
            }
          }
          data.auth = req.headers.authorization;

          let statusCode = 200;
          const response = await new API()[route.function.function](data);

          res.writeHead(response.status || statusCode, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(response.message || { data: response }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Path had an unexpected error" }));
        }
        found = true;
        return;
      }
    });

    if (!found) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unknown Path" }));
    }
    return;
  }

  Object.entries(frontendroutes).forEach(async ([key, route]) => {
    if (
      req.url.toLowerCase() == route.url ||
      (route.aliases != null &&
        route.aliases.length > 0 &&
        route.aliases.includes(req.url.toLowerCase()))
    ) {
      renderHtml(route.filepath, res, route.needsAuth, route.isAdminOnly);
      found = true;
      return;
    }
  });
  if (!found) {
    res.writeHead(404);
    renderHtml("frontend/views/notfound.html", res);
  }
};

const renderHtml = async function (
  path,
  res,
  needsAuth = false,
  isAdminOnly = false
) {
  fs.readFile(path, async function (error, pgResp) {
    if (error) {
      res.writeHead(404);
      res.write("Sorry, Page Not Found");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      if (!isAdminOnly) {
        pgResp =
          (await insertHTMLHeaderData()) + "<body>" + pgResp + "</body></html>";
      }

      if (isAdminOnly) {
        pgResp =
          (await inserHTMLHeaderDataAdmin()) +
          "<body>" +
          pgResp +
          "</body></html>";
      }

      if (needsAuth) {
        pgResp = '<script src="/statics/authVerifier.js"></script>' + pgResp;
      }
      res.write(pgResp);
    }
    res.end();
  });
};

const insertHTMLHeaderData = function () {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/statics/styles.css">
		<script defer src="statics/setupPage.js"></script>
		<script src="statics/main.js"></script>
		<title translate="title"></title>
	</head>
	`;
};

const inserHTMLHeaderDataAdmin = function () {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/statics/styles.css">
    <script defer src="/statics/cp/setupPageAdmin.js"></script>
    <script defer src="/statics/cp/main.js"></script>
    <script src="/statics/main.js"></script>
    <title translate="title"></title>
  </head>
  `;
};

const server = http.createServer(requestListener);
server.listen(PORT);
console.log("Running on http://localhost:" + PORT);

function getBodyData(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = "";
      req.on("data", (chunk) => {
        // data.push(chunk);
        data += chunk.toString()
      });
      req.on("end", () => {
        resolve(JSON.parse(data));
      });
    } catch (error) {
      reject(error);
    }
  });
}
