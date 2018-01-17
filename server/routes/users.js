const express = require('express');
const router = express.Router();
const images = require('../middleware/image')
const userController = require('../controller/userController')
const postController = require('../controller/postController')
const commentController = require('../controller/commentController')
/* GET users listing. */
router.get('/', userController.getSelf)
router.post('/addPost', images.multer.single('image'), images.sendUploadToGCS, postController.addPost)
router.get('/myfollow', userController.myFollow)
router.get('/following/:id', userController.getFollowing)
router.get('/getPost/:id', postController.getPost)
router.delete('/deletePost/:id', postController.deletePost)
router.put('/editPost/:id', postController.editPost)
router.post('/addComment/:id', commentController.addComment)
router.get('/:id', userController.getUser)
module.exports = router;
