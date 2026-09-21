// Game Data & Constants

const MATERIALS = {
    PLA: {
        name: 'PLA',
        nozzleTemp: 205,
        bedTemp: 55,
        cost: 30,
        difficulty: 'Easy',
        description: 'Najpopularniejszy materiał. Łatwy w druku, ekologiczny. Średnia wytrzymałość.'
    },
    PETG: {
        name: 'PETG',
        nozzleTemp: 225,
        bedTemp: 75,
        cost: 45,
        difficulty: 'Medium',
        description: 'Wytrzymalszy niż PLA. Wymaga wyższych temperatur. Dobry do części użytkowych.'
    },
    ABS: {
        name: 'ABS',
        nozzleTemp: 240,
        bedTemp: 90,
        cost: 50,
        difficulty: 'Hard',
        description: 'Bardzo wytrzymały. Trudny w druku - skłonny do warpingu. Potrzebna obudowa.'
    }
};

const LAYER_HEIGHTS = [0.1, 0.2, 0.3];
const INFILL_PERCENTAGES = [10, 20, 50, 100];
const INFILL_PATTERNS = ['grid', 'gyroid', 'honeycomb'];
const PRINT_SPEEDS = [30, 60, 100];
const ADHESION_MODES = ['none', 'brim', 'raft'];

const SAMPLE_ORDERS = [
    {
        id: 1,
        title: 'Breloczek "Kota"',
        description: 'Mały breloczek do kluczy w kształcie słodkiego kota. Model: 50x50mm, 20g.',
        client: 'Pani Zofia',
        basePrice: 80,
        deadline: '6 godzin',
        model: {
            size: 'small',
            weight: 20,
            hasOverhangs: false,
            idealSettings: {
                material: 'PLA',
                layerHeight: 0.1,
                infill: 20,
                pattern: 'grid',
                supports: false,
                speed: 60,
                adhesion: 'none'
            }
        },
        clientType: 'casual',
        requirements: 'Szybko i niedroogo. Byle ładnie wyglądało.'
    },
    {
        id: 2,
        title: 'Figurka "Dragon" (duża)',
        description: 'Dekoracyjna figurka smoka. Model: 80x100mm, 150g. Są zwisy bez podpór!',
        client: 'Pan Tomek (kolekcjoner)',
        basePrice: 200,
        deadline: '24 godziny',
        model: {
            size: 'large',
            weight: 150,
            hasOverhangs: true,
            idealSettings: {
                material: 'PLA',
                layerHeight: 0.1,
                infill: 30,
                pattern: 'grid',
                supports: true,
                speed: 40,
                adhesion: 'brim'
            }
        },
        clientType: 'demanding',
        requirements: 'Musi być idealny! Lubię detale. Gotów zapłacić za dobrą jakość.'
    },
    {
        id: 3,
        title: 'Uchwyt do telefonu',
        description: 'Mały uchwyt do samochodu. Model: 60x80mm, 45g. Musi być wytrzymały!',
        client: 'Firma Transport-OK',
        basePrice: 120,
        deadline: '12 godzin',
        model: {
            size: 'small',
            weight: 45,
            hasOverhangs: false,
            idealSettings: {
                material: 'PETG',
                layerHeight: 0.2,
                infill: 50,
                pattern: 'gyroid',
                supports: false,
                speed: 60,
                adhesion: 'brim'
            }
        },
        clientType: 'business',
        requirements: 'Wytrzymałe i niezawodne. Zamawiam co tydzień, jeśli będziesz dobry.'
    },
    {
        id: 4,
        title: 'Część zamienna - mocowanie',
        description: 'Część do drukarki 3D (replica). Model: 40x40mm, 35g. Wysokie tolerancje!',
        client: 'Jan (miłośnik DIY)',
        basePrice: 150,
        deadline: '24 godziny',
        model: {
            size: 'small',
            weight: 35,
            hasOverhangs: false,
            idealSettings: {
                material: 'PLA',
                layerHeight: 0.2,
                infill: 100,
                pattern: 'grid',
                supports: false,
                speed: 50,
                adhesion: 'none'
            }
        },
        clientType: 'demanding',
        requirements: 'Dokładnie jak rysunkach. Bez tolerancji na błędy!'
    },
    {
        id: 5,
        title: 'Gwiazda bożonarodzeniowa',
        description: 'Dekoracja świąteczna. Model: 100mm, 80g. Czystość powierzchni ważna!',
        client: 'Pani Krystyna',
        basePrice: 100,
        deadline: '48 godzin',
        model: {
            size: 'medium',
            weight: 80,
            hasOverhangs: false,
            idealSettings: {
                material: 'PLA',
                layerHeight: 0.1,
                infill: 15,
                pattern: 'grid',
                supports: false,
                speed: 40,
                adhesion: 'none'
            }
        },
        clientType: 'casual',
        requirements: 'Ładnie do mniej ważne są dokładne wymiary. Głównie wygląd!'
    }
];

const ENCYCLOPEDIA_ARTICLES = {
    materials_intro: {
        title: 'Materiały druku 3D',
        content: `Druk 3D wymaga wyboru odpowiedniego materiału (filamentu). Każdy material ma inne właściwości, ceny i wymagania temperaturowe. Poprawnie dobrany material to połowa sukcesu!`
    },
    pla_guide: {
        title: 'PLA - najlubszy material',
        content: `PLA to najpopularniejszy material do druku. Łatwy do pracy, ekologiczny (robi się z kukurydzy), tani. Idealna temperatura dyszy to 200-210°C.

Wady: mniej wytrzymały niż PETG/ABS. Może się odkleić na chłodnym stole.
Wskazówka: używaj brimu dla pierwszych warstw!`
    },
    temperature_explained: {
        title: 'Dlaczego temperatura się liczy',
        content: `Temperatura dyszy musi być dokładna dla każdego materiału.

Za niska: material nie wypływa dobrze → niedoekstruzja (dziury w wydruku)
Za wysoka: material się przegrzewa → się rozcieśliwia, przez co może się wykrzywić lub wyciec na ściany

Każdy material ma swój zakres - zawsze czytaj opakowanie!`
    },
    layer_height: {
        title: 'Wysokość warstwy - jakość vs czas',
        content: `Wysokość warstwy to grubość każdej naniesionej warstwy filamentu.

0.1mm - najczystsza, najwięcej detali, ale wolno (może 2x dłużej)
0.2mm - standard, balans między jakością a czasem
0.3mm - najszybciej, ale widać warstwy

Dla dekoracji: 0.1mm. Dla części funkcjonalnych: 0.2mm.`
    },
    infill_explained: {
        title: 'Wypełnienie - wnętrze wydruku',
        content: `Wypełnienie to jak "gęsto" jest wypełnione wewnętrze wydruku.

10% - lekkie, szybkie, mało filamentu
20% - standard dla większości
50% - wytrzymałe części
100% - solid jak skała, ale zużywa dużo materiału i czasu

Oszczędzaj material - 20% wypełnienia wystarczy w 90% przypadków!`
    },
    supports_guide: {
        title: 'Podpory - kiedy ich potrzebujesz',
        content: `Jeśli model ma części "wiszące" bez wsparcia (kąt > 45° od pionu), printer nie będzie miał co drukować.

Rozwiązanie: włącz podpory. Printer będzie drukować extra-materiał, który potem usuniesz.

Koszt: dodatkowy material, dłuższy druk. Ale bez podpór - druk się nie powiedzie!`
    },
    warping_problem: {
        title: 'Warping - wypaczenie krawędzi',
        content: `Warping to gdy krawędzie wydruku się skręcają i podnoszą podczas druku.

Przyczyny:
- Za niska temperatura stołu (zwłaszcza ABS)
- Za szybkie chłodzenie
- ABS bez obudowy

Rozwiązanie: podnieś temp. stołu, włącz brim/raft do pierwszych warstw.`
    },
    stringing_issue: {
        title: 'Stringing - nitki filamentu',
        content: `Stringing to gdy printer zostawia cienkie nitki filamentu między częściami wydruku.

Przyczyny:
- Temperatura za wysoka
- Druk za szybko

Rozwiązanie: zmniejsz temperaturę o 5-10°C, zwolnij prędkość.`
    },
    adhesion_modes: {
        title: 'Przyczepność - brim i raft',
        content: `Przyczepność to dodatkowe elementy na początku druku, żeby model się nie odkleił od stołu.

Brim: cienki "pierścień" dookoła modelu. Mniej materiału, łatwo się usuwa.
Raft: gruba podstawka pod modelem. Bardziej niezawodny, ale trudniej się usuwa.

Nie masz problemów z odklejaniem? Może być "none" - zaoszczędzisz material!`
    }
};

const PRINT_ERRORS = {
    bed_adhesion_failed: {
        title: 'Odklejenie od stołu',
        description: 'Model się nie przyczepił i powędrował po stole.',
        solutions: ['Zwiększ temperaturę stołu', 'Użyj brimu lub raft\'u', 'Wyczyść stół', 'Chwyć papier ścierny i wyrównaj']
    },
    warping: {
        title: 'Warping (wypaczenie)',
        description: 'Krawędzie wydruku się podniosły i pokrzywiły.',
        solutions: ['Zwiększ temperaturę stołu', 'Zmniejsz wentylację chłodzenia', 'Dodaj brim', 'Zmniejsz prędkość druku']
    },
    stringing: {
        title: 'Stringing (nitki)',
        description: 'Między częściami wydruku zostały cienkie nitki filamentu.',
        solutions: ['Zmniejsz temperaturę dyszy o 5°C', 'Zwolnij prędkość druku', 'Włącz retraction']
    },
    under_extrusion: {
        title: 'Niedoekstruzja (dziury)',
        description: 'Są przerwy w wydruku, linie nie są ciągłe.',
        solutions: ['Zwiększ temperaturę dyszy', 'Zmniejsz prędkość druku', 'Sprawdź dysę na zapchanie', 'Zmniejsz wysokość warstwy']
    },
    layer_shift: {
        title: 'Przesunięcie warstw',
        description: 'Warstwy są przesunięte względem siebie, jak nach.slizgniętych kart.',
        solutions: ['Zwolnij prędkość druku', 'Sprawdź napięcie pasów', 'Zmniejsz przyspieszenie', 'Sprawdź śrubę Z']
    },
    clogged_nozzle: {
        title: 'Zapchana dysza',
        description: 'Dysza się zapchała, filament nie wychodzi lub wychodzi bardzo mało.',
        solutions: ['Wymuś zmianę temperatury dyszy', 'Czyść dysę (cold pull)', 'Wymień dysę na nową']
    },
    filament_wet: {
        title: 'Wilgotny filament',
        description: 'Filament wchłonął wilgoć i druk wychodzi bąbelkujący i słaby.',
        solutions: ['Suszyć filament w suszarce (4 godziny, 60°C)', 'Przechowuj filament w pudełku z silikagielem']
    },
    spaghetti: {
        title: 'Spaghetti (porażka)',
        description: 'Druk się kompletnie nie powiódł - masa filamentu na stole.',
        solutions: ['Sprawdź ustawienia od zera', 'Przetestuj wydruk testowy (benchy)', 'Wyczyść stół i dysę']
    }
};

// Printers catalog
const PRINTER_MODELS = {
    'budget-1': {
        id: 'budget-1',
        name: 'Budget 3D v1',
        cost: 500,
        maxTemp: 260,
        bedMaxTemp: 100,
        features: ['basic'],
        description: 'Tania drukarka dla początkujących. Niezawodna, ale wolna.'
    },
    'pro-2': {
        id: 'pro-2',
        name: 'Pro Print 2.0',
        cost: 1500,
        maxTemp: 300,
        bedMaxTemp: 110,
        features: ['heated bed', 'auto leveling', 'faster'],
        description: 'Drukarka dla poważnych projektów. Szybka i dokładna.'
    },
    'industrial-x': {
        id: 'industrial-x',
        name: 'Industrial Pro X',
        cost: 5000,
        maxTemp: 320,
        bedMaxTemp: 120,
        features: ['industrial', 'multi-materials', 'very-fast'],
        description: 'Piewsza drukarka przemysłowa. Może drukować prawie wszystko.'
    }
};
