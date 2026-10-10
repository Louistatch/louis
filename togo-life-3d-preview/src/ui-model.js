import { ECONOMY, DESTINATIONS, LEVELS, capacityFor, contractsPerDay, contractReward, dayEvent, demandFor, destinationFor, levelFor } from './simulation.js';

/** UI projections only: actions and money still belong to Simulation. */
const moneyFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
export function formatMoney(value) {
  return Number.isFinite(value)
    ? `${moneyFormatter.format(value).replace(/[\u00a0\u202f]/g, ' ')} F`
    : '— F';
}

export function economyView(state) {
  const demand = demandFor(state.price);
  return {
    event: dayEvent(state.day),
    margin: state.price - ECONOMY.wholesale,
    demand,
    demandLabel: demand === 1 ? 'Forte' : demand === .68 ? 'Modérée' : demand === .3 ? 'Faible' : 'Aucune',
    open: state.biz && state.time >= 7 && state.time <= 21,
    // Debt is not automatically deducted by the simulation. Label this as a
    // balance AFTER paying outstanding rent, never as immediately spendable cash.
    cashBalance: state.money - state.debt,
  };
}

/** Same rejection order as Simulation.act, excluding proximity to a place. */
export function actionReason(state, type, data = {}) {
  if (typeof type !== 'string') return 'Action invalide.';
  const quantity = data.quantity ?? 4;
  switch (type) {
    case 'buy':
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > capacityFor(state) || state.carried + quantity > capacityFor(state))
        return `Le sac contient au maximum ${capacityFor(state)} marchandises.`;
      return state.money < quantity * ECONOMY.wholesale ? 'Fonds insuffisants.' : '';
    case 'invest':
      if (state.biz) return 'Votre kiosque est déjà ouvert.';
      return state.money < ECONOMY.kioskCost ? `Il faut ${formatMoney(ECONOMY.kioskCost)} pour le kiosque.` : '';
    case 'deposit':
      return !state.biz || !state.carried ? 'Ouvrez le kiosque et transportez des marchandises.' : '';
    case 'price':
      return !state.biz || !Number.isInteger(data.price) || data.price < ECONOMY.wholesale || data.price > 1200
        ? 'Prix autorisé : 350 à 1 200 F.' : '';
    case 'contract':
      if (state.contract) return 'Une livraison est déjà en cours.';
      if (contractsTaken(state) >= contractsPerDay(state))
        return contractsPerDay(state) === 1 ? 'Une livraison par jour : revenez demain.' : 'Livraisons du jour terminées : revenez demain.';
      return '';
    case 'deliver':
      if (!state.contract) return 'Aucun colis à livrer.';
      return data.location && data.location !== state.contract.destination ? `Ce colis est attendu à : ${DESTINATIONS[state.contract.destination].name}.` : '';
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

const contractsTaken = state => state.lastContractDay === state.day ? Math.max(1, state.dailyContracts ?? 1) : 0;

/** Next delivery offered at the market, or null when today's quota is used. */
export function nextContract(state) {
  if (state.contract || contractsTaken(state) >= contractsPerDay(state)) return null;
  const destination = destinationFor(state.day, contractsTaken(state));
  return { destination, name: DESTINATIONS[destination].name, reward: contractReward(state, destination) };
}

export function levelView(state) {
  const level = levelFor(state.experience), current = LEVELS[level - 1], next = LEVELS[level];
  return {
    level, title: current.title, perk: current.perk,
    next: next ? { level: level + 1, title: next.title, perk: next.perk, xp: next.xp } : null,
    progress: next ? (state.experience - current.xp) / (next.xp - current.xp) : 1,
    capacity: capacityFor(state),
  };
}

export function getMilestones(state) {
  return [
    { id: 'delivery', title: 'Première livraison', done: state.completed >= 1, detail: `${state.completed} livraison${state.completed === 1 ? '' : 's'} terminée${state.completed === 1 ? '' : 's'}` },
    { id: 'commerce', title: 'Ouvrir mon comptoir', done: state.biz, detail: state.biz ? 'Comptoir ouvert' : `Investissement : ${formatMoney(ECONOMY.kioskCost)}` },
    { id: 'sales', title: 'Servir cinq clients', done: state.sales >= 5, detail: `${state.sales} produit${state.sales === 1 ? '' : 's'} vendu${state.sales === 1 ? '' : 's'}` },
    { id: 'housing', title: 'Aménager mon logement', done: state.home, detail: state.home ? 'Logement aménagé' : 'Aménagement : 4 000 F' },
    { id: 'level', title: `Atteindre le niveau 3 · ${LEVELS[2].title}`, done: levelFor(state.experience) >= 3, detail: `${state.experience} / ${LEVELS[2].xp} points d’expérience` },
  ];
}

/** A real next decision, with its matching world marker and no fictional bonus. */
export function goalFor(state) {
  const goal = (title, text, targetId, reward = 0, progress = 0) => ({ title, text, targetId, reward, progress: Math.max(0, Math.min(1, progress)) });
  const offer = nextContract(state), deliveryAvailable = !!offer;
  const earn = () => deliveryAvailable
    ? goal('Financer mon prochain pas', `Prenez un colis au marché, à remettre à « ${offer.name} ». Le paiement vient après la remise.`, 'market', offer.reward)
    : goal('Prochaine livraison demain', 'La livraison du jour a déjà été prise. Une nouvelle sera disponible demain.', 'home');

  if (state.contract) return goal('Livrer le colis', `Remettez le colis à « ${DESTINATIONS[state.contract.destination].name} » avant la fin du jour ${state.contract.deadline}. Paiement : ${formatMoney(state.contract.reward)}.`, state.contract.destination, state.contract.reward, .5);
  if (state.debt > 0) {
    if (state.money >= state.debt) return goal('Régler mon loyer', `Passez au logement pour régler ${formatMoney(state.debt)} et pouvoir vous reposer.`, 'home');
    return earn();
  }
  if (state.carried > 0 && state.biz) return goal('Livrer mon stock', `Transportez vos ${state.carried} marchandises au comptoir, puis déposez-les.`, 'kiosk', 0, .5);
  if (!state.completed && deliveryAvailable) return goal('Ma première livraison', `Au marché, prenez un colis puis remettez-le à « ${offer.name} ». Aucun achat nécessaire.`, 'market', offer.reward);
  if (!state.biz) {
    if (state.money < ECONOMY.kioskCost) return earn();
    return goal('Ouvrir mon comptoir', `Rendez-vous au comptoir. L’ouverture coûte ${formatMoney(ECONOMY.kioskCost)} ; le stock est acheté séparément.`, 'kiosk');
  }
  const view = economyView(state);
  if (state.stock === 0) {
    if (state.money < ECONOMY.wholesale) return earn();
    return goal('Réapprovisionner mon commerce', `Achetez au marché à ${formatMoney(ECONOMY.wholesale)} par produit, puis transportez le stock au comptoir.`, 'market');
  }
  if (view.demand === 0) return goal('Retrouver des clients', `À ${formatMoney(state.price)}, la demande est nulle. Ajustez le prix au comptoir : 850 F ou moins attire des clients.`, 'kiosk', 0, Math.min(state.sales / 5, 1));
  if (state.sales < 5) return goal('Mes cinq premiers clients', view.open
    ? `${state.sales} / 5 produits vendus. Gardez du stock ; le prix règle la demande. Vous pouvez explorer pendant les ventes.`
    : `Le comptoir vend de 07:00 à 21:00. ${state.sales} / 5 produits vendus ; les ventes reprendront à l’ouverture.`, 'kiosk', 0, state.sales / 5);
  if (!state.home && state.money >= 4000) return goal('Aménager mon logement', 'Au logement, investissez 4 000 F : les repos restaureront davantage d’énergie.', 'home');
  return goal('Développer mon commerce', `${state.stock} produits en stock. Comparez marge et demande ; gardez une réserve pour le loyer et le réapprovisionnement.`, 'kiosk', 0, 1);
}
