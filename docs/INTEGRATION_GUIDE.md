# Guide d'Intégration

Ce guide vous aide à intégrer le système de plan d'étage interactif dans votre application web.

## Installation Rapide

### 1. Prérequis
```bash
node --version  # v14 ou supérieur
npm --version
```

### 2. Installation
```bash
git clone <votre-repo>
cd HackToHorizon2
npm install
```

### 3. Tester l'installation
```bash
node test-validation.js
node example-usage.js
```

## Intégration dans votre Application

### Option A : Application Web Simple (HTML/JS)

**Structure recommandée :**
```
votre-app/
├── public/
│   ├── css/
│   │   └── styles.css          # Copiez depuis le projet
│   ├── js/
│   │   ├── interactiveMap.js   # Copiez depuis le projet
│   │   └── pointPlacer.js      # Copiez depuis le projet
│   ├── data/
│   │   ├── inventory-data.json
│   │   └── coordinates.json
│   └── images/
│       └── floor-plan.png
├── index.html
└── server.js                    # Serveur Express
```

**Exemple server.js :**
```javascript
const express = require('express');
const excelReader = require('./excelReader');
const app = express();

app.use(express.static('public'));

// API pour les données
app.get('/api/inventory', (req, res) => {
    const items = excelReader.readExcelData('VIOTTE_Inventaire_20251114.xlsx');
    res.json(items);
});

// API pour les coordonnées
app.get('/api/coordinates', (req, res) => {
    const config = require('./data/coordinates.json');
    res.json(config);
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
```

**Exemple index.html :**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Plan Interactif</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <div id="map-container"></div>
    </div>
    
    <script src="js/interactiveMap.js"></script>
    <script>
        // Charger les données
        Promise.all([
            fetch('/api/inventory').then(r => r.json()),
            fetch('/api/coordinates').then(r => r.json())
        ]).then(([items, config]) => {
            // Appliquer les coordonnées
            config.coordinates.forEach(coord => {
                const item = items.find(i => i.id === coord.id);
                if (item) item.coordinates = coord.coordinates;
            });
            
            // Initialiser la carte
            new InteractiveMap('map-container', 'images/floor-plan.png', items);
        });
    </script>
</body>
</html>
```

### Option B : Application React

**Installation :**
```bash
npm install xlsx
```

**Composant React :**
```jsx
import React, { useEffect, useRef, useState } from 'react';
import './styles.css';

function InteractiveFloorPlan({ imagePath, items }) {
    const containerRef = useRef(null);
    const [map, setMap] = useState(null);
    
    useEffect(() => {
        if (containerRef.current && !map) {
            // Charger le script interactiveMap.js
            const script = document.createElement('script');
            script.src = '/js/interactiveMap.js';
            script.onload = () => {
                const mapInstance = new window.InteractiveMap(
                    'map-container',
                    imagePath,
                    items
                );
                setMap(mapInstance);
            };
            document.body.appendChild(script);
        }
    }, [imagePath, items, map]);
    
    return <div id="map-container" ref={containerRef}></div>;
}

export default InteractiveFloorPlan;
```

### Option C : Application Vue.js

**Composant Vue :**
```vue
<template>
    <div id="map-container" ref="mapContainer"></div>
</template>

<script>
export default {
    name: 'InteractiveFloorPlan',
    props: {
        imagePath: String,
        items: Array
    },
    mounted() {
        this.initMap();
    },
    methods: {
        async initMap() {
            // Charger le script
            await this.loadScript('/js/interactiveMap.js');
            
            // Initialiser la carte
            this.map = new window.InteractiveMap(
                this.$refs.mapContainer.id,
                this.imagePath,
                this.items
            );
        },
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }
    }
}
</script>

<style src="@/assets/styles.css"></style>
```

## Workflow de Déploiement

### Étape 1 : Préparer les Données
```bash
# Exécuter le script pour extraire les données
node example-usage.js

# Vérifier le fichier généré
ls -lh inventory-data.json
```

### Étape 2 : Placer les Points
1. Ouvrir `demo-point-placer.html` dans un navigateur
2. Placer les points sur le plan pour chaque item
3. Exporter la configuration des coordonnées
4. Sauvegarder le fichier JSON

### Étape 3 : Déployer

**Pour production :**
```bash
# Copier les fichiers nécessaires
cp styles.css public/css/
cp interactiveMap.js public/js/
cp inventory-data.json public/data/
cp coordinates-config.json public/data/
cp "Screenshot 2025-11-15 at 12.29.07.png" public/images/floor-plan.png

# Démarrer le serveur
npm start
```

## Configuration Avancée

### Personnalisation des Couleurs

**Dans styles.css :**
```css
:root {
    --primary-color: #4ecdc4;
    --secondary-color: #ff6b6b;
    --text-color: #2c3e50;
    --background-color: #f5f7fa;
}

.point-inner {
    fill: var(--primary-color);
}
```

### Filtrage Personnalisé

```javascript
// Ajouter un filtre par famille
function filterByFamily(items, family) {
    return items.filter(item => item.family === family);
}

// Utilisation
const furnitureItems = filterByFamily(items, 'Mobilier de bureau');
map.updateItemCoordinates(furnitureItems);
```

### Événements Personnalisés

```javascript
// Écouter les sélections d'items
document.getElementById('map-container').addEventListener('itemsSelected', (e) => {
    const items = e.detail.items;
    
    // Envoyer à Google Analytics
    gtag('event', 'item_selected', {
        'item_count': items.length,
        'room': items[0].location.room
    });
    
    // Afficher dans un modal
    showModal(items);
});
```

## Optimisation des Performances

### 1. Compression d'Images
```bash
# Optimiser le plan d'étage
npm install -g imagemin-cli
imagemin floor-plan.png --plugin=pngquant > floor-plan-optimized.png
```

### 2. Lazy Loading
```javascript
// Charger les données uniquement quand nécessaire
let cachedItems = null;

async function getItems() {
    if (!cachedItems) {
        const response = await fetch('/api/inventory');
        cachedItems = await response.json();
    }
    return cachedItems;
}
```

### 3. Pagination pour Grandes Données
```javascript
function paginateItems(items, page = 1, perPage = 100) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return items.slice(start, end);
}
```

## Dépannage

### Problème : Les points ne s'affichent pas
**Solution :**
- Vérifier que les coordonnées sont entre 0 et 1
- Vérifier que l'image est chargée
- Ouvrir la console du navigateur pour les erreurs

### Problème : L'image est trop grande
**Solution :**
```javascript
// Ajouter un zoom et pan
map.mapContainer.style.overflow = 'auto';
map.mapContainer.style.maxHeight = '80vh';
```

### Problème : Les données ne se chargent pas
**Solution :**
- Vérifier que le serveur est démarré
- Vérifier les chemins des fichiers
- Vérifier les CORS si l'API est sur un domaine différent

## Support

Pour toute question ou problème :
1. Consultez la documentation : `README_MODULES.md`
2. Vérifiez la sécurité : `SECURITY.md`
3. Exécutez les tests : `node test-validation.js`

## Ressources

- [Documentation xlsx](https://www.npmjs.com/package/xlsx)
- [SVG Documentation](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [Express.js](https://expressjs.com/)
