// Daftar Kategori
export const CategoryList = [
  { id: 1, name: 'Popular' },
  { id: 2, name: 'Latest' },
  { id: 3, name: 'Pantai' },
  { id: 4, name: 'Gunung' },
  { id: 5, name: 'Kuliner' },
  { id: 6, name: 'Budaya' },
  { id: 7, name: 'Taman' },
  { id: 8, name: 'Acara' },
  { id: 9, name: 'Informasi' },
  { id: 10, name: 'Tips' },
  { id: 11, name: 'Promo' },
];

// Destination List
export const DestinationList = [
  {
    id: 1,
    name: 'Pantai Papuma',
    category: 'Pantai',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Sunset_papuma_beach.jpg',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Sunset_papuma_beach.jpg',
      'https://cdn.nativeindonesia.com/foto/pantai-papuma/pantai-papuma-jember.jpg',
      'https://ksmtour.com/media/images/articles14/pantai-papuma-jember.jpg'
    ],
    description: 'Pantai Papuma merupakan destinasi wisata populer di Jember yang dikenal dengan pasir putihnya yang bersih dan batu karang yang menjulang di tepi laut. Cocok untuk bersantai, menikmati sunset, dan aktivitas fotografi.',
    location: 'Wuluhan, Jember',
    rating: 4.8,
    facilities: [
      '🏖️ Pantai bersih',
      '🥥 Warung makanan',
      '🅿️ Parkir luas',
      '🧼 Kamar mandi umum',
    ],
    reviews: [
      {
        name: 'Ayu P.',
        comment: 'Tempatnya indah banget! Sunset-nya luar biasa dan cocok buat liburan keluarga.',
      },
      {
        name: 'Rudi S.',
        comment: 'Jalannya bagus, pantainya bersih, dan ada banyak spot foto keren.',
      },
    ],
    totalReviews: 2,
  },
  {
    id: 2,
    name: 'Air Terjun Tancak',
    category: 'Air Terjun',
    image: 'https://asset.kompas.com/crops/u6lHbbpGunVegubUBBnbKOricj4=/0x0:1000x667/1200x800/data/photo/2023/07/10/64ac00cec047a.jpg',
    images: [
      'https://asset.kompas.com/crops/u6lHbbpGunVegubUBBnbKOricj4=/0x0:1000x667/1200x800/data/photo/2023/07/10/64ac00cec047a.jpg',
      'https://i0.wp.com/travelspromo.com/wp-content/uploads/2020/03/Air-Terjun-Tancak-Jember.jpg',
      'https://ksmtour.com/media/images/articles15/air-terjun-tancak-jember.jpg'
    ],
    description: 'Air Terjun Tancak berada di kaki Gunung Argopuro dan memiliki ketinggian sekitar 82 meter. Tempat ini menyuguhkan suasana alami dan udara sejuk, cocok bagi pecinta petualangan dan alam.',
    location: 'Panti, Jember',
    rating: 4.6,
    facilities: [
      '🌲 Alam asri',
      '🚶 Trekking ringan',
      '🧺 Area piknik',
      '🧼 Kamar mandi seadanya',
    ],
    reviews: [
      {
        name: 'Dian K.',
        comment: 'Sangat alami dan sejuk, cocok buat yang suka petualangan.',
      },
      {
        name: 'Fajar L.',
        comment: 'Aksesnya mulai bagus, air terjunnya keren!',
      },
    ],
    totalReviews: 2,

  },
  {
    id: 3,
    name: 'Gunung Argopuro',
    category: 'Pegunungan',
    image: 'https://picture.triptrus.com/image/2014/06/gunung-argopuro.jpeg',
    images: [
      'https://picture.triptrus.com/image/2014/06/gunung-argopuro.jpeg',
      'https://cdn.nativeindonesia.com/foto/gunung-argopuro/gunung-argopuro.jpg',
      'https://ksmtour.com/media/images/articles13/gunung-argopuro.jpg'
    ],
    description: 'Gunung Argopuro merupakan salah satu gunung tertinggi di Jawa Timur. Memiliki jalur pendakian terpanjang di Pulau Jawa, gunung ini menyajikan pemandangan hutan, padang savana, dan situs sejarah.',
    location: 'Sumberjambe, Jember',
    rating: 4.7,
    facilities: [
      '⛺ Camping ground',
      '🚰 Sumber air alami',
      '🔥 Area api unggun',
      '🚻 Toilet darurat',
    ],
    reviews: [
      {
        name: 'Lia N.',
        comment: 'Pendakian cukup menantang tapi pemandangan luar biasa.',
      },
      {
        name: 'Dede M.',
        comment: 'Banyak spot keren untuk camping dan foto.',
      },
    ],
    totalReviews: 2,

  },
  {
    id: 4,
    name: 'Pantai Watu Ulo',
    category: 'Pantai',
    image: 'https://asset.kompas.com/crops/eaHEPQTvw5OlzdNaTSyAYGYFT6U=/0x0:780x520/1200x800/data/photo/2019/02/11/883445281.jpg',
    images: [
      'https://asset.kompas.com/crops/eaHEPQTvw5OlzdNaTSyAYGYFT6U=/0x0:780x520/1200x800/data/photo/2019/02/11/883445281.jpg',
      'https://ksmtour.com/media/images/articles15/pantai-watu-ulo.jpg',
      'https://cdn.nativeindonesia.com/foto/pantai-watu-ulo-jember.jpg'
    ],
    description: 'Pantai Watu Ulo memiliki ciri khas unik berupa batu karang memanjang menyerupai ular. Tempat ini menawarkan panorama laut yang luas dan cocok untuk berwisata bersama keluarga.',
    location: 'Ambulu, Jember',
    rating: 4.5,
    reviews: [
      {
        name: 'Sari M.',
        comment: 'Tempat wisata keluarga yang menyenangkan.',
      },
      {
        name: 'Yoga A.',
        comment: 'Banyak spot foto unik dan makanan enak di sekitar.',
      },
    ],
    totalReviews: 2,
    facilities: [
      '🌊 Ombak tenang',
      '🍢 Warung lokal',
      '🅿️ Area parkir besar',
      '🎏 Spot foto ikonik',
    ],
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
    content: `Pemerintah Jember akan kembali menggelar Festival Gandrung Sewu yang menampilkan ribuan penari di pesisir pantai. Festival ini menjadi salah satu event budaya terbesar di Jawa Timur yang rutin diadakan setiap tahun.

Festival ini menampilkan tarian tradisional Gandrung yang berasal dari masyarakat Banyuwangi dan Jember. Acara ini bertujuan melestarikan budaya lokal sekaligus menarik wisatawan dari dalam maupun luar negeri.

Selain pertunjukan tari, festival juga dilengkapi dengan bazar makanan khas, pameran kerajinan tangan, serta berbagai lomba seni dan budaya. Festival akan berlangsung selama lima hari dan diharapkan dapat meningkatkan perekonomian masyarakat sekitar.

Pemerintah daerah juga menyiapkan protokol kesehatan ketat untuk memastikan acara berjalan aman di tengah kondisi pandemi.`,
  },
  {
    id: 2,
    title: 'Peningkatan Kunjungan Wisata ke Papuma',
    category: 'Pantai',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    date: 'April 25, 2025',
    content: `Jumlah kunjungan wisatawan ke Pantai Papuma meningkat hingga 30% selama libur panjang kemarin. Peningkatan ini didukung oleh perbaikan fasilitas umum seperti area parkir yang lebih luas dan penambahan warung makanan.

Pantai Papuma dikenal dengan pasir putihnya yang bersih dan pemandangan sunset yang menawan. Banyak wisatawan menghabiskan waktu untuk berfoto di batu karang serta menikmati suasana pantai yang tenang.

Pengelola juga meningkatkan layanan kebersihan dan keamanan, serta menambah fasilitas kamar mandi umum yang nyaman. Pemerintah daerah berharap tren positif ini dapat terus berlanjut dan mendorong pengembangan wisata berkelanjutan di Jember.`,
  },
  {
    id: 3,
    title: 'Perbaikan Jalan Menuju Air Terjun Tancak Dimulai',
    category: 'Air Terjun',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80',
    date: 'April 15, 2025',
    content: `Pemerintah daerah Jember mulai melaksanakan proyek perbaikan akses jalan menuju destinasi wisata Air Terjun Tancak. Proyek ini bertujuan meningkatkan kenyamanan dan keamanan bagi para wisatawan yang ingin menikmati keindahan air terjun yang berada di kaki Gunung Argopuro.

Saat ini kondisi jalan cukup menantang, terutama pada musim hujan, sehingga perbaikan jalan menjadi prioritas. Proyek perbaikan ini mencakup pengaspalan jalan serta penataan area parkir dan fasilitas pendukung lainnya.

Diharapkan proyek ini selesai sebelum musim liburan, sehingga dapat mendukung peningkatan jumlah pengunjung dan membantu perekonomian masyarakat sekitar.`,
  },
];

export const ProfileData = {
  profilePict: 'data:image/jpeg;base64,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',
  name: 'John Doe',
  createdAt: 'January 2023',
  blogPosted: 12,
  following: 2300,
  follower: 5400,
};