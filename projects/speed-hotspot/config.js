/**
 * إعدادات البوابة — عدّل هذه القيم فقط لتغيير بيانات الشبكة.
 * لا تضع كلمات مرور أو مفاتيح API سرية في هذا الملف.
 */
window.PORTAL_CONFIG = {
  networkName: "Speed",
  logoUrl: "", // مثال: "assets/logo.svg" — اتركه فارغاً لاستخدام أيقونة Wi-Fi
  whatsappNumber: "970000000000", // بالصيغة الدولية، أرقام فقط
  supportPhone: "+970000000000",
  plans: [
    { name: "8 ساعات", price: "1 شيكل", featured: false },
    { name: "12 ساعة", price: "12 شيكل", featured: true },
    { name: "أسبوع", price: "20 شيكل", featured: false }
  ],
  // "mock" للعرض والتجربة، أو "api" عند تجهيز الخادم.
  mode: "mock",
  api: { loginUrl: "/api/login", logoutUrl: "/api/logout", statusUrl: "/api/status" }
};
