// Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
    const aboutText = `המערכת מציגה את המידע בצורה מאורגנת, כך שלא תבזבז יותר זמן בחיפוש אחרי שאלות ותשובות.`;

    const aboutTextBold = `רוצה להיות חנון אמיתי? הצטרף ל-NegevNerds ותראה איך להיות חנון עושה לך טוב!  
    המערכת שלנו תשדרג את הלמידה ותשאיר אותך צעד לפני כולם, עם פלטפורמה נוחה, מאורגנת ונגישה –  
    כי להיות חנון זה לא רק לדעת את החומר, אלא לדעת איך לנצל את הזמן שלך בצורה הכי חכמה.`;

    const contactText = `שלח פידבק על המערכת:`;
    const contactEmail = `negevnerds@gmail.com`;
    const phoneText = `או בטלפון (רק לבנות) 0545433476`;
    const otherContactText = `שיהיו חזקים השאר`;

    const termsText = `תנאי שימוש`;
    const copyrightText = `© 2024-2025 NegevNerds. כל הזכויות שמורות.`;  // ישירות עם הסמל

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h2><strong>NegevNerds</strong></h2>
                    <p>{aboutText}</p>
                    <p><strong>{aboutTextBold}</strong></p>
                </div>

                <div className="footer-section">
                    <h3><strong>צור קשר</strong></h3>
                    <p><strong>{contactText}</strong></p>
                    <a href={`mailto:${contactEmail}`}><strong>{contactEmail}</strong></a>
                    <p><strong>{phoneText}</strong></p>
                    <p>{otherContactText}</p>
                </div>

                <div className="footer-section">
                    <h3><strong>קישורים חשובים</strong></h3>
                    <p>{termsText}</p>
                    <p>{copyrightText}</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
