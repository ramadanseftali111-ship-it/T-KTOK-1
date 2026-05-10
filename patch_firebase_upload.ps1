Set-Location -Path 'c:\shop\mavi'

$files = Get-ChildItem -Filter 'admin-*.html' | Sort-Object Name
foreach ($file in $files) {
    if ($file.BaseName -match '^admin-(\d+)$') {
        $num = $Matches[1]
        $text = Get-Content -Path $file.FullName -Raw
        if ($text -notmatch 'function loadImage\(event, imgId\)') { continue }
        if ($text -match 'firebase.storage' -and $text -notmatch 'Imgur' -and $text -notmatch 'Cloudinary') {
            Write-Output "Skipping already Firebase file: $($file.Name)"
            continue
        }

        $pattern = 'function loadImage\(event, imgId\) \{.*?\r?\n\}\r?\n\r?\nfunction deleteImage'
        $newBody = @'
function loadImage(event, imgId) {
    const file = event.target.files[0];
    if (file) {
        // ÖNEMLİ: URL verisini temizle (bağımsız çalışsın)
        var urlInput = document.getElementById(imgId + 'Url');
        if (urlInput) {
            urlInput.value = '';
            localStorage.removeItem(pageId + '_' + imgId + '_url');
        }

        const statusDiv = document.getElementById(imgId + 'Status');

        // Loading göster
        statusDiv.innerHTML = '<span style="color:#667eea;font-size:12px;font-weight:900;">⏳ Firebase\'e yükleniyor...</span>';
        statusDiv.onclick = null;

        // 🔥 FIREBASE STORAGE - Sınırsız ve güvenli
        if (typeof firebase === 'undefined' || !firebase.storage) {
            alert('Firebase Storage yüklenmedi! Sayfayı yenileyin.');
            statusDiv.innerHTML = '<span style="color:#dc3545;font-size:12px;font-weight:900;">Görsel yüklenmedi</span>';
            statusDiv.onclick = function() { document.getElementById(imgId).click(); };
            return;
        }

        const storage = firebase.storage();
        const storageRef = storage.ref();
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const fileName = 'admin{admin_num}_' + imgId + '_' + timestamp + '_' + safeName;
        const imageRef = storageRef.child('product-images/' + fileName);

        // Firebase'e yükle
        imageRef.put(file).then(function(snapshot) {
            console.log('✅ Firebase Storage\'a yüklendi');
            return snapshot.ref.getDownloadURL();
        }).then(function(url) {
            console.log('✅ URL alındı:', url);

            // URL'i localStorage'a kaydet
            localStorage.setItem(pageId + '_' + imgId + '_url', url);
            localStorage.setItem(pageId + '_' + imgId, url);

            // Görseli göster
            if (imgId === 'bottomImg1') {
                document.getElementById('bottomImage').src = url;
            } else if (imgId.startsWith('topImg')) {
                const imgNum = imgId.replace('topImg', '');
                document.getElementById('topImage' + imgNum).src = url;
            }

            // Status güncelle
            statusDiv.innerHTML = '<span style="color:#000;font-size:16px;font-weight:900;margin-right:8px;">✓</span><span style="color:#000;font-size:12px;font-weight:900;">Görsel yüklendi (Firebase)</span><span onclick="deleteImage(event, \\'' + imgId + '\\')" style="color:#dc3545;font-size:12px;font-weight:900;margin-left:8px;cursor:pointer;">Sil</span>';

            // URL input'a da yaz
            if (urlInput) {
                urlInput.value = url;
            }

            console.log('✅ Görsel kaydedildi: ' + imgId);
            console.log('📦 Storage Key: ' + pageId + '_' + imgId + '_url');
            console.log('🔗 URL: ' + url);

            // Firebase'e kaydet
            if (typeof database !== 'undefined' && database) {
                var gorselData = {};
                gorselData[imgId] = url;
                database.ref(SITE_ID + '/urunAyarlari/urun{admin_num}/gorseller').update(gorselData).then(function() {
                    console.log('✅ Görsel Firebase\'e kaydedildi: ' + imgId);
                }).catch(function(error) {
                    console.error('❌ Firebase kayıt hatası:', error);
                });
            } else if (typeof onFirebaseReady === 'function') {
                var savedImgId = imgId;
                var savedUrl = url;
                onFirebaseReady(function(db) {
                    var gorselData = {};
                    gorselData[savedImgId] = savedUrl;
                    db.ref(SITE_ID + '/urunAyarlari/urun{admin_num}/gorseller').update(gorselData).then(function() {
                        console.log('✅ Görsel Firebase\'e kaydedildi (gecikme): ' + savedImgId);
                    });
                });
            }
        }).catch(function(error) {
            console.error('❌ Firebase Storage hatası:', error);
            statusDiv.innerHTML = '<span style="color:#dc3545;font-size:12px;font-weight:900;">❌ Yükleme başarısız! Tekrar dene.</span>';
            statusDiv.onclick = function() { document.getElementById(imgId).click(); };
            alert('❌ HATA: Görsel Firebase\'e yüklenemedi!\n\n' + error.message);
        });
    }
}
'@

        $newBody = $newBody -replace '\{admin_num\}', $num
        $newText = [Regex]::Replace($text, $pattern, $newBody + "`r`n`r`nfunction deleteImage", [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if ($newText -ne $text) {
            Set-Content -Path $file.FullName -Value $newText -Encoding utf8
            Write-Output "Updated $($file.Name)"
        } else {
            Write-Output "No change for $($file.Name)"
        }
    }
}
