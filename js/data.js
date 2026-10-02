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

    kaluthara: [
     ['MC','කලුතර' , 'kaluthara'],
    ],


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