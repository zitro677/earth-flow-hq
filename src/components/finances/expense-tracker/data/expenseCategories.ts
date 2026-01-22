export interface ExpenseSubcategory {
  id: string;
  label: string;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  label: string;
  subcategories: ExpenseSubcategory[];
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "transformacion",
    label: "Compra y Transformación de Vehículos",
    subcategories: [
      { id: "adquisicion_vehiculos", label: "Adquisición de vehículos", description: "Costo de adquisición de vehículos nuevos o usados (inventario)" },
      { id: "materiales_blindaje", label: "Materiales de blindaje", description: "Láminas de acero/aramida, vidrios laminados, poliuretano, sellantes, bisagras reforzadas" },
      { id: "repuestos_adaptacion", label: "Repuestos y adaptación", description: "Suspensión reforzada, llantas run-flat, baterías adicionales" },
      { id: "mano_obra_directa", label: "Mano de obra directa", description: "Salarios + prestaciones + uniformes + herramientas de técnicos" },
      { id: "consumibles_taller", label: "Consumibles de taller", description: "Discos de corte, lijas, soldadura, gases, thinner" },
      { id: "servicios_taller", label: "Servicios (energía/gas/agua)", description: "Energía eléctrica, gas y agua del área de transformación" },
      { id: "arrendamiento_taller", label: "Arrendamiento taller", description: "Arrendamiento de bodega o taller" },
      { id: "depreciacion_maquinaria", label: "Depreciación maquinaria", description: "Prensa, cizalla, taladros de banco, hornos de curado" },
      { id: "mantenimiento_equipos", label: "Mantenimiento equipos", description: "Mantenimiento y calibración de equipos de seguridad" },
    ],
  },
  {
    id: "comercializacion",
    label: "Venta y Comercialización",
    subcategories: [
      { id: "comisiones_vendedores", label: "Comisiones vendedores", description: "Comisiones de vendedores y asesores comerciales" },
      { id: "publicidad_marketing", label: "Publicidad y marketing", description: "Google/Facebook, volantes, ferias, página web, fotografía, videos" },
      { id: "traslado_unidades", label: "Traslado de unidades", description: "Combustible, peajes, póliza de transporte entre sucursales" },
      { id: "preparacion_vehiculos", label: "Preparación vehículos", description: "Lavado, detailing, encerado para mostrar" },
      { id: "gastos_entrega", label: "Gastos de entrega", description: "Flor, carpetas, instructivos, grúa si aplica" },
      { id: "gastos_garantia", label: "Gastos de garantía", description: "Repuestos y mano de obra dentro del período de cobertura" },
    ],
  },
  {
    id: "tramites",
    label: "Trámites e Intermediación",
    subcategories: [
      { id: "derechos_registros", label: "Derechos y registros", description: "Registro, traspaso, comparendos, SOAT, RUNT, SIM" },
      { id: "transporte_almacenamiento", label: "Transporte y almacenamiento", description: "Gastos en patios de trámites" },
      { id: "licencias_software_tramites", label: "Licencias y software", description: "Plataformas de consulta RUNT, SISBEN, embargos" },
      { id: "comisiones_gestores", label: "Comisiones gestores", description: "Comisiones a gestores externos" },
    ],
  },
  {
    id: "administracion",
    label: "Administración y Finanzas",
    subcategories: [
      { id: "sueldos_administrativos", label: "Sueldos administrativos", description: "Sueldos y prestaciones de personal administrativo, contable, gerencia" },
      { id: "aportes_parafiscales", label: "Aportes parafiscales", description: "Aportes y seguridad social de empleados" },
      { id: "arrendamiento_oficinas", label: "Arrendamiento oficinas", description: "Oficinas, parqueaderos, bodega" },
      { id: "servicios_publicos", label: "Servicios públicos", description: "Internet, telefonía fija y móvil corporativa" },
      { id: "licencias_software_admin", label: "Licencias software", description: "Software contable, CRM, antivirus, Office, facturación electrónica" },
      { id: "material_oficina", label: "Material de oficina", description: "Papel, toner, carpetas" },
      { id: "uniformes_epp", label: "Uniformes y EPP", description: "Casco, botas, overol, elementos de protección" },
      { id: "viajes_hospedaje", label: "Viajes y hospedaje", description: "Gastos de viaje de vendedores o técnicos (4% retención)" },
      { id: "seguros", label: "Seguros", description: "Responsabilidad civil, vehículos de prueba, vida colectivo" },
      { id: "depreciacion_activos", label: "Depreciación activos", description: "Edificio 3%, Muebles 10%, Computadores 20%, Vehículos 20%, Maquinaria 20%" },
      { id: "mantenimiento_inmuebles", label: "Mantenimiento inmuebles", description: "Mantenimiento de inmuebles y vehículos de servicio" },
      { id: "reparaciones_locativas", label: "Reparaciones locativas", description: "Reparaciones menores" },
    ],
  },
  {
    id: "marketing_rrpp",
    label: "Marketing y RRPP",
    subcategories: [
      { id: "eventos_vip", label: "Eventos VIP", description: "Coffee-break, seguridad, charlas para clientes VIP" },
      { id: "merchandising", label: "Merchandising", description: "Llaveros, bolígrafos con logo" },
      { id: "membresías_gremios", label: "Membresías y gremios", description: "Cámaras de comercio, ANDI, gremios de blindaje" },
      { id: "certificaciones", label: "Certificaciones", description: "ISO 9001, homologación de blindaje, estudios de mercado" },
    ],
  },
  {
    id: "financieros_tributarios",
    label: "Financieros y Tributarios",
    subcategories: [
      { id: "intereses_prestamos", label: "Intereses préstamos", description: "Intereses de préstamos bancarios o leasing" },
      { id: "comisiones_bancarias", label: "Comisiones bancarias", description: "Data-crédito, plataformas de transferencia" },
      { id: "auditoria_externa", label: "Auditoría externa", description: "Gastos de auditoría externa" },
      { id: "timbres_registros", label: "Timbres y registros", description: "Timbres y registros de patentes (marca AutoSeguroDJ)" },
    ],
  },
  {
    id: "kilometraje",
    label: "Kilometraje",
    subcategories: [
      { id: "kilometraje_deducible", label: "Kilometraje (deducible)", description: "Kilómetros recorridos deducibles a $0.67/milla" },
    ],
  },
];

export const getCategoryById = (categoryId: string): ExpenseCategory | undefined => {
  return EXPENSE_CATEGORIES.find((cat) => cat.id === categoryId);
};

export const getSubcategoriesByCategoryId = (categoryId: string): ExpenseSubcategory[] => {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
};

export const getCategoryLabel = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.label || categoryId;
};

export const getSubcategoryLabel = (categoryId: string, subcategoryId: string): string => {
  const subcategories = getSubcategoriesByCategoryId(categoryId);
  const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
  return subcategory?.label || subcategoryId;
};
