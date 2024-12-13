// Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h2>NegevNerds</h2>
                    <p>מערכת למידה למבחנים ושיתוף מידע בין תלמידי אוניברסיטת בן-גוריון בנגב.</p>
                </div>

                <div className="footer-section">
                    <h3>צור קשר</h3>
                    <p>שלח פידבק על המערכת:</p>
                    <a href="mailto:negevnerds@example.com">negevnerds@example.com</a>
                    <p>או בטלפון 0545433476</p>
                    <p>רק לבנות</p>
                    <p>ושיהיו חזקים השאר</p>
                </div>

                <div className="footer-section">
                    <h3>קישורים חשובים</h3>
                    <p>תנאי שימוש</p>
                    <p>מדיניות פרטיות</p>
                </div>

                <div className="footer-section">
                    <p>&copy; 2024 NegevNerds. כל הזכויות שמורות.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
