import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const termsOfUseContent = 
        "ברוכים הבאים לשירות NegevNerds,\n" +
        "אנא קרא בעיון את תנאי השימוש להלן לפני השימוש בשירות:\n" + 
        "1. השימוש בשירות מותנה בקבלת תנאי השימוש המפורטים להלן.\n" +
        "2. חל איסור מוחלט להשתמש בשירות לצרכים בלתי חוקיים או לכל מטרה שנוגדת את החוק.\n" + 
        "3. כל המידע והנתונים המוזנים על ידך לשירות יישמרו בהתאם למדיניות הפרטיות שלנו.\n" + 
        "4. השירות ניתן כפי שהוא (AS IS) ואנו לא נישא באחריות לכל נזק שייגרם כתוצאה מהשימוש בו.\n" +
        "5. אנו שומרים לעצמנו את הזכות לשנות או לעדכן את תנאי השימוש בכל עת, מבלי להודיע מראש.\n" + 
        "6. חל איסור מוחלט להעליב, לפגוע או להשתמש בשפה פוגענית כלפי משתמשים אחרים באתר, לרבות בדיווחים, בתגובות ובפורומים.\n" +
        "   דוגמאות למילים אסורות:\n" +
        "   - קללות: מטומטם, דפוק, זין, אפס, חרא, בן זונה\n" +
        "   - ביטויים פוגעניים: לך תמות, אדיוט, מכוער, תסתום את הפה\n" +
        "   - כל ביטוי נוסף שעשוי לפגוע בכבודו או בתחושותיו של משתמש אחר.\n" +
        "על ידי לחיצה על תיבת הסימון, אתה מאשר כי קראת, הבנת והסכמת לכל תנאי השימוש, כולל סעיף האוסר על שימוש בשפה פוגענית.\n" +
        "תודה על השימוש בשירות שלנו!"
    
    const [isModalOpen, setModalOpen] = useState(false); // מצב עבור ה-Modal
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleSignUpClick = () => {
        navigate('/home');  // מנווט לעמוד ההרשמה
      };
    return (
        <div className="SignUp">
        <div className="background-logo">
            <div className="image-layer"></div> {/* שכבת התמונה */}
            <div className="content">
            <h1 className="signup-title">הרשמה</h1>

            {/* טופס התחברות */}
            <div className="signup-container">
                <p className="instruction">:נא להזין את הפרטים הבאים</p>
                <form className="signup-form">
                    <div className="input-group">
                        <input type="text" id="firstName" placeholder="שם פרטי" required />
                        <input type="text" id="lastName" placeholder="שם משפחה" required />
                        <input type="email" id="email" placeholder="מייל אוניברסיטאי" required />
                        <input type="password" id="password" required placeholder="סיסמה" />
                    </div>
                    <div className="confirm_line">
                        <label htmlFor="terms">
                            <input type="checkbox" id="terms" required />אני מאשר/ת את תקנון האתר
                        </label>
                        <button type="button" className="termsOfUse-link" onClick={openModal}>תקנון</button> {/* או להשתמש בלינק */}
                    </div>
                    <button type="submit" className="signup-button" onClick={handleSignUpClick}>הרשמה</button>
                </form>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-popup">
                        <button className="close-button" onClick={closeModal}>X</button>
                            <h2>תקנון האתר</h2>
                            <p>
                                {termsOfUseContent}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
=======
import axios from 'axios';  // Import Axios for HTTP requests
import './SignUp.css';

function SignUp() {
    // State to hold form data



    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        termsAccepted: false,
    });

    const [message, setMessage] = useState('');

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,  // Handle checkbox
        });
    };

    // Handle form submission and make HTTP POST request
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            setMessage('עליך לאשר את תקנון האתר');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
            })

            setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
            console.log(response.data);  // You can log the response if needed
        } catch (error) {
            setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        }
    };

    return (
        <div className="SignUp">
            <div className="background-logo">
                <div className="image-layer"></div> {/* Image layer */}
                <div className="content">
                    <h1 className="signup-title">הרשמה</h1>

                    {/* Registration form */}
                    <div className="signup-container">
                        <p className="instruction">:נא להזין את הפרטים הבאים</p>
                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="שם פרטי"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="שם משפחה"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="מייל אוניברסיטאי"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="סיסמה"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="confirm_line">
                                <label htmlFor="terms">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        required
                                    />
                                    אני מאשר/ת את תקנון האתר
                                </label>
                                <button type="button" className="signup-link">תקנון</button>
                            </div>
                            <button type="submit" className="signup-button">הרשמה</button>
                        </form>

                        {/* Display message based on submission success or failure */}
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
