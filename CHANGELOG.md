# CHANGELOG - Farma Drukarek 3D

## 2026-09-21 - v0.1 (Prototyp Grywalny)

### Dodane
- **Struktura projektu**: HTML5 + JavaScript, bez ciężkich frameworków
- **System zapisu**: localStorage, trwałe dane gracza
- **Generator zleceń**: Losowe klienty, modele, materiały, wymagania, terminy
- **Interfejs doboru ustawień**:
  - Temperatura dyszy (materiał-zależna)
  - Temperatura stołu
  - Wysokość warstwy
  - Wypełnienie
  - Prędkość druku
  - Użycie podpór
- **Silnik druku**:
  - Kalkulacja czasu druku na podstawie ustawień
  - Koszt filamentu
  - System jakości (0-100%)
  - Symulacja problemów (odklejenie, warping, stringing, itp)
- **Animacja druku**: Wizualizacja drukarki, pasek postępu, status
- **System wyniku**:
  - Ocena jakości
  - Zarobek (bazowy)
  - Napiwek (zależy od jakości)
  - Zmiana reputacji
  - Rating (średnia ocen)
- **Statystyki gracza**:
  - Pieniądze
  - Reputacja
  - Poziom
  - Liczba wydrukowanych modeli
  - Średnia ocena
  - Całkowite zarobki
- **UI**:
  - Responsywny design (mobilny, portret)
  - Gradientowe tła
  - Przyjazne kolory
  - Przesuwane menu boczne
  - Animacje przejść między ekranami
- **Tłumaczenie**: Pełne teksty po polsku
- **Dokumentacja**: ROADMAP.md, CHANGELOG.md, DESIGN.md

### Znane problemy
- Kalkulacja czasu druku jest uproszczona (nie uwzględnia geometrii modelu)
- Demo czas druku to 10 sekund (produkcja: 1-2h) — do umowy w GAME_CONFIG

### Do przetestowania
- [ ] Gra uruchamia się bez błędów
- [ ] Przejście pełnej pętli: nowe zlecenie → przyjęcie → ustawienia → druk → wynik
- [ ] Zapis postępu przechowuje się po odświeżeniu strony
- [ ] Resetowanie gry działa
- [ ] Responsywność na telefonie (Chrome DevTools mobile)
- [ ] Wydajność animacji

---

## TODO na następną sesję
1. Poprawić bug w `data.js` (timeTime → timeMinutes)
2. Testować grę w przeglądarce i urządzeniu mobilnym
3. Zbalansować: czasy druku, zarobki, trudność
4. Polepszyć UI ikonę menu
5. Dodać drukarki do wyboru
