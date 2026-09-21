# Farma Drukarek 3D

Mobilna gra managementu o prowadzeniu farmy drukarek 3D. Gracz zarządza drukarką, przyjmuje zamówienia od klientów, dobiera ustawienia druku i zarabia pieniądze.

## Status

**v0.1 - Prototyp grywalny** (21 września 2026)

Gra jest w pełni grywalna. Gracz może:
- Otrzymać losowe zlecenia od klientów
- Zaakceptować/odrzucić zlecenia
- Dobierać ustawienia druku (temperatura, prędkość, wypełnienie, itp)
- Obserwować animację druku
- Zarabiać pieniądze i reputację na podstawie jakości

## Uruchomienie

```bash
python3 -m http.server 8000
# Otwórz http://localhost:8000/index.html
```

## Technologia

- **HTML5 + JavaScript** (bez frameworków)
- **Responsywny design** (mobile-first, portret)
- **localStorage** do zapisu postępu
- **Gotowe do Capacitor** (Android/iOS)

## Plany

- [ ] Drukarki (różne modele, cechy)
- [ ] Magazyn filamentów
- [ ] Klienci stali
- [ ] Osiągnięcia
- [ ] Capacitor setup
- [ ] AdMob + Google Play Billing
- [ ] Google Play Store submission

Deadline: 1 października 2026