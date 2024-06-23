# YouTube API를 이용한 음악 플레이리스트 웹 사이트

본 프로젝트는 사용자가 개별 JSON 파일에 포함된 음악 트랙 메타데이터와 Python을 이용한 JSON 파일로 플레이리스트를 생성하고, YouTube Data API를 통해 해당 음악을 검색하여 웹 사이트에서 직접 들을 수 있게 해주는 웹 애플리케이션입니다.

## Function

* Python : Python을 이용한 JSON 파일을 날짜별로 업로드하고 음악 메타데이터를 관리합니다.
* YouTube API: YouTube Data API를 사용하여 메타데이터에 기반하여 음악 트랙을 검색합니다.
* 플레이리스트 관리: 플레이리스트를 생성 및 삭제합니다. 원하는 곡을 선택하여 로컬스토리지에서 플레이리스트를 관리합니다.
* 음악 듣기: 트랙을 클릭하여 내장된 YouTube 플레이어를 통해 음악을 들을 수 있습니다.

## Design

![image](https://github.com/gnlgk/Music-youtube/assets/161431748/edac1f56-98c3-424c-848c-a0d9291cb6c7)

## 트러블슈팅

1. 패키지 버전 충돌

* 문제: 패키지 버전 충돌로 인해 애플리케이션이 제대로 실행되지 않는 경우.
* 해결방법: 
    - 의존성 업데이트: npm update 명령어를 사용하여 모든 패키지를 최신 버전으로 업데이트합니다.
    - 의존성 관리: package.json 파일에서 각 패키지의 버전을 직접 관리하고 충돌이 없도록 확인합니다.
    - 패키지 재설치: 문제가 지속되면 해당 패키지를 제거하고 재설치합니다.

````bash
npm update
````

2. 로컬 스토리지

* 문제: 사용자의 브라우저에서 로컬 스토리지에 데이터를 저장하려고 하지만 동작하지 않거나 화면이 안뜨는 경우.
* 해결방법:
    - 브라우저 설정 확인: 개발 도구의 Console 탭에서 어떤 오류가 발생하는지 확인합니다.
    - 구글링 : localStorage.getItem과 localStorage.setItem등의 명령어를 이용하여 처리
    - Google 개발자 콘솔에서 확인 : Application의 Local storage에 이전에 만들어놓은 키와 값이 있을 경우 삭제 후 재시작

3. YouTube API 키 제외 오류

* 문제: https://vercel.com/에 배포를 하는 과정에서 YouTube API 키가 설정되지 않아 음악 검색이 되지 않는 경우.
* 해결방법: 
    - Google 개발자 콘솔에서 API 키 확인 : Network에서 Request URL이 key값이 undefine임을 확인
    - github 확인 : github에 API 키가 제대로 push되었는지 확인
    - 키값이 들어있는 .env파일을 .gitignore파일에서 포함시켜서 github에 push가 안됨을 확인
    - 키값이 github에 업로드되도록 설정

## 설치

```
npx create-react-app .
npm i react-spinners
npm i react-datepicker
npm i react-toastify
npm i react-modal
```

## 추가 라이브러리 설치

```
npm install react-router-dom axios react-icons react-player sass react-helmet-async swiper
```

## 시작

```
npm start
```

