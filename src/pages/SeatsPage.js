import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";

const asientoContableData = {
  descripcion: "",
  cuenta: 0,
  tipoMovimiento: "CR",
  montoAsiento: 0,
  estado: "R",
  cliente: 1
}

const AsientosContablesPage = () => {
  const [users, setUsers] = useState([]);
  const [asientosContables, setAsientosContables] = useState([]);

  const [addForm, setAddForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [asientoContable, setAsientoContable] = useState(asientoContableData);

  useEffect(() => {
    const documentClients = async () => {
      const result = await api.get("/clientes");
      setUsers(result.data);
    };

    getAsientosContables();
    documentClients();
  }, []);

  const getAsientosContables = async () => {
    const result = await api.get("/asientosContables");
    setAsientosContables(result.data);
  };

  const onChange = e => {
    e.persist();
    setAsientoContable({ ...asientoContable, [e.target.name]: e.target.value });
  };

  const saveAsientoContable = e => {
    e.preventDefault();
    api
      .post("/asientosContables", asientoContable)
      .then(response => {
        Swal.fire({
          title: "Guardado satisfactoriamente",
          icon: "success"
        });
        getAsientosContables()
        setAddForm(false)
        clearData()
      })
      .catch(error => {
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      });
  };

  const deleteAsientoContable = (e, id) => {
    e.preventDefault();
    api
      .delete(`/asientosContables/${id}`)
      .then(response => {
        Swal.fire({
          title: "Eliminado satisfactoriamente",
          icon: "success"
        });
        getAsientosContables()
      })
      .catch(error => {
        Swal.fire({
          title: "Error papalote",
          icon: "error"
        });
      });
  };

  const editAsientoContable = e => {
    e.preventDefault();
    api
      .put(`/asientosContables/${asientoContable.id}`, asientoContable)
      .then(() => {
        Swal.fire({
          title: "Editado satisfactoriamente",
          icon: "success"
        });
        clearData()
        getAsientosContables()
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      });
  };

  const clearData = () => {
    setAsientoContable(asientoContableData)
  }

  return (
    <section className="section">
      <h1 className="is-size-1">Asientos contables</h1>
      {addForm ? (
        <form className="form">

        <div className="field">
            <label className="label">Descripcion</label>
            <div className="control">
              <input
                name="descripcion"
                value={asientoContable.descripcion}
                onChange={e => onChange(e)}
                className="input"
                type="text"
                placeholder="Descripcion del asiento"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Cuenta</label>
            <div className="control">
              <input
                name="cuenta"
                value={asientoContable.cuenta}
                onChange={e => onChange(e)}
                className="input"
                type="number"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Tipo de Movimiento</label>
            <div className="control is-fullwidth">
              <div className="select is-primary is-fullwidth">
                <select
                  defaultValue={
                    edit == false ? "DB" : asientoContable.tipoMovimiento
                  }
                  onChange={e => onChange(e)}
                  name="tipoMovimiento"
                >
                  <option value="DB">Debito</option>
                  <option value="CR">Credito</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Cliente</label>
            <div className="control is-fullwidth">
              <div className="select is-primary is-fullwidth">
                <select
                  defaultValue={
                    edit === false ? (users[0].id ? users[0].id : 0) :
                      asientoContable.cliente.id
                  }
                  value={asientoContable.cliente.id}
                  onChange={e => onChange(e)}
                  name="cliente"
                >
                  {users &&
                    users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nombre}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Monto</label>
            <div className="control">
              <input
                name="montoAsiento"
                value={asientoContable.montoAsiento}
                onChange={e => onChange(e)}
                className="input"
                type="number"
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              {edit ? (
                <button
                  onClick={e => {
                    setEdit(false);
                    editAsientoContable(e);
                    setAddForm(addForm => !addForm);
                  }}
                  className="button is-link is-warning"
                >
                  Editar Documento
                </button>
              ) : (
                  <button
                    onClick={e => saveAsientoContable(e)}
                    className="button is-link"
                  >
                    Guardar Transaccion
                  </button>
                )}
            </div>
            <div className="control">
              <button
                onClick={() => {
                  setEdit(false);
                  setAddForm(addForm => !addForm);
                  clearData()
                }}
                className="button is-link is-light"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      ) : (
          <a href="#" onClick={() => setAddForm(addForm => !addForm)}>
            Agregar nueva transaccion
          </a>
        )}

      {asientosContables.length > 0 ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>
                <abbr title="Position">Id</abbr>
              </th>
              <th>Descripcion</th>
              <th>Cuenta</th>
              <th>Tipo de Movimiento</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asientosContables.map(asientoContable => (
              <tr key={asientoContable.id}>
                <td>{asientoContable.id}</td>
                <td>{asientoContable.descripcion}</td>
                <td>{asientoContable.cuenta}</td>
                <td>{asientoContable.tipoMovimiento}</td>
                <td>{asientoContable.cliente.nombre}</td>
                <td>{asientoContable.montoAsiento}</td>
                <td>{asientoContable.estado}</td>
                <td>{asientoContable.fecha}</td>
                <td>
                  <p className="buttons">
                    <button
                      onClick={() => {
                        setEdit(true);
                        setAsientoContable(asientoContable);
                        setAddForm(addForm => !addForm);
                      }}
                      className="button is-warning"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-pen"></i>
                      </span>
                    </button>
                    <button
                      onClick={e => deleteAsientoContable(e, asientoContable.id)}
                      className="button is-danger"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-trash-alt"></i>
                      </span>
                    </button>
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
          <div>No data</div>
        )}
    </section>
  );
};

export default AsientosContablesPage;
