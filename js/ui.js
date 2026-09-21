// UI Management

class UI {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // View management
    switchView(viewName) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const view = document.getElementById(`view-${viewName}`);
        if (view) view.classList.add('active');
    }

    // Dashboard
    renderDashboard() {
        this.updateDashboardStats();
        this.renderOrdersList();
    }

    updateDashboardStats() {
        document.getElementById('stat-money').textContent = `${this.gameState.money} PLN`;
        document.getElementById('stat-printers').textContent = this.gameState.printers.length;

        const stars = '⭐'.repeat(Math.min(this.gameState.reputation, 5));
        document.getElementById('stat-reputation').textContent = stars || '⭐⭐⭐';
    }

    renderOrdersList() {
        const list = document.getElementById('orders-list');
        list.innerHTML = '';

        this.gameState.availableOrders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-card-header">
                    <h3>${order.title}</h3>
                    <span class="order-price">${order.basePrice} PLN</span>
                </div>
                <div class="order-card-body">
                    <p><strong>Klient:</strong> ${order.client}</p>
                    <p><strong>Opis:</strong> ${order.description}</p>
                    <p><strong>Wymagania:</strong> ${order.requirements}</p>
                    <p><strong>Termin:</strong> ${order.deadline}</p>
                </div>
                <button class="btn-accept-order" data-order-id="${order.id}">Przyjmij zlecenie</button>
            `;
            card.querySelector('.btn-accept-order').addEventListener('click', () => {
                this.selectOrder(order.id);
            });
            list.appendChild(card);
        });
    }

    selectOrder(orderId) {
        this.gameState.selectOrder(orderId);
        this.renderOrderDetail();
        this.switchView('order');
    }

    renderOrderDetail() {
        const order = this.gameState.currentOrder;
        if (!order) return;

        document.getElementById('order-title').textContent = order.title;

        const detail = document.getElementById('order-detail');
        detail.innerHTML = `
            <div class="order-info">
                <h3>Szczegóły zlecenia</h3>
                <p><strong>Klient:</strong> ${order.client}</p>
                <p><strong>Opis:</strong> ${order.description}</p>
                <p><strong>Cena:</strong> ${order.basePrice} PLN</p>
                <p><strong>Termin:</strong> ${order.deadline}</p>
                <p><strong>Wymagania:</strong> ${order.requirements}</p>

                <div class="model-info">
                    <h4>Parametry modelu</h4>
                    <p>Rozmiar: ${order.model.size}</p>
                    <p>Waga: ${order.model.weight}g</p>
                    <p>Zwisy (wymaga podpór): ${order.model.hasOverhangs ? 'TAK' : 'NIE'}</p>
                </div>
            </div>
        `;

        this.renderPrintSettings();
    }

    renderPrintSettings() {
        const order = this.gameState.currentOrder;
        const form = document.getElementById('print-settings-form');
        form.innerHTML = '';

        // Material
        const materialDiv = document.createElement('div');
        materialDiv.className = 'setting-group';
        materialDiv.innerHTML = `
            <label>Materiał:</label>
            <select id="setting-material" required>
                ${Object.entries(MATERIALS).map(([key, mat]) =>
                    `<option value="${key}">${mat.name} (${mat.cost} PLN/kg)</option>`
                ).join('')}
            </select>
            <small id="material-info"></small>
        `;
        form.appendChild(materialDiv);

        // Layer height
        const layerDiv = document.createElement('div');
        layerDiv.className = 'setting-group';
        layerDiv.innerHTML = `
            <label>Wysokość warstwy:</label>
            <select id="setting-layer-height" required>
                ${LAYER_HEIGHTS.map(h =>
                    `<option value="${h}">${h}mm ${h === 0.2 ? '(standard)' : ''}</option>`
                ).join('')}
            </select>
            <small>0.1mm = ładnie ale wolno, 0.3mm = szybko ale gorzej</small>
        `;
        form.appendChild(layerDiv);

        // Infill
        const infillDiv = document.createElement('div');
        infillDiv.className = 'setting-group';
        infillDiv.innerHTML = `
            <label>Wypełnienie:</label>
            <select id="setting-infill" required>
                ${INFILL_PERCENTAGES.map(p =>
                    `<option value="${p}">${p}% ${p === 20 ? '(standard)' : ''}</option>`
                ).join('')}
            </select>
            <small>10% = leciutkie, 100% = solid jak skała</small>
        `;
        form.appendChild(infillDiv);

        // Infill pattern
        const patternDiv = document.createElement('div');
        patternDiv.className = 'setting-group';
        patternDiv.innerHTML = `
            <label>Wzór wypełnienia:</label>
            <select id="setting-pattern" required>
                ${INFILL_PATTERNS.map(p =>
                    `<option value="${p}">${p}</option>`
                ).join('')}
            </select>
        `;
        form.appendChild(patternDiv);

        // Supports
        const supportsDiv = document.createElement('div');
        supportsDiv.className = 'setting-group checkbox';
        supportsDiv.innerHTML = `
            <label>
                <input type="checkbox" id="setting-supports">
                <span>Włącz podpory</span>
            </label>
            <small>Potrzebujesz, jeśli są zwisy > 45°</small>
        `;
        form.appendChild(supportsDiv);

        // Speed
        const speedDiv = document.createElement('div');
        speedDiv.className = 'setting-group';
        speedDiv.innerHTML = `
            <label>Prędkość druku:</label>
            <select id="setting-speed" required>
                ${PRINT_SPEEDS.map(s =>
                    `<option value="${s}">${s} mm/s ${s === 60 ? '(standard)' : ''}</option>`
                ).join('')}
            </select>
            <small>30 = ładnie, 100 = szybko</small>
        `;
        form.appendChild(speedDiv);

        // Adhesion
        const adhesionDiv = document.createElement('div');
        adhesionDiv.className = 'setting-group';
        adhesionDiv.innerHTML = `
            <label>Przyczepność:</label>
            <select id="setting-adhesion" required>
                ${ADHESION_MODES.map(m =>
                    `<option value="${m}">${m === 'none' ? 'Brak' : m === 'brim' ? 'Brim' : 'Raft'}</option>`
                ).join('')}
            </select>
            <small>Brim = mały pierścień, Raft = gruba podkład</small>
        `;
        form.appendChild(adhesionDiv);

        // Set default values based on ideal settings if available
        if (this.gameState.currentOrder?.model.idealSettings) {
            const ideal = this.gameState.currentOrder.model.idealSettings;
            document.getElementById('setting-material').value = ideal.material;
            document.getElementById('setting-layer-height').value = ideal.layerHeight;
            document.getElementById('setting-infill').value = ideal.infill;
            document.getElementById('setting-pattern').value = ideal.pattern;
            document.getElementById('setting-supports').checked = ideal.supports;
            document.getElementById('setting-speed').value = ideal.speed;
            document.getElementById('setting-adhesion').value = ideal.adhesion;
        } else {
            // Default safe values
            document.getElementById('setting-material').value = 'PLA';
            document.getElementById('setting-layer-height').value = 0.2;
            document.getElementById('setting-infill').value = 20;
            document.getElementById('setting-pattern').value = 'grid';
            document.getElementById('setting-speed').value = 60;
            document.getElementById('setting-adhesion').value = 'none';
        }

        // Material info
        document.getElementById('setting-material').addEventListener('change', (e) => {
            const mat = MATERIALS[e.target.value];
            document.getElementById('material-info').textContent =
                `Dysza: ${mat.nozzleTemp}°C | Stół: ${mat.bedTemp}°C | ${mat.description}`;
        });

        // Trigger initial material info
        document.getElementById('setting-material').dispatchEvent(new Event('change'));
    }

    // Printing simulation
    startPrintingSimulation() {
        // Collect settings
        const settings = {
            material: document.getElementById('setting-material').value,
            layerHeight: parseFloat(document.getElementById('setting-layer-height').value),
            infill: parseInt(document.getElementById('setting-infill').value),
            pattern: document.getElementById('setting-pattern').value,
            supports: document.getElementById('setting-supports').checked,
            speed: parseInt(document.getElementById('setting-speed').value),
            adhesion: document.getElementById('setting-adhesion').value
        };

        this.gameState.savePrintSettings(settings);
        this.switchView('printing');
        this.simulatePrint();
    }

    simulatePrint() {
        const duration = this.gameState.getPrintDuration(this.gameState.currentPrintSettings);
        const startTime = Date.now();
        const endTime = startTime + (duration * 1000);

        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(100, (elapsed / (duration * 1000)) * 100);

            document.getElementById('progress-fill').style.width = `${progress}%`;
            document.getElementById('printing-time').textContent =
                `Czas: ${Math.floor(elapsed / 1000)}s / ${duration}s`;
            document.getElementById('filament-progress').style.height = `${progress}%`;

            if (elapsed < duration * 1000) {
                requestAnimationFrame(updateProgress);
            } else {
                this.showPrintResult();
            }
        };

        updateProgress();

        // Fast forward button
        document.getElementById('btn-fast-forward').addEventListener('click', () => {
            this.showPrintResult();
        }, { once: true });
    }

    showPrintResult() {
        const result = this.gameState.calculateResult();

        document.getElementById('result-title').textContent = result.status;

        const status = document.getElementById('result-status');
        const stars = '⭐'.repeat(result.stars) + '☆'.repeat(5 - result.stars);
        status.innerHTML = `
            <div class="stars">${stars}</div>
            <h2>${result.status}</h2>
        `;

        document.getElementById('result-explanation').textContent = result.explanation;
        document.getElementById('result-base-price').textContent = `${this.gameState.currentOrder.basePrice} PLN`;
        document.getElementById('result-multiplier').textContent = `${result.multiplier.toFixed(1)}x`;

        const totalEarnings = Math.floor(this.gameState.currentOrder.basePrice * result.multiplier);
        document.getElementById('result-total').textContent = `${totalEarnings} PLN`;

        this.switchView('result');
    }

    collectReward() {
        const printResult = this.gameState.collectReward();
        this.updateDashboardStats();
        this.switchView('dashboard');
    }

    // Encyclopedia
    renderEncyclopedia() {
        const list = document.getElementById('encyclopedia-list');
        list.innerHTML = '';

        Object.entries(ENCYCLOPEDIA_ARTICLES).forEach(([id, article]) => {
            const isUnlocked = this.gameState.unlockedArticles.includes(id) || id === 'materials_intro' || id === 'pla_guide';

            const card = document.createElement('div');
            card.className = `encyclopedia-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <h3>${article.title}</h3>
                ${isUnlocked ? `<p>${article.content}</p>` : `<p><em>Zdobędziesz tę wiedzę podczas gry...</em></p>`}
            `;
            list.appendChild(card);
        });
    }

    // Settings
    renderSettings() {
        document.getElementById('setting-sound').checked = this.gameState.settings.soundEnabled;
        document.getElementById('setting-no-ads').checked = this.gameState.settings.noAds;
        document.getElementById('setting-language').value = this.gameState.settings.language;
    }

    updateSettings() {
        this.gameState.settings.soundEnabled = document.getElementById('setting-sound').checked;
        this.gameState.settings.noAds = document.getElementById('setting-no-ads').checked;
        this.gameState.settings.language = document.getElementById('setting-language').value;
        Storage.save(this.gameState);
    }
}
