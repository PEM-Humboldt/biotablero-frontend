# Evaluación complejidad componentes

## Criterios

Para evaluar la complejidad de migrar los componentes de clase a componentes de función, consideré por un lado, la cantidad de líneas que tiene cada componente, pues, mayor tamaño a menudo se puede correlacionar con una lógica o estado más complejo y un mayor número de métodos en el ciclo de vida que deben ser refactorizados a hooks. Por otro, a partir del nombre y del path, inferí un poco de cada componente el nivel de responsabilidad, gestión de estados, interacciones y la obtención o manipulación de datos. `Drawer`, `MapViewer`, `NewProjectForm` o `Dashboard` tienen más peso que `Pie`, `TabContainer` o `CustomInputNumber`, que son más presentacionales y autocontenidos.

```sh
Priorización- ./ruta/del/archivo -> nombre del componente -> líneas brutas de código
```

## Complejidad

### Poca complejidad (20 - 30 min por componente)

2- ./src/pages/search/dashboard/landscape/humanFootprint/PersistenceFootprint.tsx -> PersistenceFootprint -> 203 líneas
2- ./src/pages/search/dashboard/landscape/forest/ForestLossPersistence.tsx -> ForestLossPersistence -> 225 líneas
2- ./src/pages/search/dashboard/Species.jsx -> Species -> 113 líneas
2- ./src/pages/search/Dashboard.tsx -> Dashboard -> 79 líneas
1- ./src/pages/search/shared_components/charts/Pie.tsx -> Pie -> 87 líneas
1- ./src/pages/search/shared_components/TabContainer.tsx -> TabContainer -> 84 líneas
1- ./src/pages/search/dashboard/ecosystems/EcosystemsBox.tsx -> EcosystemsBox -> 80 líneas
1- ./src/pages/search/Accordion.tsx -> Accordion -> 110 líneas
1- ./src/pages/compensation/drawer/CustomInputNumber.jsx -> CustomInputNumber -> 95 líneas
1- ./src/pages/compensation/drawer/NewBiomeForm.jsx -> NewBiomeForm -> 92 líneas
1- ./src/pages/compensation/drawer/StrategiesBox.jsx -> StrategiesBox -> 95 líneas
1- ./src/pages/compensation/drawer/TabContainer.jsx -> TabContainer -> 76 líneas

### Alguna complejidad (30 min - 1.5 horas)

2- ./src/pages/search/dashboard/landscape/connectivity/TimelinePAConnectivity.tsx -> TimelinePAConnectivity -> 215 líneas
2- ./src/pages/search/dashboard/landscape/humanFootprint/CurrentFootprint.tsx -> CurrentFootprint -> 234 líneas
2- ./src/pages/search/dashboard/landscape/CompensationFactor.tsx -> CompensationFactor -> 345 líneas
2- ./src/pages/search/dashboard/Landscape.tsx -> Landscape -> 155 líneas
2- ./src/pages/search/dashboard/ecosystems/ecosystemsBox/EcosystemDetails.tsx -> EcosystemDetails -> 222 líneas
1- ./src/pages/search/shared_components/charts/Lines.tsx -> Lines -> 234 líneas
1- ./src/pages/search/shared_components/charts/SmallBars.tsx -> SmallBars -> 241 líneas
1- ./src/pages/search/MapViewer.tsx -> MapViewer -> 230 líneas
1- ./src/pages/compensation/Selector.jsx -> Selector -> 218 líneas
1- ./src/pages/compensation/MapViewer.jsx -> MapViewer -> 220 líneas
1- ./src/pages/compensation/NewProjectForm.jsx -> NewProjectForm -> 198 líneas

### Normal complejidad (1.5 - 4 horas)

3- ./src/pages/Search.tsx -> Search -> 364 líneas
2- ./src/pages/search/dashboard/landscape/connectivity/CurrentPAConnectivity.tsx -> CurrentPAConnectivity -> 356 líneas
2- ./src/pages/search/dashboard/landscape/humanFootprint/TimelineFootprint.tsx -> TimelineFootprint -> 379 líneas
2- ./src/pages/search/dashboard/landscape/forest/ForestIntegrity.tsx -> ForestIntegrity -> 393 líneas

### Bastante complejidad (4 horas - 1 día)

2- ./src/pages/search/dashboard/landscape/connectivity/CurrentSEPAConnectivity.tsx -> CurrentSEPAConnectivity -> 465 líneas
2- ./src/pages/search/dashboard/Ecosystems.tsx -> Ecosystems -> 529 líneas
1- ./src/pages/Compensation.jsx -> Compensation -> 550 líneas

### Mucha complejidad (1 - 3 días)

1- ./src/pages/compensation/Drawer.jsx -> Drawer -> 851 líneas

## Cruce urgencia/dificultad/tiempo

### Asignación 1

3- Normal: ./src/pages/Search.tsx -> Search, 364 líneas  
2- Alguna: ./src/pages/search/dashboard/landscape/connectivity/TimelinePAConnectivity.tsx -> TimelinePAConnectivity, 215 líneas  
2- Poca: ./src/pages/search/dashboard/Species.jsx -> Species, 113 líneas

### Asignación 2

2- Normal: ./src/pages/search/dashboard/landscape/connectivity/CurrentPAConnectivity.tsx -> CurrentPAConnectivity, 356 líneas  
2- Alguna: ./src/pages/search/dashboard/landscape/humanFootprint/CurrentFootprint.tsx -> CurrentFootprint, 234 líneas  
2- Poca: ./src/pages/search/Dashboard.tsx -> Dashboard, 79 líneas

### Asignación 3

2- Normal: ./src/pages/search/dashboard/landscape/humanFootprint/TimelineFootprint.tsx -> TimelineFootprint, 379 líneas  
2- Poca: ./src/pages/search/dashboard/landscape/humanFootprint/PersistenceFootprint.tsx -> PersistenceFootprint, 203 líneas  
2- Poca: ./src/pages/search/dashboard/landscape/forest/ForestLossPersistence.tsx -> ForestLossPersistence, 225 líneas

### Asignación 4

2- Normal: ./src/pages/search/dashboard/landscape/forest/ForestIntegrity.tsx -> ForestIntegrity, 393 líneas  
2- Alguna: ./src/pages/search/dashboard/Landscape.tsx -> Landscape, 155 líneas  
1- Alguna: ./src/pages/search/shared_components/charts/Pie.tsx -> Pie, 87 líneas

### Asignación 5

2- Bastante: ./src/pages/search/dashboard/landscape/connectivity/CurrentSEPAConnectivity.tsx -> CurrentSEPAConnectivity, 465 líneas  
2- Alguna: ./src/pages/search/dashboard/landscape/CompensationFactor.tsx -> CompensationFactor, 345 líneas

### Asignación 6

2- Bastante: ./src/pages/search/dashboard/Ecosystems.tsx -> Ecosystems, 529 líneas  
1- Alguna: ./src/pages/search/shared_components/charts/Lines.tsx -> Lines, 234 líneas

### Asignación 7

1- Bastante: ./src/pages/Compensation.jsx -> Compensation, 550 líneas  
1- Alguna: ./src/pages/search/shared_components/charts/SmallBars.tsx -> SmallBars, 241 líneas

### Asignación 8

1- Mucha: ./src/pages/compensation/Drawer.jsx -> Drawer, 851 líneas

### Asignación 9

1- Alguna: ./src/pages/search/MapViewer.tsx -> MapViewer, 230 líneas  
1- Alguna: ./src/pages/compensation/Selector.jsx -> Selector, 218 líneas  
1- Alguna: ./src/pages/compensation/MapViewer.jsx -> MapViewer, 220 líneas

### Asignación 10

1- Alguna: ./src/pages/compensation/NewProjectForm.jsx -> NewProjectForm, 198 líneas  
1- Poca: ./src/pages/search/shared_components/TabContainer.tsx -> TabContainer, 84 líneas  
1- Poca: ./src/pages/search/dashboard/ecosystems/EcosystemsBox.tsx -> EcosystemsBox, 80 líneas  
1- Poca: ./src/pages/search/Accordion.tsx -> Accordion, 110 líneas  
1- Poca: ./src/pages/compensation/drawer/CustomInputNumber.jsx -> CustomInputNumber, 95 líneas  
1- Poca: ./src/pages/compensation/drawer/NewBiomeForm.jsx -> NewBiomeForm, 92 líneas  
1- Poca: ./src/pages/compensation/drawer/StrategiesBox.jsx -> StrategiesBox, 95 líneas  
1- Poca: ./src/pages/compensation/drawer/TabContainer.jsx -> TabContainer, 76 líneas
