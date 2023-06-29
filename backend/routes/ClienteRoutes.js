const express = require('express');
const { registrarCliente, obtenerClientes, obtenerDataClientes, actualizarCliente, eliminarCliente } = require('../controllers/clienteControllers');
const router = express.Router();

router.post('/agregarCliente', registrarCliente);

// Obtener todos los clientes
router.get('/obtenerCliente', obtenerClientes);

// Obtener data de los clientes
router.get('/obtenerdatacliente/:id', obtenerDataClientes);

// Actualizar Cliente
router.put('/actualizarCliente/:id', actualizarCliente);

// Eliminar el cliente
router.delete('/eliminarcliente/:id', eliminarCliente);

module.exports = router;