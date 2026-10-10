import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, Simulation, ECONOMY } from '../src/simulation.js';
import { formatMoney, economyView, actionReason, goalFor, getMilestones } from '../src/ui-model.js';

function freezeTree(object) {
  if (object && typeof object === 'object') {
    Object.freeze(object);
    for (const value of Object.values(object)) freezeTree(value);
  }
  return object;
}

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

test('projected margin follows the actual weighted cost of negotiated and standard lots', () => {
  const sim = new Simulation();
  assert.equal(sim.act({ type: 'negotiate', price: 300, quantity: 4 }, { location: 'market' }).ok, true);
  assert.equal(sim.act({ type: 'buy', quantity: 4 }, { location: 'market' }).ok, true);
  assert.equal(sim.act({ type: 'buy', quantity: 4 }, { location: 'market' }).ok, true);
  assert.equal(sim.state.carriedCost, 315 * 4 + 350 * 4);
  assert.equal(economyView(sim.state).unitCost, 332.5);
  assert.equal(economyView(sim.state).margin, 217.5);
  sim.act('invest', { location: 'kiosk' });
  sim.act('deposit', { location: 'kiosk' });
  assert.equal(sim.state.stockCost, 2660);
  assert.equal(economyView(sim.state).unitCost, 332.5);
  assert.equal(economyView(sim.state).margin, 217.5);
  const legacy = { ...createState(), stock: 4, price: 550 };
  delete legacy.stockCost;
  assert.equal(economyView(legacy).unitCost, 350);
});

test('eligible budgets use the seven actual residents and change with their remaining money', () => {
  const state = { ...createState(), biz: true, stock: 20, stockCost: 7000 };
  for (const [price, count] of [[350, 7], [450, 7], [451, 5], [550, 5], [551, 4], [600, 4], [601, 3], [700, 3], [701, 2], [800, 2], [801, 1], [1000, 1], [1001, 0]]) {
    const view = economyView({ ...state, price });
    assert.equal(view.eligibleCustomers, count, 'wrong budgets for price ' + price);
    assert.equal(view.customerCount, 7);
    assert.equal(view.demandLabel, count + ' / 7 budgets');
    assert.equal(view.demand, count / 7);
  }
  state.price = 450;
  state.society.agents[1].wallet = 449;
  assert.equal(economyView(state).eligibleCustomers, 6);
  state.society.agents[5].wallet = 349;
  assert.equal(economyView(state).eligibleCustomers, 5);
  state.society.agents[0].wallet = 100000;
  assert.equal(economyView(state).customerCount, 7, 'the supplier is not a retail customer');
  assert.equal(economyView({ ...state, society: undefined }).demandLabel, 'Budgets indisponibles');
});

test('opening hours and budget availability do not promise a sale or grant money', () => {
  for (const [time, open] of [[6.999, false], [7, true], [20.999, true], [21, false], [21.001, false]]) {
    assert.equal(economyView({ ...createState(), biz: true, time, stock: 0 }).open, open);
  }
  assert.equal(economyView({ ...createState(), biz: false, time: 12 }).open, false);
  const sim = new Simulation();
  sim.act('invest', { location: 'kiosk' });
  const before = sim.snapshot(), view = economyView(sim.state);
  assert.equal(view.eligibleCustomers, 5);
  assert.equal(sim.state.stock, 0);
  assert.deepEqual(sim.snapshot(), before);
  sim.tick(20);
  assert.equal(sim.state.sales, 0, 'compatible budgets without stock cannot manufacture a sale');
});

test('action reasons agree with the real simulation for purchases, needs, obligations and existing actions', () => {
  const cases = [
    [{ carried: 9, carriedCost: 3150 }, 'buy', { quantity: 4 }, 'market'],
    [{}, 'buy', { quantity: 0 }, 'market'],
    [{}, 'buy', { quantity: 1.5 }, 'market'],
    [{ money: 1399 }, 'buy', { quantity: 4 }, 'market'],
    [{ money: 1400 }, 'buy', { quantity: 4 }, 'market'],
    [{ money: 8999 }, 'invest', {}, 'kiosk'],
    [{ money: 9000 }, 'invest', {}, 'kiosk'],
    [{ biz: true }, 'invest', {}, 'kiosk'],
    [{ biz: false, carried: 4, carriedCost: 1400 }, 'deposit', {}, 'kiosk'],
    [{ biz: true, carried: 0 }, 'deposit', {}, 'kiosk'],
    [{ biz: true, carried: 4, carriedCost: 1400 }, 'deposit', {}, 'kiosk'],
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
    [{ conversations: ['resident-1'] }, 'talk', { npcId: 'resident-1' }, undefined],
    [{}, 'talk', { npcId: 'resident-1' }, undefined],
    [{}, 'negotiate', { price: 300, quantity: 4 }, 'market'],
    [{}, 'negotiate', { price: 0, quantity: 4 }, 'market'],
  ];
  for (const [override, type, data, location] of cases) {
    const sim = new Simulation(); Object.assign(sim.state, override);
    const reason = actionReason(sim.state, type, data);
    const result = sim.act({ type, ...data }, { location, npcId: data.npcId });
    assert.equal(reason === '', result.ok, type + ': availability mismatch');
    if (!result.ok) assert.equal(reason, result.message, type + ': reason mismatch');
  }
});

test('purchase reasons follow quote expiry, quantity cap, stock and the negotiated debit exactly', () => {
  const scenarios = [
    { money: 1259, quantity: 4, expected: 'Fonds insuffisants.' },
    { money: 1260, quantity: 4, expected: '' },
    { money: 5000, quantity: 5, expected: 'Cette quantité dépasse la commande négociée.' },
    { money: 1259, quantity: 4, stock: 3, expected: 'Le stock d’Ama est insuffisant.' },
    { money: 1260, quantity: 4, expired: true, expected: 'Fonds insuffisants.' },
    { money: 1400, quantity: 4, expired: true, expected: '' },
  ];
  for (const scenario of scenarios) {
    const sim = new Simulation();
    sim.act({ type: 'negotiate', price: 300, quantity: 4 }, { location: 'market' });
    sim.state.money = scenario.money;
    if (scenario.stock !== undefined) sim.state.society.supplier.stock = scenario.stock;
    if (scenario.expired) sim.state.society.ticks = sim.state.society.supplier.quote.expiresAt;
    const before = sim.snapshot();
    assert.equal(actionReason(sim.state, 'buy', { quantity: scenario.quantity }), scenario.expected);
    assert.deepEqual(sim.snapshot(), before, 'checking a quote must not consume it');
    const result = sim.act({ type: 'buy', quantity: scenario.quantity }, { location: 'market' });
    assert.equal(result.ok, scenario.expected === '');
    if (!result.ok) assert.equal(result.message, scenario.expected);
  }
});

test('a valid low-price negotiation remains selectable so the supplier can refuse and remember it', () => {
  const sim = new Simulation(), offer = { price: 150, quantity: 4 };
  const before = sim.snapshot();
  assert.equal(actionReason(sim.state, 'negotiate', offer), '');
  assert.deepEqual(sim.snapshot(), before);
  assert.equal(sim.act({ type: 'negotiate', ...offer }, { location: 'market' }).ok, false);
  assert.equal(sim.state.society.supplier.lastDecision.kind, 'rejected');
  assert.equal(sim.state.society.supplier.trust, before.society.supplier.trust - 3);
});

test('first guidance follows supplier, actual purchase, carrying, investment and deposit before retail decisions', () => {
  const sim = new Simulation();
  assert.equal(goalFor(sim.state).targetId, 'market');
  assert.match(goalFor(sim.state).title, /Négocier/);
  assert.equal(goalFor(sim.state).reward, 0);
  sim.act({ type: 'negotiate', price: 300, quantity: 4 }, { location: 'market' });
  assert.match(goalFor(sim.state).title, /lot négocié/);
  assert.match(goalFor(sim.state).text, /1 260 F/);
  assert.equal(sim.state.money, 15000);
  sim.act({ type: 'buy', quantity: 4 }, { location: 'market' });
  assert.equal(goalFor(sim.state).targetId, 'kiosk');
  assert.match(goalFor(sim.state).title, /Ouvrir/);
  assert.equal(goalFor(sim.state).reward, 0);
  sim.act('invest', { location: 'kiosk' });
  assert.match(goalFor(sim.state).title, /Livrer mon stock/);
  sim.act('deposit', { location: 'kiosk' });
  assert.match(goalFor(sim.state).title, /cinq premiers clients/);
  assert.match(goalFor(sim.state).text, /5 \/ 7 budgets/);
  sim.act({ type: 'price', price: 1100 }, { location: 'kiosk' });
  assert.match(goalFor(sim.state).text, /aucun des 7 budgets/);
  assert.equal(goalFor(sim.state).targetId, 'kiosk');
});

test('optional deliveries retain their deadline, reward and daily quota without replacing the first market decision', () => {
  const sim = new Simulation();
  sim.act('contract', { location: 'market' });
  const inProgress = goalFor(sim.state);
  assert.equal(inProgress.targetId, 'studio');
  assert.equal(inProgress.progress, .5);
  assert.equal(inProgress.reward, 1200);
  assert.match(inProgress.text, /fin du jour 2/);
  assert.equal(sim.state.money, 15000);
  sim.act('deliver', { location: 'studio' });
  assert.equal(goalFor(sim.state).targetId, 'market');
  assert.match(goalFor(sim.state).title, /Négocier/);
  const poor = { ...createState(), money: 200, lastContractDay: 1 };
  assert.equal(goalFor(poor).reward, 0);
  assert.match(goalFor(poor).title, /demain/);
  assert.equal(goalFor({ ...poor, lastContractDay: 0 }).reward, 1200);
});

test('guidance respects rent, hunger, rest, closed shops and recorded milestones', () => {
  const state = { ...createState(), completed: 1, biz: true, stock: 5, stockCost: 1750, sales: 4, time: 22 };
  assert.match(goalFor(state).text, /07:00 à 21:00/);
  assert.equal(goalFor(state).progress, .8);
  assert.equal(goalFor({ ...state, debt: 800 }).targetId, 'home');
  assert.match(goalFor({ ...createState(), food: 34, money: 300 }).title, /repas/);
  assert.match(goalFor({ ...createState(), energy: 24 }).title, /énergie/);
  assert.match(goalFor({ ...createState(), food: 34, energy: 24, debt: 800, money: 1000 }).title, /loyer/);
  assert.deepEqual(getMilestones(createState()).map(m => m.done), [false, false, false, false]);
  assert.deepEqual(getMilestones(state).map(m => m.done), [true, true, false, false]);
  assert.deepEqual(getMilestones({ ...state, sales: 5, home: true }).map(m => m.done), [true, true, true, true]);
});

test('guidance explains an unaffordable reserved lot instead of promising an immediate purchase', () => {
  const sim = new Simulation();
  sim.act({ type: 'negotiate', price: 315, quantity: 8 }, { location: 'market' });
  sim.state.money = 1400;
  assert.match(goalFor(sim.state).title, /Adapter le lot/);
  assert.match(goalFor(sim.state).text, /2 520 F/);
  assert.equal(goalFor(sim.state).reward, 0);
  sim.state.society.supplier.stock = 0;
  assert.match(goalFor(sim.state).title, /court de stock/);
});

test('all UI projections read frozen state without changing cash, offers, routines or memories', () => {
  const state = createState(), snapshot = JSON.stringify(state); freezeTree(state);
  goalFor(state); economyView(state); getMilestones(state);
  for (const type of ['buy', 'negotiate', 'invest', 'deposit', 'price', 'contract', 'deliver', 'meal', 'rent', 'housing', 'rest', 'talk']) actionReason(state, type);
  assert.equal(JSON.stringify(state), snapshot);
});
