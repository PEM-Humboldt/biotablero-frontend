import React from 'react';

const description = companyName => (
  <div>
    <p>
      {'En esta sección podrás encontrar información sobre '}
      <b>
        ¿Qué y cuánto compensar?
      </b>
      {', '}
      <b>
        ¿Dónde y cómo compensar?
      </b>
      , para esto:
    </p>
    <p>
      <i>
        1
      </i>
      {' Selecciona una '}
      <b>
        Zona
        {companyName ? ` ${companyName}` : ''}
      </b>
    </p>
    <p>
      <i>
        2
      </i>
      {' Selecciona un '}
      <b>
        proyecto
      </b>
      {' (licenciado, en licenciamiento o diagnóstico) o crea un '}
      <b>
        nuevo proyecto
      </b>
    </p>
    <p>
      <i>
        3
      </i>
      {' Consulta el qué y cuánto (proyectos previamente analizados)'}
    </p>
    <p>
      <i>
        4
      </i>
      {' Selecciona el dónde y cómo para alcanzar las metas de compensación (proyectos previamente analizados)'}
    </p>
  </div>
);

export default description;
