import { useState } from "react";
import "./App.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { useRef } from "react";

function App() {
    GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs"; //모듈 소스

    const canvasRef = useRef(null);
    const [url, setUrl] = useState("");

    (async () => {
        if (url !== "") {
            const loadingTask = getDocument(url); // pdf src url 제공 -> task를 반환

            const pdf = await loadingTask.promise;

            const page = await pdf.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            const outputScale = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            const renderContext = {
                canvasContext: context,
                transform,
                viewport,
            };

            page.render(renderContext);
        }
    })();

    /* pdf 확장자만 받는다 */
    const filtTypeCheck = (event) => {
        const fileType = event.target.value.split(".");
        if (fileType[fileType.length - 1] === "pdf") {
            return true;
        }
        alert("pdf만 업로드 해주세요.");
        return false;
    };

    /* 사용자가 파일 업로드하면 */
    const fileChange = (event) => {
        // 확장자 체크
        if (!filtTypeCheck(event)) {
            return;
        }

        // pdf url 설정
        const path = URL.createObjectURL(event.target.files[0]); // url 추출
        setUrl(path); // pdf url 설정
    };

    return (
        <main>
            <div className="input-container">
                <input type="file" id="pdf-upload" accept=".pdf" onChange={fileChange} />
                <label htmlFor="pdf-upload">PDF업로드</label>
            </div>
            {/* <iframe src="/assets/2100113_의사국 의안과_의안원문.pdf"></iframe> */}
            <div className="pdf-container">
                <canvas ref={canvasRef} id="the-canvas"></canvas>
                <div className="text-container"></div>
            </div>
        </main>
    );
}

export default App;
