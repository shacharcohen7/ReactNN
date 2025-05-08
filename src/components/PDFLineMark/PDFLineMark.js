import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './PDFLineMark.css';
import {FaSpinner} from "react-icons/fa";



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PdfLineMark = ({ file, onLinesChange, closeModal, onSubmitLines }) => {
    const [numPages, setNumPages] = useState(null);
    const [lines, setLines] = useState([]);

    const [isLoading, setIsLoading] = useState(false);




    const removeLastLine = () => {

        setLines((prevLines) => prevLines.slice(0, -1));
    };

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handlePageClick = (event, pageNumber) => {
        const pageRect = event.target.getBoundingClientRect();
        const x = event.clientX - pageRect.left;
        const y = event.clientY - pageRect.top;

        if (x >= 0 && y >= 0 && x <= pageRect.width && y <= pageRect.height) {
            const newLine = { page: pageNumber, y:y };
            const updatedLines = [...lines, newLine];
            setLines(updatedLines);
            onLinesChange?.(updatedLines);
        }
    };



    return (
        (isLoading) ? (
                <>
                    <FaSpinner className="spinner" size={32} /> טוען...
                </>
            ) : (
        <div className="pdf-container">
            <Document file={file} onLoadSuccess={handleDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, i) => (
                    <div key={i} className="page-wrapper" onClick={(e) => handlePageClick(e, i + 1)}>
                        <Page pageNumber={i + 1} width={900}
                              renderTextLayer={false}/>
                        {lines
                            .filter((line) => line.page === i + 1)
                            .map((line, index) => (
                                <div
                                    key={index}
                                    className="line-marker"
                                    style={{ top: `${line.y}px` }}
                                />
                            ))}
                    </div>
                ))}
            </Document>

            <div className="modal-actions">
                <button className="submit-btn" onClick={() => {setIsLoading(true) ; onSubmitLines(lines);}}>
                    אישור הבחירה
                </button>

                <button className="remove-btn" onClick={removeLastLine}>
                    הסר את הקו האחרון
                </button>

                <button className="cancel-btn" onClick={closeModal}>
                    ביטול
                </button>
            </div>
        </div>
    ));
}

export default PdfLineMark;