# Architecture Documentation

## Vue d'ensemble

L'application utilise une architecture orientée objet (OOP) avec une séparation claire des responsabilités suivant le pattern MVC (Model-View-Controller) adapté pour une application web client.

## Structure des Couches

```
┌─────────────────────────────────────────────┐
│              View (HTML/CSS)                │
│         (inventory.html, map.html, etc.)    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Controllers                      │
│  InventoryController, MapController, etc.   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│             Services                        │
│         InventoryService                    │
└──────┬──────────┬───────────────────────────┘
       │          │
       │  ┌───────▼──────────┐
       │  │   Repositories   │
       │  │  FurnitureRepo   │
       │  │  LocationRepo    │
       │  └───────┬──────────┘
       │          │
┌──────▼──────────▼──────────┐
│         Core                │
│   ApiClient, I18nService    │
└─────────────────────────────┘
```

## Couches de l'Architecture

### 1. Core Layer (Couche Fondamentale)

**Fichiers:** `public/js/core/`

#### ApiClient
- **Responsabilité:** Gestion de toutes les communications HTTP avec le backend
- **Fonctionnalités:**
  - Configuration HTTP/HTTPS
  - Gestion des headers (Accept-Language, Content-Type)
  - Gestion centralisée des erreurs
  - Méthodes génériques (GET, POST, PUT, DELETE)
  - Timeout et retry logic

```javascript
const apiClient = new ApiClient({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000
});

// Utilisation
const data = await apiClient.get('/Furniture');
```

#### I18nService
- **Responsabilité:** Gestion de l'internationalisation
- **Fonctionnalités:**
  - Détection automatique de la langue
  - Chargement lazy des traductions
  - Changement dynamique de langue
  - Mise à jour automatique de l'UI
  - Gestion du header Accept-Language

```javascript
const i18nService = new I18nService({
    supportedLanguages: ['fr', 'en'],
    defaultLanguage: 'fr'
});

await i18nService.init();
const text = i18nService.translate('app.title');
```

#### Application
- **Responsabilité:** Bootstrap et configuration de l'application
- **Fonctionnalités:**
  - Initialisation de tous les services
  - Factory pour créer les contrôleurs
  - Injection de dépendances
  - Configuration centralisée

```javascript
const app = await new Application().init();
const controller = app.createInventoryController();
```

#### APIError
- **Responsabilité:** Gestion standardisée des erreurs API
- **Fonctionnalités:**
  - Codes d'erreur typés
  - Messages localisés
  - Détails de l'erreur
  - Status HTTP

### 2. Repository Layer (Couche d'Accès aux Données)

**Fichiers:** `public/js/repositories/`

Les repositories encapsulent toute la logique d'accès aux données API.

#### FurnitureRepository
- **Responsabilité:** Gestion des opérations CRUD pour les meubles
- **Méthodes:**
  - `getAll()` - Récupérer tous les meubles
  - `getById(id)` - Récupérer un meuble par ID
  - `create(data)` - Créer un nouveau meuble
  - `update(id, data)` - Mettre à jour un meuble
  - `delete(id)` - Supprimer un meuble
  - `getByBarcode(barcode)` - Rechercher par code-barres
  - `search(params)` - Recherche avec filtres
  - `assignLocation(furnitureId, locationId)` - Assigner une localisation
  - `assignRfidTag(furnitureId, rfidTagId)` - Assigner un tag RFID

```javascript
const repo = new FurnitureRepository(apiClient);
const furniture = await repo.getAll();
```

#### LocationRepository
- **Responsabilité:** Gestion des opérations CRUD pour les localisations
- **Méthodes:**
  - `getAll()` - Récupérer toutes les localisations
  - `getById(id)` - Récupérer une localisation par ID
  - `create(data)` - Créer une nouvelle localisation
  - `update(id, data)` - Mettre à jour une localisation
  - `delete(id)` - Supprimer une localisation
  - `getFurniture(locationId)` - Meubles dans une localisation
  - `getByBuilding(buildingName)` - Localisations par bâtiment

### 3. Service Layer (Couche Métier)

**Fichiers:** `public/js/services/`

Les services contiennent la logique métier et orchestrent les repositories.

#### InventoryService
- **Responsabilité:** Logique métier pour la gestion de l'inventaire
- **Fonctionnalités:**
  - Chargement et transformation des données
  - Filtrage multi-critères
  - Calcul de statistiques
  - Gestion de l'état (items, filtres)
  - Agrégation de données

**Méthodes principales:**
```javascript
const service = new InventoryService(furnitureRepo, locationRepo);

// Charger les données
await service.loadItems();

// Filtrer
service.setFilters({ floor: '1er etage', type: 'Fauteuil' });
const filtered = service.getFilteredItems();

// Statistiques
const stats = service.getStatistics();

// Valeurs uniques
const floors = service.getUniqueValues('location.floor');
```

**Gestion des filtres:**
- Recherche textuelle
- Filtrage par étage
- Filtrage par salle
- Filtrage par type
- Filtrage par famille
- Filtrage par fournisseur
- Filtrage par utilisateur

### 4. Controller Layer (Couche Présentation)

**Fichiers:** `public/js/controllers/`

Les contrôleurs gèrent l'interaction entre l'UI et les services.

#### InventoryController
- **Responsabilité:** Gestion de la page inventaire
- **Fonctionnalités:**
  - Initialisation de la page
  - Gestion des événements UI
  - Rendu des données
  - Gestion des filtres
  - Affichage des erreurs

```javascript
const controller = new InventoryController(inventoryService, i18nService);
await controller.init();
```

#### MapController
- **Responsabilité:** Gestion de la carte interactive
- **Fonctionnalités:**
  - Chargement des plans d'étage
  - Filtrage par étage
  - Intégration avec InteractiveMap
  - Gestion des événements de sélection

#### StatisticsController
- **Responsabilité:** Gestion des statistiques
- **Fonctionnalités:**
  - Calcul et affichage des statistiques
  - Graphiques et tableaux
  - Mise à jour en temps réel

### 5. Utilities Layer (Couche Utilitaires)

**Fichiers:** `public/js/utils/`

#### HtmlUtils
- Échappement HTML (protection XSS)
- Création d'éléments DOM
- Manipulation de classes CSS
- Affichage/masquage d'éléments

```javascript
const safe = HtmlUtils.escapeHtml(userInput);
HtmlUtils.addClass(element, 'active');
```

#### StorageUtils
- Gestion du localStorage
- Sérialisation/désérialisation JSON
- Gestion d'erreurs

```javascript
StorageUtils.set('userPrefs', { theme: 'dark' });
const prefs = StorageUtils.get('userPrefs', {});
```

#### DateUtils
- Formatage de dates
- Validation de dates
- Conversion ISO

```javascript
const formatted = DateUtils.formatDate(new Date(), 'fr-FR');
```

## Patterns et Principes

### 1. Dependency Injection
Toutes les dépendances sont injectées via le constructeur:
```javascript
class InventoryController {
    constructor(inventoryService, i18nService) {
        this.inventoryService = inventoryService;
        this.i18nService = i18nService;
    }
}
```

### 2. Single Responsibility Principle
Chaque classe a une seule responsabilité bien définie.

### 3. Separation of Concerns
- **Repositories:** Accès aux données
- **Services:** Logique métier
- **Controllers:** Logique de présentation
- **Core:** Infrastructure

### 4. Factory Pattern
L'Application utilise le pattern Factory pour créer les contrôleurs:
```javascript
app.createInventoryController();
app.createMapController();
```

### 5. Error Handling
Gestion centralisée des erreurs avec `APIError`:
```javascript
try {
    const data = await service.loadItems();
} catch (error) {
    if (error instanceof APIError) {
        const message = error.getLocalizedMessage();
        // Afficher le message localisé
    }
}
```

## Flux de Données

```
User Action (View)
    ↓
Controller (handleEvent)
    ↓
Service (businessLogic)
    ↓
Repository (apiCall)
    ↓
ApiClient (httpRequest)
    ↓
Backend API
    ↓
Response
    ↓
Repository (transform)
    ↓
Service (aggregate)
    ↓
Controller (render)
    ↓
View (display)
```

## Initialisation de l'Application

```javascript
// 1. Créer et initialiser l'application
const app = await new Application().init();

// 2. Créer le contrôleur approprié
const controller = app.createInventoryController();

// 3. Initialiser le contrôleur
await controller.init();

// 4. Rendre la fonction changeLanguage disponible globalement
window.changeLanguage = (lng) => app.getI18nService().changeLanguage(lng);
```

## Extensibilité

### Ajouter un nouveau Service

1. Créer une classe dans `js/services/`:
```javascript
class ReservationService {
    constructor(furnitureRepository) {
        this.furnitureRepository = furnitureRepository;
    }
    
    async createReservation(data) {
        // Logique métier
    }
}
```

2. L'ajouter à Application:
```javascript
class Application {
    async init() {
        // ...
        this.reservationService = new ReservationService(
            this.furnitureRepository
        );
    }
}
```

### Ajouter un nouveau Controller

1. Créer une classe dans `js/controllers/`:
```javascript
class ReservationController {
    constructor(reservationService, i18nService) {
        this.reservationService = reservationService;
        this.i18nService = i18nService;
    }
    
    async init() {
        // Initialisation
    }
}
```

2. Ajouter une factory method dans Application:
```javascript
createReservationController() {
    return new ReservationController(
        this.reservationService,
        this.i18nService
    );
}
```

### Ajouter un nouveau Repository

1. Créer une classe dans `js/repositories/`:
```javascript
class RfidRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    
    async getActiveTags() {
        return this.apiClient.get('/Rfid/tags');
    }
}
```

2. L'initialiser dans Application:
```javascript
this.rfidRepository = new RfidRepository(this.apiClient);
```

## Avantages de cette Architecture

1. **Maintenabilité:** Code organisé et facile à maintenir
2. **Testabilité:** Chaque classe peut être testée indépendamment
3. **Réutilisabilité:** Les services et repositories sont réutilisables
4. **Extensibilité:** Facile d'ajouter de nouvelles fonctionnalités
5. **Lisibilité:** Structure claire et cohérente
6. **Type Safety:** Interfaces bien définies
7. **Découplage:** Faible couplage entre les couches
8. **Injection de Dépendances:** Facilite les tests et la flexibilité

## Migration depuis l'ancien code

L'ancien code procédural a été conservé dans les fichiers originaux (`apiService.js`, `i18n.js`, etc.) pour assurer la compatibilité avec les pages non encore migrées (comme `reservation.html`).

Les pages migrées (inventory, map, statistics) utilisent la nouvelle architecture OOP.

## Bonnes Pratiques

1. **Toujours utiliser l'injection de dépendances**
2. **Ne pas accéder directement aux repositories depuis les controllers**
3. **Utiliser les services pour la logique métier**
4. **Échapper toujours le HTML pour éviter les XSS**
5. **Gérer les erreurs avec try/catch et APIError**
6. **Utiliser les méthodes statiques des Utils pour les opérations communes**
7. **Documenter les méthodes publiques avec JSDoc**
8. **Suivre le principe de responsabilité unique**
