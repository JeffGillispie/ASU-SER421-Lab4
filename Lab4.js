// ============================================================================
// SETUP
// ============================================================================
var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = ".";
// ============================================================================
// START SERVER
// ============================================================================
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  var filepath = (urlObj.pathname == '/') ? '/index.html' : urlObj.pathname;
  // get the target file
  fs.readFile(ROOT_DIR + filepath, function (err, data) {
    // error response
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    // send head
    if (req.url.endsWith('html')) {
    	res.writeHead(200, { 'Content-Type': 'text/html' });
    } else if (req.url.endsWith('js')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
    }
    // send response
    res.end(data);
  });
}).listen(8080, 'localhost', 3, function() {
  console.log('Running on port 8080');
});
