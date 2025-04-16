
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './UploadExam.css';
import  '../Exam/Exam.css';
import '../UploadQuestion/UploadQuestionDate/UploadQuestionDate.css'
import '../UploadQuestion/UploadQuestionContent/UploadQuestionContent.css'
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import axiosInstance from '../../utils/axiosInstance';
import {IoInformationCircleOutline} from "react-icons/io5";
import PdfLineMark from "../PDFLineMark/PDFLineMark";


function UploadExam() {
    const { courseId } = useParams();  // מקבלים את שם הקורס מה-URL
    const navigate = useNavigate();  // יצירת אובייקט navigate
    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];
    const [courseDetails, setCourseDetails] = useState(null);
    const [examYear, setExamYear] = useState(null); // שנה של המבחן
    const [examSemester, setExamSemester] = useState(''); // סמסטר של המבחן
    const [examDateSelection, setExamDateSelection] = useState(''); // מועד של המבחן
    const [ExamFile, setExamFile] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [availableDate , setAvailableDate] = useState(false);
    const [lines, setLines] = useState([]);
    const [submitFile , setSubmitFile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadExam, setUploadExam] = useState(false);

    const addAuthHeaders = (headers = {}) => {
        const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
        }
        return headers;
    };


    const handleSubmitLines = async (lines) => {
        if (!ExamFile) {
            alert("Please upload a file before submitting.");
            return;
        }

        if (!lines || lines.length === 0) {
            alert("Please draw at least one line to split the questions.");
            return;
        }

        console.log("ExamFile name:", ExamFile.name);
        console.log("ExamFile size:", ExamFile.size);
        console.log("ExamFile instanceof File:", ExamFile instanceof File);

        const formData = new FormData();

        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('pdf_exam', ExamFile); // Attach the PDF file
        formData.append('line_data', JSON.stringify(lines)); // Attach the drawn lines data

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        console.log("ExamFile name:", ExamFile.name);
        console.log("ExamFile size:", ExamFile.size);
        console.log("ExamFile instanceof File:", ExamFile instanceof File);
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/uploadFullExamPdf`, formData, {
                headers: {
                    ...addAuthHeaders()
                },
            });

            if (response.data.success) {
                alert("File uploaded and lines saved successfully!");
                closeModal();
                navigate(`/exam/${courseId}/${examYear}/${examSemester}/${examDateSelection}`);
                window.location.reload(); // Reload the page
            } else {
                alert(`Failed to upload file: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setExamFile(null);
    };

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        if (courseId) {
            axiosInstance.get(`${API_BASE_URL}/api/course/get_course/${courseId}`, { headers: addAuthHeaders() })
                .then(response => {
                    console.log('Response received:', response);

                    if (response.data && response.data.status === 'success') {
                        console.log('Course data:', response.data.data); // הדפס את המידע שהתקבל
                        setCourseDetails(response.data.data);  // עדכון הסטייט עם פרטי הקורס
                    } else {
                        console.error('Response does not contain valid course data', response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching course details:', error);
                });
        }
    }, [courseId]);

    if (!courseDetails) {
        return <div>Loading...</div>;
    }

    const handleExamNotExist = () =>{
        setUploadExam(true)
    }

    const handleUploadExam = async() => {

    }

    const handleChangeDate = async () => {
        if (examYear && examSemester && examDateSelection) {
            if (examYear < 1960 || examYear > new Date().getFullYear()) {
                alert("שנה לא תקינה");
                return
            }
            try {
                const response = await axiosInstance.post(
                    `${API_BASE_URL}/api/checkExamFullPdf`,
                    {
                        course_id: courseId,
                        year: examYear,
                        semester: examSemester,
                        moed: examDateSelection,
                    },
                    {
                        headers: addAuthHeaders()
                    }
                );
                console.log(response)
                if (response.data.success) {
                    if (response.data.has_link) {
                        setUploadExam(false);
                        const userChoice = window.confirm(
                            "מבחן זה כבר קיים במאגר. האם ברצונך לעבור לדף המבחן?"
                        );
                        if (userChoice) {
                            navigate(`/exam/${courseId}/${examYear}/${examSemester}/${examDateSelection}`);
                        }
                    } else {
                        console.log("here")
                        setAvailableDate(true);
                    }
                }
                else {
                    console.error('שגיאה בבדיקת זמינות המבחן:');
                    alert("שגיאה בבדיקת זמינות המבחן:");
                }
            }
            catch (error) {
                    console.error('שגיאה בבדיקת זמינות המבחן:', error);
                    alert("שגיאה בבדיקת זמינות המבחן:");
                }
            }
        else {
            alert("אנא מלא את כל השדות הנדרשים.");
        }
    };


    const handleCancelClick = () => {
        navigate('/home');  // מנווט לעמוד ההרשמה
    };

    return (
        <div className="upload-exam-page">
            <Header />
            <main className="content"  >
                <h1>העלאת מבחן חדש</h1>
                <div className="question-content-form">
                    <div className="form-group" >
                        <label className="label-question-content" htmlFor="name" >מספר קורס:</label>
                        <input
                            type="text"
                            disabled
                            value={courseId}
                            className="question-date-field"
                            required
                        >
                        </input>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">שם קורס:</label>
                        <input
                            type="text"
                            disabled = {true}
                            value={courseDetails.name}
                            className="question-date-field"
                            required
                        >
                        </input>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">שנה:</label>
                        <input
                            type="number"
                            value={examYear}
                            disabled={availableDate}
                            onChange={(e) => {
                                setExamYear(e.target.value)
                            }}
                            className="question-date-field"
                            min="1960"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">סמסטר:</label>
                        <select
                            value={examSemester}
                            disabled={availableDate}
                            onChange={(e) => {
                                setExamSemester(e.target.value)
                            }
                        }
                            className="question-date-field"
                        >
                            <option value=""></option>
                            {semesters.map((semesterOption, index) => (
                                <option key={index} value={semesterOption}>
                                    {semesterOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">מועד:</label>
                        <select
                            value={examDateSelection}
                            disabled={availableDate}
                            onChange={(e) => {
                                setExamDateSelection(e.target.value)
                            }}
                            className="question-date-field"
                        >
                            <option value=""></option>
                            {examDates.map((dateOption, index) => (
                                <option key={index} value={dateOption}>
                                    {dateOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    {availableDate && (
                        <div className="form-group">
                            <label className="label-question-content" htmlFor="name">
                                <span className="required-asterisk" title="שדה חובה">*</span>מבחן:
                            </label>
                            <IoInformationCircleOutline size={"8%"} title="העלה קובץ PDF של המבחן המלא כפי שפורסם"/>
                            <input
                                className="question-content-field"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setExamFile(e.target.files[0])}
                                required
                            />
                        </div>
                    )}
                    {ExamFile && submitFile && (
                        <div className="modal-overlay">
                            <p className="modal-title">בחר את נקודות ההפרדה בין השאלות</p>
                            <div className="modal-content-line-selection">
                                <PdfLineMark
                                    file={ExamFile}
                                    closeModal={closeModal}
                                    onLinesChange={setLines}
                                    onSubmitLines={handleSubmitLines}
                                />
                            </div>
                        </div>
                    )}


                    <div className="question-button-row">
                        { !availableDate &&
                            <button className="add-exam-button" onClick={handleChangeDate}>
                            בדוק אם המבחן קיים
                        </button>
                        }
                        {availableDate && (
                            <button className="add-question-button" onClick={() => { setSubmitFile(true)}}>
                                אישור
                            </button>
                        )}
                        <button className="add-question-button" onClick={handleCancelClick}>
                            ביטול
                        </button>
                    </div>
                </div>

            </main>
            <Footer/>
        </div>
    );
}

export default UploadExam;