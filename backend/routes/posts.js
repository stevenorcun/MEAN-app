const express = require('express');
const Post = require('../model/post');
const multer = require('multer');
const checkAut = require('../middleware/check-auth');

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
        if(isValid){
            error = null;
        }
        callback(error, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname
            .toLowerCase()
            .split(' ')
            .join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' +ext);
    }
})

router.get('', (req, res)=> {
    // The so called req.query permet de voir les paramètre de l'URL
    // On récupère un objet JSON 
    // On met un '+' devant pour récupérer un number et non un String
    const pageSize = +req.query.pageSize;
    const currentPage = req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then( documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then( count => {
            res.status(200).json({
                message: "Posts fetched successfully !",
                posts: fetchedPosts,
                maxPosts: count
            })
        })
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then( post => {
            if(post){
                res.status(200).json(post)
            }else{
                res.send(404).json({message: "Not found with the given ID"})
            }
        })
})

router.post("", checkAut , multer({storage}).single('image'),(req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        // Grace au middleware chechAut on accès à l'Id de l'user
        creator: req.userData.userId
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

router.put('/:id', checkAut ,multer({ storage }).single("image"), async (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath,
        creator: req.userData.userId
    });
    
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then(result => {
            if(result.nModified > 0){
                res.status(201).json({
                    message: "Updated successfully !",
                    post
                })
            }else{
                res.status(404).json({
                    message: 'Not Authorized'
                })
            }
        })
})

router.delete("/:id", checkAut, (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
        if(result.n > 0){
            res.status(201).json({
                message: "Deleted successfully !",
                result
            })
        }else{
            res.status(404).json({
                message: 'Not Authorized'
            })
        }
    })
})

module.exports = router;