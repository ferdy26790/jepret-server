const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const postModel = require('../models/posts')
const saltRounds = 10;
let getDecode = function (token) {
  let decoded = jwt.verify(token, 'secure');
  console.log(decoded);
  return decoded
}

class Post{
  static addPost(req, res) {
    console.log('masuk');
    let decoded = getDecode(req.headers.token)
    let newPost = new postModel(
      {
        title: req.body.title,
        image: req.file.cloudStoragePublicUrl
      }
    )
    newPost.save()
    .then((postSaved) => {
      userModel.findById(decoded.id)
      .then((user) => {
        user.post.push(postSaved._id)
        user.save()
        .then((userSaved) => {
          res.status(200).json({
            user: userSaved,
            post: postSaved
          })
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  static getPost(req, res) {
    console.log('masuk', req.params.id);
    postModel.findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'userComment',
        model: 'user'
      }
    })
    .populate('user')
    .then((post) => {
      res.status(200).json({
        data: post
      })
    }).catch((err) => {
      console.log(err);
      res.status(500)
    })
  }

  static editPost(req, res) {
    postModel.findById(req.params.id)
    .then((post) => {
      //post.image = req.file.cloudStoragePublicUrl || post.image
      post.title = req.body.title || post.title
      post.save()
      .then((postEdited) => {
        res.status(200).json({
          data: postEdited
        })
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      res.status(500)
    })
  }

  static deletePost(req, res) {
    let decoded = getDecode(req.headers.token)
    postModel.findByIdAndRemove(req.params.id)
    .then((post) => {
      userModel.findById(decoded.id)
      .then((user) => {
        console.log('dapet', user);
        user.post.forEach((myPost, idx) => {
          console.log(myPost);
          if(myPost == req.params.id) {
            console.log('masuk sini');
            user.post.splice(idx, 1)
            console.log('splice', user);
            user.save()
            .then((userSaved) => {
              res.status(200).json({
                data: userSaved
              })
            }).catch((err) => {
              console.log(err);
            })
          }
        })
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log(err);
      res.status(500)
    })
  }
}

module.exports = Post
