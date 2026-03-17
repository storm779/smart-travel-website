-- ============================================================
-- UPDATE PACKAGE IMAGES
-- Adds 4-5 relevant images per package for better slideshow
-- Run in Supabase SQL Editor
-- ============================================================

-- Goa — beaches, churches, forts, nightlife, spice plantation
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
  'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg',
  'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg',
  'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
] WHERE destination = 'Goa';

-- Maharashtra — Mumbai skyline, Gateway of India, Ajanta caves
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
  'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg'
] WHERE destination = 'Maharashtra';

-- Tamil Nadu — temples, beaches, cultural
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
  'https://images.pexels.com/photos/15341378/pexels-photo-15341378.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg',
  'https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg'
] WHERE destination = 'Tamil Nadu';

-- West Bengal — Kolkata, Darjeeling, tea gardens, Victoria Memorial
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg',
  'https://images.pexels.com/photos/19980772/pexels-photo-19980772.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg'
] WHERE destination = 'West Bengal';

-- Gujarat — Rann of Kutch, temples, lions, stepwells
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/15905516/pexels-photo-15905516.jpeg',
  'https://images.pexels.com/photos/17881108/pexels-photo-17881108.jpeg',
  'https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg',
  'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'
] WHERE destination = 'Gujarat';

-- Himachal Pradesh — snow mountains, Shimla, Manali
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'
] WHERE destination = 'Himachal Pradesh';

-- Jammu & Kashmir — Dal Lake, houseboats, Gulmarg snow, Mughal gardens
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3889736/pexels-photo-3889736.jpeg',
  'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'
] WHERE destination = 'Jammu & Kashmir';

-- Rajasthan — forts, palaces, desert, camels
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
  'https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg'
] WHERE destination = 'Rajasthan';

-- Kerala — backwaters, houseboats, tea plantations, beaches
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg',
  'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
] WHERE destination = 'Kerala';

-- Ladakh — mountains, Pangong Lake, monasteries, passes
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'
] WHERE destination = 'Ladakh';

-- Uttarakhand — rivers, rafting, temples, mountains
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg'
] WHERE destination = 'Uttarakhand';

-- Varanasi — ghats, temples, Ganga aarti, boats
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg',
  'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg',
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg'
] WHERE destination = 'Varanasi';

-- ============================================================
-- INTERNATIONAL PACKAGES
-- ============================================================

-- Maldives — overwater villas, turquoise water, snorkeling, beach
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
  'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
] WHERE destination = 'Maldives';

-- Dubai — Burj Khalifa, desert, marina, skyline
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg',
  'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg',
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg'
] WHERE destination = 'Dubai';

-- Thailand — temples, beaches, floating market, nightlife
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg',
  'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg'
] WHERE destination = 'Thailand';

-- Singapore — Marina Bay, Gardens, cityscape, zoo
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg',
  'https://images.pexels.com/photos/2227828/pexels-photo-2227828.jpeg',
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg'
] WHERE destination = 'Singapore';

-- Bali — temples, rice terraces, beaches, culture
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg',
  'https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg'
] WHERE destination = 'Bali';

-- Switzerland — Alps, lakes, trains, snow peaks
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg',
  'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'
] WHERE destination = 'Switzerland';

-- Paris — Eiffel Tower, Louvre, Seine, cafes
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
  'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg',
  'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg',
  'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg'
] WHERE destination = 'Paris';

-- London — Big Ben, Tower Bridge, Palace, museums
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
  'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg',
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg',
  'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg'
] WHERE destination = 'London';

-- Nepal — mountains, temples, Pokhara lake, monasteries
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1124062/pexels-photo-1124062.jpeg',
  'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg'
] WHERE destination = 'Nepal';

-- Sri Lanka — temples, beaches, tea country, wildlife
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/934718/pexels-photo-934718.jpeg',
  'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg'
] WHERE destination = 'Sri Lanka';

-- ============================================================
-- NEW INDIAN STATE PACKAGES (from seed_indian_states.sql)
-- ============================================================

-- Karnataka — Mysore Palace, Hampi ruins, Coorg coffee, Gokarna beach
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'
] WHERE destination = 'Karnataka';

-- Punjab — Golden Temple, Wagah border, fields
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3520547/pexels-photo-3520547.jpeg',
  'https://images.pexels.com/photos/5765827/pexels-photo-5765827.jpeg',
  'https://images.pexels.com/photos/3821648/pexels-photo-3821648.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg'
] WHERE destination = 'Punjab';

-- Madhya Pradesh — tiger, Khajuraho, Sanchi Stupa
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg',
  'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg',
  'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg'
] WHERE destination = 'Madhya Pradesh';

-- Odisha — Sun Temple Konark, Jagannath, Chilika lake
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg',
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg'
] WHERE destination = 'Odisha';

-- Sikkim — Kanchenjunga, monasteries, Tsomgo Lake
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'
] WHERE destination = 'Sikkim';

-- Meghalaya — living root bridges, waterfalls, caves, Dawki
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg'
] WHERE destination = 'Meghalaya';

-- Assam — tea gardens, rhino, Brahmaputra, Majuli
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg',
  'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg',
  'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'
] WHERE destination = 'Assam';

-- Andaman — clear water, beach, coral, cellular jail
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg',
  'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg',
  'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
] WHERE destination = 'Andaman';

-- Telangana — Charminar, Golconda, Ramoji, Hyderabad
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
  'https://images.pexels.com/photos/2765872/pexels-photo-2765872.jpeg',
  'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg'
] WHERE destination = 'Telangana';

-- Andhra Pradesh — Tirupati temple, Araku, beaches
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg',
  'https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg',
  'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg'
] WHERE destination = 'Andhra Pradesh';

-- Chhattisgarh — waterfalls, tribal, forests
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg',
  'https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'
] WHERE destination = 'Chhattisgarh';

-- Jharkhand — waterfalls, hills, wildlife
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg',
  'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'
] WHERE destination = 'Jharkhand';

-- Bihar — Bodh Gaya, Nalanda, Buddhist heritage
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg',
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
  'https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/6064258/pexels-photo-6064258.jpeg'
] WHERE destination = 'Bihar';

-- Arunachal Pradesh — Tawang monastery, Sela Pass, mountains
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/1118877/pexels-photo-1118877.jpeg'
] WHERE destination = 'Arunachal Pradesh';

-- Nagaland — tribal, hornbill, valleys
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/4577791/pexels-photo-4577791.jpeg',
  'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'
] WHERE destination = 'Nagaland';

-- Mizoram — blue mountains, misty hills, lakes
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg'
] WHERE destination = 'Mizoram';

-- Tripura — palaces, water palace, rock carvings
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg',
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg'
] WHERE destination = 'Tripura';

-- Manipur — Loktak Lake, Kangla Fort, valleys
UPDATE packages SET images = ARRAY[
  'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
  'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
  'https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg',
  'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg',
  'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg'
] WHERE destination = 'Manipur';


-- ============================================================
-- DONE! All packages now have 4-5 images for slideshow.
-- ============================================================
