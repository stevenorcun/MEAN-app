const express = require('express');
const Post = require('../model/post');
const multer = require('multer');

const router = express.Router();
const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        console.log(file);
        if(isValid){
            error = null;
        }
        callback(error, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' +ext);
    }
})

router.get('', async (req, res, next)=> {
    Post.find()
        .then( documents => {
            res.status(200).json({
                message: "All posts loaded",
                posts: documents
            })
        })
});

router.get('/:id', async (req, res) => {
    Post.findById(req.params.id)
        .then( post => {
            if(post){
                res.status(200).json(post)
            }else{
                res.send(404).json({message: "Not found with the given ID"})
            }
        })
})

router.post("", multer({storage}).single('image'),(req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" +req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post created",
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        })
    })
})

router.put('/:id', async (req, res) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    
    Post.updateOne({_id: req.params.id}, post)
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Updated successfully !",
                post
            })
        })
})

router.delete("/:id", async (req, res, next) => {
    console.log(req.params.id)
    Post.deleteOne({_id: req.params.id})
        .then( result => {
            res.status(201).json({
                message: 'post deleted'
            })
        })
})

module.exports = router;