# DESIGN - Farma Drukarek 3D

## Przegląd Gry

**Gatunek**: Symulacja zarządzania / Przygoda  
**Platforma**: HTML5 (mobilna - portrait)  
**Docelowe urządzenia**: Android (Google Play Store), iOS (AppStore - przyszłość)  
**Grupę docelową**: Fani druku 3D, symulacji, zarządzania zasobami  

## Główna Pętla Rozgrywki

1. **Oczekiwanie**: Gracz czeka na nowe zlecenie
2. **Przegląd**: Gracz widzi szczegóły zlecenia (klient, model, materiał, wymagania, termin, budżet)
3. **Decyzja**: Gracz akceptuje lub odrzuca zlecenie
4. **Ustawienia**: Gracz dobiera ustawienia druku (temperatura, prędkość, itp)
5. **Druk**: Druk trwa w skróconym czasie; gracz może przyspieszyć lub wznowić
6. **Wynik**: Gracz widzi ocenę, zarobek, reputację
7. **Loop**: Powrót do punktu 1

## Zmienne Gry

### Gracza
- **Pieniądze** (zł): Zasoby do wydania na drukarki i części
- **Reputacja** (0-100%): Wpływ na większość zleceń, klienci stali
- **Poziom**: Opiera się na całkowitych zarobkach (co 500 zł = +1)
- **Statystyki**: Liczba wydrukowanych modeli, średnia ocena, całkowite zarobki

### Zlecenia
- **Klient**: Losowo wybrana postać (6 typów)
- **Model**: Typ drukowanego obiektu (6 typów)
- **Materiał**: PLA, PETG, ABS (każdy ma inne zakresy temperatur)
- **Wymagania**: Specjalne prośby klienta (wysoka dokładność, szybko, itp)
- **Termin**: 1-3 dni (wpływ na presję gracza, nie na grywanie)
- **Budżet**: Maksymalna cena, którą klient zapłaci (80-280 zł)
- **Trudność**: 0-1 (wpływ na szanse problemów)

### Ustawienia Druku
- **Temperatura dyszy**: Materiał-zależna (190-250°C)
- **Temperatura stołu**: Materiał-zależna (20-120°C)
- **Wysokość warstwy**: 0.1-0.4mm (niska = wysoka jakość, wysoka = szybko)
- **Wypełnienie**: 10-100% (więcej = bardziej wytrzymałe, ale powolne i kosztowne)
- **Prędkość druku**: 30-100% (niska = lepsza jakość, wysoka = szybciej)
- **Użycie podpór**: Tak/Nie (zwiększa czas i koszt, ale lepiej wspiera zwisy)

## Silnik Druku

### Kalkulacja Czasu
```
baseTime = 100 / (layerHeight * 10) * (150 / printSpeed)
timeMinutes = floor(baseTime)
```

Gdzie:
- Niska wysokość warstwy = więcej warstw = dłużej
- Niska prędkość = dłużej
- Użycie podpór = +20% czasu

### Kalkulacja Jakości
Jakość (0-1) zależy od:
- Prawidłowe temperatury dla materiału: +0.3
- Niska wysokość warstwy (<0.2mm): +0.1
- Wysokie wypełnienie (>50%): +0.1
- Niska prędkość (<60%): +0.1
- Użycie podpór: +0.15

Podstawa: 0.5

Jeśli problem: jakość *= 0.3

### Problemy Druku
Szansa na problem = (1 - jakość) * (0.3 + trudność * 0.7)

Możliwe problemy:
- **adhesion**: Odklejenie od stołu (zazwyczaj za niska temperatura stołu)
- **warping**: Warping (najczęściej ABS bez obudowy, niejednorodna temperatura)
- **stringing**: Nitki między fragmentami (zbyt wysoka temperatura)
- **spaghetti**: Całkowita porażka (zbyt niska prędkość, zatkana dysza)
- **layerShift**: Przesunięcie warstw (wibracje, szybka prędkość)
- **clogged**: Zatkana dysza (nieczysta dysza, temperatura)
- **underextrusion**: Niedoekstruzja (zatkana dysza, niska temperatura)
- **overextrusion**: Nadekstruzja (zbyt wysoka temperatura, szybka prędkość)
- **dryFilament**: Mokry filament (filament wchłonął wilgoć)

## Ekonomika

### Zarobki
```
earnings = round(baseEarnings * quality * 1.5)
baseEarnings = 50 zł
```

Przykłady:
- Idealna jakość (1.0): 75 zł
- Dobra jakość (0.7): 52 zł
- Średnia jakość (0.5): 37 zł
- Zła jakość (0.2): 15 zł

### Napiwek
- Jakość > 0.8: +25 zł
- Jakość > 0.5: +10 zł
- Inaczej: 0 zł

### Koszty
- Koszt filamentu: Wyliczany z masy i ceny materiału (5-20 zł)
- Koszty drukarki: Najpierw 0 (później ulepszenia)

### Reputacja
- Idealna jakość (>0.8): +10%
- Dobra jakość (>0.5): +2%
- Średnia jakość (>0.2): -5%
- Zła jakość (≤0.2): -15%

## Materiały

| Materiał | Nozzle (°C) | Bed (°C) | Koszt/g | Właściwości |
|----------|------------|---------|---------|------------|
| PLA      | 195-215   | 50-70   | 0.05    | Łatwy, biodegradowalny |
| PETG     | 220-245   | 70-90   | 0.08    | Wytrzymały, odporny |
| ABS      | 230-250   | 80-120  | 0.07    | Twardy, trudny |

## Klienci (v0.1)

1. **Artur** (Wymagający) - Szuka perfekcji, wysokie standardy
2. **Maria** (Miła) - Łagodna, akceptuje małe błędy
3. **Tomek** (Impulsywny) - Pośpieszony, czasami zmienia zdanie
4. **Zosia** (Skrupulatna) - Bardzo szczegółowa, dużo wymagań
5. **Piotr** (Leniwy) - Mało wymagający, byle by działało

## Balans i Tuning

### Aktualne wartości
- Czas demo druku: 10 sekund (normalne: 1-2h)
- Zarobki: 50 zł bazowo
- Pieniądze startowe: 200 zł
- Reputacja startowa: 50%

### Do przetestowania i wybalanasowania
- Czy gracz czuje się poddany presji? (Terminy?)
- Czy nagrody są satysfakcjonujące?
- Czy czasy druku są nudne czy zaangażujące?
- Czy система trudności rośnie prawidłowo?

## Architektura Kodu

### Plik: index.html
- Struktura strony
- Wszystkie ekrany (waiting, order, settings, printing, result)
- UI elementy

### Plik: game.js
- Klasa `Game`: Główna logika, sterowanie stanem
- Event listenery
- Pętla gry

### Plik: ui.js
- Klasa `GameUI`: Obsługa interfejsu, pokazywanie/ukrywanie ekranów
- Aktualizowanie display'ów
- Event listenery UI

### Plik: data.js
- Klasa `GameSave`: Zapis/odczyt stanu gry
- Klasa `OrderGenerator`: Generowanie losowych zleceń
- Klasa `PrintEngine`: Kalkulacje druku (czas, jakość, problemy)
- Konfiguracja gry (`GAME_CONFIG`)

### Plik: translations.js
- Wszystkie teksty po polsku (i przygotowanie na angielski)
- Definicje klientów, modeli, materiałów
- Funkcja `t()` do tłumaczenia

### Plik: style.css
- Responsywny design
- Animacje
- Zmienne kolorów (przygotowanie na dark mode)

## Przyszłe Rozszerzenia

### Drukarki (v0.2)
- Inne modele drukarek (taniej vs drożej)
- Wpływ na szybkość, dokładność, niezawodność
- Ulepszenia części (hotend, stół, suszarka)

### Magazyn Filamentów (v0.2)
- Widok dostępnych materiałów
- Zakup nowych (odblokowanie ABS, itp)
- Sistem wilgoci filamentu (suszarka)

### Stali Klienci (v0.3)
- Powtarzające się zlecenia od tych samych klientów
- Bonus za konsekwencję

### Pracownicy/Automatyzacja (v0.4)
- Wynajęcie pracownika do obsługi drugiej drukarki
- Automatyczne druki w tle

## Mobilna Optymalizacja

- Portret (nie krajobraz) — wiele gier mobilnych o tym zapomina
- Przyciski wielkości 44×44px minimum
- Wiadome kolory, duża czcionka
- Brak hover (touch-first)
- Mały rozmiar pliku (HTML+CSS+JS razem <500KB)

## Testing Checklist

- [ ] Gra uruchamia się bez JS errors
- [ ] Wszystkie ekrany wyświetlają się
- [ ] Można przejść pełną pętlę zlecenia
- [ ] Zapis działa (odśwież stronę, dane zostają)
- [ ] Resetowanie usuwa wszystkie dane
- [ ] Responsywność na telefonie
- [ ] Animacje druku działają płynnie

---

**Wersja**: 0.1  
**Data ostatniej aktualizacji**: 2026-09-21
