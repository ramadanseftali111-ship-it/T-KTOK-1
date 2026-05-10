// ============================================
// FIREBASE YAPILANDIRMA DOSYASI
// ============================================

// Site ID kontrolü
if (typeof SITE_ID === 'undefined') {
    console.warn('⚠️ SITE_ID tanımlı değil! site-config.js dosyasını ekleyin.');
    var SITE_ID = 'default';
}

// Site ID'li localStorage key oluştur
if (typeof getSiteKey === 'undefined') {
    function getSiteKey(key) {
        return SITE_ID + '_' + key;
    }
}

// localStorage'dan Firebase ayarlarını al
function getUserFirebaseConfig() {
    var saved = localStorage.getItem(getSiteKey('account_settings'));
    if (saved) {
        try {
            var s = JSON.parse(saved);
            if (s.firebaseApiKey && s.firebaseProjectId && s.firebaseDatabaseUrl) {
                return {
                    apiKey: s.firebaseApiKey,
                    authDomain: s.firebaseProjectId + ".firebaseapp.com",
                    databaseURL: s.firebaseDatabaseUrl,
                    projectId: s.firebaseProjectId,
                    storageBucket: s.firebaseProjectId + ".appspot.com"
                };
            }
        } catch(e) {
            console.error('Firebase ayarları parse hatası:', e);
        }
    }
    return null;
}


// VARSAYILAN FIREBASE AYARLARI - TikTok Reklamları İçin
// Müşteri domain-bagla.html'den kendi Firebase bilgilerini girerse, o kullanılır (öncelik)
// Girmezse bu varsayılan Firebase kullanılır (telefonda çalışması için)
var firebaseConfig = {
    apiKey: "AIzaSyDurAad1UeBOfKGiGrYzWoYeaM8kfyMqK0",
    authDomain: "ramadan-seftali.firebaseapp.com",
    databaseURL: "https://ramadan-seftali-default-rtdb.firebaseio.com",
    projectId: "ramadan-seftali",
    storageBucket: "ramadan-seftali.firebasestorage.app",
    messagingSenderId: "187609765269",
    appId: "1:187609765269:web:8d80439ad129c",
    measurementId: "G-LWEPJWQ8DT"
};

console.log('📦 Firebase bucket:', firebaseConfig.storageBucket);

// Firebase değişkenleri
var database = null;
var storage = null;
var firebaseHazir = false;
var firebaseHazirCallbacks = [];

// Firebase hazır olduğunda çağrılacak fonksiyonları kaydet
function onFirebaseReady(callback) {
    if (firebaseHazir && database) {
        try { callback(database); } catch(e) { console.error('onFirebaseReady callback hatası:', e); }
    } else {
        firebaseHazirCallbacks.push(callback);
    }
}

// Firebase'i başlat
var firebaseInitAttempts = 0;
var maxFirebaseAttempts = 50; // 50 x 200ms = 10 saniye

function initFirebase() {
    // Zaten başlatılmışsa tekrar başlatma
    if (firebaseHazir && database) {
        return;
    }
    
    // Maksimum deneme sayısına ulaşıldı mı?
    if (firebaseInitAttempts >= maxFirebaseAttempts) {
        console.error('❌ Firebase yüklenemedi! Script\'lerin doğru sırada olduğundan emin olun.');
        return;
    }
    
    // Firebase objesi yüklendi mi kontrol et
    if (typeof firebase === 'undefined') {
        firebaseInitAttempts++;
        console.log('⏳ Firebase yükleniyor... Deneme:', firebaseInitAttempts);
        setTimeout(initFirebase, 200);
        return;
    }
    
    // Firebase.database fonksiyonu var mı kontrol et
    if (typeof firebase.database !== 'function') {
        firebaseInitAttempts++;
        console.log('⏳ Firebase Database yükleniyor... Deneme:', firebaseInitAttempts);
        setTimeout(initFirebase, 200);
        return;
    }
    
    // Dosyadaki Firebase ayarlarını kullan (herkes aynı Firebase'i kullansın)
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        console.log('✅ Firebase ayarları dosyadan yüklendi (ortak Firebase)');
    } else {
        console.warn('⚠️ Firebase ayarları bulunamadı! firebase-config.js dosyasını kontrol edin.');
        return;
    }
    
    try {
        // Zaten başlatılmış mı kontrol et
        if (firebase.apps && firebase.apps.length > 0) {
            // Sessizce devam et, log spam'i önle
            if (!database) {
                database = firebase.database();
            }
            if (!storage && firebase.storage) {
                storage = firebase.storage();
            }
        } else {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase başlatıldı!');
            database = firebase.database();
            if (firebase.storage) {
                storage = firebase.storage();
            }
        }
        
        // Database objesi oluşturuldu mu kontrol et
        if (!database) {
            console.error('❌ Firebase database objesi oluşturulamadı!');
            return;
        }
        
        if (!firebaseHazir) {
            firebaseHazir = true;
            console.log('✅ Firebase tamamen hazır! Database:', database ? 'OK' : 'NULL');
            
            // Bekleyen callback'leri çağır
            if (firebaseHazirCallbacks.length > 0) {
                firebaseHazirCallbacks.forEach(function(cb) {
                    try { cb(database); } catch(e) { console.error('Callback hatası:', e); }
                });
                firebaseHazirCallbacks = [];
            }
            
            // Global event tetikle
            window.dispatchEvent(new CustomEvent('firebaseReady', { detail: { database: database } }));
        }
        
    } catch(e) {
        console.error('⚠️ Firebase başlatma hatası:', e.message);
        firebaseInitAttempts++;
        if (firebaseInitAttempts < maxFirebaseAttempts) {
            setTimeout(initFirebase, 200);
        }
    }
}

// Sayfa yüklendiğinde Firebase'i başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
} else {
    initFirebase();
}

// WhatsApp numarasını al
function getWhatsAppNumber() {
    var wpNumara = localStorage.getItem(getSiteKey('whatsapp_numara'));
    if (wpNumara) return wpNumara;
    
    var saved = localStorage.getItem(getSiteKey('account_settings'));
    if (saved) {
        try {
            var s = JSON.parse(saved);
            if (s.whatsappNumber) return s.whatsappNumber;
        } catch(e) {}
    }
    return "";
}

console.log('📦 Firebase Config yüklendi - Project:', firebaseConfig.projectId);
