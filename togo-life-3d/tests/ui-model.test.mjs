import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, Simulation, ECONOMY } from '../src/simulation.js';
import { formatMoney, economyView, actionReason, goalFor, getMilestones } from '../src/ui-model.js';

test('budget projection separates virtual money, merchandise margin and rent obligation', () => {
  const state = { ...createState(), price: 550, money: 15000, debt: 800 };
  assert.equal(formatMoney(state.money), '15 000 F');
  assert.equal(formatMoney(-800), '-800 F');
  assert.equal(formatMoney(NaN), '— F');
  assert.equal(economyView(state).margin, 550 - ECONOMY.wholesale);
  assert.equal(economyView(state).cashBalance, 14200);
  assert.equal(state.money, 15000, 'UI does not pay the rent itself');
  assert.equal(economyView({ ...state, money: 300 }).cashBalance, -500);
});

test('demand and opening hours match every simulation boundary, without promised sales', () => {
  for (const [price, demand, label] of [[350, 1, 'Forte'], [450, 1, 'Forte'], [451, .68, 'Modérée'], [650, .68, 'Modérée'], [651, .3, 'Faible'], [850, .3, 'Faible'], [851, 0, 'Aucune'], [1200, 0, 'Aucune']]) {
    const state = { ...createState(), biz: true, price, stock: 20 };
    const view = economyView(state);
    assert.equal(view.demand, demand);
    assert.equal(view.demandLabel, label);
    assert.equal(view.margin, price - ECONOMY.wholesale);
    const sim = new Simulation(state);
    sim.tick(60);
    assert.equal(sim.state.sales > 0, demand > 0);
  }
  for (const [time, open] of [[6.999, false], [7, true], [20.999, true], [21, true], [21.001, false]]) {
    assert.equal(economyView({ ...createState(), biz: true, time, stock: 0 }).open, open);
  }
  assert.equal(economyView({ ...createState(), biz: false, time: 12 }).open, false);
});

test('action reasons agree with real simulation rejection and acceptance, excluding proximity', () => {
  const cases = [
    [{ carried: 9 }, 'buy', { quantity: 4 }, 'market'],
    [{}, 'buy', { quantity: 0 }, 'market'],
    [{}, 'buy', { quantity: 1.5 }, 'market'],
    [{ money: 1399 }, 'buy', { quantity: 4 }, 'market'],
    [{ money: 1400 }, 'buy', { quantity: 4 }, 'market'],
    [{ money: 8999 }, 'invest', {}, 'kiosk'],
    [{ money: 9000 }, 'invest', {}, 'kiosk'],
    [{ biz: true }, 'invest', {}, 'kiosk'],
    [{ biz: false, carried: 4 }, 'deposit', {}, 'kiosk'],
    [{ biz: true, carried: 0 }, 'deposit', {}, 'kiosk'],
    [{ biz: true, carried: 4 }, 'deposit', {}, 'kiosk'],
    [{ biz: true }, 'price', { price: 350 }, 'kiosk'],
    [{ biz: true }, 'price', { price: 1200 }, 'kiosk'],
    [{ biz: true }, 'price', { price: 1201 }, 'kiosk'],
    [{ biz: true }, 'price', { price: 550.5 }, 'kiosk'],
    [{ lastContractDay: 1 }, 'contract', {}, 'market'],
    [{ contract: { origin: 'market', destination: 'studio', deadline: 2, reward: 1200 } }, 'contract', {}, 'market'],
    [{}, 'contract', {}, 'market'],
    [{}, 'deliver', {}, 'studio'],
    [{ contract: { origin: 'market', destination: 'studio', deadline: 2, reward: 1200 } }, 'deliver', {}, 'studio'],
    [{ food: 91, money: 0 }, 'meal', {}, 'market'],
    [{ food: 90, money: 299 }, 'meal', {}, 'market'],
    [{ food: 90, money: 300 }, 'meal', {}, 'market'],
    [{ debt: 0 }, 'rent', {}, 'home'],
    [{ debt: 800, money: 799 }, 'rent', {}, 'home'],
    [{ debt: 800, money: 800 }, 'rent', {}, 'home'],
    [{ home: true }, 'housing', {}, 'home'],
    [{ money: 3999 }, 'housing', {}, 'home'],
    [{ money: 4000 }, 'housing', {}, 'home'],
    [{ debt: 800 }, 'rest', {}, 'home'],
    [{ debt: 0, energy: 100 }, 'rest', {}, 'home'],
    [{}, 'talk', { npcId: '' }, undefined],
    [{ conversations: ['ama'] }, 'talk', { npcId: 'ama' }, undefined],
    [{}, 'talk', { npcId: 'ama' }, undefined],
  ];
  for (const [override, type, data, location] of cases) {
    const state = { ...createState(), ...override };
    const reason = actionReason(state, type, data);
    const sim = new Simulation(state);
    const result = sim.act({ type, ...data }, { location, npcId: data.npcId });
    assert.equal(reason === '', result.ok, `${type}: availability mismatch`);
    if (!result.ok) assert.equal(reason, result.message, `${type}: reason mismatch`);
  }
});

test('guidance moves to real endpoints and never promises immediate delivery income', () => {
  const sim = new Simulation();
  assert.equal(goalFor(sim.state).targetId, 'market');
  assert.equal(goalFor(sim.state).reward, 1200);
  sim.act('contract', { location: 'market' });
  const inProgress = goalFor(sim.state);
  assert.equal(inProgress.targetId, 'studio');
  assert.equal(inProgress.progress, .5);
  assert.match(inProgress.text, /fin du jour 2/);
  assert.equal(sim.state.money, 15000);
  sim.act('deliver', { location: 'studio' });
  assert.equal(goalFor(sim.state).targetId, 'kiosk');
  assert.equal(goalFor(sim.state).reward, 0);
  sim.act('invest', { location: 'kiosk' });
  assert.equal(goalFor(sim.state).targetId, 'market');
  sim.act({ type: 'buy', quantity: 4 }, { location: 'market' });
  assert.equal(goalFor(sim.state).targetId, 'kiosk');
  sim.act('deposit', { location: 'kiosk' });
  sim.act({ type: 'price', price: 1100 }, { location: 'kiosk' });
  assert.match(goalFor(sim.state).text, /demande est nulle/);
  assert.equal(goalFor(sim.state).targetId, 'kiosk');
});

test('guidance respects unpaid rent, daily quota and closed shops; milestones use real state', () => {
  const state = { ...createState(), completed: 1, biz: true, stock: 5, sales: 4, time: 22 };
  assert.match(goalFor(state).text, /07:00 à 21:00/);
  assert.equal(goalFor(state).progress, .8);
  assert.equal(goalFor({ ...state, debt: 800 }).targetId, 'home');
  const poor = { ...createState(), completed: 1, money: 200, lastContractDay: 1 };
  assert.equal(goalFor(poor).reward, 0);
  assert.match(goalFor(poor).title, /demain/);
  assert.equal(goalFor({ ...poor, lastContractDay: 0 }).targetId, 'market');
  assert.deepEqual(getMilestones(createState()).map(m => m.done), [false, false, false, false]);
  assert.deepEqual(getMilestones(state).map(m => m.done), [true, true, false, false]);
  assert.deepEqual(getMilestones({ ...state, sales: 5, home: true }).map(m => m.done), [true, true, true, true]);
});

test('UI projections do not mutate state or consume resources', () => {
  const state = createState();
  const snapshot = JSON.stringify(state);
  goalFor(state); economyView(state); getMilestones(state);
  for (const type of ['buy', 'invest', 'deposit', 'price', 'contract', 'deliver', 'meal', 'rent', 'housing', 'rest', 'talk']) actionReason(state, type);
  assert.equal(JSON.stringify(state), snapshot);
});
