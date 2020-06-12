const fs = require('fs');

fs.access('./folder', fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (err) => { //(경로, 옵션, 콜백) | 폴더나 파일에 접근할수 있는지 체크
    if (err) {
        if (err.code === 'ENOENT') {
            console.log('폴더 없음');
            fs.mkdir('./folder', (err) => { //(경로, 콜백) | 폴더 만들기
                if (err) {
                    throw err;
                }
                console.log('폴더 만들기 성공');
                fs.open('./folder/file.js', 'w', (err, fd) => { //(경로, 옵션, 콜백) | 파일의 아이디(fd)를 가져오는 메서드, 이미 폴더가 있다면 에러 발생하므로 access() 메서드로 체크 요망
                    if (err) {
                        throw err;
                    }
                    console.log('빈 파일 만들기 성공', fd);
                    fs.rename('./folder/file.js', './folder/newfile.js', (err) => { //(기존 경로, 새 경로, 콜백) | 파일의 이름을 바꾸는 메서드, 반드시 같은 폴더를 지정할 필요는 없으므로 잘라내기 같은 기능을 할 수 있음
                        if (err) {
                            throw err;
                        }
                        console.log('이름 바꾸기 성공');
                    });
                });
            });
        } else {
            throw err;
        }
    } else {
        console.log('이미 폴더 있음');
    }
});