// متغيرات عامة
let points = 0;
let adsWatched = 0;
let purchaseHistory = [];
let currentItem = null;
let isLoggedIn = false;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات من التخزين المحلي إذا كانت موجودة
    loadData();
    
    // تحديث عداد النقاط
    updatePointsDisplay();
    
    // إضافة مستمعي الأحداث للأزرار والروابط
    setupEventListeners();
    
    // عرض صفحة الترحيب افتراضياً
    showPage('welcome-page');
});

// تحميل البيانات من التخزين المحلي
function loadData() {
    if (localStorage.getItem('gwaherPoints')) {
        points = parseInt(localStorage.getItem('gwaherPoints'));
    }
    
    if (localStorage.getItem('gwaherAdsWatched')) {
        adsWatched = parseInt(localStorage.getItem('gwaherAdsWatched'));
        updateAdsProgress();
    }
    
    if (localStorage.getItem('gwaherPurchaseHistory')) {
        purchaseHistory = JSON.parse(localStorage.getItem('gwaherPurchaseHistory'));
        updatePurchaseHistory();
    }
    
    if (localStorage.getItem('gwaherLoggedIn')) {
        isLoggedIn = localStorage.getItem('gwaherLoggedIn') === 'true';
        updateLoginStatus();
    }
}

// حفظ البيانات في التخزين المحلي
function saveData() {
    localStorage.setItem('gwaherPoints', points);
    localStorage.setItem('gwaherAdsWatched', adsWatched);
    localStorage.setItem('gwaherPurchaseHistory', JSON.stringify(purchaseHistory));
    localStorage.setItem('gwaherLoggedIn', isLoggedIn);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // روابط القائمة
    document.getElementById('home-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('welcome-page');
    });
    
    document.getElementById('ads-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('ads-page');
    });
    
    document.getElementById('items-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('items-page');
    });
    
    document.getElementById('history-link').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('history-page');
    });
    
    // زر تسجيل الدخول
    document.getElementById('login-btn').addEventListener('click', function() {
        if (isLoggedIn) {
            logout();
        } else {
            showPage('login-page');
        }
    });
    
    // زر البدء
    document.getElementById('start-btn').addEventListener('click', function() {
        if (isLoggedIn) {
            showPage('ads-page');
        } else {
            showPage('login-page');
        }
    });
    
    // نموذج تسجيل الدخول
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    // زر تسجيل الدخول بحساب جوجل
    document.getElementById('google-login-btn').addEventListener('click', function() {
        login();
    });
    
    // زر مشاهدة إعلان
    document.getElementById('watch-ad-btn').addEventListener('click', function() {
        watchAd();
    });
    
    // أزرار الشراء
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.getAttribute('data-item');
            const price = parseInt(this.getAttribute('data-price'));
            initiatePurchase(item, price);
        });
    });
    
    // زر تأكيد الشراء
    document.getElementById('confirm-purchase').addEventListener('click', function() {
        confirmPurchase();
    });
}

// عرض صفحة محددة
function showPage(pageId) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.container[id$="-page"]');
    pages.forEach(page => {
        page.classList.add('d-none');
    });
    
    // عرض الصفحة المطلوبة
    document.getElementById(pageId).classList.remove('d-none');
    
    // تحديث الصفحة النشطة في القائمة
    updateActiveNavLink(pageId);
}

// تحديث الرابط النشط في القائمة
function updateActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    if (pageId === 'welcome-page') {
        document.getElementById('home-link').classList.add('active');
    } else if (pageId === 'ads-page') {
        document.getElementById('ads-link').classList.add('active');
    } else if (pageId === 'items-page') {
        document.getElementById('items-link').classList.add('active');
    } else if (pageId === 'history-page') {
        document.getElementById('history-link').classList.add('active');
    }
}

// تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // في النسخة التجريبية، نقبل أي بيانات تسجيل دخول
    isLoggedIn = true;
    updateLoginStatus();
    saveData();
    
    // إعادة توجيه المستخدم إلى صفحة الإعلانات
    showPage('ads-page');
}

// تسجيل الخروج
function logout() {
    isLoggedIn = false;
    updateLoginStatus();
    saveData();
    showPage('welcome-page');
}

// تحديث حالة تسجيل الدخول في واجهة المستخدم
function updateLoginStatus() {
    const loginBtn = document.getElementById('login-btn');
    
    if (isLoggedIn) {
        loginBtn.textContent = 'تسجيل الخروج';
        loginBtn.classList.remove('btn-outline-light');
        loginBtn.classList.add('btn-danger');
    } else {
        loginBtn.textContent = 'تسجيل الدخول';
        loginBtn.classList.remove('btn-danger');
        loginBtn.classList.add('btn-outline-light');
    }
}

// مشاهدة إعلان
function watchAd() {
    if (!isLoggedIn) {
        showPage('login-page');
        return;
    }
    
    if (adsWatched >= 300) {
        alert("لقد وصلت إلى الحد الأقصى للإعلانات اليومية (300 إعلان)");
        return;
    }
    
    // عرض الإعلان (محاكاة)
    const adDisplay = document.getElementById('ad-display');
    adDisplay.innerHTML = '<div class="text-center"><p>جاري تحميل الإعلان...</p><div class="spinner-border text-light" role="status"></div></div>';
    
    // محاكاة وقت تحميل الإعلان
    setTimeout(function() {
        // عرض إعلان عشوائي
        const adTypes = [
            '<div class="text-center"><img src="https://i.imgur.com/JVJAXtG.png" alt="إعلان" style="max-width: 100%; max-height: 200px;"><p class="mt-2">إعلان Free Fire</p></div>',
            '<div class="text-center"><i class="fas fa-gamepad fa-5x mb-3 text-primary"></i><p>إعلان ألعاب</p></div>',
            '<div class="text-center"><i class="fas fa-shopping-cart fa-5x mb-3 text-success"></i><p>إعلان تسوق</p></div>'
        ];
        
        const randomAd = adTypes[Math.floor(Math.random() * adTypes.length)];
        adDisplay.innerHTML = randomAd;
        
        // تعطيل زر المشاهدة مؤقتاً
        const watchAdBtn = document.getElementById('watch-ad-btn');
        watchAdBtn.disabled = true;
        watchAdBtn.textContent = 'جاري مشاهدة الإعلان...';
        
        // محاكاة وقت مشاهدة الإعلان
        setTimeout(function() {
            // إضافة نقطة واحدة لكل إعلانين
            adsWatched++;
            
            if (adsWatched % 3 === 0) {
                points++;
                updatePointsDisplay();
            }
            
            // تحديث العداد وشريط التقدم
            updateAdsProgress();
            
            // إعادة تفعيل الزر
            watchAdBtn.disabled = false;
            watchAdBtn.textContent = 'مشاهدة إعلان';
            
            // حفظ البيانات
            saveData();
            
            // عرض رسالة نجاح
            let successMessage = '<div class="text-center text-success"><i class="fas fa-check-circle fa-5x mb-3"></i><p>تمت المشاهدة بنجاح!';
            
            if (adsWatched % 3 === 0) {
                successMessage += ' (+1 نقطة)</p></div>';
            } else {
                successMessage += '</p><p>شاهد ' + (3 - (adsWatched % 3)) + ' إعلان آخر للحصول على نقطة</p></div>';
            }
            
            adDisplay.innerHTML = successMessage;
        }, 3000);
    }, 1500);
}

// تحديث شريط تقدم الإعلانات
function updateAdsProgress() {
    const progressBar = document.getElementById('ads-progress');
    const adsCount = document.getElementById('ads-count');
    
    const percentage = (adsWatched / 300) * 100;
    progressBar.style.width = percentage + '%';
    adsCount.textContent = adsWatched;
}

// تحديث عداد النقاط
function updatePointsDisplay() {
    document.getElementById('points-display').textContent = points;
}

// بدء عملية الشراء
function initiatePurchase(item, price) {
    if (!isLoggedIn) {
        showPage('login-page');
        return;
    }
    
    currentItem = {
        name: item,
        price: price
    };
    
    // عرض تفاصيل العنصر في النافذة المنبثقة
    document.getElementById('modal-item-name').textContent = item;
    document.getElementById('modal-item-price').textContent = price;
    document.getElementById('purchase-details').classList.remove('d-none');
    
    // عرض النافذة المنبثقة
    const playerIdModal = new bootstrap.Modal(document.getElementById('player-id-modal'));
    playerIdModal.show();
}

// تأكيد عملية الشراء
function confirmPurchase() {
    if (!currentItem) return;
    
    const playerId = document.getElementById('player-id').value.trim();
    
    if (!playerId) {
        alert('الرجاء إدخال معرف اللاعب');
        return;
    }
    
    // التحقق من وجود نقاط كافية
    if (points < currentItem.price) {
        // عرض رسالة الخطأ
        const purchaseErrorModal = new bootstrap.Modal(document.getElementById('purchase-error-modal'));
        purchaseErrorModal.show();
        return;
    }
    
    // خصم النقاط
    points -= currentItem.price;
    updatePointsDisplay();
    
    // إضافة العملية إلى سجل المشتريات
    const purchase = {
        date: new Date().toLocaleDateString('ar-EG'),
        item: currentItem.name,
        playerId: playerId,
        points: currentItem.price
    };
    
    purchaseHistory.push(purchase);
    updatePurchaseHistory();
    
    // حفظ البيانات
    saveData();
    
    // إغلاق نافذة إدخال المعرف
    const playerIdModal = bootstrap.Modal.getInstance(document.getElementById('player-id-modal'));
    playerIdModal.hide();
    
    // عرض رسالة النجاح
    document.getElementById('success-item-name').textContent = currentItem.name;
    document.getElementById('success-player-id').textContent = playerId;
    
    const purchaseSuccessModal = new bootstrap.Modal(document.getElementById('purchase-success-modal'));
    purchaseSuccessModal.show();
    
    // إعادة تعيين المعرف
    document.getElementById('player-id').value = '';
    currentItem = null;
    
    // في النسخة النهائية، سيتم إرسال إشعار بالبريد الإلكتروني إلى of764480@gmail.com
    // مع معلومات الشراء ومعرف اللاعب
}

// تحديث سجل المشتريات
function updatePurchaseHistory() {
    const historyTable = document.getElementById('purchase-history');
    const noHistoryMessage = document.getElementById('no-purchases');
    
    // مسح السجل الحالي
    historyTable.innerHTML = '';
    
    if (purchaseHistory.length === 0) {
        noHistoryMessage.classList.remove('d-none');
        return;
    }
    
    // إخفاء رسالة "لا توجد مشتريات"
    noHistoryMessage.classList.add('d-none');
    
    // إضافة المشتريات إلى الجدول
    purchaseHistory.forEach(purchase => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = purchase.date;
        row.appendChild(dateCell);
        
        const itemCell = document.createElement('td');
        itemCell.textContent = purchase.item;
        row.appendChild(itemCell);
        
        const playerIdCell = document.createElement('td');
        playerIdCell.textContent = purchase.playerId;
        row.appendChild(playerIdCell);
        
        const pointsCell = document.createElement('td');
        pointsCell.textContent = purchase.points;
        row.appendChild(pointsCell);
        
        historyTable.appendChild(row);
    });
}
