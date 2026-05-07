// ============================================
// SİTE YAPILANDIRMA DOSYASI
// ============================================
// SITE_ID otomatik oluşturulur - hiçbir şey değiştirme!
// Her site kendi benzersiz ID'sini alır.
// ============================================

// Otomatik SITE_ID oluştur (domain veya rastgele)
function generateSiteId() {
    // Önce localStorage'da kayıtlı ID var mı bak
    var savedId = localStorage.getItem('__SITE_ID__');
    if (savedId && savedId.length > 0) {
        console.log('🔑 Kayıtlı SITE_ID kullanılıyor:', savedId);
        return savedId;
    }
    
    // Domain adından ID oluştur
    var hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '') {
        // Domain varsa onu kullan (örn: ahmet.com -> ahmet_com)
        var domainId = hostname.replace(/\./g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        localStorage.setItem('__SITE_ID__', domainId);
        return domainId;
    }
    
    // Local dosya (file://) için klasör adından ID oluştur
    var path = window.location.pathname;
    if (path && path.length > 1) {
        // Windows path'i düzelt: /C:/shop/mavi/index.html -> shop/mavi
        var cleanPath = path;
        
        // Windows sürücü harfini kaldır (/C: veya /D: gibi)
        if (cleanPath.match(/^\/[A-Za-z]:/)) {
            cleanPath = cleanPath.substring(3); // /C: kısmını kaldır
        }
        
        // Klasör adlarını al
        var parts = cleanPath.split('/').filter(function(p) { 
            return p && p.length > 0 && !p.includes('.'); 
        });
        
        // Son 2 klasörü birleştir (örn: shop_mavi)
        if (parts.length >= 2) {
            var folderId = parts.slice(-2).join('_').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
            localStorage.setItem('__SITE_ID__', folderId);
            return folderId;
        } else if (parts.length === 1) {
            var folderId = parts[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
            localStorage.setItem('__SITE_ID__', folderId);
            return folderId;
        }
    }
    
    // Hiçbiri yoksa benzersiz ID oluştur
    var uniqueId = 'site_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    console.log('🆕 Yeni SITE_ID oluşturuldu:', uniqueId);
    localStorage.setItem('__SITE_ID__', uniqueId);
    return uniqueId;
}

var SITE_ID = generateSiteId();

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

// Site ID'li localStorage key oluştur
function getSiteKey(key) {
    return SITE_ID + '_' + key;
}

// Site ID'li localStorage'a kaydet
function siteStorageSet(key, value) {
    localStorage.setItem(getSiteKey(key), value);
}

// Site ID'li localStorage'dan oku
function siteStorageGet(key) {
    return localStorage.getItem(getSiteKey(key));
}

// Site ID'li localStorage'dan sil
function siteStorageRemove(key) {
    localStorage.removeItem(getSiteKey(key));
}

// JSON olarak kaydet
function siteStorageSetJSON(key, obj) {
    localStorage.setItem(getSiteKey(key), JSON.stringify(obj));
}

// JSON olarak oku
function siteStorageGetJSON(key) {
    var data = localStorage.getItem(getSiteKey(key));
    if (data) {
        try {
            return JSON.parse(data);
        } catch(e) {
            return null;
        }
    }
    return null;
}

console.log('📦 Site Config yüklendi - SITE_ID:', SITE_ID);

// ============================================
// 🔔 SES SİSTEMİ NOTU
// ============================================
// Ses fonksiyonları (siparisSesCal, bildirimSesCal vs.) 
// artık sadece ramco-widget.js'de tanımlı.
// Çakışma olmaması için buradan kaldırıldı.
