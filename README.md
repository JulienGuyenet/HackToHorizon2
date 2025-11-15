# HackToHorizon2 - Système de Gestion d'Inventaire

Système interactif de gestion d'inventaire avec visualisation sur plan d'étage.

## Démarrage Rapide

### Utilisation

Ouvrir `public/index.html` dans votre navigateur (redirige automatiquement vers `inventory.html`).

Ou servir les fichiers avec un serveur HTTP simple :

```bash
# Avec Python 3
cd public
python3 -m http.server 8080

# Avec PHP
cd public
php -S localhost:8080
```

Puis ouvrir http://localhost:8080 dans votre navigateur.

Pages disponibles :
- `public/inventory.html` - Page d'inventaire avec filtres complets
- `public/map.html` - Carte interactive des étages avec placement de points et tooltips
- `public/statistics.html` - Statistiques détaillées
- `public/reservation.html` - Réservation de mobilier

Pour utiliser la fonctionnalité de réservation, assurez-vous que l'API .NET est démarrée sur :
- `http://localhost:5000` (HTTP)
- ou `https://localhost:5001` (HTTPS)

## Structure du Projet

```
HackToHorizon2/
├── public/           Interface web et données
│   ├── js/           JavaScript modulaire par page
│   ├── locales/      Fichiers de traduction (i18n)
│   ├── assets/       Images et ressources
│   └── data/         Données JSON (inventory.json)
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
- **Points interactifs avec tooltips** : Affiche les informations des items au survol
- Support du placement de points sur la carte
- Groupement des items par salle

### Statistiques (statistics.html)
- Statistiques détaillées
- Répartition par étage, famille, type
- Compteurs globaux

### Réservation de Mobilier (reservation.html)
- Recherche et sélection de mobilier
- Choix de période de réservation (date/heure)
- Formulaire d'informations utilisateur
- Vérification de disponibilité
- Intégration avec l'API .NET
- Gestion des états (disponible/non disponible)
- Messages de succès/erreur
- Support multilingue complet

## Internationalisation (i18n)

Le système utilise i18next avec une configuration avancée pour la gestion des traductions.

### Langues Supportées
- Français (par défaut)
- Anglais

### Fonctionnalités i18n
- **Détection Intelligente de Langue** : localStorage → langue du navigateur → défaut (FR)
- **Lazy-loading** : Chargement à la demande des traductions avec cache navigateur
- **Header Accept-Language** : Envoyé automatiquement dans toutes les requêtes API
- **Persistance** : La préférence de langue est sauvegardée dans localStorage
- **Changement à Chaud** : Boutons FR/EN dans la navigation pour changer de langue instantanément
- **Attribut HTML lang** : Mis à jour automatiquement lors du changement de langue

### Gestion des Erreurs Localisées
- Codes d'erreur standardisés de l'API mappés vers des messages traduits
- Support des erreurs réseau, d'authentification, de ressources et de validation
- Classe `APIError` pour une gestion cohérente des erreurs

Fichiers de traduction : `public/locales/{lang}/translation.json`

## Données

Les données d'inventaire sont chargées dynamiquement depuis l'API .NET backend.

### Intégration API
- **Chargement Dynamique** : Les données sont récupérées via `apiService.js` qui communique avec l'API .NET
- **Transformation des Données** : Le module `dataLoader.js` transforme les réponses API en format attendu par l'UI
- **Gestion d'Erreurs** : Erreurs API avec messages localisés et codes d'erreur standardisés
- **Header Accept-Language** : Envoyé dans chaque requête pour respecter la préférence utilisateur

### Fichiers Source (Legacy)
Les fichiers source sont dans le dossier `data/` (pour référence uniquement) :
- `VIOTTE_Inventaire_20251114.csv`
- `VIOTTE_Inventaire_20251114.xlsx`

**Note** : Le système charge maintenant les données directement depuis l'API backend au lieu de fichiers JSON statiques.

## Architecture

### Code Professionnel
- Application 100% côté client (HTML/CSS/JavaScript)
- Pas de dépendances Node.js requises
- Séparation des préoccupations (SoC)
- Modules JavaScript par fonctionnalité
- Traductions externalisées (pas de texte en dur)
- Gestion d'erreurs appropriée
- Bibliothèques chargées depuis CDN (i18next)

### Pages Séparées
Chaque fonctionnalité a sa propre page HTML pour une meilleure organisation :
- `inventory.html` - Inventaire
- `map.html` - Carte interactive
- `statistics.html` - Statistiques
- `reservation.html` - Réservation de mobilier

### Carte Interactive
- Module `interactiveMap.js` : Gestion de la carte avec points et tooltips
- Affichage des points sur le plan d'étage
- Tooltips informatifs au survol des points
- Groupement des items par localisation
- Animation et effets visuels (pulse)

### API Integration
Le système intègre une API .NET complète pour la gestion des meubles :
- **Module `apiService.js`** : Wrapper complet pour tous les endpoints
  - Support des opérations CRUD pour Furniture, Location, et RFID
  - Gestion d'erreurs avec classe `APIError` et messages localisés
  - Configuration HTTPS/HTTP flexible
  - Header Accept-Language automatique pour respecter la langue utilisateur
- **Module `dataLoader.js`** : Couche d'abstraction pour le chargement de données
  - Chargement dynamique depuis l'API via `getAllFurniture()` et `getAllLocations()`
  - Transformation des données API vers le format attendu par l'UI
  - Gestion d'erreurs avec messages traduits
  - Interface compatible avec le code existant

### Gestion des Erreurs
- **Codes d'Erreur Standardisés** : L'API retourne des `error_code` (ex: `FURNITURE_NOT_FOUND`, `EMAIL_TAKEN`)
- **Mapping Local** : Les codes d'erreur sont mappés côté client vers des messages traduits
- **Erreurs Localisées** : Tous les messages d'erreur respectent la langue choisie par l'utilisateur
- **Types d'Erreurs** : Réseau, authentification, ressources, validation, logique métier

### Assets
Les assets sont dans `public/assets/` :
- Images des plans d'étage dans `assets/images/floors/`
- Autres ressources graphiques

## Documentation

Voir le dossier `docs/` pour la documentation complète :
- Architecture et modules
- Guide de sécurité
- Guide d'intégration

## Licence

ISC
