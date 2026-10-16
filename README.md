# Addis Gebeta

A mobile food delivery app for Addis Ababa, built with Ionic React, TypeScript, Vite, and Capacitor.

Created by **Michael T** — [zmichael.click](https://zmichael.click).

## Features

- Addis Ababa city header with delivery address, search, and cart.
- A looping carousel of popular local restaurants.
- Restaurant pages with food banners, category filters, location, and available phone numbers.
- Food selection, quantity controls, cart, and simulated checkout.
- Order tracking, favourites, and parcel delivery screens.

## Run locally

Install Node.js and npm, then run:

```bash
npm ci
npm run dev
```

Open the local address printed in the terminal.

## Build

```bash
npm run build
npm run preview
```

For Android, install Android Studio and the Android SDK, then run:

```bash
npm run cap:sync
npx cap open android
```

## Design reference

The project takes inspiration from the food delivery home-screen reference supplied by Michael T: a red header, photo-based food categories, restaurant logos, compact filters, and bottom navigation. The current design adapts that reference with an Addis Ababa city background and circular restaurant carousel.

## Demo status

This project currently uses sample menus, prices, food photography, and simulated orders. Checkout does not send orders to restaurants or process payments. Restaurant logos belong to their respective owners; image sources are recorded in [public/places/sources.json](public/places/sources.json).

## Creator

**Michael T** · [zmichael.click](https://zmichael.click)
