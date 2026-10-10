import { ECONOMY } from './simulation.js';
import { customerCanAfford } from './society.js';

/** UI projections only: actions and money still belong to Simulation. */
const moneyFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
export function formatMoney(value) {
  return Number.isFinite(value)
    ? `${moneyFormatter.format(value).replace(/[\u00a0\u202f]/g, ' ')} F`
    : '— F';
}

export function economyView(state) {
  const customers = (state.society?.agents ?? []).filter(agent => agent.role === 'client');
  const eligibleCustomers = customers.filter(agent => customerCanAfford(agent, state.price)).length;
  const unitCost = state.stock > 0 && Number.isFinite(state.stockCost) && state.stockCost >= 0
    ? state.stockCost / state.stock
    : state.carried > 0 && Number.isFinite(state.carriedCost) && state.carriedCost >= 0
      ? state.carriedCost / state.carried : ECONOMY.wholesale;
  return {
    unitCost,
    margin: state.price - unitCost,
    // This is a budget projection, not a probability or promise of purchases.
    demand: customers.length ? eligibleCustomers / customers.length : 0,
    demandLabel: customers.length ? `${eligibleCustomers} / ${customers.length} budgets` : 'Budgets indisponibles',
    eligibleCustomers, customerCount: customers.length,
    open: state.biz && state.time >= 7 && state.time < 21,
    // Debt is not automatically deducted by the simulation. Label this as a
    // balance AFTER paying outstanding rent, never as immediately spendable cash.
    cashBalance: state.money - state.debt,
  };
}

/** Availability before an intent, excluding proximity and negotiation outcomes. */
export function actionReason(state, type, data = {}) {
  if (typeof type !== 'string') return 'Action invalide.';
  const quantity = data.quantity ?? 4;
  switch (type) {
    case 'buy': {
      if (!state.society?.supplier) return 'Fournisseur indisponible.';
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > ECONOMY.capacity || state.carried + quantity > ECONOMY.capacity)
        return `Le sac contient au maximum ${ECONOMY.capacity} marchandises.`;
      const supplier = state.society.supplier;
      const quote = supplier.quote && state.society.ticks < supplier.quote.expiresAt ? supplier.quote : null;
      if (quote && quantity > quote.quantity) return 'Cette quantité dépasse la commande négociée.';
      if (supplier.stock < quantity) return 'Le stock d’Ama est insuffisant.';
      return !Number.isFinite(state.money) || state.money < quantity * (quote?.unitPrice ?? ECONOMY.wholesale)
        ? 'Fonds insuffisants.' : '';
    }
    case 'negotiate':
      if (!state.society?.supplier) return 'Fournisseur indisponible.';
      if (!Number.isInteger(data.price) || data.price < 1 || data.price > ECONOMY.wholesale ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > ECONOMY.capacity)
        return 'Proposez un prix de 1 à 350 F et 1 à 12 produits.';
      return quantity > state.society.supplier.stock ? 'Ama ne dispose pas de cette quantité.' : '';
    case 'invest':
      if (state.biz) return 'Votre kiosque est déjà ouvert.';
      return state.money < ECONOMY.kioskCost ? `Il faut ${formatMoney(ECONOMY.kioskCost)} pour le kiosque.` : '';
    case 'deposit':
      return !state.biz || !state.carried ? 'Ouvrez le kiosque et transportez des marchandises.' : '';
    case 'price':
      return !state.biz || !Number.isInteger(data.price) || data.price < ECONOMY.wholesale || data.price > 1200
        ? 'Prix autorisé : 350 à 1 200 F.' : '';
    case 'contract':
      if (state.lastContractDay === state.day) return 'Une livraison par jour : revenez demain.';
      return state.contract ? 'Une livraison est déjà en cours.' : '';
    case 'deliver':
      return !state.contract ? 'Aucun colis à livrer.' : '';
    case 'meal':
      if (state.food > 90) return 'Vous êtes rassasié.';
      return state.money < ECONOMY.meal ? 'Fonds insuffisants.' : '';
    case 'rent':
      if (state.debt === 0) return 'Votre loyer est à jour.';
      return state.money < state.debt ? 'Fonds insuffisants.' : '';
    case 'housing':
      if (state.home) return 'Le logement est déjà aménagé.';
      return state.money < 4000 ? 'Aménagement : 4 000 F.' : '';
    case 'rest':
      return state.debt ? 'Réglez le loyer avant de vous reposer.' : '';
    case 'talk':
      if (typeof data.npcId !== 'string' || !data.npcId || data.npcId.length > 64) return 'Habitant inconnu.';
      return state.conversations.includes(data.npcId) ? 'Nous avons déjà discuté. Revenez découvrir mon quartier.' : '';
    default:
      return 'Action inconnue.';
  }
}

export function getMilestones(state) {
  return [
    { id: 'delivery', title: 'Première livraison', done: state.completed >= 1, detail: `${state.completed} livraison${state.completed === 1 ? '' : 's'} terminée${state.completed === 1 ? '' : 's'}` },
    { id: 'commerce', title: 'Ouvrir mon comptoir', done: state.biz, detail: state.biz ? 'Comptoir ouvert' : `Investissement : ${formatMoney(ECONOMY.kioskCost)}` },
    { id: 'sales', title: 'Servir cinq clients', done: state.sales >= 5, detail: `${state.sales} produit${state.sales === 1 ? '' : 's'} vendu${state.sales === 1 ? '' : 's'}` },
    { id: 'housing', title: 'Aménager mon logement', done: state.home, detail: state.home ? 'Logement aménagé' : 'Aménagement : 4 000 F' },
  ];
}

/** A real next decision, with its matching world marker and no fictional bonus. */
export function goalFor(state) {
  const goal = (title, text, targetId, reward = 0, progress = 0) => ({ title, text, targetId, reward, progress: Math.max(0, Math.min(1, progress)) });
  const deliveryAvailable = !actionReason(state, 'contract');
  const earn = () => deliveryAvailable
    ? goal('Financer mon prochain pas', 'Prenez un colis au marché. Le paiement vient après remise au studio.', 'market', 1200)
    : goal('Prochaine livraison demain', 'La livraison du jour a déjà été prise. Une nouvelle sera disponible demain.', 'home');

  if (state.contract) return goal('Livrer le colis', `Remettez le colis au studio avant la fin du jour ${state.contract.deadline}. Paiement : ${formatMoney(state.contract.reward)}.`, 'studio', state.contract.reward, .5);
  if (state.debt > 0) {
    if (state.money >= state.debt) return goal('Régler mon loyer', `Passez au logement pour régler ${formatMoney(state.debt)} et pouvoir vous reposer.`, 'home');
    return earn();
  }
  if (state.food < 35 && !actionReason(state, 'meal'))
    return goal('Prendre un repas', `Au marché, un repas coûte ${formatMoney(ECONOMY.meal)} et vous rassasie. Gardez une réserve pour votre commerce.`, 'market');
  if (state.energy < 25 && !actionReason(state, 'rest'))
    return goal('Récupérer mon énergie', 'Rejoignez le logement pour vous reposer. Les habitants poursuivent leurs activités pendant ce temps.', 'home');
  if (state.carried > 0) {
    if (!state.biz) {
      if (state.money < ECONOMY.kioskCost) return earn();
      return goal('Ouvrir mon comptoir', `Transportez vos ${state.carried} produits au comptoir. L’ouverture coûte ${formatMoney(ECONOMY.kioskCost)} ; vous pourrez ensuite déposer le lot.`, 'kiosk', 0, .35);
    }
    return goal('Livrer mon stock', `Transportez vos ${state.carried} marchandises au comptoir, puis déposez-les.`, 'kiosk', 0, .5);
  }
  const view = economyView(state);
  if (!state.biz || state.stock === 0) {
    const supplier = state.society?.supplier;
    if (supplier && supplier.stock === 0)
      return goal('Le marché est à court de stock', 'Le stand est vide. Surveillez son réapprovisionnement ou prenez une livraison disponible pour garder votre activité.', 'market');
    const quote = supplier?.quote && state.society.ticks < supplier.quote.expiresAt ? supplier.quote : null;
    const smallestLot = quote ? Math.min(4, quote.quantity) : 4;
    if (state.money < smallestLot * (quote?.unitPrice ?? ECONOMY.wholesale)) return earn();
    if (quote) {
      const total = quote.quantity * quote.unitPrice;
      return state.money < total
        ? goal('Adapter le lot à mon budget', `Le lot réservé coûte ${formatMoney(total)} ; votre budget est de ${formatMoney(state.money)}. Refaites une proposition pour un lot plus petit avant d’acheter.`, 'market', 0, .15)
        : goal('Choisir mon lot négocié', `Au marché, ${quote.quantity} produits sont réservés à ${formatMoney(quote.unitPrice)} chacun, soit ${formatMoney(total)}. Confirmez un achat avant de transporter les marchandises.`, 'market', 0, .15);
    }
    return goal(state.biz ? 'Réapprovisionner mon commerce' : 'Négocier mon premier stock',
      `Au marché, échangez avec Ama : proposez un prix ou achetez un lot à ${formatMoney(ECONOMY.wholesale)} par produit. Le paiement a lieu à l’achat ; transportez ensuite les marchandises au comptoir.`, 'market');
  }
  if (!view.open) return goal('Mon comptoir est fermé', `Horaires : 07:00 à 21:00. ${state.sales} / 5 produits vendus. Les habitants pourront comparer votre offre à l’ouverture.`, 'kiosk', 0, Math.min(state.sales / 5, 1));
  if (view.customerCount && view.eligibleCustomers === 0)
    return goal('Adapter mon prix aux voisins', `À ${formatMoney(state.price)}, aucun des ${view.customerCount} budgets ne permet l’achat. Comparez leurs moyens et ajustez le prix au comptoir.`, 'kiosk', 0, Math.min(state.sales / 5, 1));
  if (state.sales < 5) return goal('Mes cinq premiers clients', `${state.sales} / 5 produits vendus. ${view.demandLabel} compatibles. Les voisins comparent les commerces selon leurs besoins ; gardez du stock.`, 'kiosk', 0, state.sales / 5);
  if (!state.home && state.money >= 4000) return goal('Aménager mon logement', 'Au logement, investissez 4 000 F : les repos restaureront davantage d’énergie.', 'home');
  return goal('Développer mon commerce', `${state.stock} produits en stock. Comparez votre marge réelle aux budgets des voisins ; gardez une réserve pour le loyer et le réapprovisionnement.`, 'kiosk', 0, 1);
}
