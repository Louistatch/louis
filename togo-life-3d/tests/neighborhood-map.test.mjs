import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectPoint, hitPlace } from '../src/neighborhood-map.js';

const bounds = { minX: -45, maxX: 45, minZ: -42, maxZ: 42 };
const places = [
  { id: 'market', x: -15, z: 0 },
  { id: 'studio', x: -17, z: -7 },
  { id: 'home', x: 16, z: 23 },
];

test('map keeps north up, centers the district and preserves distance on unequal viewports', () => {
  for (const [width, height] of [[160, 140], [620, 420], [420, 620]]) {
    const center = projectPoint(0, 0, bounds, width, height);
    const east = projectPoint(10, 0, bounds, width, height);
    const north = projectPoint(0, -10, bounds, width, height);
    assert.equal(center.x, width / 2);
    assert.equal(center.y, height / 2);
    assert.ok(north.y < center.y);
    assert.ok(east.x > center.x);
    assert.ok(Math.abs((east.x - center.x) - (center.y - north.y)) < 1e-10);
    for (const [x, z] of [[-45, -42], [45, 42]]) {
      const edge = projectPoint(x, z, bounds, width, height);
      assert.ok(edge.x >= 12 - 1e-10 && edge.x <= width - 12 + 1e-10);
      assert.ok(edge.y >= 12 - 1e-10 && edge.y <= height - 12 + 1e-10);
      assert.equal(edge.inside, true);
    }
    assert.equal(projectPoint(46, 0, bounds, width, height).inside, false);
  }
});

test('map hit selection uses CSS coordinates and the closest real place across DPR values', () => {
  for (const dpr of [1, 1.5, 2]) {
    const canvas = { width: 620 * dpr, height: 420 * dpr,
      getBoundingClientRect: () => ({ left: 71, top: 93, width: 620, height: 420 }) };
    for (const place of places) {
      const p = projectPoint(place.x, place.z, bounds, 620, 420);
      assert.equal(hitPlace(p.x + 71, p.y + 93, canvas, places, bounds), place);
    }
    const market = projectPoint(-15, 0, bounds, 620, 420);
    assert.equal(hitPlace(market.x + 71 + 21, market.y + 93, canvas, places, bounds)?.id, 'market');
    assert.equal(hitPlace(market.x + 71 + 23, market.y + 93, canvas, places, bounds), null);
    assert.equal(hitPlace(70, 200, canvas, places, bounds), null);
    assert.equal(hitPlace(692, 200, canvas, places, bounds), null);
  }
});

test('compact map selects each close destination by nearest center and excludes outside destinations', () => {
  const canvas = { width: 320, height: 280,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 160, height: 140 }) };
  for (const place of places) {
    const p = projectPoint(place.x, place.z, bounds, 160, 140);
    assert.equal(hitPlace(p.x, p.y, canvas, places, bounds), place);
  }
  const edge = { id: 'edge', x: -45, z: -42 };
  const p = projectPoint(edge.x, edge.z, bounds, 160, 140);
  assert.equal(hitPlace(p.x, p.y, canvas, [edge, { id: 'outside', x: -46, z: -42 }], bounds), edge);
  assert.equal(hitPlace(0, 140, canvas, places, bounds), null);
  assert.equal(hitPlace(Number.NaN, 0, canvas, places, bounds), null);
});

test('invalid map geometry fails clearly rather than emitting unusable coordinates', () => {
  assert.throws(() => projectPoint(0, 0, { ...bounds, maxX: bounds.minX }, 160, 140), RangeError);
  assert.throws(() => projectPoint(0, 0, bounds, 24, 140), RangeError);
  assert.throws(() => projectPoint(Number.NaN, 0, bounds, 160, 140), RangeError);
});
