import test from 'node:test';
import assert from 'node:assert/strict';
import { supplierView, residentView, societyView, SUPPLIER_DIALOGUE } from '../src/market-view.js';
import { createSociety, negotiateSupplier, buySupplier } from '../src/society.js';

function state() {
  return {
    money: 6000, carried: 0, stock: 4, price: 550, biz: true, sales: 2,
    revenue: 1100, costs: 10260, goodsCostSold: 630, carriedCost: 0, stockCost: 630, debt: 800,
    society: {
      ticks: 80,
      supplier: { stock: 30, wallet: 5000, trust: 60, quote: null, lastDecision: null },
      competitor: { stock: 20, wallet: 3000, price: 600 },
      agents: Array.from({ length: 8 }, (_, index) => ({
        id: `resident-${index}`, name: index ? `Habitant ${index}` : 'Ama',
        job: index ? 'artisan' : 'fournisseuse', role: index ? 'client' : 'supplier',
        wallet: 1000, food: 70, energy: 80, relationship: 2, maxPrice: 650, localPreference: .7,
        memory: { lastChoice: '', lastReason: '', lastPrice: null, refusedPrice: null, purchases: 0 },
        blackboard: { goal: 'work', status: 'walking', scores: {} },
      })),
      trades: [{ id: 1, actorId: 'resident-1', buyerId: 'resident-1', venue: 'player', quantity: 1, unitPrice: 550, total: 550, tick: 70 }],
    },
  };
}
function freezeTree(object) {
  if (object && typeof object === 'object') {
    Object.freeze(object);
    for (const value of Object.values(object)) freezeTree(value);
  }
  return object;
}
function quote(s, kind = 'counter') {
  s.society.supplier.quote = { quantity: 4, unitPrice: 315, expiresAt: 320 };
  s.society.supplier.lastDecision = {
    kind, offeredPrice: kind === 'counter' ? 300 : 315, quantity: 4, unitPrice: 315,
    reason: 'Je garde une réserve pour le prochain réapprovisionnement.', tick: 80,
  };
}

test('supplier conversation distinguishes proposing a price from purchasing a binding counter-offer', () => {
  const s = state(), intro = supplierView(s);
  assert.equal(intro.nodeId, 'intro');
  assert.equal(intro.title, 'Chez Ama');
  assert.deepEqual(intro.choices.filter(c => c.type === 'buy').map(c => [c.quantity, c.price]), [[4, 350], [8, 350], [12, 350]]);
  assert.deepEqual(intro.choices.filter(c => c.type === 'negotiate').map(c => [c.quantity, c.price]), [[4, 300], [8, 315], [4, 150]]);
  quote(s);
  const counter = supplierView(s);
  assert.equal(counter.nodeId, 'counter');
  assert.match(counter.text, /réserve pour le prochain réapprovisionnement/);
  assert.equal(counter.quote.total, 1260);
  assert.equal(counter.quote.remainingSeconds, 60);
  assert.deepEqual(counter.choices.filter(c => c.type === 'buy').map(c => [c.quantity, c.price]), [[4, 315]]);
  assert.match(counter.choices.find(c => c.type === 'buy').detail, /1 260 F/);
  assert.match(counter.choices.find(c => c.type === 'negotiate').detail, /Remplace la réservation/);
  assert.equal(s.money, 6000, 'reading the conversation must never pay for its offer');
});

test('accepted price expires at its simulation tick, with no stale discounted purchase option', () => {
  const s = state(); quote(s, 'accepted');
  s.society.ticks = 319;
  let view = supplierView(s);
  assert.equal(view.nodeId, 'accepted');
  assert.equal(view.quote.remainingSeconds, .25);
  assert.match(view.text, /1 s de jeu/);
  s.society.ticks = 320;
  view = supplierView(s);
  assert.equal(view.nodeId, 'expired');
  assert.equal(view.quote, null);
  assert.ok(view.choices.filter(c => c.type === 'buy').every(c => c.price === 350));
  assert.match(view.text, /faire une nouvelle proposition/);
  s.society.ticks = 450;
  assert.equal(supplierView(s).quote, null);
});

test('a rejected low offer explains the recorded consequence, without invented revenue or a false agreement', () => {
  const s = state();
  s.society.supplier.trust = 57;
  s.society.supplier.lastDecision = {
    kind: 'rejected', offeredPrice: 150, quantity: 4, unitPrice: 350, tick: 80,
    reason: 'Ce prix est trop bas pour renouveler mon stock.',
  };
  const view = supplierView(s);
  assert.equal(view.nodeId, 'refused');
  assert.equal(view.trust, 57);
  assert.equal(view.quote, null);
  assert.match(view.text, /trop bas pour renouveler mon stock/);
  assert.match(view.text, /Aucun paiement/);
  assert.equal(s.revenue, 1100);
  assert.equal(view.choices.find(c => c.type === 'buy').price, 350);
});

test('purchase choices explain the actual budget, carrying and stock bottlenecks, without spending at negotiation', () => {
  const s = state(); quote(s);
  s.money = 1259;
  let view = supplierView(s);
  assert.equal(view.choices.find(c => c.type === 'buy').reason, 'Il faut 1 260 F pour ce lot.');
  assert.equal(view.choices.find(c => c.type === 'negotiate').reason, '', 'an offer is not an immediate charge');
  s.money = 1260;
  assert.equal(supplierView(s).choices.find(c => c.type === 'buy').reason, '');
  s.carried = 9;
  assert.match(supplierView(s).choices.find(c => c.type === 'buy').reason, /9 sont déjà transportés/);
  s.carried = 0; s.society.supplier.stock = 3;
  view = supplierView(s);
  assert.match(view.choices.find(c => c.type === 'buy').reason, /3 produits/);
  assert.ok(view.choices.filter(c => c.type === 'negotiate').every(c => c.reason.includes('3 produits')));
  s.society.supplier.stock = 0;
  view = supplierView(s);
  assert.equal(view.nodeId, 'outofstock');
  assert.deepEqual(view.choices, []);
  assert.match(view.text, /réapprovisionner/);
});

test('resident explanation reports a recorded rival purchase or refusal, and does not turn a routine into a purchase', () => {
  const s = state(), agent = s.society.agents[1];
  let view = residentView(s, agent.id);
  assert.equal(view.memory.purchases, 0);
  assert.equal(view.wallet, 1000);
  assert.equal(view.preferences.maxPrice, 650);
  assert.equal(view.preferences.localPreference, .7);
  assert.match(view.memory.text, /pas encore/);
  assert.equal(view.decision.goalLabel, 'Le travail');
  agent.memory = { lastChoice: 'competitor', lastReason: 'Votre prix dépasse mon budget ; le commerce voisin est moins cher.', lastPrice: 600, refusedPrice: 850, purchases: 1 };
  agent.wallet = 400;
  view = residentView(s, agent.id);
  assert.equal(view.walletLabel, '400 F');
  assert.equal(view.memory.purchases, 1);
  assert.equal(view.memory.refusedPrice, 850);
  assert.match(view.text, /commerce voisin/);
  assert.match(view.text, /Votre prix dépasse mon budget/);
  agent.memory = { lastChoice: 'work', lastReason: 'Je dois gagner de quoi faire mes courses.', lastPrice: null, refusedPrice: null, purchases: 0 };
  view = residentView(s, agent.id);
  assert.equal(view.memory.purchases, 0);
  assert.equal(view.memory.lastPrice, null);
  assert.match(view.text, /gagner de quoi faire mes courses/);
  assert.equal(residentView(s, 'person-who-does-not-exist'), null);
});

test('realized goods profit separates negotiated merchandise costs from unsold stock, investment and cash', () => {
  const s = state(), view = societyView(s);
  assert.equal(view.customers, 7);
  assert.equal(view.residents, 8);
  assert.equal(view.revenue, 1100);
  assert.equal(view.goodsCostSold, 630);
  assert.equal(view.realizedGoodsProfit, 470);
  assert.equal(view.merchandiseOnHandCost, 630);
  assert.equal(view.totalCosts, 10260);
  assert.equal(view.cash, 6000);
  assert.equal(view.cashAfterRent, 5200);
  assert.notEqual(view.realizedGoodsProfit, s.revenue - s.costs, 'kiosk investment is not the unit cost of sold goods');
  assert.match(view.profitExplanation, /stock restant/);
  delete s.goodsCostSold;
  assert.equal(societyView(s).realizedGoodsProfit, null, 'unknown saved cost must not become a fabricated zero-cost profit');
});

test('every supplier outcome has a declared, localized branch and a valid transition', () => {
  assert.ok(SUPPLIER_DIALOGUE.nodes[SUPPLIER_DIALOGUE.start]);
  for (const [id, node] of Object.entries(SUPPLIER_DIALOGUE.nodes)) {
    assert.match(node.lineId, /^SUPPLIER_/);
    assert.ok(node.end || node.outcomes, `unterminated node ${id}`);
    for (const target of Object.values(node.outcomes ?? {})) assert.ok(SUPPLIER_DIALOGUE.nodes[target], `unknown transition ${target}`);
  }
  for (const [kind, expected] of [['accepted', 'accepted'], ['counter', 'counter'], ['rejected', 'refused'], ['sold', 'intro']]) {
    const s = state(); quote(s, kind);
    if (kind === 'rejected' || kind === 'sold') s.society.supplier.quote = null;
    const view = supplierView(s);
    assert.equal(view.nodeId, expected);
    assert.equal(view.lineId, SUPPLIER_DIALOGUE.nodes[expected].lineId);
    assert.ok(view.text.length > 0);
  }
  assert.equal(supplierView({}).nodeId, 'unavailable');
  assert.equal(societyView({}).available, false);
});

test('viewing or modifying returned UI data never changes offers, resident memory, stock or transaction records', () => {
  const s = state(); quote(s);
  const before = JSON.stringify(s); freezeTree(s);
  const supplier = supplierView(s), resident = residentView(s, 'resident-1'), society = societyView(s);
  supplier.quote.unitPrice = 1;
  supplier.choices[0].quantity = 99;
  resident.memory.purchases = 99;
  resident.preferences.localPreference = 0;
  society.latestTrades[0].total = 1;
  assert.equal(JSON.stringify(s), before);
  assert.equal(supplierView(s).quote.unitPrice, 315);
});

test('the real supplier accepts UI intents, exposes its counter-price and charges that price only on buying', () => {
  const s = state(); s.society = createSociety();
  const initialMoney = s.money, initialWallet = s.society.supplier.wallet;
  const smallOffer = supplierView(s).choices.find(c => c.type === 'negotiate' && c.price === 300);
  const result = negotiateSupplier(s, smallOffer);
  assert.equal(result.counter, true);
  assert.equal(s.money, initialMoney);
  const counter = supplierView(s), purchase = counter.choices.find(c => c.type === 'buy');
  assert.equal(counter.nodeId, 'counter');
  assert.equal(purchase.price, result.unitPrice);
  assert.equal(buySupplier(s, purchase.quantity).ok, true);
  assert.equal(initialMoney - s.money, purchase.price * purchase.quantity);
  assert.equal(s.society.supplier.wallet - initialWallet, purchase.price * purchase.quantity);
  assert.equal(supplierView(s).nodeId, 'intro');
  assert.match(supplierView(s).text, /Dernier lot vendu/);
  const lowOffer = supplierView(s).choices.find(c => c.type === 'negotiate' && c.price === 150);
  assert.equal(negotiateSupplier(s, lowOffer).ok, false);
  assert.equal(supplierView(s).nodeId, 'refused');
  assert.equal(supplierView(s).reason, s.society.supplier.lastDecision.reason);
});
