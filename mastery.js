// Original demanding practice bank; not official Bryq or BAD items.
const MASTERY_QUESTIONS=[
  {
    "id": "mastery-v-pilot-0",
    "family": "mastery-v-pilot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le budget du dossier de Noria a été validé.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "L’acceptation exige un budget validé ; Noria est accepté, donc son budget a été validé.",
    "stimulus": "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé. Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation. Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée. Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain.",
    "sentences": [
      "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé.",
      "Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation.",
      "Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée.",
      "Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain."
    ],
    "trap": "necessary",
    "rule": "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
    "hint": "Repère la condition nécessaire et le statut de Noria. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’acceptation exige un budget validé ; Noria est accepté, donc son budget a été validé.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
      "L’acceptation exige un budget validé ; Noria est accepté, donc son budget a été validé."
    ]
  },
  {
    "id": "mastery-v-pilot-1",
    "family": "mastery-v-pilot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’annexe du dossier de Noria n’a pas été signée.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Noria est accepté et la signature est obligatoire : une annexe non signée contredit ces faits.",
    "stimulus": "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé. Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation. Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée. Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain.",
    "sentences": [
      "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé.",
      "Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation.",
      "Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée.",
      "Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain."
    ],
    "trap": "necessary",
    "rule": "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
    "hint": "Repère l’obligation de signature. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Noria est accepté et la signature est obligatoire : une annexe non signée contredit ces faits.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
      "Noria est accepté et la signature est obligatoire : une annexe non signée contredit ces faits."
    ]
  },
  {
    "id": "mastery-v-pilot-2",
    "family": "mastery-v-pilot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le dossier de Salo a été accepté.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Salo remplit des conditions nécessaires, mais elles ne garantissent pas l’acceptation ; aucune décision n’est donnée.",
    "stimulus": "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé. Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation. Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée. Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain.",
    "sentences": [
      "Le programme pilote accepte un dossier uniquement si son annexe est signée et si son budget a été validé.",
      "Ces conditions autorisent l’examen du dossier, mais ne garantissent pas son acceptation.",
      "Le dossier de Noria a été accepté ; celui de Salo possède une annexe signée et un budget validé, sans décision publiée.",
      "Les dossiers acceptés sont examinés par un comité distinct de l’équipe de terrain."
    ],
    "trap": "necessary",
    "rule": "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
    "hint": "Repère la différence entre admissibilité et décision. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Salo remplit des conditions nécessaires, mais elles ne garantissent pas l’acceptation ; aucune décision n’est donnée."
    ],
    "steps": [
      "Une condition nécessaire est imposée par l’acceptation. La remplir ne suffit pas à prouver l’acceptation.",
      "Salo remplit des conditions nécessaires, mais elles ne garantissent pas l’acceptation ; aucune décision n’est donnée."
    ]
  },
  {
    "id": "mastery-v-publication-0",
    "family": "mastery-v-publication",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Rima a passé la revue technique.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Tout rapport publié passe par cette revue ; Rima a été publié.",
    "stimulus": "Tout rapport publié passe par une revue technique puis par une validation juridique. La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier. Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié. Les annexes de travail peuvent circuler en interne sans suivre ce parcours.",
    "sentences": [
      "Tout rapport publié passe par une revue technique puis par une validation juridique.",
      "La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier.",
      "Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié.",
      "Les annexes de travail peuvent circuler en interne sans suivre ce parcours."
    ],
    "trap": "scope",
    "rule": "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
    "hint": "Repère le parcours obligatoire des rapports publiés. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "Tout rapport publié passe par cette revue ; Rima a été publié.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
      "Tout rapport publié passe par cette revue ; Rima a été publié."
    ]
  },
  {
    "id": "mastery-v-publication-1",
    "family": "mastery-v-publication",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tavo est déjà publié.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le passage dit expressément que Tavo n’a pas encore été publié.",
    "stimulus": "Tout rapport publié passe par une revue technique puis par une validation juridique. La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier. Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié. Les annexes de travail peuvent circuler en interne sans suivre ce parcours.",
    "sentences": [
      "Tout rapport publié passe par une revue technique puis par une validation juridique.",
      "La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier.",
      "Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié.",
      "Les annexes de travail peuvent circuler en interne sans suivre ce parcours."
    ],
    "trap": "scope",
    "rule": "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
    "hint": "Repère le statut exact de Tavo. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le passage dit expressément que Tavo n’a pas encore été publié.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
      "Le passage dit expressément que Tavo n’a pas encore été publié."
    ]
  },
  {
    "id": "mastery-v-publication-2",
    "family": "mastery-v-publication",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les annexes de travail de Rima ont toutes passé la revue technique.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "La règle porte sur le rapport publié ; aucune information ne décrit le parcours de chacune de ses annexes de travail.",
    "stimulus": "Tout rapport publié passe par une revue technique puis par une validation juridique. La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier. Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié. Les annexes de travail peuvent circuler en interne sans suivre ce parcours.",
    "sentences": [
      "Tout rapport publié passe par une revue technique puis par une validation juridique.",
      "La validation juridique suffit pour autoriser la publication, sans obliger l’équipe à publier.",
      "Le rapport Rima a été publié. Le rapport Tavo a obtenu la validation juridique mais n’a pas encore été publié.",
      "Les annexes de travail peuvent circuler en interne sans suivre ce parcours."
    ],
    "trap": "scope",
    "rule": "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
    "hint": "Repère le périmètre de la règle. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "La règle porte sur le rapport publié ; aucune information ne décrit le parcours de chacune de ses annexes de travail."
    ],
    "steps": [
      "Une règle sur un rapport ne s’étend pas automatiquement à chacun de ses documents de travail.",
      "La règle porte sur le rapport publié ; aucune information ne décrit le parcours de chacune de ses annexes de travail."
    ]
  },
  {
    "id": "mastery-v-training-0",
    "family": "mastery-v-training",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Au moins un agent formé ne peut pas approuver seul un décaissement.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Il existe un agent formé au contrôle qualité ; aucun agent de ce groupe ne peut approuver seul.",
    "stimulus": "Au moins un agent formé à la collecte travaille aussi au contrôle qualité. Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement. Certains agents formés travaillent uniquement à la collecte. Le texte ne donne pas l’affectation des agents qui n’ont pas été formés.",
    "sentences": [
      "Au moins un agent formé à la collecte travaille aussi au contrôle qualité.",
      "Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement.",
      "Certains agents formés travaillent uniquement à la collecte.",
      "Le texte ne donne pas l’affectation des agents qui n’ont pas été formés."
    ],
    "trap": "quantifier",
    "rule": "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
    "hint": "Repère l’existence d’un agent commun aux deux groupes. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "Il existe un agent formé au contrôle qualité ; aucun agent de ce groupe ne peut approuver seul.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
      "Il existe un agent formé au contrôle qualité ; aucun agent de ce groupe ne peut approuver seul."
    ]
  },
  {
    "id": "mastery-v-training-1",
    "family": "mastery-v-training",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tous les agents formés peuvent approuver seuls un décaissement.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Au moins un agent formé est au contrôle qualité et ne le peut pas : cela contredit « tous ».",
    "stimulus": "Au moins un agent formé à la collecte travaille aussi au contrôle qualité. Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement. Certains agents formés travaillent uniquement à la collecte. Le texte ne donne pas l’affectation des agents qui n’ont pas été formés.",
    "sentences": [
      "Au moins un agent formé à la collecte travaille aussi au contrôle qualité.",
      "Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement.",
      "Certains agents formés travaillent uniquement à la collecte.",
      "Le texte ne donne pas l’affectation des agents qui n’ont pas été formés."
    ],
    "trap": "quantifier",
    "rule": "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
    "hint": "Repère un contre-exemple à « tous ». Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Au moins un agent formé est au contrôle qualité et ne le peut pas : cela contredit « tous ».",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
      "Au moins un agent formé est au contrôle qualité et ne le peut pas : cela contredit « tous »."
    ]
  },
  {
    "id": "mastery-v-training-2",
    "family": "mastery-v-training",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tous les agents non formés sont exclus du contrôle qualité.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "L’affectation des agents non formés n’est pas décrite.",
    "stimulus": "Au moins un agent formé à la collecte travaille aussi au contrôle qualité. Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement. Certains agents formés travaillent uniquement à la collecte. Le texte ne donne pas l’affectation des agents qui n’ont pas été formés.",
    "sentences": [
      "Au moins un agent formé à la collecte travaille aussi au contrôle qualité.",
      "Aucun agent affecté au contrôle qualité ne peut approuver seul un décaissement.",
      "Certains agents formés travaillent uniquement à la collecte.",
      "Le texte ne donne pas l’affectation des agents qui n’ont pas été formés."
    ],
    "trap": "quantifier",
    "rule": "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
    "hint": "Repère le groupe dont le texte ne parle pas. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "L’affectation des agents non formés n’est pas décrite."
    ],
    "steps": [
      "« Certains » établit une existence ; un seul contre-exemple suffit à rendre une affirmation universelle fausse.",
      "L’affectation des agents non formés n’est pas décrite."
    ]
  },
  {
    "id": "mastery-v-crops-0",
    "family": "mastery-v-crops",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les ventes observées se sont améliorées après l’ouverture de la route.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Le changement et sa chronologie sont explicitement rapportés.",
    "stimulus": "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route. Elles ont aussi bénéficié d’un appui commercial durant la même période. L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention. Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique.",
    "sentences": [
      "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route.",
      "Elles ont aussi bénéficié d’un appui commercial durant la même période.",
      "L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention.",
      "Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique."
    ],
    "trap": "causality",
    "rule": "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
    "hint": "Repère la chronologie effectivement observée. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0
    ],
    "why": [
      "Le changement et sa chronologie sont explicitement rapportés.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
      "Le changement et sa chronologie sont explicitement rapportés."
    ]
  },
  {
    "id": "mastery-v-crops-1",
    "family": "mastery-v-crops",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’étude isole l’effet propre de la route sur les ventes.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Elle indique précisément qu’elle n’isole pas l’effet de chaque intervention.",
    "stimulus": "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route. Elles ont aussi bénéficié d’un appui commercial durant la même période. L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention. Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique.",
    "sentences": [
      "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route.",
      "Elles ont aussi bénéficié d’un appui commercial durant la même période.",
      "L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention.",
      "Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique."
    ],
    "trap": "causality",
    "rule": "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
    "hint": "Repère la méthode de l’étude. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Elle indique précisément qu’elle n’isole pas l’effet de chaque intervention.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
      "Elle indique précisément qu’elle n’isole pas l’effet de chaque intervention."
    ]
  },
  {
    "id": "mastery-v-crops-2",
    "family": "mastery-v-crops",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Sans la route, les ventes ne se seraient pas améliorées.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Le scénario sans route n’a pas été observé ; l’appui commercial ou d’autres facteurs peuvent jouer.",
    "stimulus": "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route. Elles ont aussi bénéficié d’un appui commercial durant la même période. L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention. Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique.",
    "sentences": [
      "Les coopératives observées ont enregistré une amélioration de leurs ventes après l’ouverture d’une route.",
      "Elles ont aussi bénéficié d’un appui commercial durant la même période.",
      "L’étude ne possède pas de groupe de comparaison et n’isole pas l’effet de chaque intervention.",
      "Elle décrit les changements observés, sans attribuer la hausse des ventes à une cause unique."
    ],
    "trap": "causality",
    "rule": "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
    "hint": "Repère le scénario contrefactuel absent. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Le scénario sans route n’a pas été observé ; l’appui commercial ou d’autres facteurs peuvent jouer."
    ],
    "steps": [
      "Une succession temporelle et une association n’établissent pas à elles seules une causalité.",
      "Le scénario sans route n’a pas été observé ; l’appui commercial ou d’autres facteurs peuvent jouer."
    ]
  },
  {
    "id": "mastery-v-deadline-0",
    "family": "mastery-v-deadline",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Aru doit être examiné selon la règle.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "L’arrivée avant clôture suffit à l’examen, même si l’accusé est tardif.",
    "stimulus": "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard. Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection. Le dossier Aru est arrivé avant la clôture et son accusé est parti après. Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée.",
    "sentences": [
      "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard.",
      "Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection.",
      "Le dossier Aru est arrivé avant la clôture et son accusé est parti après.",
      "Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée."
    ],
    "trap": "chronology",
    "rule": "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
    "hint": "Repère l’heure d’arrivée plutôt que celle de l’accusé. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’arrivée avant clôture suffit à l’examen, même si l’accusé est tardif.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
      "L’arrivée avant clôture suffit à l’examen, même si l’accusé est tardif."
    ]
  },
  {
    "id": "mastery-v-deadline-1",
    "family": "mastery-v-deadline",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’accusé de Beli confirme sa sélection.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Un accusé ne confirme ni recevabilité ni sélection.",
    "stimulus": "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard. Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection. Le dossier Aru est arrivé avant la clôture et son accusé est parti après. Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée.",
    "sentences": [
      "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard.",
      "Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection.",
      "Le dossier Aru est arrivé avant la clôture et son accusé est parti après.",
      "Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée."
    ],
    "trap": "chronology",
    "rule": "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
    "hint": "Repère ce que confirme un accusé. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      3
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Un accusé ne confirme ni recevabilité ni sélection.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
      "Un accusé ne confirme ni recevabilité ni sélection."
    ]
  },
  {
    "id": "mastery-v-deadline-2",
    "family": "mastery-v-deadline",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Beli est arrivé avant la clôture.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "L’accusé confirme l’arrivée mais aucune heure n’est donnée.",
    "stimulus": "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard. Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection. Le dossier Aru est arrivé avant la clôture et son accusé est parti après. Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée.",
    "sentences": [
      "Les candidatures reçues avant la clôture sont examinées, y compris lorsque leur accusé de réception est envoyé plus tard.",
      "Tout accusé de réception confirme seulement que le dossier est arrivé ; il ne confirme ni recevabilité ni sélection.",
      "Le dossier Aru est arrivé avant la clôture et son accusé est parti après.",
      "Le dossier Beli a reçu un accusé, mais son heure d’arrivée n’est pas indiquée."
    ],
    "trap": "chronology",
    "rule": "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
    "hint": "Repère l’information temporelle manquante. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "L’accusé confirme l’arrivée mais aucune heure n’est donnée."
    ],
    "steps": [
      "Distingue date de réception, date de traitement et décision : elles ne sont pas interchangeables.",
      "L’accusé confirme l’arrivée mais aucune heure n’est donnée."
    ]
  },
  {
    "id": "mastery-v-risk-0",
    "family": "mastery-v-risk",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Dalo a fait l’objet d’une revue supplémentaire.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La revue est nécessaire pour approuver tout projet à risque élevé.",
    "stimulus": "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire. Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité. Le projet Dalo est approuvé et classé à risque élevé. Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée.",
    "sentences": [
      "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire.",
      "Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité.",
      "Le projet Dalo est approuvé et classé à risque élevé.",
      "Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée."
    ],
    "trap": "converse",
    "rule": "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
    "hint": "Repère la condition d’approbation. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "La revue est nécessaire pour approuver tout projet à risque élevé.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
      "La revue est nécessaire pour approuver tout projet à risque élevé."
    ]
  },
  {
    "id": "mastery-v-risk-1",
    "family": "mastery-v-risk",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Un projet à risque modéré ne peut jamais subir une revue supplémentaire.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le passage prévoit explicitement cette possibilité sur décision du comité.",
    "stimulus": "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire. Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité. Le projet Dalo est approuvé et classé à risque élevé. Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée.",
    "sentences": [
      "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire.",
      "Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité.",
      "Le projet Dalo est approuvé et classé à risque élevé.",
      "Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée."
    ],
    "trap": "converse",
    "rule": "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
    "hint": "Repère l’exception expressément autorisée. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le passage prévoit explicitement cette possibilité sur décision du comité.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
      "Le passage prévoit explicitement cette possibilité sur décision du comité."
    ]
  },
  {
    "id": "mastery-v-risk-2",
    "family": "mastery-v-risk",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Enu est classé à risque élevé.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Une revue supplémentaire peut aussi concerner un risque modéré ; elle ne permet pas d’inférer la catégorie.",
    "stimulus": "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire. Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité. Le projet Dalo est approuvé et classé à risque élevé. Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée.",
    "sentences": [
      "Aucun projet classé à risque élevé ne peut être approuvé sans une revue supplémentaire.",
      "Un projet à risque modéré peut également faire l’objet de cette revue, sur décision du comité.",
      "Le projet Dalo est approuvé et classé à risque élevé.",
      "Le projet Enu a fait l’objet d’une revue supplémentaire ; sa catégorie de risque n’est pas communiquée."
    ],
    "trap": "converse",
    "rule": "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
    "hint": "Repère la réciproque de la règle. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Une revue supplémentaire peut aussi concerner un risque modéré ; elle ne permet pas d’inférer la catégorie."
    ],
    "steps": [
      "De « risque élevé → revue » on ne déduit pas « revue → risque élevé ».",
      "Une revue supplémentaire peut aussi concerner un risque modéré ; elle ne permet pas d’inférer la catégorie."
    ]
  },
  {
    "id": "mastery-v-digital-0",
    "family": "mastery-v-digital",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : La pièce d’identité de Fara n’est pas absente.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Si elle était absente, Fara serait automatiquement en attente. Il ne l’est pas et aucune exception n’a eu lieu.",
    "stimulus": "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente. Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé. Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception. Le dossier Gani est en attente, sans indication de motif.",
    "sentences": [
      "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente.",
      "Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé.",
      "Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception.",
      "Le dossier Gani est en attente, sans indication de motif."
    ],
    "trap": "contrapositive",
    "rule": "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
    "hint": "Repère la contraposée et l’absence d’exception. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "Si elle était absente, Fara serait automatiquement en attente. Il ne l’est pas et aucune exception n’a eu lieu.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
      "Si elle était absente, Fara serait automatiquement en attente. Il ne l’est pas et aucune exception n’a eu lieu."
    ]
  },
  {
    "id": "mastery-v-digital-1",
    "family": "mastery-v-digital",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : La pièce d’identité de Fara est absente.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Cette absence imposerait une attente, contraire au statut donné.",
    "stimulus": "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente. Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé. Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception. Le dossier Gani est en attente, sans indication de motif.",
    "sentences": [
      "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente.",
      "Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé.",
      "Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception.",
      "Le dossier Gani est en attente, sans indication de motif."
    ],
    "trap": "contrapositive",
    "rule": "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
    "hint": "Repère la conséquence obligatoire d’une pièce absente. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Cette absence imposerait une attente, contraire au statut donné.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
      "Cette absence imposerait une attente, contraire au statut donné."
    ]
  },
  {
    "id": "mastery-v-digital-2",
    "family": "mastery-v-digital",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : La pièce d’identité de Gani est absente.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Son attente peut aussi provenir d’un contrôle externe inachevé ; le motif manque.",
    "stimulus": "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente. Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé. Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception. Le dossier Gani est en attente, sans indication de motif.",
    "sentences": [
      "Le système met automatiquement en attente tout dossier dont la pièce d’identité est absente.",
      "Il peut aussi mettre un dossier en attente lorsqu’un contrôle externe n’est pas terminé.",
      "Le dossier Fara n’est pas en attente et la règle automatique a fonctionné sans exception.",
      "Le dossier Gani est en attente, sans indication de motif."
    ],
    "trap": "contrapositive",
    "rule": "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
    "hint": "Repère les deux motifs possibles. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Son attente peut aussi provenir d’un contrôle externe inachevé ; le motif manque."
    ],
    "steps": [
      "Si A impose B, alors non-B exclut A lorsque la règle s’applique sans exception.",
      "Son attente peut aussi provenir d’un contrôle externe inachevé ; le motif manque."
    ]
  },
  {
    "id": "mastery-v-scope2-0",
    "family": "mastery-v-scope2",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Nako est inclus dans le volet de formation.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Le volet de formation concerne aussi Nako.",
    "stimulus": "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero. Un volet de formation distinct concerne aussi le pays Nako. Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires. Il ne précise pas si une même entrepreneure peut participer aux deux volets.",
    "sentences": [
      "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero.",
      "Un volet de formation distinct concerne aussi le pays Nako.",
      "Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires.",
      "Il ne précise pas si une même entrepreneure peut participer aux deux volets."
    ],
    "trap": "scope",
    "rule": "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
    "hint": "Repère le volet nommé dans la phrase. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "Le volet de formation concerne aussi Nako.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
      "Le volet de formation concerne aussi Nako."
    ]
  },
  {
    "id": "mastery-v-scope2-1",
    "family": "mastery-v-scope2",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Nako figure parmi les pays du volet de financement commercial décrit.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Ce volet concerne Luma et Vero ; Nako est mentionné dans le volet de formation distinct.",
    "stimulus": "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero. Un volet de formation distinct concerne aussi le pays Nako. Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires. Il ne précise pas si une même entrepreneure peut participer aux deux volets.",
    "sentences": [
      "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero.",
      "Un volet de formation distinct concerne aussi le pays Nako.",
      "Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires.",
      "Il ne précise pas si une même entrepreneure peut participer aux deux volets."
    ],
    "trap": "scope",
    "rule": "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
    "hint": "Repère les listes de pays de chaque volet. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Ce volet concerne Luma et Vero ; Nako est mentionné dans le volet de formation distinct.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
      "Ce volet concerne Luma et Vero ; Nako est mentionné dans le volet de formation distinct."
    ]
  },
  {
    "id": "mastery-v-scope2-2",
    "family": "mastery-v-scope2",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les deux volets concernent des bénéficiaires tous différents.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Le passage ne précise pas le chevauchement entre les personnes.",
    "stimulus": "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero. Un volet de formation distinct concerne aussi le pays Nako. Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires. Il ne précise pas si une même entrepreneure peut participer aux deux volets.",
    "sentences": [
      "Le financement commercial du programme concerne uniquement les entreprises des pays Luma et Vero.",
      "Un volet de formation distinct concerne aussi le pays Nako.",
      "Le communiqué fixe des cibles pour chaque volet, sans identifier les personnes bénéficiaires.",
      "Il ne précise pas si une même entrepreneure peut participer aux deux volets."
    ],
    "trap": "scope",
    "rule": "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
    "hint": "Repère le chevauchement non renseigné. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Le passage ne précise pas le chevauchement entre les personnes."
    ],
    "steps": [
      "Ne fusionne pas deux volets ni leurs populations sans preuve de leur recouvrement.",
      "Le passage ne précise pas le chevauchement entre les personnes."
    ]
  },
  {
    "id": "mastery-v-complaints-0",
    "family": "mastery-v-complaints",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le rapport considère une meilleure facilité de signalement comme une explication possible.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Cette explication figure explicitement parmi les deux hypothèses.",
    "stimulus": "Les signalements ont augmenté après la création d’un canal de plainte anonyme. Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes. Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler. Il ne privilégie pas l’une de ces hypothèses.",
    "sentences": [
      "Les signalements ont augmenté après la création d’un canal de plainte anonyme.",
      "Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes.",
      "Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler.",
      "Il ne privilégie pas l’une de ces hypothèses."
    ],
    "trap": "observation",
    "rule": "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
    "hint": "Repère le statut d’hypothèse. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "Cette explication figure explicitement parmi les deux hypothèses.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
      "Cette explication figure explicitement parmi les deux hypothèses."
    ]
  },
  {
    "id": "mastery-v-complaints-1",
    "family": "mastery-v-complaints",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le rapport conclut que les incidents réels ont augmenté.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Il ne peut pas comparer leur fréquence et ne privilégie pas l’hypothèse d’augmentation.",
    "stimulus": "Les signalements ont augmenté après la création d’un canal de plainte anonyme. Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes. Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler. Il ne privilégie pas l’une de ces hypothèses.",
    "sentences": [
      "Les signalements ont augmenté après la création d’un canal de plainte anonyme.",
      "Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes.",
      "Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler.",
      "Il ne privilégie pas l’une de ces hypothèses."
    ],
    "trap": "observation",
    "rule": "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
    "hint": "Repère la conclusion effectivement formulée. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      3
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Il ne peut pas comparer leur fréquence et ne privilégie pas l’hypothèse d’augmentation.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
      "Il ne peut pas comparer leur fréquence et ne privilégie pas l’hypothèse d’augmentation."
    ]
  },
  {
    "id": "mastery-v-complaints-2",
    "family": "mastery-v-complaints",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les incidents réels ont augmenté.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Les données ne permettent pas de trancher entre évolution des incidents et évolution du signalement.",
    "stimulus": "Les signalements ont augmenté après la création d’un canal de plainte anonyme. Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes. Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler. Il ne privilégie pas l’une de ces hypothèses.",
    "sentences": [
      "Les signalements ont augmenté après la création d’un canal de plainte anonyme.",
      "Les enquêtes achevées n’ont pas encore permis de comparer la fréquence réelle des incidents entre les deux périodes.",
      "Le rapport avance deux hypothèses : davantage d’incidents ou davantage de facilité à les signaler.",
      "Il ne privilégie pas l’une de ces hypothèses."
    ],
    "trap": "observation",
    "rule": "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
    "hint": "Repère la différence entre observation et explication. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Les données ne permettent pas de trancher entre évolution des incidents et évolution du signalement."
    ],
    "steps": [
      "Une hausse des signalements ne prouve pas une hausse des incidents réels.",
      "Les données ne permettent pas de trancher entre évolution des incidents et évolution du signalement."
    ]
  },
  {
    "id": "mastery-v-terms-0",
    "family": "mastery-v-terms",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : À la date du rapport, aucun décaissement conforme à cette procédure n’a eu lieu.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La signature est nécessaire au décaissement et aucune convention n’est signée.",
    "stimulus": "Le comité a approuvé une enveloppe de financement pour le programme. La signature de la convention reste à effectuer avant tout décaissement. Aucune convention n’a encore été signée à la date du rapport. Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales.",
    "sentences": [
      "Le comité a approuvé une enveloppe de financement pour le programme.",
      "La signature de la convention reste à effectuer avant tout décaissement.",
      "Aucune convention n’a encore été signée à la date du rapport.",
      "Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales."
    ],
    "trap": "stages",
    "rule": "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
    "hint": "Repère la condition nécessaire non remplie. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "La signature est nécessaire au décaissement et aucune convention n’est signée.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
      "La signature est nécessaire au décaissement et aucune convention n’est signée."
    ]
  },
  {
    "id": "mastery-v-terms-1",
    "family": "mastery-v-terms",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’approbation de l’enveloppe signifie que la convention est déjà signée.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le passage dit expressément qu’aucune convention n’est encore signée.",
    "stimulus": "Le comité a approuvé une enveloppe de financement pour le programme. La signature de la convention reste à effectuer avant tout décaissement. Aucune convention n’a encore été signée à la date du rapport. Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales.",
    "sentences": [
      "Le comité a approuvé une enveloppe de financement pour le programme.",
      "La signature de la convention reste à effectuer avant tout décaissement.",
      "Aucune convention n’a encore été signée à la date du rapport.",
      "Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales."
    ],
    "trap": "stages",
    "rule": "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
    "hint": "Repère la distinction entre approbation et signature. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le passage dit expressément qu’aucune convention n’est encore signée.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
      "Le passage dit expressément qu’aucune convention n’est encore signée."
    ]
  },
  {
    "id": "mastery-v-terms-2",
    "family": "mastery-v-terms",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Toutes les autorisations locales ont été obtenues.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Elles sont requises pour commencer les travaux, mais leur obtention n’est pas rapportée.",
    "stimulus": "Le comité a approuvé une enveloppe de financement pour le programme. La signature de la convention reste à effectuer avant tout décaissement. Aucune convention n’a encore été signée à la date du rapport. Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales.",
    "sentences": [
      "Le comité a approuvé une enveloppe de financement pour le programme.",
      "La signature de la convention reste à effectuer avant tout décaissement.",
      "Aucune convention n’a encore été signée à la date du rapport.",
      "Les travaux pourront commencer après mobilisation des fonds et obtention des autorisations locales."
    ],
    "trap": "stages",
    "rule": "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
    "hint": "Repère le statut non précisé des autorisations. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Elles sont requises pour commencer les travaux, mais leur obtention n’est pas rapportée."
    ],
    "steps": [
      "Approbation, signature, décaissement, mise en œuvre et résultats sont des étapes distinctes.",
      "Elles sont requises pour commencer les travaux, mais leur obtention n’est pas rapportée."
    ]
  },
  {
    "id": "mastery-v-only-0",
    "family": "mastery-v-only",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Hani a suivi la formation de sécurité.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Modifier implique habilitation, qui implique formation ; aucune dérogation n’existe.",
    "stimulus": "Seuls les agents habilités peuvent modifier un budget dans le système. Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation. L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation. Aucune dérogation à la règle n’a été accordée.",
    "sentences": [
      "Seuls les agents habilités peuvent modifier un budget dans le système.",
      "Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation.",
      "L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation.",
      "Aucune dérogation à la règle n’a été accordée."
    ],
    "trap": "only",
    "rule": "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
    "hint": "Repère la chaîne modification → habilitation → formation. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1,
      2,
      3
    ],
    "why": [
      "Modifier implique habilitation, qui implique formation ; aucune dérogation n’existe.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
      "Modifier implique habilitation, qui implique formation ; aucune dérogation n’existe."
    ]
  },
  {
    "id": "mastery-v-only-1",
    "family": "mastery-v-only",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Tout agent formé est habilité à modifier un budget.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Des agents non habilités ont aussi suivi la formation : ils contredisent « tout agent formé est habilité ».",
    "stimulus": "Seuls les agents habilités peuvent modifier un budget dans le système. Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation. L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation. Aucune dérogation à la règle n’a été accordée.",
    "sentences": [
      "Seuls les agents habilités peuvent modifier un budget dans le système.",
      "Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation.",
      "L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation.",
      "Aucune dérogation à la règle n’a été accordée."
    ],
    "trap": "only",
    "rule": "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
    "hint": "Repère les agents formés hors du groupe habilité. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Des agents non habilités ont aussi suivi la formation : ils contredisent « tout agent formé est habilité ».",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
      "Des agents non habilités ont aussi suivi la formation : ils contredisent « tout agent formé est habilité »."
    ]
  },
  {
    "id": "mastery-v-only-2",
    "family": "mastery-v-only",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Iru est habilité à modifier un budget.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Sa formation seule n’établit pas son habilitation.",
    "stimulus": "Seuls les agents habilités peuvent modifier un budget dans le système. Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation. L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation. Aucune dérogation à la règle n’a été accordée.",
    "sentences": [
      "Seuls les agents habilités peuvent modifier un budget dans le système.",
      "Tous les agents habilités ont suivi la formation de sécurité, mais des agents non habilités ont également suivi cette formation.",
      "L’agent Hani a modifié un budget selon la procédure ; l’agent Iru a seulement suivi la formation.",
      "Aucune dérogation à la règle n’a été accordée."
    ],
    "trap": "only",
    "rule": "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
    "hint": "Repère la réciproque injustifiée. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Sa formation seule n’établit pas son habilitation."
    ],
    "steps": [
      "« Seuls les A peuvent B » signifie B → A ; le sens de la flèche compte.",
      "Sa formation seule n’établit pas son habilitation."
    ]
  },
  {
    "id": "mastery-v-exceptions-0",
    "family": "mastery-v-exceptions",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Jora relève de l’exception autorisée.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Elle a une autorisation écrite d’urgence pendant une alerte.",
    "stimulus": "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue. La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence. La visite Kelo a eu lieu pendant une alerte selon les règles applicables. Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes.",
    "sentences": [
      "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue.",
      "La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence.",
      "La visite Kelo a eu lieu pendant une alerte selon les règles applicables.",
      "Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes."
    ],
    "trap": "exception",
    "rule": "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
    "hint": "Repère l’exception explicite. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "Elle a une autorisation écrite d’urgence pendant une alerte.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
      "Elle a une autorisation écrite d’urgence pendant une alerte."
    ]
  },
  {
    "id": "mastery-v-exceptions-1",
    "family": "mastery-v-exceptions",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Aucune visite ne peut avoir lieu pendant une alerte.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Jora fournit un contre-exemple permis par l’exception.",
    "stimulus": "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue. La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence. La visite Kelo a eu lieu pendant une alerte selon les règles applicables. Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes.",
    "sentences": [
      "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue.",
      "La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence.",
      "La visite Kelo a eu lieu pendant une alerte selon les règles applicables.",
      "Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes."
    ],
    "trap": "exception",
    "rule": "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
    "hint": "Repère la généralisation qui supprime l’exception. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Jora fournit un contre-exemple permis par l’exception.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
      "Jora fournit un contre-exemple permis par l’exception."
    ]
  },
  {
    "id": "mastery-v-exceptions-2",
    "family": "mastery-v-exceptions",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : D’autres visites ont eu lieu en dehors des alertes.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Le rapport ne dit pas si de telles visites ont eu lieu.",
    "stimulus": "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue. La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence. La visite Kelo a eu lieu pendant une alerte selon les règles applicables. Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes.",
    "sentences": [
      "Les visites sont suspendues pendant les alertes météorologiques, sauf si une autorisation écrite d’urgence a été obtenue.",
      "La visite Jora a eu lieu pendant une alerte, avec une autorisation écrite d’urgence.",
      "La visite Kelo a eu lieu pendant une alerte selon les règles applicables.",
      "Le rapport n’indique pas si d’autres visites ont eu lieu en dehors des alertes."
    ],
    "trap": "exception",
    "rule": "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
    "hint": "Repère la période non décrite. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Le rapport ne dit pas si de telles visites ont eu lieu."
    ],
    "steps": [
      "Une exception explicite empêche de transformer une règle générale en interdiction absolue.",
      "Le rapport ne dit pas si de telles visites ont eu lieu."
    ]
  },
  {
    "id": "mastery-v-allnot-0",
    "family": "mastery-v-allnot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Au moins un site n’a pas reçu son équipement.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Les équipements ne sont pas livrés à tous les sites : au moins un site n’a pas reçu.",
    "stimulus": "Le rapport indique que les équipements n’ont pas été livrés à tous les sites. Il précise qu’au moins un site équipé est situé en zone rurale. Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone. Un équipement livré est comptabilisé même s’il n’a pas encore été installé.",
    "sentences": [
      "Le rapport indique que les équipements n’ont pas été livrés à tous les sites.",
      "Il précise qu’au moins un site équipé est situé en zone rurale.",
      "Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone.",
      "Un équipement livré est comptabilisé même s’il n’a pas encore été installé."
    ],
    "trap": "negation",
    "rule": "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
    "hint": "Repère la différence entre « pas tous » et « aucun ». Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0
    ],
    "why": [
      "Les équipements ne sont pas livrés à tous les sites : au moins un site n’a pas reçu.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
      "Les équipements ne sont pas livrés à tous les sites : au moins un site n’a pas reçu."
    ]
  },
  {
    "id": "mastery-v-allnot-1",
    "family": "mastery-v-allnot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Aucun site n’a reçu d’équipement.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Il existe au moins un site équipé en zone rurale.",
    "stimulus": "Le rapport indique que les équipements n’ont pas été livrés à tous les sites. Il précise qu’au moins un site équipé est situé en zone rurale. Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone. Un équipement livré est comptabilisé même s’il n’a pas encore été installé.",
    "sentences": [
      "Le rapport indique que les équipements n’ont pas été livrés à tous les sites.",
      "Il précise qu’au moins un site équipé est situé en zone rurale.",
      "Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone.",
      "Un équipement livré est comptabilisé même s’il n’a pas encore été installé."
    ],
    "trap": "negation",
    "rule": "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
    "hint": "Repère l’existence d’un site équipé. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Il existe au moins un site équipé en zone rurale.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
      "Il existe au moins un site équipé en zone rurale."
    ]
  },
  {
    "id": "mastery-v-allnot-2",
    "family": "mastery-v-allnot",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tous les sites non équipés sont urbains.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "La localisation des sites non équipés n’est pas donnée.",
    "stimulus": "Le rapport indique que les équipements n’ont pas été livrés à tous les sites. Il précise qu’au moins un site équipé est situé en zone rurale. Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone. Un équipement livré est comptabilisé même s’il n’a pas encore été installé.",
    "sentences": [
      "Le rapport indique que les équipements n’ont pas été livrés à tous les sites.",
      "Il précise qu’au moins un site équipé est situé en zone rurale.",
      "Il ne fournit ni la liste des sites non équipés ni la répartition complète par zone.",
      "Un équipement livré est comptabilisé même s’il n’a pas encore été installé."
    ],
    "trap": "negation",
    "rule": "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
    "hint": "Repère la population non décrite. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "La localisation des sites non équipés n’est pas donnée."
    ],
    "steps": [
      "« Pas tous » ne veut pas dire « aucun ». Un groupe peut contenir à la fois des cas positifs et négatifs.",
      "La localisation des sites non équipés n’est pas donnée."
    ]
  },
  {
    "id": "mastery-v-contracts-0",
    "family": "mastery-v-contracts",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Le contrat de Lero doit être renouvelé selon la règle.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Les deux conditions suffisantes sont réunies.",
    "stimulus": "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés. Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister. Le prestataire Lero a respecté les deux conditions. Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié.",
    "sentences": [
      "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés.",
      "Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister.",
      "Le prestataire Lero a respecté les deux conditions.",
      "Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié."
    ],
    "trap": "sufficient",
    "rule": "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
    "hint": "Repère la conjonction suffisante. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1,
      2
    ],
    "why": [
      "Les deux conditions suffisantes sont réunies.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
      "Les deux conditions suffisantes sont réunies."
    ]
  },
  {
    "id": "mastery-v-contracts-1",
    "family": "mastery-v-contracts",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Lero n’a pas respecté les objectifs techniques.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le texte dit qu’il a respecté les deux conditions, dont les objectifs techniques.",
    "stimulus": "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés. Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister. Le prestataire Lero a respecté les deux conditions. Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié.",
    "sentences": [
      "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés.",
      "Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister.",
      "Le prestataire Lero a respecté les deux conditions.",
      "Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié."
    ],
    "trap": "sufficient",
    "rule": "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
    "hint": "Repère la donnée explicite sur Lero. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le texte dit qu’il a respecté les deux conditions, dont les objectifs techniques.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
      "Le texte dit qu’il a respecté les deux conditions, dont les objectifs techniques."
    ]
  },
  {
    "id": "mastery-v-contracts-2",
    "family": "mastery-v-contracts",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Mavo a respecté le délai de réponse.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Un renouvellement peut résulter d’autres motifs ; on ne peut inverser la règle.",
    "stimulus": "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés. Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister. Le prestataire Lero a respecté les deux conditions. Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié.",
    "sentences": [
      "Le contrat de maintenance est renouvelé si les objectifs techniques et le délai de réponse ont tous deux été respectés.",
      "Dans cette règle, ces deux conditions réunies suffisent au renouvellement ; d’autres motifs de renouvellement peuvent exister.",
      "Le prestataire Lero a respecté les deux conditions.",
      "Le prestataire Mavo a obtenu un renouvellement, sans bilan détaillé publié."
    ],
    "trap": "sufficient",
    "rule": "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
    "hint": "Repère les autres motifs possibles. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Un renouvellement peut résulter d’autres motifs ; on ne peut inverser la règle."
    ],
    "steps": [
      "Une condition suffisante déclenche la conséquence ; la conséquence ne prouve pas à elle seule cette condition.",
      "Un renouvellement peut résulter d’autres motifs ; on ne peut inverser la règle."
    ]
  },
  {
    "id": "mastery-v-survey-0",
    "family": "mastery-v-survey",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Au moins un répondant insatisfait a demandé une assistance complémentaire.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "« Plusieurs » implique au moins un cas.",
    "stimulus": "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne. Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire. Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé. Le rapport présente séparément satisfaction déclarée et délai réel de traitement.",
    "sentences": [
      "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne.",
      "Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire.",
      "Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé.",
      "Le rapport présente séparément satisfaction déclarée et délai réel de traitement."
    ],
    "trap": "sampling",
    "rule": "La population répondante et la population totale ne sont pas équivalentes.",
    "hint": "Repère l’existence explicitement établie. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "« Plusieurs » implique au moins un cas.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "La population répondante et la population totale ne sont pas équivalentes.",
      "« Plusieurs » implique au moins un cas."
    ]
  },
  {
    "id": "mastery-v-survey-1",
    "family": "mastery-v-survey",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’enquête décrit l’opinion de tous les usagers.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Elle ne porte que sur certains répondants et n’établit pas l’opinion des non-participants.",
    "stimulus": "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne. Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire. Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé. Le rapport présente séparément satisfaction déclarée et délai réel de traitement.",
    "sentences": [
      "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne.",
      "Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire.",
      "Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé.",
      "Le rapport présente séparément satisfaction déclarée et délai réel de traitement."
    ],
    "trap": "sampling",
    "rule": "La population répondante et la population totale ne sont pas équivalentes.",
    "hint": "Repère le périmètre de l’enquête. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Elle ne porte que sur certains répondants et n’établit pas l’opinion des non-participants.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "La population répondante et la population totale ne sont pas équivalentes.",
      "Elle ne porte que sur certains répondants et n’établit pas l’opinion des non-participants."
    ]
  },
  {
    "id": "mastery-v-survey-2",
    "family": "mastery-v-survey",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les usagers non participants sont plus satisfaits que les répondants.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Aucune opinion des non-participants n’est établie.",
    "stimulus": "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne. Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire. Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé. Le rapport présente séparément satisfaction déclarée et délai réel de traitement.",
    "sentences": [
      "L’enquête de satisfaction ne porte que sur les usagers ayant accepté de répondre en ligne.",
      "Parmi les répondants, plusieurs usagers insatisfaits ont demandé une assistance complémentaire.",
      "Les réponses ne permettent pas d’établir l’opinion des usagers qui n’ont pas participé.",
      "Le rapport présente séparément satisfaction déclarée et délai réel de traitement."
    ],
    "trap": "sampling",
    "rule": "La population répondante et la population totale ne sont pas équivalentes.",
    "hint": "Repère la comparaison sans données. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Aucune opinion des non-participants n’est établie."
    ],
    "steps": [
      "La population répondante et la population totale ne sont pas équivalentes.",
      "Aucune opinion des non-participants n’est établie."
    ]
  },
  {
    "id": "mastery-v-dates-0",
    "family": "mastery-v-dates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : La mission a précédé la décision du comité.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La mission précède la validation finale, laquelle précède la décision.",
    "stimulus": "La note technique a été rédigée avant la mission de terrain. Sa version finale a été validée après la mission et avant la décision du comité. Le communiqué est paru après cette décision. Aucune date ne décrit les consultations antérieures à la note technique.",
    "sentences": [
      "La note technique a été rédigée avant la mission de terrain.",
      "Sa version finale a été validée après la mission et avant la décision du comité.",
      "Le communiqué est paru après cette décision.",
      "Aucune date ne décrit les consultations antérieures à la note technique."
    ],
    "trap": "chronology",
    "rule": "Compose uniquement les relations de précédence effectivement données.",
    "hint": "Repère la chaîne chronologique. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "La mission précède la validation finale, laquelle précède la décision.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Compose uniquement les relations de précédence effectivement données.",
      "La mission précède la validation finale, laquelle précède la décision."
    ]
  },
  {
    "id": "mastery-v-dates-1",
    "family": "mastery-v-dates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le communiqué est paru avant la mission.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Mission → validation → décision → communiqué : l’affirmation inverse cet ordre.",
    "stimulus": "La note technique a été rédigée avant la mission de terrain. Sa version finale a été validée après la mission et avant la décision du comité. Le communiqué est paru après cette décision. Aucune date ne décrit les consultations antérieures à la note technique.",
    "sentences": [
      "La note technique a été rédigée avant la mission de terrain.",
      "Sa version finale a été validée après la mission et avant la décision du comité.",
      "Le communiqué est paru après cette décision.",
      "Aucune date ne décrit les consultations antérieures à la note technique."
    ],
    "trap": "chronology",
    "rule": "Compose uniquement les relations de précédence effectivement données.",
    "hint": "Repère les relations de précédence. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Mission → validation → décision → communiqué : l’affirmation inverse cet ordre.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Compose uniquement les relations de précédence effectivement données.",
      "Mission → validation → décision → communiqué : l’affirmation inverse cet ordre."
    ]
  },
  {
    "id": "mastery-v-dates-2",
    "family": "mastery-v-dates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les consultations ont précédé la rédaction de la note.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Aucune date des consultations n’est donnée.",
    "stimulus": "La note technique a été rédigée avant la mission de terrain. Sa version finale a été validée après la mission et avant la décision du comité. Le communiqué est paru après cette décision. Aucune date ne décrit les consultations antérieures à la note technique.",
    "sentences": [
      "La note technique a été rédigée avant la mission de terrain.",
      "Sa version finale a été validée après la mission et avant la décision du comité.",
      "Le communiqué est paru après cette décision.",
      "Aucune date ne décrit les consultations antérieures à la note technique."
    ],
    "trap": "chronology",
    "rule": "Compose uniquement les relations de précédence effectivement données.",
    "hint": "Repère l’événement sans date. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Aucune date des consultations n’est donnée."
    ],
    "steps": [
      "Compose uniquement les relations de précédence effectivement données.",
      "Aucune date des consultations n’est donnée."
    ]
  },
  {
    "id": "mastery-v-guarantee-0",
    "family": "mastery-v-guarantee",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le prêteur doit encore analyser la capacité de remboursement.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La garantie ne supprime pas cette vérification.",
    "stimulus": "La garantie réduit une partie du risque supporté par le prêteur. Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier. Le financement garanti reste soumis à la vérification de la capacité de remboursement. Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie.",
    "sentences": [
      "La garantie réduit une partie du risque supporté par le prêteur.",
      "Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier.",
      "Le financement garanti reste soumis à la vérification de la capacité de remboursement.",
      "Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie."
    ],
    "trap": "scope",
    "rule": "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
    "hint": "Repère l’obligation qui demeure. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "La garantie ne supprime pas cette vérification.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
      "La garantie ne supprime pas cette vérification."
    ]
  },
  {
    "id": "mastery-v-guarantee-1",
    "family": "mastery-v-guarantee",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le financement garanti ne présente plus aucun risque.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le texte indique que tous les risques ne sont pas couverts.",
    "stimulus": "La garantie réduit une partie du risque supporté par le prêteur. Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier. Le financement garanti reste soumis à la vérification de la capacité de remboursement. Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie.",
    "sentences": [
      "La garantie réduit une partie du risque supporté par le prêteur.",
      "Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier.",
      "Le financement garanti reste soumis à la vérification de la capacité de remboursement.",
      "Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie."
    ],
    "trap": "scope",
    "rule": "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
    "hint": "Repère la couverture partielle. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le texte indique que tous les risques ne sont pas couverts.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
      "Le texte indique que tous les risques ne sont pas couverts."
    ]
  },
  {
    "id": "mastery-v-guarantee-2",
    "family": "mastery-v-guarantee",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le taux d’intérêt a baissé après l’octroi de la garantie.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Aucune comparaison de taux n’est fournie.",
    "stimulus": "La garantie réduit une partie du risque supporté par le prêteur. Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier. Le financement garanti reste soumis à la vérification de la capacité de remboursement. Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie.",
    "sentences": [
      "La garantie réduit une partie du risque supporté par le prêteur.",
      "Elle ne couvre pas tous les risques du projet et n’exonère pas le prêteur de l’analyse du dossier.",
      "Le financement garanti reste soumis à la vérification de la capacité de remboursement.",
      "Le rapport ne compare pas les taux d’intérêt avant et après l’octroi de la garantie."
    ],
    "trap": "scope",
    "rule": "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
    "hint": "Repère le résultat financier non observé. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Aucune comparaison de taux n’est fournie."
    ],
    "steps": [
      "Un mécanisme qui réduit un risque ne supprime pas nécessairement tous les risques.",
      "Aucune comparaison de taux n’est fournie."
    ]
  },
  {
    "id": "mastery-v-units-0",
    "family": "mastery-v-units",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : La livraison ne garantit pas que le centre soit opérationnel.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Au moins un centre livré attend encore l’installation.",
    "stimulus": "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel. Tous les centres opérationnels ont reçu du matériel. Au moins un centre ayant reçu du matériel attend encore l’installation. Le centre Neri a reçu du matériel, sans statut d’installation indiqué.",
    "sentences": [
      "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel.",
      "Tous les centres opérationnels ont reçu du matériel.",
      "Au moins un centre ayant reçu du matériel attend encore l’installation.",
      "Le centre Neri a reçu du matériel, sans statut d’installation indiqué."
    ],
    "trap": "stages",
    "rule": "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
    "hint": "Repère le contre-exemple explicite. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "Au moins un centre livré attend encore l’installation.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
      "Au moins un centre livré attend encore l’installation."
    ]
  },
  {
    "id": "mastery-v-units-1",
    "family": "mastery-v-units",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tous les centres livrés sont opérationnels.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le centre en attente d’installation contredit cette universalité.",
    "stimulus": "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel. Tous les centres opérationnels ont reçu du matériel. Au moins un centre ayant reçu du matériel attend encore l’installation. Le centre Neri a reçu du matériel, sans statut d’installation indiqué.",
    "sentences": [
      "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel.",
      "Tous les centres opérationnels ont reçu du matériel.",
      "Au moins un centre ayant reçu du matériel attend encore l’installation.",
      "Le centre Neri a reçu du matériel, sans statut d’installation indiqué."
    ],
    "trap": "stages",
    "rule": "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
    "hint": "Repère la distinction livraison / fonctionnement. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le centre en attente d’installation contredit cette universalité.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
      "Le centre en attente d’installation contredit cette universalité."
    ]
  },
  {
    "id": "mastery-v-units-2",
    "family": "mastery-v-units",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Neri est opérationnel.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Sa livraison est connue, mais son installation ne l’est pas.",
    "stimulus": "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel. Tous les centres opérationnels ont reçu du matériel. Au moins un centre ayant reçu du matériel attend encore l’installation. Le centre Neri a reçu du matériel, sans statut d’installation indiqué.",
    "sentences": [
      "Le tableau de suivi recense les centres ayant reçu du matériel et ceux dont le matériel est opérationnel.",
      "Tous les centres opérationnels ont reçu du matériel.",
      "Au moins un centre ayant reçu du matériel attend encore l’installation.",
      "Le centre Neri a reçu du matériel, sans statut d’installation indiqué."
    ],
    "trap": "stages",
    "rule": "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
    "hint": "Repère le statut d’installation absent. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Sa livraison est connue, mais son installation ne l’est pas."
    ],
    "steps": [
      "Un produit livré n’équivaut pas automatiquement à un service effectivement disponible.",
      "Sa livraison est connue, mais son installation ne l’est pas."
    ]
  },
  {
    "id": "mastery-v-andor-0",
    "family": "mastery-v-andor",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Peli remplit la condition pour recevoir les documents publics.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "L’inscription à la liste suffit, grâce au OU inclusif.",
    "stimulus": "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable. Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion. Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe. Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible.",
    "sentences": [
      "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable.",
      "Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion.",
      "Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe.",
      "Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible."
    ],
    "trap": "connective",
    "rule": "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
    "hint": "Repère la condition avec OU. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "L’inscription à la liste suffit, grâce au OU inclusif.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
      "L’inscription à la liste suffit, grâce au OU inclusif."
    ]
  },
  {
    "id": "mastery-v-andor-1",
    "family": "mastery-v-andor",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Ora remplit toutes les conditions pour participer à l’atelier.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Il manque l’accord du responsable, requis conjointement avec l’appartenance à l’équipe.",
    "stimulus": "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable. Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion. Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe. Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible.",
    "sentences": [
      "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable.",
      "Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion.",
      "Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe.",
      "Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible."
    ],
    "trap": "connective",
    "rule": "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
    "hint": "Repère la condition avec ET. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Il manque l’accord du responsable, requis conjointement avec l’appartenance à l’équipe.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
      "Il manque l’accord du responsable, requis conjointement avec l’appartenance à l’équipe."
    ]
  },
  {
    "id": "mastery-v-andor-2",
    "family": "mastery-v-andor",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Peli a effectivement reçu les documents publics.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Son éligibilité est établie, mais l’envoi effectif n’est pas renseigné.",
    "stimulus": "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable. Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion. Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe. Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible.",
    "sentences": [
      "Pour participer à l’atelier, il faut être membre de l’équipe et avoir obtenu l’accord du responsable.",
      "Pour recevoir les documents publics, il suffit d’être membre de l’équipe ou d’être inscrit à la liste de diffusion.",
      "Ora est membre de l’équipe, mais n’a pas obtenu l’accord. Peli est inscrite à la liste sans être membre de l’équipe.",
      "Le texte ne précise pas si les documents sont effectivement envoyés à chaque personne éligible."
    ],
    "trap": "connective",
    "rule": "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
    "hint": "Repère la différence éligibilité / action réalisée. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Son éligibilité est établie, mais l’envoi effectif n’est pas renseigné."
    ],
    "steps": [
      "ET exige les deux critères ; OU inclusif accepte au moins un. Une éligibilité n’est pas un événement réalisé.",
      "Son éligibilité est établie, mais l’envoi effectif n’est pas renseigné."
    ]
  },
  {
    "id": "mastery-v-comparison-0",
    "family": "mastery-v-comparison",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le rapport indique un délai moyen plus court pour Ralu.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Cette comparaison des moyennes est directement énoncée.",
    "stimulus": "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno. Le rapport ne décrit pas la durée de chaque dossier individuellement. Il note qu’un dossier de Ralu a subi un retard exceptionnel. Aucun résultat de satisfaction n’est fourni pour Seno.",
    "sentences": [
      "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno.",
      "Le rapport ne décrit pas la durée de chaque dossier individuellement.",
      "Il note qu’un dossier de Ralu a subi un retard exceptionnel.",
      "Aucun résultat de satisfaction n’est fourni pour Seno."
    ],
    "trap": "aggregation",
    "rule": "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
    "hint": "Repère le niveau agrégé de la comparaison. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0
    ],
    "why": [
      "Cette comparaison des moyennes est directement énoncée.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
      "Cette comparaison des moyennes est directement énoncée."
    ]
  },
  {
    "id": "mastery-v-comparison-1",
    "family": "mastery-v-comparison",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le rapport fournit la durée de chaque dossier.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Il dit expressément ne pas décrire les durées individuelles.",
    "stimulus": "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno. Le rapport ne décrit pas la durée de chaque dossier individuellement. Il note qu’un dossier de Ralu a subi un retard exceptionnel. Aucun résultat de satisfaction n’est fourni pour Seno.",
    "sentences": [
      "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno.",
      "Le rapport ne décrit pas la durée de chaque dossier individuellement.",
      "Il note qu’un dossier de Ralu a subi un retard exceptionnel.",
      "Aucun résultat de satisfaction n’est fourni pour Seno."
    ],
    "trap": "aggregation",
    "rule": "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
    "hint": "Repère le contenu effectivement disponible. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Il dit expressément ne pas décrire les durées individuelles.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
      "Il dit expressément ne pas décrire les durées individuelles."
    ]
  },
  {
    "id": "mastery-v-comparison-2",
    "family": "mastery-v-comparison",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Tout dossier de Ralu est traité plus vite que tout dossier de Seno.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Une différence de moyenne ne permet pas d’ordonner tous les dossiers individuellement ; aucune paire contraire n’est non plus donnée.",
    "stimulus": "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno. Le rapport ne décrit pas la durée de chaque dossier individuellement. Il note qu’un dossier de Ralu a subi un retard exceptionnel. Aucun résultat de satisfaction n’est fourni pour Seno.",
    "sentences": [
      "Le délai moyen de traitement du service Ralu est plus court que celui du service Seno.",
      "Le rapport ne décrit pas la durée de chaque dossier individuellement.",
      "Il note qu’un dossier de Ralu a subi un retard exceptionnel.",
      "Aucun résultat de satisfaction n’est fourni pour Seno."
    ],
    "trap": "aggregation",
    "rule": "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
    "hint": "Repère le passage injustifié de la moyenne à chaque cas. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      1
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Une différence de moyenne ne permet pas d’ordonner tous les dossiers individuellement ; aucune paire contraire n’est non plus donnée."
    ],
    "steps": [
      "Une comparaison agrégée ne suffit pas à une comparaison universelle des cas individuels.",
      "Une différence de moyenne ne permet pas d’ordonner tous les dossiers individuellement ; aucune paire contraire n’est non plus donnée."
    ]
  },
  {
    "id": "mastery-v-atleast-0",
    "family": "mastery-v-atleast",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : La complétude technique n’est pas suffisante pour être retenu.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Une proposition complète rejetée constitue un contre-exemple.",
    "stimulus": "Au moins une proposition a été rejetée malgré un dossier techniquement complet. Aucune proposition retenue n’avait de dossier incomplet. Les propositions retenues doivent encore satisfaire aux conditions de signature. Le texte ne donne pas le statut de signature de chaque proposition.",
    "sentences": [
      "Au moins une proposition a été rejetée malgré un dossier techniquement complet.",
      "Aucune proposition retenue n’avait de dossier incomplet.",
      "Les propositions retenues doivent encore satisfaire aux conditions de signature.",
      "Le texte ne donne pas le statut de signature de chaque proposition."
    ],
    "trap": "necessary",
    "rule": "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
    "hint": "Repère le contre-exemple à la suffisance. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0
    ],
    "why": [
      "Une proposition complète rejetée constitue un contre-exemple.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
      "Une proposition complète rejetée constitue un contre-exemple."
    ]
  },
  {
    "id": "mastery-v-atleast-1",
    "family": "mastery-v-atleast",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Au moins une proposition retenue avait un dossier incomplet.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le passage dit qu’aucune proposition retenue n’était incomplète.",
    "stimulus": "Au moins une proposition a été rejetée malgré un dossier techniquement complet. Aucune proposition retenue n’avait de dossier incomplet. Les propositions retenues doivent encore satisfaire aux conditions de signature. Le texte ne donne pas le statut de signature de chaque proposition.",
    "sentences": [
      "Au moins une proposition a été rejetée malgré un dossier techniquement complet.",
      "Aucune proposition retenue n’avait de dossier incomplet.",
      "Les propositions retenues doivent encore satisfaire aux conditions de signature.",
      "Le texte ne donne pas le statut de signature de chaque proposition."
    ],
    "trap": "necessary",
    "rule": "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
    "hint": "Repère l’exclusion explicite. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le passage dit qu’aucune proposition retenue n’était incomplète.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
      "Le passage dit qu’aucune proposition retenue n’était incomplète."
    ]
  },
  {
    "id": "mastery-v-atleast-2",
    "family": "mastery-v-atleast",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Toutes les propositions retenues ont déjà été signées.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Être retenu ne donne pas le statut de signature ; ces conditions restent distinctes.",
    "stimulus": "Au moins une proposition a été rejetée malgré un dossier techniquement complet. Aucune proposition retenue n’avait de dossier incomplet. Les propositions retenues doivent encore satisfaire aux conditions de signature. Le texte ne donne pas le statut de signature de chaque proposition.",
    "sentences": [
      "Au moins une proposition a été rejetée malgré un dossier techniquement complet.",
      "Aucune proposition retenue n’avait de dossier incomplet.",
      "Les propositions retenues doivent encore satisfaire aux conditions de signature.",
      "Le texte ne donne pas le statut de signature de chaque proposition."
    ],
    "trap": "necessary",
    "rule": "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
    "hint": "Repère l’étape de signature. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Être retenu ne donne pas le statut de signature ; ces conditions restent distinctes."
    ],
    "steps": [
      "Teste nécessité et suffisance séparément ; un contre-exemple détruit une implication universelle.",
      "Être retenu ne donne pas le statut de signature ; ces conditions restent distinctes."
    ]
  },
  {
    "id": "mastery-v-estimates-0",
    "family": "mastery-v-estimates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Les résultats présentés sont des attentes et non un bilan de travaux achevés.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "Le plan présente des résultats attendus alors que les travaux n’ont pas commencé.",
    "stimulus": "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées. Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé. Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté. Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones.",
    "sentences": [
      "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées.",
      "Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé.",
      "Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté.",
      "Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones."
    ],
    "trap": "attribution",
    "rule": "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
    "hint": "Repère le statut prévisionnel. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "Le plan présente des résultats attendus alors que les travaux n’ont pas commencé.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
      "Le plan présente des résultats attendus alors que les travaux n’ont pas commencé."
    ]
  },
  {
    "id": "mastery-v-estimates-1",
    "family": "mastery-v-estimates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Des raccordements issus de ces travaux sont déjà rapportés.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Aucun raccordement issu de ces travaux n’est rapporté.",
    "stimulus": "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées. Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé. Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté. Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones.",
    "sentences": [
      "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées.",
      "Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé.",
      "Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté.",
      "Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones."
    ],
    "trap": "attribution",
    "rule": "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
    "hint": "Repère l’attribution aux travaux concernés. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Aucun raccordement issu de ces travaux n’est rapporté.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
      "Aucun raccordement issu de ces travaux n’est rapporté."
    ]
  },
  {
    "id": "mastery-v-estimates-2",
    "family": "mastery-v-estimates",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Aucun habitant des zones ciblées ne dispose déjà de l’électricité.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "D’autres programmes ou infrastructures peuvent déjà desservir des habitants ; leur état n’est pas donné.",
    "stimulus": "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées. Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé. Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté. Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones.",
    "sentences": [
      "Le plan prévoit d’améliorer l’accès à l’électricité dans les zones ciblées.",
      "Le rapport présente les résultats attendus et précise que les travaux n’ont pas encore commencé.",
      "Aucun raccordement réalisé grâce à ces travaux n’est donc rapporté.",
      "Il ne dresse pas l’état des raccordements dus à d’autres programmes dans les mêmes zones."
    ],
    "trap": "attribution",
    "rule": "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
    "hint": "Repère les raccordements hors du programme. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "D’autres programmes ou infrastructures peuvent déjà desservir des habitants ; leur état n’est pas donné."
    ],
    "steps": [
      "Une absence de résultat attribué à un programme ne signifie pas absence de tout résultat dans la zone.",
      "D’autres programmes ou infrastructures peuvent déjà desservir des habitants ; leur état n’est pas donné."
    ]
  },
  {
    "id": "mastery-v-ruleupdate-0",
    "family": "mastery-v-ruleupdate",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Une remise numérique suffit pour Teri selon la règle révisée.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La date et la signature reconnue satisfont à la nouvelle condition.",
    "stimulus": "Avant la révision, tout dossier devait être remis en version papier. Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue. Le dossier Teri a été remis après la révision avec une signature électronique reconnue. Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit.",
    "sentences": [
      "Avant la révision, tout dossier devait être remis en version papier.",
      "Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue.",
      "Le dossier Teri a été remis après la révision avec une signature électronique reconnue.",
      "Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit."
    ],
    "trap": "compliance",
    "rule": "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
    "hint": "Repère la règle applicable à la bonne période. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "La date et la signature reconnue satisfont à la nouvelle condition.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
      "La date et la signature reconnue satisfont à la nouvelle condition."
    ]
  },
  {
    "id": "mastery-v-ruleupdate-1",
    "family": "mastery-v-ruleupdate",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Teri doit obligatoirement être remis sur papier en vertu de la règle actuelle.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Après révision, la remise numérique suffit avec une signature reconnue.",
    "stimulus": "Avant la révision, tout dossier devait être remis en version papier. Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue. Le dossier Teri a été remis après la révision avec une signature électronique reconnue. Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit.",
    "sentences": [
      "Avant la révision, tout dossier devait être remis en version papier.",
      "Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue.",
      "Le dossier Teri a été remis après la révision avec une signature électronique reconnue.",
      "Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit."
    ],
    "trap": "compliance",
    "rule": "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
    "hint": "Repère le changement de règle. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1,
      2
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Après révision, la remise numérique suffit avec une signature reconnue.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
      "Après révision, la remise numérique suffit avec une signature reconnue."
    ]
  },
  {
    "id": "mastery-v-ruleupdate-2",
    "family": "mastery-v-ruleupdate",
    "d": "reason",
    "kind": "verbal",
    "lv": 5,
    "fr": "Affirmation : Ulo a été remis sur papier.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "La règle ancienne exige le papier, mais le texte ne dit pas si Ulo la respectait ; aucune conformité n’est affirmée.",
    "stimulus": "Avant la révision, tout dossier devait être remis en version papier. Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue. Le dossier Teri a été remis après la révision avec une signature électronique reconnue. Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit.",
    "sentences": [
      "Avant la révision, tout dossier devait être remis en version papier.",
      "Depuis la révision, une remise numérique suffit lorsque la signature électronique est reconnue.",
      "Le dossier Teri a été remis après la révision avec une signature électronique reconnue.",
      "Le dossier Ulo a été remis avant la révision ; son mode de remise n’est pas décrit."
    ],
    "trap": "compliance",
    "rule": "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
    "hint": "Repère la différence entre obligation et fait réalisé. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      0,
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "La règle ancienne exige le papier, mais le texte ne dit pas si Ulo la respectait ; aucune conformité n’est affirmée."
    ],
    "steps": [
      "Une obligation ne prouve pas qu’elle a été respectée ; une hypothèse de conformité doit être explicite.",
      "La règle ancienne exige le papier, mais le texte ne dit pas si Ulo la respectait ; aucune conformité n’est affirmée."
    ]
  },
  {
    "id": "mastery-v-recommendations-0",
    "family": "mastery-v-recommendations",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : Le comité a financé l’expérimentation, sans décision de généralisation décrite.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 0,
    "x": "La décision se limite explicitement à l’expérimentation.",
    "stimulus": "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation. Cette recommandation ne constitue pas une décision d’adoption. Le comité a décidé de financer uniquement l’expérimentation à ce stade. Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles.",
    "sentences": [
      "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation.",
      "Cette recommandation ne constitue pas une décision d’adoption.",
      "Le comité a décidé de financer uniquement l’expérimentation à ce stade.",
      "Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles."
    ],
    "trap": "stages",
    "rule": "Une recommandation, une décision et un résultat doivent être distingués.",
    "hint": "Repère le périmètre de la décision. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      2
    ],
    "why": [
      "La décision se limite explicitement à l’expérimentation.",
      "La phrase décisive confirme l’affirmation ; elle ne la contredit pas.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une recommandation, une décision et un résultat doivent être distingués.",
      "La décision se limite explicitement à l’expérimentation."
    ]
  },
  {
    "id": "mastery-v-recommendations-1",
    "family": "mastery-v-recommendations",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : La recommandation de la mission est une décision d’adoption.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 1,
    "x": "Le texte exclut expressément cette équivalence.",
    "stimulus": "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation. Cette recommandation ne constitue pas une décision d’adoption. Le comité a décidé de financer uniquement l’expérimentation à ce stade. Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles.",
    "sentences": [
      "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation.",
      "Cette recommandation ne constitue pas une décision d’adoption.",
      "Le comité a décidé de financer uniquement l’expérimentation à ce stade.",
      "Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles."
    ],
    "trap": "stages",
    "rule": "Une recommandation, une décision et un résultat doivent être distingués.",
    "hint": "Repère le statut de la recommandation. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      1
    ],
    "why": [
      "L’affirmation est contredite par une information explicite ou une déduction nécessaire.",
      "Le texte exclut expressément cette équivalence.",
      "Une information décisive du passage permet ici de trancher."
    ],
    "steps": [
      "Une recommandation, une décision et un résultat doivent être distingués.",
      "Le texte exclut expressément cette équivalence."
    ]
  },
  {
    "id": "mastery-v-recommendations-2",
    "family": "mastery-v-recommendations",
    "d": "reason",
    "kind": "verbal",
    "lv": 4,
    "fr": "Affirmation : L’expérimentation sera terminée avant la prochaine réunion.",
    "o": [
      "Vrai",
      "Faux",
      "Impossible à conclure"
    ],
    "a": 2,
    "x": "Aucune échéance de résultats ni date de réunion n’est fournie.",
    "stimulus": "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation. Cette recommandation ne constitue pas une décision d’adoption. Le comité a décidé de financer uniquement l’expérimentation à ce stade. Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles.",
    "sentences": [
      "La mission recommande de tester un nouveau mécanisme de suivi avant toute généralisation.",
      "Cette recommandation ne constitue pas une décision d’adoption.",
      "Le comité a décidé de financer uniquement l’expérimentation à ce stade.",
      "Le texte ne donne pas la date à laquelle les résultats de l’expérimentation seront disponibles."
    ],
    "trap": "stages",
    "rule": "Une recommandation, une décision et un résultat doivent être distingués.",
    "hint": "Repère le délai non communiqué. Demande-toi si le texte confirme, contredit, ou laisse les deux possibilités ouvertes.",
    "evidence": [
      3
    ],
    "why": [
      "Ce scénario est possible, mais le texte n’en fait pas une conclusion obligatoire.",
      "Le scénario contraire reste également possible : absence de preuve ne signifie pas contradiction.",
      "Aucune échéance de résultats ni date de réunion n’est fournie."
    ],
    "steps": [
      "Une recommandation, une décision et un résultat doivent être distingués.",
      "Aucune échéance de résultats ni date de réunion n’est fournie."
    ]
  },
  {
    "id": "mastery-logic-order-0",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "D doit précéder B.",
      "B doit précéder C.",
      "B doit précéder A.",
      "A doit précéder E."
    ],
    "a": 3,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-0",
    "trap": "chronology",
    "models": [
      "ABCDE",
      "ACBDE",
      "ACDBE",
      "ACDEB",
      "BACDE",
      "BCADE",
      "CABDE",
      "CADBE",
      "CADEB",
      "CBADE"
    ],
    "relations": [
      [
        "D",
        "B"
      ],
      [
        "B",
        "C"
      ],
      [
        "B",
        "A"
      ],
      [
        "A",
        "E"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. C doit précéder D. D doit précéder E. C doit précéder E. A doit précéder D."
  },
  {
    "id": "mastery-logic-order-1",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "C doit précéder B.",
      "B doit précéder C.",
      "E doit précéder B.",
      "D doit précéder B."
    ],
    "a": 0,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-1",
    "trap": "chronology",
    "models": [
      "CABDE",
      "CABED",
      "CADBE",
      "CADEB",
      "CAEBD",
      "CAEDB",
      "CDABE",
      "CDAEB",
      "DCABE",
      "DCAEB"
    ],
    "relations": [
      [
        "C",
        "B"
      ],
      [
        "B",
        "C"
      ],
      [
        "E",
        "B"
      ],
      [
        "D",
        "B"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. C doit précéder E. A doit précéder B. C doit précéder A. A doit précéder E."
  },
  {
    "id": "mastery-logic-order-2",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "D doit précéder B.",
      "D doit précéder A.",
      "C doit précéder D.",
      "A doit précéder C."
    ],
    "a": 3,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-2",
    "trap": "chronology",
    "models": [
      "ADEBC",
      "ADECB",
      "AEBCD",
      "AEBDC",
      "AECBD",
      "AECDB",
      "AEDBC",
      "AEDCB",
      "DAEBC",
      "DAECB"
    ],
    "relations": [
      [
        "D",
        "B"
      ],
      [
        "D",
        "A"
      ],
      [
        "C",
        "D"
      ],
      [
        "A",
        "C"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. E doit précéder C. E doit précéder B. A doit précéder E. A doit précéder B."
  },
  {
    "id": "mastery-logic-order-3",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "A doit précéder B.",
      "E doit précéder C.",
      "C doit précéder B.",
      "C doit précéder E."
    ],
    "a": 3,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-3",
    "trap": "chronology",
    "models": [
      "ABCDE",
      "ACBDE",
      "ACDBE",
      "ACDEB",
      "BACDE",
      "BCADE",
      "CABDE",
      "CADBE",
      "CADEB",
      "CBADE"
    ],
    "relations": [
      [
        "A",
        "B"
      ],
      [
        "E",
        "C"
      ],
      [
        "C",
        "B"
      ],
      [
        "C",
        "E"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. C doit précéder D. A doit précéder E. D doit précéder E. A doit précéder D."
  },
  {
    "id": "mastery-logic-order-4",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "D doit précéder C.",
      "B doit précéder C.",
      "C doit précéder E.",
      "E doit précéder B."
    ],
    "a": 2,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-4",
    "trap": "chronology",
    "models": [
      "BCDAE",
      "CBDAE",
      "CDABE",
      "CDAEB",
      "CDBAE"
    ],
    "relations": [
      [
        "D",
        "C"
      ],
      [
        "B",
        "C"
      ],
      [
        "C",
        "E"
      ],
      [
        "E",
        "B"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. A doit précéder E. D doit précéder E. D doit précéder A. C doit précéder D."
  },
  {
    "id": "mastery-logic-order-5",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "C doit précéder E.",
      "B doit précéder D.",
      "E doit précéder B.",
      "B doit précéder C."
    ],
    "a": 3,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-5",
    "trap": "chronology",
    "models": [
      "BACDE",
      "BADCE",
      "BADEC",
      "BDACE",
      "BDAEC",
      "BDEAC",
      "DBACE",
      "DBAEC",
      "DBEAC"
    ],
    "relations": [
      [
        "C",
        "E"
      ],
      [
        "B",
        "D"
      ],
      [
        "E",
        "B"
      ],
      [
        "B",
        "C"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. B doit précéder E. D doit précéder E. B doit précéder A. A doit précéder C."
  },
  {
    "id": "mastery-logic-order-6",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "D doit précéder C.",
      "E doit précéder D.",
      "E doit précéder A.",
      "C doit précéder E."
    ],
    "a": 2,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-6",
    "trap": "chronology",
    "models": [
      "BDECA",
      "BECDA",
      "BEDCA",
      "DBECA",
      "DEBCA",
      "EBCDA",
      "EBDCA",
      "EDBCA"
    ],
    "relations": [
      [
        "D",
        "C"
      ],
      [
        "E",
        "D"
      ],
      [
        "E",
        "A"
      ],
      [
        "C",
        "E"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. E doit précéder C. C doit précéder A. B doit précéder C. D doit précéder A."
  },
  {
    "id": "mastery-logic-order-7",
    "d": "reason",
    "fr": "Quelle relation est nécessairement vraie dans tout ordre respectant ces contraintes ?",
    "o": [
      "E doit précéder B.",
      "C doit précéder A.",
      "D doit précéder B.",
      "E doit précéder C."
    ],
    "a": 1,
    "x": "Les contraintes imposent cette relation dans tous les ordres possibles ; chacune des autres propositions échoue dans au moins un ordre admissible.",
    "lv": 5,
    "family": "mastery-logic-order-7",
    "trap": "chronology",
    "models": [
      "CBDAE",
      "CBDEA",
      "CBEDA",
      "CDABE",
      "CDAEB",
      "CDBAE",
      "CDBEA",
      "CDEAB",
      "CDEBA",
      "CEBDA",
      "CEDAB",
      "CEDBA"
    ],
    "relations": [
      [
        "E",
        "B"
      ],
      [
        "C",
        "A"
      ],
      [
        "D",
        "B"
      ],
      [
        "E",
        "C"
      ]
    ],
    "kind": "logic",
    "stimulus": "Cinq tâches A, B, C, D et E occupent des positions différentes. C doit précéder B. D doit précéder A. C doit précéder E. C doit précéder D."
  },
  {
    "id": "mastery-logic-role-0",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "Amina assure la fonction suivi.",
      "Amina assure la fonction analyse.",
      "Benoît assure la fonction suivi.",
      "Céline assure la fonction achats."
    ],
    "a": 2,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-0",
    "trap": "constraints",
    "models": [
      [
        "analyse",
        "suivi",
        "achats",
        "terrain"
      ],
      [
        "terrain",
        "suivi",
        "analyse",
        "achats"
      ],
      [
        "terrain",
        "suivi",
        "achats",
        "analyse"
      ],
      [
        "achats",
        "suivi",
        "analyse",
        "terrain"
      ]
    ],
    "claims": [
      [
        0,
        "suivi"
      ],
      [
        0,
        "analyse"
      ],
      [
        1,
        "suivi"
      ],
      [
        2,
        "achats"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : analyse, terrain, achats. Benoît peut uniquement assurer : analyse, terrain, suivi. Céline peut uniquement assurer : analyse, achats. David peut uniquement assurer : analyse, terrain, achats."
  },
  {
    "id": "mastery-logic-role-1",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "David assure la fonction achats.",
      "Céline assure la fonction terrain.",
      "Amina assure la fonction achats.",
      "Benoît assure la fonction terrain."
    ],
    "a": 0,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-1",
    "trap": "constraints",
    "models": [
      [
        "analyse",
        "suivi",
        "terrain",
        "achats"
      ],
      [
        "terrain",
        "suivi",
        "analyse",
        "achats"
      ],
      [
        "suivi",
        "analyse",
        "terrain",
        "achats"
      ],
      [
        "suivi",
        "terrain",
        "analyse",
        "achats"
      ]
    ],
    "claims": [
      [
        3,
        "achats"
      ],
      [
        2,
        "terrain"
      ],
      [
        0,
        "achats"
      ],
      [
        1,
        "terrain"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : analyse, terrain, suivi. Benoît peut uniquement assurer : analyse, terrain, suivi. Céline peut uniquement assurer : analyse, terrain. David peut uniquement assurer : analyse, terrain, achats."
  },
  {
    "id": "mastery-logic-role-2",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "Benoît assure la fonction achats.",
      "Céline assure la fonction achats.",
      "Benoît assure la fonction analyse.",
      "David assure la fonction suivi."
    ],
    "a": 3,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-2",
    "trap": "constraints",
    "models": [
      [
        "terrain",
        "analyse",
        "achats",
        "suivi"
      ],
      [
        "terrain",
        "achats",
        "analyse",
        "suivi"
      ],
      [
        "achats",
        "terrain",
        "analyse",
        "suivi"
      ]
    ],
    "claims": [
      [
        1,
        "achats"
      ],
      [
        2,
        "achats"
      ],
      [
        1,
        "analyse"
      ],
      [
        3,
        "suivi"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : terrain, achats. Benoît peut uniquement assurer : analyse, terrain, achats. Céline peut uniquement assurer : analyse, achats. David peut uniquement assurer : terrain, achats, suivi."
  },
  {
    "id": "mastery-logic-role-3",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "Amina assure la fonction analyse.",
      "Céline assure la fonction achats.",
      "Benoît assure la fonction suivi.",
      "Céline assure la fonction analyse."
    ],
    "a": 0,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-3",
    "trap": "constraints",
    "models": [
      [
        "analyse",
        "terrain",
        "achats",
        "suivi"
      ],
      [
        "analyse",
        "terrain",
        "suivi",
        "achats"
      ],
      [
        "analyse",
        "achats",
        "terrain",
        "suivi"
      ],
      [
        "analyse",
        "achats",
        "suivi",
        "terrain"
      ],
      [
        "analyse",
        "suivi",
        "terrain",
        "achats"
      ],
      [
        "analyse",
        "suivi",
        "achats",
        "terrain"
      ]
    ],
    "claims": [
      [
        0,
        "analyse"
      ],
      [
        2,
        "achats"
      ],
      [
        1,
        "suivi"
      ],
      [
        2,
        "analyse"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : analyse, terrain, suivi. Benoît peut uniquement assurer : terrain, achats, suivi. Céline peut uniquement assurer : terrain, achats, suivi. David peut uniquement assurer : terrain, achats, suivi."
  },
  {
    "id": "mastery-logic-role-4",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "Amina assure la fonction suivi.",
      "Benoît assure la fonction achats.",
      "David assure la fonction suivi.",
      "David assure la fonction analyse."
    ],
    "a": 0,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-4",
    "trap": "constraints",
    "models": [
      [
        "suivi",
        "analyse",
        "terrain",
        "achats"
      ],
      [
        "suivi",
        "terrain",
        "achats",
        "analyse"
      ],
      [
        "suivi",
        "achats",
        "terrain",
        "analyse"
      ]
    ],
    "claims": [
      [
        0,
        "suivi"
      ],
      [
        1,
        "achats"
      ],
      [
        3,
        "suivi"
      ],
      [
        3,
        "analyse"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : terrain, achats, suivi. Benoît peut uniquement assurer : analyse, terrain, achats. Céline peut uniquement assurer : terrain, achats. David peut uniquement assurer : analyse, achats."
  },
  {
    "id": "mastery-logic-role-5",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "David assure la fonction terrain.",
      "Benoît assure la fonction suivi.",
      "David assure la fonction analyse.",
      "Amina assure la fonction achats."
    ],
    "a": 3,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-5",
    "trap": "constraints",
    "models": [
      [
        "achats",
        "analyse",
        "suivi",
        "terrain"
      ],
      [
        "achats",
        "terrain",
        "analyse",
        "suivi"
      ],
      [
        "achats",
        "terrain",
        "suivi",
        "analyse"
      ]
    ],
    "claims": [
      [
        3,
        "terrain"
      ],
      [
        1,
        "suivi"
      ],
      [
        3,
        "analyse"
      ],
      [
        0,
        "achats"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : terrain, achats. Benoît peut uniquement assurer : analyse, terrain. Céline peut uniquement assurer : analyse, suivi. David peut uniquement assurer : analyse, terrain, suivi."
  },
  {
    "id": "mastery-logic-role-6",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "Céline assure la fonction analyse.",
      "David assure la fonction terrain.",
      "Amina assure la fonction terrain.",
      "Céline assure la fonction suivi."
    ],
    "a": 1,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-6",
    "trap": "constraints",
    "models": [
      [
        "analyse",
        "achats",
        "suivi",
        "terrain"
      ],
      [
        "achats",
        "analyse",
        "suivi",
        "terrain"
      ],
      [
        "suivi",
        "analyse",
        "achats",
        "terrain"
      ]
    ],
    "claims": [
      [
        2,
        "analyse"
      ],
      [
        3,
        "terrain"
      ],
      [
        0,
        "terrain"
      ],
      [
        2,
        "suivi"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : analyse, achats, suivi. Benoît peut uniquement assurer : analyse, achats. Céline peut uniquement assurer : achats, suivi. David peut uniquement assurer : terrain, achats."
  },
  {
    "id": "mastery-logic-role-7",
    "d": "reason",
    "fr": "Quelle affectation est imposée par toutes les conditions ?",
    "o": [
      "David assure la fonction achats.",
      "Céline assure la fonction suivi.",
      "Céline assure la fonction terrain.",
      "Céline assure la fonction achats."
    ],
    "a": 2,
    "x": "Chaque fonction est attribuée une seule fois. Éliminer les combinaisons incompatibles impose cette affectation, sans nécessairement fixer toutes les autres.",
    "lv": 5,
    "family": "mastery-logic-role-7",
    "trap": "constraints",
    "models": [
      [
        "achats",
        "analyse",
        "terrain",
        "suivi"
      ],
      [
        "achats",
        "suivi",
        "terrain",
        "analyse"
      ],
      [
        "suivi",
        "analyse",
        "terrain",
        "achats"
      ],
      [
        "suivi",
        "achats",
        "terrain",
        "analyse"
      ]
    ],
    "claims": [
      [
        3,
        "achats"
      ],
      [
        2,
        "suivi"
      ],
      [
        2,
        "terrain"
      ],
      [
        2,
        "achats"
      ]
    ],
    "kind": "logic",
    "stimulus": "Quatre personnes occupent chacune une fonction différente : analyse, terrain, achats et suivi. Amina peut uniquement assurer : achats, suivi. Benoît peut uniquement assurer : analyse, achats, suivi. Céline peut uniquement assurer : analyse, terrain, suivi. David peut uniquement assurer : analyse, achats, suivi."
  },
  {
    "id": "mastery-detail-ref-0",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-AR · Kara Nord · Validé · Annexe à signer",
      "NOIRA-AR · Kara Nord · Validé · Annexe signée",
      "NORIA-AR · Kara Nord · Provisoire · Annexe signée",
      "NORIA-AR · Kara Nord · Validé · Annexe signée"
    ],
    "a": 3,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-0",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-AR · Kara Nord · Validé · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-1",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-BR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-BR · Lomé Est · Provisoire · Annexe à signer",
      "NOIRA-BR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-BR · Lomé Est · Validé · Annexe signée"
    ],
    "a": 0,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-1",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-BR · Lomé Est · Provisoire · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-2",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-CR · Kara Nord · Validé · Annexe signée",
      "NORIA-CR · Kara Nord · Validé · Annexe à signer",
      "NOIRA-CR · Kara Nord · Validé · Annexe signée",
      "NORIA-CR · Kara Nord · Provisoire · Annexe signée"
    ],
    "a": 0,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-2",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-CR · Kara Nord · Validé · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-3",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-DR · Lomé Est · Validé · Annexe signée",
      "NOIRA-DR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-DR · Lomé Est · Provisoire · Annexe à signer",
      "NORIA-DR · Lomé Est · Provisoire · Annexe signée"
    ],
    "a": 3,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-3",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-DR · Lomé Est · Provisoire · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-4",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-ER · Kara Nord · Validé · Annexe à signer",
      "NORIA-ER · Kara Nord · Validé · Annexe signée",
      "NOIRA-ER · Kara Nord · Validé · Annexe signée",
      "NORIA-ER · Kara Nord · Provisoire · Annexe signée"
    ],
    "a": 1,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-4",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-ER · Kara Nord · Validé · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-5",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-FR · Lomé Est · Provisoire · Annexe à signer",
      "NOIRA-FR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-FR · Lomé Est · Validé · Annexe signée",
      "NORIA-FR · Lomé Est · Provisoire · Annexe signée"
    ],
    "a": 3,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-5",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-FR · Lomé Est · Provisoire · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-6",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-GR · Kara Nord · Provisoire · Annexe signée",
      "NORIA-GR · Kara Nord · Validé · Annexe signée",
      "NORIA-GR · Kara Nord · Validé · Annexe à signer",
      "NOIRA-GR · Kara Nord · Validé · Annexe signée"
    ],
    "a": 1,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-6",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-GR · Kara Nord · Validé · Annexe signée"
  },
  {
    "id": "mastery-detail-ref-7",
    "d": "reason",
    "fr": "Quelle fiche reprend exactement toutes les informations de la référence ?",
    "o": [
      "NORIA-HR · Lomé Est · Provisoire · Annexe à signer",
      "NOIRA-HR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-HR · Lomé Est · Provisoire · Annexe signée",
      "NORIA-HR · Lomé Est · Validé · Annexe signée"
    ],
    "a": 2,
    "x": "Compare successivement référence, lieu, statut et annexe. Une inversion ou un changement de statut suffit à invalider la fiche.",
    "lv": 4,
    "family": "mastery-detail-ref-7",
    "trap": "detail",
    "kind": "detail",
    "stimulus": "Référence : NORIA-HR · Lomé Est · Provisoire · Annexe signée"
  },
  {
    "id": "mastery-detail-rule-0",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas A-D",
      "Cas A-B",
      "Cas A-A",
      "Cas A-C"
    ],
    "a": 3,
    "x": "Il faut simultanément convention = « Signé » et budget = « Validé », sans exclusion par réserve = « Réserve ouverte ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-0",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Convention</th><th>Budget</th><th>Réserve</th></tr></thead><tbody><tr><td>Cas A-D</td><td>Signé</td><td>Validé</td><td>Réserve ouverte</td></tr><tr><td>Cas A-B</td><td>À signer</td><td>Validé</td><td>Aucune</td></tr><tr><td>Cas A-A</td><td>Signé</td><td>En attente</td><td>Aucune</td></tr><tr><td>Cas A-C</td><td>Signé</td><td>Validé</td><td>Aucune</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où convention est « Signé » ET budget est « Validé », SAUF si réserve indique « Réserve ouverte ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-1",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas B-D",
      "Cas B-C",
      "Cas B-B",
      "Cas B-A"
    ],
    "a": 1,
    "x": "Il faut simultanément fiche = « Complet » et consentement = « Obtenu », sans exclusion par doublon = « Signalé ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-1",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Fiche</th><th>Consentement</th><th>Doublon</th></tr></thead><tbody><tr><td>Cas B-D</td><td>Complet</td><td>Obtenu</td><td>Signalé</td></tr><tr><td>Cas B-C</td><td>Complet</td><td>Obtenu</td><td>Absent</td></tr><tr><td>Cas B-B</td><td>Incomplet</td><td>Obtenu</td><td>Absent</td></tr><tr><td>Cas B-A</td><td>Complet</td><td>En attente</td><td>Absent</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où fiche est « Complet » ET consentement est « Obtenu », SAUF si doublon indique « Signalé ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-2",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas C-D",
      "Cas C-C",
      "Cas C-A",
      "Cas C-B"
    ],
    "a": 1,
    "x": "Il faut simultanément rapport = « Final » et sources = « Vérifiées », sans exclusion par restriction = « Restreint ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-2",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Rapport</th><th>Sources</th><th>Restriction</th></tr></thead><tbody><tr><td>Cas C-D</td><td>Final</td><td>Vérifiées</td><td>Restreint</td></tr><tr><td>Cas C-C</td><td>Final</td><td>Vérifiées</td><td>Aucune</td></tr><tr><td>Cas C-A</td><td>Final</td><td>À vérifier</td><td>Aucune</td></tr><tr><td>Cas C-B</td><td>Provisoire</td><td>Vérifiées</td><td>Aucune</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où rapport est « Final » ET sources est « Vérifiées », SAUF si restriction indique « Restreint ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-3",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas D-B",
      "Cas D-A",
      "Cas D-C",
      "Cas D-D"
    ],
    "a": 2,
    "x": "Il faut simultanément mission = « Planifiée » et autorisation = « Accordée », sans exclusion par alerte = « Active ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-3",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Mission</th><th>Autorisation</th><th>Alerte</th></tr></thead><tbody><tr><td>Cas D-B</td><td>À planifier</td><td>Accordée</td><td>Aucune</td></tr><tr><td>Cas D-A</td><td>Planifiée</td><td>Demandée</td><td>Aucune</td></tr><tr><td>Cas D-C</td><td>Planifiée</td><td>Accordée</td><td>Aucune</td></tr><tr><td>Cas D-D</td><td>Planifiée</td><td>Accordée</td><td>Active</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où mission est « Planifiée » ET autorisation est « Accordée », SAUF si alerte indique « Active ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-4",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas E-C",
      "Cas E-A",
      "Cas E-D",
      "Cas E-B"
    ],
    "a": 0,
    "x": "Il faut simultanément annexe = « Jointe » et visa = « Obtenu », sans exclusion par incohérence = « Ouverte ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-4",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Annexe</th><th>Visa</th><th>Incohérence</th></tr></thead><tbody><tr><td>Cas E-C</td><td>Jointe</td><td>Obtenu</td><td>Aucune</td></tr><tr><td>Cas E-A</td><td>Jointe</td><td>Demandé</td><td>Aucune</td></tr><tr><td>Cas E-D</td><td>Jointe</td><td>Obtenu</td><td>Ouverte</td></tr><tr><td>Cas E-B</td><td>Absente</td><td>Obtenu</td><td>Aucune</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où annexe est « Jointe » ET visa est « Obtenu », SAUF si incohérence indique « Ouverte ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-5",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas F-B",
      "Cas F-C",
      "Cas F-D",
      "Cas F-A"
    ],
    "a": 1,
    "x": "Il faut simultanément livraison = « Réceptionnée » et contrôle = « Terminé », sans exclusion par réclamation = « Ouverte ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-5",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Livraison</th><th>Contrôle</th><th>Réclamation</th></tr></thead><tbody><tr><td>Cas F-B</td><td>Annoncée</td><td>Terminé</td><td>Aucune</td></tr><tr><td>Cas F-C</td><td>Réceptionnée</td><td>Terminé</td><td>Aucune</td></tr><tr><td>Cas F-D</td><td>Réceptionnée</td><td>Terminé</td><td>Ouverte</td></tr><tr><td>Cas F-A</td><td>Réceptionnée</td><td>En cours</td><td>Aucune</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où livraison est « Réceptionnée » ET contrôle est « Terminé », SAUF si réclamation indique « Ouverte ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-6",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas G-C",
      "Cas G-B",
      "Cas G-A",
      "Cas G-D"
    ],
    "a": 0,
    "x": "Il faut simultanément agent = « Formé » et habilitation = « Accordée », sans exclusion par suspension = « Active ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-6",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Agent</th><th>Habilitation</th><th>Suspension</th></tr></thead><tbody><tr><td>Cas G-C</td><td>Formé</td><td>Accordée</td><td>Aucune</td></tr><tr><td>Cas G-B</td><td>À former</td><td>Accordée</td><td>Aucune</td></tr><tr><td>Cas G-A</td><td>Formé</td><td>Demandée</td><td>Aucune</td></tr><tr><td>Cas G-D</td><td>Formé</td><td>Accordée</td><td>Active</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où agent est « Formé » ET habilitation est « Accordée », SAUF si suspension indique « Active ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-detail-rule-7",
    "d": "reason",
    "fr": "Quel cas satisfait entièrement la consigne ?",
    "o": [
      "Cas H-B",
      "Cas H-A",
      "Cas H-D",
      "Cas H-C"
    ],
    "a": 3,
    "x": "Il faut simultanément document = « Final » et signature = « Validée », sans exclusion par erreur = « Détectée ». Chaque autre ligne échoue sur un critère.",
    "lv": 4,
    "family": "mastery-detail-rule-7",
    "table": "<table><caption>État des cas à la date de contrôle</caption><thead><tr><th>Cas</th><th>Document</th><th>Signature</th><th>Erreur</th></tr></thead><tbody><tr><td>Cas H-B</td><td>Provisoire</td><td>Validée</td><td>Aucune</td></tr><tr><td>Cas H-A</td><td>Final</td><td>À valider</td><td>Aucune</td></tr><tr><td>Cas H-D</td><td>Final</td><td>Validée</td><td>Détectée</td></tr><tr><td>Cas H-C</td><td>Final</td><td>Validée</td><td>Aucune</td></tr></tbody></table>",
    "trap": "connective",
    "kind": "detail",
    "stimulus": "Retenir les cas où document est « Final » ET signature est « Validée », SAUF si erreur indique « Détectée ». Toutes les conditions doivent être appliquées."
  },
  {
    "id": "mastery-sjt-0",
    "d": "sjt",
    "fr": "Une proposition d’un fournisseur anciennement employé par un membre du comité est arrivée. Le membre a déclaré ce lien, mais aucune décision de gestion du conflit n’est encore prise. Quelle première action est la meilleure ?",
    "o": [
      "Faire préciser la gestion du conflit avant sa participation à l’évaluation.",
      "Accepter sa participation puisqu’il a déjà déclaré son lien.",
      "Retirer définitivement la proposition avant examen du conflit.",
      "Laisser le président du comité décider oralement après l’évaluation."
    ],
    "a": 0,
    "x": "Une déclaration ouvre le traitement du conflit ; il faut décider et tracer sa gestion avant l’évaluation.",
    "lv": 4,
    "family": "mastery-sjt-0",
    "trap": "judgment",
    "kind": "sjt",
    "source": "ethics",
    "why": [
      "Une déclaration ouvre le traitement du conflit ; il faut décider et tracer sa gestion avant l’évaluation.",
      "Déclarer ne suffit pas à régler l’impartialité ou sa perception.",
      "Une exclusion automatique du fournisseur peut être disproportionnée et contraire au processus.",
      "Un traitement tardif et oral laisse l’évaluation exposée."
    ]
  },
  {
    "id": "mastery-sjt-1",
    "d": "sjt",
    "fr": "Un partenaire demande le fichier nominatif des bénéficiaires pour vérifier des doublons. La finalité paraît légitime, mais aucun accord de partage n’est documenté. Quelle réponse convient d’abord ?",
    "o": [
      "Partager un extrait nominatif réduit avec une promesse de discrétion.",
      "Vérifier autorisation, nécessité et solution minimisant les données avant transfert.",
      "Transmettre le fichier complet après avoir informé votre responsable.",
      "Reporter toute vérification des doublons à la clôture du projet."
    ],
    "a": 1,
    "x": "Le besoin doit être traité par un accès autorisé, limité et adapté à la finalité.",
    "lv": 4,
    "family": "mastery-sjt-1",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Réduire la taille ne remplace pas une base de partage autorisée.",
      "Le besoin doit être traité par un accès autorisé, limité et adapté à la finalité.",
      "Informer un responsable ne constitue pas nécessairement une autorisation de divulgation.",
      "Le report laisse un risque de qualité sans examiner une solution possible."
    ]
  },
  {
    "id": "mastery-sjt-2",
    "d": "sjt",
    "fr": "Une donnée essentielle peut inverser la recommandation d’une note attendue aujourd’hui. Elle n’est pas vérifiée. Que faire ?",
    "o": [
      "Envoyer la recommandation actuelle avec une réserve en annexe.",
      "Choisir l’hypothèse médiane pour éviter de retarder la décision.",
      "Alerter sur la sensibilité et obtenir une vérification ou un arbitrage avant décision.",
      "Retirer la donnée et conserver la même recommandation."
    ],
    "a": 2,
    "x": "La matérialité justifie d’exposer le risque et de faire vérifier ou arbitrer la décision.",
    "lv": 5,
    "family": "mastery-sjt-2",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Une réserve en annexe ne protège pas assez une décision dépendant d’une donnée critique.",
      "Une hypothèse médiane ne remplace pas une information déterminante vérifiée.",
      "La matérialité justifie d’exposer le risque et de faire vérifier ou arbitrer la décision.",
      "Retirer la donnée sans revoir la conclusion masque sa dépendance."
    ]
  },
  {
    "id": "mastery-sjt-3",
    "d": "sjt",
    "fr": "Votre équipe observe un problème mineur de présentation dans une annexe, sans effet sur les chiffres ni la décision. La transmission expire dans peu de temps. Quelle action est la plus proportionnée ?",
    "o": [
      "Demander un report général pour refaire toutes les annexes.",
      "Envoyer les seuls chiffres sans préciser l’absence de l’annexe.",
      "Supprimer l’annexe sans consulter le responsable de la note.",
      "Corriger si possible, sinon signaler la limite et prévoir une version rectifiée."
    ],
    "a": 3,
    "x": "La réponse traite le défaut sans cacher la limite ni bloquer inutilement le travail.",
    "lv": 4,
    "family": "mastery-sjt-3",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Un report général peut être excessif pour un défaut sans effet décisionnel.",
      "Une transmission partielle non expliquée peut créer une confusion.",
      "Retirer une pièce peut modifier la complétude du dossier sans validation.",
      "La réponse traite le défaut sans cacher la limite ni bloquer inutilement le travail."
    ]
  },
  {
    "id": "mastery-sjt-4",
    "d": "sjt",
    "fr": "Un superviseur demande de présenter comme un résultat acquis une cible qui n’est pas encore réalisée. Il estime que le bailleur comprendra. Quelle action convient ?",
    "o": [
      "Proposer une formulation exacte distinguant cible et résultat, puis suivre la voie d’alerte si nécessaire.",
      "Utiliser le terme demandé tout en gardant les données brutes dans vos archives.",
      "Remplacer les chiffres par une appréciation positive pour éviter le désaccord.",
      "Demander uniquement à un collègue de signer la section à votre place."
    ],
    "a": 0,
    "x": "Une formulation exacte protège l’intégrité de l’information ; l’escalade reste proportionnée si la pression persiste.",
    "lv": 4,
    "family": "mastery-sjt-4",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Une formulation exacte protège l’intégrité de l’information ; l’escalade reste proportionnée si la pression persiste.",
      "L’archive exacte ne corrige pas une présentation trompeuse destinée au bailleur.",
      "Un jugement positif peut aussi masquer l’état réel des résultats.",
      "Changer le signataire ne résout pas le problème de contenu."
    ]
  },
  {
    "id": "mastery-sjt-5",
    "d": "sjt",
    "fr": "Une communauté refuse une activité après une consultation dominée par quelques représentants. Le calendrier est serré. Que faire d’abord ?",
    "o": [
      "Valider l’activité sur la base du compte rendu signé par les représentants.",
      "Identifier les voix exclues et organiser une consultation ciblée pour comprendre les objections.",
      "Réaliser l’activité pilote puis consulter si des plaintes persistent.",
      "Suspendre toutes les activités du programme sans analyse complémentaire."
    ],
    "a": 1,
    "x": "Une consultation ciblée traite le défaut de participation et éclaire les décisions suivantes.",
    "lv": 4,
    "family": "mastery-sjt-5",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "La signature ne suffit pas à établir une participation représentative.",
      "Une consultation ciblée traite le défaut de participation et éclaire les décisions suivantes.",
      "Agir d’abord peut accentuer le conflit et ne résout pas le défaut de consentement ou participation.",
      "Une suspension générale peut dépasser ce que le problème justifie."
    ]
  },
  {
    "id": "mastery-sjt-6",
    "d": "sjt",
    "fr": "Une dépense est urgente mais le dossier comporte une incohérence sur la facture. Il existe une voie accélérée autorisée. Que faire ?",
    "o": [
      "Utiliser la voie accélérée et vérifier la facture après paiement.",
      "Attendre le cycle ordinaire malgré l’existence de la voie accélérée.",
      "Clarifier l’incohérence et utiliser la voie accélérée avec les contrôles requis.",
      "Faire approuver oralement une exception par le demandeur de la dépense."
    ],
    "a": 2,
    "x": "Cette réponse combine urgence, vérification et conformité.",
    "lv": 4,
    "family": "mastery-sjt-6",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Une accélération ne supprime pas le contrôle d’une incohérence matérielle.",
      "Il faut examiner les mécanismes autorisés qui répondent à l’urgence.",
      "Cette réponse combine urgence, vérification et conformité.",
      "Le demandeur ne peut pas nécessairement autoriser sa propre exception."
    ]
  },
  {
    "id": "mastery-sjt-7",
    "d": "sjt",
    "fr": "Deux notes défendent des options différentes avec des hypothèses incompatibles. Votre manager souhaite une synthèse. Quelle démarche est la meilleure ?",
    "o": [
      "Retenir la conclusion portée par l’équipe la plus expérimentée.",
      "Présenter la moyenne des résultats comme un scénario consensuel.",
      "Rédiger deux résumés sans examiner les hypothèses du désaccord.",
      "Comparer les hypothèses décisives et tester les options sur des critères communs."
    ],
    "a": 3,
    "x": "Des critères communs et une analyse de sensibilité rendent le désaccord utile à la décision.",
    "lv": 4,
    "family": "mastery-sjt-7",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "L’expérience ne départage pas à elle seule des hypothèses vérifiables.",
      "Moyenner des modèles incompatibles peut créer un résultat sans fondement.",
      "Deux résumés ne résolvent pas ce qui change la décision.",
      "Des critères communs et une analyse de sensibilité rendent le désaccord utile à la décision."
    ]
  },
  {
    "id": "mastery-sjt-8",
    "d": "sjt",
    "fr": "Vous découvrez une erreur dans une note déjà utilisée en réunion. Elle modifie une conclusion secondaire mais pas la recommandation centrale. Que faire ?",
    "o": [
      "Informer les destinataires concernés de la correction et de sa portée.",
      "Corriger discrètement le fichier partagé sans avertir les lecteurs.",
      "Attendre la prochaine réunion pour éviter des messages supplémentaires.",
      "Retirer toute la note jusqu’à un nouvel examen de l’ensemble des données."
    ],
    "a": 0,
    "x": "La correction doit atteindre ceux qui utilisent l’information, avec une portée claire et traçable.",
    "lv": 4,
    "family": "mastery-sjt-8",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "La correction doit atteindre ceux qui utilisent l’information, avec une portée claire et traçable.",
      "Les lecteurs peuvent continuer à utiliser la version erronée.",
      "Le délai entretient une erreur connue.",
      "Une révocation totale peut être disproportionnée si la portée est limitée et vérifiée."
    ]
  },
  {
    "id": "mastery-sjt-9",
    "d": "sjt",
    "fr": "Un collègue vous signale une irrégularité possible et demande une confidentialité absolue. Il peut exister un risque grave. Que répondre ?",
    "o": [
      "Promettre de ne partager l’information avec personne.",
      "Expliquer les limites de confidentialité et orienter vers le canal autorisé adapté.",
      "Informer immédiatement toute l’équipe sans détails nominaux.",
      "Attendre qu’un second collègue confirme le signalement."
    ],
    "a": 1,
    "x": "Le signalement doit être protégé et traité par les personnes habilitées, sans promesse impossible.",
    "lv": 5,
    "family": "mastery-sjt-9",
    "trap": "judgment",
    "kind": "sjt",
    "source": "ethics",
    "why": [
      "Une confidentialité absolue peut être incompatible avec l’obligation de traiter un risque grave.",
      "Le signalement doit être protégé et traité par les personnes habilitées, sans promesse impossible.",
      "Une diffusion large peut exposer le signalant et nuire à l’enquête.",
      "Une corroboration informelle n’est pas toujours nécessaire pour transmettre au canal compétent."
    ]
  },
  {
    "id": "mastery-sjt-10",
    "d": "sjt",
    "fr": "Un partenaire conteste vivement votre analyse pendant une réunion. Il cite une source que vous n’avez pas consultée. Quelle réponse est la plus professionnelle ?",
    "o": [
      "Défendre la conclusion actuelle jusqu’à ce qu’il fournisse une preuve complète.",
      "Accepter immédiatement sa conclusion pour préserver la relation.",
      "Demander les éléments précis, exposer vos hypothèses et convenir d’une vérification.",
      "Clore l’échange et reporter toute discussion à la fin du projet."
    ],
    "a": 2,
    "x": "Cette réponse combine écoute, transparence des hypothèses et contrôle factuel.",
    "lv": 4,
    "family": "mastery-sjt-10",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Défendre sans examiner la source ferme une possibilité de correction utile.",
      "Accepter sans examen échange la rigueur contre une entente superficielle.",
      "Cette réponse combine écoute, transparence des hypothèses et contrôle factuel.",
      "Reporter à la fin peut laisser une décision importante sans clarification."
    ]
  },
  {
    "id": "mastery-sjt-11",
    "d": "sjt",
    "fr": "Deux responsables attribuent des tâches pour la même échéance. Votre capacité ne permet pas de livrer les deux avec la qualité requise. Que faire ?",
    "o": [
      "Choisir la demande du responsable le plus senior sans l’annoncer.",
      "Promettre les deux livraisons puis décider selon les progrès.",
      "Réduire discrètement la qualité des deux travaux pour tenir les délais.",
      "Rendre la contrainte visible et obtenir un arbitrage sur priorités, périmètre ou appui."
    ],
    "a": 3,
    "x": "Les demandeurs doivent pouvoir arbitrer une contrainte de capacité réelle.",
    "lv": 4,
    "family": "mastery-sjt-11",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Le rang ne remplace pas une priorisation explicitement partagée.",
      "Une promesse irréaliste retarde le traitement du conflit.",
      "Une qualité réduite sans accord change les attentes et peut créer un risque.",
      "Les demandeurs doivent pouvoir arbitrer une contrainte de capacité réelle."
    ]
  },
  {
    "id": "mastery-sjt-12",
    "d": "sjt",
    "fr": "Un prestataire propose un cadeau de faible valeur pendant l’évaluation de son offre. La règle interne est restrictive. Quelle action est la meilleure ?",
    "o": [
      "Décliner selon la règle, documenter si requis et poursuivre une évaluation impartiale.",
      "Accepter le cadeau puis déclarer sa valeur après la sélection.",
      "Accepter si le cadeau est partagé avec l’équipe d’évaluation.",
      "Écarter l’offre sans examiner la procédure applicable."
    ],
    "a": 0,
    "x": "L’intégrité exige de suivre la règle sur les avantages et de gérer la situation avec proportionnalité.",
    "lv": 4,
    "family": "mastery-sjt-12",
    "trap": "judgment",
    "kind": "sjt",
    "source": "ethics",
    "why": [
      "L’intégrité exige de suivre la règle sur les avantages et de gérer la situation avec proportionnalité.",
      "Une déclaration après sélection ne remédie pas nécessairement à l’acceptation interdite.",
      "Partager ne supprime pas le lien avec le fournisseur évalué.",
      "L’exclusion de l’offre doit suivre les règles plutôt qu’une décision automatique."
    ]
  },
  {
    "id": "mastery-sjt-13",
    "d": "sjt",
    "fr": "Une nouvelle solution numérique semble prometteuse, mais vos usagers ont une connexion instable. Quelle première démarche est la meilleure ?",
    "o": [
      "Généraliser la solution et prévoir une formation après déploiement.",
      "Tester avec des usagers représentatifs et évaluer les contraintes d’accès et de support.",
      "Retenir la solution utilisée dans un pays où la connexion est stable.",
      "Reporter tout investissement numérique jusqu’à une connectivité parfaite."
    ],
    "a": 1,
    "x": "Un pilote représentatif permet de vérifier utilité, accessibilité et besoins d’appui.",
    "lv": 4,
    "family": "mastery-sjt-13",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Un déploiement général rend les difficultés plus coûteuses à corriger.",
      "Un pilote représentatif permet de vérifier utilité, accessibilité et besoins d’appui.",
      "Une réussite ailleurs ne prouve pas l’adaptation à ce contexte.",
      "L’attente d’une situation parfaite peut exclure des solutions hors ligne ou progressives."
    ]
  },
  {
    "id": "mastery-sjt-14",
    "d": "sjt",
    "fr": "Une enquête révèle peu de plaintes, mais les femmes interrogées disent ne pas connaître le mécanisme. Quelle priorité retenir ?",
    "o": [
      "Conclure que le mécanisme fonctionne puisque les plaintes sont rares.",
      "Augmenter les indicateurs de satisfaction sans modifier le mécanisme.",
      "Examiner accessibilité, information et confiance avant d’interpréter la faible fréquence.",
      "Remplacer les enquêteurs avant tout autre diagnostic."
    ],
    "a": 2,
    "x": "Le volume doit être interprété avec les conditions de participation.",
    "lv": 4,
    "family": "mastery-sjt-14",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Une faible fréquence peut traduire une difficulté d’accès ou de confiance.",
      "Changer les indicateurs ne résout pas l’obstacle de signalement.",
      "Le volume doit être interprété avec les conditions de participation.",
      "Aucune faute des enquêteurs n’est établie."
    ]
  },
  {
    "id": "mastery-sjt-15",
    "d": "sjt",
    "fr": "Une décision vous a été déléguée dans une limite précise. Une demande dépasse cette limite mais paraît avantageuse. Quelle action convient ?",
    "o": [
      "Approuver et informer ensuite pour ne pas perdre l’occasion.",
      "Approuver une partie en découpant artificiellement la demande.",
      "Refuser sans étudier les options ni expliquer la limite.",
      "Préparer l’analyse et demander la validation à l’autorité compétente."
    ],
    "a": 3,
    "x": "L’analyse facilite une décision dans le niveau d’autorité requis.",
    "lv": 5,
    "family": "mastery-sjt-15",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Une occasion favorable ne modifie pas la délégation.",
      "Un découpage artificiel contourne la limite de décision.",
      "Le besoin peut être instruit et transmis plutôt que refusé sans examen.",
      "L’analyse facilite une décision dans le niveau d’autorité requis."
    ]
  },
  {
    "id": "mastery-sjt-16",
    "d": "sjt",
    "fr": "Une contribution financière locale est annoncée, mais aucune preuve de mobilisation n’est disponible. Le rapport doit distinguer engagement et contribution effective. Quelle formulation retenir ?",
    "o": [
      "Contribution annoncée ; mobilisation restant à vérifier.",
      "Contribution mobilisée, sous réserve de réception des justificatifs.",
      "Contribution acquise puisque les représentants ont confirmé oralement.",
      "Contribution non réalisable faute de preuve immédiate."
    ],
    "a": 0,
    "x": "Elle rend explicite le statut connu et la vérification manquante.",
    "lv": 4,
    "family": "mastery-sjt-16",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Elle rend explicite le statut connu et la vérification manquante.",
      "« Mobilisée » affirme un fait que la preuve ne permet pas encore d’établir.",
      "Une confirmation orale d’engagement n’établit pas la disponibilité des fonds.",
      "L’absence de preuve immédiate n’établit pas l’impossibilité future."
    ]
  },
  {
    "id": "mastery-sjt-17",
    "d": "sjt",
    "fr": "Vous avez un doute sur une interprétation juridique qui engage le projet. Le partenaire demande une réponse aujourd’hui. Quelle action convient ?",
    "o": [
      "Donner votre interprétation avec une réserve générale à l’oral.",
      "Fixer un délai de réponse et consulter rapidement le service compétent.",
      "Renvoyer le partenaire vers une adresse générale sans suivi.",
      "Reporter la réponse jusqu’au prochain comité sans évaluer l’urgence."
    ],
    "a": 1,
    "x": "Un délai explicite et une consultation compétente traitent rigueur et besoin client.",
    "lv": 4,
    "family": "mastery-sjt-17",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Une réserve générale peut ne pas prévenir l’usage d’un avis non compétent.",
      "Un délai explicite et une consultation compétente traitent rigueur et besoin client.",
      "Une redirection sans suivi ne garantit pas le traitement.",
      "Un report automatique ne prend pas en compte l’urgence réelle."
    ]
  },
  {
    "id": "mastery-sjt-18",
    "d": "sjt",
    "fr": "Un membre de l’équipe propose une amélioration utile qui nécessite de modifier un engagement contractuel. Quelle étape vient d’abord ?",
    "o": [
      "Mettre en œuvre puis documenter le gain obtenu.",
      "Demander au fournisseur d’absorber la différence oralement.",
      "Évaluer impacts et faire valider la modification par le circuit compétent.",
      "Conserver systématiquement le contrat initial sans examiner la proposition."
    ],
    "a": 2,
    "x": "Les conséquences et validations doivent précéder les nouveaux engagements.",
    "lv": 4,
    "family": "mastery-sjt-18",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "L’utilité ne dispense pas de la procédure de modification.",
      "Un accord oral peut laisser engagements et responsabilités incertains.",
      "Les conséquences et validations doivent précéder les nouveaux engagements.",
      "Un refus automatique peut empêcher une amélioration justifiée."
    ]
  },
  {
    "id": "mastery-sjt-19",
    "d": "sjt",
    "fr": "Lors d’une visite, vous observez un danger immédiat pour les travailleurs. Vous n’êtes pas responsable du chantier. Que faire ?",
    "o": [
      "Documenter le risque pour l’inspection prévue le lendemain.",
      "Interroger les travailleurs sans alerter les responsables.",
      "Demander un arbitrage budgétaire avant toute intervention.",
      "Alerter sans délai les responsables de sécurité et suivre les mesures de protection prévues."
    ],
    "a": 3,
    "x": "L’action urgente doit passer par les responsables et procédures de sécurité adaptés.",
    "lv": 4,
    "family": "mastery-sjt-19",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Un danger immédiat ne peut attendre un simple contrôle ultérieur.",
      "Recueillir les avis peut aider, mais ne remplace pas l’alerte urgente.",
      "Une considération budgétaire ne doit pas retarder la protection immédiate.",
      "L’action urgente doit passer par les responsables et procédures de sécurité adaptés."
    ]
  },
  {
    "id": "mastery-sjt-20",
    "d": "sjt",
    "fr": "Une équipe a promis un livrable que les données disponibles ne permettent pas de produire de façon fiable. Quel message client est le meilleur ?",
    "o": [
      "Expliquer la limite, proposer un livrable utile et négocier une suite réaliste.",
      "Livrer le format promis en utilisant des estimations non signalées.",
      "Attendre la date de livraison pour annoncer le manque de données.",
      "Envoyer toutes les données brutes à la place du livrable sans accord."
    ],
    "a": 0,
    "x": "Il rend la contrainte visible et propose une valeur réalisable avec accord.",
    "lv": 4,
    "family": "mastery-sjt-20",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "Il rend la contrainte visible et propose une valeur réalisable avec accord.",
      "Une estimation non signalée peut tromper le destinataire.",
      "Une information tardive réduit les possibilités d’adaptation.",
      "Des données brutes non convenues ne répondent pas nécessairement au besoin."
    ]
  },
  {
    "id": "mastery-sjt-21",
    "d": "sjt",
    "fr": "Le compte rendu d’une réunion attribue un accord à toutes les parties, mais l’une avait émis une réserve explicite. Que faire ?",
    "o": [
      "Conserver le résumé pour protéger la fluidité des relations.",
      "Corriger le compte rendu pour distinguer accord et réserve avant validation.",
      "Retirer le nom de la partie réservée sans expliquer la différence.",
      "Demander à la partie réservée d’accepter après coup le texte actuel."
    ],
    "a": 1,
    "x": "Le compte rendu doit refléter fidèlement les positions exprimées.",
    "lv": 5,
    "family": "mastery-sjt-21",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Une entente apparente ne justifie pas une représentation inexacte.",
      "Le compte rendu doit refléter fidèlement les positions exprimées.",
      "Une omission peut aussi déformer la participation et l’accord.",
      "Une pression après coup ne remplace pas la restitution des faits."
    ]
  },
  {
    "id": "mastery-sjt-22",
    "d": "sjt",
    "fr": "Les résultats d’un pilote sont bons dans un site bénéficiant d’un accompagnement exceptionnel. Que recommander avant généralisation ?",
    "o": [
      "Généraliser rapidement et maintenir le même budget unitaire.",
      "Traiter le site pilote comme représentatif de tous les sites.",
      "Tester la transférabilité et les ressources nécessaires dans des contextes différents.",
      "Abandonner le pilote puisque le contexte est atypique."
    ],
    "a": 2,
    "x": "Cette réponse examine les conditions qui rendent la réussite reproductible.",
    "lv": 4,
    "family": "mastery-sjt-22",
    "trap": "judgment",
    "kind": "sjt",
    "source": "yppskills",
    "why": [
      "La réussite dépend peut-être de ressources qui ne seront pas disponibles partout.",
      "La représentativité doit être examinée, pas présumée.",
      "Cette réponse examine les conditions qui rendent la réussite reproductible.",
      "Un contexte atypique appelle une analyse, pas nécessairement un abandon."
    ]
  },
  {
    "id": "mastery-sjt-23",
    "d": "sjt",
    "fr": "Un collègue vous demande de commenter un document sensible depuis son adresse personnelle pour gagner du temps. Un espace autorisé existe. Que faire ?",
    "o": [
      "Utiliser son adresse personnelle en supprimant le titre du document.",
      "Envoyer seulement quelques pages sensibles sur cette adresse.",
      "Demander son engagement écrit à effacer le fichier après lecture.",
      "Utiliser l’espace autorisé et l’aider à résoudre son problème d’accès."
    ],
    "a": 3,
    "x": "Le besoin peut être traité par le canal autorisé avec un appui pratique.",
    "lv": 4,
    "family": "mastery-sjt-23",
    "trap": "judgment",
    "kind": "sjt",
    "source": "values",
    "why": [
      "Retirer le titre ne rend pas autorisée la transmission du contenu sensible.",
      "Une transmission partielle peut toujours être non autorisée.",
      "Une promesse d’effacement ne remplace pas les canaux et permissions requis.",
      "Le besoin peut être traité par le canal autorisé avec un appui pratique."
    ]
  },
  {
    "id": "mastery-afdb-0",
    "d": "afdb",
    "fr": "Un État à faible revenu, éligible au FAD, veut financer un service public sans recettes commerciales suffisantes. Il cherche des conditions concessionnelles et sollicite une analyse de son endettement. Quelle proposition correspond le mieux à ce besoin ?",
    "o": [
      "Examiner un financement FAD adapté à la situation du pays et à la soutenabilité.",
      "Structurer une garantie pour un emprunteur privé exploitant le service à tarif commercial.",
      "Retenir un prêt ordinaire en devises, puis compenser son coût par une subvention publique.",
      "Mobiliser des fonds propres dans une entreprise de projet dont les usagers assurent la rentabilité."
    ],
    "a": 0,
    "x": "Le FAD est le guichet concessionnel ; éligibilité et besoin ne dispensent pas de l’analyse de soutenabilité ni ne garantissent un don.",
    "lv": 4,
    "family": "mastery-afdb-0",
    "trap": "institution",
    "source": "adf",
    "why": [
      "Le FAD est le guichet concessionnel ; éligibilité et besoin ne dispensent pas de l’analyse de soutenabilité ni ne garantissent un don.",
      "Une garantie privée peut être utile dans un autre montage, mais aucun exploitant commercial viable n’est posé ici.",
      "Ce montage crée une obligation ordinaire et une charge de subvention sans répondre directement au besoin concessionnel.",
      "La rentabilité tirée des usagers n’est pas établie et contredit le problème de recettes du cas."
    ]
  },
  {
    "id": "mastery-afdb-1",
    "d": "afdb",
    "fr": "Le suivi d’un projet contribuant à Mission 300 constate des raccordements achevés. Les ménages raccordés subissent encore de longues coupures et limitent leur consommation à cause du prix. Quelle conclusion convient au rapport ?",
    "o": [
      "Les raccordements sont réalisés ; la qualité et l’usage effectif du service restent à apprécier.",
      "L’accès est démontré ; le suivi devrait maintenant porter sur l’extension géographique du réseau.",
      "La cible de service est atteinte ; la fiabilité relève ensuite des seuls opérateurs de distribution.",
      "Le résultat devrait être évalué au niveau des coûts du projet plutôt qu’au niveau des ménages."
    ],
    "a": 0,
    "x": "Un produit réalisé ne suffit pas à établir un accès fiable, abordable et utile. Le rapport doit conserver ces dimensions distinctes.",
    "lv": 4,
    "family": "mastery-afdb-1",
    "trap": "institution",
    "source": "mission",
    "why": [
      "Un produit réalisé ne suffit pas à établir un accès fiable, abordable et utile. Le rapport doit conserver ces dimensions distinctes.",
      "L’extension est pertinente, mais ne remplace pas la mesure de la qualité pour les ménages déjà raccordés.",
      "La responsabilité opérationnelle d’un distributeur ne rend pas sa performance extérieure au résultat du projet.",
      "Les coûts mesurent une dimension d’efficience ; ils ne répondent pas au problème de service décrit."
    ]
  },
  {
    "id": "mastery-afdb-2",
    "d": "afdb",
    "fr": "Une unité de transformation agricole reçoit de l’électricité fiable et vend désormais une partie de sa production dans un pays voisin. Quel cadre de suivi traduit le mieux sa contribution aux High 5 ?",
    "o": [
      "Classer l’ensemble sous Industrialiser l’Afrique et utiliser la production comme indicateur commun.",
      "Relier agriculture, énergie, transformation et intégration à des effets distincts et vérifiables.",
      "Répartir les emplois déclarés entre les quatre priorités pour mesurer quatre contributions.",
      "Classer les équipements par priorité et agréger leurs coûts pour mesurer les effets du projet."
    ],
    "a": 1,
    "x": "Un même projet peut contribuer à plusieurs priorités, avec une chaîne de résultats pour chacune et sans quadrupler les bénéficiaires.",
    "lv": 4,
    "family": "mastery-afdb-2",
    "trap": "institution",
    "source": "strategy",
    "why": [
      "Une priorité principale peut être utile, mais une mesure unique masque les contributions d’accès à l’énergie et d’échanges.",
      "Un même projet peut contribuer à plusieurs priorités, avec une chaîne de résultats pour chacune et sans quadrupler les bénéficiaires.",
      "Réutiliser les mêmes emplois ne fournit pas quatre effets distincts et crée un risque de double comptage.",
      "Les dépenses d’équipement ne mesurent pas à elles seules les effets de service, de revenu ou d’intégration."
    ]
  },
  {
    "id": "mastery-afdb-3",
    "d": "afdb",
    "fr": "Une note BAD rapproche les High 5, la Stratégie décennale 2024–2033 et les quatre points cardinaux. Elle présente « reconstruire la souveraineté financière » comme un sixième High 5. Quelle révision est la plus exacte ?",
    "o": [
      "Rattacher cet axe à Intégrer l’Afrique et le retirer des points cardinaux.",
      "Renommer les High 5 en six priorités pour y intégrer la nouvelle orientation présidentielle.",
      "Rattacher cet axe aux points cardinaux et expliquer son articulation avec les High 5.",
      "Présenter les points cardinaux comme les quatre composantes qui remplacent la stratégie décennale."
    ],
    "a": 2,
    "x": "Le communiqué KOAFEC rattache la souveraineté financière aux points cardinaux. Cadre présidentiel, High 5 et stratégie ne sont pas des listes interchangeables.",
    "lv": 4,
    "family": "mastery-afdb-3",
    "trap": "institution",
    "source": "koafec",
    "why": [
      "Des liens avec l’intégration existent, mais ne changent pas le cadre auquel appartient l’intitulé.",
      "Une orientation présidentielle complémentaire ne permet pas de créer un nouveau High 5.",
      "Le communiqué KOAFEC rattache la souveraineté financière aux points cardinaux. Cadre présidentiel, High 5 et stratégie ne sont pas des listes interchangeables.",
      "Le communiqué ne présente pas les points cardinaux comme une substitution à la stratégie décennale."
    ]
  },
  {
    "id": "mastery-afdb-4",
    "d": "afdb",
    "fr": "Dans un montage fictif, une société privée emprunte directement ; son État ne garantit pas le prêt. Une agence publique supervise les engagements environnementaux. Sur quoi repose la qualification non souveraine du financement ?",
    "o": [
      "La supervision publique transfère le risque de crédit à l’État qui contrôle le projet.",
      "La finalité environnementale du financement détermine sa qualification non souveraine.",
      "Les engagements de la société envers une agence publique rendent le financement souverain.",
      "L’emprunteur est la société et aucune garantie souveraine n’est fournie."
    ],
    "a": 3,
    "x": "Il faut distinguer la structure de crédit de la supervision ou de la finalité de développement.",
    "lv": 4,
    "family": "mastery-afdb-4",
    "trap": "institution",
    "why": [
      "Une supervision n’est pas une garantie de remboursement ; aucun transfert de ce type n’est posé.",
      "La finalité du projet n’établit pas l’identité de l’emprunteur ni la couverture du risque de crédit.",
      "Des obligations réglementaires envers une agence ne constituent pas, en elles-mêmes, une garantie souveraine.",
      "Il faut distinguer la structure de crédit de la supervision ou de la finalité de développement."
    ]
  },
  {
    "id": "mastery-afdb-5",
    "d": "afdb",
    "fr": "Une garantie fictive couvre le défaut de paiement d’un acheteur public, mais laisse au prêteur les risques de construction et de change. Quel examen le prêteur doit-il conserver ?",
    "o": [
      "Analyser les risques résiduels et vérifier les conditions de mise en jeu de la garantie.",
      "Analyser la signature du garant et substituer cette analyse à celle du projet.",
      "Analyser le risque de change après la construction, quand le montant final sera connu.",
      "Analyser les coûts de construction et traiter le risque de change dans la couverture de la garantie."
    ],
    "a": 0,
    "x": "La garantie a un périmètre défini ; risques non couverts et conditions de paiement restent essentiels.",
    "lv": 4,
    "family": "mastery-afdb-5",
    "trap": "institution",
    "why": [
      "La garantie a un périmètre défini ; risques non couverts et conditions de paiement restent essentiels.",
      "La qualité du garant n’établit pas la capacité du projet à gérer les risques non garantis.",
      "Attendre la fin de la construction laisse un risque de change matériel hors de la décision de prêt.",
      "Le cas précise que le risque de change n’est pas couvert : il faut l’analyser séparément."
    ]
  },
  {
    "id": "mastery-afdb-6",
    "d": "afdb",
    "fr": "Un projet dispose déjà d’offres commerciales suffisantes aux mêmes conditions. La BAD envisage néanmoins une intervention, justifiée par un appui technique à la gouvernance. Quel élément renforcerait le dossier d’additionnalité ?",
    "o": [
      "Montrer que le montant BAD accroît la taille totale du tour de financement.",
      "Montrer le changement apporté par cet appui par rapport au scénario sans intervention.",
      "Montrer que la présence BAD réduit le nombre de prêteurs à coordonner.",
      "Montrer que le projet poursuit une priorité sectorielle du pays bénéficiaire."
    ],
    "a": 1,
    "x": "L’additionnalité peut être non financière, mais il faut établir un apport qui ne se produirait pas de la même façon sans intervention.",
    "lv": 4,
    "family": "mastery-afdb-6",
    "trap": "institution",
    "why": [
      "Un montant plus élevé ne démontre pas un besoin financier additionnel si les offres existantes suffisent.",
      "L’additionnalité peut être non financière, mais il faut établir un apport qui ne se produirait pas de la même façon sans intervention.",
      "Une simplification peut être utile, mais le cas demande de justifier l’apport technique annoncé.",
      "L’alignement stratégique est important ; il ne démontre pas à lui seul l’additionnalité."
    ]
  },
  {
    "id": "mastery-afdb-7",
    "d": "afdb",
    "fr": "Le cadre de résultats d’un projet énergétique compte des kilomètres de réseau et des branchements. Le comité demande un indicateur d’effet plutôt qu’un indicateur supplémentaire de produit. Quel ajout répond le mieux à la demande ?",
    "o": [
      "Le nombre de branchements réceptionnés conformément au cahier des charges.",
      "La capacité nominale des transformateurs installés dans les zones ciblées.",
      "La continuité du service effectivement reçu par les ménages raccordés.",
      "Le nombre d’interventions de maintenance réalisées sur le réseau neuf."
    ],
    "a": 2,
    "x": "La continuité du service décrit un changement pour les usagers ; les autres choix décrivent des installations ou des activités.",
    "lv": 4,
    "family": "mastery-afdb-7",
    "trap": "institution",
    "source": "mission",
    "why": [
      "La réception est importante pour la qualité du produit, mais demeure un jalon de réalisation.",
      "La capacité installée ne décrit pas le service réellement fourni aux ménages.",
      "La continuité du service décrit un changement pour les usagers ; les autres choix décrivent des installations ou des activités.",
      "La maintenance est une activité ; son volume n’établit pas la continuité obtenue."
    ]
  },
  {
    "id": "mastery-afdb-8",
    "d": "afdb",
    "fr": "Une note sur le programme BAD–AXIAN annoncé en septembre 2026 inclut le Togo parmi les trois pays du volet de services financiers. Quelle correction correspond au communiqué ?",
    "o": [
      "Le Togo appartient au volet financier ; le Sénégal relève du volet formation distinct.",
      "Le Togo appartient aux deux volets ; les Comores relèvent de la formation distincte.",
      "Le Togo ne figure dans aucun volet ; les Comores appartiennent au volet financier.",
      "Le Togo appartient au volet formation, distinct du volet financier à trois pays."
    ],
    "a": 3,
    "x": "Les trois pays du volet financier sont Madagascar, la Tanzanie et le Sénégal. La formation couvre cinq pays, dont le Togo et les Comores.",
    "lv": 4,
    "family": "mastery-afdb-8",
    "trap": "institution",
    "source": "afawa2026",
    "why": [
      "Le Sénégal est bien dans le volet financier ; le Togo ne l’est pas dans cette annonce.",
      "L’annonce ne place pas le Togo dans le volet financier à trois pays.",
      "Le Togo et les Comores figurent dans le volet formation.",
      "Les trois pays du volet financier sont Madagascar, la Tanzanie et le Sénégal. La formation couvre cinq pays, dont le Togo et les Comores."
    ]
  },
  {
    "id": "mastery-afdb-9",
    "d": "afdb",
    "fr": "Un programme fictif appuie une réforme budgétaire. Les textes requis ont été adoptés, mais plusieurs administrations n’appliquent pas encore la procédure. Quel jugement sur la performance est le plus défendable ?",
    "o": [
      "Distinguer l’adoption des textes de leur mise en œuvre et des effets sur la gestion publique.",
      "Retenir l’adoption comme effet institutionnel et suivre l’application dans le prochain programme.",
      "Retenir l’exécution des dépenses financées comme indicateur suffisant de l’effet des réformes.",
      "Retenir la conformité juridique des textes comme mesure de l’amélioration des services publics."
    ],
    "a": 0,
    "x": "Une réforme comporte plusieurs étapes ; un acte juridique n’établit pas son application ni ses effets.",
    "lv": 4,
    "family": "mastery-afdb-9",
    "trap": "institution",
    "source": "seychelles",
    "why": [
      "Une réforme comporte plusieurs étapes ; un acte juridique n’établit pas son application ni ses effets.",
      "L’adoption est un jalon utile, mais reporter le suivi d’application laisse l’effet actuel non établi.",
      "La dépense est une donnée financière ; elle ne démontre pas un changement des pratiques.",
      "La conformité des textes ne suffit pas à montrer la qualité effective des services."
    ]
  },
  {
    "id": "mastery-afdb-10",
    "d": "afdb",
    "fr": "Une opération fictive a été approuvée. L’accord de financement n’est pas signé et aucun décaissement n’est enregistré. Quelle phrase peut figurer sans extrapolation dans une note de suivi ?",
    "o": [
      "Le financement est mobilisé ; la signature formalisera un engagement déjà décaissé.",
      "L’approbation est acquise ; le passage à la mobilisation effective des fonds reste à suivre.",
      "Le projet est en phase d’exécution ; les résultats restent à confirmer lors de la réception.",
      "Les conditions d’entrée en vigueur sont remplies ; le calendrier de paiement reste ouvert."
    ],
    "a": 1,
    "x": "L’approbation, la signature, l’entrée en vigueur, le décaissement et les résultats sont des statuts distincts.",
    "lv": 4,
    "family": "mastery-afdb-10",
    "trap": "institution",
    "why": [
      "Le cas dit qu’aucun décaissement n’est enregistré ; mobilisation effective et approbation ne se confondent pas.",
      "L’approbation, la signature, l’entrée en vigueur, le décaissement et les résultats sont des statuts distincts.",
      "Le passage à l’exécution physique n’est pas indiqué par les faits fournis.",
      "Aucune information ne permet de déclarer les conditions d’entrée en vigueur remplies."
    ]
  },
  {
    "id": "mastery-afdb-11",
    "d": "afdb",
    "fr": "Deux tracés routiers ont un coût initial proche. Le tracé court traverse une zone d’inondation récurrente ; le second allonge le trajet mais préserve mieux le service pendant les crues. Quelle comparaison éclaire le choix le plus directement ?",
    "o": [
      "Les coûts initiaux et le gain de temps mesuré pendant la saison sèche.",
      "Les émissions de construction et l’obtention d’un label environnemental pour chaque tracé.",
      "Les coûts sur la durée de vie et la continuité du service dans plusieurs scénarios climatiques.",
      "Les besoins de réparation des ouvrages existants et le trafic actuel sur le tracé court."
    ],
    "a": 2,
    "x": "Le risque climatique décrit concerne la pérennité du service ; il faut intégrer entretien, interruptions et scénarios.",
    "lv": 4,
    "family": "mastery-afdb-11",
    "trap": "institution",
    "source": "strategy",
    "why": [
      "Cette comparaison ignore précisément le risque d’interruption qui distingue les deux tracés.",
      "Les émissions sont pertinentes pour l’atténuation, mais ne répondent pas au risque d’inondation posé.",
      "Le risque climatique décrit concerne la pérennité du service ; il faut intégrer entretien, interruptions et scénarios.",
      "Ces données peuvent aider, mais ne comparent pas la résilience des deux nouveaux tracés."
    ]
  },
  {
    "id": "mastery-afdb-12",
    "d": "afdb",
    "fr": "Une présentation décrit les ressources mobilisées pour FAD-17, cycle 2026–2028, comme des fonds déjà reçus par tous les bénéficiaires des projets. Quelle rectification est nécessaire ?",
    "o": [
      "Séparer les ressources FAD des ressources BAD, puis maintenir l’équivalence avec les dépenses des projets.",
      "Séparer les engagements des donateurs africains de ceux des autres donateurs pour estimer les résultats atteints.",
      "Séparer le financement en prêts du financement en dons pour établir le montant déjà reçu par les usagers.",
      "Séparer les ressources du cycle de reconstitution des décaissements effectifs de chaque opération."
    ],
    "a": 3,
    "x": "Une reconstitution mobilise des ressources pour un cycle ; elle ne prouve ni décaissements projet par projet ni réception par les usagers.",
    "lv": 4,
    "family": "mastery-afdb-12",
    "trap": "institution",
    "source": "adf17",
    "why": [
      "Distinguer les guichets ne corrige pas la confusion entre ressources et dépenses réalisées.",
      "L’origine des contributions ne démontre pas la mise en œuvre ni les résultats.",
      "La nature de l’instrument ne permet pas, sans données de décaissement, de connaître les montants reçus.",
      "Une reconstitution mobilise des ressources pour un cycle ; elle ne prouve ni décaissements projet par projet ni réception par les usagers."
    ]
  },
  {
    "id": "mastery-afdb-13",
    "d": "afdb",
    "fr": "Une ligne électrique relie deux pays. Les postes sont installés, mais les échanges restent limités par l’absence d’accord opérationnel sur les transactions. Quelle intervention complète le plus directement les deux High 5 concernés ?",
    "o": [
      "Finaliser les règles d’échange pour transformer la connexion physique en service énergétique régional.",
      "Accroître la production nationale pour utiliser davantage les postes déjà installés.",
      "Subventionner les raccordements domestiques pour accroître la demande des ménages.",
      "Former les usagers industriels pour développer l’utilisation productive de l’électricité."
    ],
    "a": 0,
    "x": "Le goulot posé est institutionnel et transfrontalier : énergie et intégration exigent ici des règles d’échange opérationnelles.",
    "lv": 4,
    "family": "mastery-afdb-13",
    "trap": "institution",
    "source": "strategy",
    "why": [
      "Le goulot posé est institutionnel et transfrontalier : énergie et intégration exigent ici des règles d’échange opérationnelles.",
      "Davantage de production ne résout pas directement l’absence d’accord sur les transactions.",
      "Des raccordements peuvent améliorer l’accès domestique, mais le blocage décrit porte sur les échanges entre pays.",
      "L’usage productif est pertinent ; il ne lève pas la contrainte de transaction régionale."
    ]
  },
  {
    "id": "mastery-afdb-14",
    "d": "afdb",
    "fr": "Un projet en zone fragile dispose d’un site sécurisé. Les communes voisines contestent toutefois la distribution des emplois et le mécanisme local de médiation fonctionne mal. Quelle priorité de diagnostic répond au risque restant ?",
    "o": [
      "Revoir le périmètre de sécurité du site et la coordination des patrouilles.",
      "Analyser l’accès aux bénéfices et les capacités locales de prévention et de traitement des tensions.",
      "Augmenter l’enveloppe des emplois sans revoir les règles de recrutement.",
      "Accélérer les travaux pour raccourcir la durée d’exposition du chantier."
    ],
    "a": 1,
    "x": "La fragilité ne se réduit pas à la sécurité physique : distribution des bénéfices et institutions locales affectent la pérennité.",
    "lv": 4,
    "family": "mastery-afdb-14",
    "trap": "institution",
    "source": "unPeace",
    "why": [
      "La sécurité du site est déjà traitée ; les contestations et la médiation sont les risques décrits.",
      "La fragilité ne se réduit pas à la sécurité physique : distribution des bénéfices et institutions locales affectent la pérennité.",
      "Un volume accru peut maintenir les mêmes exclusions si les règles d’accès restent inchangées.",
      "La rapidité ne résout pas directement les tensions sur l’accès aux emplois."
    ]
  },
  {
    "id": "mastery-afdb-15",
    "d": "afdb",
    "fr": "Dans un pilote fictif lié à un hub d’IA, le modèle fonctionne en laboratoire. Les agents locaux disposent de connexions instables et les responsabilités sur les données ne sont pas clarifiées. Quelle étape réduit le mieux le risque avant extension ?",
    "o": [
      "Augmenter la précision du modèle sur le même jeu de données du laboratoire.",
      "Acquérir davantage de licences afin de réduire le coût unitaire du déploiement.",
      "Tester l’usage en conditions locales et clarifier accès, compétences et gouvernance des données.",
      "Transférer la maintenance du modèle au fournisseur et étendre le pilote aux autres sites."
    ],
    "a": 2,
    "x": "Une performance technique isolée ne démontre pas une capacité d’usage responsable et fiable dans le contexte de déploiement.",
    "lv": 4,
    "family": "mastery-afdb-15",
    "trap": "institution",
    "source": "aihub",
    "why": [
      "Une meilleure précision en laboratoire ne résout pas les contraintes d’accès ni les responsabilités sur les données.",
      "Un coût unitaire réduit ne démontre pas la faisabilité ni l’utilité sur les sites.",
      "Une performance technique isolée ne démontre pas une capacité d’usage responsable et fiable dans le contexte de déploiement.",
      "Un contrat de maintenance ne suffit pas à clarifier toutes les responsabilités ni à tester l’usage local."
    ]
  },
  {
    "id": "mastery-afdb-16",
    "d": "afdb",
    "fr": "Une note attribue au Conseil la réception de chaque équipement livré dans une opération, tandis que l’équipe du projet prend les décisions stratégiques de financement. Quelle redistribution des responsabilités est la plus cohérente ?",
    "o": [
      "Confier au Conseil les seuls équipements de grande valeur et maintenir les décisions dans l’équipe.",
      "Confier au Conseil les réceptions contestées et à l’équipe les orientations jugées urgentes.",
      "Confier les deux fonctions à un comité mixte pour limiter les échanges entre niveaux.",
      "Distinguer la gouvernance des orientations et opérations de leur exécution quotidienne."
    ],
    "a": 3,
    "x": "La gouvernance supervise et décide selon ses compétences ; la réception courante relève de la mise en œuvre, dans les règles applicables.",
    "lv": 4,
    "family": "mastery-afdb-16",
    "trap": "institution",
    "why": [
      "Un seuil de valeur ne justifie pas cette inversion des fonctions de gouvernance et d’exécution.",
      "La contestation ou l’urgence appelle une voie adaptée, pas un transfert général de mandat.",
      "Un comité mixte n’efface pas les compétences et responsabilités de chaque niveau.",
      "La gouvernance supervise et décide selon ses compétences ; la réception courante relève de la mise en œuvre, dans les règles applicables."
    ]
  },
  {
    "id": "mastery-afdb-17",
    "d": "afdb",
    "fr": "Une évaluatrice a quitté une entreprise soumissionnaire il y a plusieurs années. Elle estime n’avoir plus d’intérêt financier et propose de noter les offres avant de demander un avis éthique. Quel point doit être traité d’abord ?",
    "o": [
      "Évaluer et gérer le lien déclaré avant participation, y compris son effet sur l’impartialité perçue.",
      "Vérifier son absence actuelle de parts puis considérer sa participation comme réglée.",
      "Comparer ses notes aux autres évaluateurs après dépouillement pour repérer un biais.",
      "Lui confier les critères techniques puisque le lien financier est déclaré comme terminé."
    ],
    "a": 0,
    "x": "Un conflit potentiel ou perçu peut exister sans intérêt financier actuel. Le traitement doit précéder la participation concernée.",
    "lv": 4,
    "family": "mastery-afdb-17",
    "trap": "institution",
    "source": "ethics",
    "why": [
      "Un conflit potentiel ou perçu peut exister sans intérêt financier actuel. Le traitement doit précéder la participation concernée.",
      "Les parts ne sont qu’un élément de l’analyse ; absence de parts n’équivaut pas à gestion complète du lien.",
      "Une comparaison tardive ne prévient pas le risque sur l’évaluation ni sa perception.",
      "Un lien peut affecter une appréciation technique autant qu’une appréciation financière."
    ]
  },
  {
    "id": "mastery-afdb-18",
    "d": "afdb",
    "fr": "Un État souhaite mobiliser davantage de ressources domestiques. Les déclarations fiscales augmentent, mais le recouvrement progresse peu et les entreprises évoquent des obligations complexes. Quel chantier complète le plus directement l’élargissement de la base ?",
    "o": [
      "Augmenter les taux affichés sur les contribuables déjà enregistrés pour obtenir davantage de recettes.",
      "Améliorer l’administration et la conformité en examinant coûts de formalisation et recouvrement.",
      "Accroître les emprunts extérieurs afin de financer les besoins pendant la formalisation.",
      "Réorienter les transferts de diaspora vers la consommation pour élargir la demande taxable."
    ],
    "a": 1,
    "x": "Le décalage entre déclarations et recettes appelle un diagnostic des capacités, de la conformité et des obstacles à la formalisation.",
    "lv": 4,
    "family": "mastery-afdb-18",
    "trap": "institution",
    "source": "mali2026",
    "why": [
      "Des taux plus élevés ne traitent pas directement les obstacles de conformité et peuvent en accroître le coût.",
      "Le décalage entre déclarations et recettes appelle un diagnostic des capacités, de la conformité et des obstacles à la formalisation.",
      "L’emprunt extérieur peut apporter des fonds, mais ne complète pas directement le recouvrement domestique décrit.",
      "Un effet de demande éventuel ne résout pas le goulot administratif posé."
    ]
  },
  {
    "id": "mastery-afdb-19",
    "d": "afdb",
    "fr": "Deux infrastructures régionales complémentaires sont achevées, mais des horaires et procédures incompatibles limitent leur utilisation conjointe. Quel indicateur révèle le mieux leur contribution effective à l’intégration ?",
    "o": [
      "La proportion des dépenses d’investissement consacrées à chacune des infrastructures.",
      "La hausse du nombre de partenariats institutionnels signés pour la phase d’investissement.",
      "La réduction des délais et frictions sur le trajet utilisant les deux infrastructures.",
      "La capacité technique installée dans chaque infrastructure avant leur mise en service."
    ],
    "a": 2,
    "x": "L’intégration se mesure ici par le fonctionnement du service de bout en bout, et pas seulement par les installations.",
    "lv": 4,
    "family": "mastery-afdb-19",
    "trap": "institution",
    "source": "regional2026",
    "why": [
      "La répartition des dépenses renseigne le financement, pas l’interopérabilité effective.",
      "Des accords signés peuvent être des jalons, sans montrer que les horaires et procédures fonctionnent ensemble.",
      "L’intégration se mesure ici par le fonctionnement du service de bout en bout, et pas seulement par les installations.",
      "La capacité de chaque élément ne démontre pas la performance de leur combinaison."
    ]
  },
  {
    "id": "mastery-africa-0",
    "d": "africa",
    "fr": "Le principal en devises d’une dette reste inchangé. Après une dépréciation, son équivalent en monnaie locale augmente ; aucune nouvelle émission ni capitalisation d’intérêts n’a eu lieu. Quel mécanisme explique directement cette variation ?",
    "o": [
      "La revalorisation en monnaie locale du principal libellé en devises.",
      "L’accroissement du principal en devises à la suite du coût de refinancement.",
      "L’accumulation d’intérêts échus incorporés dans le montant nominal du prêt.",
      "La conversion d’un déficit primaire en nouveaux engagements envers les prêteurs."
    ],
    "a": 0,
    "x": "À montant en devises inchangé, une dépréciation accroît sa contre-valeur en monnaie locale.",
    "lv": 4,
    "family": "mastery-africa-0",
    "trap": "development",
    "why": [
      "À montant en devises inchangé, une dépréciation accroît sa contre-valeur en monnaie locale.",
      "Le cas exclut une augmentation du principal en devises et une nouvelle émission.",
      "Le cas exclut la capitalisation d’intérêts ; ce canal ne correspond pas aux faits.",
      "Aucun nouvel engagement n’est décrit : le changement posé est un effet de conversion."
    ]
  },
  {
    "id": "mastery-africa-1",
    "d": "africa",
    "fr": "Entre deux années comparables, le PIB réel augmente mais le PIB réel par habitant diminue. Les séries utilisent le même périmètre statistique. Quelle explication est compatible avec ces deux faits ?",
    "o": [
      "La hausse du niveau général des prix a dépassé celle de la production réelle.",
      "La population a augmenté plus rapidement que le PIB réel.",
      "La part du revenu détenue par les ménages aisés a augmenté.",
      "Le taux de change s’est déprécié davantage que la croissance réelle."
    ],
    "a": 1,
    "x": "Le PIB réel par habitant rapporte la production réelle à la population ; leur croissance relative explique cette divergence.",
    "lv": 4,
    "family": "mastery-africa-1",
    "trap": "development",
    "why": [
      "Le caractère réel retire l’effet des prix ; l’inflation n’explique pas à elle seule la divergence posée.",
      "Le PIB réel par habitant rapporte la production réelle à la population ; leur croissance relative explique cette divergence.",
      "Une répartition plus inégale ne change pas, à elle seule, le quotient PIB réel/population.",
      "Une variation de change n’établit pas cette divergence dans des séries réelles de périmètre inchangé."
    ]
  },
  {
    "id": "mastery-africa-2",
    "d": "africa",
    "fr": "Un projet d’irrigation améliore le rendement moyen. Les ménages en aval perdent une partie de leur accès à l’eau et ne figurent pas dans l’enquête auprès des producteurs bénéficiaires. Quel complément d’évaluation répond à cette limite ?",
    "o": [
      "Désagréger le rendement entre les cultures des producteurs déjà enquêtés.",
      "Comparer le rendement moyen au rendement national des mêmes cultures.",
      "Inclure les ménages en aval et mesurer les effets distributifs et l’accès à l’eau.",
      "Mesurer la satisfaction des producteurs et le coût d’entretien du périmètre."
    ],
    "a": 2,
    "x": "Il faut intégrer un groupe affecté mais absent du dispositif, ainsi que l’effet négatif qui n’est pas mesuré.",
    "lv": 4,
    "family": "mastery-africa-2",
    "trap": "development",
    "why": [
      "La désagrégation est utile, mais reste dans la population bénéficiaire et ignore les ménages en aval.",
      "Un benchmark de rendement n’évalue pas la perte d’accès à l’eau des ménages exclus.",
      "Il faut intégrer un groupe affecté mais absent du dispositif, ainsi que l’effet négatif qui n’est pas mesuré.",
      "Satisfaction des bénéficiaires et maintenance ne remplacent pas l’évaluation des effets sur les non-bénéficiaires."
    ]
  },
  {
    "id": "mastery-africa-3",
    "d": "africa",
    "fr": "Une route transfrontalière est achevée et le temps de conduite baisse. Le temps total de transport reste élevé, surtout à la frontière, malgré un trafic modéré. Quelle enquête est la plus directement justifiée ?",
    "o": [
      "Examiner la nécessité d’élargir les voies sur le tronçon routier déjà achevé.",
      "Examiner une réduction du prix des véhicules pour augmenter le nombre de transporteurs.",
      "Examiner la création d’un entrepôt de production supplémentaire près des fermes.",
      "Examiner les formalités, contrôles et modalités de traitement au passage frontalier."
    ],
    "a": 3,
    "x": "Le retard localisé à la frontière justifie d’abord un diagnostic des frictions de passage.",
    "lv": 4,
    "family": "mastery-africa-3",
    "trap": "development",
    "why": [
      "Le temps de conduite a baissé et le trafic est modéré : un défaut de capacité routière n’est pas le goulot posé.",
      "Davantage de transporteurs ne traite pas directement le temps d’attente à la frontière.",
      "Un entrepôt peut aider la logistique, mais ne traite pas directement le blocage observé au passage.",
      "Le retard localisé à la frontière justifie d’abord un diagnostic des frictions de passage."
    ]
  },
  {
    "id": "mastery-africa-4",
    "d": "africa",
    "fr": "Une station de pompage remplace du diesel par du solaire ; une réserve d’eau est aussi créée pour maintenir le service pendant les sécheresses. Comment qualifier ces deux composantes climatiques ?",
    "o": [
      "Le solaire peut contribuer à l’atténuation ; la réserve vise l’adaptation au choc de sécheresse.",
      "Le solaire relève de l’adaptation ; la réserve relève de l’atténuation par stockage d’eau.",
      "Les deux relèvent de l’atténuation puisqu’elles réduisent les effets du changement climatique.",
      "Les deux relèvent de l’adaptation puisque leur objectif commun est le service d’eau."
    ],
    "a": 0,
    "x": "La substitution au diesel peut réduire les émissions ; la réserve réduit la vulnérabilité du service aux sécheresses. Une analyse de l’eau reste nécessaire.",
    "lv": 4,
    "family": "mastery-africa-4",
    "trap": "development",
    "why": [
      "La substitution au diesel peut réduire les émissions ; la réserve réduit la vulnérabilité du service aux sécheresses. Une analyse de l’eau reste nécessaire.",
      "Le stockage d’eau n’est pas, par cette seule fonction, une réduction des émissions.",
      "Réduire la vulnérabilité aux effets et réduire les émissions sont deux mécanismes distincts.",
      "Un objectif de service commun n’efface pas la contribution de la substitution énergétique à l’atténuation."
    ]
  },
  {
    "id": "mastery-africa-5",
    "d": "africa",
    "fr": "Les crédits d’éducation augmentent. Des audits constatent toutefois des achats livrés après l’année scolaire et des enseignants absents. Les acquis stagnent. Quelle analyse complète le mieux le suivi budgétaire ?",
    "o": [
      "Comparer les crédits votés au budget d’éducation des pays voisins.",
      "Relier exécution effective, disponibilité des intrants et qualité de l’enseignement aux acquis.",
      "Mesurer les intentions de dépenses des établissements pour l’année suivante.",
      "Comparer le volume des manuels commandés au nombre d’élèves inscrits."
    ],
    "a": 1,
    "x": "Le cas signale une rupture entre ressources, mise à disposition et enseignement ; le suivi doit examiner cette chaîne.",
    "lv": 4,
    "family": "mastery-africa-5",
    "trap": "development",
    "why": [
      "Un benchmark des crédits ne vérifie pas les retards de livraison ni la présence en classe.",
      "Le cas signale une rupture entre ressources, mise à disposition et enseignement ; le suivi doit examiner cette chaîne.",
      "Les intentions futures n’expliquent pas les difficultés d’exécution actuelles.",
      "Une commande ne prouve pas une livraison utilisable à temps ni la qualité de l’enseignement."
    ]
  },
  {
    "id": "mastery-africa-6",
    "d": "africa",
    "fr": "Des agricultrices connaissent le crédit proposé et expriment un besoin de financement. Leur revenu est saisonnier, mais les échéances sont mensuelles dès le versement. Peu d’entre elles signent. Quel examen est prioritaire ?",
    "o": [
      "Renforcer la campagne d’information dans les mêmes villages avant la prochaine saison.",
      "Réduire la durée d’instruction des dossiers sans modifier les échéances du crédit.",
      "Tester l’adéquation du calendrier de remboursement aux flux de trésorerie des exploitantes.",
      "Élargir le nombre de guichets afin de rapprocher l’offre des exploitations."
    ],
    "a": 2,
    "x": "Le cas fournit un obstacle de conception du produit : des remboursements avant les revenus peuvent limiter l’adoption.",
    "lv": 4,
    "family": "mastery-africa-6",
    "trap": "development",
    "why": [
      "L’offre est connue ; une information supplémentaire ne traite pas directement le décalage de flux.",
      "Une instruction plus rapide ne rend pas le calendrier de remboursement compatible avec les revenus.",
      "Le cas fournit un obstacle de conception du produit : des remboursements avant les revenus peuvent limiter l’adoption.",
      "La proximité peut être utile, mais aucune contrainte géographique n’est décrite ici."
    ]
  },
  {
    "id": "mastery-africa-7",
    "d": "africa",
    "fr": "Des investisseurs proposent déjà de financer intégralement un projet aux conditions prévues. Un financement concessionnel est demandé, sans changement attendu de risque, de service ni de participation privée. Que faut-il établir avant de justifier ce soutien catalytique ?",
    "o": [
      "Le gain de rentabilité des investisseurs par rapport à leur offre commerciale actuelle.",
      "Le montant de la concession permettant d’accélérer la signature des offres existantes.",
      "La répartition de la concession entre investisseurs selon leurs contributions respectives.",
      "L’obstacle qu’il lèverait et l’apport additionnel par rapport au financement déjà disponible."
    ],
    "a": 3,
    "x": "La concession doit avoir une justification liée à un obstacle et à un apport additionnel, plutôt qu’être une subvention sans effet démontré.",
    "lv": 4,
    "family": "mastery-africa-7",
    "trap": "development",
    "why": [
      "Une meilleure rentabilité privée ne prouve pas que des capitaux ou un service additionnels sont mobilisés.",
      "Une signature accélérée peut être utile, mais doit être reliée à une contrainte et un effet additionnel démontrés.",
      "La distribution d’un soutien ne justifie pas l’existence de ce soutien.",
      "La concession doit avoir une justification liée à un obstacle et à un apport additionnel, plutôt qu’être une subvention sans effet démontré."
    ]
  },
  {
    "id": "mastery-africa-8",
    "d": "africa",
    "fr": "Un dispositif agricole maintient ses résultats pendant une sécheresse légère. Son stockage et ses réserves n’ont pas été testés face à une saison entière sans pluie. Quelle conclusion sur la résilience est soutenue ?",
    "o": [
      "La résistance au choc observé est documentée ; la résistance à un choc plus sévère reste à tester.",
      "La résistance à une saison sèche est établie si le dispositif a consommé toutes ses réserves.",
      "La résistance aux chocs sévères peut être estimée par la seule moyenne des résultats annuels.",
      "La résistance est comparable à celle des projets voisins ayant le même budget d’équipement."
    ],
    "a": 0,
    "x": "Une observation sous un choc léger fournit de l’information, mais ne démontre pas la performance au-delà du choc testé.",
    "lv": 4,
    "family": "mastery-africa-8",
    "trap": "development",
    "why": [
      "Une observation sous un choc léger fournit de l’information, mais ne démontre pas la performance au-delà du choc testé.",
      "L’épuisement des réserves ne prouve pas leur suffisance pour une période plus longue.",
      "Une moyenne peut masquer l’intensité et la durée du choc ainsi que les seuils de défaillance.",
      "Un budget semblable ne démontre pas des capacités, une exposition ou une performance comparables."
    ]
  },
  {
    "id": "mastery-africa-9",
    "d": "africa",
    "fr": "Une assurance verse une indemnité si la pluie mesurée par une station passe sous un seuil. Une exploitation subit une perte grave, mais la station enregistre une pluie supérieure au seuil. Quel problème spécifique est illustré ?",
    "o": [
      "Un risque de crédit lié à l’incapacité de l’assureur à verser une indemnité due.",
      "Un risque de base entre le déclencheur indiciel et la perte effectivement subie.",
      "Un aléa moral provoqué par une réduction de l’effort de production après souscription.",
      "Une sélection adverse liée à la souscription des seules exploitations à risque élevé."
    ],
    "a": 1,
    "x": "L’indice ne reflète pas nécessairement la perte individuelle ; une perte peut survenir sans déclenchement contractuel.",
    "lv": 4,
    "family": "mastery-africa-9",
    "trap": "development",
    "why": [
      "Le cas ne dit pas qu’une indemnité due ne peut être payée ; le seuil n’est pas franchi.",
      "L’indice ne reflète pas nécessairement la perte individuelle ; une perte peut survenir sans déclenchement contractuel.",
      "Aucun changement de comportement après souscription n’est décrit.",
      "Aucune information sur le profil des souscripteurs ne permet ce diagnostic."
    ]
  },
  {
    "id": "mastery-africa-10",
    "d": "africa",
    "fr": "Une usine transforme localement une matière première. Elle utilise des équipements importés, peu de fournisseurs locaux et des contrats temporaires. Quel examen éclaire le mieux sa contribution à la transformation structurelle ?",
    "o": [
      "Le volume brut traité et la part de ce volume portant une marque nationale.",
      "La progression des dépenses d’équipement par rapport au coût initialement prévu.",
      "Les liens productifs locaux, les compétences, la valeur ajoutée et la pérennité des emplois.",
      "Le nombre de contrats signés et leur répartition entre les phases de construction."
    ],
    "a": 2,
    "x": "La transformation locale ne suffit pas à établir des liens productifs, un apprentissage ou des emplois durables ; il faut examiner ces effets.",
    "lv": 4,
    "family": "mastery-africa-10",
    "trap": "development",
    "why": [
      "Un volume et une marque ne démontrent pas l’étendue des liens locaux ni les compétences créées.",
      "Une dépense d’équipement renseigne l’investissement, pas la qualité des effets structurels.",
      "La transformation locale ne suffit pas à établir des liens productifs, un apprentissage ou des emplois durables ; il faut examiner ces effets.",
      "Les contrats de construction ne décrivent pas les emplois et capacités de la phase d’exploitation."
    ]
  },
  {
    "id": "mastery-africa-11",
    "d": "africa",
    "fr": "Les recettes publiques dépendent surtout d’une matière première dont le cours chute. Un fonds de stabilisation amortit le choc pendant quelques mois. Quel risque de moyen terme reste à traiter ?",
    "o": [
      "Le calendrier de versement du fonds, indépendamment de la structure des recettes.",
      "La hausse de la demande intérieure liée à l’utilisation temporaire du fonds.",
      "Le coût d’administration du fonds par rapport aux dépenses de fonctionnement.",
      "La concentration des recettes et leur exposition persistante à un choc sectoriel."
    ],
    "a": 3,
    "x": "Une réserve de stabilisation peut amortir un choc, mais ne diversifie pas par elle-même les sources de recettes.",
    "lv": 4,
    "family": "mastery-africa-11",
    "trap": "development",
    "why": [
      "Le calendrier compte pour la liquidité ; il ne résout pas la vulnérabilité structurelle de moyen terme.",
      "L’effet de demande n’élimine pas la dépendance budgétaire au cours d’une matière première.",
      "Le coût administratif peut compter, mais n’est pas le risque structurel mis en évidence.",
      "Une réserve de stabilisation peut amortir un choc, mais ne diversifie pas par elle-même les sources de recettes."
    ]
  },
  {
    "id": "mastery-africa-12",
    "d": "africa",
    "fr": "Le revenu moyen des bénéficiaires augmente. Les ménages initialement les plus pauvres connaissent une baisse, tandis que quelques grands producteurs gagnent beaucoup. Quelle conclusion faut-il retenir ?",
    "o": [
      "Le gain moyen coexiste avec une détérioration pour un groupe ; l’inclusion n’est pas démontrée par la moyenne.",
      "Le gain moyen établit une amélioration de l’inclusion si le nombre total de bénéficiaires reste stable.",
      "La baisse chez les plus pauvres peut être compensée dans l’évaluation par le gain des grands producteurs.",
      "Le groupe des plus pauvres devrait être exclu du calcul pour comparer les producteurs à capacité similaire."
    ],
    "a": 0,
    "x": "La moyenne et la distribution répondent à des questions différentes ; un résultat agrégé positif peut masquer un effet distributif négatif.",
    "lv": 4,
    "family": "mastery-africa-12",
    "trap": "development",
    "why": [
      "La moyenne et la distribution répondent à des questions différentes ; un résultat agrégé positif peut masquer un effet distributif négatif.",
      "Un effectif stable ne prouve pas une répartition inclusive des gains.",
      "Une compensation arithmétique n’établit pas une compensation effectivement reçue par les ménages affectés.",
      "Exclure le groupe affecté masquerait la question d’inclusion au lieu de l’évaluer."
    ]
  },
  {
    "id": "mastery-africa-13",
    "d": "africa",
    "fr": "Une consultation en ligne compte de nombreuses réponses. Le réseau couvre surtout les centres urbains, tandis que le projet vise aussi des zones rurales peu connectées. Quelle mesure réduit le plus directement le risque de généralisation ?",
    "o": [
      "Prolonger le formulaire en ligne pour accroître le nombre de réponses du même canal.",
      "Recueillir aussi les avis des publics mal couverts par un mode de consultation accessible.",
      "Pondérer chaque réponse par le temps passé sur le formulaire pour privilégier les avis détaillés.",
      "Sélectionner au hasard des réponses déjà reçues afin de constituer un échantillon plus petit."
    ],
    "a": 1,
    "x": "Il faut traiter la couverture de la population visée, et pas seulement la taille des réponses disponibles.",
    "lv": 4,
    "family": "mastery-africa-13",
    "trap": "development",
    "why": [
      "Un effectif plus grand dans le même canal peut conserver le biais de couverture.",
      "Il faut traiter la couverture de la population visée, et pas seulement la taille des réponses disponibles.",
      "Le temps de réponse n’informe pas la représentation des populations absentes.",
      "Un tirage au hasard parmi les répondants ne crée pas de représentation des non-couverts."
    ]
  },
  {
    "id": "mastery-africa-14",
    "d": "africa",
    "fr": "Une subvention énergétique générale coûte cher et bénéficie davantage aux gros consommateurs. Un registre social existe, mais exclut certains ménages vulnérables et les transferts arrivent parfois tard. Quelle analyse convient avant une réforme ?",
    "o": [
      "Remplacer la subvention par un transfert ciblé en utilisant le registre sans correction préalable.",
      "Maintenir la subvention jusqu’à ce que le registre couvre tous les ménages sans exception.",
      "Comparer les options en intégrant ciblage réel, couverture, calendrier et effets sur les ménages exposés.",
      "Réduire le montant de la subvention uniformément et évaluer ensuite les pertes de couverture."
    ],
    "a": 2,
    "x": "Un ciblage théoriquement meilleur peut échouer par exclusions ou retards ; la comparaison doit intégrer mise en œuvre et protection.",
    "lv": 4,
    "family": "mastery-africa-14",
    "trap": "development",
    "why": [
      "Le registre présente déjà des exclusions ; un transfert mal ciblé peut ne pas protéger les ménages exposés.",
      "Attendre une perfection du registre ignore les options de correction et les coûts du maintien.",
      "Un ciblage théoriquement meilleur peut échouer par exclusions ou retards ; la comparaison doit intégrer mise en œuvre et protection.",
      "Une réduction préalable sans évaluer l’exposition et les protections traite les risques après leur réalisation."
    ]
  },
  {
    "id": "mastery-africa-15",
    "d": "africa",
    "fr": "Un rapport compte des emplois sur un chantier puis des emplois dans l’exploitation. Certaines personnes figurent dans les deux listes ; plusieurs emplois ont remplacé une activité existante. Quel contrôle améliore l’interprétation du bilan ?",
    "o": [
      "Additionner les contrats des deux phases et conserver le total comme nombre de personnes employées.",
      "Retenir les emplois d’exploitation comme créations nettes dès lors que leur durée est plus longue.",
      "Compter les personnes une seule fois sans examiner leurs activités antérieures ni les durées.",
      "Distinguer personnes, périodes, qualité des emplois et créations nettes liées au projet."
    ],
    "a": 3,
    "x": "Le bilan doit éviter doubles comptes et confusion entre contrats, personnes et emplois nets additionnels.",
    "lv": 4,
    "family": "mastery-africa-15",
    "trap": "development",
    "why": [
      "Une même personne peut signer plusieurs contrats ; leur somme n’est pas un nombre de personnes uniques.",
      "Une durée plus longue n’établit pas l’additionnalité ni l’absence de substitution à une autre activité.",
      "La déduplication est nécessaire mais ne suffit pas à établir durée, qualité et création nette.",
      "Le bilan doit éviter doubles comptes et confusion entre contrats, personnes et emplois nets additionnels."
    ]
  },
  {
    "id": "mastery-africa-16",
    "d": "africa",
    "fr": "Une infrastructure a une utilité sociale élevée. Ses recettes en monnaie locale sont incertaines, sa dette est en devises et ses dépenses d’entretien sont peu documentées. Quel examen est déterminant avant de conclure à sa soutenabilité financière ?",
    "o": [
      "Tester revenus, change, entretien et obligations de dette dans des scénarios défavorables.",
      "Valoriser les bénéfices sociaux pour les comparer au principal de la dette à sa date de signature.",
      "Comparer le taux du prêt à celui d’opérations similaires financées par le même bailleur.",
      "Étaler la maturité du prêt pour aligner le premier remboursement sur l’ouverture de l’ouvrage."
    ],
    "a": 0,
    "x": "La valeur sociale ne remplace pas les flux disponibles pour entretien et remboursement, ni l’analyse du risque de change.",
    "lv": 4,
    "family": "mastery-africa-16",
    "trap": "development",
    "why": [
      "La valeur sociale ne remplace pas les flux disponibles pour entretien et remboursement, ni l’analyse du risque de change.",
      "Une analyse socioéconomique est utile, mais ne démontre pas la liquidité permettant de payer les échéances.",
      "Un taux comparable ne prouve pas la capacité du projet à rembourser dans son contexte.",
      "Un calendrier adapté peut aider, mais ne remplace pas le test des revenus, du change et de l’entretien."
    ]
  },
  {
    "id": "mastery-africa-17",
    "d": "africa",
    "fr": "Un emprunteur agricole déclare avoir utilisé une partie du crédit pour une urgence familiale. L’équipe ne dispose pas encore du contrat ni des justificatifs. Quelle conclusion est défendable à ce stade ?",
    "o": [
      "L’usage constitue un détournement intentionnel dès lors qu’il concerne une dépense familiale.",
      "L’usage déclaré diffère de la destination initiale ; conformité et intention restent à établir.",
      "L’usage est conforme au crédit agricole dès lors que le remboursement demeure possible.",
      "L’usage n’a pas d’effet sur le projet si l’emprunteur promet de remettre les fonds avant la récolte."
    ],
    "a": 1,
    "x": "Il faut distinguer fait déclaré, obligation contractuelle et intention ; les éléments nécessaires à une qualification ne sont pas encore disponibles.",
    "lv": 4,
    "family": "mastery-africa-17",
    "trap": "development",
    "why": [
      "Une qualification intentionnelle exige davantage que la seule nature familiale de la dépense.",
      "Il faut distinguer fait déclaré, obligation contractuelle et intention ; les éléments nécessaires à une qualification ne sont pas encore disponibles.",
      "La capacité de remboursement ne détermine pas à elle seule la conformité à la destination contractuelle.",
      "Une promesse ne prouve pas l’absence d’effet sur les intrants, la production ou le remboursement."
    ]
  },
  {
    "id": "mastery-africa-18",
    "d": "africa",
    "fr": "Le revenu des producteurs participants augmente après un appui. Pendant la même période, le prix de vente augmente aussi dans les zones sans appui. Quel dispositif renforce le plus l’analyse de l’effet du projet ?",
    "o": [
      "Comparer le revenu final à la cible du projet et mesurer le taux d’atteinte de cette cible.",
      "Interroger les participants sur la part du changement qu’ils attribuent à l’appui reçu.",
      "Comparer les évolutions avec un groupe pertinent et examiner la sélection des participants et les autres facteurs.",
      "Comparer les participants les plus assidus à ceux qui ont suivi moins de formations."
    ],
    "a": 2,
    "x": "Une comparaison crédible aide à isoler l’effet, tout en exigeant un examen des différences initiales et de sélection.",
    "lv": 4,
    "family": "mastery-africa-18",
    "trap": "development",
    "why": [
      "L’atteinte d’une cible ne distingue pas le rôle du projet de celui des prix de vente.",
      "Les perceptions sont utiles mais ne suffisent pas à isoler une causalité du choc de prix commun.",
      "Une comparaison crédible aide à isoler l’effet, tout en exigeant un examen des différences initiales et de sélection.",
      "L’assiduité peut dépendre de caractéristiques qui affectent aussi le revenu ; la différence ne démontre pas l’effet de l’appui."
    ]
  },
  {
    "id": "mastery-africa-19",
    "d": "africa",
    "fr": "Deux réseaux énergétiques ont des capacités techniques compatibles. Les échanges ne se matérialisent pas car les opérateurs n’ont pas de règles communes de règlement et de responsabilité en cas d’incident. Quelle intervention répond au goulot identifié ?",
    "o": [
      "Accroître les capacités installées pour disposer d’une réserve technique supplémentaire.",
      "Unifier les tarifs de détail des ménages avant toute transaction entre les deux réseaux.",
      "Remplacer les compteurs des usagers afin de mieux connaître la consommation domestique.",
      "Convenir des modalités opérationnelles et financières nécessaires aux échanges entre opérateurs."
    ],
    "a": 3,
    "x": "La compatibilité physique est posée ; le blocage concerne les règles de transaction et de responsabilité.",
    "lv": 4,
    "family": "mastery-africa-19",
    "trap": "development",
    "why": [
      "Une réserve peut être utile, mais ne règle pas les obligations de paiement ni les responsabilités.",
      "L’unification des tarifs de détail n’est pas une condition posée pour régler les transactions entre opérateurs.",
      "Une meilleure mesure domestique ne traite pas directement les règles inter-opérateurs manquantes.",
      "La compatibilité physique est posée ; le blocage concerne les règles de transaction et de responsabilité."
    ]
  }
];
QUESTIONS.push(...MASTERY_QUESTIONS);
const TRAPS={"necessary": "Nécessaire ou suffisant", "scope": "Périmètre et catégories", "quantifier": "Tous, certains, aucun", "causality": "Causalité et contrefactuel", "chronology": "Chronologie", "converse": "Réciproque", "contrapositive": "Contraposée", "only": "Seuls et implications", "exception": "Exceptions", "negation": "Négations", "sufficient": "Condition suffisante", "sampling": "Échantillon et population", "aggregation": "Moyenne et cas individuels", "connective": "ET, OU et exclusions", "observation": "Observation et explication", "stages": "Étapes et statuts", "attribution": "Attribution d’un résultat", "compliance": "Obligation et conformité", "constraints": "Contraintes croisées", "detail": "Attention aux détails", "judgment": "Décision proportionnée", "institution": "Connaissance institutionnelle appliquée", "development": "Analyse du développement"};
SOURCES.bryqExperience={title:'Témoignage public Bryq — pression de lecture (Reddit, février 2025)',url:'https://www.reddit.com/r/recruitinghell/comments/1igxdr3/whoever_the_hell_thinks_bryq_assesssments_are/',date:'Témoignage anonyme consulté le 1er octobre 2026'};
SOURCES.verbalExperience={title:'Témoignage public — confusion Faux / Impossible (autre test, Reddit)',url:'https://www.reddit.com/r/TheCivilService/comments/1bvnkys/verbal_reasoning_test_never_have_i_felt_so_stupid/',date:'Témoignage anonyme consulté le 1er octobre 2026'};
