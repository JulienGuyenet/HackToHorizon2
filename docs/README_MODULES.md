# HackToHorizon2 - Interactive Floor Plan Inventory System

Système interactif de gestion d'inventaire avec visualisation sur plan d'étage.

## Description

Ce projet permet d'extraire des données d'inventaire depuis un fichier Excel et de les visualiser de manière interactive sur un plan d'étage. Il comprend des outils pour placer des points sur le plan et générer automatiquement du HTML pour l'affichage des données.

## Fonctionnalités

- **Extraction de données Excel** : Lecture et parsing automatique des fichiers d'inventaire
- **Génération HTML** : Fonctions pour créer des cartes d'items, des listes, des filtres et des statistiques
- **Carte interactive** : Visualisation des équipements sur un plan d'étage avec points cliquables
- **Outil de placement** : Interface pour placer visuellement les points sur le plan
- **Localisation par étage** : Filtrage et organisation des items par étage et par salle
- **Infos rapides** : Tooltips informatifs au survol des points

## Structure du projet

```
├── excelReader.js              # Module d'extraction de données Excel
├── htmlGenerator.js            # Module de génération HTML
├── interactiveMap.js           # Module de carte interactive
├── pointPlacer.js              # Outil de placement de points
├── styles.css                  # Feuille de styles CSS
├── demo-point-placer.html      # Démo de l'outil de placement
├── demo-interactive-map.html   # Démo de la carte interactive
├── example-usage.js            # Script d'exemple d'utilisation
├── package.json                # Configuration npm
└── VIOTTE_Inventaire_20251114.xlsx  # Fichier Excel d'inventaire
```

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

### Installation des dépendances

```bash
npm install
```

Les dépendances incluent :
- `xlsx` : Pour la lecture et le parsing des fichiers Excel

## Utilisation

### 1. Extraction des données Excel

```javascript
const excelReader = require('./excelReader');

// Lire le fichier Excel
const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');

// Obtenir les étages uniques
const floors = excelReader.getUniqueFloors(items);

// Filtrer par étage
const firstFloorItems = excelReader.filterByFloor(items, '1er etage');

// Grouper par étage
const itemsByFloor = excelReader.groupByFloor(items);

// Exporter en JSON
excelReader.exportToJSON(items, 'inventory-data.json');
```

### 2. Génération HTML

```javascript
const htmlGenerator = require('./htmlGenerator');

// Générer une carte pour un item
const cardHtml = htmlGenerator.generateItemCard(item);

// Générer une liste d'items
const listHtml = htmlGenerator.generateItemList(items, 'Mon Inventaire');

// Générer un panneau de filtres
const filterHtml = htmlGenerator.generateFilterPanel(floors, rooms);

// Générer des statistiques
const statsHtml = htmlGenerator.generateStatistics(items);
```

### 3. Utilisation de la carte interactive

Ouvrir `demo-interactive-map.html` dans un navigateur :

```javascript
// Initialiser la carte
const map = new InteractiveMap(
    'map-container-id',
    'path/to/floor-plan.png',
    items
);

// Changer l'étage affiché
map.setFloor('1er etage');

// Écouter les sélections d'items
container.addEventListener('itemsSelected', (e) => {
    const selectedItems = e.detail.items;
    // Faire quelque chose avec les items sélectionnés
});
```

### 4. Utilisation de l'outil de placement

Ouvrir `demo-point-placer.html` dans un navigateur :

```javascript
// Initialiser l'outil
const placer = new PointPlacer(
    'placer-container-id',
    'path/to/floor-plan.png',
    items
);

// Les utilisateurs peuvent :
// - Cliquer sur le plan pour placer un point
// - Naviguer entre les items avec les boutons
// - Exporter la configuration des coordonnées
// - Importer une configuration existante
```

### 5. Script d'exemple

Exécuter le script d'exemple pour voir toutes les fonctionnalités :

```bash
node example-usage.js
```

Ce script va :
- Lire les données Excel
- Afficher des statistiques
- Générer des exemples HTML
- Créer des fichiers de configuration

## Structure des données

### Format d'un item

```javascript
{
    id: 1,
    reference: "FAUTDACTYOPE",
    designation: "Fauteuil dactylo opérateur",
    family: "Mobilier de bureau",
    type: "Fauteuil",
    supplier: "MB2",
    user: "FERDENZI, Myriam",
    barcode: "16687",
    serialNumber: "",
    information: "Description détaillée...",
    deliveryDate: "",
    location: {
        floor: "4eme etage",
        room: "417",
        fullPath: "25\\BESANCON\\Siege\\VIOTTE\\4eme etage\\417",
        building: "VIOTTE",
        site: "Siege",
        city: "BESANCON"
    },
    coordinates: {
        x: 0.85,  // Position X (0-1, relatif à la largeur de l'image)
        y: 0.30   // Position Y (0-1, relatif à la hauteur de l'image)
    }
}
```

### Format de configuration des coordonnées

```json
{
    "version": "1.0",
    "imageUrl": "Screenshot 2025-11-15 at 12.29.07.png",
    "timestamp": "2025-11-15T12:00:00.000Z",
    "coordinates": [
        {
            "id": 1,
            "barcode": "16687",
            "room": "417",
            "floor": "4eme etage",
            "coordinates": {
                "x": 0.85,
                "y": 0.30
            }
        }
    ]
}
```

## Modules

### excelReader.js

Fonctions pour extraire et parser les données Excel :
- `readExcelData(filePath)` : Lit et parse le fichier Excel
- `parseLocation(location)` : Parse la chaîne de localisation
- `getUniqueFloors(items)` : Récupère les étages uniques
- `getUniqueRooms(items)` : Récupère les salles uniques
- `filterByFloor(items, floor)` : Filtre les items par étage
- `filterByRoom(items, room)` : Filtre les items par salle
- `groupByFloor(items)` : Groupe les items par étage
- `groupByRoom(items)` : Groupe les items par salle
- `exportToJSON(items, path)` : Exporte les données en JSON

### htmlGenerator.js

Fonctions pour générer du HTML :
- `generateItemCard(item)` : Génère une carte HTML pour un item
- `generateQuickInfo(item)` : Génère un tooltip HTML
- `generateItemList(items, title)` : Génère une liste d'items
- `generateFloorSelector(floors)` : Génère un sélecteur d'étage
- `generateRoomSelector(rooms)` : Génère un sélecteur de salle
- `generateSearchBar()` : Génère une barre de recherche
- `generateFilterPanel(floors, rooms)` : Génère un panneau de filtres complet
- `generateStatistics(items)` : Génère des statistiques

### interactiveMap.js

Classe pour la carte interactive (côté navigateur) :
- `constructor(containerId, imageUrl, items)` : Initialise la carte
- `setFloor(floor)` : Change l'étage affiché
- `updateItemCoordinates(items)` : Met à jour les coordonnées des items
- Événements personnalisés : `itemsSelected`

### pointPlacer.js

Classe pour l'outil de placement de points (côté navigateur) :
- `constructor(containerId, imageUrl, items)` : Initialise l'outil
- `exportConfiguration()` : Exporte la configuration des coordonnées
- `importConfiguration(event)` : Importe une configuration
- Navigation entre items et placement interactif

## Personnalisation

### Styles CSS

Modifiez `styles.css` pour personnaliser l'apparence :
- Couleurs principales : `#4ecdc4`, `#2c3e50`, `#ff6b6b`
- Classes disponibles : `.item-card`, `.map-point`, `.tooltip`, etc.

### Ajout de champs

Pour ajouter de nouveaux champs dans l'extraction Excel, modifiez `excelReader.js` :

```javascript
// Dans la fonction readExcelData
const items = rawData.map((row, index) => {
    return {
        // ... champs existants
        nouveauChamp: row['Nom de la colonne Excel'] || '',
    };
});
```

### Personnalisation des points

Modifiez `interactiveMap.js` pour changer l'apparence des points :

```javascript
// Dans la fonction renderPoint
const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
innerCircle.setAttribute('r', '12'); // Modifier la taille
```

## Workflow recommandé

1. **Préparation des données**
   ```bash
   node example-usage.js
   ```

2. **Placement des points**
   - Ouvrir `demo-point-placer.html`
   - Placer les points sur le plan
   - Exporter la configuration

3. **Intégration**
   - Charger les données et la configuration
   - Initialiser la carte interactive
   - Ajouter les filtres et la recherche

4. **Déploiement**
   - Intégrer dans votre application web
   - Configurer un serveur pour servir les fichiers
   - Ajouter une API pour les données dynamiques

## Intégration avec une application web

### Exemple avec Express.js

```javascript
const express = require('express');
const excelReader = require('./excelReader');

const app = express();

// Servir les fichiers statiques
app.use(express.static('.'));

// API pour les données d'inventaire
app.get('/api/inventory-data', (req, res) => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    res.json(items);
});

// API pour les coordonnées
app.get('/api/coordinates-config', (req, res) => {
    const config = require('./coordinates-config.json');
    res.json(config);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

## Exemples de fichiers générés

Après avoir exécuté `example-usage.js`, vous obtiendrez :
- `inventory-data.json` : Toutes les données d'inventaire
- `example-item-list.html` : Exemple de liste d'items
- `example-filter-panel.html` : Exemple de panneau de filtres
- `example-statistics.html` : Exemple de statistiques
- `sample-coordinates.json` : Template de configuration des coordonnées

## Support des navigateurs

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Les fonctionnalités SVG et JavaScript ES6 sont requises.

## Sécurité

- Le HTML généré est automatiquement échappé pour prévenir les attaques XSS
- Utilisez HTTPS en production
- Validez les données importées côté serveur

## Performance

- Les images de plan d'étage doivent être optimisées (< 2 MB recommandé)
- Pour de grandes quantités d'items (> 1000), considérez la pagination
- Utilisez le lazy loading pour les images

## Licence

Ce projet est développé pour HackToHorizon2.

## Auteur

Développé pour le projet HackToHorizon2

## Notes

- Les coordonnées sont relatives (0-1) pour s'adapter aux différentes tailles d'écran
- Le système supporte plusieurs étages
- Les items peuvent partager les mêmes coordonnées (regroupés par salle)
- Les données Excel doivent suivre le format du fichier fourni
