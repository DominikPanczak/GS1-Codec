# 🚀 Setup GitHub Repository

## Automatyczne setup

Uruchom plik batch:
```bash
setup-github.bat
```

## Ręczne setup

1. **Inicjalizacja Git:**
```bash
git init
git config user.email "dominikpanczak@gmail.com"
git config user.name "Dominik Panczak"
```

2. **Dodanie remote origin:**
```bash
git remote add origin https://github.com/DominikPanczak/GS1-Codec.git
```

3. **Dodanie plików:**
```bash
git add .
```

4. **Commit:**
```bash
git commit -m "Initial commit: Complete GS1 Codec library

- TypeScript library for GS1 data encoding/decoding
- Onion Architecture implementation
- Full GS1 standards compliance
- Complete documentation and examples
- Ready for production use"
```

5. **Push do GitHub:**
```bash
git branch -M main
git push -u origin main
```

## 📁 Struktura repozytorium

Po upload na GitHub będziesz miał:

```
GS1-Codec/
├── README.md                    # Główna dokumentacja
├── STANDARDS.md                 # Referencje do standardów GS1
├── FORMAT-DOCUMENTATION.md     # Szczegóły formatów
├── package.json                 # Konfiguracja NPM
├── tsconfig.json               # Konfiguracja TypeScript
├── jest.config.js              # Konfiguracja testów
├── .gitignore                  # Ignorowane pliki
│
├── src/                        # Kod źródłowy TypeScript
│   ├── domain/                 # Warstwa domeny
│   ├── application/            # Warstwa aplikacji
│   ├── infrastructure/         # Warstwa infrastruktury
│   ├── presentation/           # Warstwa prezentacji
│   └── index.ts               # Główny plik eksportu
│
├── dist/                      # Skompilowany kod JavaScript
├── examples/                  # Przykłady użycia
└── __tests__/                # Testy jednostkowe
```

## 🎯 Kolejne kroki po upload

1. **Dodaj README badges** (opcjonalnie)
2. **Skonfiguruj GitHub Actions** dla CI/CD
3. **Opublikuj na NPM** jako pakiet
4. **Dodaj Issues templates**
5. **Skonfiguruj GitHub Pages** dla dokumentacji

## 📦 Publikacja na NPM

Po wgraniu na GitHub możesz opublikować pakiet:

```bash
npm login
npm publish
```

## 🔗 Linki

- **Repository**: https://github.com/DominikPanczak/GS1-Codec
- **NPM Package**: (po publikacji)
- **Documentation**: (GitHub Pages po konfiguracji)