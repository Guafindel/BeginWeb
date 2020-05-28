function init() {

}

init();

// mySQL on CMD
// mySQL bin 내부에서 cmd 실행
// mysql -uroot -p 입력
// 설정해둔 root 계정의 비밀번호 입력
// mysql -uroot -p[비밀번호] 명령어로 바로 접속 가능

// 커다란 구조로서 데이터베이스의 구조는 커다란 데이터베이스 서버(database server)안에 
// n개의 데이터베이스(database, schema)가 있으며 데이터베이스 안에 표(table)이 있는 형식이다.

// cmd에서 mySQL을 실행할 경우 모든 끝 문단에 세미콜론(;)이 있어야만 명렁어가 실행 됨.
// show databases 또는 show schemas; 현재 데이터베이스 서버 내부에 있는 데이터베이스(스키마) 목록 출력.


// database | schema 생성 문법
// CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
// [create_option] ...

// create_option: {
//     [DEFAULT] CHARACTER SET [=] charset_name
//   | [DEFAULT] COLLATE [=] collation_name
//   | [DEFAULT] ENCRYPTION [=] {'Y' | 'N'}
// }

// database | schema 삭제 문법
// DROP {DATABASE | SCHEMA} [IF EXISTS] db_name

// column(열) 하나의 속성, row(행) 한 줄의 데이터를 뜻함.

