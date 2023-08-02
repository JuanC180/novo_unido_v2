const Producto = require('../models/ProductoModels');
const path = require('path')

const registrarProducto = async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
      }
    
      const {imagen} = req.files;
    
      const uploadPath = path.join( __dirname, '../../frontend/public/uploads/products/', imagen.name);
    
      imagen.mv(uploadPath, (err) => {
        if (err) {
            console.log(err)
        //   return res.status(500).json({err});
        }
    
        // res.json({msg: 'File uploaded to ' + uploadPath});
      });

    const { referencia } = req.body;
    const existeReferencia = await Producto.findOne({referencia})

    if(existeReferencia){
        const error = new Error("Referencia ya registrada..")
        return res.status(400).json({msg: error.message})
    }

    try {
        const nuevoProducto = new Producto();
        nuevoProducto.referencia = req.body.referencia || nuevoProducto.referencia;
        nuevoProducto.nombre = req.body.nombre || nuevoProducto.nombre;
        // nuevoProducto.imagen = uploadPath || nuevoProducto.imagen;
        nuevoProducto.imagen = imagen.name || nuevoProducto.imagen;
        nuevoProducto.cantidad = req.body.cantidad || nuevoProducto.cantidad;
        nuevoProducto.precioBase = req.body.precioBase || nuevoProducto.precioBase;
        nuevoProducto.descripcion = req.body.descripcion || nuevoProducto.descripcion;

        await nuevoProducto.save();
        res.json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

const obtenerProductos = async (req, res) => {
    Producto.find({})
        .then((results) => {
            res.json(results);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        });
};

const obtenerDataProductos = async (req, res) => {
    const id = req.params.id;
    Producto.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del producto' });
        });
};

const actualizarProducto = async (req, res) => {
    const id = req.params.id;
    const propiedadesActualizadas = req.body;
    try {
        await Producto.findByIdAndUpdate(id, propiedadesActualizadas);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const eliminarProducto = async (req, res) => {
    const id = req.params.id;
    try {
        await Producto.findOneAndDelete({ _id: id });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

//Actualizar el estado del producto
const actualizarEstadoProducto = (req, res) => {
    // Obtiene el ID del producto desde los parámetros de la URL
    const productoId = req.params.id;

    // Obtiene el nuevo estado del producto desde el cuerpo de la solicitud
    const nuevoEstado = req.body.estado;

    // Actualiza el estado del producto en la base de datos
    Producto.findByIdAndUpdate(productoId, { estado: nuevoEstado }, { new: true })
        .then(productoActualizado => {
            // Envía la respuesta con el producto actualizado
            res.json(productoActualizado);
        })
        .catch(error => {
            // Maneja los errores y envía una respuesta con el código de error correspondiente
            res.status(500).json({ error: 'Error al actualizar el estado del producto' });
        });
};

module.exports = {
    registrarProducto,
    obtenerProductos,
    obtenerDataProductos,
    actualizarProducto,
    eliminarProducto,
    actualizarEstadoProducto
}