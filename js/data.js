/* Builds `sriLankaData` (flat rows: Province_/District_/DS_ in Sinhala, Tamil, English).
   DS_* here = local authority (පළාත් පාලන ආයතනය). To add a district, add its list to AUTH below.
   Entry format: [type, SinhalaName, TamilName, EnglishName]  (type word is added automatically) */
const sriLankaData = (() => {
  const TYPE = {
    MC: ['මහ නගර සභාව', 'மாநகர சபை', 'Municipal Council'],
    UC: ['නගර සභාව', 'நகர சபை', 'Urban Council'],
    PS: ['ප්‍රාදේශීය සභාව', 'பிரதேச சபை', 'Pradeshiya Sabha']
  };

  const PROVINCES = {
    W: ['බස්නාහිර පළාත', 'மேல் மாகாணம்', 'Western Province'],
    C: ['මධ්‍යම පළාත', 'மத்திய மாகாணம்', 'Central Province'],
    S: ['දකුණු පළාත', 'தென் மாகாணம்', 'Southern Province'],
    N: ['උතුරු පළාත', 'வட மாகாணம்', 'Northern Province'],
    E: ['නැගෙනහිර පළාත', 'கிழக்கு மாகாணம்', 'Eastern Province'],
    NW: ['වයඹ පළාත', 'வட மேல் மாகாணம்', 'North Western Province'],
    NC: ['උතුරු මැද පළාත', 'வட மத்திய மாகாணம்', 'North Central Province'],
    U: ['ඌව පළාත', 'ஊவா மாகாணம்', 'Uva Province'],
    SG: ['සබරගමුව පළාත', 'சப்ரகமுவ மாகாணம்', 'Sabaragamuwa Province']
  };

  const DISTRICTS = [
    ['W', 'කොළඹ', 'கொழும்பு', 'Colombo'],
    ['W', 'ගම්පහ', 'கம்பஹா', 'Gampaha'],
    ['W', 'කළුතර', 'களுத்துறை', 'Kalutara'],
    ['C', 'මහනුවර', 'கண்டி', 'Kandy'],
    ['C', 'මාතලේ', 'மாத்தளை', 'Matale'],
    ['C', 'නුවරඑළිය', 'நுவரெலியா', 'Nuwara Eliya'],
    ['S', 'ගාල්ල', 'காலி', 'Galle'],
    ['S', 'මාතර', 'மாத்தறை', 'Matara'],
    ['S', 'හම්බන්තොට', 'அம்பாந்தோட்டை', 'Hambantota'],
    ['N', 'යාපනය', 'யாழ்ப்பாணம்', 'Jaffna'],
    ['N', 'කිළිනොච්චිය', 'கிளிநொச்சி', 'Kilinochchi'],
    ['N', 'මන්නාරම', 'மன்னார்', 'Mannar'],
    ['N', 'වවුනියාව', 'வவுனியா', 'Vavuniya'],
    ['N', 'මුලතිව්', 'முல்லைத்தீவு', 'Mullaitivu'],
    ['E', 'මඩකලපුව', 'மட்டக்களப்பு', 'Batticaloa'],
    ['E', 'අම්පාර', 'அம்பாறை', 'Ampara'],
    ['E', 'ත්‍රිකුණාමලය', 'திருகோணமலை', 'Trincomalee'],
    ['NW', 'කුරුණෑගල', 'குருநாகல்', 'Kurunegala'],
    ['NW', 'පුත්තලම', 'புத்தளம்', 'Puttalam'],
    ['NC', 'අනුරාධපුර', 'அனுராதபுரம்', 'Anuradhapura'],
    ['NC', 'පොළොන්නරුව', 'பொலன்னறுவை', 'Polonnaruwa'],
    ['U', 'බදුල්ල', 'பதுளை', 'Badulla'],
    ['U', 'මොණරාගල', 'மொணராகலை', 'Monaragala'],
    ['SG', 'රත්නපුර', 'இரத்தினபுரி', 'Ratnapura'],
    ['SG', 'කෑගල්ල', 'கேகாலை', 'Kegalle']
  ];

  // Key = English district name. Districts not listed yet show a "coming soon" note in the app.
  const AUTH = {
    Colombo: [
      ['MC', 'කොළඹ', 'கொழும்பு', 'Colombo'],
      ['MC', 'දෙහිවල - ගල්කිස්ස', 'தெஹிவளை - கல்கிசை', 'Dehiwala - Mount Lavinia'],
      ['MC', 'ශ්‍රී ජයවර්ධනපුර කෝට්ටේ', 'ஸ்ரீ ஜயவர்தனபுர கோட்டே', 'Sri Jayawardenepura Kotte'],
      ['MC', 'කඩුවෙල', 'கடுவெல', 'Kaduwela'],
      ['MC', 'මොරටුව', 'மொறட்டுவை', 'Moratuwa'],
      ['UC', 'කොලොන්නාව', 'கொலன்னாவ', 'Kolonnawa'],
      ['UC', 'සීතාවකපුර', 'சீதாவக்கபுர', 'Seethawakapura'],
      ['UC', 'මහරගම', 'மஹரகம', 'Maharagama'],
      ['UC', 'කැස්බෑව', 'கெஸ்பேவ', 'Kesbewa'],
      ['UC', 'බොරලැස්ගමුව', 'பொரலஸ்கமுவ', 'Boralesgamuwa'],
      ['PS', 'කොටිකාවත්ත - මුල්ලේරියාව', 'கொட்டிகாவத்தை - முல்லேரியா', 'Kotikawatta - Mulleriyawa'],
      ['PS', 'සීතාවක', 'சீதாவக்க', 'Seethawaka'],
      ['PS', 'හෝමාගම', 'ஹோமாகம', 'Homagama']
    ],
    Gampaha: [
      ['MC', 'මීගමුව', 'நீர்கொழும்பு', 'Negombo'],
      ['MC', 'ගම්පහ', 'கம்பஹா', 'Gampaha'],
      ['UC', 'වත්තල - මාබෝල', 'வத்தளை - மாபோல', 'Wattala - Mabola'],
      ['UC', 'කටුනායක - සීදුව', 'கட்டுநாயக்க - சீதுவ', 'Katunayake - Seeduwa'],
      ['UC', 'මිනුවන්ගොඩ', 'மினுவாங்கொடை', 'Minuwangoda'],
      ['UC', 'ජා-ඇල', 'ஜா-எல', 'Ja-Ela'],
      ['UC', 'පෑලියගොඩ', 'பேலியகொடை', 'Peliyagoda'],
      ['PS', 'ගම්පහ', 'கம்பஹா', 'Gampaha'],
      ['PS', 'වත්තල', 'வத்தளை', 'Wattala'],
      ['PS', 'මිනුවන්ගොඩ', 'மினுவாங்கொடை', 'Minuwangoda'],
      ['PS', 'ජා-ඇල', 'ஜா-எல', 'Ja-Ela'],
      ['PS', 'කැලණිය', 'களனி', 'Kelaniya'],
      ['PS', 'මහර', 'மஹர', 'Mahara'],
      ['PS', 'දොම්පේ', 'தொம்பே', 'Dompe'],
      ['PS', 'බියගම', 'பியகம', 'Biyagama'],
      ['PS', 'මීරිගම', 'மீரிகம', 'Meerigama'],
      ['PS', 'අත්තනගල්ල', 'அத்தனகல்ல', 'Attanagalla'],
      ['PS', 'දිවුලපිටිය', 'திவுலபிட்டிய', 'Divulapitiya'],
      ['PS', 'කටාන', 'கட்டான', 'Katana']
    ],
    Kalutara: [
      ['MC', 'කළුතර', 'களுத்துறை', 'Kalutara'],
      ['UC', 'පානදුර', 'பாணந்துறை', 'Panadura'],
      ['UC', 'හොරණ', 'ஹொரண', 'Horana'],
      ['UC', 'බේරුවල', 'பேருவளை', 'Beruwala'],
      ['PS', 'කළුතර', 'களுத்துறை', 'Kalutara'],
      ['PS', 'පානදුර', 'பாணந்துறை', 'Panadura'],
      ['PS', 'බණ්ඩාරගම', 'பண்டாரகம', 'Bandaragama'],
      ['PS', 'හොරණ', 'ஹொரண', 'Horana'],
      ['PS', 'මදුරාවල', 'மதுராவல', 'Madurawala'],
      ['PS', 'බුලත්සිංහල', 'புலத்சிங்கள', 'Bulathsinhala'],
      ['PS', 'මතුගම', 'மத்துகம', 'Mathugama'],
      ['PS', 'අගලවත්ත', 'அகலவத்தை', 'Agalawatta'],
      ['PS', 'පාලින්දනුවර', 'பாலிந்தநுவர', 'Palindanuwara'],
      ['PS', 'වල්ලාවිට', 'வலல்லாவிட்ட', 'Walallawita'],
      ['PS', 'බේරුවල', 'பேருவளை', 'Beruwala'],
      ['PS', 'දොඩංගොඩ', 'தொடங்கொட', 'Dodangoda']
    ],
    Kandy: [
      ['MC', 'මහනුවර', 'கண்டி', 'Kandy'],
      ['UC', 'ගම්පොල', 'கம்பளை', 'Gampola'],
      ['UC', 'නාවලපිටිය', 'நாவலப்பிட்டி', 'Nawalapitiya'],
      ['UC', 'කඩුගන්නාව', 'கடுகண்ணாவ', 'Kadugannawa'],
      ['PS', 'මහනුවර (කඩවත් සතර සහ ගඟවට කෝරළේ)', 'கண்டி (கடவத் சதர மற்றும் கங்கவட்ட கோரளை)', 'Kandy (Kadawath Satara & Gangawata Korale)'],
      ['PS', 'අකුරණ', 'அக்குறணை', 'Akurana'],
      ['PS', 'හාරිස්පත්තුව', 'ஹரிஸ்பத்துவ', 'Harispattuwa'],
      ['PS', 'පූජාපිටිය', 'பூஜாபிட்டிய', 'Poojapitiya'],
      ['PS', 'තුම්පනේ', 'தும்பனை', 'Thumpane'],
      ['PS', 'පාතදුම්බර', 'பாத்ததும்பர', 'Pathadumbara'],
      ['PS', 'උඩුදුම්බර', 'உடதும்பர', 'Udadumbara'],
      ['PS', 'මැද්දුම්බර', 'மெததும்பர', 'Meddumbara'],
      ['PS', 'කුණ්ඩසාලේ', 'குண்டசாலை', 'Kundasale'],
      ['PS', 'පාතහේවාහැට', 'பாதஹேவாஹெட்ட', 'Pathahewaheta'],
      ['PS', 'මිනීපේ', 'மினிப்பே', 'Minipe'],
      ['PS', 'උඩුනුවර', 'உடுநுவர', 'Udunuwara'],
      ['PS', 'යටිනුවර', 'யட்டிநுவர', 'Yatinuwara'],
      ['PS', 'උඩපළාත', 'உடபலாத்த', 'Udapalatha'],
      ['PS', 'ගඟඉහළ කෝරළේ', 'கங்கை இஹல கோரளை', 'Gangaihala Korale'],
      ['PS', 'පස්බාගේ කෝරළේ', 'பஸ்பாகே கோரளை', 'Pasbage Korale'],
      ['PS', 'පන්විල', 'பன்விலை', 'Panwila'],
      ['PS', 'වත්තේගම', 'வத்தேகம', 'Wattegama'],
      ['PS', 'දොලුව', 'தொலுவ', 'Doluwa']
    ],
    Matale: [
      ['MC', 'මාතලේ', 'மாத்தளை', 'Matale'],
      ['MC', 'දඹුල්ල', 'தம்புள்ளை', 'Dambulla'],
      ['PS', 'මාතලේ', 'மாத்தளை', 'Matale'],
      ['PS', 'යටවත්ත', 'யட்டவத்தை', 'Yatawatta'],
      ['PS', 'උකුවෙල', 'உக்குவளை', 'Ukuwela'],
      ['PS', 'රත්තොට', 'ரத்தோட்டை', 'Rattota'],
      ['PS', 'නාවුල', 'நாவுல', 'Naula'],
      ['PS', 'දඹුල්ල', 'தம்புள்ளை', 'Dambulla'],
      ['PS', 'පල්ලේපොල', 'பள்ளேபொல', 'Pallepola'],
      ['PS', 'අඹන්ගඟ කෝරළේ', 'அம்பன்கங்கை கோரளை', 'Ambanganga Korale'],
      ['PS', 'ගැලේවෙල', 'கலேவெல', 'Galewela'],
      ['PS', 'ලග්ගල පල්ලේගම', 'லக்கல பல்லேகம', 'Laggala Pallegama'],
      ['PS', 'විල්ගමුව', 'வில்கமுவ', 'Wilgamuwa']
    ],
    'Nuwara Eliya': [
      ['MC', 'නුවරඑළිය', 'நுவரெலியா', 'Nuwara Eliya'],
      ['UC', 'හැටන් - දික්ඔය', 'ஹட்டன் - டிக்கோயா', 'Hatton - Dickoya'],
      ['UC', 'තලවාකැලේ - ලින්දුල', 'தலவாக்கலை - லிந்துலை', 'Talawakele - Lindula'],
      ['PS', 'නුවරඑළිය', 'நுவரெலியா', 'Nuwara Eliya'],
      ['PS', 'කොත්මලේ', 'கொத்மலை', 'Kotmale'],
      ['PS', 'හඟුරන්කෙත', 'ஹங்குராங்கெத்த', 'Hanguranketha'],
      ['PS', 'වලපනේ', 'வலப்பனை', 'Walapane'],
      ['PS', 'අඹගමුව', 'அம்பகமுவ', 'Ambagamuwa'],
      ['PS', 'මස්කෙළිය', 'மஸ்கெலியா', 'Maskeliya'],
      ['PS', 'කොටගල', 'கொட்டகலை', 'Kotagala']
    ],
    Kegalle: [
      ['UC', 'කෑගල්ල', 'கேகாலை', 'Kegalle'],
      ['PS', 'කෑගල්ල', 'கேகாலை', 'Kegalle'],
      ['PS', 'මාවනැල්ල', 'மாவனல்லை', 'Mawanella'],
      ['PS', 'රඹුක්කන', 'ரம்புக்கனை', 'Rambukkana'],
      ['PS', 'වරකාපොළ', 'வரக்காபொல', 'Warakapola'],
      ['PS', 'රුවන්වැල්ල', 'ருவன்வெல்ல', 'Ruwanwella'],
      ['PS', 'දෙහිඕවිට', 'தெஹியோவிட்ட', 'Dehiowita'],
      ['PS', 'යටියන්තොට', 'யட்டியந்தோட்டை', 'Yatiyantota'],
      ['PS', 'අරණායක', 'அரநாயக்க', 'Aranayake'],
      ['PS', 'ගලිගමුව', 'கலிகமுவ', 'Galigamuwa'],
      ['PS', 'බුලත්කොහුපිටිය', 'புலத்கொஹுபிட்டிய', 'Bulathkohupitiya'],
      ['PS', 'දෑරණියගල', 'தெரணியகல', 'Deraniyagala']
    ],
    Galle: [
      ['MC', 'ගාල්ල', 'காலி', 'Galle'],
      ['UC', 'අම්බලන්ගොඩ', 'அம்பலாங்கொடை', 'Ambalangoda'],
      ['UC', 'හික්කඩුව', 'ஹிக்கடுவை', 'Hikkaduwa'],
      ['PS', 'අක්මීමණ', 'அக்மீமன', 'Akmeemana'],
      ['PS', 'අම්බලන්ගොඩ', 'அம்பலாங்கொடை', 'Ambalangoda'],
      ['PS', 'බද්දේගම', 'பத்தேகம', 'Baddegama'],
      ['PS', 'බලපිටිය', 'பலப்பிட்டிய', 'Balapitiya'],
      ['PS', 'බෙන්තොට', 'பெந்தோட்டை', 'Bentota'],
      ['PS', 'බෝපේ - පෝද්දල', 'போப்பே - பொத்தல', 'Bope - Poddala'],
      ['PS', 'ඇල්පිටිය', 'எல்பிட்டிய', 'Elpitiya'],
      ['PS', 'හබරාදුව', 'ஹபராதுவ', 'Habaraduwa'],
      ['PS', 'ඉමදුව', 'இமதுவ', 'Imaduwa'],
      ['PS', 'කරන්දෙණිය', 'கரந்தெனிய', 'Karandeniya'],
      ['PS', 'නාගොඩ', 'நாகொட', 'Nagoda'],
      ['PS', 'නෙළුව', 'நெலுவ', 'Neluwa'],
      ['PS', 'නියාගම', 'நியாகம', 'Niyagama'],
      ['PS', 'රත්ගම', 'ரத்கம', 'Rathgama'],
      ['PS', 'තවලම', 'தவளம', 'Thawalama'],
      ['PS', 'වැලිවිටිය - දිවිතුර', 'வெலிவிட்டிய - திவித்துர', 'Welivitiya - Divithura'],
      ['PS', 'යක්කලමුල්ල', 'யக்கலமுல்ல', 'Yakkalamulla']
    ],
    Matara: [
      ['MC', 'මාතර', 'மாத்தறை', 'Matara'],
      ['UC', 'වැලිගම', 'வெலிகம', 'Weligama'],
      ['PS', 'මාතර', 'மாத்தறை', 'Matara'],
      ['PS', 'වැලිගම', 'வெலிகம', 'Weligama'],
      ['PS', 'අකුරැස්ස', 'அகுரஸ்ஸ', 'Akuressa'],
      ['PS', 'කඹුරුපිටිය', 'கம்புருபிட்டிய', 'Kamburupitiya'],
      ['PS', 'දවිනුවර', 'தேவிநுவர', 'Devinuwara'],
      ['PS', 'දික්වැල්ල', 'திக்வெல்ல', 'Dikwella'],
      ['PS', 'හක්මන', 'ஹக்மன', 'Hakmana'],
      ['PS', 'මුලටියන', 'முலட்டியன', 'Mulatiyana'],
      ['PS', 'පස්ගොඩ', 'பஸ்கொட', 'Pasgoda'],
      ['PS', 'අතුරලිය', 'அதுரலிய', 'Athuraliya'],
      ['PS', 'මාලිම්බඩ', 'மாலிம்பட', 'Malimbada'],
      ['PS', 'තිහගොඩ', 'திஹகொட', 'Thihagoda'],
      ['PS', 'මොරවක', 'மொரவக்க', 'Morawaka'],
      ['PS', 'කොටපොල', 'கொட்டபொல', 'Kotapola'],
      ['PS', 'පිටබැද්දර', 'பிடபெத்தர', 'Pitabeddara']
    ],
    Kurunegala: [
      ['MC', 'කුරුණෑගල', 'குருநாகல்', 'Kurunegala'],
      ['UC', 'කුලියාපිටිය', 'குளியாப்பிட்டிய', 'Kuliyapitiya'],
      ['PS', 'කුරුණෑගල', 'குருநாகல்', 'Kurunegala'],
      ['PS', 'කුලියාපිටිය', 'குளியாப்பிட்டிய', 'Kuliyapitiya'],
      ['PS', 'පොල්ගහවෙල', 'பொல்கஹவெல', 'Polgahawela'],
      ['PS', 'වාරියපොල', 'வாரியபொல', 'Wariyapola'],
      ['PS', 'නිකවැරටිය', 'நிக்கவெரட்டிய', 'Nikaweratiya'],
      ['PS', 'රිදීගම', 'ரிதீகம', 'Ridigama'],
      ['PS', 'මහව', 'மஹவ', 'Mahawa'],
      ['PS', 'ඉබ්බාගමුව', 'இப்பாகமுவ', 'Ibbagamuwa'],
      ['PS', 'පඬුවස්නුවර', 'பண்டுவஸ்நுவர', 'Panduwasnuwara'],
      ['PS', 'ගල්ගමුව', 'கல்கமுவ', 'Galgamuwa'],
      ['PS', 'ගිරිබාව', 'கிரிபாவ', 'Giribawa'],
      ['PS', 'බිංගිරිය', 'பிங்கிரிய', 'Bingiriya'],
      ['PS', 'පන්නල', 'பன்னல', 'Pannala'],
      ['PS', 'නාරම්මල', 'நாரம்மல', 'Narammala'],
      ['PS', 'අලව්ව', 'அலவ்வ', 'Alawwa'],
      ['PS', 'මාවතගම', 'மாவத்தகம', 'Mawathagama'],
      ['PS', 'පොල්පිතිගම', 'பொல்பிதிகம', 'Polpithigama'],
      ['PS', 'උඩුබද්දාව', 'உடுபத்தாவ', 'Udubaddawa'],
      ['PS', 'කොටවෙහෙර', 'கொட்டவெஹெர', 'Kotawehera']
    ],
    Puttalam: [
      ['UC', 'හලාවත', 'சிலாபம்', 'Chilaw'],
      ['UC', 'පුත්තලම', 'புத்தளம்', 'Puttalam'],
      ['PS', 'හලාවත', 'சிலாபம்', 'Chilaw'],
      ['PS', 'පුත්තලම', 'புத்தளம்', 'Puttalam'],
      ['PS', 'කල්පිටිය', 'கல்பிட்டி', 'Kalpitiya'],
      ['PS', 'ආණමඩුව', 'ஆனமடுவ', 'Anamaduwa'],
      ['PS', 'නාත්තන්ඩිය', 'நாத்தாண்டிய', 'Nattandiya'],
      ['PS', 'වෙන්නප්පුව', 'வென்னப்புவ', 'Wennappuwa'],
      ['PS', 'ආරච්චිකට්ටුව', 'ஆரச்சிக்கட்டுவ', 'Arachchikattuwa'],
      ['PS', 'මාදම්පේ', 'மாதம்பை', 'Madampe'],
      ['PS', 'කරුවලගස්වැව', 'கருவலகஸ்வெவ', 'Karuwalagaswewa'],
      ['PS', 'නවගත්තේගම', 'நவகத்தேகம', 'Navagaththegama']
    ],
    Anuradhapura: [
      ['MC', 'අනුරාධපුර', 'அனுராதபுரம்', 'Anuradhapura'],
      ['PS', 'නුවරගම් පළාත මධ්‍යම', 'நுவரகம் பலாத மத்தி', 'Nuwaragam Palatha Central'],
      ['PS', 'නුවරගම් පළාත නැඟෙනහිර', 'நுவரகம் பலாத கிழக்கு', 'Nuwaragam Palatha East'],
      ['PS', 'රඹෑව', 'ரம்பேவ', 'Rambewa'],
      ['PS', 'මිහින්තලේ', 'மிஹிந்தலை', 'Mihintale'],
      ['PS', 'නොච්චියාගම', 'நொச்சியாகம', 'Nochchiyagama'],
      ['PS', 'තඹුත්තේගම', 'தம்புத்தேகம', 'Thambuttegama'],
      ['PS', 'තලාව', 'தலாவ', 'Thalawa'],
      ['PS', 'රාජාංගනය', 'ராஜாங்கனை', 'Rajanganaya'],
      ['PS', 'ගල්නෑව', 'கல்னேவ', 'Galnewa'],
      ['PS', 'ඊපලෝගම', 'எப்பாவல', 'Eppawala'],
      ['PS', 'කැකිරාව', 'கெக்கிராவ', 'Kekirawa'],
      ['PS', 'තිරප්පනේ', 'திரப்பனை', 'Thirappane'],
      ['PS', 'පළූගස්වැව', 'பலுகஸ்வெவ', 'Palugaswewa'],
      ['PS', 'කහටගස්දිගිලිය', 'கஹடகஸ்திகிலிய', 'Kahatagasdigiliya'],
      ['PS', 'හොරොව්පොතාන', 'ஹொரொவ்பொத்தானை', 'Horowpothana'],
      ['PS', 'ගලෙන්බිඳුණුවැව', 'கலென்பிந்துனுவெவ', 'Galenbindunuwewa'],
      ['PS', 'මැදවච්චිය', 'மதவாச்சி', 'Medawachchiya'],
      ['PS', 'පදවිය', 'பதவிய', 'Padaviya']
    ],
    Polonnaruwa: [
      ['PS', 'පොළොන්නරුව', 'பொலன்னறுவை', 'Polonnaruwa'],
      ['PS', 'කඳුරුවෙල (තමන්කඩුව)', 'கந்தூருவெல (தமன்கடுவ)', 'Kandurawela (Thamankaduwa)'],
      ['PS', 'මැදිරිගිරිය', 'மெதிரிகிரிய', 'Medirigiriya'],
      ['PS', 'හිඟුරක්ගොඩ', 'ஹிங்குரக்கொட', 'Hingurakgoda'],
      ['PS', 'ඇලහැර', 'எலஹெர', 'Elahera'],
      ['PS', 'වැලිකන්ද', 'வெலிகந்த', 'Welikanda'],
      ['PS', 'දිඹුලාගල', 'திம்புலாகல', 'Dimbulagala']
    ],
    Monaragala: [
      ['PS', 'මොණරාගල', 'மொணராகலை', 'Monaragala'],
      ['PS', 'වැල්ලවාය', 'வெல்லவாய', 'Wellawaya'],
      ['PS', 'බුත්තල', 'புத்தல', 'Buttala'],
      ['PS', 'කතරගම', 'கதிர்காமம்', 'Kataragama'],
      ['PS', 'තණමල්විල', 'தணமல்வில', 'Thanamalwila'],
      ['PS', 'සියඹලාණ්ඩුව', 'சியம்பலாண்டுவ', 'Siyambalanduwa'],
      ['PS', 'මැදගම', 'மெதகம', 'Medagama'],
      ['PS', 'බිබිල', 'பிபிலை', 'Bibile'],
      ['PS', 'මඩුල්ල', 'மடுள்ள', 'Madulla'],
      ['PS', 'බදල්කුඹුර', 'பதல்கும்புர', 'Badalkumbura'],
      ['PS', 'සෙවනගල', 'செவனகல', 'Sevanagala']
    ]
  };

  const out = [];
  DISTRICTS.forEach(([p, ds, dt, de]) => {
    const P = PROVINCES[p];
    const base = {
      Province_Sinhala: P[0], Province_Tamil: P[1], Province_English: P[2],
      District_Sinhala: ds, District_Tamil: dt, District_English: de
    };
    const list = AUTH[de] || [];
    if (!list.length) out.push({ ...base, DS_Sinhala: '', DS_Tamil: '', DS_English: '', DS_Type: '' });
    list.forEach(([ty, s, t, e]) => out.push({
      ...base,
      DS_Sinhala: `${s} ${TYPE[ty][0]}`, DS_Tamil: `${t} ${TYPE[ty][1]}`, DS_English: `${e} ${TYPE[ty][2]}`,
      DS_Type: ty
    }));
  });
  return out;
})();