/* Built-in crops (empty on purpose). Add crops with admin.html, then export data/crops.json.
   You can also add one by hand. Every text field is [Sinhala, Tamil, English]:
   { id:'tomato', icon:'🍅', zones:['WET','INT','DRY'], photo:'assets/images/tomato.jpg',
     name:[..], season:[..], grow:[..], fertChem:[..], fertOrg:[..], pestChem:[..], pestOrg:[..], care:[..], harvest:[..],
     medicines:[{ type:'chemical'|'organic'|'fertilizer', name:[..], use:[..], photo:'' }] } */
const AGRI_CROPS = [];
