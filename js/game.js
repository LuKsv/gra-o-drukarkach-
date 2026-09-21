// Main Game Loop & Event Management

let gameState;
let ui;

// Initialize game
function initGame() {
    const saveData = Storage.initSave();
    gameState = new GameState(saveData);
    ui = new UI(gameState);

    setupEventListeners();
    renderGame();
}

// Render game
function renderGame() {
    ui.renderDashboard();
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('btn-back-order').addEventListener('click', () => {
        ui.switchView('dashboard');
        ui.renderDashboard();
    });

    document.getElementById('btn-back-encyclopedia').addEventListener('click', () => {
        ui.switchView('dashboard');
    });

    document.getElementById('btn-back-settings').addEventListener('click', () => {
        ui.switchView('dashboard');
    });

    document.getElementById('btn-encyclopedia').addEventListener('click', () => {
        ui.renderEncyclopedia();
        ui.switchView('encyclopedia');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
        ui.renderSettings();
        ui.switchView('settings');
    });

    // Print settings
    document.getElementById('btn-start-print').addEventListener('click', () => {
        ui.startPrintingSimulation();
    });

    // Collect reward
    document.getElementById('btn-collect-reward').addEventListener('click', () => {
        ui.collectReward();
    });

    // Settings changes
    ['setting-sound', 'setting-no-ads', 'setting-language'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => ui.updateSettings());
        }
    });

    // Reset game
    document.getElementById('btn-reset-game').addEventListener('click', () => {
        if (confirm('Naprawdę chcesz usunąć wszystkie dane i zacząć od nowa? Tej akcji nie można cofnąć!')) {
            Storage.clearSave();
            location.reload();
        }
    });

    // Auto-save on changes
    setInterval(() => {
        Storage.save(gameState);
    }, 30000); // Every 30 seconds
}

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

// Also save on window close
window.addEventListener('beforeunload', () => {
    Storage.save(gameState);
});
