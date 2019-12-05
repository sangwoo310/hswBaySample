# NFTBay backend project

## Required

- JDK 11 [adoptopenjdk11](https://adoptopenjdk.net/index.html?variant=openjdk11&jvmVariant=hotspot)
- Gradle
- Intellij or Eclipse

## build
```
$ ./gradlew clean build
```

## run
```
$ java -jar api/build/libs/api-0.0.1-SNAPSHOT.jar
```

## 모듈
- api : api 스프링부트 프로젝트
- batch : 노드 블록 싱크 배치 프로젝트
- common : 공통 라이브러리
