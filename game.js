class Game {
    constructor() {
        this.ui = new GameUI();
        this.save = new GameSave();
        this.orderGen = new OrderGenerator();
        this.printEngine = new PrintEngine();

        this.currentOrder = null;
        this.currentPrintResult = null;
        this.isPrinting = false;
        this.printStartTime = 0;
        this.printDuration = 0;
        this.printSpeedMultiplier = 1;

        this.setupEventListeners();
        this.init();
    }

    init() {
        this.ui.updateStats(this.save);
        this.ui.showScreen('waiting');
    }

    setupEventListeners() {
        // Oczekiwanie na zlecenie
        document.getElementById('get-order-btn').addEventListener('click', () => this.generateOrder());

        // Zlecenie
        document.getElementById('accept-order-btn').addEventListener('click', () => this.acceptOrder());
        document.getElementById('reject-order-btn').addEventListener('click', () => this.rejectOrder());

        // Ustawienia
        document.getElementById('start-print-btn').addEventListener('click', () => this.startPrint());
        document.getElementById('cancel-print-btn').addEventListener('click', () => this.cancelOrder());

        // Drukowanie
        document.getElementById('speedup-btn').addEventListener('click', () => this.toggleSpeedup());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());

        // Wynik
        document.getElementById('continue-btn').addEventListener('click', () => this.finishOrder());

        // Menu
        document.getElementById('reset-game-btn').addEventListener('click', () => {
            if (confirm('Czy na pewno chcesz resetować grę? Utracisz wszystko.')) {
                this.save.reset();
                this.ui.updateStats(this.save);
                this.init();
            }
        });
    }

    generateOrder() {
        this.currentOrder = this.orderGen.generate();
        this.ui.displayOrder(this.currentOrder);
        this.ui.showScreen('order');
    }

    acceptOrder() {
        this.ui.setDefaultSettings(this.currentOrder.material);
        this.ui.updateEstimatedTime(this.currentOrder.material, this.ui.getSettings());

        // Recalc on every setting change
        const updateCalcs = () => {
            const settings = this.ui.getSettings();
            this.ui.updateEstimatedTime(this.currentOrder.material, settings);
            const result = this.printEngine.calculate(settings, this.currentOrder.material, this.currentOrder.difficulty);
            this.ui.updateFilamentCost(result.filamentCost);
        };

        ['nozzle-temp', 'bed-temp', 'layer-height', 'infill', 'print-speed', 'use-support'].forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.removeEventListener('change', updateCalcs);
                elem.addEventListener('change', updateCalcs);
                elem.removeEventListener('input', updateCalcs);
                elem.addEventListener('input', updateCalcs);
            }
        });

        updateCalcs();
        this.ui.showScreen('settings');
    }

    rejectOrder() {
        this.currentOrder = null;
        this.ui.showScreen('waiting');
    }

    startPrint() {
        const settings = this.ui.getSettings();
        const result = this.printEngine.calculate(settings, this.currentOrder.material, this.currentOrder.difficulty);

        this.printDuration = result.timeMinutes * 60; // w sekundach
        this.currentPrintResult = result;
        this.isPrinting = true;
        this.printSpeedMultiplier = 1;
        this.printStartTime = Date.now() / 1000;

        const costFilament = result.filamentCost;
        this.save.removeMoney(costFilament);
        this.ui.updateStats(this.save);

        this.ui.showScreen('printing');
        this.updatePrintLoop();
    }

    updatePrintLoop() {
        if (!this.isPrinting) return;

        const elapsed = (Date.now() / 1000 - this.printStartTime) * this.printSpeedMultiplier;
        const percent = Math.min(100, Math.round((elapsed / this.printDuration) * 100));

        let status = 'Rozgrzewanie...';
        if (percent > 15 && percent < 85) {
            status = 'Drukowanie...';
            const printAmount = Math.round((percent - 15) * 0.7);
            this.ui.elements.printModel.style.height = `${Math.min(25, printAmount * 0.5)}px`;
        } else if (percent >= 85) {
            status = 'Chłodzenie...';
        }

        this.ui.updatePrintProgress(percent, elapsed, this.printDuration);
        this.ui.setPrintInfo(status);

        if (percent >= 100) {
            this.isPrinting = false;
            this.completePrint();
        } else {
            requestAnimationFrame(() => this.updatePrintLoop());
        }
    }

    toggleSpeedup() {
        this.printSpeedMultiplier = this.printSpeedMultiplier === 1 ? 2 : 1;
        document.getElementById('speedup-btn').textContent =
            this.printSpeedMultiplier === 2 ? '1x szybkość' : '2x szybkość';
    }

    togglePause() {
        if (this.isPrinting) {
            this.isPrinting = false;
            document.getElementById('pause-btn').textContent = 'Wznów';
        } else {
            this.isPrinting = true;
            document.getElementById('pause-btn').textContent = 'Pauza';
            this.updatePrintLoop();
        }
    }

    completePrint() {
        const quality = this.currentPrintResult.quality;

        // Kalkulacja zarobków
        const baseEarnings = GAME_CONFIG.baseEarnings;
        const earnings = Math.round(baseEarnings * quality * 1.5);
        let tip = 0;

        if (quality > 0.8) {
            tip = Math.round(baseEarnings * 0.5);
        } else if (quality > 0.5) {
            tip = Math.round(baseEarnings * 0.2);
        }

        // Reputacja
        let repChange = 0;
        if (quality > 0.8) {
            repChange = 10;
        } else if (quality > 0.5) {
            repChange = 2;
        } else if (quality > 0.2) {
            repChange = -5;
        } else {
            repChange = -15;
        }

        const total = earnings + tip;
        this.save.addMoney(total);
        this.save.addReputation(repChange);
        const levelUp = this.save.checkLevelUp();
        this.save.addRating(quality);

        this.ui.updateStats(this.save);
        this.ui.displayResult(quality, earnings, tip, repChange);

        if (this.currentPrintResult.issue) {
            this.ui.elements.resultDescription.textContent =
                `Problem: ${t('printIssues.' + this.currentPrintResult.issue).toLowerCase()}`;
        }

        if (levelUp) {
            this.ui.elements.resultVerdict.textContent += ' 🎉 NOWY POZIOM!';
        }

        this.ui.showScreen('result');
    }

    finishOrder() {
        this.currentOrder = null;
        this.currentPrintResult = null;
        this.ui.showScreen('waiting');
    }

    cancelOrder() {
        this.currentOrder = null;
        this.ui.showScreen('waiting');
    }
}

// Uruchomienie gry
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
