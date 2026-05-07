/**
 * Türkiye İl-İlçe Posta Kodları (Gerçek Veriler)
 * Kullanım: getPostalCode('Tekirdağ', 'Çerkezköy') → '59500'
 */

// Gerçek Türkiye posta kodları
var PostaKodlari = {
    'tekirdag': {
        'cerkezkoy': '59500',
        'corlu': '59850',
        'ergene': '59930',
        'hayrabolu': '59400',
        'kapakli': '59770',
        'malkara': '59300',
        'marmaraereglisi': '59740',
        'muratli': '59600',
        'saray': '59200',
        'suleymanpasa': '59000',
        'sarköy': '59760'
    },
    'istanbul': {
        'adalar': '34970',
        'arnavutkoy': '34275',
        'atasehir': '34746',
        'avcilar': '34320',
        'bagcilar': '34200',
        'bahcelievler': '34180',
        'bakirkoy': '34142',
        'basaksehir': '34480',
        'bayrampaşa': '34030',
        'besiktas': '34349',
        'beykoz': '34800',
        'beylikduzu': '34520',
        'beyoglu': '34433',
        'buyukcekmece': '34900',
        'catalca': '34540',
        'cekmekoy': '34782',
        'esenler': '34220',
        'esenyurt': '34510',
        'eyupsultan': '34050',
        'fatih': '34134',
        'gaziosmanpasa': '34245',
        'gungoren': '34164',
        'kadikoy': '34710',
        'kagithane': '34406',
        'kartal': '34860',
        'kucukcekmece': '34303',
        'maltepe': '34844',
        'pendik': '34890',
        'sancaktepe': '34885',
        'sariyer': '34450',
        'silivri': '34930',
        'sultanbeyli': '34920',
        'sultangazi': '34260',
        'sile': '34980',
        'sisli': '34394',
        'tuzla': '34940',
        'umraniye': '34760',
        'uskudar': '34662',
        'zeytinburnu': '34025'
    },
    'ankara': {
        'akyurt': '06970',
        'altindag': '06010',
        'ayas': '06860',
        'bala': '06760',
        'beypazari': '06730',
        'camlidere': '06750',
        'cankaya': '06100',
        'cubuk': '06760',
        'elmadag': '06780',
        'etimesgut': '06790',
        'evren': '06400',
        'golbasi': '06830',
        'gudul': '06820',
        'haymana': '06840',
        'kahramankazan': '06980',
        'kalecik': '06870',
        'kecioren': '06280',
        'kizilcahamam': '06890',
        'mamak': '06500',
        'nallihan': '06880',
        'polatli': '06900',
        'pursaklar': '06145',
        'sincan': '06930',
        'sereflikochisar': '06950',
        'yenimahalle': '06170'
    },
    'izmir': {
        'aliaga': '35800',
        'balcova': '35330',
        'bayindir': '35300',
        'bayrakli': '35535',
        'bergama': '35700',
        'beydag': '35900',
        'bornova': '35040',
        'buca': '35390',
        'cesme': '35930',
        'cigli': '35620',
        'dikili': '35980',
        'foca': '35680',
        'gaziemir': '35410',
        'guzelbahce': '35310',
        'karabaglar': '35090',
        'karaburun': '35970',
        'karsiyaka': '35600',
        'kemalpasa': '35730',
        'kinik': '35840',
        'kiraz': '35950',
        'konak': '35220',
        'menderes': '35470',
        'menemen': '35660',
        'narlidere': '35320',
        'odemis': '35750',
        'seferihisar': '35460',
        'selcuk': '35920',
        'tire': '35900',
        'torbali': '35860',
        'urla': '35430'
    }
};

// İl merkez kodları (ilçe bulunamazsa kullanılır)
var ilMerkezKodlari = {
    'adana': '01000', 'adiyaman': '02000', 'afyonkarahisar': '03000', 'agri': '04000',
    'aksaray': '68000', 'amasya': '05000', 'ankara': '06000', 'antalya': '07000',
    'ardahan': '75000', 'artvin': '08000', 'aydin': '09000', 'balikesir': '10000',
    'bartin': '74000', 'batman': '72000', 'bayburt': '69000', 'bilecik': '11000',
    'bingol': '12000', 'bitlis': '13000', 'bolu': '14000', 'burdur': '15000',
    'bursa': '16000', 'canakkale': '17000', 'cankiri': '18000', 'corum': '19000',
    'denizli': '20000', 'diyarbakir': '21000', 'duzce': '81000', 'edirne': '22000',
    'elazig': '23000', 'erzincan': '24000', 'erzurum': '25000', 'eskisehir': '26000',
    'gaziantep': '27000', 'giresun': '28000', 'gumushane': '29000', 'hakkari': '30000',
    'hatay': '31000', 'igdir': '76000', 'isparta': '32000', 'istanbul': '34000',
    'izmir': '35000', 'kahramanmaras': '46000', 'karabuk': '78000', 'karaman': '70000',
    'kars': '36000', 'kastamonu': '37000', 'kayseri': '38000', 'kilis': '79000',
    'kirikkale': '71000', 'kirklareli': '39000', 'kirsehir': '40000', 'kocaeli': '41000',
    'konya': '42000', 'kutahya': '43000', 'malatya': '44000', 'manisa': '45000',
    'mardin': '47000', 'mersin': '33000', 'mugla': '48000', 'mus': '49000',
    'nevsehir': '50000', 'nigde': '51000', 'ordu': '52000', 'osmaniye': '80000',
    'rize': '53000', 'sakarya': '54000', 'samsun': '55000', 'sanliurfa': '63000',
    'siirt': '56000', 'sinop': '57000', 'sirnak': '73000', 'sivas': '58000',
    'tekirdag': '59000', 'tokat': '60000', 'trabzon': '61000', 'tunceli': '62000',
    'usak': '64000', 'van': '65000', 'yalova': '77000', 'yozgat': '66000',
    'zonguldak': '67000'
};

/**
 * İl ve ilçe adına göre posta kodu döndürür
 * @param {string} il - İl adı
 * @param {string} ilce - İlçe adı
 * @returns {string} Posta kodu
 */
function getPostalCode(il, ilce) {
    if (!il || !ilce) return '00000';
    
    // Türkçe karakterleri temizle ve küçük harfe çevir
    function normalizeText(text) {
        return text.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    }
    
    var ilKey = normalizeText(il);
    var ilceKey = normalizeText(ilce);
    
    // İlçe posta kodu varsa döndür
    if (PostaKodlari[ilKey] && PostaKodlari[ilKey][ilceKey]) {
        return PostaKodlari[ilKey][ilceKey];
    }
    
    // İlçe bulunamazsa il merkez kodu döndür
    return ilMerkezKodlari[ilKey] || '00000';
}

console.log('📮 Posta Kodları sistemi yüklendi! (Gerçek verilerle)');