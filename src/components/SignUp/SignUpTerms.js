import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpTerms.css';
import axios from 'axios'; // Import Axios for HTTP requests

function SignUp() {
    // State to hold form data
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
        "על ידי לחיצה על הכפתור מטה, אתה מאשר כי קראת, הבנת והסכמת לכל תנאי השימוש, כולל סעיף האוסר על שימוש בשפה פוגענית.\n" +
        "תודה על השימוש בשירות שלנו!\n\n\n"

    const [isTermsModalOpen, setTermsModalOpen] = useState(false); // מצב עבור ה-Modal
    const openTermsModal = () => setTermsModalOpen(true);
    const confirmTermsModal = () => navigate('/home');

    const navigate = useNavigate();  // יצירת אובייקט navigate

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
        // e.preventDefault();

        // try {
        //     const response = await axios.post('http://localhost:5000/api/register', {
        //         email: formData.email,
        //         password: formData.password,
        //         first_name: formData.firstName,
        //         last_name: formData.lastName,
        //     })

        //     setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
        //     console.log(response.data);  // You can log the response if needed
        //     navigate('/home');
        // } catch (error) {
        //     setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        // }
        navigate('/home');
    };

    return (
        <div className="SignUp">
            <div className="background-logo">
                <div className="image-layer"></div> {/* Image layer */}
                <div className="content">
                    <h1 className="signup-title">תקנון האתר</h1>
                    <div className="signup-container">
                        <form className="signup-form" onSubmit={handleSubmit}>
                            <p>
                                {termsOfUseContent}
                            </p>
                        </form>
                        <button type="submit" className="signup-button" onClick={handleSubmit}>אני מסכים לתנאי השימוש</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;