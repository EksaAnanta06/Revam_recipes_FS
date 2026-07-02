/**
 * src/data/menuItems.jsx
 *
 * Data konfigurasi item navigasi untuk Navbar dan Mobile Drawer.
 *
 * Dipindah dari utils/hamburgerMenu.jsx → data/menuItems.jsx
 *
 * Alasan:
 * - "utils" seharusnya berisi fungsi utility, bukan data statis
 * - "hamburgerMenu" adalah nama yang terlalu implementasi-spesifik
 *   (hamburger adalah sebutan untuk ikon menu ☰, bukan nama yang bermakna)
 * - "menuItems" + folder "data/" lebih deskriptif dan mudah ditemukan
 *
 * Ekstensi .jsx dipertahankan karena file ini memang berisi JSX (MUI icons).
 */

import HomeIcon         from "@mui/icons-material/Home";
import EngineeringIcon  from "@mui/icons-material/Engineering";
import InfoIcon         from "@mui/icons-material/Info";
import ContactMailIcon  from "@mui/icons-material/ContactMail";

const menuItems = [
    { text: "Beranda",      href: "#", icon: <HomeIcon /> },
    { text: "Layanan",      href: "#", icon: <EngineeringIcon /> },
    { text: "Tentang Kami", href: "#", icon: <InfoIcon /> },
    { text: "Kontak",       href: "#", icon: <ContactMailIcon /> },
];

export default menuItems;
