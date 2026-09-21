// Game State & Logic

class GameState {
    constructor(saveData) {
        this.version = saveData.version;
        this.createdAt = saveData.createdAt;
        this.money = saveData.money;
        this.reputation = saveData.reputation;
        this.printers = saveData.printers;
        this.completedOrders = saveData.completedOrders || [];
        this.unlockedArticles = saveData.unlockedArticles || [];
        this.settings = saveData.settings;

        // Current order & print state
        this.currentOrder = null;
        this.currentPrintSettings = null;
        this.currentPrintResult = null;
        this.availableOrders = this.generateAvailableOrders();
    }

    generateAvailableOrders() {
        // For MVP, just return sample orders shuffled
        return SAMPLE_ORDERS.sort(() => Math.random() - 0.5);
    }

    selectOrder(orderId) {
        this.currentOrder = SAMPLE_ORDERS.find(o => o.id === orderId);
        return this.currentOrder;
    }

    savePrintSettings(settings) {
        this.currentPrintSettings = settings;
    }

    // Calculate print result
    calculateResult() {
        if (!this.currentOrder || !this.currentPrintSettings) return null;

        const ideal = this.currentOrder.model.idealSettings;
        const chosen = this.currentPrintSettings;

        let score = 0;
        let issues = [];

        // Check each setting
        if (chosen.material !== ideal.material) {
            score += 1;
            issues.push('material');
        }

        if (Math.abs(chosen.layerHeight - ideal.layerHeight) > 0.05) {
            score += 1;
            issues.push('layer_height');
        }

        if (Math.abs(chosen.infill - ideal.infill) > 10) {
            score += 1;
            issues.push('infill');
        }

        if (chosen.pattern !== ideal.pattern) {
            score += 0.5;
        }

        if (this.currentOrder.model.hasOverhangs && !chosen.supports) {
            score += 2;
            issues.push('no_supports');
        }

        if (Math.abs(chosen.speed - ideal.speed) > 20) {
            score += 0.5;
        }

        if (chosen.adhesion === 'none' && ideal.adhesion !== 'none') {
            score += 1;
            issues.push('adhesion');
        }

        // Determine result grade
        let result = {
            stars: 5,
            status: 'Idealny!',
            multiplier: 1.0,
            error: null,
            explanation: 'Druk przebiegł bezbłędnie! Klient będzie zachwycony.'
        };

        if (score === 0) {
            result = {
                stars: 5,
                status: 'Idealny!',
                multiplier: 1.0,
                error: null,
                explanation: 'Druk przebiegł bezbłędnie! Klient będzie zachwycony.'
            };
        } else if (score < 1.5) {
            result = {
                stars: 4,
                status: 'Dobry! 👍',
                multiplier: 0.8,
                error: null,
                explanation: 'Druk wyszedł dobrze, z kilkoma drobnymi niedociągnięciami. Klient zadowolony.'
            };
        } else if (score < 3) {
            result = {
                stars: 3,
                status: 'OK',
                multiplier: 0.5,
                error: this.getErrorName(issues[0]),
                explanation: this.getErrorExplanation(issues[0])
            };
        } else if (score < 4) {
            result = {
                stars: 2,
                status: 'Słabo! 😞',
                multiplier: 0.2,
                error: this.getErrorName(issues[0]),
                explanation: this.getErrorExplanation(issues[0])
            };
        } else {
            // Complete failure
            result = {
                stars: 0,
                status: 'Porażka! 💥',
                multiplier: 0.0,
                error: 'spaghetti',
                explanation: this.getErrorExplanation('spaghetti')
            };
        }

        return result;
    }

    getErrorName(errorType) {
        const errorMap = {
            'material': PRINT_ERRORS.under_extrusion,
            'layer_height': PRINT_ERRORS.under_extrusion,
            'infill': PRINT_ERRORS.under_extrusion,
            'no_supports': PRINT_ERRORS.spaghetti,
            'adhesion': PRINT_ERRORS.bed_adhesion_failed,
            'spaghetti': PRINT_ERRORS.spaghetti
        };
        return errorMap[errorType] || PRINT_ERRORS.under_extrusion;
    }

    getErrorExplanation(errorType) {
        const error = this.getErrorName(errorType);
        let explanation = `${error.title}\n\n${error.description}\n\nRozwiązania:\n`;
        explanation += error.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n');
        return explanation;
    }

    // Finalize print and collect reward
    collectReward() {
        const result = this.calculateResult();
        const basePrice = this.currentOrder.basePrice;
        const totalEarnings = Math.floor(basePrice * result.multiplier);

        this.money += totalEarnings;

        // Unlock articles based on result
        if (result.error) {
            this.unlockArticleForError(result.error.title);
        }

        // Save current result for display
        this.currentPrintResult = {
            order: this.currentOrder,
            result: result,
            earnings: totalEarnings,
            basePrice: basePrice
        };

        // Mark order as completed
        this.completedOrders.push({
            orderId: this.currentOrder.id,
            timestamp: Date.now(),
            earnings: totalEarnings
        });

        // Clear current order
        this.currentOrder = null;
        this.currentPrintSettings = null;

        return this.currentPrintResult;
    }

    unlockArticleForError(errorTitle) {
        // Map error titles to articles
        const errorArticleMap = {
            'Odklejenie od stołu': 'adhesion_modes',
            'Warping (wypaczenie)': 'warping_problem',
            'Stringing (nitki)': 'stringing_issue',
            'Niedoekstruzja (dziury)': 'temperature_explained',
            'Przesunięcie warstw': 'layer_height',
            'Zapchana dysza': 'clogged_nozzle',
            'Wilgotny filament': 'filament_wet',
            'Spaghetti (porażka)': 'supports_guide'
        };

        const articleId = errorArticleMap[errorTitle];
        if (articleId && !this.unlockedArticles.includes(articleId)) {
            this.unlockedArticles.push(articleId);
        }
    }

    getPrintDuration(settings) {
        // Estimate print time based on order complexity and speed
        const baseTime = this.currentOrder.model.weight;
        const speedFactor = 100 / settings.speed; // Relative to base 100mm/s
        const infillFactor = settings.infill / 20; // Relative to 20% base

        let estimatedSeconds = Math.floor((baseTime / 10) * speedFactor * infillFactor);
        // For MVP, cap between 2-10 seconds of game time
        return Math.max(2, Math.min(10, estimatedSeconds));
    }

    addMoney(amount) {
        this.money += amount;
    }

    canBuyPrinter(printerModel) {
        return this.money >= printerModel.cost;
    }

    buyPrinter(printerModelId) {
        const model = PRINTER_MODELS[printerModelId];
        if (!model || !this.canBuyPrinter(model)) return false;

        this.money -= model.cost;
        this.printers.push({
            id: `printer-${this.printers.length + 1}`,
            modelId: printerModelId,
            active: true,
            upgrades: []
        });

        return true;
    }
}

// Helper functions for print simulation
const PrintSimulator = {
    // Generate realistic print errors based on bad settings
    getRandomIssue(deviationScore) {
        if (deviationScore > 4) return 'spaghetti';
        if (deviationScore > 3) {
            const choices = ['bed_adhesion', 'warping', 'layer_shift'];
            return choices[Math.floor(Math.random() * choices.length)];
        }
        if (deviationScore > 2) {
            const choices = ['under_extrusion', 'stringing', 'warping'];
            return choices[Math.floor(Math.random() * choices.length)];
        }
        return null;
    }
};
