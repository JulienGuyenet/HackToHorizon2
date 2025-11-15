# 📦 HackToHorizon2 - Système de Gestion d'Inventaire

Système interactif de gestion d'inventaire avec visualisation sur plan d'étage, réorganisé selon les principes SOLID.

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install
```

### Utilisation

1. **Ouvrir l'interface web:**
   ```bash
   # Ouvrir public/index.html dans votre navigateur
   open public/index.html
   ```

2. **Tester le lecteur CSV (recommandé):**
   ```bash
   node test-csv-reader.js
   ```

3. **Tester avec l'ancien système (Excel):**
   ```bash
   node example-usage.js
   ```

## 📁 Structure du Projet

```
HackToHorizon2/
├── 📂 src/                      Code source réorganisé
│   ├── 📂 modules/              Modules principaux
│   │   ├── htmlGenerator.js    Génération de composants HTML
│   │   ├── interactiveMap.js   Carte interactive (client)
│   │   └── pointPlacer.js      Placement de points (client)
│   │
│   ├── 📂 readers/              Lecteurs de données
│   │   ├── dataReader.js       Interface unifiée de lecture
│   │   ├── csvReader.js        Lecteur CSV (SÉCURISÉ ✅)
│   │   └── excelReader.js      Lecteur Excel (legacy)
│   │
│   └── 📂 utils/                Utilitaires
│       ├── htmlSanitizer.js    Sécurisation HTML (anti-XSS)
│       ├── itemFilter.js       Filtrage d'items
│       └── locationParser.js   Parsing de localisations
│
├── 📂 public/                   Fichiers publics
│   ├── index.html              Interface principale ⭐
│   └── styles.css              Styles CSS
│
├── 📂 assets/                   Assets statiques
│   └── 📂 images/               Images du bâtiment
│       └── floor-plan.png      Plan d'étage
│
├── 📂 Documentation/            Documentation (legacy)
│   ├── README.md
│   ├── README_MODULES.md
│   ├── SECURITY.md
│   └── ...
│
└── 📄 Configuration
    ├── package.json
    ├── .gitignore
    └── test-csv-reader.js
```

## ✨ Nouvelles Fonctionnalités

### 🔒 Sécurité Améliorée

- ✅ **Lecteur CSV natif** sans dépendances externes
- ✅ **Sanitisation HTML** pour prévenir les attaques XSS
- ✅ **Validation des entrées** utilisateur
- ✅ **Séparation des responsabilités** pour un code plus sûr

### 🏗️ Architecture SOLID

1. **S - Single Responsibility Principle**
   - Chaque module a une responsabilité unique
   - `csvReader.js` : lecture CSV uniquement
   - `htmlSanitizer.js` : sécurisation HTML uniquement
   - `itemFilter.js` : filtrage d'items uniquement

2. **O - Open/Closed Principle**
   - Extensible via `dataReader.js` qui supporte CSV et Excel
   - Facile d'ajouter de nouveaux formats sans modifier le code existant

3. **L - Liskov Substitution Principle**
   - Les lecteurs CSV et Excel sont interchangeables
   - Interface commune via `dataReader.js`

4. **I - Interface Segregation Principle**
   - Interfaces spécifiques et ciblées
   - Chaque utilitaire expose uniquement les fonctions nécessaires

5. **D - Dependency Inversion Principle**
   - Dépend d'abstractions (`dataReader`) pas d'implémentations
   - Module principal dépend de l'interface, pas du lecteur spécifique

### 📊 Interface Web Complète

Le nouveau `public/index.html` offre :

- **Onglet Inventaire** : Liste complète avec filtres avancés
  - Recherche par nom, référence, code barre
  - Filtrage par étage et salle
  - Affichage en grille responsive

- **Onglet Carte Interactive** : Visualisation sur plan d'étage
  - Sélection d'étage
  - Points interactifs (à configurer)

- **Onglet Statistiques** : Analyses détaillées
  - Statistiques globales
  - Répartition par étage
  - Répartition par famille

- **Onglet À Propos** : Documentation et architecture

## 🔧 Utilisation des Modules

### Lecteur CSV (Recommandé)

```javascript
const csvReader = require('./src/readers/csvReader');

// Lire un fichier CSV
const items = csvReader.readCSVData('data.csv');

// Obtenir les étages uniques
const floors = csvReader.getUniqueFloors(items);

// Filtrer par étage
const floorItems = csvReader.filterByFloor(items, '1er etage');

// Exporter en JSON
csvReader.exportToJSON(items, 'output.json');
```

### Lecteur Unifié (Auto-détection)

```javascript
const dataReader = require('./src/readers/dataReader');

// Auto-détecte le format (CSV ou Excel)
const items = dataReader.readInventoryData('data.csv');

// Exporter
dataReader.exportToJSON(items, 'output.json');
```

### Génération HTML

```javascript
const htmlGenerator = require('./src/modules/htmlGenerator');
const { getUniqueFloors, filterByFloor } = require('./src/utils/itemFilter');

// Générer une carte d'item
const card = htmlGenerator.generateItemCard(item);

// Générer un panneau de filtres
const floors = getUniqueFloors(items);
const rooms = getUniqueRooms(items);
const filters = htmlGenerator.generateFilterPanel(floors, rooms);

// Générer des statistiques
const stats = htmlGenerator.generateStatistics(items);
```

### Filtrage d'Items

```javascript
const itemFilter = require('./src/utils/itemFilter');

// Filtrer par étage
const floorItems = itemFilter.filterByFloor(items, '1er etage');

// Filtrer par recherche
const searchResults = itemFilter.filterBySearch(items, 'fauteuil');

// Grouper par étage
const grouped = itemFilter.groupByFloor(items);
```

## 🔒 Sécurité

### Vulnérabilités Corrigées

1. **Dépendance xlsx** (vulnérabilités haute gravité)
   - ✅ **Solution** : Lecteur CSV natif sans dépendances
   - ✅ **Alternative** : Utiliser `csvReader.js` au lieu de `excelReader.js`

2. **Protection XSS**
   - ✅ **Solution** : Module `htmlSanitizer.js` dédié
   - ✅ Toutes les entrées utilisateur sont échappées

3. **Validation des entrées**
   - ✅ Parsing CSV sécurisé avec gestion des guillemets
   - ✅ Validation des chemins de fichiers

### Recommandations de Sécurité

Pour la production :
- [ ] Utiliser HTTPS uniquement
- [ ] Implémenter l'authentification utilisateur
- [ ] Ajouter des en-têtes CSP (Content Security Policy)
- [ ] Limiter la taille des fichiers uploadés
- [ ] Logger les accès et actions sensibles

## 📊 Données

### Format CSV Supporté

Le système lit le fichier `VIOTTE_Inventaire_20251114.csv` avec les colonnes :
- Référence
- Désignation
- Famille
- Type
- Fournisseur
- Utilisateur
- Code barre
- N° série
- Informations
- Site (format: `25\BESANCON\Siege\VIOTTE\étage\salle`)
- Date de livraison

### Statistiques Actuelles

- **Total items** : 183
- **Étages** : 7 (rdc, 1er etage, 2eme etage, 3eme etage, 4eme etage, 5eme etage, 6eme etage)
- **Salles** : 61
- **Familles d'items** : Multiples (Mobilier, Sécurité, etc.)

## 🧪 Tests

```bash
# Tester le lecteur CSV
node test-csv-reader.js

# Tester l'ancien système (legacy)
node test-validation.js
```

## 📖 Documentation Complète

- **[README_MODULES.md](./README_MODULES.md)** - Documentation technique des modules
- **[SECURITY.md](./SECURITY.md)** - Analyse de sécurité détaillée
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Guide d'intégration
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Vue d'ensemble du projet

## 🎯 Différences avec l'Ancienne Version

### Avant (Fichiers à la racine)

```
HackToHorizon2/
├── excelReader.js
├── htmlGenerator.js
├── interactiveMap.js
├── pointPlacer.js
└── styles.css
```

**Problèmes** :
- ❌ Code non organisé
- ❌ Dépendances externes vulnérables
- ❌ Pas de séparation des responsabilités
- ❌ Difficile à maintenir

### Après (Structure organisée)

```
HackToHorizon2/
├── src/
│   ├── modules/
│   ├── readers/
│   └── utils/
├── public/
└── assets/
```

**Avantages** :
- ✅ Code organisé par responsabilité
- ✅ Lecteur CSV sécurisé sans dépendances
- ✅ Principes SOLID appliqués
- ✅ Facile à maintenir et étendre

## 🚀 Évolutions Futures

- [ ] API REST pour accès distant
- [ ] Base de données pour persistance
- [ ] Authentification et autorisation
- [ ] Export PDF des rapports
- [ ] Notifications en temps réel
- [ ] Application mobile
- [ ] Scan de codes-barres

## 👥 Contribution

Ce projet suit les principes SOLID pour faciliter la maintenance et les contributions.

## 📄 Licence

ISC

---

**Développé pour HackToHorizon2**  
*Version 2.0 - Réorganisé et Sécurisé*  
*Date: 2025-11-15*
