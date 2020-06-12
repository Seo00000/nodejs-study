const fs = require('fs');

fs.readdir('./folder', (err, dir) => { // (경로, 콜백) | 폴더 안의 내용물을 확인
    if (err) {
        throw err;
    }
    console.log('폴더 내용 확인', dir);
    fs.unlink('./folder/newFile.js', (err) => { // (경로, 콜백) | 파일 지우기, 파일이 없다면 에러 발생하므로 있는지 확인 요망
        if (err) {
            throw err;
        }
        console.log('파일 삭제 성공');
        fs.rmdir('./folder', (err) => { // (경로, 콜백) | 폴더 지우기. 폴더 안에 파일이 있다면 에러 발생함(파일들부터 전부 지워야 함)
            if (err) {
                throw err;
            }
            console.log('폴더 삭제 성공');
        });
    });
});