import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/img/LogoTeddyshop.jpg';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    marginBottom: 16,
    borderBottom: '2px solid #7434B0',
    paddingBottom: 12,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    marginBottom: 8,
  },
  empresaNombre: {
    fontSize: 20,
    color: '#7434B0',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  datosEmpresa: {
    fontSize: 9,
    color: '#444',
    textAlign: 'center',
    marginTop: 2,
  },
  clienteSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #7434B0',
    borderRadius: 4,
  },
  clienteTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7434B0',
    marginBottom: 6,
    textAlign: 'left',
  },
  clienteRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  clienteLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  clienteValue: {
    flex: 1,
    fontSize: 9,
    color: '#333',
  },
  tabla: {
    width: '100%',
    marginTop: 20,
  },
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: '#7434B0',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tablaRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  columnaProducto: { width: '40%', fontSize: 9 },
  columnaTamaño: { width: '15%', fontSize: 9, textAlign: 'right' },
  columnaCantidad: { width: '15%', fontSize: 9, textAlign: 'right' },
  columnaPrecio: { width: '15%', fontSize: 9, textAlign: 'right' },
  columnaTotal: { width: '15%', fontSize: 9, textAlign: 'right' },
  totalSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #7434B0',
    borderRadius: 4,
    textAlign: 'right',
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7434B0',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

const formatCurrency = value =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);

const FacturaPDFExport = ({ factura, pedido, compania }) => {
  const detalles = factura.detallesFactura || [];
  const totalGeneral = detalles.reduce(
    (sum, item) => sum + item.precioDetalleFactura * item.cantidadDetalleFactura,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.empresaNombre}>{compania?.nombreEmpresa}</Text>
          <Text style={styles.datosEmpresa}>{compania?.direccionEmpresa}</Text>
          <Text style={styles.datosEmpresa}>
            Tel: {compania?.telefonoEmpresa} — NIT: {compania?.NIT?.toLocaleString('es-CO')}
          </Text>
        </View>

        {/* Datos del cliente */}
        <View style={styles.clienteSection}>
          <Text style={styles.clienteTitulo}>Datos del Cliente</Text>
          <View style={styles.clienteRow}>
            <Text style={styles.clienteLabel}>Nombre:</Text>
            <Text style={styles.clienteValue}>{pedido?.nombreComprador || 'Sin nombre'}</Text>
          </View>
          <View style={styles.clienteRow}>
            <Text style={styles.clienteLabel}>Teléfono:</Text>
            <Text style={styles.clienteValue}>{pedido?.numeroComprador || '–'}</Text>
          </View>
          <View style={styles.clienteRow}>
            <Text style={styles.clienteLabel}>Dirección:</Text>
            <Text style={styles.clienteValue}>{pedido?.direccion || '–'}</Text>
          </View>
          <View style={styles.clienteRow}>
            <Text style={styles.clienteLabel}>Localidad:</Text>
            <Text style={styles.clienteValue}>{pedido?.localidad || '–'}</Text>
          </View>
          <View style={styles.clienteRow}>
            <Text style={styles.clienteLabel}>Barrio:</Text>
            <Text style={styles.clienteValue}>{pedido?.barrio || '–'}</Text>
          </View>
        </View>

        {/* Tabla de productos */}
        <View style={styles.tabla}>
          <View style={styles.tablaHeader}>
            <Text style={[styles.headerText, { width: '40%' }]}>Producto (ID)</Text>
            <Text style={[styles.headerText, { width: '15%', textAlign: 'right' }]}>Tamaño</Text>
            <Text style={[styles.headerText, { width: '15%', textAlign: 'right' }]}>Cantidad</Text>
            <Text style={[styles.headerText, { width: '15%', textAlign: 'right' }]}>Precio</Text>
            <Text style={[styles.headerText, { width: '15%', textAlign: 'right' }]}>Total</Text>
          </View>

          {detalles.map((item, idx) => {
            const cantidad = Number(item.cantidadDetalleFactura) || 1;
            const precio = Number(item.precioDetalleFactura) || 0;
            const total = cantidad * precio;
            const prodId = item.producto?.id || '–';
            const detallePedido = pedido.detallesPedido?.find(d => d.producto?.id === prodId);
            const tamanio = detallePedido?.producto?.tamanoproducto || '–';

            return (
              <View style={styles.tablaRow} key={idx}>
                <Text style={styles.columnaProducto}>{prodId}</Text>
                <Text style={styles.columnaTamaño}>{tamanio}</Text>
                <Text style={styles.columnaCantidad}>{cantidad}</Text>
                <Text style={styles.columnaPrecio}>{formatCurrency(precio)}</Text>
                <Text style={styles.columnaTotal}>{formatCurrency(total)}</Text>
              </View>
            );
          })}
        </View>

        {/* Total general */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total General: {formatCurrency(totalGeneral)}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © {new Date().getFullYear()} {compania?.nombreEmpresa} — Todos los derechos reservados
        </Text>
      </Page>
    </Document>
  );
};

export default FacturaPDFExport;
