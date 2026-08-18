(function () {
  "use strict";
  window.PortalValidation = {
    validate(credentials) {
      const errors = {};
      if (!credentials.username.trim()) errors.username = "يرجى إدخال رقم البطاقة أو اسم المستخدم";
      if (!credentials.password) errors.password = "يرجى إدخال كلمة المرور";
      return { valid: Object.keys(errors).length === 0, errors };
    }
  };
})();
