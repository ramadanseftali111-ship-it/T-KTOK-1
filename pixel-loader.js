// =============================================
// PIXEL LOADER - Meta & TikTok Pixel Yukleyici
// =============================================
// Guncelleme: 2025
// =============================================

(function() {
    
    // Site ID icin key olustur
    function getSiteKey(key) {
        if (typeof SITE_ID !== 'undefined' && SITE_ID) {
            return SITE_ID + '_' + key;
        }
        var siteId = localStorage.getItem('__SITE_ID__') || 'default';
        return siteId + '_' + key;
    }
    
    // Firebase hazir olunca calistir
    function onFirebaseReady(callback) {
        if (typeof database !== 'undefined' && database) {
            callback();
        } else if (typeof firebase !== 'undefined') {
            setTimeout(function() { onFirebaseReady(callback); }, 200);
        } else {
            setTimeout(function() { onFirebaseReady(callback); }, 200);
        }
    }
    
    // META PIXEL YUKLE (2025 Guncel)
    function loadMetaPixel(pixelId) {
        if (!pixelId) return;
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', pixelId);
        fbq('track', 'PageView');
        
        window.metaPixelId = pixelId;
        console.log('✅ Meta Pixel aktif:', pixelId);
    }
    
    // TIKTOK PIXEL YUKLE (2025 Guncel)
    function loadTikTokPixel(pixelId) {
        if (!pixelId) return;
        
        !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
            ttq.load(pixelId);
            ttq.page();
        }(window, document, 'ttq');
        
        window.tiktokPixelId = pixelId;
        console.log('✅ TikTok Pixel aktif:', pixelId);
    }
    
    // PIXELLERI YUKLE
    onFirebaseReady(function() {
        
        // Firebase'den pixel ID'leri al
        if (typeof database !== 'undefined' && database) {
            
            // Meta Pixel
            database.ref('pixels/meta').once('value').then(function(snap) {
                var id = snap.val();
                if (id) {
                    loadMetaPixel(id);
                } else {
                    console.log('⚠️ Meta Pixel ID ayarlanmamis');
                }
            }).catch(function(e) {
                console.log('Meta Pixel yuklenemedi:', e.message);
            });
            
            // TikTok Pixel
            database.ref('pixels/tiktok').once('value').then(function(snap) {
                var id = snap.val();
                if (id) {
                    loadTikTokPixel(id);
                } else {
                    console.log('⚠️ TikTok Pixel ID ayarlanmamis');
                }
            }).catch(function(e) {
                console.log('TikTok Pixel yuklenemedi:', e.message);
            });
            
        } else {
            console.log('⚠️ Firebase baglantisi yok - pixel yuklenemedi');
        }
    });
    
})();

// =============================================
// PIXEL EVENT FONKSIYONLARI
// =============================================

// Sayfa goruntulendiginde (otomatik calisir)
function fireViewContent(contentName, contentId, value) {
    // Meta
    if (window.metaPixelId && typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_name: contentName || 'Urun',
            content_ids: [contentId || '1'],
            content_type: 'product',
            value: value || 0,
            currency: 'TRY'
        });
    }
    // TikTok
    if (window.tiktokPixelId && typeof ttq !== 'undefined') {
        ttq.track('ViewContent', {
            content_name: contentName || 'Urun',
            content_id: contentId || '1',
            content_type: 'product',
            value: value || 0,
            currency: 'TRY'
        });
    }
}

// Sepete eklendiginde
function fireAddToCart(contentName, contentId, value, quantity) {
    // Meta
    if (window.metaPixelId && typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
            content_name: contentName || 'Urun',
            content_ids: [contentId || '1'],
            content_type: 'product',
            value: value || 0,
            currency: 'TRY',
            quantity: quantity || 1
        });
        console.log('✅ Meta AddToCart event');
    }
    // TikTok
    if (window.tiktokPixelId && typeof ttq !== 'undefined') {
        ttq.track('AddToCart', {
            content_name: contentName || 'Urun',
            content_id: contentId || '1',
            content_type: 'product',
            value: value || 0,
            currency: 'TRY',
            quantity: quantity || 1
        });
        console.log('✅ TikTok AddToCart event');
    }
}

// Siparis tamamlandiginda (LEAD)
function fireMetaLeadEvent(value) {
    // Meta
    if (window.metaPixelId && typeof fbq !== 'undefined') {
        fbq('track', 'Lead', { value: value || 0, currency: 'TRY' });
        fbq('track', 'Purchase', { value: value || 0, currency: 'TRY' });
        console.log('✅ Meta Lead/Purchase event');
    }
}

// Siparis tamamlandiginda (TikTok)
function fireTikTokSubmitFormEvent(value) {
    // TikTok
    if (window.tiktokPixelId && typeof ttq !== 'undefined') {
        ttq.track('SubmitForm');
        ttq.track('CompletePayment', { value: value || 0, currency: 'TRY' });
        console.log('✅ TikTok SubmitForm/CompletePayment event');
    }
}

// Siparis tamamlandiginda (Her ikisi birden)
function fireOrderComplete(value) {
    fireMetaLeadEvent(value);
    fireTikTokSubmitFormEvent(value);
}

console.log('📦 Pixel Loader yuklendi');
