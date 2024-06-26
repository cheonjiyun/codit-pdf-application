import { useState } from "react";
import "./App.css";
import { GlobalWorkerOptions } from "pdfjs-dist";
import Canvas from "./compenent/Canvas";

GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs"; //모듈 소스
function App() {
    const [url, setUrl] = useState("");

    const [pdfDoc, setPdfDoc] = useState(null); // pdfDoc 보관
    const [pageNum, setPageNum] = useState(0); // 페이지숫자 보관

    /* pdf 확장자만 받는다 */
    const filtTypeCheck = (event) => {
        const fileType = event.target.value.split(".");
        if (fileType[fileType.length - 1] === "pdf") {
            return true;
        }
        alert("pdf만 업로드 해주세요.");
        return false;
    };

    /* 사용자가 파일 업로드했을 때 */
    const fileChange = (event) => {
        // 확장자 체크
        if (!filtTypeCheck(event)) {
            return;
        }

        // pdf url 설정
        const path = URL.createObjectURL(event.target.files[0]); // url 추출
        setUrl(path); // pdf url 설정
        console.log(url);
        // 첫 페이지 설정
        setPageNum(1);
    };

    /* 이전페이지 */
    const onPrevPage = () => {
        if (pageNum <= 1) return;

        setPageNum((pageNum) => pageNum - 1);
    };

    /* 다음페이지 */
    const onNextPage = () => {
        if (pageNum >= pdfDoc.numPages) return;

        setPageNum((pageNum) => pageNum + 1);
    };

    return (
        <main>
            <div className="input-container">
                <input type="file" id="pdf-upload" accept=".pdf" onChange={fileChange} />
                <label htmlFor="pdf-upload">PDF업로드</label>
            </div>
            {/* <iframe src="/assets/2100113_의사국 의안과_의안원문.pdf"></iframe> */}
            <div className="pdf-container">
                {url && (
                    <div className="pdf-util">
                        <button onClick={onPrevPage}>이전페이지</button>
                        <button onClick={onNextPage}>다음페이지</button>
                    </div>
                )}
                {url && <Canvas setPdfDoc={setPdfDoc} pageNum={pageNum} url={url} />}
                <div className="text-container"></div>
            </div>
        </main>
    );
}

export default App;
