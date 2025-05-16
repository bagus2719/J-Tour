// src/data.jsx

// Daftar Kategori
export const CategoryList = [
  { id: 1, categoryName: 'Popular' },
  { id: 2, categoryName: 'Latest' },
  { id: 3, categoryName: 'Pantai' },
  { id: 4, categoryName: 'Pegunungan' },
  { id: 5, categoryName: 'Air Terjun' },
  { id: 6, categoryName: 'Budaya' },
];

// Daftar Destinasi Wisata
export const DestinationList = [
  {
    id: 1,
    name: 'Pantai Papuma',
    category: 'Pantai',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Sunset_papuma_beach.jpg',
    description: 'Pantai indah dengan pasir putih dan batu karang di Jember.',
    location: 'Wuluhan, Jember',
  },
  {
    id: 2,
    name: 'Air Terjun Tancak',
    category: 'Air Terjun',
    image: 'https://asset.kompas.com/crops/u6lHbbpGunVegubUBBnbKOricj4=/0x0:1000x667/1200x800/data/photo/2023/07/10/64ac00cec047a.jpg',
    description: 'Air terjun alami di kaki Gunung Argopuro.',
    location: 'Panti, Jember',
  },
  {
    id: 3,
    name: 'Gunung Argopuro',
    category: 'Pegunungan',
    image: 'https://picture.triptrus.com/image/2014/06/gunung-argopuro.jpeg',
    description: 'Gunung tertinggi di Jember, cocok untuk hiking dan camping.',
    location: 'Sumberjambe, Jember',
  },
  {
    id: 4,
    name: 'Pantai Watu Ulo',
    category: 'Pantai',
    image: 'https://asset.kompas.com/crops/eaHEPQTvw5OlzdNaTSyAYGYFT6U=/0x0:780x520/1200x800/data/photo/2019/02/11/883445281.jpg',
    description: 'Pantai unik dengan batu memanjang menyerupai ular.',
    location: 'Ambulu, Jember',
  },
];

// Daftar Berita Pariwisata
export const NewsList = [
  {
    id: 1,
    title: 'Festival Gandrung Sewu Siap Digelar di Jember',
    category: 'Budaya',
    image: 'https://www.yukbanyuwangi.co.id/wp-content/uploads/2024/10/https___asset.kgnewsroom.com_photo_pre_2023_09_16_e64f6fe4-775f-4456-84a0-f96bde220adb_jpg-960x635.jpg',
    date: 'Mei 10, 2025',
    content: 'Pemerintah Jember akan kembali menggelar Festival Gandrung Sewu yang menampilkan ribuan penari di pesisir pantai.',
  },
  {
    id: 2,
    title: 'Peningkatan Kunjungan Wisata ke Papuma',
    category: 'Pantai',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    date: 'April 25, 2025',
    content: 'Jumlah kunjungan wisatawan ke Pantai Papuma meningkat 30% selama libur panjang kemarin.',
  },
  {
    id: 3,
    title: 'Perbaikan Jalan Menuju Air Terjun Tancak Dimulai',
    category: 'Air Terjun',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80',
    date: 'April 15, 2025',
    content: 'Pemerintah daerah mulai memperbaiki akses jalan menuju destinasi Air Terjun Tancak untuk meningkatkan kenyamanan wisatawan.',
  },
];
