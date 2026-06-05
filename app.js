/* ==========================================================================
   AegisPV Predictive Maintenance SCADA Console - Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navigation Highlights and Sticky State
    const navbar = document.querySelector('.navbar-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header State
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(7, 11, 25, 0.9)';
            navbar.style.padding = '4px 0';
        } else {
            navbar.style.background = 'rgba(7, 11, 25, 0.7)';
            navbar.style.padding = '0';
        }

        // Active Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Navbar Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close mobile nav on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // 3. Scroll Reveal Effect (Intersection Observer)
    const revealElements = document.querySelectorAll('.challenge-card, .timeline-node, .team-card, .tech-item-card, .results-info, .results-chart-box, .contact-box-wrapper');
    
    // Add reveal class dynamically to elements
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Hero Animated KPI Counters
    const statsDeck = document.querySelector('.hero-stats-deck');
    let countersAnimated = false;

    function animateCounters() {
        const stats = [
            { id: 'stat-accuracy', target: 92, speed: 30 },
            { id: 'stat-downtime', target: 25, speed: 40 },
            { id: 'stat-life', target: 20, speed: 50 },
            { id: 'stat-cost', target: 18, speed: 60 }
        ];

        stats.forEach(stat => {
            const el = document.getElementById(stat.id);
            if (!el) return;
            let current = 0;
            const timer = setInterval(() => {
                current += 1;
                el.textContent = current;
                if (current >= stat.target) {
                    el.textContent = stat.target;
                    clearInterval(timer);
                }
            }, stat.speed);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    if (statsDeck) {
        statsObserver.observe(statsDeck);
    }

    // 5. Solution Architecture Interactive Step Diagram
    const architectureNodes = document.querySelectorAll('.diagram-node');
    const archDetailTitle = document.getElementById('architecture-detail-title');
    const archDetailDesc = document.getElementById('architecture-detail-desc');
    const nodeDetails = {
        1: {
            title: "PV Manufacturing Equipment (Physical Layer)",
            desc: "Critical mechanical assemblies including multi-axis handling robots, thermal lamination vacuum pump chambers, glass feeding conveyor engines, and laser cell soldering matrices. These units are highly susceptible to bearing structural fractures and electrical winding stress."
        },
        2: {
            title: "Virtual Sensors (Data Acquisition Layer)",
            desc: "Direct physical sensors coupled with state-space simulators (Virtual Sensors) to stream high-frequency physical values: bearing temperature (°C), multi-axis displacement vibration (mm/s²), and motor-drive winding current (A) without intrusive mechanical setups."
        },
        3: {
            title: "MATLAB & Simulink Monitoring (Signal Processing Layer)",
            desc: "Runs high-speed mathematical analysis, Fast Fourier Transforms (FFT), spectral kurtosis checks, and high-pass filters to isolate structural noise from primary mechanical signals and export pure features."
        },
        4: {
            title: "Machine Learning Model (Intelligence Layer)",
            desc: "Trained Random Forest and Decision Tree classifier algorithms processing multi-sensor features. The model maps variable deviation coordinates directly onto validated mechanical degradation curves."
        },
        5: {
            title: "Failure Prediction Engine (Analysis Layer)",
            desc: "Applies continuous exponential statistical projections and Kalman Filter calculations to predict future telemetry crossings, determining precise Remaining Useful Life (RUL) limits and failure probabilities."
        },
        6: {
            title: "Dashboard & Alerts (SCADA UI Layer)",
            desc: "The digital twin command center. Emits real-time visual warnings, logs anomaly triggers, displays sensory trends, and flags machinery safety status changes instantly."
        },
        7: {
            title: "Actionable Maintenance Recommendations (Operational Layer)",
            desc: "The pipeline's final output. Replaces calendar scheduling with smart diagnostic instructions, indicating exact actions such as 'bearing inspection', 'motor alignment tune', or 'schedule cooling channel flush'."
        }
    };

    architectureNodes.forEach(node => {
        node.addEventListener('click', () => {
            architectureNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            
            const nodeId = node.getAttribute('data-node');
            const data = nodeDetails[nodeId];
            
            if (data && archDetailTitle && archDetailDesc) {
                // Smoothly swap content
                const panel = document.getElementById('architecture-detail-box');
                panel.style.opacity = '0.3';
                panel.style.transform = 'translateY(5px)';
                
                setTimeout(() => {
                    archDetailTitle.textContent = `${data.title} - Active`;
                    archDetailDesc.textContent = data.desc;
                    panel.style.opacity = '1';
                    panel.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    });

    // 6. SCADA Interactive Dashboard Logic
    
    // Sliders
    const sliderTemp = document.getElementById('slider-temp');
    const sliderVib = document.getElementById('slider-vib');
    const sliderCurr = document.getElementById('slider-curr');
    const valTemp = document.getElementById('val-temp');
    const valVib = document.getElementById('val-vib');
    const valCurr = document.getElementById('val-curr');
    
    // Gauges
    const gaugeTempNum = document.getElementById('gauge-temp-num');
    const gaugeVibNum = document.getElementById('gauge-vib-num');
    const gaugeCurrNum = document.getElementById('gauge-curr-num');
    
    const gaugeTempCircle = document.getElementById('gauge-temp-circle');
    const gaugeVibCircle = document.getElementById('gauge-vib-circle');
    const gaugeCurrCircle = document.getElementById('gauge-curr-circle');

    // KPI Displays
    const kpiHealth = document.getElementById('kpi-health');
    const kpiProb = document.getElementById('kpi-prob');
    const kpiRul = document.getElementById('kpi-rul');
    const activeModeDisplay = document.getElementById('active-mode-display');
    const dashboardClock = document.getElementById('dashboard-clock');
    
    // AI Status Indicator Elements
    const aiIndicator = document.getElementById('ai-status-indicator');
    const aiTitle = document.getElementById('ai-status-title');
    const aiIcon = document.getElementById('ai-status-icon');
    
    // Recommendations & Logs
    const recList = document.getElementById('recommendation-list');
    const logBox = document.getElementById('dashboard-logs');
    const btnClearLogs = document.getElementById('clear-logs');
    const btnResetSensors = document.getElementById('btn-reset-sensors');

    // State Variables
    let currentMode = 'health'; // 'health', 'failure', 'rul', 'downtime'
    let liveTimer = null;
    let clockTimer = null;
    let logIndex = 1;

    // Clock
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        if (dashboardClock) {
            dashboardClock.textContent = `SYSTEM RUNNING | ${hrs}:${mins}:${secs}`;
        }
    }
    clockTimer = setInterval(updateClock, 1000);
    updateClock();

    // SVG Gauge calculation helpers
    // Stroke dasharray is 251.2
    function updateGaugeSVG(circleElement, value, min, max) {
        if (!circleElement) return;
        let percent = (value - min) / (max - min);
        percent = Math.min(Math.max(percent, 0), 1); // Clamp
        const circumference = 251.2;
        const offset = circumference - (percent * circumference);
        circleElement.style.strokeDashoffset = offset;
    }

    // Logger
    function appendLog(message, type = '') {
        if (!logBox) return;
        const p = document.createElement('p');
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        p.textContent = `[${timeStr}] ${message}`;
        if (type) {
            p.className = `text-${type}`;
        }
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight;
    }

    if (btnClearLogs) {
        btnClearLogs.addEventListener('click', () => {
            if (logBox) logBox.innerHTML = '';
        });
    }

    // AI Predictive Threshold Evaluator
    function evaluateTelemetry(temp, vib, curr) {
        let status = 'healthy'; // 'healthy', 'warning', 'critical'
        let healthVal = 98;
        let failureProb = 2;
        let rulHours = 124;
        let diagnostics = [];

        // Simple threshold equations for project simulation
        const tempDelta = Math.max(0, temp - 80);
        const vibDelta = Math.max(0, vib - 2.5);
        const currDelta = Math.max(0, curr - 15.0);

        // Health reduction calculation
        healthVal -= (tempDelta * 0.8) + (vibDelta * 10) + (currDelta * 3);
        // Ensure bounds
        healthVal = Math.round(Math.max(Math.min(healthVal, 100), 5));
        failureProb = Math.round(100 - healthVal);
        rulHours = Math.round((healthVal / 100) * 124);

        if (temp > 100 || vib > 4.0 || curr > 20.0) {
            status = 'critical';
        } else if (temp > 80 || vib > 2.5 || curr > 15.0) {
            status = 'warning';
        }

        // Generate context-aware recommendations
        if (status === 'healthy') {
            diagnostics.push({
                icon: 'check-circle-2',
                type: 'success',
                title: 'System Balanced',
                desc: 'No anomalies detected. Conveyor drive bearings are in calibration.'
            });
        }

        if (temp > 80) {
            diagnostics.push({
                icon: 'thermometer',
                type: temp > 100 ? 'danger' : 'warning',
                title: temp > 100 ? 'Thermal Runaway Spike' : 'Elevated Temp Detected',
                desc: temp > 100 ? 'Vacuum chamber seals operating beyond thermal capacity. Flush cooling pipelines!' : 'Monitor lamination heater elements. Minor core thermal drift.'
            });
        }

        if (vib > 2.5) {
            diagnostics.push({
                icon: 'activity',
                type: vib > 4.0 ? 'danger' : 'warning',
                title: vib > 4.0 ? 'Severe Bearing Imbalance' : 'Minor Vibration Drift',
                desc: vib > 4.0 ? 'Critical displacement load. Bearing friction high. Shut down line immediately!' : 'Minor orbital wear. Motor base plate check recommended during standard scheduling.'
            });
        }

        if (curr > 15.0) {
            diagnostics.push({
                icon: 'zap',
                type: curr > 20.0 ? 'danger' : 'warning',
                title: curr > 20.0 ? 'Motor Core Overcurrent' : 'Dynamic Friction Overload',
                desc: curr > 20.0 ? 'Winding stress alert. Mechanical lockups detected on guide rails.' : 'Induction coils drawing heavy current. Inspect guide rollers.'
            });
        }

        return { status, healthVal, failureProb, rulHours, diagnostics };
    }

    // Update Dashboard UI Elements
    let lastStatus = 'healthy';
    function updateDashboardUI(temp, vib, curr, animateLogs = true) {
        // Sliders Text
        if (valTemp) valTemp.textContent = temp.toFixed(1);
        if (valVib) valVib.textContent = vib.toFixed(2);
        if (valCurr) valCurr.textContent = curr.toFixed(1);

        // Gauges Values
        if (gaugeTempNum) gaugeTempNum.textContent = Math.round(temp);
        if (gaugeVibNum) gaugeVibNum.textContent = vib.toFixed(2);
        if (gaugeCurrNum) gaugeCurrNum.textContent = curr.toFixed(1);

        // Gauges Circles SVG Offset
        updateGaugeSVG(gaugeTempCircle, temp, 20, 130);
        updateGaugeSVG(gaugeVibCircle, vib, 0.1, 6.0);
        updateGaugeSVG(gaugeCurrCircle, curr, 3, 25);

        // Evaluate state
        const metrics = evaluateTelemetry(temp, vib, curr);

        // Update KPI values
        if (kpiHealth) kpiHealth.textContent = `${metrics.healthVal}%`;
        if (kpiProb) kpiProb.textContent = `${metrics.failureProb}%`;
        if (kpiRul) kpiRul.textContent = metrics.healthVal <= 10 ? 'FAULT / OFF' : `${metrics.rulHours} Hrs`;

        // Style KPIs based on health
        if (kpiHealth) {
            kpiHealth.className = 'kpi-num font-display ' + (metrics.healthVal > 80 ? 'text-emerald' : metrics.healthVal > 50 ? 'text-warning' : 'text-danger');
        }

        // Dynamic State Transitions
        if (aiIndicator && aiTitle && aiIcon) {
            aiIndicator.className = 'ai-status-card ' + metrics.status;
            
            if (metrics.status === 'healthy') {
                aiTitle.textContent = 'NORMAL';
                aiIcon.setAttribute('data-lucide', 'shield-check');
            } else if (metrics.status === 'warning') {
                aiTitle.textContent = 'WARNING: LOAD SPIKE';
                aiIcon.setAttribute('data-lucide', 'alert-triangle');
            } else {
                aiTitle.textContent = 'CRITICAL ANOMALY';
                aiIcon.setAttribute('data-lucide', 'flame');
            }
            lucide.createIcons();
        }

        // Recommendations List Update
        if (recList) {
            recList.innerHTML = '';
            metrics.diagnostics.forEach(rec => {
                const div = document.createElement('div');
                div.className = `rec-item text-${rec.type}`;
                div.innerHTML = `
                    <i data-lucide="${rec.icon}"></i>
                    <div>
                        <strong>${rec.title}</strong>
                        <p>${rec.desc}</p>
                    </div>
                `;
                recList.appendChild(div);
            });
            lucide.createIcons();
        }

        // Log events during state shifts
        if (animateLogs && metrics.status !== lastStatus) {
            if (metrics.status === 'warning') {
                appendLog("AI WARNING: Minor sensor threshold anomaly breach recorded.", "warning");
            } else if (metrics.status === 'critical') {
                appendLog("AI CRITICAL ALERT: Destructive equipment failure imminent! Maintenance recommended.", "danger");
            } else {
                appendLog("Telemetry return to parameters: System operating normal.", "success");
            }
            lastStatus = metrics.status;
        }
    }

    // Slider Listeners
    function attachSliderListeners() {
        [sliderTemp, sliderVib, sliderCurr].forEach(slider => {
            if (!slider) return;
            slider.addEventListener('input', () => {
                const temp = parseFloat(sliderTemp.value);
                const vib = parseFloat(sliderVib.value);
                const curr = parseFloat(sliderCurr.value);
                updateDashboardUI(temp, vib, curr, true);
                
                // Add telemetry log on drag
                if (Math.random() < 0.08) { // rate limit logs slightly during drag
                    appendLog(`Manual Telemetry Override active: T=${temp.toFixed(1)}°C, V=${vib.toFixed(2)}mm/s², C=${curr.toFixed(1)}A`);
                }
            });
        });
    }
    attachSliderListeners();

    // Reset Buttons
    if (btnResetSensors) {
        btnResetSensors.addEventListener('click', () => {
            if (sliderTemp) sliderTemp.value = 45;
            if (sliderVib) sliderVib.value = 1.2;
            if (sliderCurr) sliderCurr.value = 8.5;
            updateDashboardUI(45, 1.2, 8.5, true);
            appendLog("SCADA Alert Overrides fully cleared. Default telemetry streams loaded.", "success");
        });
    }

    // ==========================================================================
    // 7. CHART.JS CONFIGURATION - Dual Mode SCADA Trends
    // ==========================================================================
    const scadaCtx = document.getElementById('scadaLiveChart');
    let scadaChartInstance = null;

    // Simulation Dataset definitions
    let chartTimeLabels = Array.from({length: 12}, (_, i) => `T-${11 - i}s`);
    
    // Telemetry trend variables
    let trendDataTemp = Array.from({length: 12}, () => 40 + Math.random() * 8);
    let trendDataVib = Array.from({length: 12}, () => 0.8 + Math.random() * 0.4);
    let trendDataCurr = Array.from({length: 12}, () => 7 + Math.random() * 2);
    let trendDataHealth = Array.from({length: 12}, () => 95 + Math.random() * 3);

    function initSCADAChart() {
        if (!scadaCtx) return;

        // Custom neon gradient creation
        const gradientCyan = scadaCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientCyan.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        gradientCyan.addColorStop(1, 'rgba(56, 189, 248, 0.00)');

        const gradientEmerald = scadaCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientEmerald.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        gradientEmerald.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

        scadaChartInstance = new Chart(scadaCtx, {
            type: 'line',
            data: {
                labels: chartTimeLabels,
                datasets: [
                    {
                        label: 'Lamination Temperature (°C)',
                        data: trendDataTemp,
                        borderColor: '#38BDF8',
                        borderWidth: 2,
                        backgroundColor: gradientCyan,
                        fill: true,
                        tension: 0.35,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Bearing Vibration (mm/s²)',
                        data: trendDataVib,
                        borderColor: '#F59E0B',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Drive Current (A)',
                        data: trendDataCurr,
                        borderColor: '#3B82F6',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Machine Health Score (%)',
                        data: trendDataHealth,
                        borderColor: '#10B981',
                        borderWidth: 3,
                        backgroundColor: gradientEmerald,
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#94A3B8',
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        titleFont: { family: 'Orbitron' },
                        bodyFont: { family: 'Inter' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#94A3B8' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 0,
                        max: 140,
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#94A3B8' },
                        title: { display: true, text: 'Temp (°C) / Health (%)', color: '#94A3B8' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 26,
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#94A3B8' },
                        title: { display: true, text: 'Vibration (mm/s²) / Current (A)', color: '#94A3B8' }
                    }
                }
            }
        });
    }

    // Simulate Active Live Updates (when not running static simulations)
    let updateIntervalTimer = null;
    function startLiveTelemetryTrend() {
        if (updateIntervalTimer) clearInterval(updateIntervalTimer);

        updateIntervalTimer = setInterval(() => {
            if (currentMode !== 'health') return;

            // Shift label
            chartTimeLabels.push('T-0s');
            chartTimeLabels.shift();
            
            // Generate minor offsets from sliders (simulates fluctuation)
            const baseTemp = parseFloat(sliderTemp.value);
            const baseVib = parseFloat(sliderVib.value);
            const baseCurr = parseFloat(sliderCurr.value);

            const activeTemp = baseTemp + (Math.random() - 0.5) * 1.5;
            const activeVib = Math.max(0.1, baseVib + (Math.random() - 0.5) * 0.1);
            const activeCurr = Math.max(1, baseCurr + (Math.random() - 0.5) * 0.3);
            
            // Re-evaluate health score
            const metrics = evaluateTelemetry(activeTemp, activeVib, activeCurr);

            // Push values
            trendDataTemp.push(activeTemp);
            trendDataVib.push(activeVib);
            trendDataCurr.push(activeCurr);
            trendDataHealth.push(metrics.healthVal);

            // Shift arrays
            trendDataTemp.shift();
            trendDataVib.shift();
            trendDataCurr.shift();
            trendDataHealth.shift();

            // Refresh UI gauges with dynamic offset fluctuation
            updateDashboardUI(activeTemp, activeVib, activeCurr, false);

            // Update Chart
            if (scadaChartInstance && scadaChartInstance.config.type === 'line') {
                scadaChartInstance.update('none'); // silent update
            }
        }, 1200);
    }

    // Toggle live vs model visualization in the panel
    const btnToggleLive = document.getElementById('btn-toggle-telemetry');
    const btnToggleModel = document.getElementById('btn-toggle-model');

    if (btnToggleLive && btnToggleModel) {
        btnToggleLive.addEventListener('click', () => {
            btnToggleLive.classList.add('active');
            btnToggleModel.classList.remove('active');
            
            // Reload standard Live Telemetry Layout
            loadSimulationMode('health');
        });

        btnToggleModel.addEventListener('click', () => {
            btnToggleModel.classList.add('active');
            btnToggleLive.classList.remove('active');
            
            // Launch simulation curve
            loadSimulationMode('rul');
        });
    }

    // ==========================================================================
    // 8. MATLAB SIMULATIONS TRIGGERS & DECK CONTROLLER
    // ==========================================================================
    const simulationCards = document.querySelectorAll('.simulation-card');
    const runSimButtons = document.querySelectorAll('.btn-run-sim');

    function loadSimulationMode(mode) {
        currentMode = mode;

        // Visual State Synchronization (Cards indicators)
        simulationCards.forEach(card => {
            card.classList.remove('active');
            const badge = card.querySelector('.sim-badge');
            const button = card.querySelector('.btn-run-sim');
            
            if (card.getAttribute('data-sim') === mode) {
                card.classList.add('active');
                if (badge) {
                    badge.className = 'sim-badge cyan';
                    badge.textContent = 'ACTIVE';
                }
                if (button) {
                    button.innerHTML = `<i data-lucide="check" class="play-ic"></i> Loaded in Dashboard`;
                }
            } else {
                if (badge) {
                    badge.className = 'sim-badge';
                    badge.textContent = 'STANDBY';
                }
                if (button) {
                    button.innerHTML = `<i data-lucide="play" class="play-ic"></i> Run Simulation`;
                }
            }
        });
        lucide.createIcons();

        // 1. Equipment Health Monitoring Profile
        if (mode === 'health') {
            if (activeModeDisplay) {
                activeModeDisplay.innerHTML = `<i data-lucide="activity"></i> Equipment Health Monitoring`;
            }
            appendLog("Simulation profile loaded: [Equipment Health Monitoring]", "success");
            appendLog("Acquiring raw high-pass sensor streams. Filtering orbital noise.");

            // Reset Sliders
            sliderTemp.value = 45;
            sliderVib.value = 1.2;
            sliderCurr.value = 8.5;
            updateDashboardUI(45, 1.2, 8.5, true);

            // Configure standard Line Telemetry Chart
            if (scadaChartInstance) {
                scadaChartInstance.config.type = 'line';
                scadaChartInstance.config.data.labels = chartTimeLabels;
                scadaChartInstance.config.data.datasets = [
                    {
                        label: 'Lamination Temperature (°C)',
                        data: trendDataTemp,
                        borderColor: '#38BDF8',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Bearing Vibration (mm/s²)',
                        data: trendDataVib,
                        borderColor: '#F59E0B',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Drive Current (A)',
                        data: trendDataCurr,
                        borderColor: '#3B82F6',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Machine Health Score (%)',
                        data: trendDataHealth,
                        borderColor: '#10B981',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    }
                ];
                scadaChartInstance.options.scales.y.max = 140;
                scadaChartInstance.options.scales.y.title.text = 'Temp (°C) / Health (%)';
                scadaChartInstance.options.scales.y1.max = 26;
                scadaChartInstance.options.scales.y1.title.text = 'Vibration (mm/s²) / Current (A)';
                scadaChartInstance.options.scales.y1.display = true;
                scadaChartInstance.update();
            }
            startLiveTelemetryTrend();
        }

        // 2. AI Failure Prediction Profile (Confusion Matrix / Classification)
        else if (mode === 'failure') {
            if (activeModeDisplay) {
                activeModeDisplay.innerHTML = `<i data-lucide="brain-circuit"></i> AI Failure Prediction`;
            }
            appendLog("Simulation profile loaded: [AI Failure Prediction Random Forest]");
            appendLog("Computing Decision Tree branches. Out-of-bag error rate: 5.4%");
            
            // Set slider to border line warning threshold to show prediction engine active
            sliderTemp.value = 92;
            sliderVib.value = 3.20;
            sliderCurr.value = 16.5;
            updateDashboardUI(92, 3.20, 16.5, true);

            // Re-render chart to show dynamic Predictive Classifier Confidence Plot
            if (scadaChartInstance) {
                scadaChartInstance.config.type = 'line';
                scadaChartInstance.config.data.labels = ['Tree 10', 'Tree 20', 'Tree 30', 'Tree 40', 'Tree 50', 'Tree 60', 'Tree 70', 'Tree 80', 'Tree 90', 'Tree 100'];
                
                scadaChartInstance.config.data.datasets = [
                    {
                        label: 'Random Forest Prediction Classifier Confidence (%)',
                        data: [72, 78, 83, 85, 89, 91, 92.4, 92.4, 92.4, 92.4],
                        borderColor: '#38BDF8',
                        borderWidth: 3,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        fill: true,
                        tension: 0.2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'F-1 Score Benchmark Threshold (%)',
                        data: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
                        borderColor: '#EF4444',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        fill: false,
                        tension: 0,
                        yAxisID: 'y'
                    }
                ];
                scadaChartInstance.options.scales.y.max = 100;
                scadaChartInstance.options.scales.y.title.text = 'Model Confidence Rating';
                scadaChartInstance.options.scales.y1.display = false; // Hide 2nd Y axis
                scadaChartInstance.update();
            }
        }

        // 3. RUL Forecasting Curve
        else if (mode === 'rul') {
            if (activeModeDisplay) {
                activeModeDisplay.innerHTML = `<i data-lucide="hourglass"></i> Remaining Useful Life (RUL)`;
            }
            appendLog("Simulation profile loaded: [RUL Exponential Degradation Forecast]", "warning");
            appendLog("Applying continuous physics-based model equations. Confidence interval: 95%.");

            sliderTemp.value = 112;
            sliderVib.value = 4.8;
            sliderCurr.value = 21.5;
            updateDashboardUI(112, 4.8, 21.5, true);

            // Re-render chart to show RUL degradation curve
            if (scadaChartInstance) {
                scadaChartInstance.config.type = 'line';
                scadaChartInstance.config.data.labels = ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 22', 'Day 24 (T-0)', 'Forecast +12h', 'Forecast +24h', 'Forecast +36h'];
                
                scadaChartInstance.config.data.datasets = [
                    {
                        label: 'Machinery Structural Health degradation (%)',
                        data: [98, 95, 91, 84, 76, 62, 45, 30, 18, 5],
                        borderColor: '#EF4444',
                        borderWidth: 3,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'RUL Safety Threshold Lower Limit',
                        data: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
                        borderColor: '#F59E0B',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        fill: false,
                        tension: 0,
                        yAxisID: 'y'
                    }
                ];
                scadaChartInstance.options.scales.y.max = 100;
                scadaChartInstance.options.scales.y.title.text = 'Overall Health Index';
                scadaChartInstance.options.scales.y1.display = false;
                scadaChartInstance.update();
            }
        }

        // 4. Downtime Savings Studies
        else if (mode === 'downtime') {
            if (activeModeDisplay) {
                activeModeDisplay.innerHTML = `<i data-lucide="bar-chart-3"></i> Downtime Savings Analysis`;
            }
            appendLog("Simulation profile loaded: [Downtime Mitigation Analysis]", "success");
            appendLog("Generating analytical matrix. Traditional schedules vs. AegisPV predictive schedules.");

            sliderTemp.value = 45;
            sliderVib.value = 1.2;
            sliderCurr.value = 8.5;
            updateDashboardUI(45, 1.2, 8.5, true);

            // Re-render chart to show Optimized downtime curves (bar chart)
            if (scadaChartInstance) {
                scadaChartInstance.config.type = 'bar';
                scadaChartInstance.config.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                scadaChartInstance.config.data.datasets = [
                    {
                        label: 'Reactive Downtime (Hours Loss)',
                        data: [12, 8, 15, 6, 22, 14, 9, 30, 11, 18, 5, 24],
                        backgroundColor: 'rgba(239, 68, 68, 0.45)',
                        borderColor: '#EF4444',
                        borderWidth: 1.5,
                        yAxisID: 'y'
                    },
                    {
                        label: 'AegisPV AI-Predictive Downtime (Hours Loss)',
                        data: [3, 2, 4, 1, 3, 5, 2, 6, 3, 4, 1, 3],
                        backgroundColor: 'rgba(16, 185, 129, 0.45)',
                        borderColor: '#10B981',
                        borderWidth: 1.5,
                        yAxisID: 'y'
                    }
                ];
                scadaChartInstance.options.scales.y.max = 35;
                scadaChartInstance.options.scales.y.title.text = 'Downtime Duration (Hours)';
                scadaChartInstance.options.scales.y1.display = false;
                scadaChartInstance.update();
            }
        }
    }

    // Attach MATLAB simulation triggers to buttons
    runSimButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.currentTarget.closest('.simulation-card');
            if (card) {
                const simMode = card.getAttribute('data-sim');
                
                // Load Simulation Config
                loadSimulationMode(simMode);
                
                // Scroll to dashboard smoothly
                const dashboardSec = document.getElementById('dashboard');
                if (dashboardSec) {
                    window.scrollTo({
                        top: dashboardSec.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // 9. RESULTS SECTION BAR CHART PLOTTING
    // ==========================================================================
    const resultsCtx = document.getElementById('resultsComparisonChart');
    if (resultsCtx) {
        const gradientRed = resultsCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientRed.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        gradientRed.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

        const gradientGreen = resultsCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradientGreen.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        gradientGreen.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

        new Chart(resultsCtx, {
            type: 'bar',
            data: {
                labels: ['Line #1 (Heating)', 'Line #2 (Solder)', 'Line #3 (Glass)', 'Line #4 (Lam)', 'Line #5 (Trim)', 'Line #6 (Framing)'],
                datasets: [
                    {
                        label: 'Standard Preventive Schedule (Downtime Hrs)',
                        data: [154, 182, 120, 196, 144, 110],
                        backgroundColor: gradientRed,
                        borderColor: '#EF4444',
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'AegisPV AI-Predictive Maintenance (Downtime Hrs)',
                        data: [115, 136, 92, 142, 108, 82],
                        backgroundColor: gradientGreen,
                        borderColor: '#10B981',
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#94A3B8',
                            font: { family: 'Inter', size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#94A3B8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#94A3B8' },
                        title: { display: true, text: 'Total Annual Downtime (Hours)', color: '#94A3B8' }
                    }
                }
            }
        });
    }

    // ==========================================================================
    // 10. CONTACT FORM HANDLER WITH FUTURISTIC SUBMISSION STAGES
    // ==========================================================================
    const contactForm = document.getElementById('project-contact-form');
    const formSuccessBox = document.getElementById('form-success-box');
    const btnSuccessReset = document.getElementById('btn-success-reset');
    const btnSubmit = document.getElementById('btn-submit-contact');

    if (contactForm && formSuccessBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Dynamic submission animation
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Processing Payload...`;
                lucide.createIcons();
            }

            // Mock network delays
            setTimeout(() => {
                contactForm.style.opacity = '0';
                contactForm.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccessBox.style.display = 'flex';
                    
                    // Trigger reflow for transition
                    setTimeout(() => {
                        formSuccessBox.classList.add('active');
                    }, 50);
                }, 400);

            }, 1800);
        });
    }

    if (btnSuccessReset && contactForm && formSuccessBox) {
        btnSuccessReset.addEventListener('click', () => {
            formSuccessBox.classList.remove('active');
            
            setTimeout(() => {
                formSuccessBox.style.display = 'none';
                contactForm.style.display = 'flex';
                contactForm.reset();
                
                setTimeout(() => {
                    contactForm.style.opacity = '1';
                    contactForm.style.transform = 'scale(1)';
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = `<i data-lucide="send"></i> Send Query Payload`;
                        lucide.createIcons();
                    }
                }, 50);
            }, 400);
        });
    }

    // ==========================================================================
    // 11. TAB TOGGLING AND REAL-TIME CSV TELEMETRY PLAYER
    // ==========================================================================
    const tabSliders = document.getElementById('tab-btn-sliders');
    const tabCsv = document.getElementById('tab-btn-csv');
    const paneSliders = document.getElementById('sliders-control-pane');
    const paneCsv = document.getElementById('csv-control-pane');

    if (tabSliders && tabCsv && paneSliders && paneCsv) {
        tabSliders.addEventListener('click', () => {
            tabSliders.classList.add('active');
            tabCsv.classList.remove('active');
            paneSliders.classList.remove('hidden');
            paneCsv.classList.add('hidden');
        });

        tabCsv.addEventListener('click', () => {
            tabCsv.classList.add('active');
            tabSliders.classList.remove('active');
            paneCsv.classList.remove('hidden');
            paneSliders.classList.add('hidden');
        });
    }

    // CSV Telemetry Stream variables
    let csvPlayInterval = null;
    let csvDataList = [];
    let csvCurrentIndex = 0;

    const btnPlayCsv = document.getElementById('btn-play-csv');
    const btnStopCsv = document.getElementById('btn-stop-csv');
    const csvDataInput = document.getElementById('csv-data-input');
    const csvStatusText = document.getElementById('csv-status-text');
    const csvProgressText = document.getElementById('csv-progress-text');

    function parseCSVText(text) {
        const rows = text.trim().split('\n');
        if (rows.length < 2) return [];
        
        const headers = rows[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const record = {};
                headers.forEach((header, idx) => {
                    const val = values[idx];
                    record[header] = isNaN(val) ? val : parseFloat(val);
                });
                data.push(record);
            }
        }
        return data;
    }

    function stopCsvStream() {
        if (csvPlayInterval) {
            clearInterval(csvPlayInterval);
            csvPlayInterval = null;
        }
        if (btnPlayCsv) btnPlayCsv.disabled = false;
        if (btnStopCsv) btnStopCsv.disabled = true;
        if (csvStatusText) {
            csvStatusText.textContent = "IDLE";
            csvStatusText.className = "text-cyan";
        }
        appendLog("CSV hardware telemetry stream halted.", "warning");
        
        // Restore standard telemetry monitoring loop
        currentMode = 'health';
        if (activeModeDisplay) {
            activeModeDisplay.innerHTML = `<i data-lucide="activity"></i> Equipment Health Monitoring`;
        }
        lucide.createIcons();
        startLiveTelemetryTrend();
    }

    function startCsvStream() {
        // Parse CSV data
        const rawCsv = csvDataInput ? csvDataInput.value : '';
        csvDataList = parseCSVText(rawCsv);
        
        if (csvDataList.length === 0) {
            alert("No valid telemetry CSV rows detected. Please check headers and values!");
            return;
        }

        // Stop standard live telemetry loops
        if (updateIntervalTimer) clearInterval(updateIntervalTimer);
        if (csvPlayInterval) clearInterval(csvPlayInterval);
        
        currentMode = 'csv-playback';
        csvCurrentIndex = 0;
        
        if (activeModeDisplay) {
            activeModeDisplay.innerHTML = `<i data-lucide="database"></i> CSV Hardware Stream`;
        }
        lucide.createIcons();

        if (btnPlayCsv) btnPlayCsv.disabled = true;
        if (btnStopCsv) btnStopCsv.disabled = false;
        if (csvStatusText) {
            csvStatusText.textContent = "STREAMING...";
            csvStatusText.className = "text-emerald";
        }

        appendLog(`CSV hardware telemetry initiated: ${csvDataList.length} rows loaded.`, "success");

        csvPlayInterval = setInterval(() => {
            if (csvCurrentIndex >= csvDataList.length) {
                // Playback complete
                appendLog("CSV hardware telemetry stream complete. Returning to live mode.", "success");
                stopCsvStream();
                return;
            }

            const record = csvDataList[csvCurrentIndex];
            
            // Extract values
            const temp = record.Temperature_C || record.temperature || 45.0;
            const vib = record.Vibration_mm_s2 || record.vibration || 1.2;
            const curr = record.Current_A || record.current || 8.5;
            
            // Use Health & Failure overrides from CSV if available
            const health = record.Machine_Health || record.health || 98;
            const failure = record.Failure_Probability || record.failure || 2;
            const status = record.Status || record.status || 'Normal';

            // Sync Sliders positions
            if (sliderTemp) sliderTemp.value = temp;
            if (sliderVib) sliderVib.value = vib;
            if (sliderCurr) sliderCurr.value = curr;

            // Sync Gauges & metrics
            updateDashboardUI(temp, vib, curr, false);

            // Directly overwrite KPIs with CSV's exact custom values!
            if (kpiHealth) kpiHealth.textContent = `${health}%`;
            if (kpiProb) kpiProb.textContent = `${failure}%`;
            if (kpiRul) kpiRul.textContent = health <= 10 ? 'FAULT / OFF' : `${Math.round((health/100)*124)} Hrs`;
            
            // Style health text
            if (kpiHealth) {
                kpiHealth.className = 'kpi-num font-display ' + (health > 80 ? 'text-emerald' : health > 50 ? 'text-warning' : 'text-danger');
            }

            // Sync AI indicator state directly with CSV status
            const statusLower = status.toLowerCase();
            if (aiIndicator && aiTitle && aiIcon) {
                if (statusLower === 'normal') {
                    aiIndicator.className = 'ai-status-card healthy';
                    aiTitle.textContent = 'NORMAL';
                    aiIcon.setAttribute('data-lucide', 'shield-check');
                } else if (statusLower === 'warning') {
                    aiIndicator.className = 'ai-status-card warning';
                    aiTitle.textContent = 'WARNING: DEGRADATION';
                    aiIcon.setAttribute('data-lucide', 'alert-triangle');
                } else if (statusLower === 'critical') {
                    aiIndicator.className = 'ai-status-card critical';
                    aiTitle.textContent = 'CRITICAL ANOMALY';
                    aiIcon.setAttribute('data-lucide', 'flame');
                } else if (statusLower === 'failure') {
                    aiIndicator.className = 'ai-status-card critical';
                    aiTitle.textContent = 'HARDWARE FAILURE';
                    aiIcon.setAttribute('data-lucide', 'zap-off');
                }
                lucide.createIcons();
            }

            // Push CSV telemetry directly to Live Chart.js datasets
            chartTimeLabels.push(`Row-${record.Timestamp}`);
            chartTimeLabels.shift();
            
            trendDataTemp.push(temp);
            trendDataVib.push(vib);
            trendDataCurr.push(curr);
            trendDataHealth.push(health);
            
            trendDataTemp.shift();
            trendDataVib.shift();
            trendDataCurr.shift();
            trendDataHealth.shift();

            if (scadaChartInstance && scadaChartInstance.config.type === 'line') {
                scadaChartInstance.update('none');
            }

            // Log details
            appendLog(`[CSV-RX] Packet #${record.Timestamp}: Temp=${temp}°C, Vib=${vib}mm/s², Health=${health}%, Status=${status}`, 
                      statusLower === 'normal' ? 'success' : statusLower === 'warning' ? 'warning' : 'danger');

            // Update Progress UI
            csvCurrentIndex++;
            if (csvProgressText) {
                csvProgressText.textContent = `Stream progress: ${csvCurrentIndex}/${csvDataList.length} packets`;
            }

        }, 1000);
    }

    if (btnPlayCsv) {
        btnPlayCsv.addEventListener('click', startCsvStream);
    }
    if (btnStopCsv) {
        btnStopCsv.addEventListener('click', stopCsvStream);
    }

    // Initial Dashboard Setup and Telemetry Stream loop activation
    updateDashboardUI(45, 1.2, 8.5, false);
    initSCADAChart();
    startLiveTelemetryTrend();
});
