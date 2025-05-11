const colors = {
    green: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,         // Warna utama (hijau daun)
    greenLight: (opacity = 1) => `rgba(144, 238, 144, ${opacity})`, // Hijau terang
    greenDark: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,      // Hijau gelap
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    darkModeBackground: (opacity = 1) => `rgba(27, 27, 27, ${opacity})`,
    darkModeGreen: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // Sama seperti hijau utama tapi di dark mode
    grey: (opacity = 1) => `rgba(120, 120, 120, ${opacity})`,        // Netral
  };
  
  export default colors;
  