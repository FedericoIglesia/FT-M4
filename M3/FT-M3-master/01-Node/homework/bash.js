const commands = require("./commands");

const done = function (output) {
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
};

// Output un prompt
process.stdout.write("prompt > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on("data", function (data) {
  var args = data.toString().trim().split(" "); // remueve la nueva línea
  var cmd = args.shift();
  if (commands[cmd]) commands[cmd](args, done);
  else process.stdout.write(`command "${cmd}" not found`);

  // if (cmd == "date") {
  //   process.stdout.write(Date());
  // } else if (cmd == "pwd") {
  //   process.stdout.write(process.env.PWD); // or (process.cwd());
  // }
  // process.stdout.write("\nprompt > ");
});

// console.log(Object.keys(process));
