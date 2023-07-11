import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import useAuth from '../hooks/useAuth'

const CrearNegociacion = () => {
    const navigate = useNavigate();

    const [dataclientes, setDataClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [numFactura, setNumFactura] = useState('');
    const [dataproductos, setDataProductos] = useState([]);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidad, setCantidad] = useState([]);
    const [precioBase, setPrecioBase] = useState([]);
    const [precioVenta, setPrecioVenta] = useState([]);
    const [numCuotas, setNumCuotas] = useState('');
    const [tasa, setTasa] = useState('');
    const [anticipo, setAnticipo] = useState('');
    const [interes, setInteres] = useState('');
    const [fechaFacturacion, setFechaFacturacion] = useState('');
    const [total, setTotal] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const handleCancelar = () => {
        navigate(-1); // Regresa a la ubicación anterior
    };
    const { auth } = useAuth()

    useEffect(() => {
        fetch('http://localhost:4000/api/cliente/obtenerCliente')
            .then(res => res.json())
            .then(data => {
                setDataClientes(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/api/producto/obtenerProducto')
            .then(res => res.json())
            .then(data => {
                setDataProductos(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function validarNumericos(event) {
        const charCode = event.keyCode || event.which;
        const char = String.fromCharCode(charCode);

        // Permitir la tecla de retroceso (backspace) y la tecla de suprimir (delete)
        if (charCode === 8 || charCode === 46 || charCode === 9) {
            return;
        }

        // Verificar si el carácter no es un número del 0 al 9 ni el punto decimal
        if (/[\D/.-]/.test(char)) {
            event.preventDefault();
        }

        // Verificar que no haya más de un punto decimal
        if (char === '.' && event.target.value.includes('.')) {
            event.preventDefault();
        }
    }

    //Eliminar los productos del listado de comprados
    function eliminarProducto(index) {
        const productosActualizados = [...productosSeleccionados];
        productosActualizados.splice(index, 1);
        setProductosSeleccionados(productosActualizados);
    }

    const agregarNegociacion = async () => {

        // Verificar que todos los campos sean llenados
        // if (
        //     selectedCliente === '' ||
        //     numFactura === '' ||
        //     selectedProductos.length === 0 ||
        //     cantidad === '' ||
        //     precioBase === '' ||
        //     precioVenta === '' ||
        //     numCuotas === '' ||
        //     tasa === '' ||
        //     anticipo === '' ||
        //     interes === '' ||
        //     fechaFacturacion === '' ||
        //     total === '' ||
        //     productosSeleccionados.length === 0
        // ) {
        //     console.error('Todos los campos son obligatorios');
        //     return;
        // }

        const tipoMaquinaArray = productosSeleccionados.map((producto) => producto.tipoMaquina);
        const cantidadArray = productosSeleccionados.map((producto) => Number(producto.cantidad));
        const precioBaseArray = productosSeleccionados.map((producto) => Number(producto.precioBase));
        const precioVentaArray = productosSeleccionados.map((producto) => Number(producto.precioVenta));

        const nuevaNegociacion = {
            cliente: selectedCliente,
            numFactura,
            tipoMaquina: tipoMaquinaArray,
            cantidad: cantidadArray,
            precioBase: precioBaseArray,
            precioVenta: precioVentaArray,
            numCuotas,
            tasa,
            anticipo,
            interes,
            fechaFacturacion,
            total,
            productos: productosSeleccionados, // Agregar productos seleccionados
        };

        try {
            const response = await fetch('http://localhost:4000/api/negociacion/agregarNegociacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaNegociacion)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Cliente agregado correctamente

            } else {
                throw new Error('Error al agregar la negociación');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const agregarProducto = () => {
        if (selectedProductos.length === 0) {
            console.log('Debe seleccionar al menos un producto');
            return;
        }

        const obtenerPrecioBase = (producto) => {
            const productoEncontrado = dataproductos.find((p) => p.nombre === producto);
            return productoEncontrado ? productoEncontrado.precioBase : '';
        };

        const nuevosProductos = selectedProductos.map((producto, index) => ({
            tipoMaquina: producto,
            cantidad: Number(cantidad[index]), // Convertir la cadena a número
            precioBase: Number(obtenerPrecioBase(producto)),
            precioVenta: Number(precioVenta[index]),
        }));

        setCantidad(prevCantidad => [...prevCantidad, ...nuevosCantidad]);
        setPrecioBase(prevPrecioBase => [...prevPrecioBase, ...nuevosPreciosBase]);
        setPrecioVenta(prevPrecioVenta => [...prevPrecioVenta, ...nuevosPreciosVenta]);

        const nuevosCantidad = nuevosProductos.map((producto) => producto.cantidad);
        const nuevosPreciosBase = nuevosProductos.map((producto) => producto.precioBase); // Obtener el array de precios base
        const nuevosPreciosVenta = nuevosProductos.map((producto) => producto.precioVenta);

        setProductosSeleccionados((prevProductos) => {
            const nuevosProductosSeleccionados = [...prevProductos, ...nuevosProductos];
            console.log(nuevosProductosSeleccionados);
            return nuevosProductosSeleccionados;
        });

        // Almacenar los precios base en un estado separado
        setPrecioBase(prevPreciosBase => [...prevPreciosBase, ...nuevosPreciosBase]);
    };

    const limpiarCampos = () => {
        setSelectedProductos([]);
        setCantidad([]);
        setPrecioVenta([]);
    };

    return (
        <>
            <section className="d-flex">
                <aside className="">
                    <ul className="d-flex flex-column justify-content-start w-100 px-0 my-0 mx-0">
                        <div className="d-flex justify-content-start align-items-center px-3 py-2">
                            <i className="py-3">
                                <img className="rounded-circle" src="https://www.novomatic.com/themes/novomatic/images/novomatic_n.svg" alt="logo" title="logo" width="35" height="35" />
                            </i>
                            <p className="mb-0 mx-3 text-icon-menu">{auth.nombre} {auth.apellido}</p>
                        </div>
                        <Link className="d-flex justify-content-start py-2 border-bottom border-dark" to="/admin/usuarios">
                            <div className="d-flex align-items-center">
                                <i className="icon-menu fa-solid fa-user-tie mx-4" title="Usuarios"></i>
                                <p className="text-icon-menu my-0">Usuarios</p>
                            </div>
                        </Link>
                        <Link className="d-flex justify-content-start py-2 border-bottom border-dark" to="/admin/listaclientes">
                            <div className="d-flex align-items-center">
                                <i className="icon-menu fa-solid fa-user mx-4" title="Clientes"></i>
                                <p className="text-icon-menu my-0">Clientes</p>
                            </div>
                        </Link>
                        <Link className="d-flex justify-content-start py-2 border-bottom border-dark" to="/admin/listaproductos">
                            <div className="d-flex align-items-center">
                                <i className="icon-menu fa-solid fa-box-open mx-4" title="Productos"></i>
                                <p className="text-icon-menu my-0">Productos</p>
                            </div>
                        </Link>
                        <Link className="d-flex justify-content-start py-2 border-bottom border-dark" to="/admin/listanegociaciones">
                            <div className="d-flex align-items-center">
                                <i className="icon-menu fa-solid fa-sack-dollar mx-4" title="Negociaciones"></i>
                                <p className="text-icon-menu my-0">Negociaciones</p>
                            </div>
                        </Link>
                        <Link className="d-flex justify-content-between py-2 border-bottom border-dark" to="/admin/listaplandepago">
                            <div className="d-flex align-items-center">
                                <i className="icon-menu fa-solid fa-money-bill-1-wave mx-4" title="Planes de pago"></i>
                                <p className="text-icon-menu my-0">Planes de pago</p>
                            </div>
                        </Link>
                    </ul>
                </aside>
                <main className="d-flex flex-column">
                    <h2 className="py-0 pt-5 my-0">CREAR NEGOCIACIÓN</h2>
                    <br />
                    <form className="formulario" action="">
                        <div className="contenedores d-flex justify-content-center flex-lg-row flex-column flex-sm-column mx-5 gap-5">
                            <div className="contenedores__div1 d-flex flex-column align-items-center ms-sm-0 w-100">
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cliente</label>
                                    <select id="cliente" className="form-select" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
                                        <option value="">Seleccionar cliente</option>
                                        {dataclientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.nombre}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Producto</label>
                                    <select
                                        id="producto"
                                        className="form-select"
                                        required
                                        value={selectedProductos.join(',')} // Convertir el array en una cadena separada por comas
                                        onChange={(e) =>
                                            setSelectedProductos(
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )}>
                                        <option value="">Seleccionar producto</option>
                                        {dataproductos.map((producto) => (
                                            <option key={producto.codigo} value={producto.nombre}>
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Precio venta</label>
                                    {selectedProductos.length > 0 ? (
                                        selectedProductos.map((producto, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className="form-control"
                                                placeholder="Precio venta"
                                                required
                                                onKeyDown={validarNumericos}
                                                value={precioVenta[index] || ''}
                                                onChange={(e) => {
                                                    const nuevosValores = [...precioVenta];
                                                    nuevosValores[index] = e.target.value;
                                                    setPrecioVenta(nuevosValores);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Precio venta"
                                            disabled
                                        />
                                    )}
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Cantidad Cuotas</label>
                                    <select className="form-select" required value={numCuotas} onChange={(e) => { setNumCuotas(e.target.value) }}>
                                        <option value="">Seleccionar</option>
                                        {Array.from({ length: 24 }, (_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Anticipo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Porcentaje anticipo"
                                        required
                                        value={anticipo}
                                        onChange={(e) => { setAnticipo(e.target.value) }}
                                    />
                                </div>
                                <div className="mb-3 w-100">
                                    <label className="form-label fw-bold">Fecha Facturación</label>
                                    <input type="date" className="form-control" placeholder="Fecha Facturación" required value={fechaFacturacion} onChange={(e) => { setFechaFacturacion(e.target.value) }} />
                                </div>
                            </div>
                            <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                                <div className="contenedores__div2 d-flex flex-column align-items-center me-5 me-sm-0 w-100">
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Factura</label>
                                        <input type="text" className="form-control" placeholder="Número de Factura" required value={numFactura} onChange={(e) => { setNumFactura(e.target.value) }} />
                                    </div>

                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Cantidad</label>
                                        {selectedProductos.length > 0 ? (
                                            selectedProductos.map((producto, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Cantidad"
                                                    required
                                                    onKeyDown={validarNumericos}
                                                    value={cantidad[index] || ''}
                                                    onChange={(e) => {
                                                        const nuevosValores = [...cantidad];
                                                        nuevosValores[index] = e.target.value;
                                                        setCantidad(nuevosValores);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Cantidad"
                                                disabled
                                            />
                                        )}
                                    </div>

                                    <div className="mb-3 w-100">
                                        <button type="button" className="btn btn-dark btn-styles" id="producto" required value={selectedProductos} onChange={e => setSelectedProductos(e.target.value)} onClick={agregarProducto} style={{ marginRight: 10 }}>Agregar</button>
                                        <button type="button" className="btn btn-secondary btn-styles" onClick={limpiarCampos}>Limpiar</button>
                                    </div>
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Tasa</label>
                                        <input type="text" className="form-control" placeholder="Porcentaje tasa" required value={tasa} onChange={(e) => { setTasa(e.target.value) }} />
                                    </div>
                                    <div className="mb-3 w-100">
                                        <label className="form-label fw-bold">Interes</label>
                                        <input type="text" className="form-control" placeholder="Porcentaje interes" required value={interes} onChange={(e) => { setInteres(e.target.value) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contenedor__botones d-flex justify-content-center flex-lg-row flex-column flex-sm-column my-3 mx-5 gap-5">
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones ms-sm-0 w-100">
                                    <button type="submit" className="btn btn-dark w-100 btn-styles" onClick={agregarNegociacion}>Guardar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center w-100">
                                <div className="div_botones me-sm-0 w-100">
                                    <button type="button" className="btn btn-dark w-100 btn-styles" onClick={handleCancelar}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <table className="table table-hover mb-5 border" style={{ maxWidth: 800 }}>
                            <thead className="table-secondary">
                                <tr>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Precio Base</th>
                                    <th scope="col">Precio Venta</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosSeleccionados.map((producto, index) => (
                                    <tr key={producto.id || index}>
                                        <td>{producto.tipoMaquina}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>{producto.precioBase}</td>
                                        <td>{producto.precioVenta}</td>
                                        <td>
                                            <Link>
                                                <FaTimes size={35} style={{ color: 'black' }} onClick={() => eliminarProducto(index)} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </section>
        </>
    )
}

export default CrearNegociacion