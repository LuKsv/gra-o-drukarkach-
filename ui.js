class GameUI {
    constructor() {
        this.screens = {
            waiting: document.getElementById('waiting-screen'),
            order: document.getElementById('order-screen'),
            settings: document.getElementById('settings-screen'),
            printing: document.getElementById('printing-screen'),
            result: document.getElementById('result-screen'),
        };

        this.elements = {
            money: document.getElementById('money-display'),
            reputation: document.getElementById('reputation-display'),
            level: document.getElementById('level-display'),

            orderTitle: document.getElementById('order-title'),
            orderClient: document.getElementById('order-client'),
            orderModel: document.getElementById('order-model'),
            orderMaterial: document.getElementById('order-material'),
            orderRequirements: document.getElementById('order-requirements'),
            orderDeadline: document.getElementById('order-deadline'),
            orderBudget: document.getElementById('order-budget'),

            nozzleTemp: document.getElementById('nozzle-temp'),
            nozzleTempValue: document.getElementById('nozzle-temp-value'),
            bedTemp: document.getElementById('bed-temp'),
            bedTempValue: document.getElementById('bed-temp-value'),
            layerHeight: document.getElementById('layer-height'),
            layerHeightValue: document.getElementById('layer-height-value'),
            infill: document.getElementById('infill'),
            infillValue: document.getElementById('infill-value'),
            printSpeed: document.getElementById('print-speed'),
            printSpeedValue: document.getElementById('print-speed-value'),
            useSupport: document.getElementById('use-support'),
            estimatedTime: document.getElementById('estimated-time'),
            filamentCost: document.getElementById('filament-cost'),

            printProgress: document.getElementById('print-progress'),
            printStatus: document.getElementById('print-status'),
            printInfo: document.getElementById('print-info'),
            printModel: document.getElementById('print-model'),

            resultTitle: document.getElementById('result-title'),
            resultEmoji: document.getElementById('result-emoji'),
            resultVerdict: document.getElementById('result-verdict'),
            resultDescription: document.getElementById('result-description'),
            resultQuality: document.getElementById('result-quality'),
            resultEarnings: document.getElementById('result-earnings'),
            resultTip: document.getElementById('result-tip'),
            resultTotal: document.getElementById('result-total'),
            resultReputation: document.getElementById('result-reputation'),

            totalPrints: document.getElementById('total-prints'),
            avgRating: document.getElementById('avg-rating'),
            totalEarnings: document.getElementById('total-earnings'),

            menuOverlay: document.getElementById('menu-overlay'),
            sideMenu: document.getElementById('side-menu'),
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Główny menu
        const menuBtn = document.getElementById('menu-toggle');
        if (menuBtn) menuBtn.addEventListener('click', () => this.toggleMenu());

        this.elements.menuOverlay.addEventListener('click', () => this.toggleMenu());
        document.getElementById('menu-close-btn').addEventListener('click', () => this.toggleMenu());

        // Ustawienia druku
        this.elements.nozzleTemp.addEventListener('input', (e) => {
            this.elements.nozzleTempValue.textContent = e.target.value;
        });
        this.elements.bedTemp.addEventListener('input', (e) => {
            this.elements.bedTempValue.textContent = e.target.value;
        });
        this.elements.layerHeight.addEventListener('input', (e) => {
            this.elements.layerHeightValue.textContent = parseFloat(e.target.value).toFixed(2);
        });
        this.elements.infill.addEventListener('input', (e) => {
            this.elements.infillValue.textContent = e.target.value;
        });
        this.elements.printSpeed.addEventListener('input', (e) => {
            this.elements.printSpeedValue.textContent = e.target.value;
        });
    }

    createMenuToggle() {
        const btn = document.createElement('button');
        btn.id = 'menu-toggle';
        btn.innerHTML = '☰';
        btn.style.cssText = `
            position: fixed;
            top: 12px;
            right: 12px;
            background: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 8px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 50;
        `;
        btn.setAttribute('data-menu-toggle', 'true');
        document.body.appendChild(btn);
        return btn;
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    displayOrder(order) {
        this.elements.orderClient.textContent = `${order.customerEmoji} ${order.customer}`;
        this.elements.orderModel.textContent = `${order.modelEmoji} ${order.model}`;
        this.elements.orderMaterial.textContent = order.material;
        this.elements.orderRequirements.textContent = order.requirement;
        this.elements.orderDeadline.textContent = `${order.deadline} dni`;
        this.elements.orderBudget.textContent = `${order.budget} zł`;
    }

    getSettings() {
        return {
            nozzleTemp: parseInt(this.elements.nozzleTemp.value),
            bedTemp: parseInt(this.elements.bedTemp.value),
            layerHeight: parseFloat(this.elements.layerHeight.value),
            infill: parseInt(this.elements.infill.value),
            printSpeed: parseInt(this.elements.printSpeed.value),
            useSupport: this.elements.useSupport.checked,
        };
    }

    setDefaultSettings(material) {
        const config = TRANSLATIONS[LANG].materials[material];
        const midNozzle = Math.round((config.tempNozzle[0] + config.tempNozzle[1]) / 2);
        const midBed = Math.round((config.tempBed[0] + config.tempBed[1]) / 2);

        this.elements.nozzleTemp.value = midNozzle;
        this.elements.nozzleTempValue.textContent = midNozzle;
        this.elements.nozzleTemp.min = config.tempNozzle[0];
        this.elements.nozzleTemp.max = config.tempNozzle[1];

        this.elements.bedTemp.value = midBed;
        this.elements.bedTempValue.textContent = midBed;
        this.elements.bedTemp.min = config.tempBed[0];
        this.elements.bedTemp.max = config.tempBed[1];
    }

    updateStats(save) {
        this.elements.money.textContent = `${save.money} zł`;
        this.elements.reputation.textContent = `${Math.round(save.reputation)}%`;
        this.elements.level.textContent = save.level;

        this.elements.totalPrints.textContent = save.totalPrints;
        this.elements.avgRating.textContent = save.getAverageRating();
        this.elements.totalEarnings.textContent = `${save.totalEarnings} zł`;
    }

    updateEstimatedTime(material, settings) {
        const config = TRANSLATIONS[LANG].materials[material];
        const baseTime = 100 / (settings.layerHeight * 10) * (150 / settings.printSpeed);
        const minutes = Math.floor(baseTime);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        this.elements.estimatedTime.textContent = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    }

    updateFilamentCost(filamentCost) {
        this.elements.filamentCost.textContent = `${filamentCost} zł`;
    }

    updatePrintProgress(percent, elapsed, total) {
        this.elements.printProgress.style.width = `${percent}%`;
        const elapsedMins = Math.floor(elapsed / 60);
        const totalMins = Math.floor(total / 60);
        this.elements.printStatus.textContent = `${percent}% - ${elapsedMins}min / ${totalMins}min`;
    }

    setPrintInfo(text) {
        this.elements.printInfo.textContent = text;
    }

    displayResult(quality, earnings, tip, reputation) {
        let verdict, description, emoji;

        if (quality > 0.8) {
            verdict = 'Idealny wydruk!';
            description = 'Klient będzie zachwycony! 🎉';
            emoji = '✅';
        } else if (quality > 0.5) {
            verdict = 'Dobry wydruk';
            description = 'Klient jest zadowolony.';
            emoji = '👍';
        } else if (quality > 0.2) {
            verdict = 'Wydruk z wadami';
            description = 'Klient nie jest zadowolony.';
            emoji = '⚠️';
        } else {
            verdict = 'Druk nie powiódł się';
            description = 'Klient żąda zwrotu pieniędzy.';
            emoji = '❌';
        }

        this.elements.resultVerdict.textContent = verdict;
        this.elements.resultDescription.textContent = description;
        this.elements.resultEmoji.textContent = emoji;
        this.elements.resultQuality.textContent = `${Math.round(quality * 100)}%`;
        this.elements.resultEarnings.textContent = `${Math.round(earnings)} zł`;
        this.elements.resultTip.textContent = `${Math.round(tip)} zł`;
        this.elements.resultTotal.textContent = `${Math.round(earnings + tip)} zł`;
        this.elements.resultReputation.textContent = `${reputation > 0 ? '+' : ''}${reputation}%`;
    }

    toggleMenu() {
        this.elements.sideMenu.classList.toggle('active');
        this.elements.menuOverlay.classList.toggle('active');
    }
}
