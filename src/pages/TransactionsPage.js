import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Swal from "sweetalert2";
import MaterialTable from 'material-table'

const transacctionData = {
  tipoMovimiento: "DB",
  tipoDocumento: "",
  numeroDocumento: "",
  cliente: "",
  monto: ""
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [addForm, setAddForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [transaction, setTransaction] = useState(transacctionData);

  useEffect(() => {
    const documentData = async () => {
      const result = await api.get("/tiposDocumentos");
      setDocuments(result.data);
    };

    const documentClients = async () => {
      const result = await api.get("/clientes");
      setUsers(result.data);
    };

    getTransacciones();
    documentData();
    documentClients();
  }, []);

  const getTransacciones = async () => {
    const result = await api.get("/transacciones");
    setTransactions(result.data);
  };

  const onChange = e => {
    e.persist();
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const saveTransaction = e => {
    e.preventDefault();
    const data = {
      tipoMovimiento: transaction.tipoMovimiento,
      tipoDocumento: transaction.tipoDocumento,
      numeroDocumento: transaction.numeroDocumento,
      cliente: transaction.cliente,
      monto: transaction.monto
    };
    api
      .post("/transacciones", data)
      .then(response => {
        Swal.fire({
          title: "Guardado satisfactoriamente",
          icon: "success"
        });
        getTransacciones()
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

  const deleteTransaction = (e, id) => {
    e.preventDefault();
    api
      .delete(`/transacciones/${id}`)
      .then(response => {
        Swal.fire({
          title: "Eliminado satisfactoriamente",
          icon: "success"
        });
        getTransacciones()
      })
      .catch(error => {
        Swal.fire({
          title: "Error papalote",
          icon: "error"
        });
      });
  };

  const editTransaction = e => {
    e.preventDefault();
    const data = {
      tipoMovimiento: transaction.tipoMovimiento,
      tipoDocumento: transaction.tipoDocumento,
      numeroDocumento: transaction.numeroDocumento,
      cliente: transaction.cliente,
      monto: transaction.monto
    };

    api
      .put(`/transacciones/${transaction.id}`, data)
      .then(() => {
        Swal.fire({
          title: "Editado satisfactoriamente",
          icon: "success"
        });
        clearData()
        getTransacciones()
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      });
  };

  const clearData = () => {
    setTransaction(transacctionData)
  }

  function TransactionsTable(transactionsData) {
    let data = transactionsData.map(transaction => {
      return {
        ...transaction,
        cliente: transaction.cliente.id,
        tipoDocumento: transaction.tipoDocumento.id
      }
    })
  
    let lookUpClientesData = transactionsData.map(transaction => {
      return {
        [transaction.cliente.id]: transaction.cliente.nombre
      }
    }) 
  
    let lookUpTipoDocumentoData = transactionsData.map(transaction => {
      return {
        [transaction.tipoDocumento.id]: transaction.tipoDocumento.descripcion
      }
    })
  
    let lookUpClientes = Object.assign({}, ...lookUpClientesData)
    let lookUpTipoDocumento = Object.assign({}, ...lookUpTipoDocumentoData)
  
    return (
      <MaterialTable
        title="Transacciones"
        columns={[
          { title: 'ID', field: 'id' },
          { title: 'Monto', field: 'monto' },
          { title: 'Cliente', field: "cliente", lookup: lookUpClientes },
          { title: 'Tipo documento', field: 'tipoDocumento', lookup: lookUpTipoDocumento },
          { title: "Tipo movimiento", field: "tipoMovimiento", lookup: {DB: "Debito", "CR": "Credito"} },
          { title: "Numero documento", field: "numeroDocumento" },
          { title: "Fecha", field: "fecha" },
        ]}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit row",
            onClick: (event, rowData) => {
              setEdit(true);
              setTransaction(rowData);
              setAddForm(addForm => !addForm);
            }
          },
          {
            icon: "delete",
            tooltip: "Delete row",
            onClick: (event, rowData) => deleteTransaction(event, rowData.id)
          }
        ]}
        data={data}
        options={{
          filtering: true,
          actionsColumnIndex: -1
        }}
      />
    )
  }

  return (
    <section className="section">
      <h1 className="is-size-1">Transacciones</h1>
      {addForm ? (
        <form className="form">
          <div className="field">
            <label className="label">Cliente</label>
            <div className="control is-fullwidth">
              <div className="select is-primary is-fullwidth">
                <select
                  defaultValue={
                    edit === false ? (users[0].id ? users[0].id : 0) :
                      transaction.cliente.id
                  }
                  value={transaction.cliente.id}
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
            <label className="label">Tipo de Transaccion</label>
            <div className="control is-fullwidth">
              <div className="select is-primary is-fullwidth">
                <select
                  defaultValue={
                    edit == false ? "DB" : transaction.tipoMovimiento
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
            <label className="label">Documento</label>
            <div className="control is-fullwidth">
              <div className="select is-primary is-fullwidth">
                <select
                  value={transaction.tipoDocumento.id}
                  onChange={e => onChange(e)}
                  name="tipoDocumento"
                >
                  {documents &&
                    documents.map(document => (
                      <option key={document.id} value={document.id}>
                        {document.descripcion}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Numero de Documento</label>
            <div className="control">
              <input
                name="numeroDocumento"
                value={transaction.numeroDocumento}
                onChange={e => onChange(e)}
                className="input"
                type="number"
                placeholder="233"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Monto</label>
            <div className="control">
              <input
                name="monto"
                value={transaction.monto}
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
                    editTransaction(e);
                    setAddForm(addForm => !addForm);
                  }}
                  className="button is-link is-warning"
                >
                  Editar Documento
                </button>
              ) : (
                  <button
                    onClick={e => saveTransaction(e)}
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

      {
        transactions.length > 0 ? TransactionsTable(transactions) : (
          <div>No data</div>
        )}
    </section>
  );
};

export default TransactionsPage;