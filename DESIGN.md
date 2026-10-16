---
name: Addis Gebeta
description: The city's shared table — a red-banded, photo-led food delivery app for Addis Ababa.
colors:
  brand: "#e42f3a"
  brand-600: "#c81f2b"
  brand-300: "#f4797f"
  brand-100: "#fde7e8"
  brand-50: "#fff4f4"
  gold: "#f6c343"
  ticket-green: "#157a3c"
  ticket-blue: "#1f8fd6"
  ticket-orange: "#f26a1b"
  tsom: "#2e7d32"
  tsom-soft: "#e6f4e6"
  rating-star: "#f5b301"
  danger: "#d93a2b"
  danger-soft: "#fbe5e2"
  bg: "#ffffff"
  surface-2: "#f4f4f6"
  surface-3: "#ececf0"
  line: "#ececef"
  line-strong: "#dcdce2"
  ink: "#17171c"
  ink-2: "#4a4a55"
  ink-3: "#7c7c88"
  on-ink: "#ffffff"
typography:
  display:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  item:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16.5px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.25
  offer:
    fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "27px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  geez:
    fontFamily: "'Noto Sans Ethiopic', Rubik, sans-serif"
    fontWeight: 600
rounded:
  xs: "8px"
  sm: "12px"
  chip-sq: "14px"
  md: "16px"
  control: "18px"
  tile: "20px"
  lg: "22px"
  xl: "28px"
  pill: "99px"
spacing:
  hair: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "20px"
  section: "28px"
components:
  button-brand:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    height: "56px"
    typography: "{typography.item}"
  button-brand-inline:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 22px"
  button-text:
    textColor: "{colors.brand}"
    padding: "6px 2px"
  button-icon:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "42px"
  button-add:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    size: "40px"
  filter-chip:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "46px"
    padding: "0 18px"
  filter-chip-selected:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
  menu-tab:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "38px"
    padding: "0 16px"
  menu-tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
  meta-pill:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.xs}"
    height: "27px"
    padding: "0 6px"
  search-field:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 14px"
  group:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.control}"
  bill:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.control}"
    padding: "16px 18px"
  cart-bar:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.lg}"
    height: "66px"
    padding: "0 18px 0 13px"
  offer-ticket:
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    width: "262px"
    height: "146px"
    padding: "18px 18px 0"
  ticket-tag:
    backgroundColor: "{colors.gold}"
    textColor: "#1d1a12"
    rounded: "9px"
    typography: "{typography.offer}"
  restaurant-photo:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.lg}"
    size: "116px"
  brand-tile:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.tile}"
    size: "88px"
---

# Design System: Addis Gebeta

## Overview

**Creative North Star: "The Red Table Runner"**

Addis Gebeta is laid like a table: a band of brand red (#E42F3A) runs across the top of the home and profile screens and melts into a white cloth, and everything set on that cloth is food. Photography carries the colour of the body of every screen; the UI itself stays white, tinted-neutral ink, and one confident red for whatever the hungry user should touch next. Density is high but calm: a 20px gutter, one horizontal-scroll grammar, and large rounded photo tiles (20–28px) that read at a glance with one thumb.

The world is a user-pinned reference (a red food-delivery home: service tiles, "Deliver to" bar, photo cuisine row, ticket-cut offers, monogram brand grid, filter chips, restaurant list) made Addis-native. Local identity arrives through Ge'ez type (Noto Sans Ethiopic) on monograms and feature lines, the green "Tsom" (fasting) signal beside Habesha dishes, and a single authored moment: the splash, where injera batter spirals over a red mitad, the six pits of a gebeta board are sown in playing order, and the wordmark settles before the cloth lifts away. The app is light-only (`color-scheme: light`); there is no dark theme.

Restaurants and brands are fictional; their identities are drawn as typographic monograms on flat colour, never photographs of real logos.

**Key Characteristics:**
- Brand red at band scale (top gradient, cart bar, primary CTA), not sprinkled.
- Photos are the colour; chrome is white plus tinted ink.
- Big soft corners from one family (12 / 16 / 18 / 20 / 22 / 28, pills for chips).
- Hairlines drawn as 1px box-shadows, not borders.
- Ge'ez accents as identity, Rubik for everything functional.
- Tactile press feedback on every tappable (scale 0.97, 0.985 on large surfaces).

## Colors

One saturated red does the work, a tight set of tinted neutrals holds the page, and three ticket colours plus a fasting green exist only where the reference world put them.

### Primary
- **Mitad Red** (brand): the home and profile band gradient, primary CTA, cart bar, add and stepper buttons, selected filter chip, tab-bar selected icon, links ("See all"), focus outline and caret. The ink colour of every "do this next".
- **Deep Berbere** (brand-600): pressed/shade red and the text colour on red-tinted badges (Popular tag, offer perk).
- **Rose Wash** (brand-100) and **Blush Cloth** (brand-50): soft fills behind red text or icons (favourite-on, perk, group icons, "Order again" pill, text selection).
- **Ember Pink** (brand-300): the mid-stop tint of the red field.

### Secondary
- **Offer Ticket Trio**: **Ticket Green** (ticket-green), **Ticket Blue** (ticket-blue), **Ticket Orange** (ticket-orange). Used only as full-bleed backgrounds of offer tickets; never as UI accents.
- **Price-Tag Gold** (gold): the stamped discount tag on a ticket, with near-black text (#1d1a12).

### Tertiary
- **Tsom Green** (tsom) on **Tsom Leaf** (tsom-soft): fasting-friendly tags, the free-delivery meta pill, savings lines in the bill, positive group icons. It means "good for you / costs you less".
- **Star Amber** (rating-star): the rating star glyph only.
- **Danger Red** (danger) on danger-soft: destructive rows (sign out, clear). Distinct from brand red so destruction never reads as the primary action.

### Neutral
- **Cloth White** (bg): every page and card ground.
- **Injera Grey** (surface-2): photo placeholders and shimmer, search field, meta pills, inactive menu tabs, icon buttons in bars, the bill block.
- **Pale Slate** (surface-3): empty progress-bar tracks.
- **Hairline** (line) and **Firm Hairline** (line-strong): row dividers, card outlines, unselected chip outlines, the dashed bill-total rule.
- **Coffee Ink** (ink), **Second Ink** (ink-2), **Quiet Ink** (ink-3): primary text, secondary text and meta values, captions and placeholders. All three carry a faint blue-violet tint; none is pure grey.

### Named Rules
**The Band-Scale Red Rule.** Brand red appears as a field (the top band, the cart bar, a full-width CTA) or as a small decisive control (add button, selected chip). Between those scales it does not decorate; body chrome stays white and ink.

**The Photos-Carry-Colour Rule.** Food photography supplies the hue below the band. Do not add tinted card backgrounds to "liven up" a list; give it a photo.

**The Tickets-Only Trio Rule.** Green, blue and orange are offer-ticket grounds. They never become buttons, tags or icon colours.

## Typography

**Display / Body Font:** Rubik (with -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif)
**Identity Font:** Noto Sans Ethiopic (600, 800), for Ge'ez text
**Monogram-only faces:** Bebas Neue, Pacifico, Abril Fatface, used solely inside fictional restaurant logos

**Character:** Rubik's soft, slightly rounded grotesque matches the 20px+ corners and reads friendly at 12px; tight negative tracking on headings gives it appetite and punch. Ge'ez in Noto Sans Ethiopic is the local voice, set heavier and larger than the Latin around it.

### Hierarchy
- **Display** (700, 30px, 1.15, -0.03em): page titles on tab screens (For You, Orders). The splash wordmark is the single larger moment (800, 36px).
- **Headline** (700, 22px, 1.2, -0.02em): section heads ("Offers for you", "Popular brands"); restaurant name in the sheet runs 24px; feature card titles 27px over photos.
- **Title** (600, 19px, 1.2, -0.015em): restaurant names in lists, menu section heads (700).
- **Item** (600, 15–16.5px, 1.25, -0.01em): dish names, cart counts, button labels (700, 16px).
- **Body** (400, 13.5–14.5px, 1.45): dish descriptions (clamped to two lines), area lines, bill lines, in ink-2/ink-3.
- **Label** (500, 12–12.5px): tab-bar labels, meta pills, ETA captions.
- **Offer** (800, 27px, -0.02em): the ticket discount figure and its partner word.

### Named Rules
**The Tabular Money Rule.** Every price, quantity, ETA and count uses `font-variant-numeric: tabular-nums`, so numbers never jitter when the cart changes.

**The Ge'ez-As-Voice Rule.** Ge'ez appears where identity speaks (monograms, a feature card's native-script line), never as running UI copy or as decoration on controls.

**The Input-16 Rule.** Text inputs are 16px or larger so iOS never zooms on focus.

## Layout

A single-column phone layout with a 20px side gutter everywhere content meets the edge. Vertical rhythm is 28px between home sections, 14px from a section head to its row, 12px between horizontally scrolled items (14px in the cuisine row, 10px in the brand grid). Horizontal rows are one grammar: overflow-x scroll, gutter-aligned scroll padding, proximity snap, hidden scrollbar. The brand grid is two rows flowing as columns so both rows scroll together.

Lists (restaurants, dishes, cart lines) are flat rows separated by a 1px hairline, not stacked cards. Grouped settings and checkout options sit in an inset-outlined group container. Bottom padding of 120–140px keeps content clear of the floating cart bar and the 62px tab bar. Bars and page headers cap at 540–560px and centre on wider screens. Safe-area insets are added to every top band and bottom dock. On phones narrower than 380px, the distance meta pill drops its icon so the three pills stay on one line.

## Elevation & Depth

A hybrid: surfaces are mostly flat white with hairline outlines, and soft, tinted, long-falloff shadows lift only what floats (cart bar, live-order strip, profile stats, buttons laid over photos). Red elements cast red-tinted shadows; neutral elements cast ink-tinted ones. Depth on the restaurant page comes from a 28px-radius white sheet overlapping the hero photo by 28px, with the monogram poking up through it in a 4px white ring.

### Shadow Vocabulary
- **Card** (`0 1px 2px rgba(23,23,28,0.05), 0 8px 24px -14px rgba(23,23,28,0.18)`): generic resting cards and icon buttons.
- **Float** (`0 4px 10px -2px rgba(23,23,28,0.1), 0 18px 36px -14px rgba(23,23,28,0.28)`): live-order strip, profile stat tiles.
- **Brand glow** (`0 6px 14px -6px rgba(228,47,58,0.55)`): every red button; the cart bar adds `0 18px 34px -16px rgba(120,10,20,0.55)`.
- **Hairline** (`0 1px 0 var(--line)` / `inset 0 0 0 1px var(--line)`): dividers and outlines, drawn as shadows so they never shift layout.
- **Ring** (`0 0 0 2px #fff`, or `0 0 0 3px #fff` on add buttons): separates a logo or button from the photo it overlaps.

### Named Rules
**The Tinted Shadow Rule.** Shadows are never neutral black: ink-tinted on white elements, deep-red-tinted on red ones, with negative spread so they pool under the object rather than haloing it.

## Shapes

Generous, soft corners from one family: 8px (meta pills), 12px (icon squares), 14px (cart thumbnails, segmented control), 16px (search field), 18px (buttons, offer tickets, groups, bill, dish photos), 20px (service tiles, brand tiles, list cards), 22px (restaurant photos, cuisine tiles, cart bar), 28px (bottom sheets). Chips, tabs, steppers and round actions are full pills or circles. Restaurant monograms take a radius of about 26% of their size.

The signature silhouette is the **ticket cut**: offer cards are masked with an 11px semicircular notch on each side at 62% height, joined by a 2px dashed white perforation, with a faint stamped ring in the top-right corner. The splash mark is a 36px-radius white square holding the gebeta board (a 13px-radius bar with six pits).

## Components

### Buttons
Tactile and decisive; red means go.
- **Shape:** gently rounded rectangle (18px), full width, 56px tall; inline variant 48px with 22px side padding.
- **Primary (brand):** Mitad Red fill, white 16px/700 label, brand glow shadow. Used for Place order, Track, Back to home.
- **Text button:** red 15px/500 label with no fill ("Clear", "Add more", "See all").
- **Icon button:** 42px circle on Injera Grey in bars; white with a soft shadow when floating over a photo.
- **Add / Stepper:** 40px red circle (36px compact) with a 3px white ring, morphing into a red pill stepper with tabular quantity; a soft grey stepper variant sits in the cart.
- **Press:** every tappable scales to 0.97 (0.985 for cards and large surfaces) over 160ms on `cubic-bezier(0.23, 1, 0.32, 1)`. Disabled drops to 30% opacity.
- **Focus:** 2px brand outline, 2px offset.

### Chips
- **Filter chip:** 46px pill (38px in search), white with a 1.5px Firm Hairline inset outline, 15px/500 ink label with optional 19px icon. Selected: solid Mitad Red, white label.
- **Menu tab:** 38px pill on Injera Grey, ink-2 label; the active tab is solid Coffee Ink with white text, a deliberate counterweight to the red above it.
- **Meta pill:** 27px, 8px radius, Injera Grey, 12px/500 tabular (time, delivery fee, distance); free delivery switches to Tsom Green on Tsom Leaf.
- **Dish tag:** 10.5px/700 uppercase small badge, 6px radius; "Popular" in Deep Berbere on Rose Wash, "Tsom" in Tsom Green on Tsom Leaf.

### Cards / Containers
- **Restaurant row:** a flat row, not a card: 116px photo at 22px radius with the monogram badge bottom-left and a red offer flag top-left, then name, area, rating and meta pills, separated by a hairline.
- **Dish row:** text left, 112px photo right (18px radius) with the add button overhanging the bottom-right corner.
- **Group:** 18px radius, white, 1px inset hairline; rows of at least 62px with a 38px rounded icon square.
- **Bill:** Injera Grey block, 18px radius, tabular lines, a dashed Firm Hairline above the 18px/700 total.
- **Feature card:** 26px radius full photo with a warm brown-to-dark shade, white copy and a white pill CTA.

### Inputs / Fields
- **Search field:** 48px, 16px radius, Injera Grey with Quiet Ink icon and placeholder. Focus: background turns white and a 1.5px brand inset ring appears (180ms).
- **Note / form fields:** borderless 16px text inside groups; field labels turn brand red on focus.

### Navigation
- **Tab bar:** white, 62px plus safe area, top hairline, no blur. Four tabs (Home, For You, Orders, Profile); 25px icons over 12px/500 labels; inactive Quiet Ink, selected Mitad Red.
- **Restaurant top bar:** transparent over the hero with floating white circular buttons; on scroll it fills white, gains a hairline, and the restaurant name fades up into the centre.
- **Segmented control:** Injera Grey track, sliding white thumb (240ms), 14px/650 labels.

### Home Band (signature)
A vertical gradient from Mitad Red through Ember Pink to white (`#e42f3a → #ec5059 → #f58f94 → #fcd9db → #fff`). It holds five square service tiles (20px radius, 30% white glass; the active Food tile is solid white with a 2px red inset ring) and the "Deliver to" bar: a 48px red location square, the current address, and two 50px round actions (white search, red cart with a white count badge).

### Offer Ticket (signature)
262 x 146px, 18px radius, ticket-cut mask and dashed perforation, a Gold price tag with the discount figure in 27px/800, "Valid for N vendors" bottom-left and overlapping white-ringed monograms bottom-right.

### Restaurant Monogram (signature)
A square of flat brand colour with one or two lines of type, scaled in em from size/5 so one recipe works from a 28px badge to a 96px header. Five recipes: Ge'ez (Noto Sans Ethiopic 800), block (Bebas Neue), script (Pacifico), serif (Abril Fatface), round (Rubik 800); a tracked 700 sub-line in an accent colour drops away below 40px.

### Cart Bar (signature)
A 66px red pill-rectangle (22px radius) floating 12px above the tab bar: restaurant monogram, item count and restaurant name, tabular total with an arrow. It enters with a 24px rise over 320ms and swaps changed numbers with a blur-crossfade.

### Splash (signature)
Full-screen red radial (`#ef4b55 → #e42f3a → #b51b26`); a faint white injera spiral pours (1.6s) and turns; the white mark lands, its six pits sown at 90ms intervals; the 36px/800 wordmark rises; then the whole layer lifts upward over 420ms on `cubic-bezier(0.32, 0.72, 0, 1)`. Tapping skips it.

## Do's and Don'ts

### Do:
- **Do** keep brand red at band or control scale: the top gradient, the cart bar, the primary CTA, add buttons, selected chips.
- **Do** lead every list and tile with a real photo, with an Injera Grey shimmer while it loads and a single 320ms fade once loaded.
- **Do** draw dividers and outlines as 1px box-shadows in Hairline (#ececef) so nothing shifts on state change.
- **Do** use tabular numerals for every price (ETB), quantity, ETA and count.
- **Do** give every tappable the press scale (0.97, or 0.985 on large surfaces) on the 160ms ease-out.
- **Do** tint shadows: ink-tinted on white, deep-red-tinted on red.
- **Do** honour reduced motion: entrances fall back to a fade, shimmer stops, progress fills jump.
- **Do** draw restaurant identities as fictional typographic monograms.

### Don't:
- **Don't** use the ticket green, blue or orange anywhere but an offer ticket ground.
- **Don't** use pure grey (#808080-style) text; use Coffee, Second or Quiet Ink.
- **Don't** wrap restaurant or dish rows in individual shadowed cards; they are flat rows on white.
- **Don't** use real brand names, logos or restaurant photos presented as partners.
- **Don't** add a dark theme or glass/blur bars; the system is light-only and the tab bar is solid white.
- **Don't** put Ge'ez on controls or running copy; it is the identity voice.
- **Don't** use the monogram display faces (Bebas Neue, Pacifico, Abril Fatface) outside restaurant logos.
- **Don't** add small uppercase kickers or eyebrows above headings; the legacy parcel screens still carry them and they are not part of this system.
