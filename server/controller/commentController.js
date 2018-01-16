const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const postModel = require('../models/posts')
const commentModel = require('../models/comments')
let getDecode = function (token) {
  let decoded = jwt.verify(token, 'secure');
  console.log(decoded);
  return decoded
}

class Comment {
  static addComment(req, res) {
    let decoded = getDecode(req.headers.token)
    let newComment = new commentModel(
      {
        comment : req.body.comment,
        userComment : decoded.id
      }
    )
    newComment.save()
    .then((newComment) => {
      postModel.findById(req.params.id)
      .then((post) => {
        post.comments.push(newComment._id)
        post.save()
        .then((postSaved) => {
          res.status(200).json({
            comment: newComment,
            post: postSaved
          })
        }).catch((err) => {
          console.log(err);
          res.status(500)
        })
      }).catch((err) => {
        console.log(err);
        res.status(500)
      })
    }).catch((err) => {
      console.log(err);
      res.status(500)
    })
  }

  
}

module.exports = Comment
