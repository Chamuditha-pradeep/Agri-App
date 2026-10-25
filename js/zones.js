/* District coordinates (for live weather) and agro-ecological zone (for soil guide + crop suitability).
   Zone is a district-level approximation: WET / INT (intermediate) / DRY. */
const AGRI_DISTRICTS = {
  'Colombo': [6.93, 79.86, 'WET'], 'Gampaha': [7.09, 79.99, 'WET'], 'Kalutara': [6.58, 79.96, 'WET'],
  'Kandy': [7.29, 80.63, 'WET'], 'Matale': [7.47, 80.62, 'INT'], 'Nuwara Eliya': [6.97, 80.77, 'WET'],
  'Galle': [6.05, 80.22, 'WET'], 'Matara': [5.95, 80.55, 'WET'], 'Hambantota': [6.12, 81.12, 'DRY'],
  'Jaffna': [9.66, 80.01, 'DRY'], 'Kilinochchi': [9.40, 80.40, 'DRY'], 'Mannar': [8.98, 79.91, 'DRY'],
  'Vavuniya': [8.75, 80.50, 'DRY'], 'Mullaitivu': [9.27, 80.81, 'DRY'], 'Batticaloa': [7.71, 81.69, 'DRY'],
  'Ampara': [7.30, 81.67, 'DRY'], 'Trincomalee': [8.57, 81.23, 'DRY'], 'Kurunegala': [7.49, 80.37, 'INT'],
  'Puttalam': [8.03, 79.83, 'DRY'], 'Anuradhapura': [8.31, 80.40, 'DRY'], 'Polonnaruwa': [7.94, 81.00, 'DRY'],
  'Badulla': [6.99, 81.06, 'INT'], 'Monaragala': [6.87, 81.35, 'DRY'], 'Ratnapura': [6.68, 80.40, 'WET'],
  'Kegalle': [7.25, 80.35, 'WET']
};

/* General guide per zone: [Sinhala, Tamil, English] */
const AGRI_ZONES = {
  WET: {
    name: ['තෙත් කලාපය', 'ஈர வலயம்', 'Wet zone'],
    soil: ['රතු-කහ පොඩ්සොලික් පස', 'சிவப்பு-மஞ்சள் பொட்சொலிக் மண்', 'Red-Yellow Podzolic'],
    color: ['රතු සිට කහ-දුඹුරු', 'சிவப்பு முதல் மஞ்சள்-பழுப்பு', 'Red to yellowish-brown'],
    ph: '4.5 – 5.5'
  },
  INT: {
    name: ['අතරමැදි කලාපය', 'இடைநிலை வலயம்', 'Intermediate zone'],
    soil: ['රතු-දුඹුරු ලැටොසොලික් සහ රතු-කහ මිශ්‍ර පස', 'சிவப்பு-பழுப்பு லாட்டசோலிக் மற்றும் சிவப்பு-மஞ்சள் கலவை மண்', 'Reddish-brown latosolic and red-yellow mixed soils'],
    color: ['රතු-දුඹුරු', 'சிவப்பு-பழுப்பு', 'Reddish brown'],
    ph: '5.5 – 6.5'
  },
  DRY: {
    name: ['වියළි කලාපය', 'உலர் வலயம்', 'Dry zone'],
    soil: ['රතු-දුඹුරු පස සහ පහත්බිම් අඳුරු පස', 'சிவப்பு-பழுப்பு மண் மற்றும் தாழ்நில கருமண்', 'Reddish Brown Earth and lowland dark Gley soils'],
    color: ['රතු-දුඹුරු සිට අඳුරු අළු', 'சிவப்பு-பழுப்பு முதல் கரும்சாம்பல்', 'Reddish brown to dark grey'],
    ph: '6.0 – 7.5'
  }
};
