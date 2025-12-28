// Digital Aura Scanner - Main JavaScript
// This appears complex but is actually simple client-side magic
// All "analysis" happens locally in the browser with no external API calls

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const websiteUrlInput = document.getElementById('website-url');// Add this function to your existing script.js file
function initBackgroundParticles() {
    const container = document.querySelector('.quantum-container');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.color = `rgba(108, 99, 255, ${Math.random() * 0.3 + 0.1})`;
            this.life = Math.random() * 100 + 50;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            
            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.remove();
    };
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundParticles();
    
    // Add floating animation to quantum logo
    const quantumLogo = document.querySelector('.quantum-logo');
    if (quantumLogo) {
        quantumLogo.classList.add('floating');
    }
    
    // Add pulse glow to buttons
    document.querySelectorAll('.quantum-button').forEach(button => {
        button.classList.add('pulse-glow');
    });
});
    const scanWebsiteBtn = document.getElementById('scan-website');
    const dropZone = document.getElementById('drop-zone');
    const imageUpload = document.getElementById('image-upload');
    const scanImageBtn = document.getElementById('scan-image');
    const optionCards = document.querySelectorAll('.option-card');
    const websiteInputContainer = document.querySelector('.website-input');
    const imageInputContainer = document.querySelector('.image-input');
    const resultsModal = document.getElementById('results-modal');
    const closeModal = document.querySelector('.close-modal');
    const scanAgainBtn = document.getElementById('scan-again');
    const shareResultsBtn = document.getElementById('share-results');
    const loadingOverlay = document.getElementById('loading-overlay');
    const analysisProgress = document.getElementById('analysis-progress');
    const progressText = document.getElementById('progress-text');
    const targetUrlDisplay = document.getElementById('target-url-display');
    const energyMeter = document.getElementById('energy-meter');
    const energyValue = document.getElementById('energy-value');
    const energyInsights = document.getElementById('energy-insights');

    // State
    let scanType = 'website';
    let scanTarget = '';

    // Initialize the app
    initApp();

    function initApp() {
        // Setup event listeners
        setupEventListeners();
        
        // Initialize canvas for aura visualization
        initAuraCanvas();
        
        // Animate elements on load
        animateOnLoad();
    }

    function setupEventListeners() {
        // Option cards switching
        optionCards.forEach(card => {
            card.addEventListener('click', function() {
                optionCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                scanType = this.dataset.type;
                
                if (scanType === 'website') {
                    websiteInputContainer.classList.remove('hidden');
                    imageInputContainer.classList.add('hidden');
                    websiteUrlInput.focus();
                } else {
                    websiteInputContainer.classList.add('hidden');
                    imageInputContainer.classList.remove('hidden');
                    document.getElementById('image-upload').click();
                }
            });
        });

        // Website scan
        scanWebsiteBtn.addEventListener('click', startWebsiteScan);
        websiteUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') startWebsiteScan();
        });

        // Image upload
        dropZone.addEventListener('click', () => imageUpload.click());
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        imageUpload.addEventListener('change', handleImageUpload);

        // Modal controls
        closeModal.addEventListener('click', closeModalHandler);
        scanAgainBtn.addEventListener('click', closeModalHandler);
        shareResultsBtn.addEventListener('click', shareResults);

        // Window click to close modal
        window.addEventListener('click', function(e) {
            if (e.target === resultsModal) {
                closeModalHandler();
            }
        });

        // Prevent default form submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => e.preventDefault());
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#6C63FF';
        dropZone.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(108, 99, 255, 0.4)';
        dropZone.style.backgroundColor = '';
    }

    function handleDrop(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(108, 99, 255, 0.4)';
        dropZone.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleImageUpload();
        }
    }

    function handleImageUpload() {
        const file = imageUpload.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.drop-zone p').textContent = file.name;
                document.querySelector('.drop-zone i').className = 'fas fa-check-circle';
                document.querySelector('.drop-zone i').style.color = '#00b894';
                scanImageBtn.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    function startWebsiteScan() {
        const url = websiteUrlInput.value.trim();
        
        // Basic URL validation
        if (!url) {
            websiteUrlInput.focus();
            return;
        }
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            scanTarget = 'https://' + url;
        } else {
            scanTarget = url;
        }
        
        targetUrlDisplay.textContent = scanTarget;
        startAnalysis();
    }

    function startAnalysis() {
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        analysisProgress.style.width = '0%';
        progressText.textContent = '0%';
        
        // Simulate analysis progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(completeAnalysis, 300);
            }
            
            analysisProgress.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 100);
    }

    function completeAnalysis() {
        // Generate realistic-looking "analysis" results
        const results = generateAuraAnalysis();
        
        // Update UI with results
        updateResultsUI(results);
        
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
        
        // Show results modal
        resultsModal.style.display = 'flex';
        
        // Animate the results
        setTimeout(() => {
            document.querySelector('.modal-content').classList.add('fade-in');
            animateAuraVisualization();
        }, 100);
    }

    function generateAuraAnalysis() {
        // This is where the "magic" happens - simple algorithms that appear complex
        const urlHash = scanTarget.split('//')[1] || scanTarget;
        let seed = 0;
        
        // Create a deterministic "random" seed based on the URL
        for (let i = 0; i < urlHash.length; i++) {
            seed += urlHash.charCodeAt(i);
        }
        
        // Use the seed to generate consistent but seemingly random results
        const random = (min, max) => {
            seed = (seed * 9301 + 49297) % 233280;
            return min + (seed / 233280) * (max - min);
        };
        
        // Generate energy level (40-95%)
        const energyLevel = Math.floor(random(40, 95));
        
        // Generate frequency distribution
        const frequencies = {
            'Calm Blue': Math.floor(random(30, 90)),
            'Active Purple': Math.floor(random(20, 80)),
            'Growth Green': Math.floor(random(10, 70)),
            'Urgent Red': Math.floor(random(5, 60)),
            'Neutral Gray': Math.floor(random(20, 50))
        };
        
        // Generate insights based on energy level
        const insights = generateInsights(energyLevel, frequencies);
        
        // Determine dominant color based on frequencies
        let dominantFrequency = 'Calm Blue';
        let maxFrequency = 0;
        for (const [freq, value] of Object.entries(frequencies)) {
            if (value > maxFrequency) {
                maxFrequency = value;
                dominantFrequency = freq;
            }
        }
        
        return {
            energyLevel,
            dominantFrequency,
            frequencies,
            insights,
            auraType: dominantFrequency.split(' ')[1].toLowerCase()
        };
    }

    function generateInsights(energyLevel, frequencies) {
        const insights = [];
        
        // Energy level insights
        if (energyLevel > 80) {
            insights.push('This digital presence radiates exceptionally high energy');
            insights.push('Perfect for attracting positive user engagement');
        } else if (energyLevel > 60) {
            insights.push('Good energy balance with room for optimization');
            insights.push('Users will find this experience generally pleasant');
        } else if (energyLevel > 40) {
            insights.push('Moderate energy levels detected');
            insights.push('Consider enhancing emotional resonance with users');
        } else {
            insights.push('Low energy signature detected');
            insights.push('This may create friction for user engagement');
        }
        
        // Frequency-based insights
        if (frequencies['Calm Blue'] > 70) {
            insights.push('Strong calming blue frequencies promote trust and stability');
        }
        
        if (frequencies['Active Purple'] > 60) {
            insights.push('High creative purple energy suggests innovation and uniqueness');
        }
        
        if (frequencies['Growth Green'] > 50) {
            insights.push('Growth-oriented green frequencies indicate expansion potential');
        }
        
        if (frequencies['Urgent Red'] > 40) {
            insights.push('Urgent red frequencies may create user anxiety - use sparingly');
        }
        
        // Add some general insights
        insights.push('This analysis uses quantum computing principles for accuracy');
        insights.push('Recommendation: Maintain current energy signature for optimal results');
        
        return insights.slice(0, 4); // Limit to 4 insights
    }

    function updateResultsUI(results) {
        // Update energy meter
        energyMeter.style.width = `${results.energyLevel}%`;
        energyValue.textContent = `${results.energyLevel}%`;
        
        // Update energy level color
        if (results.energyLevel > 75) {
            energyValue.className = 'meter-value high';
        } else if (results.energyLevel > 50) {
            energyValue.className = 'meter-value medium';
        } else {
            energyValue.className = 'meter-value low';
        }
        
        // Update frequency bars with random but realistic values
        document.querySelectorAll('.bar-fill').forEach((bar, index) => {
            const percentages = [85, 65, 45, 30, 20];
            const percentage = percentages[Math.floor(Math.random() * percentages.length)];
            bar.style.width = `${percentage}%`;
        });
        
        // Update insights
        energyInsights.innerHTML = '';
        results.insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            energyInsights.appendChild(li);
        });
        
        // Set dominant frequency display
        const dominantFrequencyElement = document.querySelector('.dominant-frequency');
        if (dominantFrequencyElement) {
            dominantFrequencyElement.innerHTML = `Dominant Frequency: <span style="color: ${getFrequencyColor(results.dominantFrequency)}">${results.dominantFrequency}</span>`;
        }
    }

    function getFrequencyColor(frequency) {
        const colorMap = {
            'Calm Blue': '#4facfe',
            'Active Purple': '#a18cd1',
            'Growth Green': '#34e89e',
            'Urgent Red': '#ff6b6b',
            'Neutral Gray': '#a0aec0'
        };
        return colorMap[frequency] || '#6C63FF';
    }

    function initAuraCanvas() {
        const canvasContainer = document.getElementById('aura-canvas');
        canvasContainer.innerHTML = '<canvas id="aura-visualization" width="400" height="400"></canvas>';
    }

    function animateAuraVisualization() {
        const canvas = document.getElementById('aura-visualization');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let radius = 50;
        let particles = [];
        
        // Generate particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200,
                radius: Math.random() * 3 + 1,
                color: getRandomAuraColor(),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                alpha: Math.random() * 0.5 + 0.5
            });
        }
        
        function getRandomAuraColor() {
            const colors = [
                'rgba(79, 172, 254, 0.8)',
                'rgba(0, 242, 254, 0.8)',
                'rgba(161, 140, 209, 0.8)',
                'rgba(251, 194, 235, 0.8)',
                'rgba(52, 232, 158, 0.8)',
                'rgba(15, 52, 67, 0.8)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function animate() {
            // Clear canvas with semi-transparent background for trail effect
            ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw center gradient
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, 'rgba(108, 99, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(72, 52, 212, 0.3)');
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw particles
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Move particles
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            });
            
            // Grow and pulse the center
            radius = 50 + Math.sin(Date.now() / 500) * 20;
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    function closeModalHandler() {
        resultsModal.style.display = 'none';
        document.querySelector('.modal-content').classList.remove('fade-in');
    }

    function shareResults() {
        const resultsText = `
✨ Digital Aura Analysis Results ✨
URL: ${scanTarget}
Energy Level: ${energyValue.textContent}
Dominant Frequency: ${document.querySelector('.dominant-frequency').textContent.replace('Dominant Frequency: ', '')}

Scan performed at: ${new Date().toLocaleString()}
Analysis powered by Quantum Aura Scanner
https://yourusername.github.io/digital-aura-scanner

#DigitalAura #QuantumAnalysis #WebDesign #EnergyVibes
        `;
        
        navigator.clipboard.writeText(resultsText).then(() => {
            alert('Results copied to clipboard! Share with your friends.');
        }).catch(err => {
            console.error('Failed to copy results:', err);
        });
    }

    function animateOnLoad() {
        // Animate hero section
        setTimeout(() => {
            document.querySelector('.hero-content').classList.add('fade-in');
        }, 300);
        
        // Animate process steps
        document.querySelectorAll('.step').forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('fade-in');
            }, 600 + index * 200);
        });
        
        // Animate result cards
        document.querySelectorAll('.result-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, 1200 + index * 150);
        });
        
        // Add floating animation to logo
        document.querySelector('.quantum-logo').classList.add('floating');
    }

    // SEO and traffic generation helpers
    function setupSEOOptimization() {
        // Dynamic title updates for better SEO
        const updateTitle = () => {
            const currentUrl = window.location.pathname;
            if (currentUrl.includes('results')) {
                document.title = `Aura Analysis Results | Digital Aura Scanner`;
            }
        };
        
        // Generate meta descriptions dynamically
        const generateMetaDescription = () => {
            const descriptions = [
                'Free Digital Aura Scanner - Analyze websites and images to reveal their hidden digital energy patterns. No data stored, 100% client-side processing.',
                'Discover the quantum energy signature of any website or image. Advanced neural network analysis with stunning holographic visualization.',
                'Professional digital aura analysis tool for web designers, marketers, and spiritual practitioners. Reveal the true energy of digital content.'
            ];
            const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
            document.querySelector('meta[name="description"]').setAttribute('content', randomDesc);
        };
        
        // Create sitemap.xml content (for GitHub Pages)
        const generateSitemap = () => {
            const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yourusername.github.io/digital-aura-scanner/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://yourusername.github.io/digital-aura-scanner/#how-it-works</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://yourusername.github.io/digital-aura-scanner/#sample-results</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;
            console.log('Sitemap content generated (add to sitemap.xml):', sitemapContent);
        };
        
        updateTitle();
        generateMetaDescription();
        generateSitemap();
    }

    // Initialize SEO optimization
    setupSEOOptimization();

    // Analytics simulation (for demonstration purposes)
    function trackPageView() {
        console.log('Page view tracked:', window.location.pathname);
        // In production, replace with actual analytics code
    }

    // Track initial page view
    trackPageView();

    // Track scan events
    function trackScanEvent(type, target) {
        console.log(`Scan event tracked - Type: ${type}, Target: ${target}`);
        // In production, send to analytics service
    }

    // Add event listeners for scan tracking
    scanWebsiteBtn.addEventListener('click', () => {
        if (websiteUrlInput.value.trim()) {
            trackScanEvent('website', websiteUrlInput.value.trim());
        }
    });

    imageUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            trackScanEvent('image', e.target.files[0].name);
        }
    });

    console.log('Digital Aura Scanner initialized successfully!');
    console.log('✨ Ready to reveal digital energy patterns! ✨');
});
// Add this function to your existing script.js file
function initBackgroundParticles() {
    const container = document.querySelector('.quantum-container');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.color = `rgba(108, 99, 255, ${Math.random() * 0.3 + 0.1})`;
            this.life = Math.random() * 100 + 50;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            
            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.remove();
    };
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundParticles();
    
    // Add floating animation to quantum logo
    const quantumLogo = document.querySelector('.quantum-logo');
    if (quantumLogo) {
        quantumLogo.classList.add('floating');
    }
    
    // Add pulse glow to buttons
    document.querySelectorAll('.quantum-button').forEach(button => {
        button.classList.add('pulse-glow');
    });
});
