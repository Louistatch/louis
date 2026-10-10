/** Original map of the authored district, drawn from live gameplay positions. */
const PADDING = 12;
const SYMBOLS = {
  market: { letter: 'M', label: 'Marché', color: '#ad5a3b' },
  kiosk: { letter: 'C', label: 'Comptoir', color: '#2e7268' },
  home: { letter: 'L', label: 'Logement', color: '#405d77' },
  taxi: { letter: 'T', label: 'Taxi', color: '#b79830' },
  studio: { letter: 'A', label: 'Atelier', color: '#705a73' },
};

function geometry(bounds, width, height, padding = PADDING) {
  const values = [bounds?.minX, bounds?.maxX, bounds?.minZ, bounds?.maxZ, width, height, padding];
  if (!values.every(Number.isFinite) || bounds.maxX <= bounds.minX || bounds.maxZ <= bounds.minZ
      || padding < 0 || width <= padding * 2 || height <= padding * 2) {
    throw new RangeError('Map bounds and viewport must have a finite, positive area.');
  }
  const scale = Math.min((width - padding * 2) / (bounds.maxX - bounds.minX),
    (height - padding * 2) / (bounds.maxZ - bounds.minZ));
  const mapWidth = (bounds.maxX - bounds.minX) * scale;
  const mapHeight = (bounds.maxZ - bounds.minZ) * scale;
  return { scale, left: (width - mapWidth) / 2, top: (height - mapHeight) / 2, mapWidth, mapHeight };
}

/** North is negative Z. Preserve distances and aspect ratio; do not stretch the district. */
export function projectPoint(x, z, bounds, width, height, padding = PADDING) {
  if (![x, z].every(Number.isFinite)) throw new RangeError('Map coordinates must be finite.');
  const g = geometry(bounds, width, height, padding);
  return {
    x: g.left + (x - bounds.minX) * g.scale,
    y: g.top + (z - bounds.minZ) * g.scale,
    scale: g.scale,
    inside: x >= bounds.minX && x <= bounds.maxX && z >= bounds.minZ && z <= bounds.maxZ,
  };
}

function viewport(canvas) {
  const rect = canvas.getBoundingClientRect?.();
  return {
    width: rect?.width || canvas.clientWidth || canvas.width,
    height: rect?.height || canvas.clientHeight || canvas.height,
    left: rect?.left ?? 0,
    top: rect?.top ?? 0,
  };
}

/** Select the nearest place within a 44 CSS-pixel target, independent of bitmap DPR. */
export function hitPlace(clientX, clientY, canvas, places, bounds) {
  if (![clientX, clientY].every(Number.isFinite)) return null;
  const view = viewport(canvas);
  const x = clientX - view.left, y = clientY - view.top;
  if (x < 0 || y < 0 || x > view.width || y > view.height) return null;
  let selected = null, distance = 22;
  for (const place of places) {
    if (![place.x, place.z].every(Number.isFinite)) continue;
    const point = projectPoint(place.x, place.z, bounds, view.width, view.height);
    if (!point.inside) continue;
    const d = Math.hypot(point.x - x, point.y - y);
    if (d <= distance && (selected === null || d < distance)) {
      selected = place;
      distance = d;
    }
  }
  return selected;
}

function positionOf(entity) {
  const group = entity?.character?.group ?? entity?.group ?? entity;
  const position = group?.position ?? group;
  if (!position || ![position.x, position.z].every(Number.isFinite)) return null;
  return { x: position.x, z: position.z, heading: entity?.heading ?? group.rotation?.y ?? 0 };
}

function colliderBounds(collider) {
  const minX = collider.minX ?? collider.x - collider.w / 2;
  const maxX = collider.maxX ?? collider.x + collider.w / 2;
  const minZ = collider.minZ ?? collider.z - collider.d / 2;
  const maxZ = collider.maxZ ?? collider.z + collider.d / 2;
  return [minX, maxX, minZ, maxZ].every(Number.isFinite) && maxX > minX && maxZ > minZ
    ? { minX, maxX, minZ, maxZ } : null;
}

/** Canvas owns no input handlers. The caller chooses targets and manages bitmap DPR. */
export function drawNeighborhoodMap(canvas, {
  bounds, colliders = [], places = [], player, targetId, people = [], compact = false,
}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const { width, height } = viewport(canvas);
  const g = geometry(bounds, width, height);
  const point = (x, z) => ({ x: g.left + (x - bounds.minX) * g.scale,
    y: g.top + (z - bounds.minZ) * g.scale });
  const rect = (minX, minZ, maxX, maxZ, fill, stroke) => {
    const a = point(minX, minZ), b = point(maxX, maxZ);
    ctx.fillStyle = fill;
    ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.strokeRect(a.x + .5, a.y + .5, b.x - a.x - 1, b.y - a.y - 1);
    }
  };
  const circle = (x, y, radius, fill, stroke, lineWidth = 1) => {
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  };
  ctx.save();
  ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#d4c4a4'; ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.beginPath(); ctx.rect(g.left, g.top, g.mapWidth, g.mapHeight); ctx.clip();
  rect(bounds.minX, bounds.minZ, bounds.maxX, bounds.maxZ, '#e2d3b5');
  // Match the playable world's ten-unit street and two six-unit cross streets.
  rect(-8.4, bounds.minZ, 8.4, bounds.maxZ, '#bbc0ac');
  rect(-5, bounds.minZ, 5, bounds.maxZ, '#75817b');
  for (const z of [-24, 29]) rect(bounds.minX, z - 3, bounds.maxX, z + 3, '#75817b');
  ctx.strokeStyle = '#e4d8b7'; ctx.lineWidth = compact ? .7 : 1;
  ctx.setLineDash([Math.max(2, g.scale * 2.6), Math.max(2, g.scale * 3.4)]);
  const north = point(0, bounds.minZ), south = point(0, bounds.maxZ);
  ctx.beginPath(); ctx.moveTo(north.x, north.y); ctx.lineTo(south.x, south.y); ctx.stroke();
  ctx.setLineDash([]);

  for (const collider of colliders) {
    const b = colliderBounds(collider);
    if (!b) continue;
    const w = b.maxX - b.minX, d = b.maxZ - b.minZ;
    // Large solid footprints and thin courtyard walls stay distinct from street objects.
    if (w >= 5 && d >= 5) {
      rect(b.minX, b.minZ, b.maxX, b.maxZ, '#a58c70', '#857259');
      if (!compact && w > 8 && d > 7) rect(b.minX + .7, b.minZ + .7, b.maxX - .7, b.maxZ - .7, '#b79c7a');
    } else if (w >= 4 || d >= 5) {
      rect(b.minX, b.minZ, b.maxX, b.maxZ, '#927d65');
    } else if (w < 1 && d < 1) {
      const p = point((b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2);
      circle(p.x, p.y, compact ? 1.4 : 2.6, '#65856a');
    } else {
      const car = collider.height < 1.7 && w > 1.5 && d > 3;
      rect(b.minX, b.minZ, b.maxX, b.maxZ, car ? '#baa047' : '#b5a087');
    }
  }
  for (const person of people) {
    const pos = positionOf(person);
    if (!pos) continue;
    const p = point(pos.x, pos.z);
    circle(p.x, p.y, compact ? 1.3 : 2.2, '#396b65', '#f4e7ca', .6);
  }
  const markers = [];
  const radius = compact ? 6 : Math.min(10, Math.max(7, g.scale * 2.1));
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const place of places) {
    if (![place.x, place.z].every(Number.isFinite)) continue;
    const p = point(place.x, place.z);
    const inside = place.x >= bounds.minX && place.x <= bounds.maxX
      && place.z >= bounds.minZ && place.z <= bounds.maxZ;
    if (!inside) continue;
    const symbol = SYMBOLS[place.id] ?? { letter: '?', label: place.name ?? '', color: '#60746f' };
    if (place.id === targetId) circle(p.x, p.y, radius + 4, null, '#f4c35a', compact ? 2 : 3);
    circle(p.x, p.y, radius, symbol.color, '#f9efd5', 1.1);
    ctx.fillStyle = '#fff9e8'; ctx.font = `700 ${compact ? 9 : 11}px Arial, sans-serif`;
    ctx.fillText(symbol.letter, p.x, p.y + .5);
    if (!compact) {
      const right = place.x >= 0;
      ctx.textAlign = right ? 'left' : 'right';
      ctx.font = '600 12px Arial, sans-serif';
      ctx.lineWidth = 3; ctx.strokeStyle = '#e2d3b5';
      const labelX = p.x + (right ? radius + 7 : -radius - 7);
      ctx.strokeText(symbol.label, labelX, p.y);
      ctx.fillStyle = '#314b46'; ctx.fillText(symbol.label, labelX, p.y);
      ctx.textAlign = 'center';
    }
    markers.push({ id: place.id, x: p.x, y: p.y, radius });
  }
  const pos = positionOf(player);
  if (pos) {
    const x = Math.min(bounds.maxX, Math.max(bounds.minX, pos.x));
    const z = Math.min(bounds.maxZ, Math.max(bounds.minZ, pos.z));
    const p = point(x, z);
    circle(p.x, p.y, compact ? 5 : 7, '#183e42', '#f9efd5', 1.2);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI - (Number.isFinite(pos.heading) ? pos.heading : 0));
    ctx.beginPath(); ctx.moveTo(0, compact ? -7 : -11); ctx.lineTo(compact ? 3.2 : 4.5, compact ? 3 : 4);
    ctx.lineTo(0, compact ? 1 : 1.5); ctx.lineTo(compact ? -3.2 : -4.5, compact ? 3 : 4);
    ctx.closePath(); ctx.fillStyle = '#fff9e8'; ctx.fill(); ctx.restore();
  }
  ctx.restore();
  // Compact compass stays in the letterbox corner, away from the central street.
  const compassX = width - 10;
  ctx.fillStyle = '#294740'; ctx.font = '700 9px Arial, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('N', compassX, 9);
  ctx.beginPath(); ctx.moveTo(compassX, 17); ctx.lineTo(compassX - 3, 23); ctx.lineTo(compassX + 3, 23);
  ctx.closePath(); ctx.fill();
  ctx.restore();
  return { width, height, scale: g.scale, markers };
}
