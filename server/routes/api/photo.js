import express from 'express';
import multer from 'multer';
import moment from 'moment';

import Photo from '../../models/photo.js';
import User from '../../models/user.js';
import auth from '../../middleware/auth.js';
import comment from '../../models/comment.js';

const router = express.Router();

import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
    storage: multerS3({
        s3,
        bucket: 'jinseokproject1/upload',
        region: 'ap-northeast-2',
        key(req, file, cb) {
            const ext = path.extname(file.originalname); // 파일 확장자
            const basename = path.basename(file.originalname, ext); //
            cb(null, basename + new Date().valueOf() + ext); // 파일 중복이 없도록 설정하는 것들
        },
    }),
    limits: { fileSize: 100 * 1024 * 1024 }, //파일 용량 사이즈 설정
});

router.post('/image', uploadS3.single('file'), function (req, res, next) {
    res.json({ success: true, filePath: req.file.location, fileName: req.file.originalname });
});

router.post('/', async (req, res) => {
    try {
        const photo = new Photo(req.body);

        await photo.save(() => {
            res.status(200).json({ success: true, id: photo._id });
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false, err });
    }
});

const getPagination = (page, size) => {
    const limit = size ? +size : 8;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

router.get('/photos', async (req, res) => {
    try {
        const { page, size, title, genres } = req.query;

        var condition = title ? { title: { $regex: new RegExp(title), $options: 'i' }, genres: `${genres}` } : genres ? { genres: `${genres}`} : {} ;

        const { limit, offset } = getPagination(page, size);

        await Photo.paginate(condition, { offset, limit }).then((data) => {
            console.log(data);
            res.send({
                totalItems: data.totalDocs,
                photodata: data.docs.reverse(),
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.get('/bestphotos', async (req, res) => {
    try {
        const { page, size, title } = req.query;
        var condition = title ? { title: { $regex: new RegExp(title), $options: 'i' }, views: { $gte: 10 } } : { views: { $gte: 10 } };

        const { limit, offset } = getPagination(page, size);

        await Photo.paginate(condition, { offset, limit, sort: { createdAt: -1 } }).then((data) => {
            console.log(data);
            res.send({
                totalItems: data.totalDocs,
                bestphotodata: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.get('/getphoto', async (req, res) => {
    try {
        const photoId = req.query.id;
        const photodetail = await Photo.findById({ _id: photoId }).populate({ path: 'writer', select: 'name' });
        photodetail.views += 1;
        photodetail.save();
        res.json(photodetail);
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.get('/bestimages', async (req, res) => {
    try {
        const bestphotoes = await Photo.find({views: { $gte: 10 }}).populate({ path: 'writer', select: 'name' })
        console.log(bestphotoes, 'best');
        res.json(bestphotoes);
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        console.log(req.params);
        await Photo.deleteMany({ _id: req.params.id });
        await User.findByIdAndUpdate(req.user.id, {
          $pull: {
            posts: req.params.id,
            comments: { post_id: req.params.id },
          },
        });
        return res.json({ success: true });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id).populate('writer', 'name');
        res.json(photo);
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

router.post('/:id/edit', async (req, res) => {
    const {
        body: { title, description, images, genres, id },
    } = req;
    try {
        console.log(id, 'ID');

        await Photo.findByIdAndUpdate(
            req.body.id,
            {
                title,
                description,
                images,
                genres,
            },
            { new: true }
        );
        res.json({ id: id, success: true });
    } catch (e) {
        console.log(e);
        res.status(400).json({ success: false });
    }
});

export default router;
