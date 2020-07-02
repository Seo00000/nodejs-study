const local = require('./localStrategy');
const kakao = require('./kakaoStrategy.js');
const { User } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { //사용자 정보를 세션에 아이디로 저장함
        done(null, user.id); //첫번째 인자는 에러발생시 사용
    });

    passport.deserializeUser((id, done) => { //세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
        User.fineOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
}

