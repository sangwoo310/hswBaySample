# NFTbay
Non-Fungible Tokens Trading Site for EOS

# 디렉토리 구조
- front-end : 웹 프론트엔드
- back-end : 백엔드
- contract : 이오스 컨트랙


## 1. back-end
  - IDE: [Intellij](https://www.jetbrains.com/idea/) or Eclipse
  - Lombok Intellij Plugin
  - Gradle
  - Java 11 ([adoptopenjdk](https://adoptopenjdk.net/releases.html)
  
### 1.1 back-end module
  - api : nftbay api 서버 모듈
  - batch : 블록 싱크 배치 모듈
  - common : 도메인등 공통 모듈
  
### 1.2 빌드
```
$ ./gradlew clean build
```

### 1.3 api 모듈 실행
  - 개발(정글넷) 모드 : ``` java -jar ./api/build/libs/api-0.0.1-SNAPSHOT.jar -Dspring.profiles.active=dev```
  - 프로덕션 모드 : ``` java -jar ./api/build/libs/api-0.0.1-SNAPSHOT.jar -Dspring.profiles.active=prod```
  
### 1.4 batch 모듈 실행
  - 개발(정글넷) 모드 : ``` java -jar ./batch/build/libs/batch-0.0.1-SNAPSHOT.jar  -Dspring.profiles.active=dev```
  - 프로덕션 모드 : ``` java -jar ./batch/build/libs/batch-0.0.1-SNAPSHOT.jar  -Dspring.profiles.active=prod```
  
### 1.5 background 실행
```
$ cd /home/ec2-user
$ nohup ./start_app.sh &
```

## 2. front-end
```
/front-end
├── config
|   ├── env.js
|   ├── path.js
|   ├── webpack.config.js
|   └── webpackDevServer.config.js
├── public
|   ├── card-background
|   ├── fonts
|   ├── icon
|   ├── img
|   └── index.html
├── scripts
|   ├── build.js
|   ├── start.js
|   └── test.js
├── src
|   ├── common
|   ├── contants
|   ├── lang
|   ├── layout
|   ├── service
|   ├── stores
|   ├── util
|   ├── App.js
|   ├── index.js
|   ├── theme.scss
|   ├── App.scss
|   └── index.scss
└── package.json
```

### 2.1 Config

- 개발 및 프로덕션용 상수정의 및 관리(env.js)
  1. getClientEnvironment 함수 내에서 NODE_ENV에 따라 상수 설정 분리
  2. local, dev, alp, prod 등 배포 및 테스트 환경에 따라 분리해야 할 상수들을 이곳에서 설정 및 관리

### 2.2 Public

- 이미지, 폰트 등 Static 파일들 관리
- 웹팩 설정을 통해 /public을 Static Resource 디렉토리로 지정하기 때문에 개발시 /img/devtooth-logo-navy.png 처럼 쉽게 경로에 접근할 수 있음

### 2.3 Scripts

- start.js : 개발용 스크립트
- build.js : 프로덕션 빌드용 스크립트

### 2.4 Src

- common      : 도메인에 상관없이 공통으로 사용할 수 있는 컴포넌트 및 Hoc을 관리
- constants   : 전역상수로 사용되는 변수들 관리
- lang        : 언어별 상수 정의 (현재 한국어, 영어 지원)
- layout      : SPA의 전체적인 레이아웃 구조 관리 (헤더, 컨텐트, 푸터 등)
- service     : 
  1. DDD(Domain-driven-development)기반으로 각 서비스 도메인 별로 나눠서 디렉토리를 관리(Home, My Account, Notice, Trade 등)
  2. 앞으로 추가되는 기능에 따라 디렉토리를 추가하고 서비스 도메인을 확장
- stores      : 
  1. 각 도메인별 스토어들을 루트스토어에서 정의하고 관계를 설정
  2. 보통 해당 서비스 도메인 디렉토리 내에서 Store를 만들고 관리하도록 하고, 루트 스토어는 모든 스토어들의 정의 및 관계만을 담당하도록 함
- utils       : Api 리퀘스트나 Json파싱 등 앱 내에서 디펜던시 없이 공통적으로 처리되는 로직 관리
- App.js      : 
  1. 앱의 전반적인 구조 및 라우팅 관계 설정
  2. 각 페이지는 고유한 URL을 가지며 Switch 내 Route에 설정된 path 규칙에 따라 맵핑 설정
- index.js    : 
  1. 앱의 시작점으로 document가 최초로 로드 되었을 때 해주어야 할 선행작업들을 처리
  2. Locale 설정
  3. Scatter 설정
- theme.scss  : 
  1. 앱의 전체적인 테마에 영향을 주는 설정들을 정의
  2. 보통 각 서비스 도메인별로 해당하는 페이지 디렉토리 내에 개별 css를 작성하고 일괄적으로 적용되어야 할 테마들은 이 곳에서 관리

## 3. contract
- Contract Path : NFTbay/contract/nftbay/
- Header File   : nftbay.hpp
- Content File  : nftbay.cpp
