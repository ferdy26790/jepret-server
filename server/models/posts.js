const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jepretgram', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  image: String,
  likes: [
    {
    type: Schema.Types.ObjectId,
    ref: 'user'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ]
})

let Post = mongoose.model('post', postSchema)

module.exports = Post
