const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => {
  try {
    if (req.session.jwt) {
      const tokenResult = await axios.post('http://localhost:8002/v1/token', {
        headers: { authorization: req.session.jwt },
      });
      if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 
        req.session.jwt = tokenResult.data.token;
      } else {
        return res.json(tokenResult.data); // 발급 실패 사유
      }
    }
    //발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8002/v1/test', {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) { // 토큰 만료 시
      return res.json(error.response.data);
    }
    return next(error);
  }
});

module.exports = router;