// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests

//SI VAMOS A TRABAJAR CON REQ.BODY NO TE PODES OLVIDAR DE ACTIVAR EL MIDDLEWARE DE EXPRESS.JSON()!!
server.use(express.json());

let prevId = 0;

// TODO: your code to handle requests
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (
    typeof author !== "string" ||
    author === "" ||
    typeof title !== "string" ||
    title === "" ||
    typeof contents !== "string" ||
    contents === ""
  ) {
    res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const post = { author, title, contents, id: ++prevId };

    posts.push(post);
    res.json(post);
  }
});

server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  let author = req.params.author;

  if (!title || !contents || !author) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
  const post = { author, title, contents, id: ++prevId };

  posts.push(post);
  res.json(post);
});

server.get("/posts", (req, res) => {
  const { term } = req.query;

  if (term) {
    const term_posts = posts.filter(
      (p) => p.title.includes(term) || p.contents.includes(term)
    );

    return res.json(term_posts);
  }

  res.json(posts);
});

server.get("/posts/:author", (req, res) => {
  const author = req.params.author;
  let post_author = posts.filter((p) => p.author == author);

  if (post_author.length > 0) {
    res.json(post_author);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con el autor indicado",
    });
  }
});

server.get("/posts/:author/:title", (req, res) => {
  const { author, title } = req.params;
  const POST_AUTH_TITLE = posts.filter(
    (p) => p.title === title && p.author === author
  );

  if (POST_AUTH_TITLE.length > 0) {
    res.json(POST_AUTH_TITLE);
  } else {
    res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
  }
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (id && title && contents) {
    let post = posts.find((a) => a.id === parseInt(id));
    if (post) {
      post.title = title;
      post.contents = contents;
      res.json(post);
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "No existe ningun post con dicho id" });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;

  if (id) {
    const ID_POST = posts.find((p) => p.id == id); //doing double equal to avoid doing parseInt()
    if (ID_POST) {
      posts.splice(posts.indexOf(ID_POST), 1);
      res.json({ success: true });
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "El id no coincide con un post existente" });
    }
  } else res.status(STATUS_USER_ERROR).json({ error: "No existe un id" });
});

server.delete("/author", (req, res) => {
  const { author } = req.body;

  if (author) {
    const AUTHOR_POST = posts.filter((p) => p.author === author);
    if (AUTHOR_POST.length > 0) {
      res.json(AUTHOR_POST);
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "No existe el autor indicado" });
    }
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe un campo de autor" });
  }
});
module.exports = { posts, server };
