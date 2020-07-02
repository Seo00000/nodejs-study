const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ // localStrategy의 첫번째 인자로 주어진 객체는 전략에 관한 설정을 함. req.body.email에 이메일이 req.body.password에 비밀번호가 들어옴.
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => { // 실제 전략을 수행함. 세번째 매개변수인 done 함수는 passport.authenticate의 콜백 함수.
        try {
            const exUser = await User.find({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
