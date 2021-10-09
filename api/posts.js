const express = require("express");
const { getAllPosts, createPost } = require("../db");
const postsRouter = express.Router();

const { requireUser } = require("./utils");

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    postData = {
      authorId: req.user.id,
      title,
      content,
    };
    const post = await createPost(postData);
    if (post) {
      res.send(post);
    } else {
      next({
        name: "PostCreationError",
        message: "Can't create post",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    res.send({
      posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
