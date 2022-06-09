var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor
http
  .createServer(function (req, res) {
    console.log(`llego un request a ${req.url}`);

    //     if (req.url === "/arcoiris_doge") {
    //       fs.readFile("./images/arcoiris_doge.jpg", function (err, data) {
    //         if (err) {
    //           res.writeHead(404, { "Content-Type": "text/plain" });
    //           res.end("Image not found");
    //         } else {
    //           res.writeHead(200, { "Content-Type": "image/jpeg" });
    //           res.end(data);
    //         }
    //       });
    //     }
    //   })

    // Forma Dinamica:
    fs.readFile(`./images/${req.url}.jpg`, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Image not found");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      }
    });
  })
  .listen(1337, "127.0.0.1");
