/* 
   ==========================================================================
   VenturaFin - App Core (SIDEBAR & HEADER UI LAYER)
   File ini menangani proses rendering Sidebar & Navbar secara dinamis
   di semua halaman agar tidak perlu menulis ulang kode HTML yg sama.
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validasi Login User Secara Global (Proteksi Front-End)
    const user = VenturaAuth.requireAuth();
    if (!user) return;

    // 2. Render Sidebar, Header, & Highlight Menu Aktif secara dinamis
    renderSidebar(user);
    renderHeader(user);
    setupSidebarToggle(); // Menu Mobile Toggle
    setupUserMenu(user);    // Dropdown Avatar User (Navbar)
    highlightActiveNav(); // Penanda menu yg sedang dibuka
    
    // 3. Sembunyikan menu Admin jika login sbg User Biasa (Role Protection)
    if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
});

// --- Fungsi 1: Render Sidebar Ke Dalam Halaman (Front-End Template Rendering) ---
function renderSidebar(user) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.children.length > 0) return; // Mencegah double render jika sudah ada isi

    // Memasukkan kode sidebar secara dinamis dlm bentuk Template String (DOM Manipulation)
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1E3A5F"/><path d="M10 28L16 16L22 22L30 12" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="30" cy="12" r="3" fill="#22C55E"/></svg>
                <span class="sidebar-brand">VenturaFin</span>
            </div>
            <button class="sidebar-close" id="sidebarClose">✕</button>
        </div>
        <nav class="sidebar-nav">
            <a href="dashboard.html" class="nav-item" id="navDashboard">Dashboard</a>
            <a href="transaksi.html" class="nav-item" id="navTransaksi">Input Transaksi</a>
            <a href="riwayat.html" class="nav-item" id="navRiwayat">Riwayat Transaksi</a>
            <a href="laporan.html" class="nav-item" id="navLaporan">Laporan</a>
            <a href="kategori.html" class="nav-item" id="navKategori">Kategori</a>
            <div class="nav-divider"></div>
            <a href="users.html" class="nav-item admin-only" id="navUsers">Manajemen User</a>
            <a href="profil.html" class="nav-item" id="navProfil">Profil</a>
        </nav>
        <div class="sidebar-footer">
            <button class="btn-logout" id="btnLogout">Keluar</button>
        </div>`;
}

// --- Fungsi 2: Render Header/Navbar & Judul Halaman Sesuai File HTML (UI Page Logic) ---
function renderHeader(user) {
    const header = document.getElementById('topHeader');
    if (!header || header.children.length > 0) return;

    // Pemetaan nama judul halaman (Logic Mapping Title)
    const titles = {'transaksi.html':'Input Transaksi','riwayat.html':'Riwayat Transaksi','laporan.html':'Laporan Keuangan','users.html':'Manajemen User','profil.html':'Profil Saya','kategori.html':'Pengaturan Kategori','dashboard.html':'Dashboard'};
    const page = window.location.pathname.split('/').pop() || 'dashboard.html';
    const initials = VenturaData.getInitials(user.name);

    header.innerHTML = `
        <div class="header-left">
            <button class="hamburger" id="hamburgerBtn" aria-label="Toggle sidebar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div class="page-title">
                <h1>${titles[page] || 'Dashboard'}</h1>
                <p class="page-subtitle" id="greetingText">Selamat datang kembali</p>
            </div>
        </div>
        <div class="header-right">
            <div class="header-date" id="headerDate"></div>
            <div class="user-menu" id="userMenu">
                <div class="user-avatar" id="userAvatar"><span>${initials}</span></div>
                <div class="user-dropdown" id="userDropdown">
                    <div class="dropdown-header">
                        <span class="dropdown-name">${user.name}</span>
                        <span class="dropdown-email">${user.email}</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="profil.html" class="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profil Saya
                    </a>
                    <button class="dropdown-item" id="dropdownLogout">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Keluar
                    </button>
                </div>
            </div>
        </div>`;
}

// --- Fungsi 3: Logic Navbar Avatar Dropdown & Logout (Event Handlers) ---
function setupUserMenu(user) {
    const avatar = document.getElementById('userAvatar');
    const dropdown = document.getElementById('userDropdown');
    if (avatar && dropdown) {
        avatar.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('show'); });
        document.addEventListener('click', () => dropdown.classList.remove('show'));
    }
    const logoutBtn = document.getElementById('btnLogout');
    const dropdownLogout = document.getElementById('dropdownLogout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => VenturaAuth.logout());
    if (dropdownLogout) dropdownLogout.addEventListener('click', () => VenturaAuth.logout());
}

// --- Fungsi 4: Logic Sidebar Mobile Toggle (Responsive Interaction) ---
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('sidebarClose');
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
    if (hamburger) hamburger.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('show'); });
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
}

// --- Fungsi 5: Penanda Otomatis untuk Link Menu yang Sedang Dibuka (Visual Feedback) ---
function highlightActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'dashboard.html';
    const map = {'dashboard.html':'navDashboard','transaksi.html':'navTransaksi','riwayat.html':'navRiwayat','laporan.html':'navLaporan','kategori.html':'navKategori','users.html':'navUsers','profil.html':'navProfil'};
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const el = document.getElementById(map[page]);
    if (el) el.classList.add('active');
}

// --- Fungsi Global: Tampilkan Notifikasi Melayang (Toast Feedback Interaction) ---
function showToast(id, msg, dur) {
    const t = document.getElementById(id); if (!t) return;
    const txt = t.querySelector('span'); if (txt && msg) txt.textContent = msg;
    t.style.display = 'flex';
    t.style.animation = 'toastIn 0.4s ease';
    setTimeout(() => { t.style.display = 'none'; }, dur || 3000);
}
