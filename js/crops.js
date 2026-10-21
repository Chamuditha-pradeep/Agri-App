/* Crop encyclopedia. Each text field is [Sinhala, Tamil, English].
   Add a crop = add one object. `zones` = zones where it is well suited (WET / INT / DRY).
   Keep chemical advice general: follow Dept. of Agriculture recommendations & product label. */
const AGRI_CROPS = [
  {
    id: 'paddy', icon: '🌾', zones: ['WET', 'INT', 'DRY'],
    name: ['වී', 'நெல்', 'Rice (Paddy)'],
    season: ['මහ සහ යල කන්න', 'மகா, யால போகங்கள்', 'Maha & Yala seasons'],
    grow: [
      'මහ (ඔක්තෝබර්–මාර්තු) සහ යල (අප්‍රේල්–සැප්තැම්බර්) කන්න වල වගා කරන්න. කුඹුර සමතලා කර මඩ කර, ඔබේ කලාපයට නිර්දේශිත සහතික කළ බීජ වර්ගයක් යොදා, තුනී ජල ස්ථරයක් පවත්වන්න; ජලය ඉතිරි කිරීමට විටින් විට වියළමින් තෙත් කරන්න.',
      'மகா (அக்-மார்) மற்றும் யால (ஏப்-செப்) போகங்களில் பயிரிடவும். வயலை சமப்படுத்தி சேறாக்கி, உங்கள் வலயத்துக்குப் பரிந்துரைக்கப்பட்ட சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்தி, மெல்லிய நீர்மட்டத்தை பராமரிக்கவும்; மாறி மாறி நனைத்து உலர்த்துவது நீரை சேமிக்கும்.',
      'Grow in Maha (Oct–Mar) and Yala (Apr–Sep). Level and puddle the field, use certified seed of a variety recommended for your zone, and keep a thin water layer; alternate wetting and drying saves water.'
    ],
    fertChem: [
      'ඔබේ කලාපයට වී පර්යේෂණ ආයතනයේ නිර්දේශය අනුගමනය කරන්න: රෝපණයේදී පොස්පේට් සහ පොටෑෂ්, නයිට්‍රජන් (යූරියා) කොටස් 3 කින් (මූලික, අංකුර, මල් පිපෙන අවස්ථාව). අධික නයිට්‍රජන් වළකින්න.',
      'உங்கள் வலயத்துக்கான நெல் ஆராய்ச்சி நிறுவன பரிந்துரையைப் பின்பற்றவும்: நடவின் போது பாஸ்பேட் மற்றும் பொட்டாஷ், நைட்ரஜன் (யூரியா) 3 பிரிவுகளாக (அடி உரம், தூர்கட்டல், கதிர் உருவாகும் நிலை). அதிக நைட்ரஜனைத் தவிர்க்கவும்.',
      'Follow the Rice Research Institute recommendation for your zone: phosphate and potash at planting, nitrogen (urea) in 3 splits (basal, tillering, panicle initiation). Avoid excess nitrogen.'
    ],
    fertOrg: [
      'ඉඩම් සකස් කිරීමට පෙර කොම්පෝස්ට් හෝ ගොම පොහොර යොදන්න, වී පිදුරු පස හා මිශ්‍ර කරන්න, රසායනික අවශ්‍යතාව අඩු කිරීමට ග්ලිරිසීඩියා වැනි හරිත පොහොර යොදන්න.',
      'நில தயாரிப்புக்கு முன் கம்போஸ்ட் அல்லது மாட்டு எரு இடவும், வைக்கோலை மண்ணுடன் கலக்கவும், இரசாயனத் தேவையைக் குறைக்க கிளிரிசீடியா போன்ற பசுந்தாள் உரம் பயன்படுத்தவும்.',
      'Apply compost or cow dung before land preparation, incorporate rice straw, and grow green manure (e.g. gliricidia leaves) to cut chemical needs.'
    ],
    pestChem: [
      'ප්‍රධාන තර්ජන: කඳ විදින පණුවා, දුඹුරු පැල කීතයා, ගෝල් මිජ්, වී පිපිරුම (බ්ලාස්ට්) සහ කොපු අංගමාරය. පලිබෝධ සීමාව ඉක්මවූ විට පමණක්, කෘෂිකර්ම දෙපාර්තමේන්තුවේ ලියාපදිංචි ද්‍රව්‍ය ලේබල් මාත්‍රාවෙන් යොදන්න.',
      'முக்கிய அச்சுறுத்தல்கள்: தண்டு துளைப்பான், பழுப்புத் தத்துப்பூச்சி, கால் மிட்ஜ், குலை நோய், உறை கருகல். பீடை எல்லை மட்டத்தை அடைந்தபோது மட்டும், திணைக்களத்தில் பதிவு செய்யப்பட்ட பொருட்களை லேபிள் அளவில் தெளிக்கவும்.',
      'Main threats: stem borer, brown planthopper, gall midge, blast and sheath blight. Spray only when the pest threshold is reached, using Department-registered products at label rates.'
    ],
    pestOrg: [
      'ප්‍රතිරෝධී වර්ග යොදන්න, අසල්වැසි ගොවීන් සමඟ එකවර වගා කරන්න, ඉවුරු වල් නැතිව තබන්න, ආලෝක උගුල් භාවිතා කරන්න, කොහොඹ ඇට සාරය ඉසින්න; මකුළුවන් වැනි ස්වාභාවික සතුරන් ආරක්ෂා කරන්න.',
      'எதிர்ப்புத்திறன் உள்ள இனங்கள், அயலவர்களுடன் ஒரே நேர நடவு, வரப்புகளை களையின்றி வைத்தல், ஒளிப்பொறிகள், வேப்பங்கொட்டை சாறு தெளித்தல்; சிலந்தி போன்ற இயற்கை எதிரிகளைப் பாதுகாக்கவும்.',
      'Use resistant varieties, synchronise planting with neighbours, keep bunds weed-free, use light traps and spray neem seed kernel extract; protect natural enemies such as spiders.'
    ],
    care: [
      'පළමු සති 3 තුළ වල් මරන්න, අංකුර හා මල් පිපෙන කාලයේ තුනී ජල ස්ථරයක් තබන්න, අස්වැන්නට දින 10ක් පමණ පෙර ජලය බැස්සවන්න.',
      'முதல் 3 வாரங்களுக்குள் களை எடுக்கவும், தூர்கட்டல் மற்றும் பூக்கும் காலத்தில் மெல்லிய நீரை வைத்திருக்கவும், அறுவடைக்கு சுமார் 10 நாட்களுக்கு முன் நீரை வடிக்கவும்.',
      'Weed within the first 3 weeks, keep a thin water layer through tillering and flowering, and drain the field about 10 days before harvest.'
    ],
    harvest: [
      'ධාන්‍ය 80–85% ක් පිදුරු කහ පැහැයට හැරුණු විට (මල් පිපී දින 30ක් පමණ) නෙලන්න. ගබඩා කිරීමට පෙර වී තෙතමනය 12–14% දක්වා වියළන්න.',
      'தானியங்களில் 80–85% வைக்கோல் மஞ்சள் நிறமானதும் (பூத்து சுமார் 30 நாட்களில்) அறுவடை செய்யவும். சேமிக்கும் முன் நெல்லை 12–14% ஈரப்பதம் வரை உலர்த்தவும்.',
      'Harvest when about 80–85% of grains turn straw-yellow (roughly 30 days after flowering). Dry the paddy to 12–14% moisture before storage.'
    ]
  }
];