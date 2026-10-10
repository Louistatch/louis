import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation } from '../src/simulation.js';

test('journal survives a real delivery save and reload in order', () => {
  const original = new Simulation();
  original.act('contract', { location: 'market' });
  original.act('deliver', { location: 'studio' });
  original.act({ type: 'buy', quantity: 4 }, { location: 'market' });
  const saved = original.snapshot();
  const restored = new Simulation();
  assert.equal(restored.load(JSON.stringify(saved)), true);
  assert.deepEqual(restored.state.events, original.state.events);
  assert.equal(restored.state.events.length, 3);
  assert.match(restored.state.events[1], /Livraison terminée/);
  assert.equal(restored.state.money, original.state.money);
  assert.equal(restored.state.completed, 1);
});

test('journal bounds accept exactly eight entries and 240 characters without input aliasing', () => {
  const original = new Simulation();
  const saved = original.snapshot();
  saved.events = Array.from({ length: 8 }, (_, i) => i === 0 ? 'a'.repeat(240) : `Événement ${i}`);
  Object.freeze(saved.events);
  Object.freeze(saved);
  const restored = new Simulation();
  assert.equal(restored.load(saved), true);
  assert.deepEqual(restored.state.events, saved.events);
  assert.notEqual(restored.state.events, saved.events);
  restored.event('Nouvelle journée');
  assert.equal(restored.state.events.length, 8);
  assert.equal(restored.state.events[0], 'Événement 1');
  assert.equal(restored.state.events.at(-1), 'Nouvelle journée');
  assert.equal(saved.events[0].length, 240, 'save input remains intact');
});

test('invalid journals reject the entire load atomically', () => {
  const original = new Simulation();
  original.act('contract', { location: 'market' });
  const before = original.snapshot();
  for (const events of [null, 'text', {}, ['x'.repeat(241)], [42], [null], [undefined], Array(1), Array.from({ length: 9 }, () => 'ok')]) {
    assert.equal(original.load({ ...before, money: 999, events }), false);
    assert.deepEqual(original.snapshot(), before);
  }
});

test('older version two saves without a journal still load with an empty history', () => {
  const original = new Simulation();
  original.act('contract', { location: 'market' });
  const oldSave = original.snapshot();
  delete oldSave.events;
  const restored = new Simulation();
  restored.event('A previous session');
  assert.equal(restored.load(oldSave), true);
  assert.deepEqual(restored.state.events, []);
  assert.equal(restored.state.contract.reward, 1200);
});
