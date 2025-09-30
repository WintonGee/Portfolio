# Timeline Logos

This directory contains company and institution logos used in the timeline component.

## Logo Files

- `mercor.png` - Mercor company logo
- `cochat.png` - CoChat.io startup logo (fallback)
- `afterquery.png` - AfterQuery Experts logo (fallback)
- `calpoly.png` - Cal Poly San Luis Obispo logo
- `ccsf.png` - City College of San Francisco logo
- `ricoh.png` - Ricoh USA logo
- `square.png` - Square company logo
- `linkedin.png` - LinkedIn company logo
- `tribot.png` - Tribot company logo (fallback)
- `default.png` - Default fallback logo

## Logo Sources

Logos are downloaded from:

- Clearbit Logo API (https://logo.clearbit.com/)
- Official company websites
- Fallback placeholder logos for companies without available logos

## Usage

The timeline component automatically maps institution names to logo files using the `getLogoPath()` function in `EducationTimeline.tsx`.

## Updating Logos

To update or add new logos:

1. Place the logo file in this directory
2. Update the `logoMap` in `EducationTimeline.tsx`
3. Ensure the logo is 24x24 pixels or similar size for optimal display
4. Use PNG format for best compatibility

## License

Please ensure all logos are used in compliance with the respective companies' brand guidelines and licensing terms.
