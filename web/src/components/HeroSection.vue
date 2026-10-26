<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import heroImages from 'virtual:hero-images'
import { createDeck, createPlacement, loadAspects, uniquePool } from '../lib/heroCollage.js'

const { hero } = defineProps({
  hero: { type: Object, required: true },
})

const collageLayers = ref([])
const heroRef = ref(null)
let collageTimer
let collageRun = 0

onMounted(async () => {
  const run = ++collageRun
  if (!hero.collage.enabled || !heroImages.length) return
  clearInterval(collageTimer)
  collageLayers.value = []

  const pool = uniquePool(heroImages)
  const drawSrc = createDeck(pool)
  const pickPlacement = createPlacement(() => ({
    width: heroRef.value?.clientWidth || 1,
    height: heroRef.value?.clientHeight || 1,
  }))

  await new Promise((resolve) => requestAnimationFrame(resolve))
  if (run !== collageRun) return

  const aspectFor = await loadAspects(pool)
  if (run !== collageRun) return

  const addLayer = (instant = false) => {
    if (run !== collageRun) return
    if (hero.collage.maxImages !== null && collageLayers.value.length >= hero.collage.maxImages) {
      clearInterval(collageTimer)
      return
    }
    const src = drawSrc()
    const { left, top, width, height } = pickPlacement(aspectFor[src] || 1)
    collageLayers.value.push({
      id: collageLayers.value.length,
      src,
      left,
      top,
      width,
      instant,
    })
    if (hero.collage.maxImages !== null && collageLayers.value.length >= hero.collage.maxImages) {
      clearInterval(collageTimer)
    }
  }

  const initialImages = Math.max(
    0,
    Math.min(
      hero.collage.initialImages ?? 1,
      hero.collage.maxImages ?? Number.POSITIVE_INFINITY,
      pool.length,
    ),
  )
  for (let i = 0; i < initialImages; i += 1) addLayer(true)
  if (run !== collageRun) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const intervalMs = hero.collage.intervalMs ?? 4800
  if (
    !reducedMotion &&
    (hero.collage.maxImages === null || collageLayers.value.length < hero.collage.maxImages)
  ) {
    addLayer()
    collageTimer = setInterval(() => addLayer(), intervalMs)
  }
})

onUnmounted(() => {
  collageRun += 1
  clearInterval(collageTimer)
})
</script>

<template>
  <section ref="heroRef" class="hero">
    <div class="collage" aria-hidden="true" :style="{ zIndex: hero.collage.zIndex }">
      <img
        v-for="layer in collageLayers"
        :key="layer.id"
        class="collage-layer"
        :class="{ 'collage-layer--instant': layer.instant }"
        :src="layer.src"
        alt=""
        decoding="async"
        :style="{
          top: `${layer.top}%`,
          left: `${layer.left}%`,
          width: `${layer.width}%`,
        }"
      />
    </div>
    <div class="hero-copy" :style="{ zIndex: hero.logo.zIndex }">
      <img
        class="hero-logo"
        src="/assets/general/the-friendly-meetup-london.png"
        alt="The Friendly Meetup London"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 95vh;
  padding: 2rem 0 1.5rem;
  text-align: center;
}

.collage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.collage-layer {
  position: absolute;
  height: auto;
  border-radius: 12px;
  opacity: 0;
  transform: scale(0.92);
  animation:
    collage-fade 1.2s ease-out forwards,
    collage-zoom 4s ease-out forwards;
}

.collage-layer--instant {
  animation: none;
  opacity: 1;
  transform: scale(1);
}

@keyframes collage-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes collage-zoom {
  from {
    transform: scale(0.92);
  }

  to {
    transform: scale(1);
  }
}

.hero-copy {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
  padding: 1rem 1.5rem;
  background: rgb(255 255 255 / 0.92);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgb(17 17 17 / 0.1);
}

.hero-logo {
  display: block;
  width: auto;
  max-width: 24rem;
  height: auto;
}

@media (prefers-reduced-motion: reduce) {
  .collage-layer {
    animation: none;
    opacity: 1;
    transform: scale(1);
  }
}
</style>
