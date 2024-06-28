import { useEffect, useRef } from "react";

export default function Canvas({ pdfDoc, pageNum, textParsing, textParsingStart }) {
    const canvasRef = useRef(null);

    const renderPage = async () => {
        const page = await pdfDoc.getPage(pageNum); // 페이지별로 불러오기
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
        const text = await page.getTextContent(true);
        let temp = ["", ""];
        text.items.forEach((item) => {
            if (item.str == "신·구조문대비표") {
                textParsingStart.current = true;
                return;
            } else if (
                // 여백 아래에서만
                textParsingStart.current &&
                item.transform[5] <= 750 &&
                item.transform[5] >= 48
            ) {
                // 좌우로
                if (pageNum >= 6 && item.transform[4] >= 317) {
                    temp[1] += item.str;
                } else {
                    temp[0] += item.str;
                }
            }
        });

        textParsing.current.push(temp);

        // 파싱 결과 출력
        if (pageNum == pdfDoc.numPages) console.log(textParsing.current);
    };

    useEffect(() => {
        renderPage();
    }, []);

    return <canvas ref={canvasRef} id="the-canvas"></canvas>;
}
