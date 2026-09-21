// Storage Management (localStorage)

const Storage = {
    SAVE_KEY: 'farma3d_save',

    // Get full save
    getSave() {
        const data = localStorage.getItem(this.SAVE_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },

    // Create new save
    createNewSave() {
        return {
            version: 1,
            createdAt: Date.now(),
            lastSave: Date.now(),
            money: 1000, // Starting money
            reputation: 3,
            printers: [
                {
                    id: 'printer-1',
                    modelId: 'budget-1',
                    active: true,
                    upgrades: []
                }
            ],
            completedOrders: [],
            unlockedArticles: ['materials_intro', 'pla_guide'], // Start with basic knowledge
            settings: {
                soundEnabled: true,
                noAds: false,
                language: 'pl'
            }
        };
    },

    // Initialize or get existing save
    initSave() {
        let save = this.getSave();
        if (!save) {
            save = this.createNewSave();
            this.save(save);
        }
        return save;
    },

    // Save data
    save(gameState) {
        gameState.lastSave = Date.now();
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(gameState));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    },

    // Clear save
    clearSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            return true;
        } catch (e) {
            console.error('Clear failed:', e);
            return false;
        }
    },

    // Update specific field
    update(gameState, field, value) {
        gameState[field] = value;
        this.save(gameState);
    }
};
