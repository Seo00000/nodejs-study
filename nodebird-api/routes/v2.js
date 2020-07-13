const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host }, //도메인 모델로 클라이언트 도메인req.get('origin')과 일치하는지 검사하기
    });
    if (domain) { //일치하면 cors 허용
        cors({ origin: req.get('origin') })(req, res, next); //// router.use(cors()); 와 같음
    } else {
        next();
    }
})

router.post('/token', apiLimiter, async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            here: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick, //첫번째 인자: 토큰의 내용(아이디, 닉네임)
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', // 유효기간 : 1분
            issuer: 'nodebird', // 발급자
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/followings', apiLimiter, verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.decoded.id }});
        if (!user) {
          res.status(403).send('없는 사람을 찾으려고 하시네요?');
        }
        const followings = await user.getFollowings({ attributes: ['id', 'nick'] });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/followers', apiLimiter, verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.decoded.id }});
        if (!user) {
          res.status(403).send('없는 사람을 찾으려고 하시네요?');
        }
        const followings = await user.getFollowers({ attributes: ['id', 'nick'] });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

module.exports = router;
