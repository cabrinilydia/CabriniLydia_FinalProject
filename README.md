# Desi Mirror · देसी கண்ணாடி

**Cabrini Lydia Lourdu Leo** · DM3014 Interactive Devices · Final Project 2026

A webcam mirror that gets you ready for a desi family function. You clear the steam off the glass, put on your bindi, jhumkas and bangles, pick an outfit with your phone, go looking for a snack in a very chaotic kitchen, and leave with a photo strip of your whole look. It all runs in the browser: your face, your hands, your breath and your phone are the controls. You never need to touch the mouse.

- **Try it live (Chrome):** https://cabrinilydia.github.io/desi_mirror/
- **Video walkthrough:** [`DesiMirror_FinalProject/Video/`](DesiMirror_FinalProject/Video/)
- **Code:** [`DesiMirror_FinalProject/DesiMirror/`](DesiMirror_FinalProject/DesiMirror/)

The name is half Hindi and half Tamil: *desi* (देसी) is the word everyone uses for South Asian culture, and *kannadi* (கண்ணாடி) is mirror in Tamil. I'm Tamil, so the mirror had to be in Tamil.

---

## 1. Creative motivation

### Getting ready is my favourite part

Before a function, the getting ready is honestly my favourite part. It's just me, my space and my mirror. It's peaceful. I sit at my vanity, which is always a bit messy, and I go through my makeup one thing at a time. Over the years I've gotten better at doing my makeup, and the better I've gotten, the more fun dressing up has become. A lot of the time I get ready in front of my camera, basically my own get-ready-with-me. So when I wanted to make something interactive with a webcam, the webcam was already the thing I get ready in front of. The front camera already is my mirror.

### I learnt it from watching the women in my family

Since I was young I've watched my mom and my grandma get ready, and the women in my family dress up properly. Indian dressing isn't simple. It's grand. There is jewellery for almost every part of you: on your head, on your ears, around your neck. There's the *maattal*, the chain that links your earring up into your hair. Watching them go through all of it is a big part of why getting ready means so much to me.

In my house it's three of us: my mom, my sister and me. Nothing is really "mine". I can go through my mom's wardrobe for a saree, my sister goes through my makeup, my mom goes through our accessories. Everything is shared, the mirror included, and I really like that. The mirror isn't a private thing in my house. It's a shared space, and getting ready is something we do around each other.

That's what Desi Mirror is about. It's the ritual I grew up watching, and still love doing, turned into something you can step into.

### Why these five chapters, in this order

At the critique the question I got was: why chapters, and why these ones? The answer is that the chapters are simply the order I actually get ready in. I hadn't said it out loud before, but once I wrote it down it was obvious.

1. **Steam.** You come out of a hot shower and the mirror is fogged. Before anything else you have to wipe it to see yourself. A foggy mirror is also really nostalgic. Almost everyone has written their name or drawn a smiley face in the steam on a bathroom mirror, so people recognise it straight away, before they know anything else about the piece. That's why it comes first: it's the hook. You breathe on the glass, wipe it with your palm and write your name with a finger, just like you would on a real one. It's also the moment people realise the mirror is actually watching them.
2. **Glam.** This is the part I love: sitting at the vanity, makeup first, then the jewellery. A bindi on your forehead, jhumkas on your ears, bangles on your wrists. Real jewellery sits *on* your body and moves with you, so in the mirror it had to stick to you too. The jhumkas swing when you turn your head, the way they actually do.
3. **Outfit.** Choosing the outfit means going through a wardrobe that isn't only yours, trying things on, and throwing the ones you don't want onto the floor. I made the phone the wardrobe because it's something you hold and go through, like the clothes in your hands. Tilt to browse, flick to throw it on the pile, tap to wear it.
4. **Snack Mission.** This is the one chapter that leaves the mirror, and that was on purpose. You take the look you just built with you (your real face and the outfit you chose) into the most shared room in the house: the kitchen. It's based on my own kitchen. My family doesn't really hide snacks (in the game, blaming Amma and Paati for hiding them is the joke), but nothing is ever in the container it should be. Open the cookie tin and it's the sewing kit. Open the ice-cream tub and it's sambar. Looking for food in my house really is a game: you keep opening tins until you find the thing. So I made it a game. I also really enjoyed the Play Environments lesson, and this was my chance to take that further.
5. **Photo.** When you're finally ready, you look at yourself one more time. So much of my getting ready happens in front of a camera that it felt right to end with one: hold up both hands, 3, 2, 1, and you get a photo strip with your whole look in it. It's the one thing you walk away with.

### Representation, and why the title mixes two languages

Being in a minority race in Singapore, we don't always get a lot of representation. Hindi and Tamil are the two Indian languages I know, and they're two of the biggest Indian communities here, so I put both in the title: *desi* in Hindi, *kannadi* in Tamil. There are so many others (Malayalam, Telugu and more) that I'd love to bring in one day.

Online it's actually gotten a lot better. More people are getting rooted in their culture and sharing it, and when I went looking on Pinterest I found so many illustrators drawing sarees, lehengas, jhumkas and desi food in a style I loved. That's why the outfits, jewellery, makeup and snacks in Desi Mirror are their illustrations (credited below). Finding them felt like seeing my own culture drawn back at me, and I wanted to put that inside something you can actually wear.

### Who it's for, and what I want people to feel

It's for anyone who grew up sharing a mirror, a wardrobe and a kitchen with their family, especially desi girls who watched their moms and grandmas get ready. It's also for people who didn't. For them it's a small, fun way into a ritual that is a really big deal in our homes.

I want people to feel what I feel at my vanity: that getting ready is calm, playful and a bit grand. I want them to laugh when the jhumkas swing, laugh again at the sewing kit, and leave with a photo of themselves fully dressed up.

---

## 2. How I implemented it

### Overview

```
webcam ──> ml5 faceMesh (468 face points) ─┐
       └─> ml5 handPose (21 points/hand) ──┤
mic ─────> Web Audio loudness ─────────────┼──> one p5.js sketch, 5 chapters
phone ───> gyroscope + accelerometer       │    (everything drawn every frame
           └─> Firebase Realtime DB ───────┘     on top of the mirrored video)
```

Everything is p5.js. One sketch (`index.html`) is the mirror and a second page (`phone.html`) is the phone remote. Each chapter is its own object in its own file in `js/` with the same small interface (`enter`, `update`, `drawWorld`, `drawUI`, plus `action` and `key` where needed), so `main.js` just runs whichever chapter you're on. Whatever you put on in Glam stays on in every chapter after it, which is why it shows up in the kitchen and in your photo.

### The tracking (computer vision)

- **Face and hands together.** ml5's faceMesh gives 468 points on the face and handPose gives 21 points per hand. Running both at once crashed, because both load MediaPipe files at the same moment. The fix was to load the hand model only once the face model is ready.
- **Bundled models.** The MediaPipe model files are inside `lib/mediapipe/`, so the piece doesn't depend on a CDN loading on campus Wi-Fi during a demo.
- **Mirror maths.** A mirror has to be flipped, but the webcam video and the tracking points were being flipped in different ways, so jewellery landed on the wrong side of the face. Now I turn off every built-in flip and mirror both the video and the points myself, so they always line up.
- **Smoothing.** Raw points jitter, so each point eases towards its new position every frame (`SMOOTH` in `tracking.js`). If your face is lost for under a second the look stays on instead of flickering off.

### Chapter by chapter

| Chapter | How it works |
|---|---|
| 1 Steam | The mic goes through the Web Audio API and I measure its loudness (RMS) every frame against the room's noise floor. Breath paints fog around your mouth point from faceMesh. The fog is its own half-resolution p5 graphics layer over the video; an open palm (all five fingers out) erases a big patch with `erase()`, one finger draws a thin line so you can write. Every wipe spawns drips that slide down. |
| 2 Glam | Each piece is pinned to specific face points. The bindi sits 30% of the way from point 9 to point 151 on the forehead, rotated with your head. Jhumkas hang from the earlobe points, scale with your face width, and hide when that ear turns away from the camera. Their swing is a small pendulum: moving your head pushes it, gravity and damping settle it. Bangles follow the angle from your wrist to your middle finger. |
| 3 Outfit | `phone.html` reads DeviceOrientation (left/right tilt) and DeviceMotion (a flick is a sharp jump in acceleration, over 15 m/s²). It writes `{action, tilt}` to Firebase under a 4-letter room code from the QR. The mirror reacts whenever a new action arrives and writes back what's on the rail, so the phone screen stays in sync. The outfit PNG is scaled by your face width, turned with your head tilt and pinned under your chin. Each outfit has its own shoulder width, centre and drop so it actually fits. |
| 4 Snack Mission | A side-scrolling platformer. The head is your live face, cropped from the webcam every frame and clipped into a circle on top of the outfit you chose. Gravity, jumping and one-way platforms (counters, shelves, the steel rack, the fridge) in a kitchen 3.2 screens wide with a camera that follows you. 13 containers, 10 snacks and some decoys. Control it with phone tilt and flick, or with no phone: point left or right of yourself to run, open your palm to jump. |
| 5 Photo | When handPose sees both hands up for almost a second, a 3-2-1 countdown starts. On each beat it copies the whole canvas (video plus everything drawn on you). The three frames are laid out on a new canvas with a marigold border, the title and the date, and saved as a PNG. |

### No mouse anywhere

I wanted it to feel like a mirror, not a computer. Your index fingertip becomes a cursor, and holding it over any button for 0.85 s presses it (a "dwell" button, in `ui.js`). An open palm starts the piece. The phone also has back and next for every chapter, so you can run the whole thing from your phone.

### The art, and the generative parts

- **Drawn in code.** The arched mirror, the marigold garland, the bindis, the vanity props and the whole kitchen (tiles, shelves, the Tamil calendar, the kolam on the floor, every tin and dabba) are drawn in p5 in `art.js` and `ch_kitchen.js`. Each shape is drawn with a little random jitter and a shaky outline, so it looks hand-drawn and slightly different every time it's generated. Everything is drawn once into off-screen layers at the start, so drawing it every frame stays cheap.
- **Procedural effects.** The fog is built from random soft blobs, the drips are simple particles, and all animation uses frame time so it runs at the same speed on a slow laptop.
- **Pinterest illustrations.** The outfits, jhumkas, bangles, some vanity makeup and the snacks are illustrations by other artists. They were cut out of their backgrounds (background removal plus a colour flood-fill for the tricky ones) and then fitted to the body with per-image numbers.

### Tools and libraries

p5.js 1.11.11 · ml5.js 1.3.1 (faceMesh, handPose) · MediaPipe FaceMesh and Hands models · Web Audio API · Firebase Realtime Database (JS SDK 10.14.1) · qrcode-generator 1.4.4 · Google Fonts (Rozha One, Baloo 2, Baloo Thambi 2) · GitHub Pages for https hosting, which the camera and phone sensors need.

### How it connects to the module

| Week | From class | Where I went beyond it |
|---|---|---|
| 3 Net Art | a piece you open from a link | a whole multi-chapter piece hosted on GitHub Pages |
| 4 Play Environments | my platformer from the platformer guide, with phone buttons through the lecturer's Socket.IO relay | your live face as the character, a 3-screen kitchen with a following camera, hidden containers, phone tilt or hand controls |
| 5 Computer Vision | webcam into p5, drawing over the video | breath on a fog layer, wiping with your hand |
| 6 ml5 / Teachable Machine | a model that gives a label | raw face and hand landmarks, two models at once, jewellery physics, a no-mouse interface |
| 11 Remote Interaction | Firebase between a device and a webpage | the phone's own motion sensors as controls, room codes, two-way sync |

---

## 3. How successful was it?

At the critique people genuinely had fun with it. They liked the design, the colours and how many little elements there are to it. The tracking holds up well in normal lighting: the bindi stays put, the jhumkas swing, and the outfit follows you as you move. The phone link worked on the live site, and because the whole thing is in the browser, anyone can try it from the link with no install.

The thing I'm proudest of is that it feels like my getting-ready routine. The order of the chapters, the shared wardrobe, the kitchen full of mismatched tins: those are all from my house.

---

## 4. Credits, and what is my own work

**My own work:** the concept and the idea of building it around my own getting-ready ritual and my own kitchen; the five chapters and their order; the Tamil and Hindi title; choosing and collecting every illustration; all the design decisions about what goes in, what gets cut and how it should look and feel; testing every version on my laptop and phone and asking for fixes; setting up the Firebase project and the GitHub Pages hosting; and the presentation.

**AI assistance:** I used Claude (Anthropic's AI assistant) as a coding partner throughout. Claude wrote most of the JavaScript and helped me debug it, working from my descriptions, my reference reels and my feedback after every test.

**Course material:** the Firebase setup follows the Week 11 Remote Interaction demo. The one-way platform check in Snack Mission follows the `landingOnPlatform` pattern from the Week 4 platformer guide.

**Illustrations (Pinterest):** the outfits, jhumkas, bangles, some vanity makeup and the snack illustrations are by other illustrators, including @deepthidesigns, Zevar_sketch_by_Zoya, Dòra Harcos and rinianart.com (the jalebi). They're used here, cut out of their backgrounds, for a non-commercial student project. All other art is drawn in code.

**Inspiration:** five Instagram reels I found while brainstorming: a vanity mirror told in steps that ends in a photo strip, a mirror you breathe on and write in, hand tracking that places things on your face, a desi side-scroller game, and OpenWii, which uses a phone's motion sensors as a game controller.

**Libraries:** [p5.js](https://p5js.org) (LGPL-2.1), [ml5.js](https://ml5js.org) (MIT), [MediaPipe](https://github.com/google-ai-edge/mediapipe) FaceMesh and Hands (Apache 2.0), [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase (MIT), [Firebase JS SDK](https://firebase.google.com) (Apache 2.0), Google Fonts Rozha One, Baloo 2 and Baloo Thambi 2 (SIL Open Font License).

---

## 5. How to run it

### Easiest: the live link

Open **https://cabrinilydia.github.io/desi_mirror/** in Chrome on a laptop. Allow the camera and microphone. Sit about an arm's length from the screen with your face in the middle, and hold up an open palm to start.

### Running it locally

The camera only works on `localhost` or `https`, so don't double-click `index.html`.

```bash
cd DesiMirror_FinalProject/DesiMirror
python3 -m http.server 8000
```

Then open `http://localhost:8000` in Chrome. (Or in VS Code: right-click `index.html` → **Open with Live Server**.)

### Phone remote (optional)

The phone needs https, so use the live link. The start screen shows a QR code: scan it with your phone, tap **start** and allow motion access. Your phone then has back/next for every chapter, becomes the wardrobe in Outfit and the controller in Snack Mission. `config.js` already holds the project's Firebase settings. To use your own Firebase project instead, paste your web config there and allow the `desi` path in your Realtime Database rules:

```json
"desi": { "$room": { ".read": true, ".write": true } }
```

### Controls

| Action | Hands / phone | Keyboard |
|---|---|---|
| Start | hold up an open palm | any key |
| Press a button | hold your fingertip on it | click |
| Steam | breathe into the mic, wipe with your palm, write with one finger | hold B to breathe |
| Outfit | phone: tilt to browse, flick to toss, tap wear | ← → browse, ↓ toss, ↑ wear |
| Snack Mission | phone: tilt to run, flick to jump · hands: point left/right of yourself to run, open palm to jump | ← → run, Space jump, R replay |
| Photo | hold up both hands | Space take photos, S save |
| Anywhere | phone back / next | 1 to 5 chapters, N next, H hide UI, F fullscreen |

### Folder structure

```
CabriniLydia_FinalProject/
├── README.md                 this write-up
└── DesiMirror_FinalProject/
    ├── DesiMirror/            the code
    │   ├── index.html         the mirror
    │   ├── phone.html         the phone remote
    │   ├── config.js          Firebase settings
    │   ├── style.css
    │   ├── js/                main.js, one file per chapter, tracking, look, art, ui, remote, phone
    │   ├── assets/            outfits, jhumkas, bangles, vanity, snacks
    │   └── lib/               p5.js, ml5.js, qrcode.js, MediaPipe models
    └── Video/                 walkthrough video
```
