import { Form } from "react-router";
import { Button } from "@ui/shadCN/component/button";
import { Input } from "@ui/shadCN/component/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@ui/shadCN/component/native-select";
import { Textarea } from "@ui/shadCN/component/textarea";

export function InitiativeDataForm(data) {
  const handleSubmit = () => {
    console.log("carajo");
  };

  return (
    <Form action="" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Sobre la iniciativa</legend>
        <label htmlFor="name">
          Nombre
          <Input
            name="name"
            id="name"
            placeholder="Juntos por la Amazonía"
            type="text"
          />
        </label>

        <label>
          Descripción
          <Textarea placeholder="Esta iniciativa busca..." />
        </label>

        {/* NOTE: Agregar la comprobación de tamaño */}
        <label>
          Subir imagen para el perfíl de la iniciativa
          <Input type="file" accept="image/jpg, image/png, image/webp" />
        </label>

        {/* NOTE: Agregar la comprobación de tamaño */}
        <label>
          Subir imagen para el banner de la iniciativa
          <Input type="file" accept="image/jpg, image/png, image/webp" />
        </label>

        <fieldset>
          <legend>Inivitar a participar a la iniciativa</legend>

          <fieldset>
            <legend>Líderes y liderezas</legend>
            <h3>Actuales</h3>
            <ul>
              <li>Lidereza 1</li>
              <li>Lidereza 2</li>
            </ul>
            <h3>A invitar</h3>
            <ul>
              <li>Lidereza 1</li>
              <li>Lidereza 2</li>
            </ul>
            <label>
              Correo del líder o lidereza a invitar
              <Input placeholder="correo@electrónico.com" type="email" />
            </label>
            <Button type="button">Añadir</Button>
          </fieldset>

          <fieldset>
            <legend>Participantes</legend>
            <h3>Actuales</h3>
            <ul>
              <li>participante 1</li>
              <li>participante 2</li>
            </ul>
            <h3>A invitar</h3>
            <ul>
              <li>participante 1</li>
              <li>participante 2</li>
            </ul>
            <label>
              Correo del participante a invitar
              <Input placeholder="correo@electrónico.com" type="email" />
            </label>
            <Button type="button">Añadir</Button>
          </fieldset>
        </fieldset>
      </fieldset>

      <fieldset>
        <legend>Ubicación</legend>

        {/* NOTE: Cambiar por combobox */}
        <label>
          Departamento
          <NativeSelect>
            <NativeSelectOption value="">
              Selecciona un departamento
            </NativeSelectOption>
          </NativeSelect>
        </label>
        <label>
          Municipio
          <Input placeholder="Juntos por la Amazonía" type="text" />
        </label>
        <label>
          Localidad
          <Input placeholder="Juntos por la Amazonía" type="text" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Contacto</legend>
        <label>
          Correo electrónico
          <Input type="email" placeholder="hola@dominio.com" />
        </label>
        <label>
          Teléfono
          <Input type="tel" placeholder="hola@dominio.com" />
        </label>
      </fieldset>

      <label>
        Nombre de la iniciativa
        <Input placeholder="Juntos por la Amazonía" type="text" />
      </label>
      <Button type="reset" variant="outline">
        Reiniciar el formulario
      </Button>
      <Button>Crear la iniciativa</Button>
    </Form>
  );
}
