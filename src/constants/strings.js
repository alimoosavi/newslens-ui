// Persian Strings - رشته‌های فارسی
export const STRINGS = {
    // App
    APP_NAME: 'لنز اخبار',
    APP_TAGLINE: 'دستیار هوشمند خبری',
    APP_DESCRIPTION: 'با قدرت هوش مصنوعی، اخبار را هوشمندانه دنبال کنید',
  
    // Auth
    AUTH: {
      SIGN_IN: 'ورود',
      SIGN_UP: 'ثبت‌نام',
      SIGN_OUT: 'خروج',
      USERNAME: 'نام کاربری',
      EMAIL: 'ایمیل',
      PASSWORD: 'رمز عبور',
      CONFIRM_PASSWORD: 'تکرار رمز عبور',
      FORGOT_PASSWORD: 'فراموشی رمز عبور',
      REMEMBER_ME: 'مرا به خاطر بسپار',
      NO_ACCOUNT: 'حساب کاربری ندارید؟',
      HAS_ACCOUNT: 'قبلاً ثبت‌نام کرده‌اید؟',
      CREATE_ACCOUNT: 'ایجاد حساب',
      WELCOME_BACK: 'خوش آمدید',
      JOIN_US: 'به ما بپیوندید',
      SIGNING_IN: 'در حال ورود...',
      CREATING_ACCOUNT: 'در حال ایجاد حساب...',
    },
  
    // Validation
    VALIDATION: {
      REQUIRED_FIELD: 'این فیلد الزامی است',
      INVALID_EMAIL: 'ایمیل نامعتبر است',
      PASSWORD_MIN: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
      PASSWORD_MISMATCH: 'رمز عبور و تکرار آن مطابقت ندارند',
      USERNAME_MIN: 'نام کاربری باید حداقل ۳ کاراکتر باشد',
      INVALID_CREDENTIALS: 'نام کاربری یا رمز عبور اشتباه است',
      REGISTRATION_FAILED: 'ثبت‌نام با خطا مواجه شد',
      LOGIN_FAILED: 'ورود با خطا مواجه شد',
    },
  
    // Chat
    CHAT: {
      NEW_CHAT: 'گفتگوی جدید',
      DELETE_CHAT: 'حذف گفتگو',
      CLEAR_CHAT: 'پاک کردن پیام‌ها',
      NO_SESSIONS: 'هنوز گفتگویی ندارید',
      START_HINT: 'برای شروع، یک گفتگوی جدید ایجاد کنید',
      TYPE_MESSAGE: 'پیام خود را بنویسید...',
      SEND: 'ارسال',
      THINKING: 'در حال فکر کردن...',
      EMPTY_STATE_TITLE: 'به لنز اخبار خوش آمدید',
      EMPTY_STATE_DESC: 'سوالات خود درباره اخبار و رویدادها را بپرسید',
      EMPTY_STATE_HINT: 'می‌توانید درباره هر موضوعی از من بپرسید',
      DELETE_CONFIRM: 'آیا از حذف این گفتگو مطمئن هستید؟',
      CLEAR_CONFIRM: 'آیا از پاک کردن همه پیام‌ها مطمئن هستید؟',
      SESSION_PREFIX: 'گفتگو',
      SHIFT_ENTER_HINT: '(Shift+Enter برای خط جدید)',
    },
  
    // Search
    SEARCH: {
      TITLE: 'جستجوی اخبار',
      PLACEHOLDER: 'عبارت مورد نظر را جستجو کنید...',
      BUTTON: 'جستجو',
      SEARCHING: 'در حال جستجو...',
      NO_RESULTS: 'نتیجه‌ای یافت نشد',
      RESULTS_COUNT: (count) => `${count} نتیجه یافت شد`,
      TRY_DIFFERENT: 'عبارت دیگری را جستجو کنید',
    },
  
    // Tabs
    TABS: {
      CHAT: 'گفتگو',
      SEARCH: 'جستجو',
    },
  
    // Time
    TIME: {
      NOW: 'همین الان',
      MINUTES_AGO: (n) => `${n} دقیقه پیش`,
      HOURS_AGO: (n) => `${n} ساعت پیش`,
      DAYS_AGO: (n) => `${n} روز پیش`,
      YESTERDAY: 'دیروز',
    },
  
    // Errors
    ERRORS: {
      GENERIC: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
      NETWORK: 'اتصال به سرور برقرار نشد',
      SESSION_CREATE: 'ایجاد گفتگو با خطا مواجه شد',
      SESSION_DELETE: 'حذف گفتگو با خطا مواجه شد',
      MESSAGE_SEND: 'ارسال پیام با خطا مواجه شد',
      SEARCH_FAILED: 'جستجو با خطا مواجه شد',
    },
  
    // Success
    SUCCESS: {
      ACCOUNT_CREATED: 'حساب کاربری با موفقیت ایجاد شد',
      REDIRECTING: 'در حال انتقال...',
    },
  
    // Actions
    ACTIONS: {
      RETRY: 'تلاش مجدد',
      CANCEL: 'انصراف',
      CONFIRM: 'تأیید',
      CLOSE: 'بستن',
      COPY: 'کپی',
      COPIED: 'کپی شد!',
    },
  };
  
  // Persian number converter
  export const toPersianNumber = (num) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
  };
  
  // Format Persian date
  export const formatPersianDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format Persian time
  export const formatPersianTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Relative time in Persian
  export const getRelativeTime = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
  
    if (diffMins < 1) return STRINGS.TIME.NOW;
    if (diffMins < 60) return STRINGS.TIME.MINUTES_AGO(toPersianNumber(diffMins));
    if (diffHours < 24) return STRINGS.TIME.HOURS_AGO(toPersianNumber(diffHours));
    if (diffDays === 1) return STRINGS.TIME.YESTERDAY;
    if (diffDays < 7) return STRINGS.TIME.DAYS_AGO(toPersianNumber(diffDays));
    return formatPersianDate(date);
  };
  
  export default STRINGS;