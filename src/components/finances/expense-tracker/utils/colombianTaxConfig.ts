/**
 * Colombian Tax Configuration for Expense Tracker
 * Regime: Régimen Común (NOT Simple)
 * Municipality: Bogotá
 */

// Retention rates based on expense concept (Rete-Fuente)
export const RETENTION_RATES: Record<string, number> = {
  compras: 0.025,        // 2.5% - Purchases/Inventory
  servicios: 0.04,       // 4.0% - General services
  arrendamiento: 0.035,  // 3.5% - Real estate leasing
  publicidad: 0.01,      // 1.0% - Advertising/Transportation
  honorarios: 0.10,      // 10% - Professional fees (optional)
};

export const IVA_RATE = 0.19;          // 19% VAT
export const RETE_IVA_RATE = 0.50;     // 50% of IVA
export const ICA_BOGOTA_RATE = 0.005;  // 0.5% for Bogotá

export type RetentionType = keyof typeof RETENTION_RATES;

/**
 * Maps expense subcategories to their corresponding retention type
 */
const SUBCATEGORY_TO_RETENTION: Record<string, RetentionType> = {
  // Compra y Transformación de Vehículos (compras)
  'adquisicion_vehiculos': 'compras',
  'materiales_blindaje': 'compras',
  'repuestos_adaptacion': 'compras',
  'consumibles_taller': 'compras',
  
  // Servicios
  'mano_obra_directa': 'servicios',
  'servicios_taller': 'servicios',
  'depreciacion_maquinaria': 'servicios',
  'mantenimiento_equipos': 'servicios',
  
  // Arrendamiento
  'arrendamiento_taller': 'arrendamiento',
  'arrendamiento_oficinas': 'arrendamiento',
  
  // Venta y Comercialización
  'comisiones_vendedores': 'servicios',
  'publicidad_marketing': 'publicidad',
  'traslado_unidades': 'publicidad',
  'preparacion_vehiculos': 'servicios',
  'gastos_entrega': 'publicidad',
  'gastos_garantia': 'servicios',
  
  // Trámites e Intermediación
  'derechos_registros': 'servicios',
  'transporte_almacenamiento': 'publicidad',
  'licencias_software': 'servicios',
  'comisiones_gestores': 'servicios',
  
  // Administración y Finanzas
  'sueldos_administrativos': 'servicios',
  'aportes_parafiscales': 'servicios',
  'servicios_publicos': 'servicios',
  'material_oficina': 'compras',
  'uniformes_epp': 'compras',
  'viajes_hospedaje': 'servicios',
  'seguros': 'servicios',
  'depreciacion_activos': 'servicios',
  'mantenimiento_inmuebles': 'servicios',
  'reparaciones_locativas': 'servicios',
  
  // Marketing y RRPP
  'eventos_vip': 'servicios',
  'merchandising': 'compras',
  'membresias_gremios': 'servicios',
  'certificaciones': 'servicios',
  
  // Financieros y Tributarios
  'intereses_prestamos': 'servicios',
  'comisiones_bancarias': 'servicios',
  'auditoria_externa': 'honorarios',
  'timbres_registros': 'servicios',
  
  // Kilometraje
  'kilometraje_deducible': 'publicidad',
};

/**
 * Get the retention type for a given subcategory
 */
export function getRetentionType(subcategoryId: string): RetentionType {
  return SUBCATEGORY_TO_RETENTION[subcategoryId] || 'servicios';
}

/**
 * Get the retention rate for a given retention type
 */
export function getRetentionRate(retentionType: RetentionType): number {
  return RETENTION_RATES[retentionType] || RETENTION_RATES.servicios;
}

/**
 * Get the retention rate label for display
 */
export function getRetentionRateLabel(retentionType: RetentionType): string {
  const rate = getRetentionRate(retentionType);
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * Human-readable labels for retention types
 */
export const RETENTION_TYPE_LABELS: Record<RetentionType, string> = {
  compras: 'Compras/Inventario',
  servicios: 'Servicios',
  arrendamiento: 'Arrendamiento',
  publicidad: 'Publicidad/Transporte',
  honorarios: 'Honorarios',
};

/**
 * Format a value as Colombian Pesos
 */
export function formatCOP(value: number): string {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
