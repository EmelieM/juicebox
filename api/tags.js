const express = require("express");
const { getAllTags, getPostsByTagName } = require("../db");
const tagsRouter = express.Router();

//

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

//

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

//

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagname } = req.body;

  try {
    const allTaggedPosts = await getPostsByTagName(tagname);

    const taggedPosts = allTaggedPosts.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id)
        ? true
        : false;
    });

    if (taggedPosts) {
      res.send({
        posts: taggedPosts,
      });
    } else {
      next({
        name: "TaggedPostsNotFound",
        message: "No posts with those tags exist",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
