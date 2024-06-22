import "./App.css";

function App() {
    const filtTypeCheck = (event) => {
        const fileType = event.target.value.split(".");
        if (fileType[fileType.length - 1] === "pdf") {
            return true;
        }
        alert("pdf만 업로드 해주세요.");
    };

    return (
        <main>
            <input type="file" id="pdf-upload" accept=".pdf" onChange={filtTypeCheck} />
            <label htmlFor="pdf-upload">PDF업로드</label>
        </main>
    );
}

export default App;
