const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const saltRounds = 10;
let getDecode = function (token) {
  let decoded = jwt.verify(token, 'secure');
  console.log(decoded);
  return decoded
}

class User{
  static register (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(!err) {
        let newUser = new userModel (
          {
            name: req.body.name,
            email: req.body.email,
            password: hash,
            about: req.body.about
          }
        )
        newUser.save()
        .then((response) => {
          res.status(200).json({
            data: response
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        console.log(err);
      }
    });
  }

  static login (req, res) {
    userModel.findOne(
      {
        email: req.body.email
      }
    )
    .then((user) => {
      console.log(req.body);
      bcrypt.compare(req.body.password, user.password, (err, response) => {
        if(!err) {
          if(response === true) {
            let token = jwt.sign(
              {
                 id: user._id,
                 name: user.name,
                 email: user.email,
                 following: user.following,
                 followers: user.followers,
                 post: user.post
               },
               'secure'
             );
            res.status(200).json({
              msg: 'login berhasil',
              status: true,
              token: token
            })
          } else {
            res.status(200).json({
              status: false,
              msg: 'password salah'
            })
          }

        } else {
          res.status(500)
        }
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  static getSelf(req, res) {
    let decoded = getDecode(req.headers.token)
    userModel.findById(decoded.id)
    .populate('user')
    .populate('post')
    .populate('comment')
    .then((user) => {
      res.status(200).json({
        data: user
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  static getFollowing(req, res) {
    console.log('masuk', req.headers.token);
    let decoded = getDecode(req.headers.token)
    userModel.findById(decoded.id)
    .then((self) => {
      userModel.findById(req.params.id)
      .then((user) => {
        self.following.push(user._id)
        user.followers.push(self._id)
        self.save()
        .then((response) => {
          user.save()
          .then(() => {
            res.status(200).json({
              data:response
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
    }).catch((err) => {
      console.log(err);
    })
  }

  static getUser(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      let dataUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        following: user.following,
        followers: user.followers,
        post: user.post
      }
      res.status(200).json({
        data: dataUser
      })
    }).catch((err) => {
      console.log(err);
      res.status(500)
    })
  }
}

module.exports = User
