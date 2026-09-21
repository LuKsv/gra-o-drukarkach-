// Konfiguracja gry
const GAME_CONFIG = {
    baseEarnings: 50,
    maxReputation: 100,
    initialMoney: 200,
    printDurationSeconds: 10, // 10 sekund na demo (normalne to 1-2h)
};

// System zapisu
class GameSave {
    constructor() {
        this.storageKey = 'farm3d_save';
        this.load();
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            this.money = data.money || GAME_CONFIG.initialMoney;
            this.reputation = data.reputation || 50;
            this.level = data.level || 1;
            this.totalPrints = data.totalPrints || 0;
            this.totalEarnings = data.totalEarnings || 0;
            this.ratings = data.ratings || [];
        } else {
            this.reset();
        }
    }

    reset() {
        this.money = GAME_CONFIG.initialMoney;
        this.reputation = 50;
        this.level = 1;
        this.totalPrints = 0;
        this.totalEarnings = 0;
        this.ratings = [];
        this.save();
    }

    save() {
        const data = {
            money: this.money,
            reputation: this.reputation,
            level: this.level,
            totalPrints: this.totalPrints,
            totalEarnings: this.totalEarnings,
            ratings: this.ratings,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    addMoney(amount) {
        this.money += amount;
        this.totalEarnings += amount;
        this.save();
    }

    removeMoney(amount) {
        this.money = Math.max(0, this.money - amount);
        this.save();
    }

    addReputation(delta) {
        this.reputation = Math.max(0, Math.min(GAME_CONFIG.maxReputation, this.reputation + delta));
        this.save();
    }

    addRating(rating) {
        this.ratings.push(rating);
        this.totalPrints++;
        this.save();
    }

    getAverageRating() {
        if (this.ratings.length === 0) return 5.0;
        const sum = this.ratings.reduce((a, b) => a + b, 0);
        return (sum / this.ratings.length).toFixed(1);
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.totalEarnings / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.save();
            return true;
        }
        return false;
    }
}

// Generator zleceń
class OrderGenerator {
    generate() {
        const customer = t('customers').random();
        const model = t('models').random();
        const materials = Object.keys(TRANSLATIONS[LANG].materials);
        const material = materials.random();
        const requirement = t('requirements').random();
        const deadline = Math.floor(Math.random() * 3) + 1; // 1-3 dni
        const budget = Math.floor(Math.random() * 200) + 80;

        return {
            customer: customer.name,
            customerEmoji: customer.emoji,
            model: model.name,
            modelEmoji: model.emoji,
            material,
            requirement,
            deadline,
            budget,
            difficulty: Math.random(), // 0-1, wyżej = trudniejsze
        };
    }
}

// Silnik druku
class PrintEngine {
    calculate(settings, material, difficulty) {
        const materialConfig = TRANSLATIONS[LANG].materials[material];

        // Validacja temperatury
        const nozzleOK = settings.nozzleTemp >= materialConfig.tempNozzle[0] &&
                        settings.nozzleTemp <= materialConfig.tempNozzle[1];
        const bedOK = settings.bedTemp >= materialConfig.tempBed[0] &&
                     settings.bedTemp <= materialConfig.tempBed[1];

        // Kalkulacja czasu
        const baseTime = 100 / (settings.layerHeight * 10) * (150 / settings.printSpeed);
        const timeMinutes = Math.floor(baseTime);

        // Koszt filamentu (mg -> grams -> zł)
        const weight = (timeMinutes * settings.infill * 0.5); // uproszczona formula
        const filamentCost = weight * materialConfig.cost;

        // Szacunek jakości (0-1)
        let quality = 0.5;

        if (nozzleOK && bedOK) quality += 0.3;
        if (settings.layerHeight < 0.2) quality += 0.1;
        if (settings.infill > 50) quality += 0.1;
        if (settings.printSpeed < 60) quality += 0.1;
        if (settings.useSupport) quality += 0.15;

        // Losowe problemy na podstawie jakości i trudności
        let issue = null;
        const problemChance = (1 - quality) * (0.3 + difficulty * 0.7);

        if (Math.random() < problemChance) {
            const issues = ['adhesion', 'warping', 'stringing', 'spaghetti', 'layerShift', 'clogged', 'underextrusion', 'overextrusion', 'dryFilament'];
            issue = issues[Math.floor(Math.random() * issues.length)];
            quality *= 0.3;
        }

        return {
            timeMinutes,
            filamentCost: Math.max(5, Math.round(filamentCost)),
            quality: Math.min(1, quality),
            issue,
        };
    }
}

// Polyfill dla .random()
if (!Array.prototype.random) {
    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * this.length)];
    };
}
