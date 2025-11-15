# HackToHorizon Client - Système de Gestion d'Inventaire

Application web client pour la gestion d'inventaire de mobilier avec visualisation interactive sur plans d'étage.

## 🚀 Démarrage Rapide

### Prérequis
- Docker (pour l'option recommandée) OU un serveur HTTP pour servir les fichiers statiques
- L'API Backend .NET démarrée (voir le repository backend)

### Option 1 : Avec Docker (Recommandé) 🐳

**Option A : Avec Docker Compose (Plus simple)**
```bash
# Démarrer l'application
docker compose up -d

# Arrêter l'application
docker compose down
```

**Option B : Avec Docker CLI**
```bash
# Construire l'image
docker build -t hacktohorizon-client .

# Lancer le conteneur
docker run -d -p 8080:80 --name hacktohorizon-client hacktohorizon-client

# Arrêter le conteneur
docker stop hacktohorizon-client
docker rm hacktohorizon-client
```

Ensuite, ouvrir http://localhost:8080 dans votre navigateur.

### Option 2 : Sans Docker

**Avec Python 3**
```bash
cd public
python3 -m http.server 8080
```

**Avec PHP**
```bash
cd public
php -S localhost:8080
```

**Avec Node.js (http-server)**
```bash
npx http-server public -p 8080
```

Ensuite, ouvrir http://localhost:8080 dans votre navigateur.

### Configuration de l'API Backend

L'application se connecte à l'API .NET backend configurée par défaut sur :
- **HTTP** : `http://localhost:5281/api`
- **HTTPS** : `https://localhost:7201/api`

Assurez-vous que l'API backend est démarrée avant d'utiliser l'application.

## 📁 Structure du Projet

```
HackToHorizon-Client/
├── public/                      # Fichiers de l'application web
│   ├── index.html              # Page d'accueil (redirige vers inventory.html)
│   ├── inventory.html          # Gestion de l'inventaire
│   ├── map.html                # Carte interactive des étages
│   ├── statistics.html         # Statistiques et rapports
│   ├── reservation.html        # Réservation de mobilier
│   ├── styles.css              # Styles CSS globaux
│   │
│   ├── js/                     # Modules JavaScript
│   │   ├── apiService.js       # Service API (communication avec le backend)
│   │   ├── dataLoader.js       # Chargement et transformation des données
│   │   ├── inventory.js        # Logique de la page inventaire
│   │   ├── map.js              # Logique de la page carte
│   │   ├── interactiveMap.js   # Gestion de la carte interactive
│   │   ├── statistics.js       # Logique de la page statistiques
│   │   └── reservation.js      # Logique de la page réservation
│   │
│   └── images/             # Images
│       └── floors/         # Images des plans d'étage
│           ├── rdc.png
│           ├── 1.png
│           ├── 2.png
│           └── 3.png
│
└── README.md                   # Ce fichier
```

## ✨ Fonctionnalités

### 📦 Inventaire (inventory.html)
- **Affichage complet** de l'inventaire de mobilier
- **Filtrage avancé** :
  - Recherche textuelle
  - Filtre par étage
  - Filtre par salle
  - Filtre par type de mobilier
  - Filtre par famille
  - Filtre par fournisseur
  - Filtre par utilisateur
- Interface responsive et moderne
- Chargement dynamique depuis l'API backend

### 🗺️ Carte Interactive (map.html)
- **Visualisation sur plans d'étage** haute résolution
- Sélection et navigation entre les étages
- **Points interactifs** positionnés sur la carte
- **Tooltips informatifs** au survol des points
- Groupement automatique des items par salle
- Animations et effets visuels

### 📊 Statistiques (statistics.html)
- Vue d'ensemble de l'inventaire
- Répartition par étage, famille, et type
- Compteurs et graphiques
- Statistiques en temps réel depuis l'API

### 📅 Réservation (reservation.html)
- **Recherche de mobilier** par référence, désignation ou code-barre
- **Sélection de période** de réservation (date et heure)
- **Formulaire utilisateur** complet
- **Vérification de disponibilité** en temps réel
- Gestion des états (disponible/réservé)
- Messages de confirmation et d'erreur

## 🔌 Intégration API

### Configuration
Le fichier `public/js/apiService.js` contient la configuration de l'API :

```javascript
const API_CONFIG = {
    baseURL: 'http://localhost:5281/api',
    httpsBaseURL: 'https://localhost:7201/api',
    timeout: 10000,
    useHttps: false
};
```

### Endpoints Utilisés
- `GET /api/furniture` - Liste de tous les meubles
- `GET /api/furniture/{id}` - Détails d'un meuble
- `GET /api/locations` - Liste des localisations
- `POST /api/reservations` - Créer une réservation
- etc.

### Gestion des Erreurs
- **Codes d'erreur standardisés** de l'API
- Classe `APIError` pour une gestion cohérente
- Affichage user-friendly des erreurs

## 🏗️ Architecture

L'application utilise une **architecture orientée objet (OOP)** moderne avec une séparation claire des responsabilités:

### Structure en Couches

```
View (HTML/CSS)
    ↓
Controllers (Présentation)
    ↓
Services (Logique Métier)
    ↓
Repositories (Accès aux Données)
    ↓
Core (Infrastructure)
```

### Organisation du Code

```
public/js/
├── core/              # Couche fondamentale
│   ├── ApiClient.js       # Client HTTP
│   └── Application.js     # Bootstrap
├── repositories/      # Accès aux données API
│   ├── FurnitureRepository.js
│   └── LocationRepository.js
├── services/          # Logique métier
│   └── InventoryService.js
├── controllers/       # Gestion des pages
│   ├── InventoryController.js
│   ├── MapController.js
│   └── StatisticsController.js
├── utils/             # Utilitaires
│   └── Utils.js
└── [legacy files]     # Ancien code (compatibilité)
```

**Pour plus de détails:** Consultez [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Patterns Utilisés

- **MVC (Model-View-Controller)**
- **Repository Pattern** pour l'accès aux données
- **Service Layer** pour la logique métier
- **Dependency Injection** via constructeurs
- **Factory Pattern** pour la création d'objets
- **Singleton** pour les services globaux

## 🎨 Technologies Utilisées

- **HTML5** - Structure des pages
- **CSS3** - Styles et animations (VIOTTE Graphic Charter)
- **JavaScript ES6+** - Logique applicative (Vanilla JS, pas de framework)
- **SVG** - Points interactifs sur la carte & logos
- **Fetch API** - Communication avec le backend
- **Google Fonts** - Montserrat (titres) & Open Sans (texte)

## 🎨 Design System

### Charte Graphique VIOTTE

L'application suit la charte graphique du bâtiment VIOTTE avec :

- **Palette de couleurs** : Marron foncé (#4A3F3A), Teal (#2C9BA6), Blanc
- **Typographies** : Montserrat (titres), Open Sans (texte)
- **Header** : Bandeau marron foncé avec logos aux extrémités
- **Navigation** : Style minimaliste avec indicateur teal pour l'onglet actif
- **Responsive Design** : Breakpoints à 768px et 1024px

**Documentation complète :**
- [Charte Graphique](docs/GRAPHIC_CHARTER.md) - Guide complet d'implémentation
- [Spécifications des Logos](docs/LOGO_SPECIFICATIONS.md) - Format et utilisation des logos

### Intégration des Logos

Pour intégrer vos logos :
1. Placer les fichiers SVG dans `/public/images/`
2. Utiliser les noms : `logo-viotte--white.svg` et `logo-partner--white.svg`
3. Modifier les divs `.header-logo-left` et `.header-logo-right` dans les fichiers HTML

Voir [docs/LOGO_SPECIFICATIONS.md](docs/LOGO_SPECIFICATIONS.md) pour les détails complets.

## 🏗️ Architecture

### Application Client-Side Pure
- **Aucune dépendance Node.js** pour le fonctionnement
- Tous les modules JS sont chargés directement par le navigateur
- Communication avec le backend via API REST

### Organisation Modulaire
- **Séparation des préoccupations** : chaque page a son propre fichier JS
- **Modules réutilisables** : apiService, dataLoader
- **Gestion d'erreurs centralisée**

### Pages Autonomes
Chaque fonctionnalité est une page indépendante :
- Navigation simple via menu de navigation
- Chargement optimisé des ressources nécessaires
- Partage des modules communs (API)

## 🔒 Sécurité

- **HTTPS supporté** pour les communications API
- **Validation côté client** des données de formulaire
- **Gestion des erreurs** sans exposer d'informations sensibles
- **Timeouts** configurés pour les requêtes API
- Pas de stockage de données sensibles dans localStorage

## 🌐 Support des Navigateurs

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Nécessite un navigateur moderne avec support de :
- ES6 JavaScript
- Fetch API
- localStorage
- SVG

## 📝 Développement

### Modifier la configuration API
Éditer `public/js/apiService.js` :
```javascript
const API_CONFIG = {
    baseURL: 'https://votre-api.com/api',
    // ...
};
```

### Ajouter un nouveau filtre
1. Ajouter le champ dans `inventory.html`
2. Mettre à jour la logique de filtrage dans `public/js/inventory.js`

## 🤝 Contribution

Ce projet fait partie de l'écosystème HackToHorizon :
- **Client** (ce repository) : Application web frontend
- **Backend** : API .NET Core

## 📄 Licence

ISC
