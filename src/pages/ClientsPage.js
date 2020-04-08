import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";

const clientData = {
  name: "",
  cedula: "",
  limit: 0,
  status: ""
};

const ClientsPage = () => {
  const [users, setUsers] = useState([]);
  const [addForm, setAddForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [client, setClient] = useState(clientData);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const result = await api.get("/clientes");
    setUsers(result.data);
  };

  const editClient = e => {
    e.preventDefault();
    const data = {
      id: client.id,
      nombre: client.nombre,
      cedula: client.cedula,
      limiteDeCredito: client.limiteDeCredito,
      estado: "R"
    };

    api
      .put(`clientes/${data.id}`, data)
      .then(response => {
        Swal.fire({
          title: "Editado satisfactoriamente",
          icon: "success"
        });
        getClients()
      })
      .catch(error => {
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      });
  };

  const saveClient = e => {
    e.preventDefault();
    const data = {
      nombre: client.nombre,
      cedula: client.cedula,
      limiteDeCredito: client.limiteDeCredito,
      estado: "R"
    };
    api
      .post("/clientes", data)
      .then(response => {
        Swal.fire({
          title: "Guardado satisfactoriamente",
          icon: "success"
        });
        getClients()
      })
      .catch(error => {
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      });
  };

  const deleteClient = (e, id) => {
    e.preventDefault();
    api
      .delete(`/clientes/${id}`)
      .then(response => {
        Swal.fire({
          title: "Eliminado satisfactoriamente",
          icon: "success"
        });
        getClients()
      })
      .catch(error => {
        Swal.fire({
          title: "Error papalote",
          icon: "error"
        });
      });
  };

  const onChange = e => {
    e.persist();
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const clearData = () => {
    setClient(clientData)
  }

  return (
    <section className="section">
      <h1 className="is-size-1">Clientes</h1>

      {addForm ? (
        <div>
          <div className="field">
            <label className="label">Nombre</label>
            <div className="control">
              <input
                name="nombre"
                value={client.nombre}
                onChange={e => onChange(e)}
                className="input"
                type="text"
                placeholder="John Dow"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Cedula</label>
            <div className="control">
              <input
                name="cedula"
                onChange={e => onChange(e)}
                value={client.cedula}
                className="input"
                type="number"
                placeholder="4000000009"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Limite de Credito</label>
            <div className="control">
              <input
                name="limiteDeCredito"
                onChange={e => onChange(e)}
                value={client.limiteDeCredito}
                className="input"
                type="number"
                placeholder="23000"
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              {edit ? (
                <button
                  onClick={e => {
                    setEdit(false);
                    editClient(e);
                    setAddForm(false)
                    clearData()
                  }}
                  className="button is-link is-warning"
                >
                  Editar Cliente
                </button>
              ) : (
                <button onClick={e => saveClient(e)} className="button is-link">
                  Guardar Cliente
                </button>
              )}
            </div>
            <div className="control">
              <button className="button is-link is-light" onClick={() => {
                setAddForm(false)
                clearData()
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <a href="#" onClick={() => setAddForm(true)}>
          Agregar un nuevo cliente
        </a>
      )}
      {users.length > 0 ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>
                <abbr title="Position">Id</abbr>
              </th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Limite de credito</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.cedula}</td>
                <td>{user.limiteDeCredito}</td>
                <td>{user.estado}</td>
                <td>
                  <p className="buttons">
                    <button
                      onClick={() => {
                        setEdit(true);
                        setClient(user);
                        setAddForm(addForm => !addForm);
                      }}
                      className="button is-warning"
                    >
                      <span className="icon is-small">
                        <i className="fas fa-pen"></i>
                      </span>
                    </button>
                    <button
                      onClick={e => deleteClient(e, user.id)}
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

export default ClientsPage;
