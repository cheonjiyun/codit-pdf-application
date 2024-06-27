import { useRef, useState } from "react";
import "./App.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import Canvas from "./compenent/Canvas";

GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs"; //모듈 소스
function App() {
    const [pdfDoc, setPdfDoc] = useState(null); // pdfDoc 보관
    const textParsingStart = useRef(false);
    const textParsing = useRef([]);

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
    const fileChange = async (event) => {
        // 확장자 체크
        if (!filtTypeCheck(event)) {
            return;
        }

        // pdf url 설정
        const path = URL.createObjectURL(event.target.files[0]); // url 추출

        // pdf 설정
        const loadingTask = getDocument(path); // pdf src url 제공 -> task를 반환
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
    };

    return (
        <main>
            <div className="input-container">
                <input type="file" id="pdf-upload" accept=".pdf" onChange={fileChange} />
                <label htmlFor="pdf-upload">PDF업로드</label>
            </div>
            {/* <iframe src="/assets/2100113_의사국 의안과_의안원문.pdf"></iframe> */}
            <div className="pdf-container">
                {pdfDoc &&
                    [...Array(pdfDoc.numPages)].map((_, index) => (
                        <Canvas
                            pdfDoc={pdfDoc}
                            pageNum={index + 1}
                            key={index}
                            textParsing={textParsing}
                            textParsingStart={textParsingStart}
                        />
                    ))}
                <div className="text-container"></div>
            </div>
        </main>
    );
}

export default App;
