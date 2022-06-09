const fs = require("fs");
const request = require("request");

//con agrs, done se esta haciendo el refactoring para no repetir codigo. Basicamente guardando los stdout.write en done()
module.exports = {
  date: function (args, done) {
    done(Date());
  },
  pwd: (args, done) => done(process.cwd()),
  ls: (args, done) => {
    let output = "";
    fs.readdir(".", function (err, files) {
      if (err) throw err;
      files.forEach(function (file) {
        //     process.stdout.write(file.toString() + "\n");
        //   });
        //   process.stdout.write("prompt > ");
        // });
        output += file.toString() + "\n";
      });
      done(output);
    });
  },
  echo: (args, done) => process.stdout.write(args.join(" ")),
  cat: (args, done) =>
    fs.readFile(args[0], (err, data) => {
      if (err) throw err;
      process.stdout.write(data);
      process.stdout.write("prompt > ");
    }),
  head: (args, done) =>
    fs.readFile(args[0], "utf-8", (err, data) => {
      //agregar el codec utf-8 para que data se lea como string y poder aplicar split mas abajo
      if (err) throw err;
      process.stdout.write(data.split("\n").slice(0, 10).join("\n"));
      process.stdout.write("prompt > ");
    }),
  tail: (args) =>
    fs.readFile(args[0], "utf-8", (err, data) => {
      //agregar el codec utf-8 para que data se lea como string y poder aplicar split mas abajo
      if (err) throw err;
      process.stdout.write(data.split("\n").slice(-10).join("\n"));
      process.stdout.write("prompt > ");
    }),
  curl: (args) => {
    request(args[0], (err, response, body) => {
      if (err) throw err;
      process.stdout.write(body);
      process.stdout.write("\nprompt > ");
    });
  },
  fede: () => process.stdout.write("Segui metiendole!!!"),
};
