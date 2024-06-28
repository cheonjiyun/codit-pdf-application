# PDF 뷰어 애플리케이션 과제

![image](https://github.com/cheonjiyun/codit-pdf-application/assets/70828192/99b37110-1b24-4f46-b8cd-fb82d3acf097)

### 설치 및 실행방법

#### 다운로드

클론

```
git clone git@github.com:cheonjiyun/codit-pdf-application.git
```

패키지 설치

```
npm install
```

개발 환경 실행

```
npm run dev
```

### 사용방법

버튼을 통해 pdf를 업로드하면 뷰잉됩니다.
파싱결과는 콘솔 혹은 txt다운로드를 통해 볼 수 있습니다.

## 항목 1) 사용자가 PDF 파일을 업로드할 수있어야 함

### 1-1) PDF업로드 UI만들기

-   input file을 만들고 label에 css를 부여해 pdf업로드 버튼을 만들었습니다.

### 1-2) PDF만 업로드할 수 있도록 제한

-   input에 `accept=".pdf"` 추가하였습니다.
-   혹시 pdf가 아닌 파일을 업로드한다면 alert를 띄웠습니다.

## 항목 2) 업로드된 PDF 파일을 웹 페이지에서 볼 수 있어야 함

### 2-1) 임시pdf로 한 페이지만 canvas로 뷰잉

이 과정이 생소하고 감이 잡히지 않아 가장 어려웠습니다.

-   PDF.JS의 홈페이지 example을 보며 따라 만들어보려했습니다. (https://mozilla.github.io/pdf.js/examples/)
-   하지만 바닐라 js 와 차이점이 있어 그대로적용할 수는 없었습니다.
-   dfjsLib이 라이브러리에서 검색되지 않아 처음부터 많이 해매었습니다.

`pdfjsLib.getDocument('helloworld.pdf')`

"만약 pdfjsLib이 모듈이름이라면 react에서는 GlobalWorkerOptions 구조분해할당으로 바로 불러올 수 있지 않을까?" 라는 생각을 했습니다. 아래처럼 바로 불러올 수 있었고 같은 workerSrc를 설정할 수 있었습니다.

`GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs";`

불러온 뒤 canvas에 그리는 것도 example을 통해 성공하였습니다.

#### React에 맞추어 canvas사용하기

-   document.getElementById 는 React에서 권장하지 않는 방식이기 때문에, useRef를 사용해 canvas를 수정하였습니다.

```js
const canvas = canvasRef.current;
.
.
.
<canvas ref={canvasRef} id="the-canvas"></canvas>
```

#### 아쉬운 점

다른 pdf뷰어처럼 텍스트를 드래그하거나 그리는 등 다른 기능을 넣지 못하고 보여주기만 해서 아쉽습니다.

### 2-2) 사용자가 첨부한 파일을 보여주기

임시 파일로 뷰잉했던 것을 사용자가 첨부하는 pdf로 바꾸어주는 과정을 진행했습니다.
첨부한 파일의 url를 추출했습니다.

```js
const path = URL.createObjectURL(event.target.files[0]);
```

pdf파일이 바뀐다면 다시 render해야하기 때문에 useState로 빼주었습니다.

```js
const [pdfDoc, setPdfDoc] = useState(null); // pdfDoc 보관
```

### 2-2) 이전페이지 다음페이지

-   PDF.js example에 있는 페이지 예시를 보고 제작하였습니다.
-   이 과정에서 `pdfDoc.numPages` 라는 프로퍼티를 통해 총 페이지를 불러올 수 있다는 것을 알았습니다.

### 2-3) 모든 페이지를 한통해 볼 수 있도록 변경

-   문자열 파싱을 위해서는 한페이지씩 불어와서는 불가능하다고 판단했습니다.
-   이전페이지 다음페이지 기능을 없애고, 한번에 모든 페이지를 불러와 문자열을 파싱하고자 했습니다.

#### 컴포넌트화

-   여러 canvas를 한번에 보여주어야 하니 canvas를 따로 컴포턴트하기로 결정했습니다.
-   필요한 pdf정보 페이지 등을 넘겨주고 컴포넌트안에서 render를 진행했습니다.

```js
export default function Canvas({ pdfDoc, pageNum, textParsing, textParsingStart }) {
    const canvasRef = useRef(null);
    .
    .
    .
    return <canvas ref={canvasRef} id="the-canvas"></canvas>;
}

```

## 항목 3) 뷰잉된 PDF파일에서 신구조문을 배열 형태로 파생하는 결과를 도출해야함

### 3-1) 글자 불러오기

-   pdfjs-dist 의 getTextContent함수를 발견했습니다.
-   단어별로 나누어서 문자열이 나오는 것을 파악했습니다.

![image](https://github.com/cheonjiyun/codit-pdf-application/assets/70828192/792dae43-1d96-468d-bbb8-858a54d1849a)

transfrom에 글자들의 위치정보가 담겨있다는 것을 알았습니다.

### 3-2) 신구조문위치 파악하기

getTextContent에는 위치정보만 있어서 표에 담겨있는지 파악할 수 없었습니다.
아쉽지만 '신·구조문대비표'이라는 단어가 나올 때 부터 문자열을 저장하기로 결정했습니다.

### 3-3) 좌우 구분해서 문자열로 넣기

x좌표가 317이상 이면 오른쪽 아니면 왼쪽으로 문자열을 넣어주었습니다.

### 3-4) txt파일로 다운로드

a태그를 임시로 만들어 다운로드할 수 있게 하였습니다.

#### 아쉬운점

-   결과적으로 첨부파일과 같은 결과를 만들지 못해 아쉽습니다.
-   의안번호와 제안이유 같은 문자열은 어떤 기준으로 파싱해야하는지 분석하지 못했습니다.
-   따라서 직접 좌표와 문자열을 설정한 점이 아쉽다. 다른 방법이 있을 것 같지만 찾지 못했습니다.
-   txt파일로 대괄호를 포함하지 못했습니다.

-   평소 궁금했던 pdf를 사용할 기회가 되어 좋았습니다.
