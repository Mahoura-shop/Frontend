export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">مهورا</div>
            <p className="footer-desc">
              مرجع تخصصی محصولات زیبایی اصل از برندهای معتبر داخلی و خارجی. ساخته شده با عشق در ایران.
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="#" aria-label="Instagram">📷</a>
              <a className="social-btn" href="#" aria-label="Telegram">✈</a>
              <a className="social-btn" href="#" aria-label="WhatsApp">💬</a>
              <a className="social-btn" href="#" aria-label="YouTube">▶</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">دسترسی سریع</div>
            <ul>
              <li><a href="#">صفحه اصلی</a></li>
              <li><a href="#">محصولات</a></li>
              <li><a href="#">برندها</a></li>
              <li><a href="#">پیشنهاد ویژه</a></li>
              <li><a href="#">مجله زیبایی</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">پشتیبانی</div>
            <ul>
              <li><a href="#">تماس با ما</a></li>
              <li><a href="#">سوالات متداول</a></li>
              <li><a href="#">شرایط بازگشت</a></li>
              <li><a href="#">حریم خصوصی</a></li>
              <li><a href="#">قوانین استفاده</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">تماس</div>
            <ul>
              <li><a href="#">۰۲۱-۸۸۸۸-۸۸۸۸</a></li>
              <li><a href="#">info@mahoura.com</a></li>
              <li><a href="#">تهران، خیابان ولیعصر</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© ۱۴۰۴ مهورا. تمامی حقوق محفوظ است.</span>
          <span className="footer-copy">ساخته شده با ♥ در تهران</span>
        </div>
      </div>
    </footer>
  );
}
