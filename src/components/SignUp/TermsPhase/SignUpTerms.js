import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpTerms.css';
import axios from 'axios'; // Import Axios for HTTP requests

function SignUpTerms() {
    // State to hold form data
    const termsOfUseContent = 
        "ברוכים הבאים לשירות NegevNerds, אנא קרא בעיון את תנאי השימוש להלן לפני השימוש בשירות:\n" + 
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
        "על ידי לחיצה על הכפתור מטה, אתה מאשר כי קראת, הבנת והסכמת לכל תנאי השימוש, כולל סעיף האוסר על שימוש בשפה פוגענית.\n" +
        "תודה על השימוש בשירות שלנו!"

    const navigate = useNavigate();  // יצירת אובייקט navigate

    const [message, setMessage] = useState('');

    // Handle form submission and make HTTP POST request
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/api/register_termOfUse_part', {
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password'),
                first_name: localStorage.getItem('first_name'),
                last_name: localStorage.getItem('last_name'),
            })

            setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
            console.log(response.data);  // You can log the response if needed
            navigate('/home');
        } catch (error) {
            setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        }
        // navigate('/home');
    };

    return (
        <div className="welcome-page">
            <div className="background-logo">
                <div className="image-layer"></div> {/* Image layer */}
                <div className="content">
                    <h1 className="welcome-title">תקנון האתר</h1>
                    <div className="terms-container">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <p className="termsofuse-text">
                                {termsOfUseContent}
                            </p>
                            <button type="submit" className="submit-button" onClick={handleSubmit}>אני מסכים לתנאי השימוש</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpTerms;
