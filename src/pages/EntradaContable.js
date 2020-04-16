import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Swal from "sweetalert2";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '20ch',
        },
    },
}));

const EntradaContable = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entradaContable, setEntradaContable] = useState({
        Descripción: "",
        montoDebito: 0,
        montoCredito: 0,
        monto: 0,
        estado: "Activo",
        idSisAuxiliar: 2,
        idAuxiliar: 1,
        idCuentasContables: 2,
        idTiposMonedas: 2,
    })
    const classes = useStyles()

    const clearFields = () => {
        setEntradaContable({
            descripción: "",
            montoDebito: 0,
            montoCredito: 0,
            monto: 0,
            estado: "Activo",
            idSisAuxiliar: 2,
            idAuxiliar: 1,
            idCuentasContables: 2,
            idTiposMonedas: 2,
        })
    }

    const openDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
        clearFields();
    }

    const handleChange = e => {
        e.persist();
        setEntradaContable({ ...entradaContable, [e.target.name]: e.target.value });
    };

    const saveEntradaContable = (e) => {
        e.preventDefault();
        const proxy = "https://mysterious-chamber-09938.herokuapp.com/"
        const targetUrl = "https://sistemacontabilidad5.azurewebsites.net/api/ApiEntradaContables"
        
        setLoading(true);
        setOpen(false);
        const data = {
            ...entradaContable,
            montoDebito: Number(entradaContable.montoDebito),
            montoCredito: Number(entradaContable.montoCredito),
            monto: Number(entradaContable.monto),
            idAuxiliar: Number(entradaContable.idAuxiliar)
        }
        fetch(proxy + targetUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                mode: 'no-cors'
            }
        })
            .then(response => {
                Swal.fire({
                    title: "Entrada contable creada",
                    icon: "success"
                });

                setLoading(false)
                clearFields();
            })
            .catch(error => {
                Swal.fire({
                    title: "Error",
                    icon: "error"
                });
                setLoading(false)
                clearFields();
            });
    }

    return (
        <section className="section">
            <h1 className="is-size-1">Entrada contable</h1>
            <Button onClick={openDialog} variant="contained" color="primary">
                Agregar entrada contable
            </Button>
            <Dialog open={open} onClose={closeDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Agregar entrada contable</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Formulario para registrar una entrada contable en el sistema de contabilidad
                    </DialogContentText>
                    <form className={classes.root} autoComplete="off">
                        <TextField
                            autoFocus
                            margin="dense"
                            value={entradaContable.Descripción}
                            onChange={handleChange}
                            name="Descripción"
                            id="Descripción"
                            label="Descripción"
                            type="text"
                            fullWidth
                        />
                        <FormControl>
                            <TextField
                                label="Monto Debito"
                                value={entradaContable.montoDebito}
                                onChange={handleChange}
                                name="montoDebito"
                                id="montoDebito"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Monto Credito"
                                value={entradaContable.montoCredito}
                                onChange={handleChange}
                                name="montoCredito"
                                id="montoCredito"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Monto"
                                value={entradaContable.monto}
                                onChange={handleChange}
                                name="monto"
                                id="monto"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel id="estado-label">Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                id="estado"
                                name="estado"
                                value={entradaContable.estado}
                                onChange={handleChange}
                            >
                                <MenuItem value={"Activo"}>Activo</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="auxSistema-label">Auxiliar del sistema</InputLabel>
                            <Select
                                labelId="auxSistema-label"
                                id="idSisAuxiliar"
                                name="idSisAuxiliar"
                                value={entradaContable.idSisAuxiliar}
                                onChange={handleChange}
                            >
                                <MenuItem value={2}>Nomina</MenuItem>
                                <MenuItem value={3}>Facturacion</MenuItem>
                                <MenuItem value={4}>Inventario</MenuItem>
                                <MenuItem value={5}>Cuentas por pagar</MenuItem>
                                <MenuItem value={6}>Compras</MenuItem>
                                <MenuItem value={7}>Activos fijos</MenuItem>
                                <MenuItem value={8}>Cheques</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="auxiliar-label">Auxiliar</InputLabel>
                            <Select
                                labelId="auxiliar-label"
                                id="idAuxiliar"
                                name="idAuxiliar"
                                value={entradaContable.idAuxiliar}
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>Alexander</MenuItem>
                                <MenuItem value={2}>Leslie</MenuItem>
                                <MenuItem value={3}>Kevin</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="cuentaContable-label">Cuenta Contable</InputLabel>
                            <Select
                                labelId="cuentaContable-label"
                                id="idCuentasContables"
                                name="idCuentasContables"
                                value={entradaContable.idCuentasContables}
                                onChange={handleChange}
                            >
                                <MenuItem value={2}>Efectivo en caja y banco</MenuItem>
                                <MenuItem value={3}>Caja Chica</MenuItem>
                                <MenuItem value={4}>Cuenta corriente del banco</MenuItem>
                                <MenuItem value={5}>Inventarios y mercancía</MenuItem>
                                <MenuItem value={6}>Inventario</MenuItem>
                                <MenuItem value={7}>Cuenta por cobrar</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="tipoMoneda-label">Tipo moneda</InputLabel>
                            <Select
                                labelId="tipoMoneda-label"
                                id="idTiposMonedas"
                                name="idTiposMonedas"
                                value={entradaContable.idTiposMonedas}
                                onChange={handleChange}
                            >
                                <MenuItem value={2}>Peso dominicano</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={saveEntradaContable} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
            {loading ? <LinearProgress style={{marginTop: "50px"}} /> : null}
        </section>
    )
}

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onChange={props.onChange}
            thousandSeparator
            isNumericString
            prefix="$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default EntradaContable;
