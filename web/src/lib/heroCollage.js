export const uniquePool = (urls) => [...new Set(urls)]

const shuffle = (items) => {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export const createDeck = (pool) => {
  let deck = shuffle(pool)
  return () => {
    if (!deck.length) deck = shuffle(pool)
    return deck.pop()
  }
}

export const loadAspects = async (urls) => {
  const aspectFor = (src) =>
    new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img.naturalWidth / img.naturalHeight)
      img.onerror = () => resolve(1)
      img.src = src
    })
  return Object.fromEntries(await Promise.all(urls.map(async (src) => [src, await aspectFor(src)])))
}

export const createPlacement = (getBounds) => {
  const gridCols = 10
  const gridRows = 6
  const density = Array(gridCols * gridRows).fill(0)
  const recentRects = []

  const cellsForRect = (left, top, right, bottom) => {
    const col0 = Math.max(0, Math.floor((left / 100) * gridCols))
    const col1 = Math.min(gridCols - 1, Math.floor((right / 100) * gridCols))
    const row0 = Math.max(0, Math.floor((top / 100) * gridRows))
    const row1 = Math.min(gridRows - 1, Math.floor((bottom / 100) * gridRows))
    const cells = []
    for (let row = row0; row <= row1; row += 1) {
      for (let col = col0; col <= col1; col += 1) {
        cells.push(row * gridCols + col)
      }
    }
    return cells
  }

  const targetSize = (aspect) => {
    const { width: heroW, height: heroH } = getBounds()
    const width = Math.sqrt(0.15 * aspect * (heroH / heroW)) * 100
    const height = (((width / 100) * heroW) / aspect / heroH) * 100
    return { width, height }
  }

  const scorePlacement = (left, top, width, height) => {
    let score = 0
    for (const cell of cellsForRect(left, top, left + width, top + height)) {
      score += density[cell]
    }
    const rect = { left, top, width, height }
    for (const other of recentRects) {
      const overlapW = Math.max(
        0,
        Math.min(rect.left + rect.width, other.left + other.width) - Math.max(rect.left, other.left),
      )
      const overlapH = Math.max(
        0,
        Math.min(rect.top + rect.height, other.top + other.height) - Math.max(rect.top, other.top),
      )
      score += overlapW * overlapH * 8
      const dx = rect.left + rect.width / 2 - (other.left + other.width / 2)
      const dy = rect.top + rect.height / 2 - (other.top + other.height / 2)
      const spread = Math.hypot(rect.width, rect.height) * 0.45
      const gap = spread - Math.hypot(dx, dy)
      if (gap > 0) score += gap * 5
    }
    return score
  }

  const markPlacement = (left, top, width, height) => {
    for (const cell of cellsForRect(left, top, left + width, top + height)) {
      density[cell] += 1
    }
    recentRects.push({ left, top, width, height })
    if (recentRects.length > 10) recentRects.shift()
  }

  return (aspect) => {
    const { width, height } = targetSize(aspect)
    let best = { left: 0, top: 0, width, height }
    let bestScore = Infinity
    for (let i = 0; i < 36; i += 1) {
      const left = Math.random() * Math.max(0, 100 - width)
      const top = Math.random() * Math.max(0, 100 - height)
      const score = scorePlacement(left, top, width, height)
      if (score < bestScore) {
        best = { left, top, width, height }
        bestScore = score
      }
    }
    markPlacement(best.left, best.top, best.width, best.height)
    return best
  }
}
