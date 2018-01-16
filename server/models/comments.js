const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jepretgram', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: String,
  userComment: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

let Comment = mongoose.model('comment', commentSchema)

module.exports = Comment
