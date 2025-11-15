# HackToHorizon2 - Système de Gestion d'Inventaire

Système interactif de gestion d'inventaire avec visualisation sur plan d'étage.

## Démarrage Rapide

### Installation

```bash
npm install
```

### Génération des données

Pour convertir le fichier Excel en JSON :

```bash
npm run build:data
```

### Utilisation

Ouvrir `public/index.html` dans votre navigateur (redirige automatiquement vers `inventory.html`).

Ou directement :
- `public/inventory.html` - Page d'inventaire avec filtres complets
- `public/map.html` - Carte interactive des étages
- `public/statistics.html` - Statistiques détaillées

## Structure du Projet

```
HackToHorizon2/
├── src/              Code source (modules Node.js)
│   ├── modules/      Modules fonctionnels
│   ├── readers/      Lecteurs de données (CSV, Excel)
│   └── utils/        Utilitaires
├── public/           Interface web
│   ├── js/           JavaScript modulaire par page
│   ├── locales/      Fichiers de traduction (i18n)
│   ├── assets/       Images et ressources
│   └── data/         Données JSON générées
├── scripts/          Scripts de build et conversion
├── data/             Fichiers de données source (CSV/XLSX)
└── docs/             Documentation complète
```

## Fonctionnalités

### Inventaire (inventory.html)
- Gestion complète de l'inventaire
- Filtrage avancé sur la gauche :
  - Recherche textuelle
  - Filtre par étage
  - Filtre par salle
  - Filtre par type
  - Filtre par famille
  - Filtre par fournisseur
  - Filtre par utilisateur
- Affichage des données réelles depuis Excel

### Carte Interactive (map.html)
- Visualisation interactive sur plan d'étage
- Sélection par étage
- Plans d'étage haute résolution

### Statistiques (statistics.html)
- Statistiques détaillées
- Répartition par étage, famille, type
- Compteurs globaux

## Internationalisation

Le système utilise i18next pour la gestion des traductions.

- Français (par défaut)
- Anglais

Fichiers de traduction : `public/locales/{lang}/translation.json`

## Données

Les fichiers de données sont situés dans le dossier `data/` :
- `VIOTTE_Inventaire_20251114.csv`
- `VIOTTE_Inventaire_20251114.xlsx`

Les données sont automatiquement converties en JSON pour utilisation dans le navigateur.

## Architecture

### Code Professionnel
- Séparation des préoccupations (SoC)
- Modules JavaScript par fonctionnalité
- Traductions externalisées (pas de texte en dur)
- Lecteurs de données réutilisables
- Gestion d'erreurs appropriée

### Pages Séparées
Chaque fonctionnalité a sa propre page HTML pour une meilleure organisation :
- `inventory.html` - Inventaire
- `map.html` - Carte
- `statistics.html` - Statistiques

### Assets
Les assets sont maintenant dans `public/assets/` (pas de lien symbolique).

## Documentation

Voir le dossier `docs/` pour la documentation complète :
- Architecture et modules
- Guide de sécurité
- Guide d'intégration

## Licence

ISC
