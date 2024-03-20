const http = require("http");
const url = require("url");

// Sample data for demonstration
let books = [
  { id: 1, title: "Book 1", author: "Author 1" },
  { id: 2, title: "Book 2", author: "Author 2" },
  { id: 3, title: "Book 3", author: "Author 3" },
];

// Sample data for demonstration
let authors = [
  { id: 1, name: "Author 1" },
  { id: 2, name: "Author 2" },
  { id: 3, name: "Author 3" },
];

// Function to parse authentication header and extract username and password
function parseAuthorizationHeader(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Basic ")) {
    const base64Credentials = authHeader.slice("Basic ".length).trim();
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");
    return { username, password };
  } else {
    return null;
  }
}

// Function to handle authentication
function authenticate(req) {
  const credentials = parseAuthorizationHeader(req);

  if (
    credentials &&
    credentials.username === "username" &&
    credentials.password === "password"
  ) {
    return true;
  } else {
    return false;
  }
}

// Function to handle GET requests for '/books' endpoint
function handleGetBooks(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(books));
}

// Function to handle PUT requests for '/books' endpoint
function handlePutBooks(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Books data updated successfully" }));
}

// Function to handle DELETE requests for '/books' endpoint
function handleDeleteBooks(req, res) {
  books = []; // Clear books data
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "All books deleted successfully" }));
}

// Function to handle GET requests for '/authors' endpoint
function handleGetAuthors(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(authors));
}

// Function to handle POST requests for '/authors' endpoint
function handlePostAuthors(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "New author created successfully" }));
}

// Function to handle PUT requests for '/authors' endpoint
function handlePutAuthors(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Author details updated successfully" }));
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  // Authenticate user
  const isAuthenticated = authenticate(req);
  if (!isAuthenticated) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
  }

  // Route requests based on path and method
  if (reqUrl.pathname === "/books") {
    switch (req.method) {
      case "GET":
        handleGetBooks(req, res);
        break;
      case "PUT":
        handlePutBooks(req, res);
        break;
      case "DELETE":
        handleDeleteBooks(req, res);
        break;
      default:
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
  } else if (reqUrl.pathname === "/authors") {
    switch (req.method) {
      case "GET":
        handleGetAuthors(req, res);
        break;
      case "POST":
        handlePostAuthors(req, res);
        break;
      case "PUT":
        handlePutAuthors(req, res);
        break;
      default:
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
