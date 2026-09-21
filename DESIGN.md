# DESIGN — Farma Drukarek 3D

## PĘTLA ROZGRYWKI
1. Gracz widzi dostępne zlecenia (lista)
2. Wybiera jedno zlecenie (model, wymagania, budżet, termin)
3. Wbija ustawienia druku (materiał, temperatura, wysokość warstwy, wypełnienie, podpory, orientacja)
4. Druk się "odbywa" (animacja postępu, 2-10 sekund w zależności od opcji)
5. Wynik zależy od kombinacji: ustawienia vs wymagania zlecenia
   - Idealne (5⭐): wszystkie parametry optimalne
   - Dobre (4⭐): małe odchylenia, nieznaczne wady
   - Akceptowalne (3⭐): zauważalne wady, ale użyteczne
   - Słabe (2⭐): duże problemy, klient niezadowolony
   - Porażka (0⭐): druk się nie powiódł (spaghetti, odklejenie itp)
6. Gracz zarabia pieniądze + reputacja
7. Może wydać pieniądze na nowe drukarki, ulepszenia lub czekać na kolejne zlecenia

## MATERIAŁY (ETAP 1)
| Materiał | Temp. dyszy | Temp. stołu | Drukowanie | Wytrzymałość | Koszt/kg |
|----------|------------|-----------|-----------|------------|---------|
| PLA      | 200-210°C  | 50-60°C   | Łatwe     | Średnia    | 30 PLN  |
| PETG     | 220-230°C  | 70-80°C   | Średnie   | Wysoka     | 45 PLN  |
| ABS      | 230-250°C  | 80-100°C  | Trudne    | Bardzo wysoka | 50 PLN  |

Zła temperatura → warping, niedoekstruzja lub przetopienie.

## USTAWIENIA DRUKU
- **Wysokość warstwy**: 0.1mm (najczystsza, najwolniejsza), 0.2mm (standard), 0.3mm (najszybsza, gorsza jakość)
- **Wypełnienie**: 10% (lekkie, szybkie), 20% (standard), 50% (wytrzymałe), 100% (solidne)
- **Właściwy wzór**: grid (standard), gyroid (wytrzymałe, materiałochłonne), honeycomb (szybkie)
- **Podpory**: tak/nie (jeśli model ma zwisy powyżej 45°, wskazane są podpory)
- **Orientacja**: auto (AI), custom (gracz może wybrać, czy ustawiać model lepiej)
- **Prędkość**: 30 mm/s (najczystsza), 60 mm/s (standard), 100+ mm/s (szybka, gorsze detale)
- **Przyczepność**: brak (ryzyko odklejenia), brim, raft (bezpieczeństwo, zużycie filamentu)

## EKONOMIA (ETAP 1)
- **Pierwsza drukarka**: 500 PLN (Ender 3 equivalent)
- **Filament PLA**: 30 PLN/kg
- **Godzina pracy**: wartość = 50-200 PLN (zależy od złożoności i wynegocjowanej ceny)
- **Przeciętne zlecenie**: 2-5 godzin druku, zarobek 100-400 PLN

## WYNIKI DRUKU — TABELKA
Wynik zależy od odchylenia ustawień od ideału dla zlecenia:

| Odchylenie | Wynik    | Gwiazdki | Mnożnik ceny |
|-----------|----------|---------|------------|
| 0 błędów  | Idealny  | 5⭐     | 1.0x       |
| 1-2 błędy | Dobry    | 4⭐     | 0.8x       |
| 3-4 błędy | OK       | 3⭐     | 0.5x       |
| 5+ błędów | Słaby    | 2⭐     | 0.2x       |
| Katastrofa | Porażka | 0⭐     | 0.0x       |

## BLĘDY DRUKU (SYMULACJA)
Każdy błąd druku to konsekwencja złych ustawień:
- **Odklejenie od stołu** ← za niska temp. stołu, brak brim/raft, brudny stół
- **Warping** ← za szybkie chłodzenie, ABS bez obudowy, zbyt wysoka temp.
- **Stringing** ← za wysoka temp., za wysokie coils
- **Niedoekstruzja** ← za niska temp., za szybka prędkość
- **Przesunięte warstwy** ← za wysoka prędkość, słaba adhezja
- **Zapchana dysza** ← wilgotny filament, brudna dysza
- **Brak podpór gdzie są zwisy** ← model bez wsparcia, zwisy > 45°

Gracz po każdej porażce dostaje wyjaśnienie w prostym języku:
> "Druk się nie powiódł! Odklejenie od stołu - stół był za zimny i filament się nie przyczepił. Podnieś temperaturę stołu do 60°C i użyj brimu."

## KLIENCI (ETAP 1)
Każdy klient ma:
- Imię i typ (zwyczajny, wymagający, entuzjasta)
- Preferencje (szybkość, jakość, koszt)
- Ocena (1-5 gwiazdek)
- Napiwek (jeśli bardzo zadowolony)

Przykład:
> **Pani Zofia** (zwyczajna)  
> "Chciałabym breloczek do kluczy. Szybko i taniej, ok?"  
> Wymagania: szybko (do 2h), koszt < 50 PLN  
> Wynik idealny → +20 PLN napiwek, 5⭐, wróci jutro

## PROGRESJA (ETAP 1)
- Gracz zarabia, odkrywa nowe materiały (PETG, ABS)
- Robi coraz bardziej zaawansowane zlecenia
- Zdobywa reputację (dostęp do lepszych, drożejących zleceń)
- Kupuje drugą drukarkę i robi dwa druki jednocześnie

## ENKLOPEDIA
Gracz odkrywa opisy podczas gry:
- "Czym jest druk 3D?"
- "Materiały: PLA, PETG, ABS"
- "Co to jest warping?"
- "Jak działają podpory?"
- itp.

Teksty krótkie, zrozumiałe, bez jargonu.

## INTERFEJS
- Mobilny, portrait
- 3 główne widoki:
  1. **Dashboard**: pieniądze, liczba drukarek, dostępne zlecenia
  2. **Zlecenie**: szczegóły, picker ustawień, przycisk "Drukuj!"
  3. **Wynik**: animacja druku, ocena, zarobek, "Dalej" do dashboarda
- Enklopedia: dostępna zawsze z górnego menu
- Ustawienia: dźwięki, języki (później), bez reklam (przycisk atrap)

## BALANSU SPRAWDZIĆ
- [ ] Czy gracz lubi drukować?
- [ ] Czy postęp jest satysfakcjonujący (nie za szybko, nie za wolno)?
- [ ] Czy jest motywacja do kupienia drugiej drukarki (czy to ma sens ekonomiczny)?
- [ ] Czy błędy druku są ciekawe, nie nudne?
- [ ] Czy encyklopedia uczy, nie przytłacza?

## TECHNOLOGIA
- HTML5 + vanilla JS (żadnych zależności)
- CSS3 grid/flexbox
- localStorage dla zapisu postępu
- SVG dla grafiki (prostych kształtów)
- Web Audio API dla dźwięków (opcjonalnie)
- Gotowe do Capacitor (brak API, tylko offline)
- Polski UI + teksty międzynarodowe (pliki language/pl.json i en.json)
