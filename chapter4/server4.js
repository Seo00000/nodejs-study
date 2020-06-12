const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie ='') => 
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    // console.log(req.url, cookies); //주소의 path와 search 부분을 알려줌
    // res.writeHead(200, {'Set-Cookie' : 'mycookie=test'}); //쿠키 기록
    // res.end('Hello Cookie');

    if(req.url.startsWith('/login')){
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location: '/',
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    } else {
        fs.readFile('./server4.html', (err, data) => {
            if(err){
                throw err;
            }
            res.end(data);
        });
    }
})
.listen(8083, () => {
    console.log('8083번 포트에서 대기 중입니다!');
});

/*   쿠키 옵션 관련. 옵션간의 구분은 세미콜론으로 함.
• 쿠키명=쿠키값: 기본적인 쿠키의 값입니다. mycookie=test 또는 name=zerocho 같이 설정합니다.
• Expires=날짜: 만료 기한입니다. 이 기한이 지나면 쿠키가 제거됩니다. 기본값은 클라이언트가 종료될 때까지입니다.
• Max-age=초: Expires와 비슷하지만 날짜 대신 초를 입력할 수 있습니다. 해당 초가 지나면 쿠기가 제거됩니다. Expires보다 우선합니다.
• Domain=도메인명: 쿠키가 전송될 도메인을 특정할 수 있습니다. 기본값은 현재 도메인입니다.
• Path=URL: 쿠키가 전송될 URL을 특정할 수 있습니다. 기본값은 ‘/’이고 이 경우 모든 URL에서 쿠키를 전송할 수 있습니다.
• Secure: HTTPS일 경우에만 쿠키가 전송됩니다.
• HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근할 수 없습니다. 쿠키 조작을 방지하기 위해 설정하는 것이 좋습니다.

*/