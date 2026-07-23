export const uiText = {
  searchInput: {
    title: "Encuentra un indicador",

    indicatorSearch: {
      label: "Nombre o tipo del indicador",
      placeholder: "Excribe una palabra clave",
    },

    initiativeFilter: {
      label: "Iniciativa",
      comboboxText: {
        itemNotFound: "No se encontraron iniciativas",
        trigger: "Filtrar por iniciativa",
        inputPlaceholder: "Buscar la iniciativa",
      },
    },

    ecosystemFilter: {
      label: "Ecosistema Estratégico",
      comboboxText: {
        itemNotFound: "Sin resultados",
        trigger: "¿Qué ecosistema buscas?",
        inputPlaceholder: "Buscar ecosistema estratégico",
      },
    },

    biologicalGroupFilter: {
      label: "Escala biológica",
      comboboxText: {
        itemNotFound: "Sin resultados",
        trigger: "¿Qué escala biológica?",
        inputPlaceholder: "Buscar la escala biológica",
      },
    },

    departmentFilter: {
      label: "Departamento",
      comboboxText: {
        itemNotFound: "",
        trigger: "Selecciona un departamento",
        inputPlaceholder: "Buscar un departamento",
      },
    },

    yearFilter: {
      label: "Año",
      placeholder: "Selecciona un año de inicio",
      removeSelection: "Borrar selección",
    },

    resetSearch: {
      title: "Limpiar todos los filtros",
      sr: "Reiniciar la búsqueda",
      label: "Limpiar filtros",
    },
  },

  searchOutput: {
    searchResults: (amount: number) => `${amount} indicadores encontrados`,
    sortByNameBtn: {
      asc: {
        title: "Ordenar alfabéticamente, de la A a la Z",
        sr: "Ordenar alfabéticamente, de la A a la Z",
      },
      desc: {
        title: "Ordenar alfabéticamente, de la Z a la A",
        sr: "Ordenar alfabéticamente, de la Z a la A",
      },
    },
    sortByDateBtn: {
      asc: {
        title: "Ordenar por fecha de creación, del más antíguo al más reciente",
        sr: "Ordenar por fecha de creación, del más antíguo al más reciente",
      },
      desc: {
        title: "Ordenar por fecha de creación, del más reciente al más antíguo",
        sr: "Ordenar por fecha de alfabéticamente, de la Z a la A",
      },
    },

    card: {
      lastUpdateTitle: "Última actualización del indicador",
      initiative: "Iniciativa que realizó el indicador",
      location: "Ubicación de la iniciativa",
      gotoBtn: {
        sr: "Ir al indicador",
        title: "Ir al indicador",
        label: "Ir",
      },
    },
  },
};
