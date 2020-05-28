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

// 테이블 생성
// CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
// species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);

// primary key(기본키) 중복 방지와 성능을 위함.

// 테이블 컬럼 확인
// SHOW COLUMNS FROM table_name or DESC table_name

// 테이블의 데이터 확인
// SELECT * FROM table_name

// update(수정)
// 
// UPDATE [LOW_PRIORITY] [IGNORE] table_references
//     SET assignment_list
//     [WHERE where_condition]

// UPDATE t1 SET col1 = col1 + 1;

// delete(삭제);
// DELETE [LOW_PRIORITY] [QUICK] [IGNORE] FROM tbl_name [[AS] tbl_alias]
// [PARTITION (partition_name [, partition_name] ...)]
// [WHERE where_condition]
// [ORDER BY ...]
// [LIMIT row_count]

// DELETE t1, t2 FROM t1 INNER JOIN t2 INNER JOIN t3
// WHERE t1.id=t2.id AND t2.id=t3.id;