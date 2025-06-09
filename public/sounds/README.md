# F1 Sound Effects for BoxBoxBox Loading Screen

The loading screen requires the following sound files:

## Required Audio Files

1. `f1-engine.mp3` - High-revving F1 engine sound (V8 or V10 era for more dramatic effect)
2. `start-signal.mp3` - F1 starting lights/beep sound or race start revs
3. `f1-radio-static.mp3` - Team radio static/clicking sound for ambient background
4. `senna-quote.mp3` - A famous Ayrton Senna quote audio clip

## Sources for F1 Sound Effects

You can find high-quality F1 sound effects on:

- [F1 Official Sound Library](https://www.formula1.com/) (requires license)
- [Formula 1 on YouTube](https://www.youtube.com/user/Formula1) for clips
- [Freesound.org](https://freesound.org/search/?q=formula+1)
- [Zapsplat](https://www.zapsplat.com/) (search for "motorsport" or "race car")
- [Soundsnap](https://www.soundsnap.com/)

## Ayrton Senna Quotes

For the Senna quote audio, look for interview clips or documentaries such as:
- "Senna" documentary (2010)
- YouTube compilations of Ayrton Senna interviews
- F1 archive footage

## Creating the Audio Files

If you can't find suitable pre-made files:

1. For radio static: Record static noise and add intermittent clicks
2. For Senna quotes: Use a text-to-speech service to recreate famous quotes
3. For engine sounds: Find F1 onboard videos on YouTube and extract the audio
4. For start signals: Mix a series of beeps with increasing frequency

## Recommended Format

- Format: MP3 (most compatible) or OGG
- Bitrate: 128-192 kbps (good balance of quality and file size)
- Duration: Keep files under 5-10 seconds to reduce load time
- Loopable: Make engine and radio sounds seamlessly loopable

---

If you don't have access to these specific sounds, the loading screen will still function without audio, displaying visual elements only.

## Sound Attribution

Please ensure all sound effects are properly licensed for your project. You can obtain royalty-free F1 sound effects from:

- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/car/)

## Usage

These sound files are loaded and played using the Web Audio API in the application:

```javascript
const audio = new Audio('/sounds/f1-engine.mp3');
audio.play();
```

## Adding Custom Sounds

To add custom sounds:

1. Place your `.mp3` or `.wav` files in this directory
2. Update the references in the components as needed 