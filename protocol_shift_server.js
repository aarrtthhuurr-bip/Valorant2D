const http = require("http");
const fs = require("fs");
const path = require("path");

const baseDir = __dirname;
const requestedPorts = process.argv.slice(2).map(Number).filter(Boolean);
const ports = requestedPorts.length
  ? requestedPorts
  : (process.env.PROTOCOL_SHIFT_PORTS || "8088,8124").split(",").map(Number).filter(Boolean);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function serve(req, res) {
  const requestUrl = new URL(req.url, "http://127.0.0.1");
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(baseDir, pathname));
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

for (const port of ports) {
  const server = http.createServer(serve);
  server.on("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      console.error(`Protocol Shift server error on ${port}:`, error.message);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Protocol Shift server running on http://127.0.0.1:${port}/`);
  });
}
