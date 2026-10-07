export interface ThailandProvince {
  id: string;
  name_th: string;
  name_en: string;
  region: 'north' | 'central' | 'northeast' | 'east' | 'south' | 'west';
  region_th: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const THAILAND_CENTER = {
  lat: 13.736717,
  lng: 100.523186,
  zoom: 6,
};

export const THAILAND_PROVINCES: ThailandProvince[] = [
  // ภาคกลาง
  { id: 'bangkok', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok', region: 'central', region_th: 'ภาคกลาง', lat: 13.7563, lng: 100.5018, zoom: 11 },
  { id: 'samutprakan', name_th: 'สมุทรปราการ', name_en: 'Samut Prakan', region: 'central', region_th: 'ภาคกลาง', lat: 13.5991, lng: 100.5998, zoom: 11 },
  { id: 'nonthaburi', name_th: 'นนทบุรี', name_en: 'Nonthaburi', region: 'central', region_th: 'ภาคกลาง', lat: 13.8621, lng: 100.5134, zoom: 11 },
  { id: 'pathumthani', name_th: 'ปทุมธานี', name_en: 'Pathum Thani', region: 'central', region_th: 'ภาคกลาง', lat: 14.0208, lng: 100.5250, zoom: 11 },
  { id: 'ayutthaya', name_th: 'พระนครศรีอยุธยา', name_en: 'Phra Nakhon Si Ayutthaya', region: 'central', region_th: 'ภาคกลาง', lat: 14.3532, lng: 100.5684, zoom: 11 },
  { id: 'angthong', name_th: 'อ่างทอง', name_en: 'Ang Thong', region: 'central', region_th: 'ภาคกลาง', lat: 14.5896, lng: 100.4551, zoom: 11 },
  { id: 'lopburi', name_th: 'ลพบุรี', name_en: 'Lop Buri', region: 'central', region_th: 'ภาคกลาง', lat: 14.7995, lng: 100.6534, zoom: 10 },
  { id: 'singburi', name_th: 'สิงห์บุรี', name_en: 'Sing Buri', region: 'central', region_th: 'ภาคกลาง', lat: 14.8936, lng: 100.4015, zoom: 11 },
  { id: 'chainat', name_th: 'ชัยนาท', name_en: 'Chai Nat', region: 'central', region_th: 'ภาคกลาง', lat: 15.1852, lng: 100.1252, zoom: 11 },
  { id: 'saraburi', name_th: 'สระบุรี', name_en: 'Saraburi', region: 'central', region_th: 'ภาคกลาง', lat: 14.5289, lng: 100.9101, zoom: 11 },
  { id: 'nakhonnayok', name_th: 'นครนายก', name_en: 'Nakhon Nayok', region: 'central', region_th: 'ภาคกลาง', lat: 14.2069, lng: 101.2131, zoom: 11 },
  { id: 'nakhonpathom', name_th: 'นครปฐม', name_en: 'Nakhon Pathom', region: 'central', region_th: 'ภาคกลาง', lat: 13.8196, lng: 100.0601, zoom: 11 },
  { id: 'samutsakhon', name_th: 'สมุทรสาคร', name_en: 'Samut Sakhon', region: 'central', region_th: 'ภาคกลาง', lat: 13.5475, lng: 100.2744, zoom: 11 },
  { id: 'samutsongkhram', name_th: 'สมุทรสงคราม', name_en: 'Samut Songkhram', region: 'central', region_th: 'ภาคกลาง', lat: 13.4098, lng: 99.9994, zoom: 11 },
  { id: 'suphanburi', name_th: 'สุพรรณบุรี', name_en: 'Suphan Buri', region: 'central', region_th: 'ภาคกลาง', lat: 14.4745, lng: 100.1177, zoom: 10 },
  { id: 'nakhonsawan', name_th: 'นครสวรรค์', name_en: 'Nakhon Sawan', region: 'central', region_th: 'ภาคกลาง', lat: 15.6987, lng: 100.1199, zoom: 10 },
  { id: 'uthaithani', name_th: 'อุทัยธานี', name_en: 'Uthai Thani', region: 'central', region_th: 'ภาคกลาง', lat: 15.3835, lng: 100.0246, zoom: 10 },
  { id: 'kamphaengphet', name_th: 'กำแพงเพชร', name_en: 'Kamphaeng Phet', region: 'central', region_th: 'ภาคกลาง', lat: 16.4828, lng: 99.5227, zoom: 10 },
  { id: 'phichit', name_th: 'พิจิตร', name_en: 'Phichit', region: 'central', region_th: 'ภาคกลาง', lat: 16.4419, lng: 100.3488, zoom: 10 },
  { id: 'phitsanulok', name_th: 'พิษณุโลก', name_en: 'Phitsanulok', region: 'central', region_th: 'ภาคกลาง', lat: 16.8211, lng: 100.2659, zoom: 10 },
  { id: 'sukhothai', name_th: 'สุโขทัย', name_en: 'Sukhothai', region: 'central', region_th: 'ภาคกลาง', lat: 17.0078, lng: 99.8234, zoom: 10 },
  { id: 'phetchabun', name_th: 'เพชรบูรณ์', name_en: 'Phetchabun', region: 'central', region_th: 'ภาคกลาง', lat: 16.4190, lng: 101.1566, zoom: 10 },

  // ภาคตะวันออก
  { id: 'prachinburi', name_th: 'ปราจีนบุรี', name_en: 'Prachin Buri', region: 'east', region_th: 'ภาคตะวันออก', lat: 14.0509, lng: 101.3716, zoom: 10 },
  { id: 'chachoengsao', name_th: 'ฉะเชิงเทรา', name_en: 'Chachoengsao', region: 'east', region_th: 'ภาคตะวันออก', lat: 13.6904, lng: 101.0779, zoom: 10 },
  { id: 'chonburi', name_th: 'ชลบุรี', name_en: 'Chon Buri', region: 'east', region_th: 'ภาคตะวันออก', lat: 13.3611, lng: 100.9847, zoom: 10 },
  { id: 'rayong', name_th: 'ระยอง', name_en: 'Rayong', region: 'east', region_th: 'ภาคตะวันออก', lat: 12.6814, lng: 101.2816, zoom: 10 },
  { id: 'chanthaburi', name_th: 'จันทบุรี', name_en: 'Chanthaburi', region: 'east', region_th: 'ภาคตะวันออก', lat: 12.6114, lng: 102.1039, zoom: 10 },
  { id: 'trat', name_th: 'ตราด', name_en: 'Trat', region: 'east', region_th: 'ภาคตะวันออก', lat: 12.2428, lng: 102.5175, zoom: 10 },
  { id: 'sakaeo', name_th: 'สระแก้ว', name_en: 'Sa Kaeo', region: 'east', region_th: 'ภาคตะวันออก', lat: 13.8140, lng: 102.0728, zoom: 10 },

  // ภาคเหนือ
  { id: 'chiangmai', name_th: 'เชียงใหม่', name_en: 'Chiang Mai', region: 'north', region_th: 'ภาคเหนือ', lat: 18.7883, lng: 98.9853, zoom: 10 },
  { id: 'chiangrai', name_th: 'เชียงราย', name_en: 'Chiang Rai', region: 'north', region_th: 'ภาคเหนือ', lat: 19.9105, lng: 99.8406, zoom: 10 },
  { id: 'lampang', name_th: 'ลำปาง', name_en: 'Lampang', region: 'north', region_th: 'ภาคเหนือ', lat: 18.2888, lng: 99.4928, zoom: 10 },
  { id: 'lamphun', name_th: 'ลำพูน', name_en: 'Lamphun', region: 'north', region_th: 'ภาคเหนือ', lat: 18.5745, lng: 99.0087, zoom: 10 },
  { id: 'maehongson', name_th: 'แม่ฮ่องสอน', name_en: 'Mae Hong Son', region: 'north', region_th: 'ภาคเหนือ', lat: 19.3021, lng: 97.9654, zoom: 10 },
  { id: 'nan', name_th: 'น่าน', name_en: 'Nan', region: 'north', region_th: 'ภาคเหนือ', lat: 18.7831, lng: 100.7782, zoom: 10 },
  { id: 'phayao', name_th: 'พะเยา', name_en: 'Phayao', region: 'north', region_th: 'ภาคเหนือ', lat: 19.1664, lng: 99.9022, zoom: 10 },
  { id: 'phrae', name_th: 'แพร่', name_en: 'Phrae', region: 'north', region_th: 'ภาคเหนือ', lat: 18.1446, lng: 100.1411, zoom: 10 },
  { id: 'uttaradit', name_th: 'อุตรดิตถ์', name_en: 'Uttaradit', region: 'north', region_th: 'ภาคเหนือ', lat: 17.6201, lng: 100.0993, zoom: 10 },

  // ภาคตะวันออกเฉียงเหนือ
  { id: 'nakhonratchasima', name_th: 'นครราชสีมา', name_en: 'Nakhon Ratchasima', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.9799, lng: 102.0978, zoom: 10 },
  { id: 'khonkaen', name_th: 'ขอนแก่น', name_en: 'Khon Kaen', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.4322, lng: 102.8236, zoom: 10 },
  { id: 'udonthani', name_th: 'อุดรธานี', name_en: 'Udon Thani', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4138, lng: 102.7872, zoom: 10 },
  { id: 'ubonratchathani', name_th: 'อุบลราชธานี', name_en: 'Ubon Ratchathani', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.2448, lng: 104.8473, zoom: 10 },
  { id: 'buriram', name_th: 'บุรีรัมย์', name_en: 'Buri Ram', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.9951, lng: 103.1029, zoom: 10 },
  { id: 'surin', name_th: 'สุรินทร์', name_en: 'Surin', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.8818, lng: 103.4936, zoom: 10 },
  { id: 'sisaket', name_th: 'ศรีสะเกษ', name_en: 'Si Sa Ket', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.1186, lng: 104.3220, zoom: 10 },
  { id: 'roiet', name_th: 'ร้อยเอ็ด', name_en: 'Roi Et', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.0538, lng: 103.6520, zoom: 10 },
  { id: 'kalasin', name_th: 'กาฬสินธุ์', name_en: 'Kalasin', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.4328, lng: 103.5064, zoom: 10 },
  { id: 'mahasarakham', name_th: 'มหาสารคาม', name_en: 'Maha Sarakham', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.1851, lng: 103.3007, zoom: 10 },
  { id: 'chaiyaphum', name_th: 'ชัยภูมิ', name_en: 'Chaiyaphum', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.8105, lng: 102.0288, zoom: 10 },
  { id: 'mukdahan', name_th: 'มุกดาหาร', name_en: 'Mukdahan', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.5424, lng: 104.7235, zoom: 10 },
  { id: 'yasothon', name_th: 'ยโสธร', name_en: 'Yasothon', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.7926, lng: 104.1451, zoom: 10 },
  { id: 'amnatcharoen', name_th: 'อำนาจเจริญ', name_en: 'Amnat Charoen', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.8585, lng: 104.6298, zoom: 10 },
  { id: 'buengkan', name_th: 'บึงกาฬ', name_en: 'Bueng Kan', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 18.3609, lng: 103.6465, zoom: 10 },
  { id: 'nongbualamphu', name_th: 'หนองบัวลำภู', name_en: 'Nong Bua Lam Phu', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.2044, lng: 102.4407, zoom: 10 },
  { id: 'nongkhai', name_th: 'หนองคาย', name_en: 'Nong Khai', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.8783, lng: 102.7420, zoom: 10 },
  { id: 'loei', name_th: 'เลย', name_en: 'Loei', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4860, lng: 101.7223, zoom: 10 },
  { id: 'sakonnakhon', name_th: 'สกลนคร', name_en: 'Sakon Nakhon', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.1546, lng: 104.1486, zoom: 10 },
  { id: 'nakhonphanom', name_th: 'นครพนม', name_en: 'Nakhon Phanom', region: 'northeast', region_th: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4084, lng: 104.7788, zoom: 10 },

  // ภาคใต้
  { id: 'songkhla', name_th: 'สงขลา', name_en: 'Songkhla', region: 'south', region_th: 'ภาคใต้', lat: 7.1756, lng: 100.6143, zoom: 10 },
  { id: 'phuket', name_th: 'ภูเก็ต', name_en: 'Phuket', region: 'south', region_th: 'ภาคใต้', lat: 7.8804, lng: 98.3923, zoom: 11 },
  { id: 'suratthani', name_th: 'สุราษฎร์ธานี', name_en: 'Surat Thani', region: 'south', region_th: 'ภาคใต้', lat: 9.1382, lng: 99.3217, zoom: 10 },
  { id: 'nakhonsithammarat', name_th: 'นครศรีธรรมราช', name_en: 'Nakhon Si Thammarat', region: 'south', region_th: 'ภาคใต้', lat: 8.4304, lng: 99.9631, zoom: 10 },
  { id: 'krabi', name_th: 'กระบี่', name_en: 'Krabi', region: 'south', region_th: 'ภาคใต้', lat: 8.0863, lng: 98.9063, zoom: 10 },
  { id: 'phangnga', name_th: 'พังงา', name_en: 'Phangnga', region: 'south', region_th: 'ภาคใต้', lat: 8.4501, lng: 98.5255, zoom: 10 },
  { id: 'trang', name_th: 'ตรัง', name_en: 'Trang', region: 'south', region_th: 'ภาคใต้', lat: 7.5563, lng: 99.6114, zoom: 10 },
  { id: 'phatthalung', name_th: 'พัทลุง', name_en: 'Phatthalung', region: 'south', region_th: 'ภาคใต้', lat: 7.6166, lng: 100.0740, zoom: 10 },
  { id: 'chumphon', name_th: 'ชุมพร', name_en: 'Chumphon', region: 'south', region_th: 'ภาคใต้', lat: 10.4930, lng: 99.1800, zoom: 10 },
  { id: 'ranong', name_th: 'ระนอง', name_en: 'Ranong', region: 'south', region_th: 'ภาคใต้', lat: 9.9658, lng: 98.6348, zoom: 10 },
  { id: 'satun', name_th: 'สตูล', name_en: 'Satun', region: 'south', region_th: 'ภาคใต้', lat: 6.6238, lng: 100.0674, zoom: 10 },
  { id: 'pattani', name_th: 'ปัตตานี', name_en: 'Pattani', region: 'south', region_th: 'ภาคใต้', lat: 6.8696, lng: 101.2501, zoom: 10 },
  { id: 'yala', name_th: 'ยะลา', name_en: 'Yala', region: 'south', region_th: 'ภาคใต้', lat: 6.5411, lng: 101.2804, zoom: 10 },
  { id: 'narathiwat', name_th: 'นราธิวาส', name_en: 'Narathiwat', region: 'south', region_th: 'ภาคใต้', lat: 6.4255, lng: 101.8253, zoom: 10 },

  // ภาคตะวันตก
  { id: 'kanchanaburi', name_th: 'กาญจนบุรี', name_en: 'Kanchanaburi', region: 'west', region_th: 'ภาคตะวันตก', lat: 14.0228, lng: 99.5328, zoom: 10 },
  { id: 'tak', name_th: 'ตาก', name_en: 'Tak', region: 'west', region_th: 'ภาคตะวันตก', lat: 16.8839, lng: 99.1258, zoom: 10 },
  { id: 'ratchaburi', name_th: 'ราชบุรี', name_en: 'Ratchaburi', region: 'west', region_th: 'ภาคตะวันตก', lat: 13.5283, lng: 99.8134, zoom: 10 },
  { id: 'phetchaburi', name_th: 'เพชรบุรี', name_en: 'Phetchaburi', region: 'west', region_th: 'ภาคตะวันตก', lat: 13.1114, lng: 99.9391, zoom: 10 },
  { id: 'prachuapkhirikhan', name_th: 'ประจวบคีรีขันธ์', name_en: 'Prachuap Khiri Khan', region: 'west', region_th: 'ภาคตะวันตก', lat: 11.8124, lng: 99.7972, zoom: 10 },
];

export const REGIONS_LIST = [
  { id: 'all', name_th: 'ทุกภาค (ทั่วประเทศ)' },
  { id: 'central', name_th: 'ภาคกลาง' },
  { id: 'north', name_th: 'ภาคเหนือ' },
  { id: 'northeast', name_th: 'ภาคตะวันออกเฉียงเหนือ (อีสาน)' },
  { id: 'east', name_th: 'ภาคตะวันออก' },
  { id: 'south', name_th: 'ภาคใต้' },
  { id: 'west', name_th: 'ภาคตะวันตก' },
];
