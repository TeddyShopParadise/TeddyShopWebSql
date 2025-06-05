import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  TablePagination,
  Typography,
  Tooltip,
  Chip,
  FormControlLabel,
  Switch,
  Snackbar, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Checkbox,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Stack 
} from '@mui/material';
import sortBy from 'lodash/sortBy';
import { Edit, Delete, ListAlt, ArrowUpward, ArrowDownward, Info, AddCircle, Save, Cancel, Add, Clear, Search } from '@mui/icons-material';
import '../PagesStyle.css';
import { getApiUrl } from '../../utils/apiConfig';
import useApiRequest from '../../hooks/useApiRequest';

const apiUrl = getApiUrl();
console.log("Url almacenada: ", apiUrl);

const ProductoComponent = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catalogos, setCatalogos] = useState([]);
  const [historialPrecios, setHistorialPrecios] = useState([]);
  const [estiloProducto, setEstiloProducto] = useState('');
  const [disponibilidadProducto, setDisponibilidadProducto] = useState('');
  const [tamanoproducto, settamanoproducto] = useState('');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [catalogosSeleccionados, setCatalogosSeleccionados] = useState([]);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imagenProducto, setImagenProducto] = useState(null); 
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [openInventarioDialog, setOpenInventarioDialog] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [foundProduct, setFoundProduct] = useState(true);

  const [inventarioData, setInventarioData] = useState({
    stock: 0,
    stockMinimo: 0,
    stockMaximo: 0,
    precioVenta: '',
    precioCompra: ''
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [inventarioExistente, setInventarioExistente] = useState(null);
  
  const [searchProductId, setSearchProductId] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchCatalogos();
    fetchHistorialPrecios(); 
  }, []);
  
 useEffect(() => {
  if (searching && searchProductId) {
    // Buscamos el primer producto cuyo ID contenga la cadena
    const match = productos.find(p =>
      p.id.toString().toLowerCase().includes(searchProductId.toLowerCase())
    );

    setFoundProduct(match || null);
  } else {
    // Al resetear la búsqueda, limpiamos el producto encontrado
    setFoundProduct(null);
  }
}, [productos, searchProductId, searching]);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${apiUrl}/producto`);
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  
  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${apiUrl}/categorias`);
      if (!response.ok) throw new Error('Error al obtener las categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  
  const fetchCatalogos = async () => {
    try {
      const response = await fetch(`${apiUrl}/catalogos/activos`);
      if (!response.ok) throw new Error('Error al obtener los catálogos');
      const data = await response.json();
      setCatalogos(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchHistorialPrecios = async () => {
    try {
        const response = await fetch(`${apiUrl}/historialPrecio`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los precios históricos');
        }
        const data = await response.json();
        setHistorialPrecios(data);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
  };

  const handleSearch = () => {
    if (searchProductId.trim() === '') {
      setSearching(false);
      setFilteredProductos(productos);
      setFoundProduct(null);
      return;
    }
    
    setSearching(true);
    const filtered = productos.filter(producto => 
      producto.id.toLowerCase().includes(searchProductId.toLowerCase())
    );
    
    const exactMatch = productos.find(producto => 
      producto.id.toLowerCase() === searchProductId.toLowerCase()
    );
    
    if (exactMatch) {
      setFoundProduct(exactMatch);
      setFilteredProductos([exactMatch]);
    } else {
      setFoundProduct(null);
      setFilteredProductos(filtered);
      
      if (filtered.length === 0) {
        Swal.fire({
          title: 'Sin resultados',
          text: 'No se encontraron productos con ese ID',
          icon: 'info',
          confirmButtonColor: '#f48fb1'
        });
      }
    }
  };
    
  const clearSearch = () => {
    setSearchProductId('');
    setSearching(false);
    setFilteredProductos(productos);
    setFoundProduct(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "peluches"); 

        const response = await fetch("https://api.cloudinary.com/v1_1/peluches/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const data = await response.json();
        setImagenProducto(data.secure_url); 
      } catch (error) {
        console.error(error);
        alert("Error al cargar la imagen");
      }
    }
  };
  const { makeRequest } = useApiRequest();

  const crearProducto = async () => {
    if (!estiloProducto || !disponibilidadProducto || !tamanoproducto || 
        categoriasSeleccionadas.length === 0 || catalogosSeleccionados.length === 0) {
      await Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }
  
    const productoData = {
      estiloProducto,
      disponibilidadProducto,
      tamanoproducto,
      categorias: categoriasSeleccionadas,
      catalogos: catalogosSeleccionados,
      historialPrecios: preciosSeleccionados,
      imagen: imagenProducto
    };
  
    await makeRequest({
      url: `${apiUrl}/producto`,
      method: 'POST',
      data: productoData,
      success: {
        title: 'Éxito',
        text: 'Producto creado correctamente',
        icon: 'success'
      },
      error: {
        title: 'Error',
        text: (error) => error.message || 'Error al crear el producto',
        icon: 'error',
        
      },
      onSuccess: (data) => {
        setNewProductId(data.id);
        setOpenInventarioDialog(true);
      }
    });
  };
  
  const actualizarProducto = async () => {
    if (!editingId || !estiloProducto || !disponibilidadProducto || 
        categoriasSeleccionadas.length === 0 || catalogosSeleccionados.length === 0) {
      await Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }
  
    const productoData = {
      estiloProducto,
      disponibilidadProducto,
      tamanoproducto,
      imagen: imagenProducto,
      categorias: categoriasSeleccionadas || [],
      catalogos: catalogosSeleccionados,
      historialPrecios: preciosSeleccionados
    };
  
    await makeRequest({
      url: `${apiUrl}/producto/${editingId}`,
      method: 'PUT',
      data: productoData,
      success: {
        title: 'Éxito',
        text: 'Producto actualizado correctamente',
        icon: 'success'
      },
      error: {
        title: 'Error',
        text: (error) => error.message || 'Error al actualizar el producto',
        icon: 'error'
      },
      onSuccess: async () => {
        try {
          const inventarioResponse = await fetch(`${apiUrl}/inventario?producto=${editingId}`);
          if (inventarioResponse.ok) {
            const inventarioData = await inventarioResponse.json();
            if (inventarioData && inventarioData.length > 0) {
              setInventarioExistente(inventarioData[0]);
              setOpenConfirmDialog(true);
              return;
            }
          }
          resetForm();
          fetchProductos();
        } catch (error) {
          console.error('Error al buscar inventario:', error);
          resetForm();
          fetchProductos();
        }
      }
    });
  };
  
  const eliminarProducto = async (id) => {
    await makeRequest({
      url: `${apiUrl}/producto/${id}`,
      method: 'DELETE',
      confirm: {
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
      },
      success: {
        title: 'Eliminado',
        text: 'El producto ha sido eliminado correctamente',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      },
      error: {
        title: 'Error',
        text: (error) => error.message || 'Error al eliminar el producto',
        icon: 'error',
        confirmButtonColor: '#d33'
      },
      onSuccess: () => {
        fetchProductos();
        setProductos(prev => prev.filter(p => p.id !== id));
      }
    });
  };
  
  const editarProducto = (producto) => {
    setEditingId(producto.id);
    setEstiloProducto(producto.estiloProducto || '');
    setDisponibilidadProducto(producto.disponibilidadProducto || 0);
    settamanoproducto(producto.tamanoproducto || '');
    setImagenProducto(producto.imagen || '');
    const categorias = Array.isArray(producto.categorias) ? producto.categorias : [];
    const catalogos = Array.isArray(producto.catalogos) ? producto.catalogos : [];
    const historialPrecio = Array.isArray(producto.historialPrecio) ? producto.historialPrecio : [];
  };

  const crearInventario = async () => {
    try {
      const productId = inventarioExistente ? editingId : newProductId;
      
      if (!productId) {
        throw new Error('No se encontró el ID del producto');
      }

      let response;
      if (inventarioExistente) {
        response = await fetch(`${apiUrl}/inventario/${inventarioExistente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...inventarioData, idProducto: productId })
        });
      } else {
        response = await fetch(`${apiUrl}/inventario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...inventarioData, idProducto: productId })
        });
      }

      if (!response.ok) throw new Error(await response.text());

      Swal.fire('Éxito', inventarioExistente 
        ? 'Inventario actualizado correctamente' 
        : 'Inventario creado correctamente', 'success');
        
      setOpenInventarioDialog(false);
      resetForm();
      fetchProductos();
      setInventarioExistente(null);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };
  
  const handleActualizarInventario = async () => {
    setOpenConfirmDialog(false);
    setOpenInventarioDialog(true);
    if (inventarioExistente) {
      setInventarioData({
        stock: inventarioExistente.stock,
        stockMinimo: inventarioExistente.stockMinimo,
        stockMaximo: inventarioExistente.stockMaximo,
        precioVenta: inventarioExistente.precioVenta,
        precioCompra: inventarioExistente.precioCompra
      });
    }
  };

  const handleNoActualizarInventario = () => {
    setOpenConfirmDialog(false);
    Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
    resetForm();
    fetchProductos();
  };

  const resetForm = () => {
    setEstiloProducto('');
    setDisponibilidadProducto(0);
    settamanoproducto('');
    setImagenProducto('');
    setCategoriasSeleccionadas([]);
    setCatalogosSeleccionados([]);
    setPreciosSeleccionados([]);
    setEditingId(null);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const openDetailsDialog = (producto) => {
    setSelectedProducto(producto);
  };

  const closeDetailsDialog = () => {
    setSelectedProducto(null);
  };
  
  return (
    <Box className="BoxInicial">
      <Box className="Box"
        sx={{
          width: '90%',
          maxWidth: '900px',
          padding: { xs: '20px', md: '30px' },
          borderRadius: '30px',
          margin: '0 auto',
          backgroundColor: '#fffafc',
          boxShadow: '0 8px 24px rgba(248, 200, 220, 0.3)',
          border: '2px solid #f8c8dc',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: '30px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '25%',
              width: '50%',
              height: '4px',
              background: 'linear-gradient(90deg, #fce4ec 0%, #f8c8dc 50%, #fce4ec 100%)',
              borderRadius: '10px',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#b04e6f',
              fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
            }}
          >
            Gestión de Productos
          </Typography>
        </Box>
  
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            borderRadius: '20px',
            backgroundColor: '#fff5f7',
            marginBottom: '30px',
            border: '1px solid #f8c8dc',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: '15px',
              color: '#b04e6f',
              fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
            }}
          >
            {editingId ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
          </Typography>
  
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              value={estiloProducto}
              onChange={(e) => setEstiloProducto(e.target.value)}
              label="Descripción Producto"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            />
  
            <TextField
              value={disponibilidadProducto}
              onChange={(e) => setDisponibilidadProducto(e.target.value)}
              label="Disponibilidad"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            />
  
            <TextField
              value={tamanoproducto}
              onChange={(e) => settamanoproducto(e.target.value)}
              label="Tamaño"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            />
  
            <FormControl fullWidth margin="normal" required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            >
              <InputLabel>Categorías</InputLabel>
              <Select
                multiple
                value={categoriasSeleccionadas}
                onChange={(e) => setCategoriasSeleccionadas(e.target.value)}
                label="Categorías"
                renderValue={(selected) => selected.map(id => {
                  const categoria = categorias.find(cat => cat.id === id);
                  return categoria ? categoria.nombreCategoria : "";
                }).join(", ")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                      overflow: 'auto',
                    },
                  },
                }}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombreCategoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <FormControl fullWidth margin="normal" required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            >
              <InputLabel>Catálogos</InputLabel>
              <Select
                multiple
                value={catalogosSeleccionados}
                onChange={(e) => setCatalogosSeleccionados(e.target.value)}
                label="Catálogos"
                renderValue={(selected) => selected.map(id => {
                  const catalogo = catalogos.find(cat => cat.id === id);
                  return catalogo ? catalogo.nombreCatalogo : "";
                }).join(", ")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                      overflow: 'auto',
                    },
                  },
                }}
              >
                {catalogos.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombreCatalogo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <FormControl fullWidth margin="normal" required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            >
              <InputLabel>Precio Histórico</InputLabel>
              <Select
                multiple
                value={preciosSeleccionados}
                onChange={(e) => { setPreciosSeleccionados(e.target.value); }}
                label="Precio Histórico"
                renderValue={(selected) => 
                  selected.map(id => {
                    const precio = historialPrecios.find(p => p.id === id);
                    return precio ? new Intl.NumberFormat('es-CO', { 
                      style: 'currency', 
                      currency: 'COP' 
                    }).format(precio.precio) : "";
                  }).join(", ")
                }
              >
                {historialPrecios.map((precio) => (
                  <MenuItem key={precio.id} value={precio.id}>
                    {new Intl.NumberFormat('es-CO', { 
                      style: 'currency', 
                      currency: 'COP' 
                    }).format(precio.precio)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              label="Imagen del Producto"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#f48fb1',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#f48fb1',
                  },
                },
              }}
            />
  
            {imagenProducto && (
              <Box display="flex" justifyContent="center">
                <img 
                  src={imagenProducto} 
                  alt="Vista previa de imagen" 
                  style={{  
                    width: '180px',
                    height: 'auto',
                    objectFit: "cover", 
                    borderRadius: "12px", 
                    border: "2px solid #f8c8dc", 
                    boxShadow: "0 4px 12px rgba(248, 200, 220, 0.4)",
                  }}  
                />
              </Box>
            )}
  
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                      <Button
                        variant="contained"
                        onClick={editingId ? actualizarProducto : crearProducto}
                        startIcon={editingId ? <Edit /> : <Add />}
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: '#f48fb1',
                          '&:hover': {
                            backgroundColor: '#ec7096',
                          },
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 8px rgba(244, 143, 177, 0.3)',
                        }}
                      >
                        {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={resetForm}
                        startIcon={<Clear />}
                        sx={{
                          borderRadius: '12px',
                          borderColor: '#f48fb1',
                          color: '#f48fb1',
                          '&:hover': {
                            borderColor: '#ec7096',
                            backgroundColor: 'rgba(244, 143, 177, 0.08)',
                          },
                          textTransform: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                </Paper>
  
                <Paper
                  elevation={3}
                  sx={{
                    padding: '20px',
                    borderRadius: '20px',
                    backgroundColor: '#fff5f7',
                    marginBottom: '30px',
                    border: '1px solid #f8c8dc',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: '15px',
                      color: '#b04e6f',
                      fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Search fontSize="small" /> Buscar Producto por ID
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' } 
                  }}>
                    <TextField
                      fullWidth
                      value={searchProductId}
                      onChange={(e) => setSearchProductId(e.target.value)}
                      placeholder="Ingresa el ID del producto"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#f48fb1',
                          },
                        },
                        flexGrow: 1
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: '#f48fb1',
                          '&:hover': {
                            backgroundColor: '#ec7096',
                          },
                          textTransform: 'none',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                        startIcon={<Search />}
                      >
                        Buscar
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={clearSearch}
                        sx={{
                          borderRadius: '12px',
                          borderColor: '#f48fb1',
                          color: '#f48fb1',
                          '&:hover': {
                            borderColor: '#ec7096',
                            backgroundColor: 'rgba(244, 143, 177, 0.08)',
                          },
                          textTransform: 'none',
                          fontWeight: 'bold',
                        }}
                        startIcon={<Clear />}
                      >
                        Limpiar
                      </Button>
                    </Box>
                  </Box>
             {searching && foundProduct && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: '12px',
                    border: '1px solid #f8c8dc',
                    backgroundColor: '#fff0f5',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#b04e6f',
                      fontFamily: 'Baloo 2, cursive',
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    Producto encontrado
                  </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ background: 'transparent' }}>
                  <Table size="small" aria-label="detalle producto">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#b04e6f', fontWeight: 'bold', py: 0.5 }}>ID</TableCell>
                        <TableCell sx={{ color: '#b04e6f', fontWeight: 'bold', py: 0.5 }}>Tamaño</TableCell>
                        <TableCell sx={{ color: '#b04e6f', fontWeight: 'bold', py: 0.5 }}>Disponibilidad</TableCell>
                        {foundProduct.HistorialPrecio && (
                          <TableCell sx={{ color: '#b04e6f', fontWeight: 'bold', py: 0.5 }}>Precio</TableCell>
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ py: 0.5 }}>{foundProduct.id}</TableCell>
                        <TableCell sx={{ py: 0.5 }}>{foundProduct.tamanoproducto || 'N/D'}</TableCell>
                        <TableCell sx={{ py: 0.5 }}>{foundProduct.disponibilidadProducto} u.</TableCell>
                        {foundProduct.HistorialPrecio && (
                          <TableCell sx={{ py: 0.5 }}>
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(foundProduct.HistorialPrecio.precio)}
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ textAlign: 'right', mt: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => editarProducto(foundProduct)}
                    sx={{ color: '#4caf50', p: 0.5 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => eliminarProducto(foundProduct.id)}
                    sx={{ color: '#e57373', p: 0.5 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => openDetailsDialog(foundProduct)}
                    sx={{ color: '#6c63ff', p: 0.5 }}
                  >
                    <Info fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            )}


          </Paper>
    
          <Paper
            elevation={2}
            sx={{
              padding: '20px',
              borderRadius: '20px',
              marginBottom: '20px',
              backgroundColor: '#fff0f5',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #f8c8dc 0%, #f8bbd0 50%, #f8c8dc 100%)',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: '15px',
                color: '#b04e6f',
                fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ListAlt fontSize="small" /> Lista de Productos
            </Typography>
    
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid #f8c8dc',
              }}
            >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#ffeef3' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tamaño</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Disponibilidad</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((producto) => (
                    <TableRow 
                      key={producto.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#fff0f5',
                        },
                      }}
                    >
                      <TableCell>{producto.tamanoproducto}</TableCell>
                      <TableCell>{producto.disponibilidadProducto}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => editarProducto(producto)}
                          sx={{
                            color: '#4caf50',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => eliminarProducto(producto.id)}
                          sx={{
                            color: '#e57373',
                            '&:hover': {
                              backgroundColor: 'rgba(229, 115, 115, 0.1)',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          onClick={() => openDetailsDialog(producto)}
                          sx={{
                            color: '#6c63ff',
                            '&:hover': {
                              backgroundColor: 'rgba(108, 99, 255, 0.1)',
                            },
                          }}
                        >
                          <Info />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
  
          <TablePagination
            component="div"
            count={productos.length}
            page={currentPage}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#b04e6f',
              '& .MuiTablePagination-selectIcon': {
                color: '#f48fb1',
              },
            }}
          />
        </Paper>
  
        <Dialog
          open={selectedProducto !== null}
          onClose={closeDetailsDialog}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: '#fff5f7',
              border: '1px solid #f8c8dc',
              maxWidth: '500px',
            }
          }}
        >
        <DialogTitle
    sx={{
      backgroundColor: '#ffeef3',
      borderBottom: '1px solid #f8c8dc',
      color: '#b04e6f',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      textAlign: 'center',
      fontFamily: 'Baloo 2, cursive',
    }}
  >
    Detalles del Producto
  </DialogTitle>

  <DialogContent sx={{ backgroundColor: '#fff0f5' }}>
    {selectedProducto && (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong style={{ color: '#b04e6f' }}>Descripción:</strong> {selectedProducto.estiloProducto}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong style={{ color: '#b04e6f' }}>Tamaño:</strong> {selectedProducto.tamanoproducto || 'No especificado'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong style={{ color: '#b04e6f' }}>Disponibilidad:</strong> {selectedProducto.disponibilidadProducto} unidades
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong style={{ color: '#b04e6f' }}>Precio actual:</strong>{" "}
          {selectedProducto.HistorialPrecio ? (
            new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(selectedProducto.HistorialPrecio.precio)
          ) : (
            "No hay precio asignado."
          )}
        </Typography>

        {selectedProducto.imagen && (
          <Box mt={2} display="flex" justifyContent="center">
            <img
              src={selectedProducto.imagen}
              alt="Imagen del Producto"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '16px',
                border: '2px dashed #f8c8dc',
                boxShadow: '0 6px 16px rgba(248, 200, 220, 0.5)',
                backgroundColor: '#fff',
                padding: '8px',
              }}
            />
          </Box>
        )}
      </Box>
    )}
  </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: '#ffeef3',
            borderTop: '1px solid #f8c8dc',
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={closeDetailsDialog}
            sx={{
              color: '#fff',
              backgroundColor: '#f48fb1',
              fontWeight: 'bold',
              px: 3,
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#f06292',
              },
              fontFamily: 'Baloo 2, cursive',
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
        
        <Dialog
          open={openConfirmDialog}
          onClose={() => {
            setOpenConfirmDialog(false);
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            resetForm();
            fetchProductos();
          }}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: '#fff5f7',
              border: '1px solid #f8c8dc',
            }
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#ffeef3',
              color: '#b04e6f',
              fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
              borderBottom: '1px solid #f8c8dc',
            }}
          >
            ¿Actualizar inventario?
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
              Se encontró un inventario asociado a este producto. ¿Deseas actualizarlo también?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#ffeef3',
              borderTop: '1px solid #f8c8dc',
            }}
          >
            <Button 
              onClick={() => {
                setOpenConfirmDialog(false);
                Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
                resetForm();
                fetchProductos();
              }}
              sx={{
                color: '#f48fb1',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(244, 143, 177, 0.08)',
                },
              }}
            >
              No, solo producto
            </Button>
            <Button 
              onClick={() => {
                setOpenConfirmDialog(false);
                setOpenInventarioDialog(true);
              }}
              sx={{
                backgroundColor: '#f48fb1',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#ec7096',
                },
              }}
            >
              Sí, actualizar ambos
            </Button>
          </DialogActions>
        </Dialog>
  
        <Dialog
          open={openInventarioDialog}
          onClose={() => {
            setOpenInventarioDialog(false);
            setInventarioData({
              stock: null, 
              stockMinimo: null,
              stockMaximo: null,
              precioVenta: '',
              precioCompra: ''
            });
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              backgroundColor: '#fff5f7',
              border: '1px solid #f8c8dc',
            }
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: '#ffeef3',
              color: '#b04e6f',
              fontFamily: '"Baloo 2", "Comic Sans MS", cursive',
              borderBottom: '1px solid #f8c8dc',
            }}
          >
            {inventarioExistente ? 'Actualizar Inventario' : 'Crear Inventario'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Stock Inicial"
                type="number"
                fullWidth
                margin="normal"
                value={inventarioData.stock ?? ''}
                onChange={(e) => setInventarioData({
                  ...inventarioData,
                  stock: e.target.value === '' ? null : parseInt(e.target.value)
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#f48fb1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#f48fb1',
                    },
                  },
                }}
                InputProps={{
                  inputProps: { 
                    min: 0,
                    placeholder: 'Ej: 100'
                  },
                }}
              />
              <TextField
                label="Stock Mínimo"
                type="number"
                fullWidth
                margin="normal"
                value={inventarioData.stockMinimo ?? ''}
                onChange={(e) => setInventarioData({
                  ...inventarioData,
                  stockMinimo: e.target.value === '' ? null : parseInt(e.target.value)
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#f48fb1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#f48fb1',
                    },
                  },
                }}
                InputProps={{
                  inputProps: { 
                    min: 0,
                    placeholder: 'Ej: 10'
                  },
                }}
              />
              <TextField
                label="Stock Máximo"
                type="number"
                fullWidth
                margin="normal"
                value={inventarioData.stockMaximo ?? ''}
                onChange={(e) => setInventarioData({
                  ...inventarioData,
                  stockMaximo: e.target.value === '' ? null : parseInt(e.target.value)
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#f48fb1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#f48fb1',
                    },
                  },
                }}
                InputProps={{
                  inputProps: { 
                    min: 0,
                    placeholder: 'Ej: 200'
                  },
                }}
              />
              <TextField
                label="Precio de Venta"
                type="number"
                fullWidth
                margin="normal"
                value={inventarioData.precioVenta}
                onChange={(e) => setInventarioData({
                  ...inventarioData,
                  precioVenta: e.target.value
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#f48fb1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#f48fb1',
                    },
                  },
                }}
                InputProps={{
                  inputProps: { 
                    min: 0, 
                    step: "0.01",
                    placeholder: 'Ej: 19.99'
                  },
                }}
              />
              <TextField
                label="Precio de Compra"
                type="number"
                fullWidth
                margin="normal"
                value={inventarioData.precioCompra}
                onChange={(e) => setInventarioData({
                  ...inventarioData,
                  precioCompra: e.target.value
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#f48fb1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#f48fb1',
                    },
                  },
                }}
                InputProps={{
                  inputProps: { 
                    min: 0, 
                    step: "0.01",
                    placeholder: 'Ej: 15.50'
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: '#ffeef3',
              borderTop: '1px solid #f8c8dc',
            }}
          >
            <Button 
              onClick={() => {
                setOpenInventarioDialog(false);
                setInventarioData({
                  stock: null,
                  stockMinimo: null,
                  stockMaximo: null,
                  precioVenta: '',
                  precioCompra: ''
                });
              }}
              sx={{
                color: '#f48fb1',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(244, 143, 177, 0.08)',
                },
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={crearInventario}
              sx={{
                backgroundColor: '#f48fb1',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#ec7096',
                },
                '&:disabled': {
                  backgroundColor: '#f8bbd0',
                },
              }}
              disabled={!inventarioData.precioVenta || !inventarioData.precioCompra}
            >
              {inventarioExistente ? 'Actualizar Inventario' : 'Crear Inventario'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ProductoComponent;
