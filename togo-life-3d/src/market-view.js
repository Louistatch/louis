import { ECONOMY } from './simulation.js';
import { formatMoney } from './ui-model.js';

/** Read-only, engine-neutral dialogue. Simulation owns offers and transactions. */
const STRINGS = Object.freeze({
  SUPPLIER_INTRO: 'Je vends les marchandises de ce stand. Proposez un prix ou achetez au tarif courant.',
  SUPPLIER_COUNTER: 'Votre proposition ne me convient pas. Voici ma contre-proposition.',
  SUPPLIER_ACCEPTED: 'D’accord pour ce lot. Le prix est réservé ; le paiement a lieu à l’achat.',
  SUPPLIER_REFUSED: 'Je refuse cette proposition. Aucun paiement n’a été effectué.',
  SUPPLIER_EMPTY: 'Mon stand est vide. Je dois me réapprovisionner avant une nouvelle vente.',
  SUPPLIER_EXPIRED: 'Le prix réservé a expiré. Vous pouvez faire une nouvelle proposition ou acheter au tarif courant.',
  SUPPLIER_UNAVAILABLE: 'Ce fournisseur n’est pas disponible.',
  OFFER_SMALL: 'Proposer 300 F par produit',
  OFFER_BULK: 'Proposer 315 F par produit',
  OFFER_LOW: 'Proposer 150 F par produit',
  BUY_RESERVED: 'Acheter le lot réservé',
  BUY_CURRENT: 'Acheter au tarif courant',
});

const outcomes = Object.freeze({ accepted: 'accepted', counter: 'counter', rejected: 'refused', sold: 'intro' });
/** Transitions are named results, never expressions or executable text. */
export const SUPPLIER_DIALOGUE = Object.freeze({
  start: 'intro',
  nodes: Object.freeze(Object.fromEntries([
    ['intro', 'SUPPLIER_INTRO'], ['counter', 'SUPPLIER_COUNTER'],
    ['accepted', 'SUPPLIER_ACCEPTED'], ['refused', 'SUPPLIER_REFUSED'],
    ['expired', 'SUPPLIER_EXPIRED'],
  ].map(([id, lineId]) => [id, Object.freeze({ lineId, outcomes })]).concat([
    ['outofstock', Object.freeze({ lineId: 'SUPPLIER_EMPTY', end: true })],
    ['unavailable', Object.freeze({ lineId: 'SUPPLIER_UNAVAILABLE', end: true })],
  ]))),
});

const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const bounded = (value, maximum = 100) => Math.max(0, Math.min(maximum, finite(value)));
const product = quantity => `${quantity} produit${quantity === 1 ? '' : 's'}`;
const text = value => typeof value === 'string' ? value : '';

function activeQuote(society) {
  const quote = society?.supplier?.quote;
  if (!quote || !Number.isInteger(quote.quantity) || quote.quantity < 1 || quote.quantity > ECONOMY.capacity ||
    !Number.isInteger(quote.unitPrice) || quote.unitPrice < 300 || quote.unitPrice > ECONOMY.wholesale ||
    !Number.isInteger(quote.expiresAt) || quote.expiresAt <= finite(society.ticks)) return null;
  return {
    quantity: quote.quantity, unitPrice: quote.unitPrice, expiresAt: quote.expiresAt,
    total: quote.quantity * quote.unitPrice,
    remainingSeconds: (quote.expiresAt - finite(society.ticks)) * .25,
  };
}

function purchaseReason(state, supplier, quantity, price) {
  if (finite(state.carried) + quantity > ECONOMY.capacity)
    return `Le sac peut contenir ${ECONOMY.capacity} produits ; ${finite(state.carried)} sont déjà transportés.`;
  if (finite(supplier.stock) < quantity) return `Le stand ne contient plus que ${product(finite(supplier.stock))}.`;
  if (finite(state.money) < quantity * price) return `Il faut ${formatMoney(quantity * price)} pour ce lot.`;
  return '';
}

function negotiationReason(supplier, quantity) {
  return finite(supplier.stock) < quantity ? `Le stand ne contient plus que ${product(finite(supplier.stock))}.` : '';
}

/** Offers are simulation time, so opening a menu does not consume their duration. */
export function supplierView(state) {
  const society = state?.society, supplier = society?.supplier;
  if (!supplier) return {
    available: false, nodeId: 'unavailable', lineId: 'SUPPLIER_UNAVAILABLE',
    title: 'Fournisseur', text: STRINGS.SUPPLIER_UNAVAILABLE, quote: null, choices: [],
    stock: 0, wallet: 0, trust: 0,
  };
  const person = society.agents?.find(agent => agent.role === 'supplier');
  const quote = activeQuote(society), decision = supplier.lastDecision;
  let nodeId = outcomes[decision?.kind] ?? 'intro';
  if (!finite(supplier.stock)) nodeId = 'outofstock';
  else if (['counter', 'accepted'].includes(nodeId) && !quote) nodeId = 'expired';
  const lineId = SUPPLIER_DIALOGUE.nodes[nodeId].lineId;
  const lines = [STRINGS[lineId]];
  if (decision?.kind === 'sold' && nodeId === 'intro')
    lines.push(`Dernier lot vendu : ${product(decision.quantity)}, à ${formatMoney(decision.unitPrice)} par produit.`);
  if (['counter', 'accepted', 'refused'].includes(nodeId) && text(decision?.reason)) lines.push(decision.reason);
  if (quote && nodeId !== 'outofstock') lines.push(
    `${product(quote.quantity)} à ${formatMoney(quote.unitPrice)} par produit : ${formatMoney(quote.total)} au total.`,
    `Réservation : ${Math.ceil(quote.remainingSeconds)} s de jeu restantes.`,
  );

  const choices = [];
  if (nodeId !== 'outofstock') {
    const lots = quote ? [quote.quantity] : [4, 8, 12];
    for (const quantity of lots) {
      const price = quote ? quote.unitPrice : ECONOMY.wholesale;
      choices.push({
        type: 'buy', quantity, price,
        label: quote ? STRINGS.BUY_RESERVED : `Acheter ${product(quantity)}`,
        lineId: quote ? 'BUY_RESERVED' : 'BUY_CURRENT',
        detail: `${product(quantity)} × ${formatMoney(price)} = ${formatMoney(quantity * price)}. À transporter au comptoir.`,
        reason: purchaseReason(state, supplier, quantity, price),
      });
    }
    for (const [quantity, price, choiceId] of [[4, 300, 'OFFER_SMALL'], [8, 315, 'OFFER_BULK'], [4, 150, 'OFFER_LOW']]) choices.push({
      type: 'negotiate', quantity, price, lineId: choiceId,
      label: STRINGS[choiceId],
      detail: `${product(quantity)} : offre de ${formatMoney(quantity * price)} au total. ${quote ? 'Remplace la réservation en cours.' : 'Aucun paiement avant l’achat.'}`,
      reason: negotiationReason(supplier, quantity),
    });
  }
  return {
    available: true, nodeId, lineId, title: person?.name ? `Chez ${person.name}` : 'Le fournisseur',
    text: lines.join(' '), quote, choices,
    stock: finite(supplier.stock), wallet: finite(supplier.wallet), trust: finite(supplier.trust),
    reason: text(decision?.reason),
  };
}

const CHOICES = Object.freeze({ playerShop: 'Votre comptoir', competitor: 'Le commerce voisin', work: 'Le travail', home: 'Le logement', taxi: 'L’arrêt de taxi' });
const GOALS = Object.freeze({ playerShop: 'Votre comptoir', competitor: 'Le commerce voisin', market: 'Le marché', work: 'Le travail', home: 'Le logement', taxi: 'L’arrêt de taxi', waitTaxi: 'L’arrêt de taxi' });

/** A resident speaks only about a decision the simulation actually recorded. */
export function residentView(state, id) {
  const agent = state?.society?.agents?.find(person => person.id === id);
  if (!agent) return null;
  const memory = agent.memory ?? {}, board = agent.blackboard ?? {};
  const label = CHOICES[memory.lastChoice] ?? 'Pas encore de décision enregistrée';
  const reason = text(memory.lastReason);
  const purchases = Math.max(0, finite(memory.purchases));
  const memoryText = CHOICES[memory.lastChoice] && reason
    ? `${label} : ${reason}`
    : 'Je n’ai pas encore de choix à vous raconter.';
  const roleText = agent.role === 'supplier'
    ? 'Je tiens le stand de marchandises. Venez me voir pour un achat ou une proposition.'
    : reason ? memoryText : 'Je circule dans le quartier selon mes besoins et mes horaires.';
  const wallet = finite(agent.wallet);
  return {
    id: agent.id, name: agent.name, job: agent.job, role: agent.role,
    title: `${agent.name}${agent.job ? ` · ${agent.job}` : ''}`, text: roleText,
    needs: { food: bounded(agent.food), energy: bounded(agent.energy) },
    wallet, walletLabel: formatMoney(wallet), relationship: finite(agent.relationship),
    preferences: { maxPrice: finite(agent.maxPrice), localPreference: bounded(agent.localPreference, 1) },
    decision: {
      label, goal: text(board.goal), goalLabel: GOALS[board.goal] ?? 'Dans le quartier',
      status: text(board.status), reason,
    },
    memory: {
      lastChoice: text(memory.lastChoice), lastReason: reason,
      lastPrice: Number.isFinite(memory.lastPrice) ? memory.lastPrice : null,
      refusedPrice: Number.isFinite(memory.refusedPrice) ? memory.refusedPrice : null,
      purchases, text: memoryText,
    },
  };
}

/** Goods profit excludes unsold inventory, housing, meals and kiosk investment. */
export function societyView(state) {
  const society = state?.society, agents = society?.agents ?? [];
  const revenue = finite(state?.revenue);
  const goodsCostSold = Number.isFinite(state?.goodsCostSold) ? state.goodsCostSold : null;
  const carriedCost = Number.isFinite(state?.carriedCost) ? state.carriedCost : null;
  const stockCost = Number.isFinite(state?.stockCost) ? state.stockCost : null;
  const latestTrades = Array.isArray(society?.trades)
    ? society.trades.slice(-5).map(trade => ({
      id: trade.id, actorId: trade.actorId, buyerId: trade.buyerId, venue: trade.venue,
      quantity: trade.quantity, unitPrice: trade.unitPrice, total: trade.total, tick: trade.tick,
    })) : [];
  const money = finite(state?.money), debt = finite(state?.debt);
  return {
    available: Boolean(society), residents: agents.length,
    customers: agents.filter(agent => agent.role === 'client').length,
    stock: finite(state?.stock), carried: finite(state?.carried), sales: finite(state?.sales),
    revenue, goodsCostSold, carriedCost, stockCost,
    realizedGoodsProfit: goodsCostSold === null ? null : revenue - goodsCostSold,
    merchandiseOnHandCost: carriedCost === null || stockCost === null ? null : carriedCost + stockCost,
    totalCosts: finite(state?.costs), cash: money, debt, cashAfterRent: money - debt,
    supplierStock: finite(society?.supplier?.stock), competitorStock: finite(society?.competitor?.stock),
    latestTrades,
    profitLabel: 'Bénéfice des marchandises vendues',
    profitExplanation: 'Recettes des ventes moins le coût réel des produits vendus. Le stock restant et les autres dépenses sont comptés séparément.',
  };
}
