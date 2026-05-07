/* GARİBAN WİDGET - Ana Sayfada Sabit Asistan */

// Widget durumu
var widgetAcik = false;
var widgetKonusmalar = [];
var sesliModAktif = false;

// Widget oluştur
function ramcoWidgetOlustur() {
  if (document.getElementById('ramcoWidget')) return;
  
  // Ana container
  var widget = document.createElement('div');
  widget.id = 'ramcoWidget';
  widget.innerHTML = `
    <!-- SES BUTONU - YENİ -->
    <div id="sesBtnWidget" class="ses-widget-btn" onclick="sesAyarlariAc()">
      <div class="ses-bars">
        <div class="ses-bar"></div>
        <div class="ses-bar"></div>
        <div class="ses-bar"></div>
        <div class="ses-bar"></div>
      </div>
    </div>
    
    <!-- YUVARLAK YÜZ -->
    <div id="ramcoYuz" class="ramco-widget-face" onclick="widgetToggle()">
      <div class="widget-face-inner">
        <div class="widget-eyes">
          <div class="widget-eye"><div class="widget-pupil"></div></div>
          <div class="widget-eye"><div class="widget-pupil"></div></div>
        </div>
        <div class="widget-mouth"></div>
      </div>
      <div class="widget-glow"></div>
      <div class="widget-badge" id="widgetBadge">0</div>
      <div class="widget-status">🟢</div>
    </div>
    
    <!-- SOHBET PANELİ -->
    <div id="ramcoPanel" class="ramco-widget-panel">
      <div class="widget-header">
        <div class="widget-header-left">
          <span class="widget-avatar">🤖</span>
          <div>
            <div class="widget-name">GARİBAN</div>
            <div class="widget-status-text">Çevrimiçi • Öğreniyor</div>
          </div>
        </div>
        <div class="widget-header-right">
          <button class="widget-btn" onclick="widgetSesToggle()" id="widgetSesBtn">🔊</button>
          <button class="widget-btn" onclick="widgetTamEkran()">⛶</button>
          <button class="widget-btn" onclick="widgetKapat()">✕</button>
        </div>
      </div>
      
      <div class="widget-quick-actions">
        <button onclick="widgetHizliKomut('analiz')">📊 Analiz</button>
        <button onclick="widgetHizliKomut('ozet')">📅 Özet</button>
        <button onclick="widgetHizliKomut('motivasyon')">💪 Moral</button>
        <button onclick="widgetHizliKomut('notlar')">📝 Not</button>
        <button onclick="widgetHizliKomut('sablonlar')">💬 Şablon</button>
        <button onclick="widgetHizliKomut('yardim')">❓</button>
      </div>
      
      <div class="widget-chat" id="widgetChat"></div>
      
      <div class="widget-input-area">
        <button class="widget-voice-btn" id="widgetVoiceBtn" onclick="widgetSesliKomut()">🎤</button>
        <input type="text" id="widgetInput" placeholder="GARİBAN'a yaz veya sesli konuş...">
        <button class="widget-send-btn" onclick="widgetMesajGonder()">➤</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Stil ekle
  ramcoWidgetStilEkle();
  
  // Event listeners
  document.getElementById('widgetInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') widgetMesajGonder();
  });
  
  // Hoş geldin mesajı
  setTimeout(function() {
    widgetMesajEkle('Merhaba! 👋 Ben GARİBAN, her zaman yanındayım. Tıkla ve konuşalım!', 'ramco');
  }, 2000);
  
  // Göz takibi
  gozTakibiBaslat();
  
  // Proaktif bildirimler
  setInterval(proaktifKontrol, 60000);
}


// Widget stilleri - TÜM STİLLER TEK YERDE (setTimeout sorunu çözüldü)
function ramcoWidgetStilEkle() {
  if (document.getElementById('ramcoWidgetStyle')) return;
  
  var style = document.createElement('style');
  style.id = 'ramcoWidgetStyle';
  style.textContent = `
    #ramcoWidget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      font-family: Arial, sans-serif;
    }
    
    /* SES BUTONU */
    .ses-widget-btn {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 3px solid #9b59b6;
      border-radius: 50%;
      cursor: pointer;
      position: absolute;
      bottom: 85px;
      right: 0;
      box-shadow: 0 5px 30px rgba(155, 89, 182, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      animation: widgetFloat 3s ease-in-out infinite;
    }
    
    .ses-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 40px rgba(155, 89, 182, 0.6);
    }
    
    .ses-bars {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 30px;
    }
    
    .ses-bar {
      width: 6px;
      background: #9b59b6;
      border-radius: 3px;
      animation: sesBarAnim 0.8s ease-in-out infinite;
    }
    
    .ses-bar:nth-child(1) { height: 12px; animation-delay: 0s; }
    .ses-bar:nth-child(2) { height: 20px; animation-delay: 0.2s; }
    .ses-bar:nth-child(3) { height: 28px; animation-delay: 0.4s; }
    .ses-bar:nth-child(4) { height: 16px; animation-delay: 0.6s; }
    
    @keyframes sesBarAnim {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.5); }
    }
    
    /* YUVARLAK YÜZ */
    .ramco-widget-face {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 3px solid #e94560;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      box-shadow: 0 5px 30px rgba(233, 69, 96, 0.4);
      animation: widgetFloat 3s ease-in-out infinite;
      transition: all 0.3s;
    }
    
    .ramco-widget-face:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 40px rgba(233, 69, 96, 0.6);
    }
    
    @keyframes widgetFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    .widget-face-inner {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    /* GÖZLER */
    .widget-eyes {
      position: absolute;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
    }
    
    .widget-eye {
      width: 14px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      position: relative;
      animation: widgetBlink 4s infinite;
    }
    
    .widget-pupil {
      width: 7px;
      height: 7px;
      background: #0a0a0a;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.1s;
    }
    
    @keyframes widgetBlink {
      0%, 45%, 55%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.1); }
    }
    
    /* AĞIZ */
    .widget-mouth {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 10px;
      background: #e94560;
      border-radius: 0 0 10px 10px;
      transition: all 0.3s;
    }
    
    .widget-mouth.talking {
      animation: widgetTalk 0.15s infinite;
    }
    
    @keyframes widgetTalk {
      0%, 100% { height: 10px; }
      50% { height: 5px; }
    }
    
    /* IŞIK */
    .widget-glow {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(233,69,96,0.3) 0%, transparent 70%);
      animation: widgetGlow 2s ease-in-out infinite alternate;
      pointer-events: none;
    }
    
    @keyframes widgetGlow {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    /* BADGE */
    .widget-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 22px;
      height: 22px;
      background: #dc3545;
      border-radius: 50%;
      color: #fff;
      font-size: 11px;
      font-weight: bold;
      display: none;
      align-items: center;
      justify-content: center;
      animation: badgePop 0.3s ease;
    }
    
    .widget-badge.show { display: flex; }
    
    @keyframes badgePop {
      0% { transform: scale(0); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    
    /* STATUS */
    .widget-status {
      position: absolute;
      bottom: -2px;
      right: -2px;
      font-size: 12px;
    }
    
    /* PANEL */
    .ramco-widget-panel {
      position: absolute;
      bottom: 85px;
      right: 0;
      width: 380px;
      height: 500px;
      background: rgba(15, 15, 35, 0.98);
      border: 2px solid #e94560;
      border-radius: 20px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: panelIn 0.3s ease;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 50px rgba(0,0,0,0.5);
    }
    
    .ramco-widget-panel.open { display: flex; }
    
    @keyframes panelIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    /* HEADER */
    .widget-header {
      background: linear-gradient(135deg, #e94560, #0f3460);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    .widget-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .widget-avatar {
      font-size: 28px;
      animation: avatarPulse 2s infinite;
    }
    
    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .widget-name {
      font-weight: bold;
      font-size: 16px;
      color: #fff;
    }
    
    .widget-status-text {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
    }
    
    .widget-header-right {
      display: flex;
      gap: 5px;
    }
    
    .widget-btn {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .widget-btn:hover {
      background: rgba(255,255,255,0.2);
      transform: scale(1.1);
    }
    
    /* QUICK ACTIONS */
    .widget-quick-actions {
      display: flex;
      gap: 5px;
      padding: 10px;
      background: rgba(0,0,0,0.3);
      overflow-x: auto;
      flex-shrink: 0;
    }
    
    .widget-quick-actions button {
      background: rgba(233, 69, 96, 0.2);
      border: 1px solid rgba(233, 69, 96, 0.3);
      color: #fff;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 11px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    
    .widget-quick-actions button:hover {
      background: rgba(233, 69, 96, 0.4);
      transform: scale(1.05);
    }
    
    /* CHAT */
    .widget-chat {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
    }
    
    .widget-chat::-webkit-scrollbar { width: 5px; }
    .widget-chat::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
    
    .widget-message {
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
      animation: msgIn 0.3s ease;
    }
    
    .widget-message.user { flex-direction: row-reverse; }
    
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .widget-msg-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .widget-message.ramco .widget-msg-avatar { background: linear-gradient(135deg, #e94560, #0f3460); }
    .widget-message.user .widget-msg-avatar { background: linear-gradient(135deg, #28a745, #20c997); }
    
    .widget-msg-bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 15px;
      font-size: 13px;
      line-height: 1.4;
      color: #fff;
    }
    
    .widget-message.ramco .widget-msg-bubble {
      background: rgba(233, 69, 96, 0.2);
      border: 1px solid rgba(233, 69, 96, 0.3);
      border-radius: 15px 15px 15px 5px;
    }
    
    .widget-message.user .widget-msg-bubble {
      background: linear-gradient(135deg, #e94560, #0f3460);
      border-radius: 15px 15px 5px 15px;
    }
    
    /* TYPING */
    .widget-typing {
      display: flex;
      gap: 4px;
      padding: 10px;
    }
    
    .widget-typing span {
      width: 6px;
      height: 6px;
      background: #e94560;
      border-radius: 50%;
      animation: typingDot 1s infinite;
    }
    
    .widget-typing span:nth-child(2) { animation-delay: 0.2s; }
    .widget-typing span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typingDot {
      0%, 100% { transform: translateY(0); opacity: 0.5; }
      50% { transform: translateY(-5px); opacity: 1; }
    }
    
    /* INPUT AREA */
    .widget-input-area {
      display: flex;
      gap: 8px;
      padding: 12px;
      background: rgba(0,0,0,0.3);
      border-top: 1px solid rgba(233, 69, 96, 0.2);
      flex-shrink: 0;
    }
    
    .widget-voice-btn {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #28a745, #20c997);
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .widget-voice-btn:hover { transform: scale(1.1); }
    
    .widget-voice-btn.recording {
      background: linear-gradient(135deg, #dc3545, #c0392b);
      animation: voiceRecord 1s infinite;
    }
    
    @keyframes voiceRecord {
      0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.5); }
      50% { box-shadow: 0 0 0 15px rgba(220, 53, 69, 0); }
    }
    
    #widgetInput {
      flex: 1;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(233, 69, 96, 0.3);
      border-radius: 20px;
      padding: 10px 15px;
      color: #fff;
      font-size: 13px;
      outline: none;
      transition: all 0.2s;
      min-width: 0;
    }
    
    #widgetInput:focus {
      border-color: #e94560;
      box-shadow: 0 0 15px rgba(233, 69, 96, 0.2);
    }
    
    #widgetInput::placeholder { color: rgba(255,255,255,0.4); }
    
    .widget-send-btn {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #e94560, #0f3460);
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .widget-send-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
    }
    
    /* RESPONSIVE */
    @media (max-width: 480px) {
      .ramco-widget-panel {
        width: calc(100vw - 40px);
        height: 60vh;
        right: -10px;
      }
    }
  `;
  
  document.head.appendChild(style);
}





// ==================== WIDGET FONKSİYONLARI ====================

function widgetToggle() {
  var panel = document.getElementById('ramcoPanel');
  widgetAcik = !widgetAcik;
  
  if (widgetAcik) {
    panel.classList.add('open');
    // Badge'i sıfırla
    var badge = document.getElementById('widgetBadge');
    badge.classList.remove('show');
    badge.textContent = '0';
  } else {
    panel.classList.remove('open');
  }
}

function widgetKapat() {
  var panel = document.getElementById('ramcoPanel');
  panel.classList.remove('open');
  widgetAcik = false;
}

function widgetTamEkran() {
  window.location.href = 'ramco.html';
}

function widgetSesToggle() {
  sesliModAktif = !sesliModAktif;
  var btn = document.getElementById('widgetSesBtn');
  btn.textContent = sesliModAktif ? '🔊' : '🔇';
}

// ==================== MESAJ SİSTEMİ ====================

function widgetMesajGonder() {
  var input = document.getElementById('widgetInput');
  var mesaj = input.value.trim();
  if (!mesaj) return;
  
  widgetMesajEkle(mesaj, 'user');
  input.value = '';
  
  // Yüz konuşma animasyonu
  widgetYuzDurum('thinking');
  widgetYaziyorGoster();
  
  // Async cevap al (Gemini destekli)
  setTimeout(function() {
    // ramcoCevapAl varsa kullan (async/Gemini destekli)
    if (typeof ramcoCevapAl === 'function') {
      ramcoCevapAl(mesaj, function(cevap) {
        widgetYaziyorGizle();
        widgetMesajEkle(cevap, 'ramco');
        widgetYuzDurum('happy');
        
        // Sesli cevap
        if (sesliModAktif) {
          widgetKonusma(cevap);
        }
      });
    } else {
      // Fallback - eski sistem
      var cevap = widgetCevapUret(mesaj);
      widgetYaziyorGizle();
      widgetMesajEkle(cevap, 'ramco');
      widgetYuzDurum('happy');
      
      if (sesliModAktif) {
        widgetKonusma(cevap);
      }
    }
  }, 600 + Math.random() * 600);
}

function widgetMesajEkle(mesaj, kimden) {
  var chat = document.getElementById('widgetChat');
  if (!chat) return;
  
  var div = document.createElement('div');
  div.className = 'widget-message ' + kimden;
  
  var avatar = kimden === 'ramco' ? '🤖' : '👤';
  div.innerHTML = `
    <div class="widget-msg-avatar">${avatar}</div>
    <div class="widget-msg-bubble">${mesaj}</div>
  `;
  
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  
  // Konuşma kaydet
  widgetKonusmalar.push({ mesaj: mesaj, kimden: kimden, zaman: new Date() });
  
  // Konuşma animasyonu
  if (kimden === 'ramco') {
    var mouth = document.querySelector('.widget-mouth');
    if (mouth) {
      mouth.classList.add('talking');
      setTimeout(function() { mouth.classList.remove('talking'); }, 1500);
    }
  }
}

function widgetYaziyorGoster() {
  var chat = document.getElementById('widgetChat');
  var div = document.createElement('div');
  div.className = 'widget-message ramco';
  div.id = 'widgetTyping';
  div.innerHTML = `
    <div class="widget-msg-avatar">🤖</div>
    <div class="widget-typing"><span></span><span></span><span></span></div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function widgetYaziyorGizle() {
  var typing = document.getElementById('widgetTyping');
  if (typing) typing.remove();
}


// ==================== YÜZ KONTROL ====================

function widgetYuzDurum(durum) {
  var face = document.querySelector('.ramco-widget-face');
  if (!face) return;
  
  face.classList.remove('happy', 'sad', 'thinking', 'excited');
  
  if (durum === 'thinking') {
    face.style.borderColor = '#f39c12';
  } else if (durum === 'excited') {
    face.style.borderColor = '#28a745';
    face.style.animation = 'widgetExcited 0.3s infinite';
  } else if (durum === 'sad') {
    face.style.borderColor = '#dc3545';
  } else {
    face.style.borderColor = '#e94560';
    face.style.animation = 'widgetFloat 3s ease-in-out infinite';
  }
}

// Göz takibi - fare imlecini takip et
function gozTakibiBaslat() {
  document.addEventListener('mousemove', function(e) {
    var pupils = document.querySelectorAll('.widget-pupil');
    
    pupils.forEach(function(pupil) {
      var eye = pupil.parentElement;
      var rect = eye.getBoundingClientRect();
      var eyeX = rect.left + rect.width / 2;
      var eyeY = rect.top + rect.height / 2;
      
      var angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      var distance = Math.min(3, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 50);
      
      var x = Math.cos(angle) * distance;
      var y = Math.sin(angle) * distance;
      
      pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });
}

// ==================== SESLİ KOMUT ====================

var widgetRecognition = null;

function widgetSesliKomut() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    widgetMesajEkle('❌ Tarayıcın ses tanımayı desteklemiyor!', 'ramco');
    return;
  }
  
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  widgetRecognition = new SpeechRecognition();
  widgetRecognition.lang = 'tr-TR';
  widgetRecognition.continuous = false;
  
  var voiceBtn = document.getElementById('widgetVoiceBtn');
  
  widgetRecognition.onstart = function() {
    voiceBtn.classList.add('recording');
    voiceBtn.textContent = '🔴';
  };
  
  widgetRecognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    widgetMesajEkle(transcript, 'user');
    
    widgetYuzDurum('thinking');
    widgetYaziyorGoster();
    
    setTimeout(function() {
      if (typeof ramcoCevapAl === 'function') {
        ramcoCevapAl(transcript, function(cevap) {
          widgetYaziyorGizle();
          widgetMesajEkle(cevap, 'ramco');
          widgetYuzDurum('happy');
          if (sesliModAktif) widgetKonusma(cevap);
        });
      } else {
        var cevap = widgetCevapUret(transcript);
        widgetYaziyorGizle();
        widgetMesajEkle(cevap, 'ramco');
        widgetYuzDurum('happy');
        if (sesliModAktif) widgetKonusma(cevap);
      }
    }, 500);
  };
  
  widgetRecognition.onerror = function(event) {
    widgetMesajEkle('❌ Ses tanıma hatası: ' + event.error, 'ramco');
  };
  
  widgetRecognition.onend = function() {
    voiceBtn.classList.remove('recording');
    voiceBtn.textContent = '🎤';
  };
  
  widgetRecognition.start();
}

// Text-to-Speech
function widgetKonusma(metin) {
  if (!window.speechSynthesis) return;
  
  var synth = window.speechSynthesis;
  synth.cancel();
  
  var utterance = new SpeechSynthesisUtterance(metin.replace(/[^\w\sğüşıöçĞÜŞİÖÇ.,!?]/g, ''));
  utterance.lang = 'tr-TR';
  utterance.rate = 1;
  
  var voices = synth.getVoices();
  var turkce = voices.find(function(v) { return v.lang.includes('tr'); });
  if (turkce) utterance.voice = turkce;
  
  utterance.onstart = function() {
    var mouth = document.querySelector('.widget-mouth');
    if (mouth) mouth.classList.add('talking');
  };
  
  utterance.onend = function() {
    var mouth = document.querySelector('.widget-mouth');
    if (mouth) mouth.classList.remove('talking');
  };
  
  synth.speak(utterance);
}


// ==================== CEVAP ÜRETİCİ ====================

function widgetCevapUret(mesaj) {
  var m = mesaj.toLowerCase();
  
  // Önce beyin sistemini dene
  if (typeof ramcoAkilliCevap === 'function') {
    return ramcoAkilliCevap(mesaj);
  }
  
  // Basit cevaplar
  if (m.includes('merhaba') || m.includes('selam')) {
    return 'Merhaba! 😊 Nasıl yardımcı olabilirim?';
  }
  
  if (m.includes('nasılsın')) {
    return 'Harikayım! Sen nasılsın? 💪';
  }
  
  if (m.includes('sipariş') || m.includes('siparis')) {
    return 'Sipariş durumunu kontrol ediyorum... 📦 Detaylı bilgi için tam ekran moduna geç!';
  }
  
  if (m.includes('kargo')) {
    return 'Kargo işlemleri için Kargo Gönder sayfasına git! 🚚';
  }
  
  if (m.includes('fatura')) {
    return 'Fatura işlemleri için Fatura Kes sayfasına git! 🧾';
  }
  
  if (m.includes('analiz') || m.includes('rapor')) {
    return widgetHizliAnaliz();
  }
  
  if (m.includes('motivasyon') || m.includes('moral')) {
    var motivasyonlar = [
      'Sen başarabilirsin! 💪',
      'Bugün harika bir gün! ☀️',
      'Her sipariş yeni bir fırsat! 📦',
      'Azimle her şey mümkün! ✨',
      'Sen bu işin en iyisisin! 🏆'
    ];
    return motivasyonlar[Math.floor(Math.random() * motivasyonlar.length)];
  }
  
  if (m.includes('tavsiye') || m.includes('öneri')) {
    var tavsiyeler = [
      'Ürün fotoğraflarını kaliteli çek! 📸',
      'Müşteri yorumları çok önemli! ⭐',
      'Hızlı kargo = Mutlu müşteri! 🚚',
      'Sosyal medyada aktif ol! 📱',
      'Kampanyalar düzenle! 🏷️'
    ];
    return tavsiyeler[Math.floor(Math.random() * tavsiyeler.length)];
  }
  
  if (m.includes('teşekkür') || m.includes('sağol')) {
    return 'Rica ederim! Her zaman yanındayım! 😊';
  }
  
  // Varsayılan
  var varsayilan = [
    'Anlıyorum! Başka nasıl yardımcı olabilirim? 🤔',
    'Tamam! Başka bir şey sormak ister misin? 😊',
    'Seninle sohbet etmek güzel! 💬'
  ];
  return varsayilan[Math.floor(Math.random() * varsayilan.length)];
}

// Hızlı analiz
function widgetHizliAnaliz() {
  if (typeof database !== 'undefined') {
    // Firebase'den veri çek
    return '📊 Sistem analizi için tam ekran moduna geç! Orada detaylı rapor var.';
  }
  return '📊 Analiz için GARİBAN sayfasına git!';
}

// ==================== HIZLI KOMUTLAR ====================

function widgetHizliKomut(komut) {
  var mesajlar = {
    'analiz': 'Sistem analizi yap',
    'ozet': 'Günlük özet ver',
    'motivasyon': 'Bana motivasyon ver',
    'tavsiye': 'E-ticaret tavsiyesi ver'
  };
  
  var mesaj = mesajlar[komut] || komut;
  widgetMesajEkle(mesaj, 'user');
  
  widgetYuzDurum('thinking');
  widgetYaziyorGoster();
  
  setTimeout(function() {
    // Async cevap al (Gemini destekli)
    if (typeof ramcoCevapAl === 'function') {
      ramcoCevapAl(mesaj, function(cevap) {
        widgetYaziyorGizle();
        widgetMesajEkle(cevap, 'ramco');
        widgetYuzDurum('happy');
        if (sesliModAktif) widgetKonusma(cevap);
      });
    } else {
      var cevap = widgetCevapUret(mesaj);
      widgetYaziyorGizle();
      widgetMesajEkle(cevap, 'ramco');
      widgetYuzDurum('happy');
      if (sesliModAktif) widgetKonusma(cevap);
    }
  }, 500);
}


// ==================== PROAKTİF BİLDİRİMLER ====================

var sonBildirimZamani = 0;

function proaktifKontrol() {
  var simdi = Date.now();
  
  // 5 dakikada bir kontrol
  if (simdi - sonBildirimZamani < 300000) return;
  
  // Firebase kontrolü
  if (typeof database !== 'undefined') {
    database.ref('siparisler').once('value', function(snapshot) {
      var bekleyenKargo = 0;
      var bugunSiparis = 0;
      var bugun = new Date().toLocaleDateString('tr-TR');
      
      snapshot.forEach(function(child) {
        var s = child.val();
        if (!s.durum || s.durum === 'Bekliyor') bekleyenKargo++;
        if (s.tarih === bugun) bugunSiparis++;
      });
      
      // Bildirim göster
      if (bekleyenKargo > 0 && !widgetAcik) {
        widgetBildirimGoster(bekleyenKargo + ' kargo bekliyor! 🚚');
      }
      
      if (bugunSiparis > 0 && !widgetAcik) {
        widgetBildirimGoster('Bugün ' + bugunSiparis + ' sipariş geldi! 📦');
      }
    });
  }
  
  // Saat bazlı mesajlar
  var saat = new Date().getHours();
  
  if (saat === 9 && !widgetAcik) {
    widgetBildirimGoster('Günaydın! Bugün harika satışlar yapacaksın! ☀️');
  }
  
  if (saat === 18 && !widgetAcik) {
    widgetBildirimGoster('Günün nasıl geçti? Özet için tıkla! 📊');
  }
  
  sonBildirimZamani = simdi;
}

function widgetBildirimGoster(mesaj) {
  var badge = document.getElementById('widgetBadge');
  var sayi = parseInt(badge.textContent) || 0;
  badge.textContent = sayi + 1;
  badge.classList.add('show');
  
  // Yüzü heyecanlandır
  widgetYuzDurum('excited');
  setTimeout(function() { widgetYuzDurum('happy'); }, 2000);
  
  // Mesajı kaydet
  widgetKonusmalar.push({ mesaj: mesaj, kimden: 'sistem', zaman: new Date() });
  
  // Panel açıksa mesajı göster
  if (widgetAcik) {
    widgetMesajEkle(mesaj, 'ramco');
  }
}

// ==================== BAŞLATMA ====================

// Ses ayarları aç
function sesAyarlariAc() {
  // Ses ayarları paneli oluştur
  var panel = document.getElementById('sesAyarlariPanel');
  if (panel) {
    panel.classList.toggle('show');
    return;
  }
  
  panel = document.createElement('div');
  panel.id = 'sesAyarlariPanel';
  panel.className = 'ses-ayarlari-panel show';
  panel.innerHTML = `
    <div class="ses-panel-header">
      <span>🔊 SES AYARLARI</span>
      <button onclick="document.getElementById('sesAyarlariPanel').classList.remove('show')">✕</button>
    </div>
    <div class="ses-panel-content">
      <div class="ses-item">
        <span>📦 Sipariş Sesi</span>
        <label class="ses-toggle">
          <input type="checkbox" id="siparisSesCb" checked onchange="sesToggleDegisti('siparis', this.checked)">
          <span class="ses-slider"></span>
        </label>
      </div>
      <div class="ses-item">
        <span>🔔 Bildirim Sesi</span>
        <label class="ses-toggle">
          <input type="checkbox" id="bildirimSesCb" checked onchange="sesToggleDegisti('bildirim', this.checked)">
          <span class="ses-slider"></span>
        </label>
      </div>
      <div class="ses-item">
        <span>✅ Başarı Sesi</span>
        <label class="ses-toggle">
          <input type="checkbox" id="basariSesCb" checked onchange="sesToggleDegisti('basari', this.checked)">
          <span class="ses-slider"></span>
        </label>
      </div>
      <div class="ses-item">
        <span>❌ Hata Sesi</span>
        <label class="ses-toggle">
          <input type="checkbox" id="hataSesCb" checked onchange="sesToggleDegisti('hata', this.checked)">
          <span class="ses-slider"></span>
        </label>
      </div>
      <div class="ses-item">
        <span>🖥️ Ekran Sesi</span>
        <label class="ses-toggle">
          <input type="checkbox" id="ekranSesCb" checked onchange="sesToggleDegisti('ekran', this.checked)">
          <span class="ses-slider"></span>
        </label>
      </div>
      <button class="ses-test-btn" onclick="sesTestToggle()" id="sesTestBtn">🔊 Test Et</button>
      
      <div class="muzik-calar-mini">
        <div class="muzik-calar-header" onclick="muzikCalarToggle()">
          <span>🎵 Müzik Çalar</span>
          <span id="muzikCalarOk">▼</span>
        </div>
        <div class="muzik-calar-icerik" id="muzikCalarIcerik">
          <div class="muzik-liste-mini" id="muzikListeMini">
            <div style="color:#888;text-align:center;padding:10px;font-size:12px;">Yükleniyor...</div>
          </div>
          <div class="muzik-kontroller-mini">
            <button onclick="widgetOnceki()">⏮️</button>
            <button onclick="widgetOynatDurdur()" id="widgetOynatBtn">▶️</button>
            <button onclick="widgetSonraki()">⏭️</button>
          </div>
          <div class="muzik-isim-mini" id="widgetSarkiIsim">Şarkı seçilmedi</div>
        </div>
      </div>
    </div>
  `;
  
  // Stil ekle
  var style = document.createElement('style');
  style.textContent = `
    .ses-ayarlari-panel {
      position: fixed;
      bottom: 180px;
      right: 20px;
      width: 280px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 2px solid #9b59b6;
      border-radius: 15px;
      z-index: 99998;
      display: none;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(155, 89, 182, 0.3);
      animation: sesPanelIn 0.3s ease;
    }
    .ses-ayarlari-panel.show { display: block; }
    @keyframes sesPanelIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ses-panel-header {
      background: linear-gradient(135deg, #9b59b6, #8e44ad);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-weight: bold;
    }
    .ses-panel-header button {
      background: rgba(255,255,255,0.2);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
    }
    .ses-panel-content { padding: 15px; }
    .ses-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      font-size: 14px;
    }
    .ses-item:last-of-type { border-bottom: none; }
    .ses-toggle {
      position: relative;
      width: 50px;
      height: 26px;
    }
    .ses-toggle input { opacity: 0; width: 0; height: 0; }
    .ses-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #555;
      border-radius: 26px;
      transition: 0.3s;
    }
    .ses-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
    .ses-toggle input:checked + .ses-slider { background: #9b59b6; }
    .ses-toggle input:checked + .ses-slider:before { transform: translateX(24px); }
    .ses-test-btn {
      width: 100%;
      background: linear-gradient(135deg, #9b59b6, #8e44ad);
      border: none;
      color: #fff;
      padding: 12px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
      transition: 0.3s;
    }
    .ses-test-btn:hover { transform: scale(1.02); }
    
    /* Müzik Çalar Mini */
    .muzik-calar-mini {
      margin-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 10px;
    }
    .muzik-calar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #9b59b6;
      font-weight: bold;
      cursor: pointer;
      padding: 8px 0;
    }
    .muzik-calar-icerik {
      display: none;
      padding-top: 10px;
    }
    .muzik-calar-icerik.show { display: block; }
    .muzik-liste-mini {
      max-height: 150px;
      overflow-y: auto;
      margin-bottom: 10px;
    }
    .muzik-liste-mini::-webkit-scrollbar { width: 5px; }
    .muzik-liste-mini::-webkit-scrollbar-thumb { background: #9b59b6; border-radius: 5px; }
    .muzik-item-mini {
      padding: 8px 10px;
      background: rgba(0,0,0,0.3);
      border-radius: 6px;
      margin-bottom: 5px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: 0.2s;
    }
    .muzik-item-mini:hover { background: rgba(155,89,182,0.3); }
    .muzik-item-mini.aktif { background: #9b59b6; }
    .muzik-kontroller-mini {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .muzik-kontroller-mini button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #9b59b6;
      background: rgba(155,89,182,0.2);
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: 0.2s;
    }
    .muzik-kontroller-mini button:hover { background: rgba(155,89,182,0.4); }
    .muzik-isim-mini {
      text-align: center;
      color: #888;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(panel);
  
  // Kayıtlı ayarları yükle
  sesAyarlariYukle();
  
  // Müzik listesini yükle
  setTimeout(widgetMuzikListesiYukle, 500);
}

// Widget müzik değişkenleri
var widgetMuzikListesi = [];
var widgetMuzikIndex = -1;
var widgetAudio = null;
var widgetOynatiliyor = false;

// Müzik çalar aç/kapa
function muzikCalarToggle() {
  var icerik = document.getElementById('muzikCalarIcerik');
  var ok = document.getElementById('muzikCalarOk');
  if (icerik.classList.contains('show')) {
    icerik.classList.remove('show');
    ok.textContent = '▼';
  } else {
    icerik.classList.add('show');
    ok.textContent = '▲';
    widgetMuzikListesiYukle();
  }
}

// Müzik listesini IndexedDB'den yükle
function widgetMuzikListesiYukle() {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var dbName = siteId ? siteId + '_ramco_ses_db' : 'ramco_ses_db';
  
  console.log('🎵 Müzik listesi yükleniyor - DB:', dbName);
  
  var container = document.getElementById('muzikListeMini');
  if (!container) return;
  
  // IndexedDB'den yükle
  var request = indexedDB.open(dbName, 1);
  
  request.onerror = function() {
    // IndexedDB açılamazsa localStorage'dan dene
    widgetMuzikLocalStorageDene();
  };
  
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('muzikler')) {
      db.createObjectStore('muzikler', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('sesler')) {
      db.createObjectStore('sesler', { keyPath: 'tip' });
    }
  };
  
  request.onsuccess = function() {
    var db = request.result;
    try {
      var transaction = db.transaction(['muzikler'], 'readonly');
      var store = transaction.objectStore('muzikler');
      var getAll = store.getAll();
      
      getAll.onsuccess = function() {
        widgetMuzikListesi = getAll.result || [];
        widgetMuzikListesiGoster();
      };
      
      getAll.onerror = function() {
        widgetMuzikLocalStorageDene();
      };
    } catch(e) {
      widgetMuzikLocalStorageDene();
    }
  };
}

// Fallback: localStorage'dan yükle
function widgetMuzikLocalStorageDene() {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var key = siteId ? siteId + '_ramco_muzik_listesi' : 'ramco_muzik_listesi';
  var data = localStorage.getItem(key);
  
  console.log('🎵 localStorage müzik aranıyor - Key:', key);
  
  if (data) {
    try {
      widgetMuzikListesi = JSON.parse(data);
    } catch(e) {
      widgetMuzikListesi = [];
    }
  } else {
    widgetMuzikListesi = [];
  }
  widgetMuzikListesiGoster();
}

// Müzik listesini göster
function widgetMuzikListesiGoster() {
  var container = document.getElementById('muzikListeMini');
  if (!container) return;
  
  if (widgetMuzikListesi.length === 0) {
    container.innerHTML = '<div style="color:#888;text-align:center;padding:15px;font-size:11px;">Müzik yok.<br>Ses Yöneticisi\'nden yükle!</div>';
    return;
  }
  
  var html = '';
  widgetMuzikListesi.forEach(function(m, i) {
    var aktif = (widgetMuzikIndex === i) ? ' aktif' : '';
    html += '<div class="muzik-item-mini' + aktif + '" onclick="widgetMuzikSec(' + i + ')" title="' + m.isim + '">🎵 ' + m.isim + '</div>';
  });
  container.innerHTML = html;
}

// Müzik seç ve çal
function widgetMuzikSec(index) {
  widgetMuzikIndex = index;
  var muzik = widgetMuzikListesi[index];
  if (!muzik) return;
  
  if (widgetAudio) {
    widgetAudio.pause();
    widgetAudio = null;
  }
  
  widgetAudio = new Audio(muzik.data);
  widgetAudio.volume = 0.5;
  
  // Şarkı bitince sonrakine geç
  widgetAudio.addEventListener('ended', function() {
    console.log('Şarkı bitti, sonrakine geçiliyor...');
    if (widgetMuzikListesi.length > 0) {
      var nextIndex = (widgetMuzikIndex + 1) % widgetMuzikListesi.length;
      widgetMuzikSec(nextIndex);
    }
  });
  
  widgetAudio.play();
  widgetOynatiliyor = true;
  
  document.getElementById('widgetOynatBtn').textContent = '⏸️';
  document.getElementById('widgetSarkiIsim').textContent = muzik.isim;
  
  widgetMuzikListesiGoster();
}

// Oynat/Durdur
function widgetOynatDurdur() {
  if (!widgetAudio) {
    if (widgetMuzikListesi.length > 0) {
      widgetMuzikSec(0);
    }
    return;
  }
  
  if (widgetOynatiliyor) {
    widgetAudio.pause();
    widgetOynatiliyor = false;
    document.getElementById('widgetOynatBtn').textContent = '▶️';
  } else {
    widgetAudio.play();
    widgetOynatiliyor = true;
    document.getElementById('widgetOynatBtn').textContent = '⏸️';
  }
}

// Önceki
function widgetOnceki() {
  if (widgetMuzikListesi.length === 0) return;
  widgetMuzikIndex = (widgetMuzikIndex - 1 + widgetMuzikListesi.length) % widgetMuzikListesi.length;
  widgetMuzikSec(widgetMuzikIndex);
}

// Sonraki
function widgetSonraki() {
  if (widgetMuzikListesi.length === 0) return;
  widgetMuzikIndex = (widgetMuzikIndex + 1) % widgetMuzikListesi.length;
  widgetMuzikSec(widgetMuzikIndex);
}

// Toggle değiştiğinde sadece ayarı kaydet (ses çalmayacak)
var widgetSesObjeler = {}; // Her tip için audio objesi
var testModu = false;

function sesToggleDegisti(tip, acik) {
  sesAyarKaydet();
  console.log('⚙️ ' + tip + ' sesi ' + (acik ? 'AÇIK' : 'KAPALI'));
}

// IndexedDB'den ses çal
function widgetSesCal(tip) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var dbName = siteId ? siteId + '_ramco_ses_db' : 'ramco_ses_db';
  
  console.log('🔍 Ses aranıyor - Tip:', tip, 'DB:', dbName, 'SITE_ID:', siteId);
  
  // Önceki sesi durdur
  if (widgetSesObjeler[tip]) {
    widgetSesObjeler[tip].pause();
  }
  
  var request = indexedDB.open(dbName, 1);
  
  request.onerror = function(e) {
    console.log('❌ IndexedDB açılamadı:', e);
    // IndexedDB açılamazsa localStorage'dan dene
    widgetSesLocalStorageCal(tip);
  };
  
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('sesler')) {
      db.createObjectStore('sesler', { keyPath: 'tip' });
    }
  };
  
  request.onsuccess = function() {
    var db = request.result;
    try {
      var transaction = db.transaction(['sesler'], 'readonly');
      var store = transaction.objectStore('sesler');
      var getRequest = store.get(tip);
      
      getRequest.onsuccess = function() {
        var ses = getRequest.result;
        console.log('📦 IndexedDB sonuç - Tip:', tip, 'Ses:', ses ? ses.isim : 'YOK', 'Data uzunluk:', ses && ses.data ? ses.data.length : 0);
        if (ses && ses.data) {
          var audio = new Audio(ses.data);
          audio.volume = 0.5;
          widgetSesObjeler[tip] = audio; // Kaydet
          audio.play().then(function() {
            console.log('🔊 ' + tip + ' sesi çalıyor: ' + ses.isim);
          }).catch(function(err) {
            console.log('❌ Ses çalma hatası:', err);
          });
        } else {
          // IndexedDB'de yoksa localStorage'dan dene
          console.log('⚠️ IndexedDB\'de ' + tip + ' sesi yok, localStorage deneniyor...');
          widgetSesLocalStorageCal(tip);
        }
      };
      
      getRequest.onerror = function() {
        widgetSesLocalStorageCal(tip);
      };
    } catch(e) {
      widgetSesLocalStorageCal(tip);
    }
  };
}

// Fallback: localStorage'dan ses çal
function widgetSesLocalStorageCal(tip) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var key = siteId ? siteId + '_ramco_sesler' : 'ramco_sesler';
  var data = localStorage.getItem(key);
  
  console.log('🔍 localStorage ses aranıyor - Key:', key, 'Data:', data ? 'VAR' : 'YOK');
  
  if (data) {
    try {
      var sesler = JSON.parse(data);
      console.log('📦 localStorage sesler:', Object.keys(sesler).map(function(k) { return k + ':' + (sesler[k] ? sesler[k].isim : 'YOK'); }));
      if (sesler[tip] && sesler[tip].data) {
        var audio = new Audio(sesler[tip].data);
        audio.volume = 0.5;
        widgetSesObjeler[tip] = audio; // Kaydet
        audio.play().then(function() {
          console.log('🔊 ' + tip + ' sesi çalıyor: ' + sesler[tip].isim);
        }).catch(function(err) {
          console.log('❌ Ses çalma hatası:', err);
        });
      } else {
        console.log('⚠️ ' + tip + ' sesi bulunamadı');
      }
    } catch(e) {
      console.log('Ses parse hatası:', e);
    }
  } else {
    console.log('⚠️ localStorage\'da ses verisi yok');
  }
}

function sesAyarKaydet() {
  var ayarlar = {
    siparis: document.getElementById('siparisSesCb').checked,
    bildirim: document.getElementById('bildirimSesCb').checked,
    basari: document.getElementById('basariSesCb').checked,
    hata: document.getElementById('hataSesCb').checked,
    ekran: document.getElementById('ekranSesCb').checked
  };
  localStorage.setItem('ses_ayarlari', JSON.stringify(ayarlar));
}

function sesAyarlariYukle() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (document.getElementById('siparisSesCb')) {
    document.getElementById('siparisSesCb').checked = ayarlar.siparis !== false;
    document.getElementById('bildirimSesCb').checked = ayarlar.bildirim !== false;
    document.getElementById('basariSesCb').checked = ayarlar.basari !== false;
    document.getElementById('hataSesCb').checked = ayarlar.hata !== false;
    document.getElementById('ekranSesCb').checked = ayarlar.ekran !== false;
  }
}

var testAudio = null;
var testIndex = 0;
var testTipler = ['siparis', 'bildirim', 'basari', 'hata', 'ekran'];
var testCalisiyor = false;

// Test Et butonu - açık sesleri sırayla test et / durdur
function sesTestToggle() {
  var btn = document.getElementById('sesTestBtn');
  
  if (testCalisiyor) {
    // Test durduruluyor
    testDurdur();
    btn.textContent = '🔊 Test Et';
    btn.style.background = '';
    return;
  }
  
  // Test başlatılıyor
  testCalisiyor = true;
  testIndex = 0;
  btn.textContent = '⏹️ Durdur';
  btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
  
  // Açık olan sesleri bul ve test et
  siradakiSesiTestEt();
}

function siradakiSesiTestEt() {
  if (!testCalisiyor) return;
  
  // Açık olan bir sonraki sesi bul
  while (testIndex < testTipler.length) {
    var tip = testTipler[testIndex];
    var cb = document.getElementById(tip + 'SesCb');
    if (cb && cb.checked) {
      // Bu ses açık, çal
      console.log('🧪 Test: ' + tip + ' sesi çalınıyor...');
      widgetSesCalTest(tip, function() {
        // Ses bitince sonrakine geç
        testIndex++;
        setTimeout(siradakiSesiTestEt, 500);
      });
      return;
    }
    testIndex++;
  }
  
  // Tüm sesler test edildi
  testDurdur();
  var btn = document.getElementById('sesTestBtn');
  if (btn) {
    btn.textContent = '🔊 Test Et';
    btn.style.background = '';
  }
  console.log('✅ Tüm sesler test edildi');
}

function testDurdur() {
  testCalisiyor = false;
  if (testAudio) {
    testAudio.pause();
    testAudio.currentTime = 0;
    testAudio = null;
  }
}

// Test için ses çal (callback ile)
function widgetSesCalTest(tip, onEnd) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var dbName = siteId ? siteId + '_ramco_ses_db' : 'ramco_ses_db';
  
  var request = indexedDB.open(dbName, 1);
  
  request.onerror = function() {
    widgetSesLocalStorageCalTest(tip, onEnd);
  };
  
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('sesler')) {
      db.createObjectStore('sesler', { keyPath: 'tip' });
    }
  };
  
  request.onsuccess = function() {
    var db = request.result;
    try {
      var transaction = db.transaction(['sesler'], 'readonly');
      var store = transaction.objectStore('sesler');
      var getRequest = store.get(tip);
      
      getRequest.onsuccess = function() {
        var ses = getRequest.result;
        if (ses && ses.data) {
          if (testAudio) testAudio.pause();
          testAudio = new Audio(ses.data);
          testAudio.volume = 0.5;
          testAudio.onended = onEnd;
          testAudio.play();
        } else {
          widgetSesLocalStorageCalTest(tip, onEnd);
        }
      };
      
      getRequest.onerror = function() {
        widgetSesLocalStorageCalTest(tip, onEnd);
      };
    } catch(e) {
      widgetSesLocalStorageCalTest(tip, onEnd);
    }
  };
}

function widgetSesLocalStorageCalTest(tip, onEnd) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var key = siteId ? siteId + '_ramco_sesler' : 'ramco_sesler';
  var data = localStorage.getItem(key);
  
  if (data) {
    try {
      var sesler = JSON.parse(data);
      if (sesler[tip] && sesler[tip].data) {
        if (testAudio) testAudio.pause();
        testAudio = new Audio(sesler[tip].data);
        testAudio.volume = 0.5;
        testAudio.onended = onEnd;
        testAudio.play();
        return;
      }
    } catch(e) {}
  }
  
  // Ses bulunamadı, sonrakine geç
  if (onEnd) onEnd();
}

function sesTest() {
  sesTestToggle();
}

function varsayilanBipCal() {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 800;
  osc.type = 'sine';
  gain.gain.value = 0.3;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.stop(ctx.currentTime + 0.3);
}

// Sipariş sesi çal
function siparisSesCal() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (ayarlar.siparis === false) return;
  
  sesCal('siparis');
}

// Bildirim sesi çal
function bildirimSesCal() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (ayarlar.bildirim === false) return;
  
  sesCal('bildirim');
}

// Başarı sesi çal
function basariSesCal() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (ayarlar.basari === false) return;
  
  sesCal('basari');
}

// Hata sesi çal
function hataSesCal() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (ayarlar.hata === false) return;
  
  sesCal('hata');
}

// Ekran sesi çal
function ekranSesCal() {
  var ayarlar = JSON.parse(localStorage.getItem('ses_ayarlari') || '{}');
  if (ayarlar.ekran === false) return;
  
  sesCal('ekran');
}

// Genel ses çalma fonksiyonu (IndexedDB + localStorage)
function sesCal(tip) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var dbName = siteId ? siteId + '_ramco_ses_db' : 'ramco_ses_db';
  
  var request = indexedDB.open(dbName, 1);
  
  request.onerror = function() {
    sesCalLocalStorage(tip);
  };
  
  request.onupgradeneeded = function(e) {
    var db = e.target.result;
    if (!db.objectStoreNames.contains('sesler')) {
      db.createObjectStore('sesler', { keyPath: 'tip' });
    }
  };
  
  request.onsuccess = function() {
    var db = request.result;
    try {
      var transaction = db.transaction(['sesler'], 'readonly');
      var store = transaction.objectStore('sesler');
      var getRequest = store.get(tip);
      
      getRequest.onsuccess = function() {
        var ses = getRequest.result;
        if (ses && ses.data) {
          var audio = new Audio(ses.data);
          audio.volume = 0.5;
          audio.play().catch(function(e) { console.log('Ses hatası:', e); });
          console.log('🔊 ' + tip + ' sesi çalıyor:', ses.isim);
        } else {
          sesCalLocalStorage(tip);
        }
      };
      
      getRequest.onerror = function() {
        sesCalLocalStorage(tip);
      };
    } catch(e) {
      sesCalLocalStorage(tip);
    }
  };
}

// localStorage'dan ses çal
function sesCalLocalStorage(tip) {
  var siteId = typeof SITE_ID !== 'undefined' ? SITE_ID : (localStorage.getItem('__SITE_ID__') || '');
  var key = siteId ? siteId + '_ramco_sesler' : 'ramco_sesler';
  var data = localStorage.getItem(key);
  
  if (data) {
    try {
      var sesler = JSON.parse(data);
      if (sesler[tip] && sesler[tip].data) {
        var audio = new Audio(sesler[tip].data);
        audio.volume = 0.5;
        audio.play().catch(function(e) { console.log('Ses hatası:', e); });
        console.log('🔊 ' + tip + ' sesi çalıyor (localStorage)');
        return;
      }
    } catch(e) {}
  }
  
  // Varsayılan ses çal
  varsayilanSesCal(tip);
}

// Varsayılan sesler (yüklü ses yoksa)
function varsayilanSesCal(tip) {
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  
  if (tip === 'siparis') {
    // Mutlu melodi
    var notalar = [523, 659, 784, 1047];
    notalar.forEach(function(frek, i) {
      setTimeout(function() {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frek;
        osc.type = 'sine';
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.stop(ctx.currentTime + 0.15);
      }, i * 150);
    });
  } else if (tip === 'bildirim') {
    // Ding dong
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    setTimeout(function() { osc.frequency.value = 660; }, 200);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.stop(ctx.currentTime + 0.4);
  } else if (tip === 'basari') {
    // Başarı fanfar
    var notalar = [523, 659, 784, 1047, 1047];
    notalar.forEach(function(frek, i) {
      setTimeout(function() {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frek;
        osc.type = 'triangle';
        gain.gain.value = 0.25;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.stop(ctx.currentTime + 0.12);
      }, i * 100);
    });
  } else if (tip === 'hata') {
    // Hata sesi
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = 'sawtooth';
    gain.gain.value = 0.2;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
  } else if (tip === 'ekran') {
    // Hoşgeldin melodisi
    var notalar = [330, 392, 440, 523, 659, 784];
    notalar.forEach(function(frek, i) {
      setTimeout(function() {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frek;
        osc.type = 'sine';
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.stop(ctx.currentTime + 0.15);
      }, i * 120);
    });
  }
}

function ramcoWidgetBaslat() {
  // Widget'ı oluştur
  ramcoWidgetOlustur();
  
  // Beyin sistemini yükle
  if (typeof ramcoBeyniniBaslat === 'function') {
    ramcoBeyniniBaslat();
  }
  
  // İlk proaktif kontrol
  setTimeout(proaktifKontrol, 10000);
  
  // 🔔 SİPARİŞ DİNLEYİCİ - Hangi sayfada olursan ol ses gelsin!
  siparisSesDinleyiciBaslat();
  
  console.log('🤖 GARİBAN Widget başlatıldı!');
}

// ==================== SİPARİŞ SES DİNLEYİCİ ====================
var sonSiparisTimestamp = 0;
var siparisSesDinleyiciAktif = false;

function siparisSesDinleyiciBaslat() {
  // Firebase yüklü mü kontrol et
  if (typeof database === 'undefined') {
    // Firebase henüz yüklenmemiş, biraz bekle ve tekrar dene
    setTimeout(siparisSesDinleyiciBaslat, 1000);
    return;
  }
  
  // Zaten aktifse tekrar başlatma
  if (siparisSesDinleyiciAktif) return;
  siparisSesDinleyiciAktif = true;
  
  // Sayfa açılış zamanını kaydet
  sonSiparisTimestamp = Date.now();
  
  console.log('🔔 Sipariş ses dinleyici başlatıldı! Timestamp:', sonSiparisTimestamp);
  
  // Yeni siparişleri dinle
  database.ref('siparisler').on('child_added', function(snapshot) {
    var siparis = snapshot.val();
    var siparisTimestamp = siparis.timestamp || 0;
    
    // Sayfa açıldıktan SONRA gelen siparişlerde ses çal
    if (siparisTimestamp > sonSiparisTimestamp) {
      // Yeni sipariş geldi!
      console.log('📦 YENİ SİPARİŞ GELDİ:', siparis.musteri || 'Müşteri');
      
      // Ses çal
      siparisSesCal();
      
      // Widget badge güncelle
      var badge = document.getElementById('widgetBadge');
      if (badge) {
        var sayi = parseInt(badge.textContent) || 0;
        badge.textContent = sayi + 1;
        badge.classList.add('show');
      }
      
      // Yüzü heyecanlandır
      if (typeof widgetYuzDurum === 'function') {
        widgetYuzDurum('excited');
        setTimeout(function() { widgetYuzDurum('happy'); }, 3000);
      }
      
      // Bildirim mesajı
      var mesaj = '🛒 Yeni sipariş: ' + (siparis.musteri || 'Müşteri') + ' - ' + (siparis.tutar || '?') + '₺';
      
      // Panel açıksa mesajı göster
      if (widgetAcik && typeof widgetMesajEkle === 'function') {
        widgetMesajEkle(mesaj, 'ramco');
      }
      
      // Browser notification (izin varsa)
      if (typeof Notification !== 'undefined') {
        if (Notification.permission === 'granted') {
          new Notification('🛒 Yeni Sipariş!', {
            body: (siparis.musteri || 'Müşteri') + ' - ' + (siparis.tutar || '?') + '₺',
            icon: '📦'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    }
  });
}

// Sayfa yüklenince başlat
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ramcoWidgetBaslat);
} else {
  setTimeout(ramcoWidgetBaslat, 500);
}