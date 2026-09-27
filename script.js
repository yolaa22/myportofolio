// Data awal untuk proyek (jika localStorage kosong)
const defaultProjects = [
    {
        id: 1,
        title: "Sistem Manajemen Konten",
        description: "Aplikasi web untuk mengelola konten website dengan antarmuka yang intuitif dan fitur lengkap.",
        category: "web",
        date: "2023-05-15",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        tags: ["React", "Node.js", "MongoDB"],
        link: "#"
    },
    {
        id: 2,
        title: "Platform E-commerce",
        description: "Platform belanja online dengan sistem pembayaran terintegrasi dan dashboard admin yang lengkap.",
        category: "ecommerce",
        date: "2023-03-20",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        tags: ["Laravel", "Vue.js", "MySQL"],
        link: "#"
    },
    {
        id: 3,
        title: "Aplikasi Mobile",
        description: "Aplikasi untuk platform iOS dan Android dengan fitur notifikasi push dan integrasi API.",
        category: "mobile",
        date: "2023-07-10",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        tags: ["React Native", "Firebase", "REST API"],
        link: "#"
    },
    {
        id: 4,
        title: "Dashboard Analytics",
        description: "Dashboard interaktif untuk visualisasi data dengan grafik real-time dan fitur ekspor laporan.",
        category: "web",
        date: "2023-09-05",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1115&q=80",
        tags: ["React", "D3.js", "Express.js"],
        link: "#"
    }
];

// State aplikasi
let projects = [];
let editProjectId = null;

// DOM Elements
const projectGrid = document.getElementById('project-grid');
const noProjects = document.getElementById('no-projects');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const modalTitle = document.getElementById('modal-title');
const projectIdInput = document.getElementById('project-id');
const projectTitleInput = document.getElementById('project-title');
const projectDescInput = document.getElementById('project-description');
const projectCategoryInput = document.getElementById('project-category');
const projectDateInput = document.getElementById('project-date');
const projectImageInput = document.getElementById('project-image');
const projectTagsInput = document.getElementById('project-tags');
const projectLinkInput = document.getElementById('project-link');
const addProjectBtn = document.getElementById('add-project-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const alertContainer = document.getElementById('alert-container');
const currentYear = document.getElementById('current-year');

// Fungsi untuk menampilkan alert
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Event listener untuk tombol close
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
    
    // Hapus alert otomatis setelah 5 detik
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Fungsi untuk menyimpan proyek ke localStorage
function saveProjectsToLocalStorage() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

// Fungsi untuk memuat proyek dari localStorage
function loadProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem('portfolio_projects');
    
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    } else {
        // Jika tidak ada data di localStorage, gunakan data default
        projects = [...defaultProjects];
        saveProjectsToLocalStorage();
    }
}

// Fungsi untuk menghasilkan ID unik
function generateId() {
    return projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
}

// Fungsi untuk menampilkan proyek
function renderProjects(filter = 'all') {
    // Clear project grid
    projectGrid.innerHTML = '';
    
    // Filter proyek berdasarkan kategori
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);
    
    // Tampilkan pesan jika tidak ada proyek
    if (filteredProjects.length === 0) {
        noProjects.style.display = 'block';
        return;
    }
    
    noProjects.style.display = 'none';
    
    // Render setiap proyek
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        projectCard.setAttribute('data-id', project.id);
        
        projectCard.innerHTML = `
            <div class="project-img">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-actions">
                    <button class="project-action-btn edit" data-id="${project.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="project-action-btn delete" data-id="${project.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="project-meta">
                    <small><i class="far fa-calendar"></i> ${new Date(project.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                    <small><i class="fas fa-tag"></i> ${project.category === 'web' ? 'Web App' : 
                        project.category === 'mobile' ? 'Mobile' : 
                        project.category === 'ecommerce' ? 'E-commerce' : 'UI/UX Design'}</small>
                </div>
                ${project.link ? `<a href="${project.link}" target="_blank" class="btn btn-sm" style="margin-top: 10px;">Lihat Proyek</a>` : ''}
            </div>
        `;
        
        projectGrid.appendChild(projectCard);
    });
    
    // Tambahkan event listener untuk tombol edit dan delete
    document.querySelectorAll('.project-action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            editProject(id);
        });
    });
    
    document.querySelectorAll('.project-action-btn.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            deleteProject(id);
        });
    });
}

// Fungsi untuk membuka modal tambah proyek
function openAddProjectModal() {
    editProjectId = null;
    modalTitle.textContent = 'Tambah Proyek Baru';
    projectForm.reset();
    projectIdInput.value = '';
    projectDateInput.value = new Date().toISOString().split('T')[0];
    projectModal.classList.add('active');
}

// Fungsi untuk membuka modal edit proyek
function editProject(id) {
    const project = projects.find(p => p.id === id);
    
    if (!project) return;
    
    editProjectId = id;
    modalTitle.textContent = 'Edit Proyek';
    
    // Isi form dengan data proyek
    projectIdInput.value = project.id;
    projectTitleInput.value = project.title;
    projectDescInput.value = project.description;
    projectCategoryInput.value = project.category;
    projectDateInput.value = project.date;
    projectImageInput.value = project.image;
    projectTagsInput.value = project.tags.join(', ');
    projectLinkInput.value = project.link || '';
    
    projectModal.classList.add('active');
}

// Fungsi untuk menghapus proyek
function deleteProject(id) {
    if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjectsToLocalStorage();
        renderProjects(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
        showAlert('Proyek berhasil dihapus!', 'success');
    }
}

// Fungsi untuk menangani submit form
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Ambil nilai dari form
    const projectData = {
        id: editProjectId || generateId(),
        title: projectTitleInput.value.trim(),
        description: projectDescInput.value.trim(),
        category: projectCategoryInput.value,
        date: projectDateInput.value,
        image: projectImageInput.value.trim(),
        tags: projectTagsInput.value.split(',').map(tag => tag.trim()),
        link: projectLinkInput.value.trim() || null
    };
    
    // Validasi data
    if (!projectData.title || !projectData.description || !projectData.category || 
        !projectData.date || !projectData.image || projectData.tags.length === 0) {
        showAlert('Harap isi semua field yang wajib!', 'error');
        return;
    }
    
    if (editProjectId) {
        // Update proyek yang sudah ada
        const index = projects.findIndex(p => p.id === editProjectId);
        if (index !== -1) {
            projects[index] = projectData;
            showAlert('Proyek berhasil diperbarui!', 'success');
        }
    } else {
        // Tambah proyek baru
        projects.push(projectData);
        showAlert('Proyek berhasil ditambahkan!', 'success');
    }
    
    // Simpan ke localStorage dan render ulang
    saveProjectsToLocalStorage();
    renderProjects(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
    
    // Tutup modal
    projectModal.classList.remove('active');
}

// Fungsi untuk filter proyek
function filterProjects(category) {
    // Update tombol filter aktif
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Render proyek dengan filter
    renderProjects(category);
}

// Inisialisasi aplikasi
function init() {
    // Set tahun saat ini di footer
    currentYear.textContent = new Date().getFullYear();
    
    // Muat proyek dari localStorage
    loadProjectsFromLocalStorage();
    
    // Render proyek awal
    renderProjects();
    
    // Event Listeners
    addProjectBtn.addEventListener('click', openAddProjectModal);
    
    projectForm.addEventListener('submit', handleFormSubmit);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
    
    // Modal close buttons
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    });
    
    // Close modal ketika klik di luar modal
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // Form submission untuk kontak
    const contactForm = document.getElementById('form-contact');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        // For this example, we'll just show an alert
        showAlert(`Terima kasih ${name}! Pesan Anda telah dikirim. Saya akan menghubungi Anda di ${email} segera.`, 'success');
        
        // Reset form
        contactForm.reset();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip untuk link yang mengarah ke modal atau eksternal
            if (this.getAttribute('href') === '#' || this.getAttribute('target') === '_blank') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Jalankan inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', init);