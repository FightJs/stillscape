# Living-canvas rendering contract

`import { createWallpaperEngine } from './engine.js'`

```js
const engine = await createWallpaperEngine(canvas, scene, {
  onFrame: frame => soundscape.update(frame),
  onError: error => showMessage(error.message),
  maxDpr: 1.75,
  maxResolution: 3840,
  quality: 'auto', // or fixed
  interactionTarget: canvas.parentElement,
});
```

Scene fields:

```js
{
  id: 'tuscany',
  image: '/wallpapers/tuscany.png',
  style: 'oil',
  effects: ['clouds', 'water', 'reeds', 'dust'],
  fit: 'contain', // default, keeps all artwork on portrait screens; cover optional
  focus: [0.5, 0.5],
  palette: ['#f5daa0', '#5a6043'],
  lightColor: '#f5daa0',
  sky: { bottom: 0.30, advect: true },
  water: {
    polygon: [[0.18,0.64],[0.52,0.64],[0.44,0.78],[0.23,0.8]],
    // optional polygons: [...] for several separated regions
    strength: 1,
  },
  foreground: [{
    image: '/wallpapers/tuscany-tree.png', // transparent cutout, backed by a clean plate
    anchor: [0.06, 1], // root/pivot location, in original-image coordinates
    width: 0.20,
    height: 0.75, // original-image fraction; derived from sprite if omitted
    pivot: [0.5, 1], // sprite pivot, bottom middle by default
    sway: 0.008, // radians; angle remains gentle at maximum wind
    phase: 0,
  }],
}
```

Effects: `clouds`, `mist`, `stars`, `aurora`, `snow`, `rain`, `caustics`, `paper`, `neon`, `heat`, `dust`, `fireflies`, `petals`, `embers`, `bubbles`, `reeds`. Explicit styles choose distinct effects. No type automatically adds dust. `water` needs an explicit safe polygon; without it, no source pixel is refracted. Source trees and clouds are never warped. For genuine tree motion, provide a transparent foreground tree against a clean background. Optional procedural edge reeds have independent root-anchored geometry; they are not a substitute for moving the painting's trees.

Methods:

- `await setScene(scene)` — async decode all assets, atomically swaps textures, latest call wins.
- `setSettings({wind, water, cloud, light, volume, motion})` — strengths 0..1.8, volume 0..1, motion boolean. Cloud time integrates speed, avoiding a jump when speed changes.
- `setPlaying(bool)` — pause freezes the engine's shared time; one final render informs audio, then no animation frames continue.
- `await snapshot({width:3840,height:2160,type:'image/png',quality:.95})` — full current composed frame at requested dimensions, including overlay and foreground. Does not imply native 4K source. Omit dimensions for current render size.
- `getMetrics()` — source/render dimensions, sourceIsNative4K, renderedFrames, fps, cpuFrameMs, qualityScale, activeRaf, reducedMotion and backend. FPS is observed presentation callback throughput, not a GPU benchmark.
- `destroy()` — remove events, overlay, WebGL resources and pending animation frame.

`onFrame` receives `{time,delta,wind,water,cloud,gust,playing,sceneId}`. Time is seconds, strengths 0..1.8, gust theoretical 0.10..1.0 (normally around .7). The same gust drives foreground rotation/reeds and is supplied to sound. Background tabs pause and emit `playing:false`. Reduced-motion stops continuous frames and time advancement. Window resizing and settings still cause one necessary repaint.

## Technical design boundaries

- Water refraction is less than a few source pixels and fades to zero before the eroded shoreline mask.
- Independent cloud wisps are composited over bright sky with no source UV warp, guarding against tree/sky cross-sampling and edge smears. They do not falsely animate static painted clouds.
- Transparent sprites rotate around root anchors with aspect-correct transformations; opaque original artwork geometry remains intact.
- Contain mode keeps full scene visible on portrait screens, adding dark color-derived margins. A purpose-designed portrait asset remains preferable for an edge-to-edge mobile wallpaper.
- Default max render resolution 3840, DPR cap 1.75; auto quality drops in steps if measured callback throughput is low. Source dimensions are reported honestly.
- Paused, reduced-motion and hidden states have no continuous render loop. The engine does not implement its own audio context or autoplay audio.
- WebGL context restoration recreates resources without reloading the page. If WebGL is unavailable from startup, a static Canvas2D artwork fallback is returned.

## Verification status

2026-10-28: `node --check engine.js` succeeds. Browser shader compilation, image composition and long-run performance must be tested after integration. No claim of native 4K quality, 60fps, or completed commercial acceptance is made from source validation alone.

## Browser smoke test, 2026-10-28

A separate test page (`review-evidence/engine-test.html`) used the original 1672×941 oil painting, explicit lake polygon, clouds and reeds. IAB rendered WebGL successfully at 2240×1134. Two-second callback windows reported about 60 fps, CPU frame time approximately 0.17 ms; this is one machine/browser sample, not a broad performance guarantee. Console warnings/errors were empty. Clicking Pause produced `playing:false`, `activeRaf:false`; two later observations both showed exactly 1788 rendered frames, verifying the paused renderer stops scheduling rather than merely freezing shader time. Full shader artwork exhibited no prior tree tearing because source-tree UVs remain fixed. New independent tree sprite still awaits asset integration.

Optional `sky.advect:true` is reserved for a verified clean sky with no foreground silhouettes in `sky.bottom` region. It shifts the sky texture horizontally by a smooth long-period drift, fading to zero before the horizon and at image edges. This is appropriate for the regenerated Tuscan clean plate with `bottom:.30`; its cypress is a separate foreground sprite and its sun is outside the advection region. It must remain false for sky regions containing roofs, trees or mountain silhouettes.

### Integration smoke test with regenerated artwork

- Regenerated Tuscan clean plate plus `public/layers/tuscany-cypress.png` tested at default and 1.8 wind in multiple screenshots. The independent tree silhouette remains intact; no prior fork/strip artifacts or opaque rectangular matte appeared. The result is an affine root-pivot sway, not a simulated branching skeleton. Recommended sprite: anchor `[.075,1.03]`, width `.33`, height `.88`, sway `.007`; a single tree avoids duplicate silhouettes. Saved evidence: `review-evidence/engine-max-wind.png`.
- The 04 pixel-rain scene uses quantized 420×236 rain positions and 9Hz discrete rain time; visual inspection showed short pixel-aligned rain, with the source architecture stable.
- The 10 deep-space scene was visually checked after reducing added star brightness and primarily modulating existing high-luminance points. No moving foreground dust is inserted.
- The 07 minimal scene uses `glow`, a small broad luminance change, with no particle or paper-layer shadow overlay.
- Snapshot requested at 3840×2160 produced a roughly 16.7 MB PNG Blob and successful download UI action. Native source remains 1672×941; export is a high-resolution composite/upscale.
- Shared-session load samples ranged from approximately 36.9 to 60 fps. Do not publish a blanket 60 fps guarantee from these samples. No browser console warnings/errors were observed during the first smoke test.

## Second refinement, 2026-10-28

The independent foreground sprite now has a height-weighted elastic bend, with different continuous phases at different crown heights. The root weight is exactly zero. The default `elasticity:.005` is capped to ±.006 sprite UV; for the 1024 px cutout this is at most about 6 source pixels, and only a few screen pixels at the tested displayed size. The original root rotation is reduced to 45% so it does not double the apparent wind amplitude. `baseFade` fades the bottom alpha smoothly; default `.10`, configurable per sprite. No background pixels are sampled through this bending process.

A 42-second traveling wind front moves from outside the left edge to outside the right edge. Its broad local envelope gently increases water-wave strength as it passes, influences the clean-sky drift and foreground crown response, and contributes to the shared sound `gust`. `onFrame` now additionally reports `windFront` (normalized x, roughly -.5..1.5). This is a subtle spatial connection between existing effects, not a new visible particle effect.

All optional GLSL effect groups are now gated by their uniform enable flags. Cloud textures, mist noise, star twinkle, three-layer aurora loop, snow/rain loops, caustics, paper/glow/neon lighting and heat-noise calculations run only for enabled scene effects. Water masks are fetched only when a scene defines water; inactive/expired click ripples skip trigonometric work. Performance change is a source-level optimization; no blanket cross-device speedup is claimed.

Chrome independent smoke test: shader compiled without console warnings/errors; 00 clean plate with sprite at wind 1.8 was observed at multiple time points. The crown retained its full silhouette without prior line tearing or background distortion, and the lower trunk now transitions into the foreground. Screenshot: `review-evidence/engine-elastic-max-wind.png`. At 2504×989 rendering, successive callback samples reported 60 fps and about .14 ms CPU frame time. These are local callback/CPU observations, not GPU benchmarks. Runtime screenshot sampling cannot certify every intervening frame. Test tab was paused and closed after verification to avoid contention with independent review.

## Third refinement: scene-specific focal movement

Only explicitly configured scenes use these additions; other scene outputs retain the prior paths.

- `foreground[].rotationSpeed` is radians/second. Its angle integrates frame delta and the current wind/gust envelope, avoiding time-multiplication jumps when a control changes. Use `pivot:[.5,.5], sway:0, bend:0, baseFade:0` for rigid rotors. The 05 windmill clean plate/rotor were visually checked at two different angles; the hub remains aligned and no rectangular matte was visible. Suggested rotor anchor `[.675,.239]`, width `.10`, height `.1778`, speed `.14`. Evidence: `review-evidence/engine-rotor-third-round.png`.
- `sandColumn:{top:[x,y],bottom:[x,y],width:n}` enables a tapered, feathered granular-flow mask. Fine noise travels down the column; source UV displacement is at most .0006 vertically and .000175 horizontally, with both ends fading to zero. The 08 floating stone and ground remain geometrically unchanged; runtime composition was inspected, while subtle grain continuity requires review over time.
- `flowColumn` accepts the same geometry plus `kind:'waterfall'`. This switches to neutral-water light and restricts movement to bright original waterfall pixels, protecting adjacent dark rock. Intended 02 coordinates: top `[.228,.455]`, bottom `[.250,.684]`, width `.016`.
- `sky.vortex:{center:[x,y],radius:n,strength:n}` adds a slow, aspect-correct oil-cloud rotational field. A .06-radius moon core, horizon and canvas edges are fixed. Strength is capped at .01 radians; intended 01 strength `.005`, center `[.24,.22]`, radius `.65`. It moves only the verified clear sky region and preserves brushstroke scale.
- `style:'ukiyoe'` selects slow broad water swells rather than the normal high-frequency reflection pattern. The existing shoreline mask remains in force and high-frequency sparkle is disabled for this branch.

`node --check engine.js` passed. The combined shader compiled in Chrome; the independent 05 rotor and 08 flow scene were observed. Browser automation then encountered CDP timeout contention while switching to 01/02/03; those three branches remain for the independent review's focused visual sampling. No claim is made here that those three artistic effects have passed visual acceptance. Test tab is closed after checks.

04 pixel-rain follow-up: source puddle UV displacement and continuous high-frequency sparkle are disabled for pixel style. When both pixel style and rain are active and the explicit water mask is nonzero, sparse cells emit three discrete short-highlight frames on a quantized 420×236 grid. Other scenes do not execute this branch. This adds ground response without continuous circular water ripples; the replacement clean plate and final visible density require review in the integrated scene.

## 07 ceramic illumination refinement

Only `effects:['glow']` changes. A broad elliptical light travels around the ceramic object over 32 seconds; its source warm-color mask excludes the cool lavender background. Peak diffuse lift is 12% before an ivory highlight shoulder caps bright pixels without flattening their texture. An approximately 1% complementary ambient change and up to 3.5% contact-shadow luminance change gently respond to the same phase; neither geometry nor shadow position moves. The effect honors the light control and shared paused time. `node --check` and production build verified source integration; no browser session was opened during the reviewer’s active sampling. Final visible acceptance remains the reviewer’s responsibility.

## 09 coastal refinement

Only `style:'film'` or explicit `effects:['coastal']` selects this path. Ordinary fine water waves and sparkle are replaced by two oblique, low-frequency swells; near-field source texture moves approximately 3–6 source pixels at supported strengths, and original bright foam gently brightens on arrival then fades. No new artificial foam stripe is painted.

`water.protectWarm:true` applies a cool-water/brightness guard at both the original pixel and displaced sample, suppressing warm shore and dark rock movement. This color safeguard is not a segmentation guarantee for cool wet rock. `water.excludePolygons:[polygon,...]` therefore provides explicit static inner islands/rock platforms within a broad water mask; each inner region is expanded slightly and feathered before use. Existing shoreline erosion remains active. Source inspection confirmed the 09 near platform must be protected by such an inner exclusion rather than relying only on its brown color.

Node syntax and production build passed. No browser was opened during independent review. Final 09 geometry parameters and visual acceptance must be sampled by the main/review agents; no claim is made here that the widened mask has already passed visual review.

## 11 underwater light refinement

Only the active `caustics` branch changes. The source opening at `[.54,.05]` defines a soft angular fan. Low-frequency angular modulation changes the original clear-water lighting by up to 9%, with an ivory/bright shoulder to avoid clipping. Source cool-color and luminance masks suppress dark rock and seagrass; there is no new geometry/UV displacement. The sea-bed's original bright caustic tracery responds to the same `lightTime`, accompanied by a faint irregular traveling filament restricted to lit seabed pixels. No evenly spaced columns, full-image cyan fog or fake fish motion are introduced. The light slider and shared pause clock govern the branch. Node syntax and production build passed; no browser session was opened while the independent reviewer was sampling. Final perceived strength and naturalness remain for that visual review.

## 13 ridge-bound sand refinement

Only `style:'desert'` changes. Generic full-image dust points are suppressed. Deterministically seeded fine gold-grey streaks now originate on explicit dune-crest polylines, move a small distance to the right lee side, and fade in/out with age and shared gust. Travel is capped at `.04` artwork width; vertical loft remains a few source pixels. A few very thin low-alpha veils connect the crest emission. No sand geometry or source UV is changed, and no emission is placed throughout the sky. Wind zero removes the effect; pause freezes its time.

`scene.sandRidges` accepts arrays of normalized `[x,y]` points (or `{points:[...]}` objects). If omitted for the current desert image, three surveyed crest paths are used: the foreground curved ridge from `[.70,.285]` through `[.55,.44]` to `[.83,1]`, the distant ridge around `[.43,.31]–[.36,.39]`, and the left ridge `[.205,.38]–[.15,.44]`. These defaults are artwork-specific; future desert artwork must provide its own paths.

Node syntax and production build passed. No browser session was opened, so final visible density and photographic integration remain for independent review.

## 02 ink atmosphere and 03 woodcut cloud refinement

For ink style with an existing waterfall `flowColumn`, a local pale mist gathers at the column bottom plus `[0,.016]`. Its soft ellipse has radii `[.048,.025]`, noise-shaped opacity up to `.065`, and a subdued paper-grey tint. A very small, low-frequency lake response is restricted by the existing water mask. Mountain geometry and the surrounding paper remain fixed.

Optional `scene.boat:{center:[.69,.825],radii:[.05,.05]}` adds an elliptical, broadly feathered shared displacement for the hull, figure and reflection: maximum vertical amplitude `.0011` and horizontal amplitude `.00030`, scaled by the water control. A weak neighboring ring response is restricted to the water mask. Coordinates must be checked against the actual scene artwork.

`scene.sky.advectionRect:[.42,.345,1,.455]` enables horizontal cloud texture drift within a feathered rectangle. Its alias is `advectRegion`. `sky.protectCircle:[.78,.22,.15]` protects the red moon; all four rectangle boundaries also fade to zero. This does not require `sky.advect:true`, which should remain off for 03 to avoid shifting the complete sky. The horizontal displacement is capped at `.0045` image UV and uses a slow phase. Foreground pine motion still requires the parent-provided clean plate and independent sprite.

Node syntax and production build passed after these changes. No browser was operated during the independent review window; visible ink mist, boat-mask alignment and woodcut-cloud acceptance remain for the independent reviewer after scene configuration and assets are integrated. Other scenes retain disabled zero-valued configuration for these new branches.

## Visible-motion revision (supersedes prior low-amplitude tuning)

The user's subsequent feedback rejects the former restrained motion as insufficient. The current engine therefore uses the revised per-scene values in `motion-profiles.js`; earlier amplitude limits and slow periods documented above describe historical versions. See `motion-mapping.md` for the complete sixteen-scene mapping, four independent integral clocks, 0–3 intensity ranges, 0.25–3 global speed, and explicit reduced-motion override protocol. Existing visual review scores must not be treated as acceptance of this materially changed version.

Current validation: JavaScript syntax and production build pass; all four shader sources compile in a macOS offline OpenGL context after the minimal ES-to-desktop version/precision header adaptation. No browser actions were performed. This does not establish WebGL driver compatibility or visual/artistic acceptance; the parent and independent reviewer own those checks.
