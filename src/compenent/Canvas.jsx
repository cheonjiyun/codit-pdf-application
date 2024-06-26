import { getDocument } from "pdfjs-dist";
import { useEffect, useRef } from "react";

export default function Canvas({ setPdfDoc, pageNum, url }) {
    const canvasRef = useRef(null);

    const renderPage = async () => {
        if (url === "") return;

        const loadingTask = getDocument(url); // pdf src url 제공 -> task를 반환

        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);

        const page = await pdf.getPage(pageNum);
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
        const temp = await page.getTextContent();
        console.log(temp);
    };

    useEffect(() => {
        renderPage();
    }, [pageNum]);

    return <canvas ref={canvasRef} id="the-canvas"></canvas>;
}
