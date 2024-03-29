import React, { useState, useRef } from 'react';
import { minify } from 'terser';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [htmlContent1, setHtmlContent1] = useState('');
    const [elementId1, setElementId1] = useState('defaultId1'); // Default ID for element 1
    const [htmlContent2, setHtmlContent2] = useState('');
    const [elementId2, setElementId2] = useState('defaultId2'); // Default ID for element 2
    const [percentage, setPercentage] = useState(50);
    const [parentId, setParentId] = useState('body');
    const [generatedCode, setGeneratedCode] = useState('');

    const generatedCodeRef = useRef(null);

    const generateFunction = async () => {

        function minifyHtml(htmlContent) {
            return htmlContent.replace(/\s{2,}/g, ' ').replace(/\n/g, '').trim();
        }

        const minifiedHtml1 = minifyHtml(htmlContent1);
        const minifiedHtml2 = minifyHtml(htmlContent2);

        let functionCode = `
            (function() {
                var chosenPercentage = Math.random() * 100;
                var parent = ${parentId === 'body' ? 'document.body' : `document.getElementById('${parentId}')`};
            
                if (chosenPercentage < ${percentage}) {
                    var container1 = document.createElement('div');
                    container1.id = "${elementId1}";
                    container1.innerHTML = \`${minifiedHtml1}\`;
                    parent.appendChild(container1);
                } else {
                    var container2 = document.createElement('div');
                    container2.id = "${elementId2}";
                    container2.innerHTML = \`${minifiedHtml2}\`;
                    parent.appendChild(container2);
                }
            })();
        `;

        try {
            const result = await minify(functionCode);
            setGeneratedCode(result.code || '// Error during minification');
        } catch (error) {
            console.error('Minification error:', error);
            setGeneratedCode('// Error during minification');
        }
    };

    const copyToClipboard = () => {
        if (generatedCodeRef.current) {
            generatedCodeRef.current.select();
            document.execCommand('copy');
        }
    };

    return (
        <div className="container mt-5">
            <form>
                <div className="mb-3">
                    <label htmlFor="htmlContent1" className="form-label">HTML Content for Element 1:</label>
                    <textarea className="form-control" id="htmlContent1" rows="3" value={htmlContent1} onChange={(e) => setHtmlContent1(e.target.value)}></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="elementId1" className="form-label">Element 1 ID:</label>
                    <input type="text" className="form-control" id="elementId1" value={elementId1} onChange={(e) => setElementId1(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="htmlContent2" className="form-label">HTML Content for Element 2:</label>
                    <textarea className="form-control" id="htmlContent2" rows="3" value={htmlContent2} onChange={(e) => setHtmlContent2(e.target.value)}></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="elementId2" className="form-label">Element 2 ID:</label>
                    <input type="text" className="form-control" id="elementId2" value={elementId2} onChange={(e) => setElementId2(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="percentage" className="form-label">Percentage for Element 1:</label>
                    <input type="number" className="form-control" id="percentage" value={percentage} onChange={(e) => setPercentage(e.target.value)} min="0" max="100" />
                </div>

                <div className="mb-3">
                    <label htmlFor="parentId" className="form-label">Parent Element ID (defaults to 'body'):</label>
                    <input type="text" className="form-control" id="parentId" value={parentId} onChange={(e) => setParentId(e.target.value)} />
                </div>

                <button type="button" className="btn btn-primary" onClick={generateFunction}>Generate Function</button>
            </form>

            <div className="mt-3">
                <label htmlFor="generatedCode" className="form-label">Generated JavaScript:</label>
                <textarea ref={generatedCodeRef} className="form-control" id="generatedCode" rows="5" value={generatedCode} readOnly></textarea>
                <button type="button" className="btn btn-secondary mt-2" onClick={copyToClipboard}>Copy to Clipboard</button>
            </div>
        </div>
    );
}

export default App;
