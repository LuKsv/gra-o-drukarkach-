# CHANGELOG — Farma Drukarek 3D

## [0.1.0] - 2026-09-21

### Dodane
- Struktura projektu (HTML5 + vanilla JS + CSS)
- Zapis postępu za pomocą localStorage
- Dashboard: wyświetlanie pieniędzy, liczby drukarek, dostępnych zleceń
- System zleceń: 5 początkowych zleceń (breloczki, figurki, części)
- Picker ustawień druku:
  - Wybór materiału (PLA, PETG, ABS)
  - Temperatura dyszy i stołu (ustawiana automatycznie dla materiału)
  - Wysokość warstwy (0.1, 0.2, 0.3 mm)
  - Wypełnienie (10, 20, 50, 100%)
  - Wzór wypełnienia (grid, gyroid, honeycomb)
  - Podpory (tak/nie)
  - Prędkość druku (30, 60, 100 mm/s)
  - Przyczepność (brak, brim, raft)
  - Orientacja (auto / custom)
- Symulacja druku:
  - Animacja postępu
  - Skrócony czas (2-10 sekund realnych = pełny druk)
  - Możliwość przyspieszenia (opcja "Szybciej!")
- System wyniku druku:
  - Porównanie ustawień z wymaganiami
  - 5 stopni wyniku: Idealny (5⭐), Dobry (4⭐), OK (3⭐), Słaby (2⭐), Porażka (0⭐)
  - Wyjaśnienia błędów druku w zrozumiałym języku
  - Mnożnik ceny zleceń wg wyniku
- System zarobków:
  - Cena bazowa × mnożnik wyniku = zarobek
  - Napiwek za 5⭐ (20% ceny)
- Enklopedia:
  - Krótkie opisy materiałów
  - Wyjaśnienia błędów druku
  - Porady z praktyki
- Interfejs mobilny:
  - Portrait orientation
  - Touch-friendly przyciski
  - Responsywny layout
  - Przejrzysty design
- Lokalizacja: polski UI i wszystkie teksty

### Znane Ograniczenia
- Brak drugiej drukarki (gracz nie może robić dwóch drukow jednocześnie)
- Brak pracowników
- Brak systemu reputacji/stałych klientów
- Brak ulepszenia części
- Brak zarządzania wilgocią filamentu
- Reklamy tylko atrapą (przyciski bez funkcji)

### Poprawki (zmiana-1)
- Naprawiono mapowanie błędu spaghetti w getErrorName

### Plan Następny (Etap 2)
- Druga drukarka + możliwość równoczesnych drukow
- Ulepszenia dla drukarek
- Magazyn filamentów z symulacją wilgoci
- Więcej typów zleceń
- Prawidłowe testowanie w przeglądarce
- Balansowanie trudności
- Dodatkowe artykuły encyklopedii dla każdego typu błędu
