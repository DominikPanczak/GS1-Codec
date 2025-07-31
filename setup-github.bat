@echo off
echo Setting up GitHub repository for GS1-Codec...

REM Initialize git repository
git init

REM Configure git (adjust email if needed)
git config user.email "dominikpanczak@gmail.com"
git config user.name "Dominik Panczak"

REM Add remote origin
git remote add origin https://github.com/DominikPanczak/GS1-Codec.git

REM Add all files
git add .

REM Create initial commit
git commit -m "Initial commit: Complete GS1 Codec library with Onion Architecture

Features:
- TypeScript library for GS1 data encoding/decoding
- Onion Architecture (Domain, Application, Infrastructure, Presentation)
- Full validation according to GS1 standards
- Support for standard Application Identifiers (AI)
- Round-trip encoding/decoding with validation
- Complete documentation and examples
- Unit tests and integration examples

Supported AI:
- 01: GTIN (Global Trade Item Number)
- 10: Batch/Lot Number
- 11: Production Date
- 17: Expiration Date  
- 21: Serial Number
- 30: Count
- 3100-3105: Weight

Standards compliance:
- GS1 General Specifications v23.0+
- Section 5.1 Data Formatting Rules
- ISO/IEC standards for barcodes
- GTIN-14 checksum validation (EAN algorithm)

Ready for production use in:
- QR codes
- GS1-128 barcodes
- Supply chain systems
- Inventory management"

REM Set main branch
git branch -M main

REM Push to GitHub
git push -u origin main

echo.
echo Repository setup complete!
echo Visit: https://github.com/DominikPanczak/GS1-Codec
pause