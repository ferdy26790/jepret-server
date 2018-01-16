const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jepretgram', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  about: String,
  post: [
    {
    type: Schema.Types.ObjectId,
    ref: 'post'
    }
  ],
  followers: [
    {
    type: Schema.Types.ObjectId,
    ref: 'user'
    }
  ],
  following: [
    {
    type: Schema.Types.ObjectId,
    ref: 'user'
    }
  ]
})

let User = mongoose.model('user', userSchema)

module.exports = User
