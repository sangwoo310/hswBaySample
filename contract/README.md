# NFT Bay

NFT 토큰 거래소 컨트랙

## 개발 환경 구성

- Docker
- Ubuntu 18.04

### 정글넷 환경 (Docker)

1. 우분투 18.04 이미지 다운로드 `docker pull ubuntu:18.04`
2. 도커 포트 포워딩하여 실행 & 쉘 접속 `docker run -i -t -p 8888:8888 -p 9876:9876 --name junglenet ubuntu:18.04 /bin/bash`
3. `apt-get update`
4. `apt-get install -y wget vim`
5. 정글넷 등록하고 스크립트 생성 https://monitor.jungletestnet.io/#register
6. 스크립트 실행(xxxxxxxx부분에 자신의 account)
   `ex) wget https://api.monitor.jungletestnet.io/launchers/installJungle-xxxxxxxx.sh && \ chmod u+x installJungle-xxxxxxxx.sh` `

### 정글넷 최신 스냅샷 주소

- 스냅샷은 다운로드 후 blocks, state 디렉토리에 각각 덮어쓰기 하면된다. _주의할점은 os 버전이 맞아야 한다. 정글넷은 ubuntu 16, 18지원_
- http://backup.jungletestnet.io/ubuntu18/blocks-latest.tar.gz (ubunt16/blocks-latest.tar.gz)
- http://backup.jungletestnet.io/ubuntu18/state-latest.tar.gz (ubunt16/state-latest.tar.gz)

### CDT 구성하기

```shell
$ git clone --recursive https://github.com/eosio/eosio.cdt
$ cd eosio.cdt
$ ./build.sh
$ sudo ./install.sh
```

## 파일 구조

- nft_bay.hpp : 거래소 헤더파일
- nft_bay.cpp : 거래소 컨트랙

## 액션 설명

- regauction : 판매 등록
- cancelauc : 판매 시간이 만료되었는데 아무도 비딩하지 않았을 경우만 취소 가능
- bid : 비딩(eosio.token transfer 액션을 트리거로 실행)
- claim : 판매 시간 종료시 토큰 <> 이오스 교환하기

## 빌드 배포 스크립트
```
$ ./deploy.sh 지갑비밀번호
```

## 빌드
```
$ eosio-cpp -o [name].wasm [name].cpp --abigen
```

## 배포
```
$ cleos set contract [name] ./ -p [name@active]
```

## 액션
```
$ cleos push action [name][method] '[parameters]' -p [name@active]
```

## 램 구매
```
$ cleos system buyram [payer][receiver] --kbytes 1000
```

## 컨트랙트 삭제
```
$ cleos set contract account dir --clear
```

## 변경이력

## 명령어

- cleos wallet list
- cleos wallet open
- cleos wallet unlock --password [pwd]
- cleos wallet create -n [name] --to-console
- cleos create key --to-console
- cleos wallet import -n [name] --private-key [prv-key]
- cleos set account permission contract_account active '{"threshold": 1,"keys": [{"key": "publickey","weight": 1}],"accounts": [{"permission":{"actor":"contract_account","permission":"eosio.code"},"weight":1}]}' owner -p contract_account

---

- ./start.sh --delete-all-blocks --genesis-json genesis.json
- eosio-cpp -o [name].wasm [name].cpp --abigen

## 트러블슈팅

- 노드를 실행하면 http 플러그인 관련 에러가 날 수 있는데 config.ini에서 https 관련 설정을 주석처리한다.

## 스냅샷 받은거 동기화 시작하기

1. /snapshot폴더에 최신 스냅샷 다운로드
2. rm -rf /blocks/reversible
3. ./start.sh --hard-replay

## 스냅샷 생성

1. config.ini파일 안에 snapshots-dir = [스냅샷 경로]
2. config.ini파일 안에 plugin = eosio::producer_api_plugin
3. curl http://localhost:8888/v1/producer/create_snapshot

## Dirty flag 발생시 스냅샷 시점부터 복구하기

1. /blocks 디렉토리에 blocks.log만 남기고 삭제
2. /state 디렉토리 삭제
3. nodeos --snapshot [snapshot file][blocks.log file]

## 개념

- code : 컨트랙트 어카운트를 의미, \_code 변수를 통해 접근 가능.
- multi_index_table.emplace("ram payer", [&]( auto& row ) {});
- 이터레이터에서 end()는 null
- cleos get table [contract][scope] [table] --lower [key] --limit 1
- cleos get table [contract][scope] [table] --upper 2010 --key-type i64 --index 2(secondary index) -l -1
