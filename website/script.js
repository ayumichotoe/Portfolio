class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.resize();
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 30000);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    update() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulsePhase += 0.02;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            
            const dx = this.mouseX - node.x;
            const dy = this.mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 0) {
                node.vx += (dx / dist) * 0.01;
                node.vy += (dy / dist) * 0.01;
                
                // Limit velocity
                const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (speed > 2) {
                    node.vx = (node.vx / speed) * 2;
                    node.vy = (node.vy / speed) * 2;
                }
            }
        });
        
        this.connections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    this.connections.push({
                        from: this.nodes[i],
                        to: this.nodes[j],
                        distance: dist
                    });
                }
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.connections.forEach(conn => {
            const opacity = (1 - conn.distance / 150) * 0.3;
            this.ctx.strokeStyle = `rgba(226, 100, 138, ${opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
            
            if (Math.random() < 0.001) {
                const progress = (Date.now() % 2000) / 2000;
                const packetX = conn.from.x + (conn.to.x - conn.from.x) * progress;
                const packetY = conn.from.y + (conn.to.y - conn.from.y) * progress;
                
                this.ctx.fillStyle = `rgba(255, 182, 193, ${1 - progress})`;
                this.ctx.beginPath();
                this.ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.nodes.forEach(node => {
            const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
            const radius = node.radius + pulse * 2;
            
            const gradient = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4);
            gradient.addColorStop(0, 'rgba(226, 100, 138, 0.3)');
            gradient.addColorStop(1, 'rgba(226, 100, 138, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = `rgba(255, 182, 193, ${0.6 + pulse * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

function createDataParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const colors = ['var(--soft-pink)', 'var(--light-pink)', 'var(--muted-pink)', '#fff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
    }
}

function createBinaryRain() {
    const container = document.getElementById('binary');
    const columnCount = Math.floor(window.innerWidth / 30);
    
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'binary-column';
        column.style.left = (i * 30) + 'px';
        column.style.animationDelay = Math.random() * 20 + 's';
        
        // Generate random binary string
        let binaryString = '';
        for (let j = 0; j < 50; j++) {
            binaryString += Math.random() > 0.5 ? '1' : '0';
            if (Math.random() > 0.8) binaryString += ' ';
        }
        
        column.textContent = binaryString;
        container.appendChild(column);
    }
}

// Enhanced project data structure with proper URLs and detail pages
const projects = [
    {
        id: 'tastelab-ai-toolkit',
        title: "TasteLab AI Toolkit",
        description: "VLM-powered system for automated sensory data processing at BUas TasteLab facility. Features Flask dashboard, user authentication, and multimodal analysis for 8 cameras, wearables, and eye-tracking devices.",
        tags: ["Computer Vision", "Flask", "Machine Learning", "VLM", "NLP"],
        github: null,
        detailPage: "projects/tastelab-ai-toolkit.html",
        image: "assets/projects/tastelab-thumbnail.jpg", // Optional: add project thumbnails
        status: "completed" // active, completed, in-progress
    },
    {
        id: 'emotion-detection-pipeline',
        title: "Emotion Detection Pipeline - CIA",
        description: "Automated cloud application for Content Intelligence Agency. Processes video/audio to classify emotions per sentence with confidence scores. Deployed on Azure with web interface, API, and CLI. Supports 6 base emotions with custom emotion capabilities.",
        tags: ["Azure ML", "NLP", "MLOps", "API"],
        github: null,
        detailPage: "projects/emotion-detection-pipeline.html",
        image: "assets/projects/emotion-pipeline-thumbnail.jpg",
        status: "completed"
    },
    {
        id: 'root-detection-system',
        title: "Root Detection System - NPEC",
        description: "Advanced segmentation system for Netherlands Plant Eco-phenotyping Centre. Analyzes Arabidopsis thaliana root systems in Petri dishes using the Hades phenotyping system. Enables automated plant-microbe interaction studies with high-throughput imaging.",
        tags: ["Computer Vision", "Deep Learning", "Biology", "Segmentation"],
        github: null,
        detailPage: "projects/root-detection-system.html",
        image: "assets/projects/root-detection-thumbnail.jpg",
        status: "completed"
    },
    {
        id: 'chatbot-effectiveness',
        title: "Chatbot Effectiveness Research",
        description: "Mixed-methods study with Digiwerkplaats on SME customer service automation. Surveyed 100+ respondents and conducted 5 stakeholder interviews. Found 4.2/5 clarity rating with hybrid bot-human models as optimal solution for resource-constrained SMEs.",
        tags: ["Research", "NLP", "Data Analysis", "Business"],
        github: null,
        detailPage: "projects/",
        image: "assets/projects/chatbot-research-thumbnail.jpg",
        status: "completed"
    },
    {
        id: 'hand-tracking',
        title: "Interactive Hand Tracking",
        description: "Real-time computer vision system enabling finger-based drawing on screen. Implements advanced hand landmark detection and gesture recognition for intuitive human-computer interaction without physical touch interfaces.",
        tags: ["Computer Vision", "MediaPipe", "Real-time", "Python"],
        github: null,
        detailPage: "projects/hand-tracking.html",
        image: "assets/projects/hand-tracking-thumbnail.jpg",
        status: "completed"
    },
    {
        id: 'plant-species-app',
        title: "Plant Species Detection App",
        description: "Mobile application for automated identification of 6 plant species using deep learning. Features real-time camera integration, offline capability, and detailed species information for botanical research and education.",
        tags: ["Deep Learning", "Mobile Dev", "TensorFlow", "CNN"],
        github: null,
        detailPage: "projects/plant-species-app.html",
        image: "assets/projects/plant-detection-thumbnail.jpg",
        status: "completed"
    }
];

// Enhanced project rendering with proper navigation
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'card project-card';
        card.style.animationDelay = `${index * 100}ms`;
        card.dataset.projectId = project.id;
        
        // Create status badge if needed
        const statusBadge = project.status === 'in-progress' ? 
            '<span class="status-badge in-progress">In Progress</span>' : '';
        
        // Generate tags HTML
        const tagsHtml = project.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // Handle GitHub button - show only if repository exists
        const githubButton = project.github ? 
            `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" data-action="github">
                <i class="fa-brands fa-github"></i>
                Code
            </a>` : 
            `<button class="btn btn-outline disabled" disabled title="Private repository">
                <i class="fa-solid fa-lock"></i>
                Private
            </button>`;
        
        // Create the card HTML
        card.innerHTML = `
            ${statusBadge}
            <h3 class="card-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            
            <div class="tags-container">
                ${tagsHtml}
            </div>
            
            <div class="button-group">
                ${githubButton}
                <a href="${project.detailPage}" class="btn btn-primary" data-action="details">
                    <i class="fa-solid fa-circle-info"></i>
                    Details
                </a>
            </div>
        `;
        
        // Add click handler for the entire card (optional)
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (!e.target.closest('.btn')) {
                navigateToProject(project.id);
            }
        });
        
        grid.appendChild(card);
    });
}

// Navigation function for project details
function navigateToProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project && project.detailPage) {
        // You can choose between standard navigation or single-page app behavior
        window.location.href = project.detailPage;
        
        // Alternative: Load content dynamically (SPA approach)
        // loadProjectDetails(projectId);
    }
}

// Optional: Function to load project details dynamically (SPA approach)
function loadProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Create a modal or navigate to a dynamic route
    // This is an example of creating a modal overlay
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>${project.title}</h2>
            <div class="project-full-description">
                <!-- Load full project details here -->
                <p>Loading project details...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load actual content via fetch or have it pre-defined
    fetch(`/api/projects/${projectId}`)
        .then(response => response.json())
        .then(data => {
            // Update modal with full project details
        })
        .catch(err => {
            console.error('Error loading project details:', err);
        });
}

// Track project views (analytics)
function trackProjectInteraction(projectId, action) {
    // Implement analytics tracking here if needed
    console.log(`Project interaction: ${projectId} - ${action}`);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'Projects',
            'event_label': projectId
        });
    }
}

function initScrollAnimation() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function scrollToNextSection() {
    const targetSection = document.getElementById('projects');
    if (targetSection) {
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const formMessage = document.getElementById('formMessage');
    
    // You can implement actual form submission here
    // Example: send to your backend or email service
    
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
    formMessage.style.display = 'block';
    
    setTimeout(() => {
        this.reset();
        formMessage.style.display = 'none';
    }, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const neuralNetwork = new NeuralNetwork(canvas);
        neuralNetwork.animate();
    }
    
    createDataParticles();
    createBinaryRain();
    
    renderProjects();
    
    setTimeout(initScrollAnimation, 100);
    
    document.getElementById('projectsGrid')?.addEventListener('click', function(e) {
        const button = e.target.closest('.btn');
        if (button) {
            const projectCard = button.closest('.project-card');
            const projectId = projectCard?.dataset.projectId;
            const action = button.dataset.action;
            
            if (projectId && action) {
                trackProjectInteraction(projectId, action);
            }
        }
    });
});