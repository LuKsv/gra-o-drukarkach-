const LANG = 'pl';

const TRANSLATIONS = {
    pl: {
        // Klienci
        customers: [
            { name: 'Artur', personality: 'Wymagający', emoji: '👨‍💼' },
            { name: 'Maria', personality: 'Miła', emoji: '👩‍🦰' },
            { name: 'Tomek', personality: 'Impulsywny', emoji: '👨‍🦱' },
            { name: 'Zosia', personality: 'Skrupulatna', emoji: '👩‍🔬' },
            { name: 'Piotr', personality: 'Leniwy', emoji: '😴' },
        ],

        // Modele do druku
        models: [
            { name: 'Breloczek', emoji: '🔑' },
            { name: 'Figurka', emoji: '🎁' },
            { name: 'Uchwyt', emoji: '📱' },
            { name: 'Osłonka', emoji: '🌱' },
            { name: 'Pudełko', emoji: '📦' },
            { name: 'Wyświetlacz', emoji: '📊' },
        ],

        // Materiały
        materials: {
            PLA: { tempNozzle: [195, 215], tempBed: [50, 70], cost: 0.05, density: 1.24 },
            PETG: { tempNozzle: [220, 245], tempBed: [70, 90], cost: 0.08, density: 1.27 },
            ABS: { tempNozzle: [230, 250], tempBed: [80, 120], cost: 0.07, density: 1.04 },
        },

        // Wymagania
        requirements: [
            'Wysoka dokładność',
            'Szybko!',
            'Funkcjonalny',
            'Piękny wygląd',
            'Wytrzymały',
        ],

        // Teksty ekranów
        screens: {
            welcome: 'Witaj w Farmie Drukarek 3D! Zarządzaj swoją drukarką, przyjmuj zamówienia i zarabiaj.',
            getOrder: 'Nowe zlecenie',
            orderDetails: 'Szczegóły zlecenia',
            client: 'Klient',
            model: 'Model',
            material: 'Materiał',
            requirements: 'Wymagania',
            deadline: 'Termin',
            budget: 'Budżet',
            accept: 'Przyjmij',
            reject: 'Odrzuć',
            printSettings: 'Ustawienia druku',
            startPrint: 'Rozpocznij druk',
            cancelPrint: 'Anuluj',
            printing: 'Druk w toku...',
            estimatedTime: 'Szacunkowy czas',
            filamentCost: 'Koszt filamentu',
            printing: 'Druk w toku...',
            heating: 'Rozgrzewanie...',
            printing: 'Drukowanie...',
            cooldown: 'Chłodzenie...',
            completed: 'Ukończone!',
            printComplete: 'Druk ukończony!',
            perfect: 'Idealny wydruk!',
            good: 'Dobry wydruk',
            flawed: 'Wydruk z wadami',
            failed: 'Druk nie powiódł się',
            quality: 'Jakość',
            earnings: 'Zarobek',
            tip: 'Napiwek',
            total: 'Razem',
            reputation: 'Reputacja',
            continue: 'Dalej',
            temperature: 'Temperatura',
            nozzleTemp: 'Temperatura dyszy',
            bedTemp: 'Temperatura stołu',
            layerHeight: 'Wysokość warstwy',
            infill: 'Wypełnienie',
            printSpeed: 'Prędkość druku',
            useSupport: 'Użyj podpór',
            stats: 'Statystyki',
            totalPrints: 'Wyprintowanych',
            avgRating: 'Średnia ocena',
            totalEarnings: 'Zarobki razem',
            farm: 'Twoja farma',
            warehouse: 'Magazyn',
            settings: 'Ustawienia',
            resetGame: 'Resetuj grę',
            about: 'O grze',
            speedup: '2x szybkość',
            pause: 'Pauza',
        },

        // Problemy druku
        printIssues: {
            adhesion: 'Odklejenie od stołu',
            warping: 'Warping (wypachiznięte krawędzie)',
            stringing: 'Stringing (nitki)',
            spaghetti: 'Spaghetti (całkowita porażka)',
            layerShift: 'Przesunięcie warstw',
            clogged: 'Zapchana dysza',
            underextrusion: 'Niedoekstruzja',
            overextrusion: 'Nadekstruzja',
            dryFilament: 'Mokry filament',
        },

        // Powiadomienia
        notifications: {
            orderAccepted: 'Zlecenie przyjęte!',
            orderRejected: 'Zlecenie odrzucone.',
            printStarted: 'Druk rozpoczęty!',
            printPaused: 'Druk wznowiony.',
            printCancelled: 'Druk anulowany.',
            printComplete: 'Druk ukończony!',
            moneyEarned: 'Zarobiono ',
            reputationChanged: 'Reputacja zmieniona',
        },
    },
};

function t(key) {
    const keys = key.split('.');
    let value = TRANSLATIONS[LANG];
    for (const k of keys) {
        value = value[k];
    }
    return value;
}
