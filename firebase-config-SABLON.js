// ============================================
// FIREBASE YAPILANDIRMA DOSYASI
// ============================================
// BU DOSYAYI KENDİ BİLGİLERİNLE DOLDUR!
// Firebase Console'dan al: https://console.firebase.google.com
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

// ⚠️ BURAYA KENDİ FIREBASE BİLGİLERİNİ YAZ!
var firebaseConfig = {
    apiKey: "BURAYA-API-KEY-YAZ",
    authDomain: "PROJE-ADI.firebaseapp.com",
    databaseURL: "https://PROJE-ADI-default-rtdb.firebasedatabase.app",
    projectId: "PROJE-ADI",
    storageBucket: "PROJE-ADI.appspot.com",
    messagingSenderId: "SENDER-ID",
    appId: "APP-ID",
    measurementId: "G-XXXXXX"
};

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
function initFirebase() {
    console.log('🔄 Firebase başlatılıyor...');
    
    if (typeof firebase !== 'undefined') {
        try {
            if (firebase.apps && firebase.apps.length > 0) {
                console.log('✅ Firebase zaten başlatılmış');
            } else {
                firebase.initializeApp(firebaseConfig);
                console.log('✅ Firebase başlatıldı!');
            }
            
            database = firebase.database();
            console.log('✅ Database bağlantısı kuruldu');
            
            if (firebase.storage) {
                storage = firebase.storage();
                console.log('✅ Storage bağlantısı kuruldu');
            }
            
            firebaseHazir = true;
            
            console.log('📢 ' + firebaseHazirCallbacks.length + ' callback çağrılıyor...');
            firebaseHazirCallbacks.forEach(function(cb) {
                try { cb(database); } catch(e) { console.error('Callback hatası:', e); }
            });
            firebaseHazirCallbacks = [];
            
            window.dispatchEvent(new CustomEvent('firebaseReady', { detail: { database: database } }));
            
        } catch(e) {
            console.error('⚠️ Firebase başlatma hatası:', e.message);
        }
    } else {
        console.log('⏳ Firebase SDK bekleniyor...');
        setTimeout(initFirebase, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
} else {
    initFirebase();
}

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
