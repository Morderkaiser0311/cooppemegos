export const menuTopLinks = [
  { to: '/transparencia', label: 'Seguridad' },
  { to: '/noticias/escuela-lideres', label: 'Blog' },
  { to: '/contacto', label: 'Contáctanos' },
]

export const menuCards = [
  {
    id: 'productos',
    label: 'Productos',
    icon: 'productos' as const,
    categories: [
      {
        title: 'Ahorros',
        links: [
          { to: '/ahorros', label: 'Cuenta de ahorros' },
          { to: '/ahorros', label: 'MegoCuenta' },
          { to: '/ahorros', label: 'Ahorro propósito' },
        ],
      },
      {
        title: 'Inversiones',
        links: [{ to: '/inversiones', label: 'Depósito a plazo fijo (Póliza)' }],
      },
      {
        title: 'Crédito',
        links: [
          { to: '/credito', label: 'Crédito para tu negocio' },
          { to: '/credito', label: 'Crédito para tus gastos' },
          { to: '/credito', label: 'Simulador de crédito' },
        ],
      },
    ],
  },
  {
    id: 'canales',
    label: 'Canales electrónicos',
    icon: 'canales' as const,
    categories: [
      {
        title: 'Canales electrónicos',
        links: [
          { to: '/megomovil', label: 'App Megomóvil' },
          { to: '/megopay', label: 'MegoPay - Billetera Digital' },
          { to: '/tarjeta-debito', label: 'Tarjeta Mastercard Débito' },
          { to: '/megoonline', label: 'MegOnline' },
          { to: '/megoempresas', label: 'MegoEmpresas' },
        ],
      },
    ],
  },
  {
    id: 'beneficios',
    label: 'Beneficios',
    icon: 'beneficios' as const,
    to: '/ser-socio',
    categories: [],
  },
  {
    id: 'institucion',
    label: 'Institución',
    icon: 'institucion' as const,
    categories: [
      {
        title: 'Conoce la institución',
        links: [
          { to: '/nosotros', label: 'Historia' },
          { to: '/nosotros', label: 'Valores Institucionales' },
          { to: '/nosotros', label: 'Cooperativismo' },
          { to: '/gobierno', label: 'Gobierno Corporativo' },
          { to: '/gobierno', label: 'Buen Gobierno' },
          { to: '/agencias', label: 'Red de agencias' },
          { to: '/agencias', label: 'Red de cajeros automáticos' },
        ],
      },
    ],
  },
]

export const navProducts = [
  { to: '/ahorros', label: 'Ahorros' },
  { to: '/credito', label: 'Crédito' },
  { to: '/inversiones', label: 'Inversiones' },
  { to: '/tarjeta-debito', label: 'Tarjeta de débito' },
]

export const navChannels = [
  { to: '/megomovil', label: 'MegoMóvil' },
  { to: '/megopay', label: 'MegoPay' },
  { to: '/megoonline', label: 'MegoOnline' },
  { to: '/megoempresas', label: 'MegoEmpresas' },
]

export const navInstitution = [
  { to: '/agencias', label: 'Red de agencias' },
  { to: '/nosotros', label: 'Quiénes somos' },
  { to: '/gobierno', label: 'Gobierno corporativo' },
  { to: '/transparencia', label: 'Transparencia' },
]

export const navHelp = [
  { to: '/faq', label: 'Preguntas frecuentes' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/emergencias', label: 'Emergencias financieras' },
]

export const heroSlides = [
  {
    id: 'movil',
    kicker: 'MegoMóvil',
    line1: '¡Descubre el poder',
    line2: 'de hacerlo',
    highlight: 'simple!',
    cta: 'Más información',
    to: '/megomovil',
    visual: 'phones' as const,
  },
  {
    id: 'pay',
    kicker: 'MegoPay',
    line1: 'Pagar y cobrar es',
    line2: '',
    highlight: '¡así de simple!',
    cta: 'Más información',
    to: '/megopay',
    visual: 'pay' as const,
  },
  {
    id: 'credit',
    kicker: 'Crédito',
    line1: '¡Para cumplir tus',
    line2: '',
    highlight: 'sueños!',
    subtitle: 'Interés desde el 9.99% con hipoteca',
    cta: 'Más información',
    to: '/credito',
    visual: 'credit' as const,
  },
]

export const actionCards = [
  {
    to: '/contacto',
    title: 'Necesito ayuda de un asesor',
    text: 'Estamos para ayudarte, escríbenos y resolveremos tus dudas.',
    link: 'Contactar >',
    icon: 'chat',
  },
  {
    to: '/credito',
    title: 'Necesito un crédito',
    text: 'Tenemos el crédito ideal para tus gastos o para tu negocio',
    link: 'Más información >',
    icon: 'credit',
  },
  {
    to: '/inversiones',
    title: 'Quiero invertir mi dinero',
    text: 'Haz crecer tu dinero con una póliza o un ahorro propósito.',
    link: 'Más información >',
    icon: 'invest',
  },
]

export const channels = [
  {
    to: '/megoonline',
    title: 'Cooperativa Web',
    text: 'Transacciones rápidas y seguras desde su computador.',
    logo: '/img/megonline.png',
  },
  {
    to: '/megomovil',
    title: 'La app de Mego',
    text: 'Todo lo que puedes hacer en Mego, pero en tu celular.',
    logo: '/img/megomovil.png',
  },
  {
    to: '/megopay',
    title: 'Billetera Digital',
    text: 'Pagar y cobrar es Así de simple!',
    logo: '/img/megopay.png',
  },
  {
    to: '/megoempresas',
    title: '',
    text: 'Tu gestión financiera, sin límites ni complicaciones.',
    logo: '/img/empresas.png',
  },
]

export const news = [
  {
    to: '/noticias/escuela-lideres',
    tag: 'Capacitación',
    date: 'agosto 3, 2026',
    title: 'Escuela de Formación Integral para líderes cooperativistas.',
    text: 'Experiencia formativa transformadora, pensada para personas con visión, responsabilidad y espíritu de liderazgo dentro del sector cooperativo.',
    image: '/img/news-1.png',
    featured: true,
    author: 'Yod Abdias Ludeña Moreira',
  },
  {
    to: '/noticias/educacion-financiera',
    tag: 'Capacitación',
    date: 'junio 15, 2026',
    title: 'Taller Gratuito – Educación Financiera Práctica para el Microempresario',
    text: '',
    image: '/img/news-2.png',
  },
  {
    to: '/noticias/comida-rapida',
    tag: 'Capacitación',
    date: 'junio 4, 2026',
    title: 'Comida Rápida & Street Food para Emprendedores',
    text: '',
    image: '/img/news-3.png',
  },
  {
    to: '/noticias/reposteria',
    tag: 'Capacitación',
    date: 'junio 4, 2026',
    title: 'Repostería para Emprendedores',
    text: '',
    image: '/img/news-4.png',
  },
]

export const faqTopics = [
  { to: '/faq#megomovil', prefix: 'Ayuda con', title: 'Megomóvil' },
  { to: '/faq#megopay', prefix: 'Ayuda con', title: 'MegoPay' },
  { to: '/faq#megoonline', prefix: 'Ayuda con', title: 'MegOnline' },
  { to: '/faq#tarjeta', prefix: 'Ayuda con', title: 'Tarjeta débito' },
  { to: '/faq#inversiones', prefix: 'Ayuda con', title: 'Inversiones' },
  { to: '/faq#credito', prefix: 'Ayuda con', title: 'Crédito' },
  { to: '/faq#ahorros', prefix: 'Ayuda con', title: 'Ahorros' },
  { to: '/faq#transferencias', prefix: 'Ayuda con', title: 'Transferencias' },
  { to: '/faq#empresas', prefix: 'Ayuda para', title: 'Empresas' },
]

export const faqs = [
  {
    id: 'megomovil',
    topic: 'Megomóvil',
    q: '¿Cómo me afilio a Megomóvil?',
    a: 'Debes ser socio activo con el canal MegOnline habilitado. Descarga la app, ingresa tu usuario y sigue el proceso de afiliación descrito en el instructivo de uso. El servicio está disponible las 24 horas, los 365 días del año.',
  },
  {
    id: 'megomovil',
    topic: 'Megomóvil',
    q: '¿Cuáles son los montos que puedo transferir?',
    a: 'Transferencias: cupo diario USD 10.000, semanal USD 20.000 y mensual USD 50.000. Pago de servicios: mínimo USD 0.01, máximo USD 8.000 por transacción, con cupos acumulados de USD 8.000 diario, 15.000 semanal y 20.000 mensual.',
  },
  {
    id: 'megopay',
    topic: 'MegoPay',
    q: '¿Qué puedo hacer con MegoPay?',
    a: 'Pagar y cobrar con código QR o número de celular, registrar negocios, hacer vaca con amigos y familia, enviar links de cobro y visualizar tus gastos con control gráfico.',
  },
  {
    id: 'megoonline',
    topic: 'MegOnline',
    q: '¿Qué es MegOnline?',
    a: 'Es el canal electrónico web de Mego. Desde tu computador puedes consultar saldos, transferir gratis a cualquier cooperativa o banco, pagar tarjetas y servicios, y gestionar tus productos.',
  },
  {
    id: 'tarjeta',
    topic: 'Tarjeta débito',
    q: '¿Dónde puedo usar mi tarjeta Mastercard Mego?',
    a: 'En más de 5 millones de locales a nivel mundial, compras en línea, suscripciones y cajeros de la red. También puedes bloquearla o desbloquearla desde Megomóvil.',
  },
  {
    id: 'inversiones',
    topic: 'Inversiones',
    q: '¿Qué opciones tengo para invertir?',
    a: 'Puedes abrir un depósito a plazo fijo (póliza) o un ahorro propósito. El ahorro propósito ofrece una tasa referencial del 4.40% anual. Las pólizas tienen tasas preferenciales respecto a la oficina cuando las solicitas por canales electrónicos.',
  },
  {
    id: 'credito',
    topic: 'Crédito',
    q: '¿Desde qué tasa puedo acceder a un crédito?',
    a: 'Contamos con créditos para gastos personales y para tu negocio. Con garantía hipotecaria la tasa referencial parte desde el 9.99%. Un asesor te ayuda a elegir el producto según tu capacidad de pago.',
  },
  {
    id: 'ahorros',
    topic: 'Ahorros',
    q: '¿Qué tipos de ahorro ofrece Mego?',
    a: 'Cuenta de ahorros, ahorro inteligente, ahorro propósito y depósitos a plazo fijo. Puedes consultarlos, personalizar alias y objetivos, y mover dinero entre ellos desde Megomóvil.',
  },
  {
    id: 'transferencias',
    topic: 'Transferencias',
    q: '¿Las transferencias tienen costo?',
    a: 'Desde Megomóvil y MegOnline las transferencias a cualquier cooperativa o banco son gratuitas, dentro de los cupos vigentes de tu canal electrónico.',
  },
  {
    id: 'empresas',
    topic: 'Empresas',
    q: '¿Cómo accedo a MegoEmpresas?',
    a: 'MegoEmpresas es el canal para personas jurídicas. Si tu organización ya es socia, ingresa con el usuario entregado en agencia. Si aún no lo eres, inicia el proceso en Quiero ser socio.',
  },
]

export const agencies = [
  { name: 'Oficina Matriz', address: 'Bolívar 207-40 entre Azuay y Miguel Riofrío', city: 'Loja, Loja' },
  { name: 'Agencia Norte', address: 'Av. Gran Colombia 29-06 entre Guaranda y Ancón', city: 'Loja, Loja' },
  { name: 'Agencia Sur', address: 'Av. Pío Jaramillo Alvarado 20-09 y Benjamín Carrión', city: 'Loja, Loja' },
  { name: 'Agencia Cuarto Centenario', address: 'Ramón Pinto entre 10 de Agosto y Rocafuerte', city: 'Loja, Loja' },
  { name: 'Agencia El Valle', address: 'Av. 8 de Diciembre 10-89 entre Guayaquil y Jaramijó', city: 'Loja, Loja' },
  { name: 'Agencia Catamayo', address: '24 de Mayo entre Av. Isidro Ayora y Bolívar', city: 'Catamayo, Loja' },
  { name: 'Agencia Cariamanga', address: 'Av. Loja y José Miguel Riofrío, esq.', city: 'Cariamanga, Loja' },
  { name: 'Agencia Catacocha', address: 'Lauro Guerrero y 25 de Julio', city: 'Catacocha, Loja' },
  { name: 'Agencia Macará', address: 'Bolívar entre 10 de Agosto y Loja', city: 'Macará, Loja' },
  { name: 'Agencia Saraguro', address: 'Av. Loja y 18 de Noviembre, esq.', city: 'Saraguro, Loja' },
  { name: 'Agencia Alamor', address: '10 de Agosto entre Juan Montalvo y Río Amazonas', city: 'Alamor, Loja' },
  { name: 'Agencia Cuenca', address: 'Av. General Escandón entre Víctor Albornoz y Av. de las Américas', city: 'Cuenca, Azuay' },
  { name: 'Ventanilla San Blas', address: 'Av. Simón Bolívar 1-34 y Av. Huayna Cápac', city: 'Cuenca, Azuay' },
  { name: 'Agencia Quito', address: 'Av. 10 de Agosto y José Riofrío, Edif. Benalcázar Mil', city: 'Quito, Pichincha' },
  { name: 'Agencia Latacunga', address: 'Av. Amazonas entre Fortaleza de Callo y Salache', city: 'Latacunga, Cotopaxi' },
  { name: 'Agencia Santa Rosa', address: 'Av. Colón y Quito, esq.', city: 'Santa Rosa, El Oro' },
  { name: 'Agencia Balsas', address: 'Sucre entre Teodora Loaiza y Juan Montalvo', city: 'Balsas, El Oro' },
  { name: 'Agencia Santo Domingo', address: 'Av. 29 de Mayo e Ibarra, esq.', city: 'Santo Domingo' },
  { name: 'Agencia Gualaquiza', address: 'Atahualpa entre Amazonas y Francisco de Orellana', city: 'Gualaquiza' },
  { name: 'Agencia Yantzaza', address: 'Av. Iván Riofrío entre Primero de Mayo y Armando Arias', city: 'Yantzaza' },
  { name: 'Agencia Zumba', address: 'Av. Colón y Orellana, esq.', city: 'Zumba, Zamora Chinchipe' },
]

export type ProductPage = {
  kicker: string
  title: string
  lead: string
  points: string[]
  cta?: { to: string; label: string }
}

export const productPages: Record<string, ProductPage> = {
  megomovil: {
    kicker: 'Canal electrónico',
    title: 'MegoMóvil',
    lead: 'Tu cooperativa en la palma de la mano. Transacciones rápidas y seguras desde tu celular o tablet, las 24 horas, los 365 días del año.',
    points: [
      'Consulta saldos de ahorros, tarjeta de débito, ahorro propósito, pólizas y crédito.',
      'Transferencias gratis a cualquier cooperativa o banco.',
      'Pago de servicios a más de 200 entidades y recargas.',
      'Bloqueo, desbloqueo y cambio de clave de tu Mastercard débito.',
      'Retiros sin tarjeta en cajeros Mego.',
      'Solicitud digital de póliza, ahorro propósito y tarjeta de débito.',
    ],
    cta: { to: '/ser-socio', label: 'Quiero ser socio' },
  },
  megopay: {
    kicker: 'Billetera digital',
    title: 'MegoPay',
    lead: 'Pagar y cobrar es así de simple. Almacena tu dinero electrónicamente y muévelo con QR, número de celular o links de cobro.',
    points: [
      'Paga y cobra con código QR o número celular.',
      'Registra y personaliza tus negocios para controlar ingresos.',
      'Usa “hacer vaca” y crea pagos grupales con amigos y familia.',
      'Visualiza tus gastos con control gráfico.',
      'Envía links de cobro y recibe pagos al instante.',
    ],
    cta: { to: '/megomovil', label: 'Conoce MegoMóvil' },
  },
  credito: {
    kicker: 'Productos',
    title: 'Crédito',
    lead: 'El crédito ideal para tus gastos o para tu negocio. Con hipoteca, interés referencial desde el 9.99%.',
    points: [
      'Crédito de consumo para lo que necesitas hoy.',
      'Crédito microempresarial para hacer crecer tu negocio.',
      'Crédito hipotecario con tasas preferenciales.',
      'Simulación y seguimiento desde canales electrónicos.',
      'Asesoría personalizada en cualquiera de nuestras 23 oficinas.',
    ],
    cta: { to: '/contacto', label: 'Hablar con un asesor' },
  },
  ahorros: {
    kicker: 'Productos',
    title: 'Ahorros',
    lead: 'Ordena tu dinero con cuentas claras, objetivos y la seguridad de una cooperativa regulada.',
    points: [
      'Cuenta de ahorros para el día a día.',
      'Ahorro inteligente con cartola digital.',
      'Ahorro propósito con tasa referencial del 4.40%.',
      'Personaliza alias y objetivos desde la app.',
      'Fondos protegidos por el seguro de depósitos COSEDE.',
    ],
    cta: { to: '/ser-socio', label: 'Abre tu cuenta' },
  },
  inversiones: {
    kicker: 'Productos',
    title: 'Inversiones',
    lead: 'Haz crecer tu dinero con una póliza o un ahorro propósito. Tasas preferenciales cuando contratas por canales electrónicos.',
    points: [
      'Depósitos a plazo fijo con tasas competitivas.',
      'Ahorro propósito para metas concretas.',
      'Contratación digital desde MegoMóvil.',
      'Consulta de vencimientos y renovación simplificada.',
    ],
    cta: { to: '/contacto', label: 'Quiero invertir' },
  },
  'tarjeta-debito': {
    kicker: 'Productos',
    title: 'Tarjeta de débito Mastercard',
    lead: 'Olvídate del efectivo. Paga en más de 5 millones de locales a nivel mundial, compras en línea, suscripciones y mucho más.',
    points: [
      'Compras nacionales e internacionales.',
      'Pagos en línea y suscripciones.',
      'Retiros en cajeros Mego y redes asociadas.',
      'Bloqueo y desbloqueo inmediato desde la app.',
      'Cambio de clave sin ir a una oficina.',
    ],
    cta: { to: '/megomovil', label: 'Gestionar desde la app' },
  },
  nosotros: {
    kicker: 'Institución',
    title: 'Quiénes somos',
    lead: 'Cooperativa de Ahorro y Crédito Vicentina “Manuel Esteban Godoy Ortega” Ltda. Evolucionamos, crecemos e innovamos para estar más cerca de ti.',
    points: [
      '23 oficinas en Loja, Azuay, Cotopaxi, Zamora Chinchipe, El Oro, Morona Santiago, Pichincha y Santo Domingo.',
      'Canales electrónicos: MegoMóvil, MegoPay, MegOnline y MegoEmpresas.',
      'Red propia de cajeros automáticos.',
      'Regulados y con protección COSEDE para tus depósitos.',
    ],
  },
  gobierno: {
    kicker: 'Institución',
    title: 'Gobierno corporativo',
    lead: 'La cooperativa se rige por un modelo de gobierno que equilibra representación de los socios, vigilancia y gestión profesional.',
    points: [
      'Consejo de Administración.',
      'Consejo de Vigilancia.',
      'Gerencia General y direcciones especializadas.',
      'Transparencia de la información a disposición de los socios.',
    ],
  },
  transparencia: {
    kicker: 'Institución',
    title: 'Transparencia',
    lead: 'Publicamos tarifarios, tasas, políticas de datos y documentos de gobierno para que puedas tomar decisiones informadas.',
    points: [
      'Tarifario de productos y servicios.',
      'Tasas de interés vigentes.',
      'Política de protección de datos personales.',
      'Estados de situación y memoria institucional.',
    ],
  },
  contacto: {
    kicker: 'Ayuda',
    title: 'Estamos para ayudarte',
    lead: 'Escríbenos y un asesor Mego resolverá tus dudas sobre productos, canales o tu cuenta.',
    points: [
      'Matriz: Bolívar 207-40 y Miguel Riofrío, Loja.',
      'Horario de agencias: lunes a viernes, 08:00 a 16:30.',
      'Emergencias financieras 24/7 para bloqueos.',
      'También puedes chatear con nosotros desde el ícono de la abeja.',
    ],
    cta: { to: '/ser-socio', label: 'Quiero ser socio' },
  },
  emergencias: {
    kicker: 'Ayuda',
    title: 'Emergencias financieras',
    lead: '¿Perdiste tu cartola o tarjeta de débito? Contacta emergencias financieras para bloquear tu cuenta, libretín o tarjetas y recibir asistencia personalizada.',
    points: [
      'Bloqueo de cuenta de ahorros.',
      'Bloqueo de libretín / cartola de ahorro inteligente.',
      'Bloqueo de tarjetas de débito.',
      'Asistencia para reposición en agencia.',
    ],
    cta: { to: '/contacto', label: 'Contactar ahora' },
  },
}

export const searchIndex = [
  { to: '/megomovil', label: 'MegoMóvil', hint: 'App y canal electrónico' },
  { to: '/megopay', label: 'MegoPay', hint: 'Billetera digital' },
  { to: '/credito', label: 'Crédito', hint: 'Consumo, negocio e hipoteca' },
  { to: '/ahorros', label: 'Ahorros', hint: 'Cuentas y ahorro propósito' },
  { to: '/inversiones', label: 'Inversiones', hint: 'Pólizas a plazo fijo' },
  { to: '/tarjeta-debito', label: 'Tarjeta de débito', hint: 'Mastercard Mego' },
  { to: '/agencias', label: 'Red de agencias', hint: '23 oficinas a nivel nacional' },
  { to: '/faq', label: 'Preguntas frecuentes', hint: 'Ayuda por producto' },
  { to: '/ser-socio', label: 'Quiero ser socio', hint: 'Afiliación' },
  { to: '/megoonline', label: 'MegoOnline', hint: 'Banca web' },
  { to: '/megoempresas', label: 'MegoEmpresas', hint: 'Canal para empresas' },
  { to: '/emergencias', label: 'Emergencias', hint: 'Bloqueo de tarjeta o cartola' },
]
