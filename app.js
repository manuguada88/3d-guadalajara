// ===== 3D GUADALAJARA — FULL APPLICATION =====

// ===== STATE MANAGEMENT =====
const APP = {
  currentPage: 'home',
  user: null,
  cart: [],
  products: [],
  orders: [],
  designs: [],
  colors: ['#FF0000','#00FF00','#0066FF','#FFFF00','#FF00FF','#00FFFF','#FFFFFF','#000000','#FF6600','#8B4513','#808080','#C0C0C0'],
  materials: {
    PLA:  { name:'PLA',  base: 0.05, desc:'Estándar, fácil de imprimir' },
    'PLA+':{ name:'PLA+', base: 0.07, desc:'Mayor resistencia y flexibilidad' },
    ASA:  { name:'ASA',  base: 0.09, desc:'Resistente a UV y exteriores' },
    PETG: { name:'PETG', base: 0.08, desc:'Resistente y transparente' },
    ABS:  { name:'ABS',  base: 0.06, desc:'Resistente al calor' }
  },
  specialMaterials: {
    'PLA Seda':    { base: 0.10, desc: 'Acabado sedoso brillante' },
    'PLA Madera':  { base: 0.12, desc: 'Textura similar a madera' },
    'PLA Mármol':  { base: 0.11, desc: 'Efecto mármol decorativo' },
    'PLA Arcoíris':{ base: 0.14, desc: 'Cambio gradual de color' }
  },
  technicalMaterials: {
    'PLA Alimentario': { base: 0.15, desc: 'Apto para uso alimenticio, certificación FDA', foodSafe: true },
    'PLA Industrial': { base: 0.18, desc: 'Alta resistencia para uso industrial y mecánico', industrial: true },
    'PLA Ingeniería': { base: 0.20, desc: 'Para engranajes, piezas mecánicas y construcción', engineering: true }
  },
  materialStock: {},
  savedForLater: [],
  abandonedCarts: [],
  quotes: [],
  invoices: [],
  tickets: [],
  chatMessages: [],
  admin3dEnabled: true,
  bannedEmails: [],
  editorState: {
    objects: [],
    selectedId: null,
    tool: null,
    bgImage: null,
    width: 0, height: 0, depth: 0,
    material: 'PLA', color: '#00FFFF',
    paintColor: '#FF0000',
    brushSize: 8
  }
};

// ===== ADMIN SETTINGS & NEW DATA STORES =====
APP.adminSettings = {
  siteName: '3D Guadalajara',
  siteDescription: '',
  contactPhone: '+34 659 919 485',
  contactEmail: 'info@3dguadalajara.com',
  adminEmail: 'manuguada19@gmail.com',
  emailNotifications: {
    orderCreated: true,
    orderModified: true,
    orderStatusChanged: true,
    orderDeleted: true,
    quoteCreated: true,
    quoteModified: true,
    quoteApproved: true,
    quoteRejected: true,
    quoteAnnulled: true,
    quoteDeleted: true,
    invoiceCreated: true,
    invoiceModified: true,
    invoiceStatusChanged: true,
    invoiceDeleted: true,
    ticketCreated: true,
    ticketAnswered: true,
    ticketClosed: true,
    ticketReopened: true,
    ticketDeleted: true,
    ticketPriorityChanged: true,
    ticketCategoryChanged: true,
    userCreated: true,
    userModified: true,
    userBanned: true,
    userUnbanned: true,
    userActivated: true,
    userDisabled: true,
    userDeleted: true,
    abandonedCart: true,
    adminCopyEnabled: true
  },
  view3d: true,
  shopEnabled: true,
  chatEnabled: true,
  ticketsEnabled: true,
  quotesEnabled: true,
  maintenanceMode: false,
  multiColorSurcharge: 15,
  glowInDarkSurcharge: 25,
  paymentMethods: {
    card: { enabled: true, label: 'Tarjeta de crédito/débito', icon: '💳', description: 'Pago seguro con Visa, Mastercard o similar.',
      gateway: 'stripe',
      stripe: { publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX', secretKey: 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXX', webhookSecret: 'whsec_XXXXXXXXXXXXXXXXXXXXXXXX', mode: 'test', currency: 'eur' }
    },
    transfer: { enabled: true, label: 'Transferencia bancaria', icon: '🏦', description: 'Realiza una transferencia a nuestra cuenta bancaria. El producto será enviado con el nº de seguimiento del transportista una vez recibido el pago, que puede tardar hasta 72 horas máximo (sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.', bankAccount: 'ES00 0000 0000 0000 0000 0000', bankHolder: '3D Guadalajara', bankReference: 'Indicar nº de pedido como concepto' },
    bizum: { enabled: true, label: 'Bizum', icon: '📱', description: 'Envía un Bizum al número indicado.', bizumPhone: '+34 659 919 485',
      gateway: 'redsys',
      redsys: { merchantCode: '999008881', terminal: '1', secretKey: 'sq7HjrUOBfKmC576ILgskD5srU870gJ7', mode: 'test', merchantName: '3D Guadalajara', merchantURL: '', successURL: '', errorURL: '', notificationURL: '', currency: '978' }
    },
    crypto: { enabled: true, label: 'Criptomonedas (Worldcoin)', icon: '🌐', description: 'Pago con Worldcoin (WLD) u otras criptomonedas. El producto será enviado con el nº de seguimiento del transportista una vez recibido y confirmado el pago en la blockchain, lo cual puede tardar hasta 72 horas máximo (sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.', walletAddress: '0x0000000000000000000000000000000000000000', network: 'Optimism (OP Mainnet)' }
  }
};

APP.chatbotRules = [
  { keywords: 'precio,coste,cuánto,cuanto,presupuesto', response: 'Puedes calcular tu presupuesto al instante en nuestra <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'quote\');toggleChat();">página de presupuestos</a>. Los precios varían según el material (PLA desde 0.05€/cm³) y las dimensiones del objeto.' },
  { keywords: 'material,pla,abs,petg,filamento', response: 'Trabajamos con PLA, PLA+, ASA, PETG y ABS. También ofrecemos PLAs especiales (Seda, Madera, Mármol, Arcoíris). Si necesitas otro filamento, consúltanos. Mira nuestras <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'pricing\');toggleChat();">tarifas</a>.' },
  { keywords: 'envío,envio,seguimiento,transportista,tracking', response: 'Al enviar tu pedido se le asigna un transportista (GLS, UPS o SEUR) y un número de seguimiento. Puedes consultarlo en tu <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'dashboard\');toggleChat();">área privada</a>, pestaña "Seguimiento".' },
  { keywords: 'pedido,estado,compra', response: 'Puedes ver el estado de tus pedidos en tu <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'dashboard\');toggleChat();">área privada</a>. Si tienes un problema con un pedido, abre un <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'tickets\');toggleChat();">ticket de soporte</a>.' },
  { keywords: 'editor,diseño,diseñar,personalizar', response: 'Nuestro <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'editor\');toggleChat();">Editor 3D</a> te permite subir imágenes, añadir textos y colores, y previsualizar tu modelo en 360°. Introduce las medidas y obtendrás el precio al instante.' },
  { keywords: 'contacto,teléfono,telefono,llamar', response: 'Puedes contactarnos por teléfono en el <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a> o abrir un <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'tickets\');toggleChat();">ticket de soporte</a>.' },
  { keywords: 'cuenta,registr,login,sesión,sesion', response: 'Puedes <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'auth\');toggleChat();">iniciar sesión o crear una cuenta</a> para acceder a tu área privada con diseños, pedidos, facturas y presupuestos.' },
  { keywords: 'factura,invoice', response: 'Las facturas se generan cuando un presupuesto es aprobado. Puedes consultarlas en tu <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'dashboard\');toggleChat();">área privada</a>, pestaña "Facturas".' },
  { keywords: 'ticket,soporte,ayuda,problema', response: 'Puedes abrir un <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'tickets\');toggleChat();">ticket de soporte</a> y te responderemos lo antes posible. También puedes llamarnos al +34 659 919 485.' },
  { keywords: 'hola,buenas,buenos', response: 'Hola, ¿en qué puedo ayudarte? Puedo informarte sobre materiales, precios, envíos, pedidos o el editor 3D.' },
  { keywords: 'gracias,genial,perfecto', response: 'De nada. Si necesitas algo más, no dudes en preguntar. Estamos aquí para ayudarte.' },
  { keywords: 'horario,abierto', response: 'Nuestro horario de atención es de lunes a viernes de 9:00 a 19:00. Fuera de horario puedes dejarnos un <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'tickets\');toggleChat();">ticket</a> y te responderemos.' }
];

APP.chatbotDefaultResponse = 'Gracias por tu mensaje. Para una atención más detallada puedes abrir un <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo(\'tickets\');toggleChat();">ticket de soporte</a> o llamarnos al <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a>. También puedo ayudarte con: materiales, precios, envíos, pedidos, editor 3D o facturación.';

APP.emailTemplates = {
  newUser: { subject: 'Bienvenido a 3D Guadalajara', body: 'Hola {nombre},\n\nTu cuenta ha sido creada correctamente.' },
  userModified: { subject: 'Datos actualizados', body: 'Hola {nombre},\n\nTus datos han sido actualizados.' },
  userBanned: { subject: 'Cuenta suspendida', body: 'Hola {nombre},\n\nTu cuenta ha sido suspendida.' },
  userUnbanned: { subject: 'Cuenta reactivada', body: 'Hola {nombre},\n\nTu cuenta ha sido reactivada.' },
  userDisabled: { subject: 'Cuenta desactivada', body: 'Hola {nombre},\n\nTu cuenta ha sido desactivada temporalmente.' },
  newOrder: { subject: 'Nuevo pedido #{id}', body: 'Hola {nombre},\n\nHemos recibido tu pedido #{id}.' },
  orderModified: { subject: 'Pedido #{id} actualizado', body: 'Hola {nombre},\n\nTu pedido #{id} ha sido actualizado.' },
  orderCancelled: { subject: 'Pedido #{id} cancelado', body: 'Hola {nombre},\n\nTu pedido #{id} ha sido cancelado.' },
  newQuote: { subject: 'Presupuesto #{id}', body: 'Hola {nombre},\n\nSe ha generado el presupuesto #{id}.' },
  newInvoice: { subject: 'Factura #{id}', body: 'Hola {nombre},\n\nSe ha generado la factura #{id}.' },
  ticketCreated: { subject: 'Ticket #{id} recibido', body: 'Hola {nombre},\n\nHemos recibido tu ticket de soporte #{id}.\n\nAsunto: {asunto}\nCategoría: {categoria}\n\nTe responderemos lo antes posible.' },
  ticketAnswered: { subject: 'Respuesta a tu ticket #{id}', body: 'Hola {nombre},\n\nTu ticket #{id} ha recibido una nueva respuesta de nuestro equipo.\n\nAccede a tu área de soporte para ver la respuesta completa.' },
  ticketClosed: { subject: 'Ticket #{id} cerrado', body: 'Hola {nombre},\n\nTu ticket #{id} ha sido cerrado.\n\nSi necesitas ayuda adicional, puedes abrir un nuevo ticket en cualquier momento.' },
  ticketReopened: { subject: 'Ticket #{id} reabierto', body: 'Hola {nombre},\n\nTu ticket #{id} ha sido reabierto.\n\nNuestro equipo revisará tu consulta de nuevo.' },
  abandonedCart: { subject: 'Has dejado productos en tu carrito', body: 'Hola {nombre},\n\nHemos visto que dejaste productos en tu carrito de 3D Guadalajara.\n\nTus productos te están esperando. Completa tu pedido antes de que se agoten.\n\nVisítanos en 3dguadalajara.com' },
  ticketPriorityChanged: { subject: 'Prioridad de tu ticket #{id} actualizada', body: 'Hola {nombre},\n\nLa prioridad de tu ticket #{id} ha sido actualizada a: {prioridad}.\n\nNuestro equipo lo atenderá según la nueva prioridad.' },
  ticketCategoryChanged: { subject: 'Categoría de tu ticket #{id} actualizada', body: 'Hola {nombre},\n\nLa categoría de tu ticket #{id} ha sido reasignada a: {categoria}.\n\nEsto nos permite atenderlo mejor.' },
  ticketDeleted: { subject: 'Ticket #{id} eliminado', body: 'Hola {nombre},\n\nTu ticket #{id} ha sido eliminado por el equipo de administración.\n\nSi necesitas ayuda, puedes abrir un nuevo ticket.' },
  userDeleted: { subject: 'Cuenta eliminada — 3D Guadalajara', body: 'Hola {nombre},\n\nTu cuenta en 3D Guadalajara ha sido eliminada.\n\nSi crees que esto es un error, contacta con nosotros.' },
  userActivated: { subject: 'Cuenta activada', body: 'Hola {nombre},\n\nTu cuenta en 3D Guadalajara ha sido activada. Ya puedes acceder con normalidad.' },
  orderStatusChanged: { subject: 'Estado de tu pedido #{id} actualizado', body: 'Hola {nombre},\n\nEl estado de tu pedido #{id} ha cambiado a: {estado}.\n\nPuedes consultar los detalles en tu área privada.' },
  orderDeleted: { subject: 'Pedido #{id} eliminado', body: 'Hola {nombre},\n\nTu pedido #{id} ha sido eliminado por el equipo de administración.\n\nSi tienes dudas, contacta con nosotros.' },
  quoteApproved: { subject: 'Presupuesto #{id} aprobado', body: 'Hola {nombre},\n\nTu presupuesto #{id} ha sido aprobado.\n\nPróximamente recibirás la factura correspondiente.' },
  quoteRejected: { subject: 'Presupuesto #{id} rechazado', body: 'Hola {nombre},\n\nLamentamos comunicarte que el presupuesto #{id} ha sido rechazado.\n\nPuedes solicitar uno nuevo o contactarnos para más información.' },
  quoteAnnulled: { subject: 'Presupuesto #{id} anulado', body: 'Hola {nombre},\n\nEl presupuesto #{id} ha sido anulado.\n\nSi necesitas un nuevo presupuesto, no dudes en solicitarlo.' },
  quoteDeleted: { subject: 'Presupuesto #{id} eliminado', body: 'Hola {nombre},\n\nEl presupuesto #{id} ha sido eliminado.\n\nContacta con nosotros si tienes alguna duda.' },
  quoteModified: { subject: 'Presupuesto #{id} modificado', body: 'Hola {nombre},\n\nTu presupuesto #{id} ha sido actualizado.\n\nPuedes consultar los cambios en tu área privada.' },
  invoiceStatusChanged: { subject: 'Estado de tu factura #{id} actualizado', body: 'Hola {nombre},\n\nEl estado de tu factura #{id} ha cambiado a: {estado}.\n\nConsulta los detalles en tu área privada.' },
  invoiceDeleted: { subject: 'Factura #{id} eliminada', body: 'Hola {nombre},\n\nLa factura #{id} ha sido eliminada.\n\nContacta con nosotros si tienes alguna pregunta.' },
  invoiceModified: { subject: 'Factura #{id} modificada', body: 'Hola {nombre},\n\nTu factura #{id} ha sido actualizada.\n\nConsulta los detalles en tu área privada.' },
  paymentReceived: { subject: 'Pago recibido — Pedido #{id}', body: 'Hola {nombre},\n\nHemos recibido correctamente el pago de tu pedido #{id} por importe de {total}€.\n\nMétodo de pago: {metodo}\n\nProcederemos a preparar tu pedido. Recibirás la factura y el número de seguimiento del transportista en breve.\n\nGracias por confiar en 3D Guadalajara.' },
  paymentPending: { subject: 'Pedido #{id} — Pendiente de pago', body: 'Hola {nombre},\n\nTu pedido #{id} por importe de {total}€ ha sido registrado.\n\nMétodo de pago seleccionado: {metodo}\n\n{instrucciones}\n\nUna vez recibido el pago, se emitirá la factura y comprobante junto con el número de seguimiento del transportista cuando nos lo facilite.\n\nGracias por confiar en 3D Guadalajara.' },
  paymentConfirmed: { subject: 'Pago confirmado — Pedido #{id}', body: 'Hola {nombre},\n\nConfirmamos que hemos recibido tu pago para el pedido #{id}.\n\nImporte: {total}€\nMétodo: {metodo}\n\nTu pedido está siendo procesado. Te enviaremos la factura y el número de seguimiento del transportista en cuanto lo tengamos disponible.' }
};

APP.ticketCategories = [
  { id: 'pedido', name: 'Problema con un pedido', icon: '📦' },
  { id: 'envio', name: 'Seguimiento de envío', icon: '🚚' },
  { id: 'editor', name: 'Editor 3D', icon: '🎨' },
  { id: 'facturacion', name: 'Facturación', icon: '🧾' },
  { id: 'cuenta', name: 'Mi cuenta', icon: '👤' },
  { id: 'material', name: 'Materiales y filamentos', icon: '🧵' },
  { id: 'general', name: 'Consulta general', icon: '💬' },
  { id: 'otro', name: 'Otro', icon: '📝' }
];

APP.ticketSettings = {
  autoReplyEnabled: true,
  autoReplyMessage: 'Gracias por contactarnos. Hemos recibido tu ticket y te responderemos lo antes posible.',
  maxTicketsPerUser: 10,
  allowReopenClosed: true,
  priorityLevels: true,
  defaultPriority: 'normal'
};

APP.invoiceSettings = {
  companyName: '3D Guadalajara',
  companyNIF: 'B12345678',
  companyAddress: 'Calle de la Impresión 3D, 15',
  companyCity: 'Guadalajara, España',
  companyPostal: '19001',
  companyPhone: '+34 659 919 485',
  companyEmail: 'info@3dguadalajara.com',
  invoicePrefix: 'FAC',
  nextNumber: 1,
  taxRate: 21,
  taxLabel: 'IVA',
  paymentTerms: '30 días desde la fecha de emisión',
  bankAccount: 'ES00 0000 0000 0000 0000 0000',
  footerNote: 'Gracias por confiar en 3D Guadalajara. Este documento sirve como factura oficial.',
  logoText: '3D GUADALAJARA',
  logoImage: '', // base64 data URL when user uploads a logo
  legalText: 'Inscrita en el Registro Mercantil de Guadalajara. Tomo XXXX, Folio XXX, Hoja GU-XXXXX. Los datos personales se tratan conforme al RGPD (UE) 2016/679.',
  showFooterNote: true,
  showLegalText: true
};

APP.shopCategories = [
  { id: 'accesorios', name: 'Accesorios', icon: '📱' },
  { id: 'hogar', name: 'Hogar', icon: '🏠' },
  { id: 'decoracion', name: 'Decoración', icon: '🎨' },
  { id: 'mecanica', name: 'Mecánica', icon: '⚙️' }
];

// ===== SAMPLE DATA =====
APP.products = [
  { id:1, name:'Soporte para Móvil', category:'accesorios', material:'PLA', price:8.50, icon:'📱', desc:'Soporte ergonómico ajustable' },
  { id:2, name:'Maceta Geométrica', category:'hogar', material:'PLA+', price:12.00, icon:'🌱', desc:'Diseño moderno para plantas' },
  { id:3, name:'Llavero Personalizado', category:'accesorios', material:'PLA', price:4.00, icon:'🔑', desc:'Personalizable con tu nombre' },
  { id:4, name:'Figura Decorativa', category:'decoracion', material:'PETG', price:18.50, icon:'🗿', desc:'Escultura moderna abstracta' },
  { id:5, name:'Caja Organizadora', category:'hogar', material:'ABS', price:15.00, icon:'📦', desc:'Con compartimentos modulares' },
  { id:6, name:'Engranaje Mecánico', category:'mecanica', material:'ASA', price:6.50, icon:'⚙️', desc:'Piezas de repuesto precisas' },
  { id:7, name:'Lámpara Luna', category:'decoracion', material:'PLA', price:22.00, icon:'🌙', desc:'Réplica lunar con LED' },
  { id:8, name:'Prótesis de Mano', category:'mecanica', material:'PLA+', price:45.00, icon:'✋', desc:'Funcional y personalizable' },
  { id:9, name:'Jarrón Espiral', category:'hogar', material:'PETG', price:16.00, icon:'🏺', desc:'Diseño espiral elegante' },
  { id:10,name:'Escudo Medieval', category:'decoracion', material:'ABS', price:28.00, icon:'🛡️', desc:'Réplica decorativa detallada' },
  { id:11,name:'Funda Auriculares', category:'accesorios', material:'PLA', price:7.00, icon:'🎧', desc:'Protección personalizada' },
  { id:12,name:'Pieza Ajedrez XL', category:'decoracion', material:'PLA+', price:14.00, icon:'♟️', desc:'Tamaño decorativo grande' }
];

// ===== UTILITY FUNCTIONS =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

function updateFooterContact() {
  const phoneEl = document.getElementById('footerPhone');
  const emailEl = document.getElementById('footerEmail');
  if (phoneEl) {
    phoneEl.textContent = APP.adminSettings.contactPhone;
    phoneEl.href = 'tel:' + APP.adminSettings.contactPhone.replace(/\s/g, '');
  }
  if (emailEl) {
    emailEl.textContent = APP.adminSettings.contactEmail;
  }
}

function navigateTo(page) {
  // Sync stock from server on every page navigation
  _fetchStockFromServer();
  // Check auth for protected pages
  if (['dashboard','admin'].includes(page) && !APP.user) {
    navigateTo('auth');
    return;
  }
  if (page === 'admin' && (!APP.user || !APP.user.isAdmin)) {
    showToast('Acceso denegado');
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) {
    el.classList.add('active');
    APP.currentPage = page;
    renderPage(page);
  }
  document.querySelector('.nav-links').classList.remove('open');
  window.scrollTo(0, 0);
}

function renderPage(page) {
  const renderers = {
    home: renderHome, catalog: renderCatalog, pricing: renderPricing,
    shop: renderShop, editor: renderEditor, quote: renderQuote,
    auth: renderAuth, dashboard: renderDashboard, admin: renderAdmin,
    cart: renderCart, privacy: renderPrivacy, cookies: renderCookies,
    tickets: renderTickets, sitemap: renderSitemap
  };
  if (renderers[page]) renderers[page]();
  updateNav();
}

function updateNav() {
  const btn = document.getElementById('navUserBtn');
  const cartLi = document.getElementById('navCartLi');
  if (APP.user) {
    btn.textContent = APP.user.isAdmin ? '⚡ Admin' : '👤 Mi Cuenta';
    btn.onclick = () => navigateTo(APP.user.isAdmin ? 'admin' : 'dashboard');
  } else {
    btn.textContent = 'Acceder';
    btn.onclick = () => navigateTo('auth');
  }
  cartLi.style.display = 'block';
  document.getElementById('cartCount').textContent = APP.cart.reduce((s,i) => s+i.qty, 0);
}

function calcPrice(w, h, d, material) {
  if (!w || !h || !d) return '0.00';
  const vol = (w * h * d) / 1000; // cm³
  const mat = APP.materials[material] || APP.specialMaterials[material] || (APP.technicalMaterials && APP.technicalMaterials[material]) || {base:0.05};
  return Math.max(3, (vol * mat.base * 100)).toFixed(2);
}

// ===== STOCK MANAGEMENT =====
// Uses /stock.json endpoint — works through proxies as it looks like a static file

function _initMaterialStock() {
  var allMats = Object.assign({}, APP.materials, APP.specialMaterials, APP.technicalMaterials || {});
  // Build default stock
  var defaults = {};
  Object.keys(allMats).forEach(function(matName) {
    APP.colors.forEach(function(color) {
      var key = matName + '|' + color;
      defaults[key] = { material: matName, color: color, stockGrams: 1000, reservedGrams: 0 };
    });
  });
  APP.materialStock = defaults;
  // Load from server (async), then update UI; if server has no data, save defaults
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/stock.json?t=' + Date.now(), true);
  xhr.timeout = 4000;
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          APP.materialStock = data;
          // Ensure all materials/colors exist
          Object.keys(allMats).forEach(function(matName) {
            APP.colors.forEach(function(color) {
              var key = matName + '|' + color;
              if (!APP.materialStock[key]) {
                APP.materialStock[key] = { material: matName, color: color, stockGrams: 1000, reservedGrams: 0 };
              }
            });
          });
          try { localStorage.setItem('3dg_materialStock', JSON.stringify(APP.materialStock)); } catch(e) {}
          _refreshPricingStock();
        } else {
          // Server has no stock data yet, save defaults
          _saveStockToServer();
        }
      } catch(e) {
        _saveStockToServer();
      }
    }
  };
  xhr.onerror = function() {
    // Fallback: try localStorage
    try {
      var saved = JSON.parse(localStorage.getItem('3dg_materialStock'));
      if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
        APP.materialStock = saved;
      }
    } catch(e) {}
  };
  xhr.send();
}

// BroadcastChannel for instant cross-tab sync (same browser)
var _stockChannel = null;
try {
  _stockChannel = new BroadcastChannel('3dg_stock_sync');
  _stockChannel.onmessage = function(e) {
    if (e.data && e.data.type === 'stock_update' && e.data.stock) {
      APP.materialStock = e.data.stock;
      try { localStorage.setItem('3dg_materialStock', JSON.stringify(APP.materialStock)); } catch(ex) {}
      _refreshStockUI();
    }
  };
} catch(ex) {
  // BroadcastChannel not supported, localStorage fallback only
}

function _saveStockToServer() {
  try {
    localStorage.setItem('3dg_materialStock', JSON.stringify(APP.materialStock));
  } catch(e) {}
  // Broadcast to other tabs instantly
  try {
    if (_stockChannel) _stockChannel.postMessage({ type: 'stock_update', stock: APP.materialStock });
  } catch(e) {}
  // Save to server for cross-device sync
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/stock.json', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(APP.materialStock));
}

function _fetchStockFromServer() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/stock.json?t=' + Date.now(), true);
  xhr.timeout = 4000;
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          APP.materialStock = data;
          // Ensure all materials/colors exist
          var allMats = Object.assign({}, APP.materials, APP.specialMaterials, APP.technicalMaterials || {});
          Object.keys(allMats).forEach(function(matName) {
            APP.colors.forEach(function(color) {
              var key = matName + '|' + color;
              if (!APP.materialStock[key]) {
                APP.materialStock[key] = { material: matName, color: color, stockGrams: 1000, reservedGrams: 0 };
              }
            });
          });
          try { localStorage.setItem('3dg_materialStock', JSON.stringify(APP.materialStock)); } catch(e) {}
          _refreshStockUI();
        }
      } catch(e) {}
    }
  };
  xhr.onerror = function() {
    // Fallback: try localStorage
    try {
      var saved = JSON.parse(localStorage.getItem('3dg_materialStock'));
      if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
        APP.materialStock = saved;
      }
    } catch(e) {}
  };
  xhr.send();
}

// Listen for storage changes from other tabs on same device
window.addEventListener('storage', function(e) {
  if (e.key === '3dg_materialStock') {
    try {
      var saved = JSON.parse(localStorage.getItem('3dg_materialStock'));
      if (saved && typeof saved === 'object') {
        APP.materialStock = saved;
        _refreshStockUI();
      }
    } catch(ex) {}
  }
});

function _estimateGramsFromVolume(volumeCm3) {
  return volumeCm3 * 1.24 * 0.2;
}

function _getStockForMaterial(material, color) {
  var key = material + '|' + color;
  return APP.materialStock[key] || null;
}

function _getAvailableGrams(material, color) {
  var entry = _getStockForMaterial(material, color);
  if (!entry) return 0;
  return entry.stockGrams - entry.reservedGrams;
}

function _deductStock(material, color, grams) {
  var key = material + '|' + color;
  var entry = APP.materialStock[key];
  if (entry) {
    entry.stockGrams = Math.max(0, entry.stockGrams - grams);
    _saveStockToServer();
  }
}

var _stockRefreshInterval = null;
// Global color name map
var _defaultColorNames = {
  '#FF0000':'Rojo','#00FF00':'Verde','#0066FF':'Azul','#FFFF00':'Amarillo',
  '#FF00FF':'Magenta','#00FFFF':'Cian','#FFFFFF':'Blanco','#000000':'Negro',
  '#FF6600':'Naranja','#8B4513':'Marrón','#808080':'Gris','#C0C0C0':'Plata'
};
function _getColorDisplayName(hex) {
  if (window._colorNames && window._colorNames[hex]) return window._colorNames[hex];
  return _defaultColorNames[hex.toUpperCase()] || _defaultColorNames[hex] || hex;
}

function _fullStockSync() {
  _fetchStockFromServer();
}

function _startStockAutoRefresh() {
  if (_stockRefreshInterval) clearInterval(_stockRefreshInterval);
  _stockRefreshInterval = setInterval(_fullStockSync, 5000);
}

// Mobile: browsers suspend setInterval in background tabs / when screen is off.
// Re-sync immediately when the user returns.
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    _fullStockSync();
    // Restart interval to avoid drift
    if (_stockRefreshInterval) clearInterval(_stockRefreshInterval);
    _stockRefreshInterval = setInterval(_fullStockSync, 5000);
  }
});
window.addEventListener('focus', function() {
  _fullStockSync();
});
window.addEventListener('pageshow', function(e) {
  // bfcache restore on iOS Safari
  if (e.persisted) {
    _fullStockSync();
    if (_stockRefreshInterval) clearInterval(_stockRefreshInterval);
    _stockRefreshInterval = setInterval(_fullStockSync, 5000);
  }
});
// Mobile: sync on any user interaction in case timers were frozen
var _lastTouchSync = 0;
document.addEventListener('touchstart', function() {
  var now = Date.now();
  if (now - _lastTouchSync > 2000) {
    _lastTouchSync = now;
    _fetchStockFromServer();
  }
}, { passive: true });
document.addEventListener('scroll', function() {
  var now = Date.now();
  if (now - _lastTouchSync > 3000) {
    _lastTouchSync = now;
    _fetchStockFromServer();
  }
}, { passive: true });

function _getTotalStockForMaterial(matName) {
  var t = 0; APP.colors.forEach(function(c) { t += _getAvailableGrams(matName, c); }); return t;
}

// Returns per-color stock alerts for a material (agotado + stock bajo)
function _colorAlertHtml(matName) {
  var safeId = matName.replace(/[^a-zA-Z0-9]/g, '_');
  return '<div id="colorAlerts_' + safeId + '" class="color-alerts">' + _buildColorAlerts(matName) + '</div>';
}

function _buildColorAlerts(matName) {
  var agotados = [], bajos = [];
  APP.colors.forEach(function(color) {
    var avail = _getAvailableGrams(matName, color);
    var name = _getColorDisplayName(color);
    if (avail <= 10) agotados.push({ color: color, name: name });
    else if (avail <= 250) bajos.push({ color: color, name: name, grams: Math.round(avail) });
  });
  if (agotados.length === 0 && bajos.length === 0) return '';
  var html = '';
  if (agotados.length > 0) {
    html += '<div class="color-alert-row color-alert-out"><span class="color-alert-label">Agotado:</span><div class="color-alert-dots">';
    agotados.forEach(function(c) {
      html += '<span class="color-alert-dot" style="background:' + c.color + ';" title="' + c.name + ' — Agotado"></span>';
    });
    html += '</div></div>';
  }
  if (bajos.length > 0) {
    html += '<div class="color-alert-row color-alert-low"><span class="color-alert-label">Stock bajo:</span><div class="color-alert-dots">';
    bajos.forEach(function(c) {
      html += '<span class="color-alert-dot" style="background:' + c.color + ';" title="' + c.name + ' — ' + c.grams + 'g"></span>';
    });
    html += '</div></div>';
  }
  return html;
}

function _updateColorAlerts(matName) {
  var safeId = matName.replace(/[^a-zA-Z0-9]/g, '_');
  var el = document.getElementById('colorAlerts_' + safeId);
  if (el) el.innerHTML = _buildColorAlerts(matName);
}

// Check if a color is available for ordering given material, color, and required grams
function _isColorAvailableForOrder(matName, color, requiredGrams) {
  var avail = _getAvailableGrams(matName, color);
  if (avail <= 10) return 'out';       // Agotado
  if (requiredGrams > 0 && avail < requiredGrams) return 'insufficient'; // Not enough for this order
  if (avail <= 250) return 'low';      // Stock bajo but can order
  return 'ok';
}

// Build color palette HTML with stock awareness for forms
function _stockAwareColorPalette(matName, selectedColors, mode, volumeCm3) {
  var requiredGrams = volumeCm3 ? _estimateGramsFromVolume(volumeCm3) : 0;
  var html = '';
  APP.colors.forEach(function(color) {
    var status = _isColorAvailableForOrder(matName, color, requiredGrams);
    var name = _getColorDisplayName(color);
    var avail = _getAvailableGrams(matName, color);
    var isSelected = Array.isArray(selectedColors) ? selectedColors.includes(color) : selectedColors === color;
    var disabled = (status === 'out' || status === 'insufficient');
    var borderColor = isSelected ? 'var(--cyan)' : 'var(--border)';
    var shadow = isSelected ? 'box-shadow:0 0 8px var(--cyan);' : '';
    var opacity = disabled ? 'opacity:0.35;' : '';
    var cursor = disabled ? 'cursor:not-allowed;' : 'cursor:pointer;';
    var label = '';
    if (status === 'out') label = '<span class="color-swatch-label color-swatch-out">No disponible</span>';
    else if (status === 'insufficient') label = '<span class="color-swatch-label color-swatch-out">No disponible</span>';
    else if (status === 'low') label = '<span class="color-swatch-label color-swatch-low">Stock bajo</span>';

    if (mode === 'single') {
      var onclick = disabled ? '' : 'onclick="selectStockColor(\'' + matName.replace(/'/g,"\\'") + '\',\'' + color + '\',this)"';
      html += '<div class="color-swatch-stock" ' + onclick + ' data-color="' + color + '" data-status="' + status + '" style="' + opacity + cursor + '">' +
        '<div style="width:32px;height:32px;border-radius:6px;background:' + color + ';border:2px solid ' + borderColor + ';' + shadow + '"></div>' +
        '<span class="color-swatch-name">' + name + '</span>' + label + '</div>';
    } else {
      var onclick2 = disabled ? '' : 'onclick="toggleStockColor(\'' + matName.replace(/'/g,"\\'") + '\',\'' + color + '\',this)"';
      html += '<div class="color-swatch-stock" ' + onclick2 + ' data-color="' + color + '" data-status="' + status + '" style="' + opacity + cursor + '">' +
        '<div style="width:32px;height:32px;border-radius:6px;background:' + color + ';border:2px solid ' + borderColor + ';' + shadow + (isSelected ? 'position:relative;' : '') + '">' +
        (isSelected ? '<span style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:var(--cyan);border-radius:50%;font-size:0.55rem;display:flex;align-items:center;justify-content:center;color:var(--bg);">✓</span>' : '') +
        '</div><span class="color-swatch-name">' + name + '</span>' + label + '</div>';
    }
  });
  return html;
}
function _stockStatusInfo(total) {
  // Used for total material badge (sum across all colors)
  var numColors = APP.colors.length || 12;
  if (total <= 10 * numColors) return { txt: 'Agotado', icon: '❌', bg: 'rgba(239,68,68,0.12)', bd: 'rgba(239,68,68,0.4)', cl: '#ef4444', level: 'out' };
  if (total <= 250 * numColors) return { txt: 'Stock bajo', icon: '⚠️', bg: 'rgba(245,158,11,0.12)', bd: 'rgba(245,158,11,0.4)', cl: '#f59e0b', level: 'low' };
  return { txt: 'En stock', icon: '✅', bg: 'rgba(16,185,129,0.1)', bd: 'rgba(16,185,129,0.3)', cl: '#10b981', level: 'ok' };
}
function _colorStockStatus(gramsAvail) {
  // Per-color: <=10g Agotado, <=250g Stock bajo, >=1000g En stock
  if (gramsAvail <= 10) return { txt: 'Agotado', cl: '#ef4444' };
  if (gramsAvail <= 250) return { txt: 'Stock bajo', cl: '#f59e0b' };
  return { txt: 'En stock', cl: '#10b981' };
}
function _stockBadgeHtml(matName) {
  var total = _getTotalStockForMaterial(matName), safeId = matName.replace(/[^a-zA-Z0-9]/g, '_');
  var s = _stockStatusInfo(total);
  var amtTxt = total < 10 ? '' : total < 1000 ? ' (' + Math.round(total) + 'g)' : ' (' + (total/1000).toFixed(1) + 'kg)';
  return '<div id="stockBadge_' + safeId + '" style="padding:8px 12px;background:' + s.bg + ';border:1px solid ' + s.bd + ';border-radius:var(--radius);margin-bottom:8px;font-size:0.8rem;color:' + s.cl + ';text-align:center;font-family:var(--font-heading);font-weight:600;letter-spacing:0.5px;">' + s.icon + ' ' + s.txt + amtTxt + '</div>';
}
function _updateStockBadge(matName) {
  var safeId = matName.replace(/[^a-zA-Z0-9]/g, '_'), el = document.getElementById('stockBadge_' + safeId);
  if (!el) return;
  var total = _getTotalStockForMaterial(matName), s = _stockStatusInfo(total);
  var amtTxt = total < 10 ? '' : total < 1000 ? ' (' + Math.round(total) + 'g)' : ' (' + (total/1000).toFixed(1) + 'kg)';
  el.innerHTML = s.icon + ' ' + s.txt + amtTxt;
  el.style.background = s.bg; el.style.borderColor = s.bd; el.style.color = s.cl;
  // Also update popup if open
  var popup = document.getElementById('stockPopup_' + safeId);
  if (popup) { _updateStockPopupContent(matName, popup); }
}
function _updateStockPopupContent(matName, popup) {
  var grid = popup.querySelector('.stock-popup-grid');
  if (!grid) return;
  var html = '';
  APP.colors.forEach(function(color) {
    var key = matName + '|' + color;
    var entry = APP.materialStock[key];
    var stockGrams = entry ? entry.stockGrams : 0;
    var reserved = entry ? entry.reservedGrams : 0;
    var avail = Math.max(0, stockGrams - reserved);
    var colorName = _getColorDisplayName(color);
    var cs = _colorStockStatus(avail);
    var gramsText = avail < 1000 ? Math.round(avail) + 'g' : (avail / 1000).toFixed(1) + 'kg';
    html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg2);border-left:3px solid ' + cs.cl + ';border-radius:var(--radius);transition:all 0.3s;">' +
      '<span style="display:inline-block;width:24px;height:24px;border-radius:6px;background:' + color + ';border:2px solid var(--border);flex-shrink:0;box-shadow:0 0 8px ' + color + '40;"></span>' +
      '<span style="flex:1;font-size:0.85rem;color:var(--text1);font-family:var(--font-heading);font-weight:500;">' + colorName + '</span>' +
      '<span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-heading);min-width:50px;text-align:right;">' + gramsText + '</span>' +
      '<span style="font-size:0.75rem;font-family:var(--font-display);font-weight:700;color:' + cs.cl + ';letter-spacing:0.5px;min-width:80px;text-align:right;">' + cs.txt + '</span></div>';
  });
  grid.innerHTML = html;
  // Update timestamp
  var tsEl = popup.querySelector('.stock-popup-timestamp');
  if (tsEl) {
    var now = new Date();
    tsEl.textContent = 'Última sincronización: ' + now.toLocaleTimeString('es-ES');
  }
}
// Updates only pricing badges, buttons and open popup (no admin re-render)
function _refreshPricingStock() {
  var allM = Object.assign({}, APP.materials, APP.specialMaterials, APP.technicalMaterials || {});
  Object.keys(allM).forEach(function(m) {
    _updateStockBadge(m);
    _updateColorAlerts(m);
    var safeId = m.replace(/[^a-zA-Z0-9]/g, '_');
    var btn = document.getElementById('stockBtn_' + safeId);
    if (btn) {
      var total = _getTotalStockForMaterial(m), s = _stockStatusInfo(total);
      if (s.level === 'out') { btn.textContent = '❌ Agotado'; btn.className = 'btn btn-danger btn-small'; }
      else if (s.level === 'low') { btn.textContent = '⚠️ Consultar Disponibilidad'; btn.className = 'btn btn-gold btn-small'; }
      else { btn.textContent = '🔍 Consultar Stock'; btn.className = 'btn btn-secondary btn-small'; }
      btn.style.width = '100%';
    }
  });
  var openPopup = document.querySelector('.stock-popup[data-material]');
  if (openPopup) {
    var popupMat = openPopup.getAttribute('data-material');
    if (popupMat) { _updateStockPopupContent(popupMat, openPopup); }
  }
  // Update stock-aware color palettes if visible
  _updateStockColorPalettes();
}
function _refreshStockUI() {
  _refreshPricingStock();
  var page = APP.currentPage;
  if (page === 'home') { _updateHomeCalcStock(); }
  if (page === 'quote') { if (document.getElementById('quoteStockIndicator')) updateQuote(); _refreshQuoteColorPalette(); }
  if (page === 'cart') { _updateCartStockInfo(); }
  if (page === 'editor') { _refreshEditorColorPalette(); }
  // Update admin stock inputs without re-rendering the whole section
  if (page === 'admin') { _updateAdminStockInputs(); }
}

// Update admin stock input values in-place (no re-render)
function _updateAdminStockInputs() {
  var container = document.getElementById('stockTableContainer');
  if (!container) return;
  var inputs = container.querySelectorAll('input[data-stock-key]');
  inputs.forEach(function(inp) {
    var key = inp.getAttribute('data-stock-key');
    var entry = APP.materialStock[key];
    if (entry && document.activeElement !== inp) {
      inp.value = Math.round(entry.stockGrams);
    }
  });
}

// Update stock-aware palettes on quote and editor if visible
function _updateStockColorPalettes() {
  var page = APP.currentPage;
  if (page === 'quote') _refreshQuoteColorPalette();
  if (page === 'editor') _refreshEditorColorPalette();
}

function _refreshQuoteColorPalette() {
  var paletteEl = document.getElementById('quoteColorPalette');
  var matSel = document.getElementById('quoteMaterial');
  if (!paletteEl || !matSel) return;
  var matName = matSel.value;
  if (matName === 'Otros PLA') return;
  var volCm3 = _getQuoteVolumeCm3();
  paletteEl.innerHTML = _stockAwareColorPalette(matName, APP._quoteSelectedColors || [], 'multi', volCm3);
}

function _refreshEditorColorPalette() {
  var paletteEl = document.getElementById('editorColorPalette');
  if (!paletteEl) return;
  var matName = APP.editorState.material || 'PLA';
  paletteEl.innerHTML = _stockAwareColorPalette(matName, APP.editorState.color, 'single', 0);
}

// Get volume from quote form dimensions
function _getQuoteVolumeCm3() {
  var w = parseFloat(document.getElementById('quoteW')?.value || 0);
  var h = parseFloat(document.getElementById('quoteH')?.value || 0);
  var d = parseFloat(document.getElementById('quoteD')?.value || 0);
  return (w * h * d) / 1000;
}

// Color selection handlers for stock-aware palettes
function selectStockColor(matName, color, el) {
  // Single select — deselect others
  var parent = el.closest('.stock-color-palette') || el.parentElement;
  if (parent) {
    parent.querySelectorAll('.color-swatch-stock div:first-child').forEach(function(d) {
      d.style.borderColor = 'var(--border)';
      d.style.boxShadow = 'none';
    });
  }
  var swatch = el.querySelector('div');
  if (swatch) { swatch.style.borderColor = 'var(--cyan)'; swatch.style.boxShadow = '0 0 8px var(--cyan)'; }
  // Update editor state
  APP.editorState.color = color;
  if (typeof redrawEditor === 'function') redrawEditor();
}

function toggleStockColor(matName, color, el) {
  if (!APP._quoteSelectedColors) APP._quoteSelectedColors = [];
  var idx = APP._quoteSelectedColors.indexOf(color);
  var swatch = el.querySelector('div');
  if (idx >= 0) {
    APP._quoteSelectedColors.splice(idx, 1);
    if (swatch) { swatch.style.borderColor = 'var(--border)'; swatch.style.boxShadow = 'none'; swatch.innerHTML = ''; }
  } else {
    APP._quoteSelectedColors.push(color);
    if (swatch) {
      swatch.style.borderColor = 'var(--cyan)';
      swatch.style.boxShadow = '0 0 8px var(--cyan)';
      swatch.innerHTML = '<span style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:var(--cyan);border-radius:50%;font-size:0.55rem;display:flex;align-items:center;justify-content:center;color:var(--bg);">✓</span>';
      swatch.style.position = 'relative';
    }
  }
  if (typeof updateQuote === 'function') updateQuote();
}

function _updateHomeCalcStock() {
  var mat = document.getElementById('homeCalcMat'), el = document.getElementById('homeCalcStockInfo');
  if (!mat || !el) return;
  var m = mat.value;
  if (m === 'Otros PLA') { el.innerHTML = ''; return; }
  var total = _getTotalStockForMaterial(m), s = _stockStatusInfo(total);
  var amtTxt = total <= 0 ? '' : total < 1000 ? ' (' + Math.round(total) + 'g)' : ' (' + (total/1000).toFixed(1) + 'kg)';
  el.innerHTML = '<span style="font-size:0.78rem;color:' + s.cl + ';font-weight:600;">' + s.icon + ' ' + m + ': ' + s.txt + amtTxt + '</span>';
}
function _updateCartStockInfo() {
  var el = document.getElementById('cartStockSummary');
  if (!el) return;
  var issues = 0;
  APP.cart.forEach(function(ci) {
    var p = APP.products.find(function(x) { return x.id === ci.productId; });
    var mat = ci.material || 'PLA', color = ci.color || APP.colors[0], avail = _getAvailableGrams(mat, color), vol = 0;
    if (p && p.dimensions) vol = (p.dimensions.w * p.dimensions.h * p.dimensions.d) / 1000; else vol = parseFloat(ci.price) / 5;
    if (avail < _estimateGramsFromVolume(vol) * ci.qty) issues++;
  });
  if (issues > 0) el.innerHTML = '<div style="padding:10px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius);margin-bottom:16px;font-size:0.82rem;color:#f59e0b;">⚠️ ' + issues + ' producto(s) con stock insuficiente. Puedes guardarlos para más tarde.</div>';
  else if (APP.cart.length > 0) el.innerHTML = '<div style="padding:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius);margin-bottom:16px;font-size:0.82rem;color:#10b981;">✅ Todos los productos tienen stock disponible.</div>';
  else el.innerHTML = '';
}

function _updateQuoteStockLive() {
  var indicator = document.getElementById('quoteStockIndicator');
  if (!indicator) return;
  var matSelect = document.getElementById('quoteMat');
  if (!matSelect) return;
  var matName = matSelect.value;
  if (!matName || matName === 'Otros PLA') { indicator.innerHTML = ''; return; }
  var total = _getTotalStockForMaterial(matName);
  var txt, cl;
  if (total < 1000) { txt = '❌ ' + matName + ': Casi agotado (' + Math.round(total) + 'g restantes)'; cl = '#ef4444'; }
  else if (total < 5000) { txt = '⚠️ ' + matName + ': Stock limitado (' + (total/1000).toFixed(1) + 'kg)'; cl = '#f59e0b'; }
  else { txt = '✅ ' + matName + ': Stock disponible (' + (total/1000).toFixed(1) + 'kg)'; cl = '#10b981'; }
  indicator.innerHTML = '<div style="padding:8px 12px;margin-top:10px;background:rgba(0,0,0,0.3);border:1px solid ' + cl + '33;border-radius:var(--radius);font-size:0.8rem;color:' + cl + ';">' + txt + '</div>';
}

function _deductStockForOrder(order) {
  if (!order || !order.items) return;
  order.items.forEach(function(item) {
    var p = APP.products.find(function(x) { return x.id === item.productId; });
    var material = item.material || 'PLA';
    var color = item.color || APP.colors[0];
    var vol = 0;
    if (p && p.dimensions) {
      vol = (p.dimensions.w * p.dimensions.h * p.dimensions.d) / 1000;
    } else {
      vol = parseFloat(item.price) / 5;
    }
    var grams = _estimateGramsFromVolume(vol) * (item.qty || 1);
    _deductStock(material, color, grams);
  });
}

function checkMaterialAvailability(materialName) {
  // Always load latest stock before showing popup
  _fetchStockFromServer();
  // Remove existing popup if any
  var existing = document.querySelector('.stock-popup-overlay');
  if (existing) existing.remove();
  var safeId = materialName.replace(/[^a-zA-Z0-9]/g, '_');
  var overlay = document.createElement('div');
  overlay.className = 'stock-popup-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  var popup = document.createElement('div');
  popup.className = 'stock-popup';
  popup.id = 'stockPopup_' + safeId;
  popup.setAttribute('data-material', materialName);
  // Header
  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
    '<h3 style="font-family:var(--font-display);font-size:1rem;letter-spacing:1.5px;color:var(--cyan);margin:0;">DISPONIBILIDAD: ' + materialName + '</h3>' +
    '<button onclick="document.querySelector(\'.stock-popup-overlay\').remove()" style="background:none;border:none;color:var(--text2);font-size:1.4rem;cursor:pointer;padding:4px 8px;line-height:1;">✕</button></div>';
  // Legend
  var legend = '<div style="display:flex;gap:16px;margin-bottom:14px;padding:8px 12px;background:var(--bg2);border-radius:var(--radius);font-size:0.72rem;font-family:var(--font-heading);flex-wrap:wrap;">' +
    '<span style="color:#10b981;">● En stock (≥1kg)</span>' +
    '<span style="color:#f59e0b;">● Stock bajo (≤250g)</span>' +
    '<span style="color:#ef4444;">● Agotado (&lt;10g)</span></div>';
  // Live update indicator
  var liveIndicator = '<div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;font-size:0.68rem;color:var(--text3);font-family:var(--font-heading);">' +
    '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#10b981;animation:pulse 2s infinite;"></span> Actualizando en tiempo real cada 5s — sincronizado con inventario</div>';
  // Timestamp
  var timestamp = '<div class="stock-popup-timestamp" style="font-size:0.65rem;color:var(--text3);font-family:var(--font-heading);text-align:right;margin-bottom:10px;">Última sincronización: ' + new Date().toLocaleTimeString('es-ES') + '</div>';
  // Grid
  var grid = '<div class="stock-popup-grid"></div>';
  popup.innerHTML = header + legend + liveIndicator + timestamp + grid;
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  _updateStockPopupContent(materialName, popup);
}

function saveForLater(cartIndex) {
  if (!APP.user) { showToast('Inicia sesion primero'); return; }
  if (cartIndex < 0 || cartIndex >= APP.cart.length) return;
  var item = APP.cart[cartIndex];
  APP.savedForLater.push(Object.assign({}, item, { user: APP.user.email, savedDate: new Date().toLocaleDateString('es-ES') }));
  APP.cart.splice(cartIndex, 1);
  showToast('Producto guardado para mas tarde');
  renderCart();
  updateNav();
}

function moveToCartFromSaved(savedIndex) {
  var userSaved = APP.savedForLater.filter(function(s) { return s.user === (APP.user ? APP.user.email : ''); });
  if (savedIndex < 0 || savedIndex >= userSaved.length) return;
  var item = userSaved[savedIndex];
  var globalIdx = APP.savedForLater.indexOf(item);
  APP.cart.push({ productId: item.productId, material: item.material, qty: item.qty, price: item.price, color: item.color });
  APP.savedForLater.splice(globalIdx, 1);
  showToast('Producto movido al carrito');
  updateNav();
  showDashTab('savedforlater', document.querySelector('.dash-tab.active') || document.querySelector('.dash-tab'));
}

function removeSavedItem(savedIndex) {
  var userSaved = APP.savedForLater.filter(function(s) { return s.user === (APP.user ? APP.user.email : ''); });
  if (savedIndex < 0 || savedIndex >= userSaved.length) return;
  var item = userSaved[savedIndex];
  var globalIdx = APP.savedForLater.indexOf(item);
  APP.savedForLater.splice(globalIdx, 1);
  showToast('Producto eliminado de guardados');
  showDashTab('savedforlater', document.querySelector('.dash-tab.active') || document.querySelector('.dash-tab'));
}

function renderDashSavedForLater() {
  var userSaved = APP.savedForLater.filter(function(s) { return s.user === (APP.user ? APP.user.email : ''); });
  if (!userSaved.length) return '<div style="text-align:center;padding:40px;color:var(--text3);">No tienes productos guardados para mas tarde.</div>';
  var html = '<h4 style="font-family:var(--font-display);font-size:0.9rem;letter-spacing:1px;margin-bottom:16px;">PRODUCTOS GUARDADOS</h4>';
  html += '<div class="table-responsive"><table class="data-table"><thead><tr><th>PRODUCTO</th><th>MATERIAL</th><th>COLOR</th><th>CANTIDAD</th><th>PRECIO</th><th>GUARDADO</th><th>STOCK</th><th>ACCIONES</th></tr></thead><tbody>';
  userSaved.forEach(function(item, idx) {
    var p = APP.products.find(function(x) { return x.id === item.productId; });
    var pName = p ? p.name : 'Producto #' + item.productId;
    var color = item.color || APP.colors[0];
    var avail = _getAvailableGrams(item.material || 'PLA', color);
    var stockBadge = avail < 10 ? '<span style="color:var(--danger);font-size:0.75rem;">Agotado</span>' :
      avail <= 250 ? '<span style="color:var(--warning);font-size:0.75rem;">Stock bajo</span>' :
      '<span style="color:var(--success);font-size:0.75rem;">En stock</span>';
    var canMove = avail >= 10;
    html += '<tr>' +
      '<td style="font-size:0.85rem;">' + pName + '</td>' +
      '<td style="font-family:var(--font-display);font-size:0.75rem;">' + (item.material || 'PLA') + '</td>' +
      '<td><span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:' + color + ';border:1px solid var(--border);vertical-align:middle;"></span></td>' +
      '<td>' + (item.qty || 1) + '</td>' +
      '<td style="font-family:var(--font-display);">' + (item.price || 0).toFixed ? parseFloat(item.price||0).toFixed(2) + '\u20AC' : item.price + '</td>' +
      '<td style="font-size:0.82rem;">' + (item.savedDate || '-') + '</td>' +
      '<td>' + stockBadge + '</td>' +
      '<td style="display:flex;gap:6px;">' +
        (canMove ? '<button class="btn btn-primary btn-small" onclick="moveToCartFromSaved(' + idx + ')">Al carrito</button>' : '') +
        '<button class="btn btn-danger btn-small" onclick="removeSavedItem(' + idx + ')">Eliminar</button>' +
      '</td></tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

// ===== ADMIN STOCK MANAGEMENT =====
function renderAdminStock() {
  var allMats = Object.assign({}, APP.materials, APP.specialMaterials, APP.technicalMaterials || {});
  var matNames = Object.keys(allMats);
  var totalStockG = 0; var lowCount = 0; var totalEntries = 0;
  Object.keys(APP.materialStock).forEach(function(k) {
    var e = APP.materialStock[k];
    totalStockG += e.stockGrams;
    totalEntries++;
    if (e.stockGrams <= 250) lowCount++;
  });
  var totalStockKg = (totalStockG / 1000).toFixed(2);

  var html = '<h3 style="font-family:var(--font-display);font-size:1rem;letter-spacing:1px;margin-bottom:16px;">INVENTARIO PLA</h3>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px;">';
  html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;"><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--cyan);">' + matNames.length + '</div><div style="font-size:0.78rem;color:var(--text3);">MATERIALES</div></div>';
  html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;"><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--cyan);">' + totalStockKg + ' kg</div><div style="font-size:0.78rem;color:var(--text3);">STOCK TOTAL</div></div>';
  html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;"><div style="font-family:var(--font-display);font-size:1.4rem;color:' + (lowCount > 0 ? 'var(--warning)' : 'var(--success)') + ';">' + lowCount + '</div><div style="font-size:0.78rem;color:var(--text3);">ALERTAS BAJO STOCK</div></div>';
  html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;"><div style="font-family:var(--font-display);font-size:1.4rem;color:var(--cyan);">' + totalEntries + '</div><div style="font-size:0.78rem;color:var(--text3);">COMBINACIONES</div></div>';
  html += '</div>';

  html += '<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">';
  html += '<select class="form-select" id="stockFilterMat" onchange="filterAdminStock()" style="width:auto;padding:6px 12px;font-size:0.82rem;"><option value="all">Todos los materiales</option>';
  matNames.forEach(function(m) { html += '<option value="' + m + '">' + m + '</option>'; });
  html += '</select>';
  html += '<button class="btn btn-secondary btn-small" onclick="adminResetAllStock()">Resetear todo a 1kg</button>';
  html += '<button class="btn btn-secondary btn-small" onclick="renderAdminSavedForLaterSection()">Ver Guardados por usuarios</button>';
  html += '</div>';

  html += '<div id="stockTableContainer">' + _buildStockTable(matNames) + '</div>';
  return html;
}

function _buildStockTable(matNames) {
  var html = '';
  matNames.forEach(function(matName) {
    html += '<div class="stock-material-group" data-material="' + matName + '" style="margin-bottom:20px;">';
    html += '<h4 style="font-family:var(--font-heading);font-size:0.9rem;color:var(--cyan);margin-bottom:8px;padding:8px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' + matName + '<button class="btn btn-danger btn-small" style="font-size:0.68rem;padding:3px 10px;" onclick="adminZeroStockForMaterial(\'' + matName.replace(/'/g, "\\'") + '\')">Poner a 0</button></h4>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;">';
    APP.colors.forEach(function(color) {
      var key = matName + '|' + color;
      var entry = APP.materialStock[key];
      if (!entry) return;
      var avail = entry.stockGrams - entry.reservedGrams;
      var statusText, statusStyle;
      if (avail < 10) { statusText = 'Agotado'; statusStyle = 'background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:var(--danger);'; }
      else if (avail <= 250) { statusText = 'Stock bajo'; statusStyle = 'background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.3);color:var(--warning);'; }
      else { statusText = 'Disponible'; statusStyle = 'background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:var(--success);'; }
      html += '<div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">';
      html += '<span style="display:inline-block;width:22px;height:22px;border-radius:4px;background:' + color + ';border:1px solid var(--border);flex-shrink:0;"></span>';
      html += '<div style="flex:1;min-width:0;">';
      html += '<div style="display:flex;align-items:center;gap:6px;">';
      html += '<input type="number" class="form-input" data-stock-key="' + key + '" value="' + Math.round(entry.stockGrams) + '" min="0" max="99999" style="width:70px;padding:2px 6px;font-size:0.78rem;" onchange="adminUpdateStock(\'' + key.replace(/'/g,"\\'") + '\',this.value)">';
      html += '<span style="font-size:0.7rem;color:var(--text3);">g (' + (entry.stockGrams / 1000).toFixed(2) + ' kg)</span>';
      html += '</div>';
      html += '<span style="display:inline-block;font-size:0.65rem;padding:1px 6px;border-radius:3px;margin-top:2px;border:1px solid transparent;' + statusStyle + '">' + statusText + '</span>';
      html += '</div></div>';
    });
    html += '</div></div>';
  });
  return html;
}

function filterAdminStock() {
  var filter = document.getElementById('stockFilterMat').value;
  var groups = document.querySelectorAll('.stock-material-group');
  groups.forEach(function(g) {
    g.style.display = (filter === 'all' || g.dataset.material === filter) ? 'block' : 'none';
  });
}

function adminUpdateStock(materialColorKey, newGrams) {
  var entry = APP.materialStock[materialColorKey];
  if (entry) {
    entry.stockGrams = Math.max(0, parseFloat(newGrams) || 0);
    _saveStockToServer();
    showToast('Stock actualizado: ' + materialColorKey.replace('|', ' ') + ' = ' + Math.round(entry.stockGrams) + 'g');
    _refreshStockUI();
  }
}

function adminResetAllStock() {
  Object.keys(APP.materialStock).forEach(function(k) {
    APP.materialStock[k].stockGrams = 1000;
    APP.materialStock[k].reservedGrams = 0;
  });
  _saveStockToServer();
  showToast('Stock reseteado a 1kg para todos los materiales');
  _refreshStockUI();
  showAdminSection('stock', document.querySelector('.admin-nav-btn.active'));
}

function adminZeroStockForMaterial(materialName) {
  Object.keys(APP.materialStock).forEach(function(k) {
    if (k.startsWith(materialName + '|')) {
      APP.materialStock[k].stockGrams = 0;
      APP.materialStock[k].reservedGrams = 0;
    }
  });
  _saveStockToServer();
  showToast(materialName + ': stock puesto a 0g para todos los colores');
  _refreshStockUI();
  showAdminSection('stock', document.querySelector('.admin-nav-btn.active'));
}

function renderAdminSavedForLaterSection() {
  var el = document.getElementById('adminContent');
  if (!el) return;
  var html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">';
  html += '<button class="btn btn-secondary btn-small" onclick="showAdminSection(\'stock\',document.querySelector(\'.admin-nav-btn.active\'))">← Volver a Inventario</button>';
  html += '<h3 style="font-family:var(--font-display);font-size:1rem;letter-spacing:1px;">PRODUCTOS GUARDADOS POR USUARIOS</h3></div>';
  if (!APP.savedForLater.length) {
    html += '<p style="color:var(--text3);">No hay productos guardados por usuarios.</p>';
    el.innerHTML = html;
    return;
  }
  var grouped = {};
  APP.savedForLater.forEach(function(item) {
    var u = item.user || 'desconocido';
    if (!grouped[u]) grouped[u] = [];
    grouped[u].push(item);
  });
  Object.keys(grouped).forEach(function(email) {
    html += '<div style="margin-bottom:16px;"><h4 style="font-family:var(--font-heading);font-size:0.88rem;color:var(--cyan);margin-bottom:8px;">' + email + ' (' + grouped[email].length + ' productos)</h4>';
    html += '<div class="table-responsive"><table class="data-table"><thead><tr><th>PRODUCTO</th><th>MATERIAL</th><th>CANTIDAD</th><th>PRECIO</th><th>FECHA</th></tr></thead><tbody>';
    grouped[email].forEach(function(item) {
      var p = APP.products.find(function(x) { return x.id === item.productId; });
      html += '<tr><td>' + (p ? p.name : '#' + item.productId) + '</td><td>' + (item.material || 'PLA') + '</td><td>' + (item.qty || 1) + '</td><td>' + parseFloat(item.price||0).toFixed(2) + '\u20AC</td><td>' + (item.savedDate || '-') + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
  });
  el.innerHTML = html;
}

// ===== HOME PAGE =====
function renderHome() {
  document.getElementById('page-home').innerHTML = `
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid-lines"></div>
      <div class="hero-content">
        <div class="hero-text animate-in">
          <h1>
            <span class="line1">IMPRESIÓN</span><br>
            <span class="line2">3D A MEDIDA</span>
          </h1>
          <p>Transformamos tus ideas en realidad con tecnología de última generación. Diseño, personalización e impresión 3D profesional en Guadalajara.</p>
          <p style="font-size:0.9rem;color:var(--cyan);margin-bottom:8px;font-family:var(--font-heading);">
            <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a>
          </p>
          <div class="hero-buttons">
            <button class="btn btn-primary" onclick="navigateTo('editor')">✦ Crear Diseño 3D</button>
            <button class="btn btn-secondary" onclick="navigateTo('quote')">Calcular Presupuesto</button>
            <button class="btn btn-secondary" onclick="navigateTo('shop')">Ver Tienda</button>
          </div>
        </div>
        <div class="hero-visual animate-in delay-2">
          <div class="printer-showcase">
            <div class="printer-image-container">
              <img src="https://us.elegoo.com/cdn/shop/files/1.Centauri-Carbon-2-_-Front-_-260506_badge.jpg?v=1778323611&width=600" alt="Elegoo Centauri Carbon 2 Combo" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22><rect fill=%22%23111620%22 width=%22400%22 height=%22400%22/><text x=%2250%25%22 y=%2245%25%22 text-anchor=%22middle%22 fill=%22%2300f0ff%22 font-family=%22monospace%22 font-size=%2216%22>ELEGOO CENTAURI</text><text x=%2250%25%22 y=%2255%25%22 text-anchor=%22middle%22 fill=%22%2300f0ff%22 font-family=%22monospace%22 font-size=%2216%22>CARBON 2 COMBO</text><rect x=%22120%22 y=%22100%22 width=%22160%22 height=%22200%22 rx=%228%22 fill=%22none%22 stroke=%22%2300f0ff%22 stroke-width=%222%22 opacity=%220.5%22/><rect x=%22140%22 y=%22130%22 width=%22120%22 height=%22120%22 rx=%224%22 fill=%22%2300f0ff%22 opacity=%220.08%22/></svg>'">
              <div class="printer-glow"></div>
            </div>
            <div class="printer-label">ELEGOO CENTAURI CARBON 2 COMBO</div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>NUESTROS <span>SERVICIOS</span></h2>
          <p>Tecnología avanzada para crear cualquier modelo 3D que puedas imaginar</p>
        </div>
        <div class="features-grid">
          <div class="feature-card animate-in">
            <div class="feature-icon">🎨</div>
            <h3>Diseño Personalizado</h3>
            <p>Editor 3D integrado para crear y personalizar tu modelo con textos, imágenes y colores.</p>
          </div>
          <div class="feature-card animate-in delay-1">
            <div class="feature-icon">🖨️</div>
            <h3>Impresión Profesional</h3>
            <p>Elegoo Centauri Carbon 2 Combo con materiales premium: PLA, PLA+, ASA, PETG, ABS.</p>
          </div>
          <div class="feature-card animate-in delay-2">
            <div class="feature-icon">📐</div>
            <h3>Presupuesto Instantáneo</h3>
            <p>Calcula el coste de tu proyecto al instante según material, tamaño y complejidad.</p>
          </div>
          <div class="feature-card animate-in delay-3">
            <div class="feature-icon">🛒</div>
            <h3>Tienda Online</h3>
            <p>Catálogo de productos listos para imprimir con seguimiento de pedidos en tiempo real.</p>
          </div>
          <div class="feature-card animate-in delay-4">
            <div class="feature-icon">🔄</div>
            <h3>Vista 360°</h3>
            <p>Previsualiza tu diseño en 3D con rotación completa antes de imprimir.</p>
          </div>
          <div class="feature-card animate-in delay-4">
            <div class="feature-icon">📦</div>
            <h3>Seguimiento de Pedidos</h3>
            <p>Al enviar tu pedido se le asignará un transportista (GLS, UPS o SEUR) y un número de seguimiento consultable en tu área privada.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <h2>CREA TU <span>DISEÑO PERSONALIZADO</span></h2>
        <p>Usa nuestro editor 3D para diseñar tu modelo único. Añade textos, imágenes, colores y visualízalo en 360°.</p>
        <button class="btn btn-primary" onclick="navigateTo('editor')" style="font-size:1.1rem;padding:16px 36px;">
          ✦ Abrir Editor 3D
        </button>
      </div>
    </div>

    <!-- SMART BUDGET CALCULATOR -->
    <div class="features-section" style="padding:80px 0;">
      <div class="container">
        <div class="section-header">
          <h2>CALCULA TU <span>PRESUPUESTO</span></h2>
          <p>Obtén un precio estimado al instante configurando tu proyecto</p>
        </div>
        <div class="home-calc-container">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);"></div>
          <div class="home-calc-grid">
            <div>
              <div class="form-group">
                <label>Tipo de pieza</label>
                <select class="form-select" id="homeCalcModel" onchange="homeCalcUpdate()">
                  <option value="figurine">Figura / Estatuilla</option>
                  <option value="functional">Pieza Funcional</option>
                  <option value="prototype">Prototipo</option>
                  <option value="decorative">Decoración</option>
                  <option value="mechanical">Mecánica / Engranaje</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div class="form-group">
                <label>Material</label>
                <select class="form-select" id="homeCalcMat" onchange="homeCalcUpdate();homeCalcToggleOther()">
                  <option value="PLA">PLA — 0.05€/cm³</option>
                  <option value="PLA+">PLA+ — 0.07€/cm³</option>
                  <option value="ASA">ASA — 0.09€/cm³</option>
                  <option value="PETG">PETG — 0.08€/cm³</option>
                  <option value="ABS">ABS — 0.06€/cm³</option>
                  <option value="PLA Seda">PLA Seda — 0.10€/cm³</option>
                  <option value="PLA Madera">PLA Madera — 0.12€/cm³</option>
                  <option value="PLA Mármol">PLA Mármol — 0.11€/cm³</option>
                  <option value="PLA Arcoíris">PLA Arcoíris — 0.14€/cm³</option>
                  <option value="Otros PLA">Otros PLA — Consultar</option>
                </select>
              </div>
              <div class="form-group" id="homeCalcOtherGroup" style="display:none;">
                <label>Describe el PLA que necesitas</label>
                <input type="text" class="form-input" id="homeCalcOtherPLA" placeholder="Ej: PLA Fosforescente, PLA Fibra de Carbono...">
              </div>
            </div>
            <div>
              <div class="home-calc-dims">
                <div class="form-group">
                  <label>Ancho (mm)</label>
                  <input type="number" class="form-input" id="homeCalcW" value="0" min="0" max="500" onchange="homeCalcUpdate()">
                </div>
                <div class="form-group">
                  <label>Alto (mm)</label>
                  <input type="number" class="form-input" id="homeCalcH" value="0" min="0" max="500" onchange="homeCalcUpdate()">
                </div>
                <div class="form-group">
                  <label>Fondo (mm)</label>
                  <input type="number" class="form-input" id="homeCalcD" value="0" min="0" max="500" onchange="homeCalcUpdate()">
                </div>
              </div>
              <div class="form-group">
                <label>Calidad de capas</label>
                <select class="form-select" id="homeCalcLayers" onchange="homeCalcUpdate()">
                  <option value="0.3">0.3mm — Borrador</option>
                  <option value="0.2" selected>0.2mm — Estándar</option>
                  <option value="0.1">0.1mm — Alta calidad</option>
                  <option value="0.05">0.05mm — Ultra detalle</option>
                </select>
              </div>
            </div>
          </div>

          <div class="home-calc-result">
            <div>
              <div style="font-family:var(--font-display);font-size:0.72rem;color:var(--text3);letter-spacing:1px;">PRECIO ESTIMADO</div>
              <div class="home-calc-price" id="homeCalcPrice">0.00€</div>
              <div style="font-size:0.78rem;color:var(--text3);margin-top:2px;" id="homeCalcVolume">Introduce las medidas para calcular</div>
              <div id="homeCalcStockInfo" style="margin-top:6px;"></div>
            </div>
            <div class="home-calc-actions">
              <button class="btn btn-primary" onclick="navigateTo('quote')">Solicitar Presupuesto</button>
              <button class="btn btn-secondary" onclick="navigateTo('editor')">Personalizar en Editor</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section" style="padding:80px 0;">
      <div class="container">
        <div class="section-header">
          <h2>COMPARATIVA DE <span>FILAMENTOS</span></h2>
          <p>Elige el material perfecto para tu proyecto según sus características</p>
        </div>
        <div class="table-responsive" style="max-width:1100px;margin:0 auto;">
          <table class="data-table" style="text-align:center;">
            <thead><tr>
              <th style="text-align:left;">Material</th>
              <th>Precio/cm³</th>
              <th>Resistencia</th>
              <th>Flexibilidad</th>
              <th>Detalle</th>
              <th>UV/Exterior</th>
              <th>Temperatura</th>
              <th>Acabado</th>
              <th>Ideal para</th>
            </tr></thead>
            <tbody>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--cyan);font-size:0.85rem;">PLA</td>
                <td style="font-family:var(--font-display);">0.05€</td>
                <td>★★★☆☆</td><td>★★☆☆☆</td><td>★★★★☆</td><td>★☆☆☆☆</td>
                <td>~60°C</td><td>Liso, mate</td>
                <td style="font-size:0.8rem;text-align:left;">Figuras, prototipos, decoración</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--cyan);font-size:0.85rem;">PLA+</td>
                <td style="font-family:var(--font-display);">0.07€</td>
                <td>★★★★☆</td><td>★★★☆☆</td><td>★★★★☆</td><td>★☆☆☆☆</td>
                <td>~65°C</td><td>Liso, resistente</td>
                <td style="font-size:0.8rem;text-align:left;">Piezas funcionales, carcasas</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--cyan);font-size:0.85rem;">ASA</td>
                <td style="font-family:var(--font-display);">0.09€</td>
                <td>★★★★☆</td><td>★★★☆☆</td><td>★★★☆☆</td><td>★★★★★</td>
                <td>~100°C</td><td>Mate, resistente</td>
                <td style="font-size:0.8rem;text-align:left;">Exterior, automoción, UV</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--cyan);font-size:0.85rem;">PETG</td>
                <td style="font-family:var(--font-display);">0.08€</td>
                <td>★★★★☆</td><td>★★★★☆</td><td>★★★☆☆</td><td>★★★☆☆</td>
                <td>~80°C</td><td>Semi-transparente</td>
                <td style="font-size:0.8rem;text-align:left;">Contenedores, piezas mecánicas</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--cyan);font-size:0.85rem;">ABS</td>
                <td style="font-family:var(--font-display);">0.06€</td>
                <td>★★★★★</td><td>★★★☆☆</td><td>★★★☆☆</td><td>★★☆☆☆</td>
                <td>~105°C</td><td>Lijable, pintable</td>
                <td style="font-size:0.8rem;text-align:left;">Ingeniería, calor, impacto</td>
              </tr>
              <tr style="border-top:2px solid var(--border);">
                <td style="text-align:left;font-family:var(--font-display);color:var(--gold);font-size:0.85rem;">PLA Seda</td>
                <td style="font-family:var(--font-display);">0.10€</td>
                <td>★★★☆☆</td><td>★★☆☆☆</td><td>★★★★★</td><td>★☆☆☆☆</td>
                <td>~60°C</td><td>Brillante sedoso</td>
                <td style="font-size:0.8rem;text-align:left;">Decoración premium, regalos</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--gold);font-size:0.85rem;">PLA Madera</td>
                <td style="font-family:var(--font-display);">0.12€</td>
                <td>★★☆☆☆</td><td>★★☆☆☆</td><td>★★★☆☆</td><td>★☆☆☆☆</td>
                <td>~60°C</td><td>Textura madera</td>
                <td style="font-size:0.8rem;text-align:left;">Objetos decorativos naturales</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--gold);font-size:0.85rem;">PLA Mármol</td>
                <td style="font-family:var(--font-display);">0.11€</td>
                <td>★★★☆☆</td><td>★★☆☆☆</td><td>★★★★☆</td><td>★☆☆☆☆</td>
                <td>~60°C</td><td>Efecto mármol</td>
                <td style="font-size:0.8rem;text-align:left;">Jarrones, bustos, estatuas</td>
              </tr>
              <tr>
                <td style="text-align:left;font-family:var(--font-display);color:var(--gold);font-size:0.85rem;">PLA Arcoíris</td>
                <td style="font-family:var(--font-display);">0.14€</td>
                <td>★★★☆☆</td><td>★★☆☆☆</td><td>★★★★☆</td><td>★☆☆☆☆</td>
                <td>~60°C</td><td>Multicolor gradual</td>
                <td style="font-size:0.8rem;text-align:left;">Figuras artísticas, exhibición</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="text-align:center;margin-top:20px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);max-width:700px;margin-left:auto;margin-right:auto;">
          <p style="color:var(--text2);font-size:0.88rem;">¿Necesitas otro tipo de filamento? <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">Llámanos al +34 659 919 485</a> para una cotización personalizada.</p>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>¿POR QUÉ <span>ELEGIRNOS</span>?</h2>
        </div>
        <div class="features-grid" style="max-width:900px;margin:0 auto;">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Rapidez</h3>
            <p>Entrega en 24-72h según complejidad del modelo.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💎</div>
            <h3>Calidad Premium</h3>
            <p>Resolución de capa desde 0.01mm con acabados profesionales.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Asesoramiento</h3>
            <p>Te ayudamos a elegir el material y diseño perfecto.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== HOME BUDGET CALCULATOR =====
function homeCalcUpdate() {
  const w = parseFloat(document.getElementById('homeCalcW')?.value||0);
  const h = parseFloat(document.getElementById('homeCalcH')?.value||0);
  const d = parseFloat(document.getElementById('homeCalcD')?.value||0);
  const mat = document.getElementById('homeCalcMat')?.value||'PLA';
  const layers = parseFloat(document.getElementById('homeCalcLayers')?.value||0.2);
  const volEl = document.getElementById('homeCalcVolume');
  const priceEl = document.getElementById('homeCalcPrice');

  if (!w || !h || !d) {
    if (priceEl) priceEl.textContent = '0.00€';
    if (volEl) volEl.textContent = 'Introduce las medidas para calcular';
    return;
  }

  const vol = (w * h * d) / 1000;
  if (volEl) volEl.textContent = 'Volumen: ' + vol.toFixed(1) + ' cm³ · ' + w + 'x' + h + 'x' + d + 'mm';

  if (mat === 'Otros PLA') {
    if (priceEl) priceEl.textContent = 'Consultar';
    return;
  }

  let price = parseFloat(calcPrice(w, h, d, mat));
  if (price > 0) {
    if (layers <= 0.05) price *= 1.8;
    else if (layers <= 0.1) price *= 1.4;
    else if (layers <= 0.2) price *= 1.0;
    else price *= 0.85;
  }
  if (priceEl) priceEl.textContent = price.toFixed(2) + '€';
  _updateHomeCalcStock();
}

function homeCalcToggleOther() {
  const mat = document.getElementById('homeCalcMat')?.value;
  const group = document.getElementById('homeCalcOtherGroup');
  if (group) group.style.display = mat === 'Otros PLA' ? 'block' : 'none';
}

// ===== CATALOG PAGE =====
function renderCatalog() {
  const cats = [...new Set(APP.products.map(p=>p.category))];
  document.getElementById('page-catalog').innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>CATÁLOGO DE <span>PRODUCTOS</span></h2>
        <p>Modelos listos para imprimir con precios según material</p>
      </div>
      <div class="shop-filters">
        <button class="filter-btn active" onclick="filterCatalog('all',this)">Todos</button>
        ${cats.map(c=>`<button class="filter-btn" onclick="filterCatalog('${c}',this)">${c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('')}
      </div>
      <div class="shop-grid" id="catalogGrid">
        ${APP.products.map(p => renderCatalogCard(p)).join('')}
      </div>
    </div>
  `;
}

function renderCatalogCard(p) {
  const materialPrices = Object.entries(APP.materials).map(([k,v]) =>
    `<li><span style="color:var(--cyan)">${k}</span>: <b>${(p.price * (v.base/0.05)).toFixed(2)}€</b></li>`
  ).join('');
  return `
    <div class="product-card" data-cat="${p.category}">
      <div class="product-image">${p.icon}</div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <p class="product-material">${p.desc}</p>
        <div style="margin-bottom:12px;">
          <div style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:1px;margin-bottom:6px;">PRECIOS POR MATERIAL</div>
          <ul style="list-style:none;font-size:0.82rem;color:var(--text2);">
            ${materialPrices}
          </ul>
          <p style="font-size:0.7rem;color:var(--text3);margin-top:6px;font-style:italic;">Otros filamentos: consultar</p>
        </div>
        <button class="btn btn-primary btn-small" onclick="addToCart(${p.id},'PLA')">Añadir al carrito</button>
      </div>
    </div>
  `;
}

function filterCatalog(cat, btn) {
  document.querySelectorAll('.shop-filters .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#catalogGrid .product-card').forEach(c => {
    c.style.display = (cat==='all' || c.dataset.cat===cat) ? 'block' : 'none';
  });
}

// ===== PRICING PAGE =====
function renderPricing() {
  // Always load latest stock from server before rendering
  _fetchStockFromServer();
  document.getElementById('page-pricing').innerHTML = `
    <div class="container pricing-section">
      <div class="section-header">
        <h2>TARIFAS <span>EXCLUSIVAS</span></h2>
        <p>Precios por centímetro cúbico según el material seleccionado</p>
      </div>
      <div class="pricing-grid">
        ${Object.entries(APP.materials).map(([key, mat], i) => {
          var safeId = key.replace(/[^a-zA-Z0-9]/g, '_');
          return `
          <div class="pricing-card ${key==='PLA+'?'featured':''}">
            <div class="pricing-material">${key}</div>
            <h3>${mat.name}</h3>
            <div class="pricing-amount">${mat.base.toFixed(2)}€ <small>/cm³</small></div>
            <div class="pricing-unit">precio base por volumen</div>
            <ul class="pricing-features">
              <li>${mat.desc}</li>
              <li>Resolución desde 0.01mm</li>
              <li>Colores disponibles: ${APP.colors.length}</li>
              <li>Entrega 24-72h</li>
              <li>Garantía de calidad</li>
            </ul>
            ${_stockBadgeHtml(key)}
            <div style="padding:8px;background:rgba(0,240,255,0.04);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px;font-size:0.78rem;display:flex;align-items:center;gap:6px;">
              <span style="font-size:1rem;">🌙</span>
              <span style="color:var(--text2);">Fosforescente</span>
              <span style="color:var(--gold);font-weight:600;">+${APP.adminSettings.glowInDarkSurcharge || 25}%</span>
            </div>
            <button class="btn btn-primary btn-small" style="width:100%;margin-bottom:6px;" onclick="navigateTo('quote')">Solicitar Presupuesto</button>
            <button id="stockBtn_${safeId}" class="btn ${(function(){var s=_stockStatusInfo(_getTotalStockForMaterial(key));return s.level==='out'?'btn-danger':s.level==='low'?'btn-gold':'btn-secondary'})()} btn-small" style="width:100%" onclick="checkMaterialAvailability('${key}')">${(function(){var s=_stockStatusInfo(_getTotalStockForMaterial(key));return s.level==='out'?'❌ Agotado':s.level==='low'?'⚠️ Consultar Disponibilidad':'🔍 Consultar Stock'})()}</button>
            ${_colorAlertHtml(key)}
          </div>
        `}).join('')}
      </div>

      <div style="margin-top:60px;">
        <div class="section-header">
          <h2>MATERIALES <span>ESPECIALES</span></h2>
          <p>PLA especiales con coste adicional para acabados únicos</p>
        </div>
        <div class="pricing-grid" style="max-width:1000px;margin:0 auto;">
          ${Object.entries(APP.specialMaterials).map(([key, mat]) => {
            var safeId = key.replace(/[^a-zA-Z0-9]/g, '_');
            return `
            <div class="pricing-card">
              <div class="pricing-material" style="background:rgba(240,192,64,0.15);border-color:rgba(240,192,64,0.3);color:var(--gold);">${key}</div>
              <h3>${key}</h3>
              <div class="pricing-amount">${mat.base.toFixed(2)}€ <small>/cm³</small></div>
              <div class="pricing-unit">material especial</div>
              <ul class="pricing-features">
                <li>${mat.desc}</li>
                <li>Disponibilidad bajo consulta</li>
                <li>Acabado premium</li>
              </ul>
              ${_stockBadgeHtml(key)}
              <div style="padding:8px;background:rgba(240,192,64,0.04);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px;font-size:0.78rem;display:flex;align-items:center;gap:6px;">
                <span style="font-size:1rem;">🌙</span>
                <span style="color:var(--text2);">Fosforescente</span>
                <span style="color:var(--gold);font-weight:600;">+${APP.adminSettings.glowInDarkSurcharge || 25}%</span>
              </div>
              <button class="btn btn-gold btn-small" style="width:100%;margin-bottom:6px;" onclick="navigateTo('quote')">Consultar</button>
              <button id="stockBtn_${safeId}" class="btn ${(function(){var s=_stockStatusInfo(_getTotalStockForMaterial(key));return s.level==='out'?'btn-danger':s.level==='low'?'btn-gold':'btn-secondary'})()} btn-small" style="width:100%" onclick="checkMaterialAvailability('${key}')">${(function(){var s=_stockStatusInfo(_getTotalStockForMaterial(key));return s.level==='out'?'❌ Agotado':s.level==='low'?'⚠️ Consultar Disponibilidad':'🔍 Consultar Stock'})()}</button>
              ${_colorAlertHtml(key)}
            </div>
          `}).join('')}
        </div>
      </div>

      <div style="margin-top:60px;">
        <div class="section-header">
          <h2>PLA TÉCNICO / <span>PROFESIONAL</span></h2>
          <p>Materiales PLA de grado profesional para aplicaciones especializadas</p>
        </div>
        <div class="pricing-grid" style="max-width:1000px;margin:0 auto;">
          ${Object.entries(APP.technicalMaterials).map(([key, mat]) => _renderTechMaterialCard(key, mat)).join('')}
        </div>
      </div>

      <div style="text-align:center;margin-top:40px;padding:24px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);">
        <p style="color:var(--text2);font-size:0.95rem;">¿Necesitas otro tipo de filamento? <strong style="color:var(--cyan);">Contáctanos</strong> para una cotización personalizada.</p>
      </div>
    </div>
  `;
}

function _renderTechMaterialCard(key, mat) {
  var useCase = mat.foodSafe ? '🍽️ Apto contacto alimentario' : mat.industrial ? '⚙️ Uso industrial / mecánico' : '🔧 Engranajes y construcción';
  var useBadge = mat.foodSafe ? 'FDA' : mat.industrial ? 'IND' : 'ENG';
  var safeId = key.replace(/[^a-zA-Z0-9]/g,'_');
  var totalStock = _getTotalStockForMaterial(key);
  return '<div class="pricing-card">' +
    '<div class="pricing-material" style="background:rgba(0,255,180,0.12);border-color:rgba(0,255,180,0.3);color:#00FFB4;">' + key + '</div>' +
    '<span style="display:inline-block;background:rgba(0,255,180,0.15);border:1px solid rgba(0,255,180,0.3);color:#00FFB4;font-size:0.65rem;font-family:var(--font-display);padding:2px 8px;border-radius:4px;margin-bottom:8px;">' + useBadge + '</span>' +
    '<h3>' + key + '</h3>' +
    '<div class="pricing-amount" id="techPrice_' + safeId + '">' + mat.base.toFixed(2) + '€ <small>/cm³</small></div>' +
    '<div class="pricing-unit">material técnico</div>' +
    '<div style="margin:10px 0;padding:8px;background:var(--surface);border-radius:var(--radius);font-size:0.8rem;">' +
    '<label style="font-size:0.72rem;color:var(--text3);display:block;margin-bottom:4px;">Dificultad de impresión:</label>' +
    '<select class="form-select" style="width:100%;padding:4px 8px;font-size:0.78rem;" onchange="updateTechMaterialPrice(\'' + key + '\',this.value)">' +
    '<option value="1">Baja (×1.0)</option><option value="1.3">Media (×1.3)</option><option value="1.6">Alta (×1.6)</option><option value="2">Muy Alta (×2.0)</option></select>' +
    '<div id="techMultiplier_' + safeId + '" style="font-size:0.7rem;color:var(--text3);margin-top:4px;">Multiplicador: ×1.0</div></div>' +
    '<ul class="pricing-features"><li>' + mat.desc + '</li><li>' + useCase + '</li><li>Disponibilidad bajo consulta</li></ul>' +
    _stockBadgeHtml(key) +
    '<div style="padding:8px;background:rgba(0,255,180,0.04);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px;font-size:0.78rem;display:flex;align-items:center;gap:6px;">' +
    '<span style="font-size:1rem;">🌙</span><span style="color:var(--text2);">Fosforescente</span><span style="color:var(--gold);font-weight:600;">+' + (APP.adminSettings.glowInDarkSurcharge || 25) + '%</span></div>' +
    '<button class="btn btn-gold btn-small" style="width:100%;margin-bottom:6px;" onclick="navigateTo(\'quote\')">Solicitar Presupuesto</button>' +
    '<button id="stockBtn_' + safeId + '" class="btn ' + (function(){var s=_stockStatusInfo(totalStock);return s.level==='out'?'btn-danger':s.level==='low'?'btn-gold':'btn-secondary'})() + ' btn-small" style="width:100%" onclick="checkTechMaterialAvailability(\'' + key + '\')">' + (function(){var s=_stockStatusInfo(totalStock);return s.level==='out'?'❌ Agotado':s.level==='low'?'⚠️ Consultar Disponibilidad':'🔍 Consultar Stock'})() + '</button>' +
    _colorAlertHtml(key) +
    '</div>';
}

function updateTechMaterialPrice(materialName, multiplier) {
  const mat = APP.technicalMaterials[materialName];
  if (!mat) return;
  const m = parseFloat(multiplier);
  const price = (mat.base * m).toFixed(2);
  const safeId = materialName.replace(/\s/g,'_');
  const priceEl = document.getElementById('techPrice_' + safeId);
  const multEl = document.getElementById('techMultiplier_' + safeId);
  if (priceEl) priceEl.innerHTML = price + '€ <small>/cm³</small>';
  if (multEl) multEl.textContent = 'Multiplicador: ×' + m.toFixed(1);
}

function checkTechMaterialAvailability(materialName) {
  checkMaterialAvailability(materialName);
}

// ===== SHOP PAGE =====
function renderShop() {
  const catIds = ['all', ...new Set(APP.products.map(p=>p.category))];
  const catMap = {};
  (APP.shopCategories||[]).forEach(c => catMap[c.id] = c);
  document.getElementById('page-shop').innerHTML = `
    <div class="container shop-section">
      <div class="section-header">
        <h2>TIENDA <span>ONLINE</span></h2>
        <p>Productos listos para imprimir y enviar</p>
      </div>
      <div class="shop-filters">
        ${catIds.map((c,i)=>{
          const cat = catMap[c];
          const label = c==='all' ? 'Todos' : (cat ? cat.name : c.charAt(0).toUpperCase()+c.slice(1));
          return `<button class="filter-btn ${i===0?'active':''}" onclick="filterShop('${c}',this)">${label}</button>`;
        }).join('')}
      </div>
      <div class="shop-grid" id="shopGrid">
        ${APP.products.map(p => `
          <div class="product-card" data-cat="${p.category}">
            <div class="product-image">${p.icon}</div>
            <div class="product-info">
              <h4>${p.name}</h4>
              <p class="product-material">${p.material}</p>
              <p style="font-size:0.82rem;color:var(--text2);margin-bottom:10px;">${p.desc}</p>
              <div class="product-price">${p.price.toFixed(2)}€</div>
              <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="addToCart(${p.id},'${p.material}')">Añadir</button>
                <button class="btn btn-secondary btn-small" onclick="showProductDetail(${p.id})">Detalle</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function filterShop(cat, btn) {
  document.querySelectorAll('.shop-filters .filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#shopGrid .product-card').forEach(c => {
    c.style.display = (cat==='all' || c.dataset.cat===cat) ? 'block' : 'none';
  });
}

function showProductDetail(id) {
  const p = APP.products.find(x=>x.id===id);
  if (!p) return;
  showToast(`${p.name} - ${p.desc}`);
}

function addToCart(productId, material) {
  const p = APP.products.find(x=>x.id===productId);
  if (!p) return;
  const existing = APP.cart.find(c=>c.productId===productId && c.material===material);
  if (existing) { existing.qty++; }
  else { APP.cart.push({ productId, material, qty:1, price:p.price }); }
  APP._cartLastUpdate = Date.now();
  updateNav();
  showToast(`${p.name} añadido al carrito`);
}

// ===== CART PAGE =====
function renderCart() {
  const items = APP.cart.map(ci => {
    const p = APP.products.find(x=>x.id===ci.productId);
    return { ...ci, product: p };
  }).filter(x=>x.product);

  const total = items.reduce((s,i)=>s + i.price*i.qty, 0);

  document.getElementById('page-cart').innerHTML = `
    <div class="container cart-section">
      <div class="section-header">
        <h2>CARRITO DE <span>COMPRAS</span></h2>
      </div>
      ${items.length === 0 ? `
        <div style="text-align:center;padding:60px 0;">
          <p style="font-size:3rem;margin-bottom:16px;">🛒</p>
          <p style="color:var(--text2);">Tu carrito está vacío</p>
          <button class="btn btn-primary" style="margin-top:20px;" onclick="navigateTo('shop')">Ir a la Tienda</button>
        </div>
      ` : `
        <div id="cartStockSummary">
          ${(() => {
            let hasIssues = false;
            items.forEach(item => {
              const im = item.material || 'PLA', ic = item.color || APP.colors[0];
              const ia = _getAvailableGrams(im, ic);
              const p2 = item.product;
              let v2 = 0; if (p2 && p2.dimensions) v2 = (p2.dimensions.w * p2.dimensions.h * p2.dimensions.d) / 1000; else v2 = parseFloat(item.price) / 5;
              if (ia < _estimateGramsFromVolume(v2) * item.qty) hasIssues = true;
            });
            return hasIssues
              ? '<div style="padding:10px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);margin-bottom:16px;font-size:0.82rem;color:var(--warning);">⚠️ Algunos productos tienen stock insuficiente. Puedes guardarlos para más tarde o proceder igualmente.</div>'
              : '<div style="padding:10px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);margin-bottom:16px;font-size:0.82rem;color:var(--success);">✅ Todos los productos tienen stock disponible.</div>';
          })()}
        </div>
        <div class="cart-items">
          ${items.map((item, idx) => {
            const itemMat = item.material || 'PLA';
            const itemColor = item.color || APP.colors[0];
            const itemAvail = _getAvailableGrams(itemMat, itemColor);
            const p = item.product;
            let vol = 0;
            if (p && p.dimensions) { vol = (p.dimensions.w * p.dimensions.h * p.dimensions.d) / 1000; }
            else { vol = parseFloat(item.price) / 5; }
            const neededGrams = _estimateGramsFromVolume(vol) * item.qty;
            const insufficient = itemAvail < neededGrams;
            return `
            <div class="cart-item" style="${insufficient ? 'border-color:var(--warning);' : ''}">
              <div class="cart-item-image">${item.product.icon}</div>
              <div class="cart-item-info">
                <h4>${item.product.name}</h4>
                <p>${item.material}</p>
                <span data-stock-cart-idx="${idx}" style="font-size:0.75rem;display:block;margin-top:4px;color:${insufficient ? 'var(--warning)' : 'var(--success)'};">${insufficient ? '⚠️ Stock insuficiente (' + Math.round(itemAvail) + 'g / ~' + Math.round(neededGrams) + 'g)' : '✅ Stock disponible (' + Math.round(itemAvail) + 'g)'}</span>
              </div>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateCartQty(${idx},-1)">−</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty(${idx},1)">+</button>
              </div>
              <div class="cart-item-price">${(item.price * item.qty).toFixed(2)}€</div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                <button class="btn btn-danger btn-small" onclick="removeCartItem(${idx})">✕</button>
                ${insufficient ? '<button class="btn btn-secondary btn-small" style="font-size:0.68rem;white-space:nowrap;" onclick="saveForLater(' + idx + ')">Guardar</button>' : ''}
              </div>
            </div>
          `}).join('')}
        </div>
        <div class="cart-total">
          <div>
            <span style="color:var(--text2)">Total:</span>
          </div>
          <div class="cart-total-amount">${total.toFixed(2)}€</div>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <button class="btn btn-primary" onclick="showPaymentGateway()" style="font-size:1.05rem;padding:14px 40px;">Realizar Pedido</button>
        </div>
      `}
    </div>
  `;
}

function updateCartQty(idx, delta) {
  APP.cart[idx].qty = Math.max(1, APP.cart[idx].qty + delta);
  renderCart(); updateNav();
}

function removeCartItem(idx) {
  APP.cart.splice(idx, 1);
  renderCart(); updateNav();
  showToast('Producto eliminado');
}

function showPaymentGateway() {
  if (!APP.user) { navigateTo('auth'); showToast('Inicia sesión para completar el pedido'); return; }
  if (APP.cart.length === 0) { showToast('El carrito está vacío'); return; }

  // Pre-checkout stock validation
  var stockIssues = [];
  APP.cart.forEach(function(item, idx) {
    var p = APP.products.find(function(x) { return x.id === item.productId; });
    var mat = item.material || 'PLA';
    var color = item.color || APP.colors[0];
    var avail = _getAvailableGrams(mat, color);
    var vol = 0;
    if (p && p.dimensions) vol = (p.dimensions.w * p.dimensions.h * p.dimensions.d) / 1000;
    else vol = parseFloat(item.price) / 5;
    var needed = _estimateGramsFromVolume(vol) * item.qty;
    if (avail < needed) {
      stockIssues.push({ idx: idx, name: p ? p.name : 'Producto', material: mat, available: Math.round(avail), needed: Math.round(needed) });
    }
  });

  const total = APP.cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const pm = APP.adminSettings.paymentMethods || {};
  const enabledMethods = Object.entries(pm).filter(([k,v])=>v.enabled);

  if (enabledMethods.length === 0) {
    // Fallback: direct checkout without payment selection
    checkout('direct');
    return;
  }

  const container = document.querySelector('.cart-section') || document.getElementById('page-cart');
  const targetEl = container.querySelector('.cart-items')?.parentElement || container;

  // Build payment gateway overlay
  let stockWarningHtml = '';
  if (stockIssues.length > 0) {
    stockWarningHtml = `
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:14px;margin-bottom:20px;">
        <p style="font-size:0.85rem;color:var(--warning);font-weight:600;margin-bottom:8px;">⚠️ Productos con stock insuficiente:</p>
        ${stockIssues.map(si => `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(245,158,11,0.15);font-size:0.8rem;">
          <span style="color:var(--text2);">${si.name} (${si.material})</span>
          <span style="color:var(--warning);">${si.available}g disp. / ~${si.needed}g necesarios</span>
        </div>`).join('')}
        <p style="font-size:0.75rem;color:var(--text3);margin-top:8px;">Puedes proceder igualmente o volver al carrito para guardar productos para más tarde.</p>
      </div>
    `;
  }
  let html = `
    <div style="max-width:700px;margin:0 auto;padding:20px 0;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <button class="btn btn-secondary btn-small" onclick="renderCart()">← Volver al carrito</button>
        <h3 style="font-family:var(--font-display);font-size:1.1rem;letter-spacing:1px;margin:0;">PASARELA DE PAGO</h3>
      </div>

      ${stockWarningHtml}

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <span style="color:var(--text2);font-size:0.92rem;">Total a pagar:</span>
          <span style="font-family:var(--font-display);font-size:1.6rem;color:var(--cyan);">${total.toFixed(2)}€</span>
        </div>
        <p style="font-size:0.78rem;color:var(--text3);margin-top:6px;">${APP.cart.reduce((s,i)=>s+i.qty,0)} artículo(s) en tu carrito</p>
      </div>

      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:14px;color:var(--text1);">Selecciona el método de pago:</h4>

      <div id="paymentMethodsList" style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
        ${enabledMethods.map(([key, m]) => `
          <div class="payment-method-option" data-method="${key}" onclick="selectPaymentMethod('${key}')" style="background:var(--bg2);border:2px solid var(--border);border-radius:var(--radius);padding:18px;cursor:pointer;transition:all 0.2s;">
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:1.5rem;">${m.icon}</span>
              <div style="flex:1;">
                <span style="font-family:var(--font-heading);font-size:0.95rem;font-weight:600;">${m.label}</span>
                <p style="font-size:0.8rem;color:var(--text3);margin-top:2px;">${_paymentShortDesc(key)}</p>
              </div>
              <div class="payment-radio" style="width:22px;height:22px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;">
                <div style="width:12px;height:12px;border-radius:50%;background:transparent;transition:all 0.2s;"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div id="paymentDetails" style="display:none;"></div>

      <div id="paymentActions" style="display:none;text-align:center;margin-top:20px;">
        <button class="btn btn-primary" onclick="processPayment()" style="font-size:1rem;padding:14px 40px;width:100%;max-width:400px;">Confirmar Pedido</button>
      </div>
    </div>
  `;

  targetEl.innerHTML = html;
}

function _paymentShortDesc(key) {
  const descs = {
    card: 'Pago inmediato con tarjeta',
    transfer: 'Envío tras confirmar recepción del pago (hasta 72h laborables)',
    bizum: 'Pago rápido por Bizum',
    crypto: 'Pago con Worldcoin — envío tras confirmación en blockchain (hasta 72h laborables)'
  };
  return descs[key] || '';
}

let _selectedPaymentMethod = null;

function selectPaymentMethod(method) {
  _selectedPaymentMethod = method;
  const pm = APP.adminSettings.paymentMethods || {};
  const m = pm[method];
  if (!m) return;

  // Update radio buttons visual
  document.querySelectorAll('.payment-method-option').forEach(opt => {
    const isSelected = opt.dataset.method === method;
    opt.style.borderColor = isSelected ? 'var(--cyan)' : 'var(--border)';
    opt.style.background = isSelected ? 'rgba(0,240,255,0.05)' : 'var(--bg2)';
    const radio = opt.querySelector('.payment-radio');
    if (radio) {
      radio.style.borderColor = isSelected ? 'var(--cyan)' : 'var(--border)';
      radio.querySelector('div').style.background = isSelected ? 'var(--cyan)' : 'transparent';
    }
  });

  // Show payment details
  const detailsEl = document.getElementById('paymentDetails');
  const actionsEl = document.getElementById('paymentActions');
  if (!detailsEl || !actionsEl) return;
  actionsEl.style.display = 'block';

  let detailsHtml = `<div style="background:var(--bg2);border:1px solid var(--cyan);border-radius:var(--radius);padding:20px;animation:fadeInUp 0.3s ease;">`;

  if (method === 'card') {
    const stripeConf = m.stripe || {};
    const isStripe = m.gateway === 'stripe' && stripeConf.publishableKey && !stripeConf.publishableKey.includes('XXXX');
    if (isStripe) {
      detailsHtml += `
        <h4 style="font-family:var(--font-heading);font-size:0.92rem;color:var(--cyan);margin-bottom:6px;">${m.icon} ${m.label}</h4>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
          <span style="font-size:0.72rem;padding:3px 8px;border-radius:4px;background:${stripeConf.mode==='live'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'};color:${stripeConf.mode==='live'?'var(--success)':'var(--warning)'};">${stripeConf.mode==='live'?'Producción':'Modo test'}</span>
          <svg viewBox="0 0 60 25" style="height:18px;"><rect width="60" height="25" rx="4" fill="#635BFF"/><text x="30" y="17" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Arial,sans-serif">stripe</text></svg>
        </div>
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">${m.description}</p>
        <div id="stripeCardContainer" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
          <div class="form-group"><label style="font-size:0.78rem;">Titular de la tarjeta</label><input type="text" class="form-input" id="payCardHolder" placeholder="Nombre como aparece en la tarjeta"></div>
          <div class="form-group"><label style="font-size:0.78rem;">Datos de la tarjeta</label>
            <div id="stripe-card-element" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;min-height:22px;"></div>
          </div>
          <div id="stripe-card-errors" style="color:var(--error);font-size:0.78rem;margin-top:6px;"></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:10px;">
          <svg viewBox="0 0 16 16" style="width:14px;height:14px;"><rect x="1" y="4" width="14" height="10" rx="2" fill="none" stroke="var(--success)" stroke-width="1.2"/><path d="M5 4V3a3 3 0 016 0v1" fill="none" stroke="var(--success)" stroke-width="1.2"/><circle cx="8" cy="9.5" r="1.2" fill="var(--success)"/></svg>
          <span style="font-size:0.72rem;color:var(--success);">Pago seguro cifrado con Stripe. No almacenamos datos de tu tarjeta.</span>
        </div>
      `;
    } else {
      detailsHtml += `
        <h4 style="font-family:var(--font-heading);font-size:0.92rem;color:var(--cyan);margin-bottom:14px;">${m.icon} ${m.label}</h4>
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">${m.description}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group" style="grid-column:1/-1;"><label style="font-size:0.78rem;">Número de tarjeta</label><input type="text" class="form-input" id="payCardNumber" placeholder="0000 0000 0000 0000" maxlength="19" oninput="this.value=this.value.replace(/[^0-9 ]/g,'').replace(/(.{4})/g,'$1 ').trim()"></div>
          <div class="form-group"><label style="font-size:0.78rem;">Fecha de caducidad</label><input type="text" class="form-input" id="payCardExpiry" placeholder="MM/AA" maxlength="5" oninput="if(this.value.length===2&&!this.value.includes('/'))this.value+='/'"></div>
          <div class="form-group"><label style="font-size:0.78rem;">CVV</label><input type="text" class="form-input" id="payCardCVV" placeholder="000" maxlength="4"></div>
          <div class="form-group" style="grid-column:1/-1;"><label style="font-size:0.78rem;">Titular de la tarjeta</label><input type="text" class="form-input" id="payCardHolder" placeholder="Nombre como aparece en la tarjeta"></div>
        </div>
        <div style="margin-top:8px;padding:10px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius);">
          <p style="font-size:0.75rem;color:var(--warning);">⚠️ Stripe no está configurado. Contacta con el administrador. Se procesará en modo simulado.</p>
        </div>
      `;
    }
  } else if (method === 'transfer') {
    detailsHtml += `
      <h4 style="font-family:var(--font-heading);font-size:0.92rem;color:var(--cyan);margin-bottom:14px;">${m.icon} ${m.label}</h4>
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">${m.description}</p>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px;">
        <div style="margin-bottom:10px;">
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">TITULAR</span>
          <p style="font-size:0.95rem;font-weight:600;color:var(--text1);margin-top:2px;">${m.bankHolder || APP.invoiceSettings.companyName}</p>
        </div>
        <div style="margin-bottom:10px;">
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">IBAN</span>
          <p style="font-size:0.95rem;font-family:var(--font-display);color:var(--cyan);margin-top:2px;word-break:break-all;">${m.bankAccount || APP.invoiceSettings.bankAccount}</p>
        </div>
        <div>
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">CONCEPTO</span>
          <p style="font-size:0.85rem;color:var(--text1);margin-top:2px;">${m.bankReference || 'Indicar nº de pedido'}</p>
        </div>
      </div>
      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:12px;">
        <p style="font-size:0.82rem;color:var(--warning);">⚠️ El producto será enviado con el nº de seguimiento del transportista una vez recibido el pago (hasta 72h laborables, sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.</p>
      </div>
    `;
  } else if (method === 'bizum') {
    const redsysConf = m.redsys || {};
    const isRedsys = m.gateway === 'redsys' && redsysConf.merchantCode && redsysConf.secretKey && !redsysConf.secretKey.includes('XXXX');
    const total = APP.cart.reduce((s,i)=>s+i.price*i.qty, 0);
    detailsHtml += `
      <h4 style="font-family:var(--font-heading);font-size:0.92rem;color:var(--cyan);margin-bottom:6px;">${m.icon} ${m.label}</h4>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
        ${isRedsys ? `<span style="font-size:0.72rem;padding:3px 8px;border-radius:4px;background:${redsysConf.mode==='live'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'};color:${redsysConf.mode==='live'?'var(--success)':'var(--warning)'};">${redsysConf.mode==='live'?'Producción':'Modo test'}</span>` : ''}
        <span style="font-size:0.72rem;padding:3px 8px;border-radius:4px;background:rgba(0,240,255,0.1);color:var(--cyan);">Redsys / Bizum</span>
      </div>
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">${m.description}</p>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center;">
        <div style="width:80px;height:80px;margin:0 auto 16px;background:linear-gradient(135deg,rgba(0,240,255,0.1),rgba(139,92,246,0.1));border-radius:50%;display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 48 48" style="width:44px;height:44px;"><circle cx="24" cy="18" r="12" fill="none" stroke="var(--cyan)" stroke-width="1.5"/><text x="24" y="21.5" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--cyan)" font-family="var(--font-heading)">B</text><rect x="12" y="34" width="24" height="5" rx="2.5" fill="rgba(0,240,255,0.12)"/><text x="24" y="38" text-anchor="middle" font-size="5" fill="var(--cyan)" font-family="var(--font-heading)">BIZUM</text></svg>
        </div>
        ${isRedsys ? `
          <p style="font-size:0.92rem;color:var(--text1);margin-bottom:8px;">Pago seguro procesado por <strong style="color:var(--cyan);">Redsys</strong></p>
          <div class="form-group" style="max-width:280px;margin:16px auto 0;text-align:left;">
            <label style="font-size:0.78rem;">Teléfono asociado a Bizum</label>
            <input type="tel" class="form-input" id="payBizumPhone" placeholder="+34 600 000 000" style="text-align:center;font-size:1rem;">
          </div>
          <p style="font-size:0.78rem;color:var(--text3);margin-top:10px;">Al confirmar, recibirás una notificación en tu app bancaria para autorizar el pago de <strong style="color:var(--cyan);">${total.toFixed(2)}€</strong></p>
          <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;">
            <svg viewBox="0 0 16 16" style="width:14px;height:14px;"><rect x="1" y="4" width="14" height="10" rx="2" fill="none" stroke="var(--success)" stroke-width="1.2"/><path d="M5 4V3a3 3 0 016 0v1" fill="none" stroke="var(--success)" stroke-width="1.2"/><circle cx="8" cy="9.5" r="1.2" fill="var(--success)"/></svg>
            <span style="font-size:0.72rem;color:var(--success);">Transacción segura cifrada con protocolo Redsys</span>
          </div>
        ` : `
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">ENVIAR BIZUM A</span>
          <p style="font-size:1.3rem;font-family:var(--font-display);color:var(--cyan);margin-top:6px;">${m.bizumPhone || APP.adminSettings.contactPhone}</p>
          <p style="font-size:0.82rem;color:var(--text2);margin-top:8px;">Indica el número de pedido en el concepto del Bizum</p>
          <div style="margin-top:12px;padding:10px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius);">
            <p style="font-size:0.75rem;color:var(--warning);">⚠️ Redsys no está configurado. El pago se realizará de forma manual al número indicado.</p>
          </div>
        `}
      </div>
    `;
  } else if (method === 'crypto') {
    detailsHtml += `
      <h4 style="font-family:var(--font-heading);font-size:0.92rem;color:var(--cyan);margin-bottom:14px;">${m.icon} ${m.label}</h4>
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">${m.description}</p>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px;">
        <div style="margin-bottom:10px;">
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">RED</span>
          <p style="font-size:0.9rem;color:var(--text1);margin-top:2px;">${m.network || 'Optimism (OP Mainnet)'}</p>
        </div>
        <div style="margin-bottom:10px;">
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">DIRECCIÓN WALLET (WORLDCOIN / WLD)</span>
          <p style="font-size:0.78rem;font-family:monospace;color:var(--cyan);margin-top:2px;word-break:break-all;background:var(--bg3);padding:8px;border-radius:6px;">${m.walletAddress || '0x...'}</p>
        </div>
        <div>
          <span style="font-size:0.75rem;color:var(--text3);font-family:var(--font-display);letter-spacing:0.5px;">TOKEN</span>
          <p style="font-size:0.9rem;color:var(--text1);margin-top:2px;">WLD (Worldcoin)</p>
        </div>
      </div>
      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:12px;">
        <p style="font-size:0.82rem;color:var(--warning);">⚠️ El producto será enviado con el nº de seguimiento del transportista una vez recibido y confirmado el pago en la blockchain (hasta 72h laborables, sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.</p>
      </div>
    `;
  }

  detailsHtml += '</div>';
  detailsEl.innerHTML = detailsHtml;
  detailsEl.style.display = 'block';

  // Mount Stripe Card Element if applicable
  if (method === 'card' && m.gateway === 'stripe') {
    const sConf = m.stripe || {};
    if (sConf.publishableKey && !sConf.publishableKey.includes('XXXX') && typeof Stripe !== 'undefined') {
      try {
        window._stripeInstance = Stripe(sConf.publishableKey);
        const elements = window._stripeInstance.elements({
          fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500&display=swap' }]
        });
        window._stripeCardElement = elements.create('card', {
          style: {
            base: { color: '#e0e0e0', fontFamily: '"Exo 2", sans-serif', fontSize: '15px', '::placeholder': { color: '#666' } },
            invalid: { color: '#ff4466' }
          },
          hidePostalCode: true
        });
        const mountEl = document.getElementById('stripe-card-element');
        if (mountEl) {
          window._stripeCardElement.mount('#stripe-card-element');
          window._stripeCardElement.on('change', function(ev) {
            const errEl = document.getElementById('stripe-card-errors');
            if (errEl) errEl.textContent = ev.error ? ev.error.message : '';
          });
        }
      } catch(e) {
        console.warn('Stripe init error:', e);
        const errEl = document.getElementById('stripe-card-errors');
        if (errEl) errEl.textContent = 'Error al inicializar Stripe: ' + e.message;
      }
    }
  }
}

function processPayment() {
  if (!_selectedPaymentMethod) { showToast('Selecciona un método de pago'); return; }
  if (!APP.user) { navigateTo('auth'); return; }

  const pm = APP.adminSettings.paymentMethods || {};
  const m = pm[_selectedPaymentMethod];

  // Stripe card payment
  if (_selectedPaymentMethod === 'card' && m && m.gateway === 'stripe' && window._stripeInstance && window._stripeCardElement) {
    const holder = document.getElementById('payCardHolder')?.value?.trim();
    if (!holder) { showToast('Introduce el titular de la tarjeta'); return; }
    _processStripePayment(holder);
    return;
  }

  // Redsys Bizum payment
  if (_selectedPaymentMethod === 'bizum' && m && m.gateway === 'redsys') {
    const redsysConf = m.redsys || {};
    if (redsysConf.merchantCode && redsysConf.secretKey && !redsysConf.secretKey.includes('XXXX')) {
      const phone = document.getElementById('payBizumPhone')?.value?.trim();
      if (!phone || phone.replace(/\D/g,'').length < 9) { showToast('Introduce un número de teléfono válido'); return; }
      _processRedsysBizumPayment(phone);
      return;
    }
  }

  // Validate card fields (fallback manual mode)
  if (_selectedPaymentMethod === 'card') {
    const num = document.getElementById('payCardNumber')?.value?.replace(/\s/g,'');
    const exp = document.getElementById('payCardExpiry')?.value;
    const cvv = document.getElementById('payCardCVV')?.value;
    const holder = document.getElementById('payCardHolder')?.value?.trim();
    if (!num || num.length < 13) { showToast('Introduce un número de tarjeta válido'); return; }
    if (!exp || exp.length < 4) { showToast('Introduce la fecha de caducidad'); return; }
    if (!cvv || cvv.length < 3) { showToast('Introduce el CVV'); return; }
    if (!holder) { showToast('Introduce el titular de la tarjeta'); return; }
  }

  const total = APP.cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const methodLabel = m ? m.label : _selectedPaymentMethod;
  const isDeferred = (_selectedPaymentMethod === 'transfer' || _selectedPaymentMethod === 'crypto');

  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    items: [...APP.cart],
    total: total.toFixed(2),
    status: isDeferred ? 'awaiting_payment' : 'pending',
    user: APP.user.email,
    paymentMethod: _selectedPaymentMethod,
    paymentMethodLabel: methodLabel,
    paymentStatus: isDeferred ? 'pending' : 'completed'
  };
  APP.orders.push(order);
  _deductStockForOrder(order);
  APP.cart = [];
  _selectedPaymentMethod = null;
  updateNav();

  // Send emails
  const userName = APP.user.name || APP.user.email;
  if (isDeferred) {
    let instrucciones = '';
    if (_selectedPaymentMethod === 'transfer' || order.paymentMethod === 'transfer') {
      const t = pm.transfer || {};
      instrucciones = 'Datos para la transferencia:\\nTitular: ' + (t.bankHolder || '3D Guadalajara') + '\\nIBAN: ' + (t.bankAccount || '') + '\\nConcepto: Pedido ' + order.id;
    } else {
      const c = pm.crypto || {};
      instrucciones = 'Datos para el pago con Worldcoin:\\nRed: ' + (c.network || 'Optimism') + '\\nWallet: ' + (c.walletAddress || '') + '\\nToken: WLD';
    }
    simulateEmail(APP.user.email, 'paymentPending', { nombre: userName, id: order.id, total: total.toFixed(2), metodo: methodLabel, instrucciones: instrucciones });
  } else {
    simulateEmail(APP.user.email, 'paymentReceived', { nombre: userName, id: order.id, total: total.toFixed(2), metodo: methodLabel });
  }
  simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: userName, id: order.id, total: total.toFixed(2) }, { adminOnly: true });

  // Show confirmation
  _showPaymentConfirmation(order, total, isDeferred);
}

// ===== STRIPE PAYMENT PROCESSING =====
function _processStripePayment(holderName) {
  const btn = document.querySelector('#paymentActions button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span class="spinner-small"></span> Procesando pago con Stripe...</span>'; }

  const pm = APP.adminSettings.paymentMethods.card;
  const stripeConf = pm.stripe || {};
  const total = APP.cart.reduce((s,i)=>s+i.price*i.qty, 0);

  // In production: create PaymentIntent server-side via POST /api/create-payment-intent
  // then confirm with stripe.confirmCardPayment(clientSecret, { payment_method: { card: element, billing_details: { name } } })
  // Simulating the full flow here:

  window._stripeInstance.createToken(window._stripeCardElement, { name: holderName }).then(function(result) {
    if (result.error) {
      showToast(result.error.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Confirmar Pedido'; }
      return;
    }

    // Token received — in production this goes to server to charge
    console.log('[Stripe] Token:', result.token.id, '| Last4:', result.token.card.last4, '| Brand:', result.token.card.brand);

    // Simulate server-side charge (replace with real API call in production)
    setTimeout(function() {
      const order = {
        id: 'ORD-' + Date.now().toString(36).toUpperCase(),
        date: new Date().toLocaleDateString('es-ES'),
        items: [...APP.cart],
        total: total.toFixed(2),
        status: 'pending',
        user: APP.user.email,
        paymentMethod: 'card',
        paymentMethodLabel: pm.label,
        paymentStatus: 'completed',
        stripeTokenId: result.token.id,
        cardBrand: result.token.card.brand,
        cardLast4: result.token.card.last4,
        gatewayMode: stripeConf.mode
      };
      APP.orders.push(order);
      _deductStockForOrder(order);
      APP.cart = [];
      _selectedPaymentMethod = null;
      window._stripeCardElement = null;
      window._stripeInstance = null;
      updateNav();

      const userName = APP.user.name || APP.user.email;
      simulateEmail(APP.user.email, 'paymentReceived', { nombre: userName, id: order.id, total: total.toFixed(2), metodo: pm.label + ' (Stripe · ' + result.token.card.brand + ' ···· ' + result.token.card.last4 + ')' });
      simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: userName, id: order.id, total: total.toFixed(2) }, { adminOnly: true });

      _showPaymentConfirmation(order, total, false);
    }, 1500);
  }).catch(function(err) {
    showToast('Error al procesar el pago: ' + err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Confirmar Pedido'; }
  });
}

// ===== REDSYS BIZUM PAYMENT PROCESSING =====
function _processRedsysBizumPayment(phoneNumber) {
  const btn = document.querySelector('#paymentActions button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span class="spinner-small"></span> Iniciando pago Bizum vía Redsys...</span>'; }

  const pm = APP.adminSettings.paymentMethods.bizum;
  const redsysConf = pm.redsys || {};
  const total = APP.cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

  // In production: Server-side creates Redsys payment request with Ds_Merchant_PayMethods = 'z' (Bizum)
  // Signs with HMAC SHA256 using the secret key, sends to Redsys endpoint
  // Redsys sends push notification to user's banking app
  // User confirms in their banking app
  // Redsys sends notification to merchantURL with result
  //
  // Simulating the flow here:
  console.log('[Redsys Bizum] MerchantCode:', redsysConf.merchantCode, '| Terminal:', redsysConf.terminal, '| Phone:', phoneNumber, '| Amount:', Math.round(total * 100), '| Currency:', redsysConf.currency || '978', '| Mode:', redsysConf.mode);

  // Simulate Redsys Bizum authorization flow
  setTimeout(function() {
    // Show "awaiting authorization" state
    const detailsEl = document.getElementById('paymentDetails');
    if (detailsEl) {
      detailsEl.innerHTML = `
        <div style="background:var(--bg2);border:1px solid var(--cyan);border-radius:var(--radius);padding:30px;text-align:center;animation:fadeInUp 0.3s ease;">
          <div class="spinner-small" style="width:40px;height:40px;border-width:3px;margin:0 auto 16px;"></div>
          <h4 style="font-family:var(--font-heading);font-size:0.95rem;color:var(--cyan);margin-bottom:8px;">Esperando autorización Bizum</h4>
          <p style="font-size:0.88rem;color:var(--text2);margin-bottom:6px;">Hemos enviado una solicitud de pago de <strong style="color:var(--cyan);">${total.toFixed(2)}€</strong></p>
          <p style="font-size:0.85rem;color:var(--text2);">al teléfono <strong style="color:var(--cyan);">${phoneNumber}</strong></p>
          <p style="font-size:0.78rem;color:var(--text3);margin-top:14px;">Abre tu app bancaria y confirma el pago Bizum.</p>
          <div style="margin-top:16px;padding:10px;background:rgba(0,240,255,0.05);border-radius:var(--radius);">
            <p style="font-size:0.72rem;color:var(--text3);">Procesado por Redsys · Comercio: ${redsysConf.merchantName || '3D Guadalajara'}</p>
          </div>
        </div>
      `;
    }

    // Simulate user confirming in their banking app
    setTimeout(function() {
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString('es-ES'),
        items: [...APP.cart],
        total: total.toFixed(2),
        status: 'pending',
        user: APP.user.email,
        paymentMethod: 'bizum',
        paymentMethodLabel: pm.label,
        paymentStatus: 'completed',
        bizumPhone: phoneNumber,
        redsysMerchant: redsysConf.merchantCode,
        redsysAuthCode: 'AUTH-' + Math.random().toString(36).substr(2,8).toUpperCase(),
        gatewayMode: redsysConf.mode
      };
      APP.orders.push(order);
      _deductStockForOrder(order);
      APP.cart = [];
      _selectedPaymentMethod = null;
      updateNav();

      const userName = APP.user.name || APP.user.email;
      simulateEmail(APP.user.email, 'paymentReceived', { nombre: userName, id: order.id, total: total.toFixed(2), metodo: pm.label + ' (Redsys · ' + phoneNumber + ')' });
      simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: userName, id: order.id, total: total.toFixed(2) }, { adminOnly: true });

      _showPaymentConfirmation(order, total, false);
    }, 2500);
  }, 1200);
}

// ===== SHOW PAYMENT CONFIRMATION PAGE =====
function _showPaymentConfirmation(order, total, isDeferred) {
  const methodLabel = order.paymentMethodLabel;
  const container = document.querySelector('.cart-section') || document.getElementById('page-cart');
  let gatewayInfo = '';
  if (order.stripeTokenId) {
    gatewayInfo = `<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;margin-bottom:4px;">
      <svg viewBox="0 0 60 25" style="height:16px;"><rect width="60" height="25" rx="4" fill="#635BFF"/><text x="30" y="17" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Arial,sans-serif">stripe</text></svg>
      <span style="font-size:0.8rem;color:var(--text2);">${order.cardBrand} ···· ${order.cardLast4}</span>
    </div>`;
  } else if (order.redsysAuthCode) {
    gatewayInfo = `<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:8px;margin-bottom:4px;">
      <span style="font-size:0.72rem;padding:3px 8px;border-radius:4px;background:rgba(0,240,255,0.1);color:var(--cyan);">Redsys</span>
      <span style="font-size:0.8rem;color:var(--text2);">Auth: ${order.redsysAuthCode}</span>
    </div>`;
  }

  container.innerHTML = `
    <div class="container" style="padding-top:40px;">
      <div style="max-width:600px;margin:0 auto;text-align:center;padding:40px 20px;">
        <div style="font-size:4rem;margin-bottom:16px;">${isDeferred ? '⏳' : '✅'}</div>
        <h2 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:12px;">${isDeferred ? 'PEDIDO REGISTRADO' : 'PEDIDO CONFIRMADO'}</h2>
        <p style="font-family:var(--font-display);font-size:1rem;color:var(--cyan);margin-bottom:8px;">${order.id}</p>
        <p style="font-size:0.92rem;color:var(--text2);margin-bottom:8px;">Total: <strong style="color:var(--cyan);">${parseFloat(order.total).toFixed(2)}€</strong></p>
        <p style="font-size:0.88rem;color:var(--text2);">Método de pago: <strong>${methodLabel}</strong></p>
        ${gatewayInfo}
        ${isDeferred ? `
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:16px;margin:20px 0;text-align:left;">
            <p style="font-size:0.85rem;color:var(--warning);margin-bottom:8px;">⏳ <strong>Pendiente de pago</strong></p>
            <p style="font-size:0.82rem;color:var(--text2);">Tu pedido ha sido registrado correctamente. El producto será enviado con el nº de seguimiento del transportista una vez recibido el pago (hasta 72h laborables, sin incluir fines de semana ni festivos).</p>
            <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.</p>
          </div>
        ` : `
          <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius);padding:16px;margin:20px 0;">
            <p style="font-size:0.85rem;color:var(--success);">✅ Pago procesado correctamente. Recibirás la factura y el nº de seguimiento por email.</p>
          </div>
        `}
        <p style="font-size:0.82rem;color:var(--text3);margin-bottom:24px;">Hemos enviado un email de confirmación a ${APP.user.email}</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="navigateTo('dashboard')">Ver Mis Pedidos</button>
          <button class="btn btn-secondary" onclick="navigateTo('shop')">Seguir Comprando</button>
        </div>
      </div>
    </div>
  `;
}

// Legacy checkout function
function checkout(method) {
  if (!APP.user) { navigateTo('auth'); showToast('Inicia sesión para completar el pedido'); return; }
  const total = APP.cart.reduce((s,i)=>s+i.price*i.qty,0);
  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    items: [...APP.cart],
    total: total.toFixed(2),
    status: 'pending',
    user: APP.user.email,
    paymentMethod: method || 'direct',
    paymentMethodLabel: 'Pago directo',
    paymentStatus: 'completed'
  };
  APP.orders.push(order);
  APP.cart = [];
  updateNav();
  simulateEmail(APP.user.email, 'newOrder', { nombre: APP.user.name || APP.user.email, id: order.id, total: total.toFixed(2) });
  simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: APP.user.name || APP.user.email, id: order.id, total: total.toFixed(2) }, { adminOnly: true });
  showToast('Pedido realizado correctamente: ' + order.id);
  navigateTo('dashboard');
}

// ===== EDITOR 3D =====
// Placeholder - will be filled in by edit
function renderEditor() {
  document.getElementById('page-editor').innerHTML = '<div class="container editor-section"><div class="section-header"><h2>EDITOR <span>3D</span></h2><p>Cargando editor...</p></div></div>';
  buildEditor();
}

// ===== QUOTE PAGE =====
function renderQuote() {
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  if (!APP._quoteSelectedColors) APP._quoteSelectedColors = [];
  document.getElementById('page-quote').innerHTML = `
    <div class="container quote-section">
      <div class="section-header">
        <h2>PRESUPUESTO <span>A MEDIDA</span></h2>
        <p>Configura tu proyecto y obtén un precio estimado al instante</p>
      </div>
      <div class="quote-form-container">
        <div class="form-group">
          <label>Tipo de Modelo</label>
          <select class="form-select" id="quoteModel" onchange="updateQuote()">
            <option value="figurine">Figura / Estatuilla</option>
            <option value="functional">Pieza Funcional</option>
            <option value="prototype">Prototipo</option>
            <option value="decorative">Decoración</option>
            <option value="mechanical">Mecánica / Engranaje</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Material</label>
          <select class="form-select" id="quoteMaterial" onchange="updateQuote();toggleOtherPLA();_refreshQuoteColorPalette()">
            ${Object.entries(allMats).map(([k,v])=>`<option value="${k}">${k} — ${v.base.toFixed(2)}€/cm³ — ${v.desc}</option>`).join('')}
            <option value="Otros PLA">Otros PLA — Consultar precio — Filamento especial bajo petición</option>
          </select>
        </div>
        <div class="form-group" id="otherPLAGroup" style="display:none;">
          <label>Describe el tipo de PLA que necesitas</label>
          <input type="text" class="form-input" id="quoteOtherPLA" placeholder="Ej: PLA Fosforescente, PLA Fibra de Carbono, PLA Flexible...">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
          <div class="form-group">
            <label>Ancho (mm)</label>
            <input type="number" class="form-input" id="quoteW" value="0" min="0" max="500" onchange="updateQuote()">
          </div>
          <div class="form-group">
            <label>Alto (mm)</label>
            <input type="number" class="form-input" id="quoteH" value="0" min="0" max="500" onchange="updateQuote()">
          </div>
          <div class="form-group">
            <label>Fondo (mm)</label>
            <input type="number" class="form-input" id="quoteD" value="0" min="0" max="500" onchange="updateQuote()">
          </div>
        </div>
        <div class="form-group">
          <label>Colores <span style="font-size:0.8rem;color:var(--text3);">(selecciona uno o más — cada color extra +${APP.adminSettings.multiColorSurcharge || 15}% sobre el precio base)</span></label>
          <div class="stock-color-palette" id="quoteColorPalette">
            ${_stockAwareColorPalette(APP._quoteSelectedColors.length > 0 ? (document.getElementById('quoteMat')?.value || 'PLA') : 'PLA', APP._quoteSelectedColors, 'multi', 0)}
          </div>
          <div id="quoteSelectedColorsInfo" style="margin-top:8px;min-height:24px;">
            ${APP._quoteSelectedColors.length > 0 ? `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:0.82rem;color:var(--text2);">Seleccionados (${APP._quoteSelectedColors.length}):</span>
              ${APP._quoteSelectedColors.map(c=>`<span style="display:inline-block;width:18px;height:18px;border-radius:4px;background:${c};border:1px solid var(--border);vertical-align:middle;"></span>`).join('')}
              ${APP._quoteSelectedColors.length > 1 ? `<span style="font-size:0.78rem;color:var(--gold);">+${(APP._quoteSelectedColors.length - 1) * (APP.adminSettings.multiColorSurcharge || 15)}% multicolor</span>` : ''}
            </div>` : '<span style="font-size:0.82rem;color:var(--text3);">Ningún color seleccionado</span>'}
          </div>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" id="quoteGlow" onchange="updateQuote()" style="width:18px;height:18px;accent-color:var(--cyan);">
            <span>Brilla en la oscuridad</span>
            <span style="font-size:0.78rem;color:var(--gold);">+${APP.adminSettings.glowInDarkSurcharge || 25}% sobre el precio base</span>
          </label>
          <p style="font-size:0.72rem;color:var(--text3);margin-top:4px;">Filamento fosforescente que emite luz en la oscuridad. Coste adicional por material especial.</p>
        </div>
        <div class="form-group">
          <label>Descripción del proyecto</label>
          <textarea class="form-textarea" id="quoteDesc" placeholder="Describe tu proyecto para una valoración más precisa..."></textarea>
        </div>

        <div id="quoteStockIndicator" style="margin-top:8px;"></div>

        <div class="quote-summary" id="quoteSummary">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="font-family:var(--font-display);font-size:0.75rem;color:var(--text3);letter-spacing:1px;">PRECIO ESTIMADO</div>
              <div style="font-family:var(--font-display);font-size:2.4rem;color:var(--cyan);" id="quotePrice">0.00€</div>
              <div id="quotePriceBreakdown" style="font-size:0.78rem;color:var(--text3);"></div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="submitQuote()">Solicitar Presupuesto</button>
              <button class="btn btn-secondary" onclick="navigateTo('editor')">Personalizar en Editor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  updateQuote();
}

function toggleQuoteColor(color, el) {
  if (!APP._quoteSelectedColors) APP._quoteSelectedColors = [];
  const idx = APP._quoteSelectedColors.indexOf(color);
  if (idx >= 0) {
    APP._quoteSelectedColors.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
    el.style.boxShadow = 'none';
  } else {
    APP._quoteSelectedColors.push(color);
    el.style.borderColor = 'var(--cyan)';
    el.style.boxShadow = '0 0 8px var(--cyan)';
  }
  // Update color info display
  const infoEl = document.getElementById('quoteSelectedColorsInfo');
  if (infoEl) {
    const surcharge = APP.adminSettings.multiColorSurcharge || 15;
    if (APP._quoteSelectedColors.length > 0) {
      infoEl.innerHTML = '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">' +
        '<span style="font-size:0.82rem;color:var(--text2);">Seleccionados (' + APP._quoteSelectedColors.length + '):</span>' +
        APP._quoteSelectedColors.map(c => '<span style="display:inline-block;width:18px;height:18px;border-radius:4px;background:' + c + ';border:1px solid var(--border);vertical-align:middle;"></span>').join('') +
        (APP._quoteSelectedColors.length > 1 ? '<span style="font-size:0.78rem;color:var(--gold);">+' + ((APP._quoteSelectedColors.length - 1) * surcharge) + '% multicolor</span>' : '') +
        '</div>';
    } else {
      infoEl.innerHTML = '<span style="font-size:0.82rem;color:var(--text3);">Ningún color seleccionado</span>';
    }
  }
  updateQuote();
}

// Keep legacy function for compatibility
function selectQuoteColor(color, el) {
  toggleQuoteColor(color, el);
}

function toggleOtherPLA() {
  const mat = document.getElementById('quoteMaterial')?.value;
  const group = document.getElementById('otherPLAGroup');
  if (group) group.style.display = mat === 'Otros PLA' ? 'block' : 'none';
}

function updateQuote() {
  const w = parseFloat(document.getElementById('quoteW')?.value||0);
  const h = parseFloat(document.getElementById('quoteH')?.value||0);
  const d = parseFloat(document.getElementById('quoteD')?.value||0);
  const mat = document.getElementById('quoteMaterial')?.value||'PLA';
  const el = document.getElementById('quotePrice');
  const breakdownEl = document.getElementById('quotePriceBreakdown');

  if (mat === 'Otros PLA') {
    if (el) el.textContent = (w && h && d) ? 'Consultar' : '0.00€';
    if (breakdownEl) breakdownEl.textContent = '';
    return;
  }

  let basePrice = parseFloat(calcPrice(w, h, d, mat));
  const numColors = (APP._quoteSelectedColors || []).length;
  const surcharge = APP.adminSettings.multiColorSurcharge || 15;
  const extraColors = Math.max(0, numColors - 1);
  const isGlow = document.getElementById('quoteGlow')?.checked || false;
  const glowSurcharge = APP.adminSettings.glowInDarkSurcharge || 25;
  let finalPrice = basePrice;
  let breakdown = '';

  if (extraColors > 0 && basePrice > 0) {
    finalPrice = basePrice * (1 + extraColors * surcharge / 100);
    breakdown = 'Base: ' + basePrice.toFixed(2) + '€ + Multicolor (' + numColors + ' colores, +' + (extraColors * surcharge) + '%): ' + (finalPrice - basePrice).toFixed(2) + '€';
  }

  if (isGlow && finalPrice > 0) {
    const glowExtra = finalPrice * glowSurcharge / 100;
    finalPrice += glowExtra;
    breakdown += (breakdown ? ' + ' : 'Base: ' + basePrice.toFixed(2) + '€ + ') + 'Fosforescente (+' + glowSurcharge + '%): ' + glowExtra.toFixed(2) + '€';
  }

  if (el) el.textContent = finalPrice.toFixed(2) + '€';
  if (breakdownEl) breakdownEl.textContent = breakdown;

  // Stock indicator — always visible
  _updateQuoteStockLive();
}

function submitQuote() {
  if (!APP.user) { navigateTo('auth'); showToast('Inicia sesión para solicitar presupuesto'); return; }
  const w = parseFloat(document.getElementById('quoteW')?.value||0);
  const h = parseFloat(document.getElementById('quoteH')?.value||0);
  const d = parseFloat(document.getElementById('quoteD')?.value||0);
  const mat = document.getElementById('quoteMaterial')?.value||'PLA';
  const model = document.getElementById('quoteModel')?.value||'custom';
  const desc = document.getElementById('quoteDesc')?.value||'';
  const otherPLA = document.getElementById('quoteOtherPLA')?.value||'';
  const colors = APP._quoteSelectedColors ? [...APP._quoteSelectedColors] : [];

  // Calculate price with multicolor surcharge and glow
  let price;
  const isGlow = document.getElementById('quoteGlow')?.checked || false;
  if (mat === 'Otros PLA') {
    price = 'Consultar';
  } else {
    let basePrice = parseFloat(calcPrice(w, h, d, mat));
    const extraColors = Math.max(0, colors.length - 1);
    const surcharge = APP.adminSettings.multiColorSurcharge || 15;
    if (extraColors > 0 && basePrice > 0) {
      basePrice = basePrice * (1 + extraColors * surcharge / 100);
    }
    if (isGlow && basePrice > 0) {
      basePrice = basePrice * (1 + (APP.adminSettings.glowInDarkSurcharge || 25) / 100);
    }
    price = basePrice.toFixed(2);
  }
  const quote = {
    id: 'PRE-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    user: APP.user.email,
    model, material: mat === 'Otros PLA' ? 'Otros PLA: ' + otherPLA : mat,
    dimensions: { w, h, d },
    description: desc,
    colors: colors,
    glowInDark: isGlow,
    total: price,
    status: 'pending',
    invoiceId: null
  };
  APP.quotes.push(quote);
  APP._quoteSelectedColors = [];
  showToast('Presupuesto enviado correctamente: ' + quote.id);
  navigateTo('dashboard');
}

// ===== AUTH PAGE =====
function renderAuth() {
  document.getElementById('page-auth').innerHTML = `
    <div class="auth-section">
      <div class="auth-card">
        <h2 id="authTitle">ACCEDER</h2>
        <p class="auth-subtitle" id="authSubtitle">Inicia sesión en tu cuenta</p>
        <div id="authForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" id="authEmail" placeholder="tu@email.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" class="form-input" id="authPassword" placeholder="••••••••">
          </div>
          <div id="authNameGroup" class="form-group" style="display:none;">
            <label>Nombre</label>
            <input type="text" class="form-input" id="authName" placeholder="Tu nombre">
          </div>
          <button class="btn btn-primary" style="width:100%;" id="authSubmit" onclick="handleAuth()">Iniciar Sesión</button>
        </div>
        <div class="auth-toggle">
          <span id="authToggleText">¿No tienes cuenta?</span>
          <a onclick="toggleAuthMode()"> <span id="authToggleLink">Crear cuenta</span></a>
        </div>
      </div>
    </div>
  `;
}

let authMode = 'login';
function toggleAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  document.getElementById('authTitle').textContent = authMode === 'login' ? 'ACCEDER' : 'CREAR CUENTA';
  document.getElementById('authSubtitle').textContent = authMode === 'login' ? 'Inicia sesión en tu cuenta' : 'Regístrate para comenzar';
  document.getElementById('authNameGroup').style.display = authMode === 'register' ? 'block' : 'none';
  document.getElementById('authSubmit').textContent = authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta';
  document.getElementById('authToggleText').textContent = authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
  document.getElementById('authToggleLink').textContent = authMode === 'login' ? 'Crear cuenta' : 'Iniciar sesión';
}

function handleAuth() {
  const email = document.getElementById('authEmail').value.trim();
  const pass = document.getElementById('authPassword').value;
  const name = document.getElementById('authName')?.value?.trim() || '';

  if (!email || !pass) { showToast('Completa todos los campos'); return; }
  if (APP.bannedEmails.includes(email)) { showToast('Esta cuenta ha sido suspendida permanentemente'); return; }

  const isAdmin = email === 'manuguada19@gmail.com';

  APP.user = {
    email, name: name || email.split('@')[0],
    isAdmin,
    phone: '',
    address: '',
    city: 'Guadalajara',
    joinDate: new Date().toLocaleDateString('es-ES')
  };

  showToast(`Bienvenido${isAdmin ? ' Administrador' : ''}, ${APP.user.name}`);
  navigateTo(isAdmin ? 'admin' : 'dashboard');
}

// ===== DASHBOARD =====
function renderDashboard() {
  if (!APP.user) return;
  const userOrders = APP.orders.filter(o=>o.user===APP.user.email);
  const userDesigns = APP.designs.filter(d=>d.user===APP.user.email);
  const userQuotes = APP.quotes.filter(q=>q.user===APP.user.email);
  const userInvoices = APP.invoices.filter(inv=>inv.user===APP.user.email);

  document.getElementById('page-dashboard').innerHTML = `
    <div class="container dashboard-section">
      <div class="dashboard-header">
        <div>
          <h2>MI <span style="color:var(--cyan)">CUENTA</span></h2>
          <p style="color:var(--text2);margin-top:4px;">${APP.user.email}</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-small" onclick="navigateTo('editor')">✦ Nuevo Diseño</button>
          <button class="btn btn-danger btn-small" onclick="logout()">Cerrar Sesión</button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value">${userOrders.length}</div>
          <div class="stat-label">PEDIDOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${userDesigns.length}</div>
          <div class="stat-label">DISEÑOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${userQuotes.length}</div>
          <div class="stat-label">PRESUPUESTOS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${userInvoices.length}</div>
          <div class="stat-label">FACTURAS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${userOrders.reduce((s,o)=>s+parseFloat(o.total),0).toFixed(0)}€</div>
          <div class="stat-label">TOTAL GASTADO</div>
        </div>
      </div>

      <div class="dashboard-tabs">
        <button class="dash-tab active" onclick="showDashTab('orders',this)">Pedidos</button>
        <button class="dash-tab" onclick="showDashTab('tracking',this)">Seguimiento</button>
        <button class="dash-tab" onclick="showDashTab('designs',this)">Mis Diseños</button>
        <button class="dash-tab" onclick="showDashTab('quotes',this)">Presupuestos</button>
        <button class="dash-tab" onclick="showDashTab('invoices',this)">Facturas</button>
        <button class="dash-tab" onclick="showDashTab('savedforlater',this)">Guardados</button>
        <button class="dash-tab" onclick="showDashTab('profile',this)">Mis Datos</button>
      </div>

      <div class="dash-content" id="dashContent">
        ${renderDashOrders(userOrders)}
      </div>
    </div>
  `;
}

function showDashTab(tab, btn) {
  document.querySelectorAll('.dash-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('dashContent');
  const userOrders = APP.orders.filter(o=>o.user===APP.user.email);
  const userDesigns = APP.designs.filter(d=>d.user===APP.user.email);
  const userQuotes = APP.quotes.filter(q=>q.user===APP.user.email);
  const userInvoices = APP.invoices.filter(inv=>inv.user===APP.user.email);

  if (tab==='orders') content.innerHTML = renderDashOrders(userOrders);
  else if (tab==='tracking') content.innerHTML = renderDashTracking(userOrders);
  else if (tab==='designs') content.innerHTML = renderDashDesigns(userDesigns);
  else if (tab==='quotes') content.innerHTML = renderDashQuotes(userQuotes);
  else if (tab==='invoices') content.innerHTML = renderDashInvoicesNew(userInvoices);
  else if (tab==='savedforlater') content.innerHTML = renderDashSavedForLater();
  else if (tab==='profile') content.innerHTML = renderDashProfile();
}

function renderDashOrders(orders) {
  if (!orders.length) return `<div style="text-align:center;padding:40px;color:var(--text3);">No tienes pedidos aún. <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo('shop')">Ir a la tienda</a></div>`;
  const statusMap = { pending:'Pendiente', processing:'Procesando', shipped:'Enviado', completed:'Completado', cancelled:'Cancelado' };
  const statusClass = { pending:'status-pending', processing:'status-pending', shipped:'status-shipped', completed:'status-completed', cancelled:'status-cancelled' };
  return `<div class="table-responsive"><table class="data-table">
    <thead><tr><th>ID</th><th>FECHA</th><th>TOTAL</th><th>ESTADO</th><th>SEGUIMIENTO</th></tr></thead>
    <tbody>${orders.map(o=>`<tr>
      <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.8rem;">${o.id}</td>
      <td>${o.date}</td>
      <td style="font-family:var(--font-display);">${o.total}€</td>
      <td><span class="status-badge ${statusClass[o.status]||'status-pending'}">${statusMap[o.status]||o.status}</span></td>
      <td><button class="btn btn-secondary btn-small" onclick="showToast('Pedido ${o.id}: ${statusMap[o.status]||o.status}')">Ver Estado</button></td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

function renderDashTracking(orders) {
  const shippedOrders = orders.filter(o => o.status === 'shipped' && o.trackingNumber);
  const carrierUrls = {
    GLS: 'https://www.gls-spain.es/es/ayuda/seguimiento-de-envios/?match=',
    UPS: 'https://www.ups.com/track?tracknum=',
    SEUR: 'https://www.seur.com/livetracking/pages/seguimiento-online-498.do?segession.cp.segund498.txtlocalizador='
  };

  return `
    <div style="margin-bottom:28px;">
      <h4 style="font-family:var(--font-display);font-size:0.9rem;letter-spacing:1px;margin-bottom:16px;">SEGUIMIENTO DE ENVÍOS</h4>

      <!-- Search by tracking number -->
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:24px;">
        <p style="color:var(--text2);font-size:0.9rem;margin-bottom:16px;">Busca el estado de tu envío introduciendo el número de seguimiento y seleccionando el transportista.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
          <div class="form-group" style="flex:1;min-width:200px;margin-bottom:0;">
            <label>Número de seguimiento</label>
            <input type="text" class="form-input" id="trackingInput" placeholder="Ej: 1Z999AA10123456784">
          </div>
          <div class="form-group" style="min-width:140px;margin-bottom:0;">
            <label>Transportista</label>
            <select class="form-select" id="trackingCarrier">
              <option value="GLS">GLS</option>
              <option value="UPS">UPS</option>
              <option value="SEUR">SEUR</option>
            </select>
          </div>
          <button class="btn btn-primary btn-small" onclick="trackShipment()" style="height:44px;">Rastrear Envío</button>
        </div>
        <div id="trackingResult" style="margin-top:16px;display:none;"></div>
      </div>

      ${shippedOrders.length > 0 ? `
        <!-- Orders with tracking -->
        <h4 style="font-family:var(--font-display);font-size:0.8rem;letter-spacing:1px;color:var(--text3);margin-bottom:12px;">ENVÍOS EN CURSO</h4>
        <div class="table-responsive"><table class="data-table">
          <thead><tr><th>PEDIDO</th><th>FECHA</th><th>TRANSPORTISTA</th><th>Nº SEGUIMIENTO</th><th>ACCIÓN</th></tr></thead>
          <tbody>${shippedOrders.map(o => `<tr>
            <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${o.id}</td>
            <td>${o.date}</td>
            <td><span style="font-family:var(--font-display);font-size:0.78rem;">${o.carrier||'—'}</span></td>
            <td style="font-size:0.85rem;">${o.trackingNumber||'—'}</td>
            <td>
              ${o.trackingNumber && o.carrier ? `
                <button class="btn btn-primary btn-small" onclick="openTrackingUrl('${o.carrier}','${o.trackingNumber}')">Rastrear</button>
              ` : '<span style="color:var(--text3);font-size:0.8rem;">Sin datos</span>'}
            </td>
          </tr>`).join('')}</tbody>
        </table></div>
      ` : `
        <div style="text-align:center;padding:32px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);">
          <p style="font-size:2rem;margin-bottom:10px;">📦</p>
          <p style="color:var(--text2);font-size:0.92rem;margin-bottom:6px;">No tienes envíos en curso</p>
          <p style="color:var(--text3);font-size:0.82rem;">Cuando un pedido sea enviado con número de seguimiento, aparecerá aquí. Puedes buscar manualmente por número de seguimiento y transportista arriba.</p>
        </div>
      `}
    </div>
  `;
}

function trackShipment() {
  const num = document.getElementById('trackingInput')?.value?.trim();
  const carrier = document.getElementById('trackingCarrier')?.value;
  const resultDiv = document.getElementById('trackingResult');
  if (!num) { showToast('Introduce un número de seguimiento'); return; }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div style="padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:40px;height:40px;border-radius:10px;background:var(--cyan-glow);border:1px solid rgba(0,240,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.1rem;">📦</div>
        <div>
          <p style="font-family:var(--font-display);font-size:0.82rem;color:var(--cyan);">${carrier}</p>
          <p style="font-size:0.88rem;">Seguimiento: <strong>${num}</strong></p>
        </div>
      </div>
      <p style="color:var(--text2);font-size:0.85rem;margin-bottom:12px;">Haz clic en el botón para ver el estado del envío en la web oficial del transportista:</p>
      <button class="btn btn-primary btn-small" onclick="openTrackingUrl('${carrier}','${num}')">Abrir Seguimiento en ${carrier}</button>
    </div>
  `;
}

function openTrackingUrl(carrier, num) {
  const urls = {
    GLS: 'https://www.gls-spain.es/es/ayuda/seguimiento-de-envios/?match=' + num,
    UPS: 'https://www.ups.com/track?tracknum=' + num,
    SEUR: 'https://www.seur.com/livetracking/pages/seguimiento-online-498.do?segession.cp.segund498.txtlocalizador=' + num
  };
  const url = urls[carrier];
  if (url) {
    window.open(url, '_blank');
  } else {
    showToast('Transportista no reconocido');
  }
}

function renderDashDesigns(designs) {
  if (!designs.length) return `<div style="text-align:center;padding:40px;color:var(--text3);">No tienes diseños guardados. <a style="color:var(--cyan);cursor:pointer;" onclick="navigateTo('editor')">Crear uno</a></div>`;
  return `<div class="designs-grid">${designs.map((d,i)=>`
    <div class="design-card">
      <div class="design-card-preview">Vista previa del diseño</div>
      <div class="design-card-info">
        <h4>${d.name}</h4>
        <p>${d.date} · ${d.material}</p>
        <div class="design-card-actions">
          <button class="btn btn-secondary btn-small" onclick="navigateTo('editor')">Editar</button>
          <button class="btn btn-primary btn-small" onclick="submitDesignOrder(${i})">Imprimir</button>
        </div>
      </div>
    </div>
  `).join('')}</div>`;
}

function renderDashInvoices(orders) {
  // Legacy function kept for compatibility
  return renderDashInvoicesNew(APP.invoices.filter(inv=>inv.user===APP.user?.email));
}

function renderDashQuotes(quotes) {
  const quoteStatusMap = { pending:'Pendiente', approved:'Aprobado', rejected:'Rechazado', invoiced:'Facturado' };
  const quoteStatusClass = { pending:'status-pending', approved:'status-completed', rejected:'status-cancelled', invoiced:'status-shipped' };
  const modelMap = { figurine:'Figura', functional:'Pieza Funcional', prototype:'Prototipo', decorative:'Decoración', mechanical:'Mecánica', custom:'Personalizado' };

  if (!quotes.length) return `
    <div style="text-align:center;padding:40px;">
      <p style="font-size:2.5rem;margin-bottom:12px;">📋</p>
      <p style="color:var(--text3);margin-bottom:16px;">No tienes presupuestos aún</p>
      <button class="btn btn-primary btn-small" onclick="navigateTo('quote')">Solicitar Presupuesto</button>
    </div>`;

  return `
    <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <p style="color:var(--text2);font-size:0.88rem;">${quotes.length} presupuesto(s) en total</p>
      <button class="btn btn-primary btn-small" onclick="navigateTo('quote')">+ Nuevo Presupuesto</button>
    </div>
    <div class="table-responsive"><table class="data-table">
      <thead><tr>
        <th>ID</th><th>FECHA</th><th>MODELO</th><th>MATERIAL</th><th>DIMENSIONES</th><th>TOTAL</th><th>ESTADO</th><th>FACTURA</th><th>ACCIONES</th>
      </tr></thead>
      <tbody>${quotes.map((q,qi)=>{
        const globalIdx = APP.quotes.indexOf(q);
        return `<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${q.id}</td>
        <td>${q.date}</td>
        <td>${modelMap[q.model]||q.model}</td>
        <td><span style="color:var(--cyan);font-family:var(--font-display);font-size:0.78rem;">${q.material}</span></td>
        <td style="font-size:0.82rem;">${q.dimensions.w}x${q.dimensions.h}x${q.dimensions.d}mm</td>
        <td style="font-family:var(--font-display);">${q.total}€</td>
        <td><span class="status-badge ${quoteStatusClass[q.status]||'status-pending'}">${quoteStatusMap[q.status]||q.status}</span>${q.clientConfirmedDate ? '<br><span style="font-size:0.68rem;color:var(--text3);">'+q.clientConfirmedDate+'</span>' : ''}</td>
        <td>${q.invoiceId
          ? `<a style="color:var(--cyan);cursor:pointer;font-family:var(--font-display);font-size:0.78rem;" onclick="showDashTab('invoices',document.querySelectorAll('.dash-tab')[3])">${q.invoiceId}</a>`
          : '<span style="color:var(--text3);font-size:0.8rem;">—</span>'
        }</td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${q.status==='pending' ? `<button class="btn btn-primary btn-small" onclick="clientConfirmQuote(${globalIdx})">Confirmar</button><button class="btn btn-danger btn-small" onclick="clientRejectQuote(${globalIdx})">Rechazar</button>` : ''}
          </div>
        </td>
      </tr>`}).join('')}</tbody>
    </table></div>
    <div style="margin-top:16px;padding:14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);">
      <p style="font-size:0.78rem;color:var(--text3);">
        <span style="color:var(--cyan);">●</span> Pendiente: en revisión &nbsp;
        <span style="color:var(--success);">●</span> Aprobado: listo para facturar &nbsp;
        <span style="color:var(--cyan2);">●</span> Facturado: convertido en factura &nbsp;
        <span style="color:var(--danger);">●</span> Rechazado
      </p>
    </div>`;
}

function clientConfirmQuote(idx) {
  APP.quotes[idx].status = 'approved';
  APP.quotes[idx].clientConfirmedDate = new Date().toLocaleDateString('es-ES');
  simulateEmail(APP.adminSettings.adminEmail, 'newQuote', { nombre: 'Admin', id: APP.quotes[idx].id, email: APP.quotes[idx].user });
  showToast('Presupuesto confirmado. El equipo procederá con tu pedido.');
  renderDashboard();
}

function clientRejectQuote(idx) {
  APP.quotes[idx].status = 'rejected';
  simulateEmail(APP.adminSettings.adminEmail, 'newQuote', { nombre: 'Admin', id: APP.quotes[idx].id, email: APP.quotes[idx].user });
  showToast('Presupuesto rechazado.');
  renderDashboard();
}

function renderDashInvoicesNew(invoices) {
  const invStatusMap = { pending:'Pendiente de pago', paid:'Pagada', overdue:'Vencida', cancelled:'Anulada' };
  const invStatusClass = { pending:'status-pending', paid:'status-completed', overdue:'status-cancelled', cancelled:'status-cancelled' };

  if (!invoices.length) return `
    <div style="text-align:center;padding:40px;">
      <p style="font-size:2.5rem;margin-bottom:12px;">🧾</p>
      <p style="color:var(--text3);">No tienes facturas disponibles</p>
      <p style="color:var(--text3);font-size:0.82rem;margin-top:8px;">Las facturas se generan cuando un presupuesto es aprobado y facturado.</p>
    </div>`;

  return `
    <div style="margin-bottom:16px;">
      <p style="color:var(--text2);font-size:0.88rem;">${invoices.length} factura(s) en total — Total facturado: <span style="color:var(--cyan);font-family:var(--font-display);">${invoices.reduce((s,inv)=>s+parseFloat(inv.total),0).toFixed(2)}€</span></p>
    </div>
    <div class="table-responsive"><table class="data-table">
      <thead><tr>
        <th>FACTURA</th><th>FECHA</th><th>PRESUPUESTO</th><th>MATERIAL</th><th>DESCRIPCIÓN</th><th>TOTAL</th><th>ESTADO</th><th>ACCIÓN</th>
      </tr></thead>
      <tbody>${invoices.map(inv=>`<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${inv.id}</td>
        <td>${inv.date}</td>
        <td style="font-family:var(--font-display);font-size:0.78rem;">${inv.quoteId||'—'}</td>
        <td>${inv.material||'—'}</td>
        <td style="font-size:0.82rem;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${inv.description||'Impresión 3D'}</td>
        <td style="font-family:var(--font-display);">${inv.total}€</td>
        <td><span class="status-badge ${invStatusClass[inv.status]||'status-pending'}">${invStatusMap[inv.status]||inv.status}</span></td>
        <td><button class="btn btn-secondary btn-small" onclick="showToast('Descargando factura ${inv.id}...')">PDF</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

function renderDashProfile() {
  const u = APP.user;
  return `
    <div style="max-width:600px;">
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:32px;padding:24px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);">
        <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--magenta));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-family:var(--font-display);color:var(--bg);flex-shrink:0;">
          ${u.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style="font-family:var(--font-heading);font-size:1.3rem;">${u.name}</h3>
          <p style="color:var(--text2);font-size:0.88rem;">${u.email}</p>
          <p style="color:var(--text3);font-size:0.78rem;">Miembro desde: ${u.joinDate}</p>
        </div>
      </div>

      <h4 style="font-family:var(--font-display);font-size:0.85rem;letter-spacing:1px;color:var(--cyan);margin-bottom:16px;">DATOS PERSONALES</h4>
      <div class="form-group">
        <label>Nombre completo</label>
        <input type="text" class="form-input" id="profileName" value="${u.name}">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-input" value="${u.email}" disabled style="opacity:0.6;">
        <p style="font-size:0.72rem;color:var(--text3);margin-top:4px;">El email no se puede modificar</p>
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="tel" class="form-input" id="profilePhone" value="${u.phone||''}" placeholder="+34 600 000 000">
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" class="form-input" id="profileAddress" value="${u.address||''}" placeholder="Calle, número, piso...">
      </div>
      <div class="form-group">
        <label>Ciudad</label>
        <input type="text" class="form-input" id="profileCity" value="${u.city||'Guadalajara'}" placeholder="Ciudad">
      </div>

      <div style="display:flex;gap:12px;margin-top:24px;">
        <button class="btn btn-primary" onclick="saveProfile()">Guardar Cambios</button>
        <button class="btn btn-secondary" onclick="showToast('Cambiar contraseña: funcionalidad próximamente')">Cambiar Contraseña</button>
      </div>
    </div>`;
}

function saveProfile() {
  APP.user.name = document.getElementById('profileName')?.value || APP.user.name;
  APP.user.phone = document.getElementById('profilePhone')?.value || '';
  APP.user.address = document.getElementById('profileAddress')?.value || '';
  APP.user.city = document.getElementById('profileCity')?.value || '';
  showToast('Datos personales actualizados correctamente');
  updateNav();
}

function submitDesignOrder(i) {
  showToast('Solicitud de impresión enviada');
}

function logout() {
  checkAbandonedCart();
  APP.user = null;
  authMode = 'login';
  showToast('Sesión cerrada');
  navigateTo('home');
}

// ===== ADMIN PAGE =====
function renderAdmin() {
  if (!APP.user?.isAdmin) return;
  document.getElementById('page-admin').innerHTML = `
    <div class="container dashboard-section">
      <div class="dashboard-header">
        <h2>PANEL DE <span style="color:var(--cyan)">ADMINISTRACIÓN</span></h2>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-small" onclick="navigateTo('home')">Ver Sitio</button>
          <button class="btn btn-danger btn-small" onclick="logout()">Cerrar Sesión</button>
        </div>
      </div>
      <div class="admin-layout">
        <div class="admin-sidebar">
          <h3>MENÚ ADMIN</h3>
          <button class="admin-nav-btn active" onclick="showAdminSection('orders',this)">📦 Pedidos</button>
          <button class="admin-nav-btn" onclick="showAdminSection('neworder',this)">➕ Nuevo Pedido</button>
          <button class="admin-nav-btn" onclick="showAdminSection('quotesmgmt',this)">📋 Presupuestos</button>
          <button class="admin-nav-btn" onclick="showAdminSection('invoicesmgmt',this)">🧾 Facturas</button>
          <button class="admin-nav-btn" onclick="showAdminSection('tracking',this)">🚚 Seguimiento</button>
          <button class="admin-nav-btn" onclick="showAdminSection('colors',this)">🎨 Colores</button>
          <button class="admin-nav-btn" onclick="showAdminSection('shopmgmt',this)">🛍️ Tienda</button>
          <button class="admin-nav-btn" onclick="showAdminSection('users',this)">👥 Usuarios</button>
          <button class="admin-nav-btn" onclick="showAdminSection('ticketsmgmt',this)">🎫 Tickets</button>
          <button class="admin-nav-btn" onclick="showAdminSection('chatbot',this)">🤖 Chat Bot</button>
          <button class="admin-nav-btn" onclick="showAdminSection('stock',this)">📦 Inventario PLA</button>
          <button class="admin-nav-btn" onclick="showAdminSection('paymentgateway',this)">💳 Pasarela de Pago</button>
          <button class="admin-nav-btn" onclick="showAdminSection('emailtemplates',this)">📧 Plantillas Email</button>
          <button class="admin-nav-btn" onclick="showAdminSection('settings',this)">⚙️ Configuración</button>
        </div>
        <div class="admin-content" id="adminContent">
          ${renderAdminOrders()}
        </div>
      </div>
    </div>
  `;
}

function showAdminSection(section, btn) {
  document.querySelectorAll('.admin-nav-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const el = document.getElementById('adminContent');
  if (section==='orders') el.innerHTML = renderAdminOrders();
  else if (section==='neworder') el.innerHTML = renderAdminNewOrder();
  else if (section==='quotesmgmt') el.innerHTML = renderAdminQuotesMgmt();
  else if (section==='invoicesmgmt') el.innerHTML = renderAdminInvoicesMgmt();
  else if (section==='tracking') el.innerHTML = renderAdminTracking();
  else if (section==='colors') el.innerHTML = renderAdminColors();
  else if (section==='shopmgmt') el.innerHTML = renderAdminShop();
  else if (section==='users') el.innerHTML = renderAdminUsers();
  else if (section==='ticketsmgmt') el.innerHTML = renderAdminTickets();
  else if (section==='chatbot') el.innerHTML = renderAdminChatbot();
  else if (section==='stock') el.innerHTML = renderAdminStock();
  else if (section==='emailtemplates') el.innerHTML = renderAdminEmailTemplates();
  else if (section==='paymentgateway') renderAdminPaymentGateway();
  else if (section==='settings') el.innerHTML = renderAdminSettings();
}

function renderAdminOrders() {
  const payMethodIcons = { card:'💳', transfer:'🏦', bizum:'📱', crypto:'🌐', direct:'📋' };
  return `
    <h3>GESTIÓN DE PEDIDOS</h3>
    <div style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary btn-small" onclick="showAdminSection('neworder',document.querySelectorAll('.admin-nav-btn')[1])">+ Crear Pedido Manual</button>
      <button class="btn btn-secondary btn-small" onclick="adminOpenEditorOrder()">✦ Crear desde Editor 3D</button>
      <button class="btn btn-secondary btn-small" onclick="adminAbandonedCarts()" style="background:rgba(255,165,0,0.15);border-color:rgba(255,165,0,0.4);color:#FFA500;">🛒 Carritos Abandonados</button>
    </div>
    ${APP.orders.length===0 ? '<p style="color:var(--text3);">No hay pedidos</p>' : `
    <div class="table-responsive"><table class="data-table">
      <thead><tr><th>ID</th><th>USUARIO</th><th>FECHA</th><th>MATERIAL</th><th>COLOR</th><th>TOTAL</th><th>PAGO</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
      <tbody>${APP.orders.map((o,i)=>{
        const pmIcon = payMethodIcons[o.paymentMethod] || '—';
        const pmLabel = o.paymentMethodLabel || '—';
        const isPendingPay = o.paymentStatus === 'pending' || o.status === 'awaiting_payment';
        return `<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${o.id}</td>
        <td style="font-size:0.82rem;">${o.user}</td>
        <td>${o.date}</td>
        <td><span style="font-family:var(--font-display);font-size:0.75rem;">${o.material||'—'}</span></td>
        <td>${(o.colors && o.colors.length > 0) ? o.colors.map(c=>'<span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:'+c+';vertical-align:middle;border:1px solid var(--border);margin-right:2px;"></span>').join('') : (o.color ? '<span style="display:inline-block;width:18px;height:18px;border-radius:4px;background:'+o.color+';vertical-align:middle;border:1px solid var(--border);"></span>' : '—')}</td>
        <td style="font-family:var(--font-display);">${o.total}€</td>
        <td style="font-size:0.75rem;white-space:nowrap;"><span title="${pmLabel}">${pmIcon}</span> <span class="status-badge ${isPendingPay?'status-pending':'status-completed'}" style="font-size:0.62rem;">${isPendingPay?'Pendiente':'Pagado'}</span></td>
        <td>
          <select class="form-select" style="width:auto;padding:4px 8px;font-size:0.78rem;" onchange="updateOrderStatus(${i},this.value)">
            <option value="awaiting_payment" ${o.status==='awaiting_payment'?'selected':''}>Esperando Pago</option>
            <option value="pending" ${o.status==='pending'?'selected':''}>Pendiente</option>
            <option value="processing" ${o.status==='processing'?'selected':''}>Procesando</option>
            <option value="shipped" ${o.status==='shipped'?'selected':''}>Enviado</option>
            <option value="completed" ${o.status==='completed'?'selected':''}>Completado</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelado</option>
          </select>
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${isPendingPay ? '<button class="btn btn-primary btn-small" onclick="adminConfirmPayment('+i+')" style="background:var(--success);border-color:var(--success);">Confirmar Pago</button>' : ''}
            <button class="btn btn-secondary btn-small" onclick="editOrderFull(${i})">Editar</button>
            <button class="btn btn-danger btn-small" onclick="deleteOrder(${i})">Eliminar</button>
          </div>
        </td>
      </tr>`}).join('')}</tbody>
    </table></div>`}
  `;
}

// ===== ABANDONED CARTS MODULE =====
function adminAbandonedCarts() {
  // Load from localStorage if any
  if (!APP.abandonedCarts) APP.abandonedCarts = [];
  try {
    const stored = localStorage.getItem('3dguadalajara_abandoned_cart');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.email && data.cart && data.cart.length > 0) {
        const exists = APP.abandonedCarts.find(ac => ac.email === data.email && ac.status === 'abandoned');
        if (!exists) {
          const items = data.cart.map(ci => {
            const p = APP.products.find(x => x.id === ci.productId);
            return { productId: ci.productId, name: p ? p.name : 'Producto', material: ci.material || 'PLA', qty: ci.qty || 1, price: ci.price || (p ? p.price : 0) };
          });
          APP.abandonedCarts.push({ email: data.email, userName: data.email, items: items, timestamp: new Date(data.time).toISOString(), status: 'abandoned' });
        }
      }
    }
  } catch(e) {}
  // Also check current registered users with active carts
  if (APP.registeredUsers) {
    APP.registeredUsers.forEach(u => {
      if (APP.user && APP.user.email === u.email && APP.cart.length > 0) {
        const exists = APP.abandonedCarts.find(ac => ac.email === u.email && ac.status === 'abandoned');
        if (!exists) {
          _storeAbandonedCart(u.email, u.name || u.email, APP.cart);
        }
      }
    });
  }
  _renderAbandonedCartsPanel();
}

function _renderAbandonedCartsPanel() {
  const el = document.getElementById('adminContent');
  const carts = (APP.abandonedCarts || []).filter(ac => ac.status === 'abandoned');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">🛒 CARRITOS ABANDONADOS</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('orders',document.querySelectorAll('.admin-nav-btn')[0])">Volver a Pedidos</button>
    </div>
    ${carts.length === 0 ? '<p style="color:var(--text3);">No hay carritos abandonados registrados.</p>' : carts.map((ac, idx) => `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          <div>
            <strong style="color:var(--cyan);">${ac.userName || ac.email}</strong>
            <span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">${ac.email}</span>
            <span style="color:var(--text3);font-size:0.72rem;margin-left:12px;">Fecha: ${new Date(ac.timestamp).toLocaleString('es-ES')}</span>
          </div>
          <span class="status-badge status-pending">Abandonado</span>
        </div>
        <div class="table-responsive"><table class="data-table" style="margin-bottom:12px;">
          <thead><tr><th>PRODUCTO</th><th>MATERIAL</th><th>CANTIDAD</th><th>PRECIO</th><th>SUBTOTAL</th></tr></thead>
          <tbody>${ac.items.map((item, iIdx) => `<tr>
            <td style="font-size:0.82rem;">${item.name}</td>
            <td style="font-size:0.82rem;">${item.material}</td>
            <td style="font-size:0.82rem;">${item.qty}</td>
            <td style="font-family:var(--font-display);font-size:0.82rem;">${parseFloat(item.price||0).toFixed(2)}€</td>
            <td style="font-family:var(--font-display);font-size:0.82rem;">${(parseFloat(item.price||0) * (item.qty||1)).toFixed(2)}€</td>
          </tr>`).join('')}</tbody>
        </table></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary btn-small" onclick="adminAbandonedCartToOrder(${idx})">Añadir al Pedido</button>
          <button class="btn btn-secondary btn-small" onclick="adminModifyAbandonedCart(${idx})">Modificar</button>
          <button class="btn btn-danger btn-small" onclick="adminDiscardAbandonedCart(${idx})">Descartar</button>
        </div>
      </div>
    `).join('')}
  `;
}

function adminModifyAbandonedCart(idx) {
  const ac = APP.abandonedCarts[idx];
  if (!ac) return;
  const el = document.getElementById('adminContent');
  const allMats = {...APP.materials, ...APP.specialMaterials, ...APP.technicalMaterials};
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">MODIFICAR CARRITO — ${ac.userName || ac.email}</h3>
      <button class="btn btn-secondary btn-small" onclick="_renderAbandonedCartsPanel()">Volver</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;max-width:800px;">
      ${ac.items.map((item, i) => `
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;align-items:end;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
          <div><label style="font-size:0.72rem;color:var(--text3);">Producto</label><input type="text" class="form-input" id="acItem_name_${i}" value="${item.name}"></div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Material</label>
            <select class="form-select" id="acItem_mat_${i}">${Object.keys(allMats).map(k => '<option value="'+k+'" '+(k===item.material?'selected':'')+'>'+k+'</option>').join('')}</select>
          </div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Cantidad</label><input type="number" class="form-input" id="acItem_qty_${i}" value="${item.qty}" min="1"></div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Precio (€)</label><input type="number" class="form-input" id="acItem_price_${i}" value="${item.price}" step="0.01" min="0"></div>
        </div>
      `).join('')}
      <button class="btn btn-primary" onclick="adminSaveModifiedAbandonedCart(${idx})">Guardar Cambios</button>
    </div>
  `;
}

function adminSaveModifiedAbandonedCart(idx) {
  const ac = APP.abandonedCarts[idx];
  if (!ac) return;
  ac.items.forEach((item, i) => {
    const nameEl = document.getElementById('acItem_name_' + i);
    const matEl = document.getElementById('acItem_mat_' + i);
    const qtyEl = document.getElementById('acItem_qty_' + i);
    const priceEl = document.getElementById('acItem_price_' + i);
    if (nameEl) item.name = nameEl.value;
    if (matEl) item.material = matEl.value;
    if (qtyEl) item.qty = parseInt(qtyEl.value) || 1;
    if (priceEl) item.price = parseFloat(priceEl.value) || 0;
  });
  showToast('Carrito abandonado modificado');
  _renderAbandonedCartsPanel();
}

function adminDiscardAbandonedCart(idx) {
  const ac = APP.abandonedCarts[idx];
  if (!ac) return;
  ac.status = 'discarded';
  showToast('Carrito descartado');
  _renderAbandonedCartsPanel();
}

function adminAbandonedCartToOrder(idx) {
  const ac = APP.abandonedCarts[idx];
  if (!ac) return;
  const allMats = {...APP.materials, ...APP.specialMaterials, ...APP.technicalMaterials};
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CREAR PEDIDO DESDE CARRITO — ${ac.userName || ac.email}</h3>
      <button class="btn btn-secondary btn-small" onclick="_renderAbandonedCartsPanel()">Volver</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;max-width:900px;">
      <div style="margin-bottom:16px;padding:12px;background:var(--surface);border-radius:var(--radius);">
        <span style="font-size:0.85rem;color:var(--text2);">Cliente: </span>
        <strong style="color:var(--cyan);">${ac.userName || ac.email}</strong>
        <span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">(${ac.email})</span>
      </div>
      <h4 style="font-family:var(--font-heading);font-size:0.85rem;color:var(--cyan);margin-bottom:12px;">Artículos del pedido (modifique antes de confirmar):</h4>
      ${ac.items.map((item, i) => `
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;align-items:end;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
          <div><label style="font-size:0.72rem;color:var(--text3);">Producto</label><input type="text" class="form-input" id="acOrd_name_${i}" value="${item.name}"></div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Material</label>
            <select class="form-select" id="acOrd_mat_${i}">${Object.keys(allMats).map(k => '<option value="'+k+'" '+(k===item.material?'selected':'')+'>'+k+'</option>').join('')}</select>
          </div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Cantidad</label><input type="number" class="form-input" id="acOrd_qty_${i}" value="${item.qty}" min="1"></div>
          <div><label style="font-size:0.72rem;color:var(--text3);">Precio (€)</label><input type="number" class="form-input" id="acOrd_price_${i}" value="${item.price}" step="0.01" min="0"></div>
        </div>
      `).join('')}
      <div class="form-group" style="margin-top:12px;"><label style="font-size:0.75rem;">Notas del pedido</label><textarea class="form-textarea" id="acOrd_notes" rows="2" placeholder="Notas adicionales..."></textarea></div>
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button class="btn btn-primary" onclick="adminConfirmAbandonedCartOrder(${idx})">Confirmar y Crear Pedido</button>
        <button class="btn btn-secondary" onclick="_renderAbandonedCartsPanel()">Cancelar</button>
      </div>
    </div>
  `;
}

function adminConfirmAbandonedCartOrder(idx) {
  const ac = APP.abandonedCarts[idx];
  if (!ac) return;
  let totalPrice = 0;
  const desc = [];
  ac.items.forEach((item, i) => {
    const nameEl = document.getElementById('acOrd_name_' + i);
    const matEl = document.getElementById('acOrd_mat_' + i);
    const qtyEl = document.getElementById('acOrd_qty_' + i);
    const priceEl = document.getElementById('acOrd_price_' + i);
    const name = nameEl ? nameEl.value : item.name;
    const mat = matEl ? matEl.value : item.material;
    const qty = qtyEl ? parseInt(qtyEl.value) || 1 : item.qty;
    const price = priceEl ? parseFloat(priceEl.value) || 0 : item.price;
    totalPrice += price * qty;
    desc.push(name + ' (x' + qty + ', ' + mat + ')');
  });
  const notes = document.getElementById('acOrd_notes')?.value || '';
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
  const mat0 = document.getElementById('acOrd_mat_0')?.value || 'PLA';
  APP.orders.push({
    id: orderId,
    user: ac.email,
    date: new Date().toLocaleDateString('es-ES'),
    material: mat0,
    color: '#00FFFF',
    colors: [],
    total: totalPrice.toFixed(2),
    status: 'pending',
    description: desc.join('; '),
    notes: notes,
    fromAbandonedCart: true
  });
  ac.status = 'added_to_order';
  simulateEmail(ac.email, 'newOrder', { nombre: ac.userName || ac.email, id: orderId, total: totalPrice.toFixed(2) });
  simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: ac.userName || ac.email, id: orderId, total: totalPrice.toFixed(2) }, { adminOnly: true });
  showToast('Pedido ' + orderId + ' creado desde carrito abandonado de ' + ac.email);
  showAdminSection('orders', document.querySelectorAll('.admin-nav-btn')[0]);
}

// ===== CLIENT SEARCH (REUSABLE) =====
function _adminClientSearchPanel(mode) {
  const title = mode === 'invoice' ? 'BUSCAR CLIENTE PARA FACTURA' : 'BUSCAR CLIENTE PARA PRESUPUESTO';
  const backSection = mode === 'invoice' ? 'invoicesmgmt' : 'quotesmgmt';
  const backBtnIdx = mode === 'invoice' ? 3 : 2;
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">🔍 ${title}</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('${backSection}',document.querySelectorAll('.admin-nav-btn')[${backBtnIdx}])">Volver</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;max-width:700px;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
        <div class="form-group"><label style="font-size:0.75rem;">Nombre</label><input type="text" class="form-input" id="csName" placeholder="Buscar por nombre..."></div>
        <div class="form-group"><label style="font-size:0.75rem;">Email</label><input type="text" class="form-input" id="csEmail" placeholder="Buscar por email..."></div>
        <div class="form-group"><label style="font-size:0.75rem;">Teléfono</label><input type="text" class="form-input" id="csPhone" placeholder="Buscar por teléfono..."></div>
      </div>
      <button class="btn btn-primary btn-small" onclick="_adminExecuteClientSearch('${mode}')">Buscar</button>
    </div>
    <div id="clientSearchResults" style="margin-top:20px;"></div>
  `;
}

function _adminExecuteClientSearch(mode) {
  const nameQ = (document.getElementById('csName')?.value || '').trim().toLowerCase();
  const emailQ = (document.getElementById('csEmail')?.value || '').trim().toLowerCase();
  const phoneQ = (document.getElementById('csPhone')?.value || '').trim().toLowerCase();
  if (!nameQ && !emailQ && !phoneQ) { showToast('Introduce al menos un criterio de búsqueda'); return; }
  if (!APP.registeredUsers || APP.registeredUsers.length === 0) { showToast('No hay usuarios registrados'); return; }
  const results = APP.registeredUsers.filter(u => {
    let match = false;
    if (nameQ && (u.name||'').toLowerCase().includes(nameQ)) match = true;
    if (emailQ && (u.email||'').toLowerCase().includes(emailQ)) match = true;
    if (phoneQ && (u.phone||'').toLowerCase().includes(phoneQ)) match = true;
    return match;
  });
  const container = document.getElementById('clientSearchResults');
  if (!container) return;
  if (results.length === 0) {
    container.innerHTML = '<p style="color:var(--text3);">No se encontraron clientes con esos criterios.</p>';
    return;
  }
  container.innerHTML = results.map((u, i) => {
    // Check for pending quotes and invoices
    const pendingQuotes = APP.quotes.filter(q => q.user === u.email && (q.status === 'pending' || q.status === 'approved'));
    const pendingInvoices = APP.invoices.filter(inv => inv.user === u.email && inv.status === 'pending');
    const hasPending = pendingQuotes.length > 0 || pendingInvoices.length > 0;
    let pendingHtml = '';
    if (hasPending) {
      pendingHtml = '<div style="margin-top:10px;padding:10px;background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.3);border-radius:var(--radius);">';
      pendingQuotes.forEach(q => {
        const statusMap = { pending:'Pendiente', approved:'Aprobado' };
        pendingHtml += '<p style="margin:4px 0;font-size:0.82rem;">⚠️ Este cliente tiene un presupuesto pendiente: <strong style="color:var(--cyan);">' + q.id + '</strong> — Estado: <span style="color:var(--gold);">' + (statusMap[q.status]||q.status) + '</span> <button class="btn btn-secondary btn-small" style="margin-left:8px;font-size:0.7rem;padding:2px 8px;" onclick="showAdminSection(\'quotesmgmt\',document.querySelectorAll(\'.admin-nav-btn\')[2])">Ir al presupuesto</button></p>';
      });
      pendingInvoices.forEach(inv => {
        pendingHtml += '<p style="margin:4px 0;font-size:0.82rem;">⚠️ Este cliente tiene una factura pendiente: <strong style="color:var(--cyan);">' + inv.id + '</strong> — Estado: <span style="color:var(--gold);">Pendiente</span> <button class="btn btn-secondary btn-small" style="margin-left:8px;font-size:0.7rem;padding:2px 8px;" onclick="showAdminSection(\'invoicesmgmt\',document.querySelectorAll(\'.admin-nav-btn\')[3])">Ir a la factura</button></p>';
      });
      pendingHtml += '</div>';
    }
    const actionBtn = hasPending ? '' : (mode === 'invoice'
      ? '<button class="btn btn-primary btn-small" onclick="_adminAutoFillInvoice(\'' + u.email + '\',\'' + (u.name||'').replace(/'/g,"\\'") + '\',\'' + (u.phone||'').replace(/'/g,"\\'") + '\',\'' + (u.address||'').replace(/'/g,"\\'") + '\')">Crear Factura para este cliente</button>'
      : '<button class="btn btn-primary btn-small" onclick="_adminAutoFillQuote(\'' + u.email + '\',\'' + (u.name||'').replace(/'/g,"\\'") + '\',\'' + (u.phone||'').replace(/'/g,"\\'") + '\',\'' + (u.address||'').replace(/'/g,"\\'") + '\')">Crear Presupuesto para este cliente</button>');
    return `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <strong style="color:var(--cyan);">${u.name}</strong>
            <span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">${u.email}</span>
            ${u.phone ? '<span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">Tel: '+u.phone+'</span>' : ''}
            ${u.city ? '<span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">'+u.city+'</span>' : ''}
          </div>
          <span class="status-badge ${u.status==='active'?'status-completed':'status-pending'}">${u.status==='active'?'Activo':'Inactivo'}</span>
        </div>
        ${pendingHtml}
        ${!hasPending ? '<div style="margin-top:10px;">'+actionBtn+'</div>' : ''}
      </div>
    `;
  }).join('');
}

function adminSearchClientForInvoice() {
  _adminClientSearchPanel('invoice');
}

function adminSearchClientForQuote() {
  _adminClientSearchPanel('quote');
}

function _adminAutoFillInvoice(email, name, phone, address) {
  adminAddInvoice();
  setTimeout(function() {
    const emailEl = document.getElementById('invUser');
    const nameEl = document.getElementById('invClientName');
    const addressEl = document.getElementById('invClientAddress');
    if (emailEl) emailEl.value = email;
    if (nameEl) nameEl.value = name;
    if (addressEl) addressEl.value = address;
    showToast('Datos del cliente auto-rellenados');
  }, 50);
}

function _adminAutoFillQuote(email, name, phone, address) {
  adminGenerateQuoteDoc();
  setTimeout(function() {
    const emailEl = document.getElementById('gqEmail');
    const nameEl = document.getElementById('gqName');
    const addressEl = document.getElementById('gqAddress');
    if (emailEl) emailEl.value = email;
    if (nameEl) nameEl.value = name;
    if (addressEl) addressEl.value = address;
    showToast('Datos del cliente auto-rellenados');
  }, 50);
}

function renderAdminNewOrder() {
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  return `
    <h3>CREAR PEDIDO MANUAL</h3>
    <p style="color:var(--text2);font-size:0.88rem;margin-bottom:24px;">Rellena todos los datos del pedido para calcular el presupuesto automáticamente.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div>
        <div class="form-group">
          <label>Email del cliente</label>
          <input type="email" class="form-input" id="aoEmail" placeholder="cliente@email.com" value="">
        </div>
        <div class="form-group">
          <label>Nombre del cliente</label>
          <input type="text" class="form-input" id="aoName" placeholder="Nombre completo" value="">
        </div>
        <div class="form-group">
          <label>Tipo de filamento</label>
          <select class="form-select" id="aoMaterial" onchange="adminCalcOrderPrice()">
            ${Object.entries(allMats).map(([k,v])=>`<option value="${k}">${k} — ${v.base.toFixed(2)}€/cm³</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Colores (selecciona uno o varios)</label>
          <p style="font-size:0.72rem;color:var(--text3);margin-bottom:6px;">Haz clic en los colores deseados. Cada color adicional incrementa el coste un 15%.</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;" id="aoColorGrid">
            ${APP.colors.map((c,i)=>`<div style="width:32px;height:32px;border-radius:6px;background:${c};border:2px solid var(--border);cursor:pointer;position:relative;" onclick="adminToggleOrderColor('${c}',this)" data-color="${c}"></div>`).join('')}
          </div>
          <div id="aoSelectedColors" style="font-size:0.78rem;color:var(--text2);margin-top:4px;">Colores seleccionados: ninguno</div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <label>Capas (resolución)</label>
          <select class="form-select" id="aoLayers" onchange="adminCalcOrderPrice()">
            <option value="0.3">0.3mm — Borrador (rápido)</option>
            <option value="0.2" selected>0.2mm — Estándar</option>
            <option value="0.1">0.1mm — Alta calidad</option>
            <option value="0.05">0.05mm — Ultra detalle</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div class="form-group">
            <label>Ancho (mm)</label>
            <input type="number" class="form-input" id="aoW" value="0" min="0" max="500" onchange="adminCalcOrderPrice()">
          </div>
          <div class="form-group">
            <label>Alto (mm)</label>
            <input type="number" class="form-input" id="aoH" value="0" min="0" max="500" onchange="adminCalcOrderPrice()">
          </div>
          <div class="form-group">
            <label>Fondo (mm)</label>
            <input type="number" class="form-input" id="aoD" value="0" min="0" max="300" onchange="adminCalcOrderPrice()">
          </div>
        </div>
        <div class="form-group">
          <label>Texto personalizado</label>
          <input type="text" class="form-input" id="aoText" placeholder="Texto grabado, nombre, etc.">
        </div>
        <div class="form-group">
          <label>Imágenes / referencias</label>
          <input type="file" id="aoImages" multiple accept="image/*" class="form-input" style="padding:8px;">
          <p style="font-size:0.72rem;color:var(--text3);margin-top:4px;">Adjunta imágenes de referencia del diseño</p>
        </div>
        <div class="form-group">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
            <input type="checkbox" id="aoGlow" onchange="adminCalcOrderPrice()" style="width:18px;height:18px;accent-color:var(--cyan);">
            <span>Brilla en la oscuridad</span>
            <span style="font-size:0.78rem;color:var(--gold);">+${APP.adminSettings.glowInDarkSurcharge || 25}%</span>
          </label>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Notas del pedido</label>
      <textarea class="form-textarea" id="aoNotes" placeholder="Instrucciones especiales, acabados, detalles..."></textarea>
    </div>

    <div class="price-estimate" style="margin-bottom:20px;">
      <div class="price-label">PRESUPUESTO CALCULADO</div>
      <div class="price-value" id="aoPrice">5.00€</div>
      <p style="font-size:0.72rem;color:var(--text3);margin-top:6px;">Precio base por volumen + ajuste por resolución de capas</p>
    </div>

    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="adminSubmitNewOrder()">Crear Pedido</button>
      <button class="btn btn-secondary" onclick="showAdminSection('orders',document.querySelectorAll('.admin-nav-btn')[0])">Cancelar</button>
    </div>
  `;
  setTimeout(adminCalcOrderPrice, 50);
}

let adminSelectedColors = [];

function adminToggleOrderColor(color, el) {
  const idx = adminSelectedColors.indexOf(color);
  if (idx > -1) {
    adminSelectedColors.splice(idx, 1);
    el.style.borderColor = 'var(--border)';
    el.innerHTML = '';
  } else {
    adminSelectedColors.push(color);
    el.style.borderColor = 'var(--cyan)';
    el.innerHTML = '<span style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;background:var(--cyan);border-radius:50%;font-size:0.55rem;display:flex;align-items:center;justify-content:center;color:var(--bg);">✓</span>';
  }
  const label = document.getElementById('aoSelectedColors');
  if (label) label.textContent = adminSelectedColors.length > 0 ? 'Colores seleccionados: ' + adminSelectedColors.length + ' (+' + ((adminSelectedColors.length - 1) * 15) + '% coste adicional)' : 'Colores seleccionados: ninguno';
  adminCalcOrderPrice();
}

function adminCalcOrderPrice() {
  const w = parseFloat(document.getElementById('aoW')?.value||0);
  const h = parseFloat(document.getElementById('aoH')?.value||0);
  const d = parseFloat(document.getElementById('aoD')?.value||0);
  const mat = document.getElementById('aoMaterial')?.value||'PLA';
  const layers = parseFloat(document.getElementById('aoLayers')?.value||0.2);
  const isGlow = document.getElementById('aoGlow')?.checked || false;
  let price = parseFloat(calcPrice(w, h, d, mat));
  if (price > 0) {
    if (layers <= 0.05) price *= 1.8;
    else if (layers <= 0.1) price *= 1.4;
    else if (layers <= 0.2) price *= 1.0;
    else price *= 0.85;
    // Multi-color surcharge: +15% per extra color
    const extraColors = Math.max(0, adminSelectedColors.length - 1);
    if (extraColors > 0) price *= (1 + extraColors * 0.15);
    // Glow in dark surcharge
    if (isGlow) price *= (1 + (APP.adminSettings.glowInDarkSurcharge || 25) / 100);
  }
  const el = document.getElementById('aoPrice');
  if (el) el.textContent = price.toFixed(2) + '€';
  return price.toFixed(2);
}

function adminSubmitNewOrder() {
  const email = document.getElementById('aoEmail')?.value?.trim();
  const name = document.getElementById('aoName')?.value?.trim();
  const material = document.getElementById('aoMaterial')?.value;
  const colors = [...adminSelectedColors];
  const layers = document.getElementById('aoLayers')?.value;
  const text = document.getElementById('aoText')?.value;
  const notes = document.getElementById('aoNotes')?.value;
  const w = document.getElementById('aoW')?.value;
  const h = document.getElementById('aoH')?.value;
  const d = document.getElementById('aoD')?.value;
  const isGlow = document.getElementById('aoGlow')?.checked || false;
  const total = adminCalcOrderPrice();

  if (!email) { showToast('Introduce el email del cliente'); return; }
  if (colors.length === 0) { showToast('Selecciona al menos un color'); return; }

  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    user: email,
    clientName: name || email.split('@')[0],
    material, colors, color: colors[0], layers,
    customText: text, notes,
    dimensions: { w, h, d },
    glowInDark: isGlow,
    total, status: 'pending', source: 'manual'
  };
  APP.orders.push(order);
  adminSelectedColors = [];
  simulateEmail(email, 'newOrder', { nombre: name || email, id: order.id, total: total });
  simulateEmail(APP.adminSettings.adminEmail, 'newOrder', { nombre: name || email, id: order.id, total: total }, { adminOnly: true });
  showToast('Pedido creado: ' + order.id);
  showAdminSection('orders', document.querySelectorAll('.admin-nav-btn')[0]);
}

function adminOpenEditorOrder() {
  // Navigate to the editor page — from admin the order will be created there
  APP._adminEditorMode = true;
  navigateTo('editor');
  showToast('Modo administrador: crea el diseño y pulsa "Enviar Pedido" para añadirlo');
}

function editOrderFull(idx) {
  const o = APP.orders[idx];
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>EDITAR PEDIDO <span style="color:var(--cyan);">${o.id}</span></h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div>
        <div class="form-group">
          <label>Email del cliente</label>
          <input type="email" class="form-input" id="eoEmail" value="${o.user}">
        </div>
        <div class="form-group">
          <label>Material</label>
          <select class="form-select" id="eoMaterial">
            ${Object.keys(allMats).map(k=>`<option value="${k}" ${k===o.material?'selected':''}>${k}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Color</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${APP.colors.map(c=>`<div style="width:28px;height:28px;border-radius:6px;background:${c};border:2px solid ${c===o.color?'var(--cyan)':'var(--border)'};cursor:pointer;" onclick="this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='var(--border)');this.style.borderColor='var(--cyan)';document.getElementById('eoColor').value='${c}'"></div>`).join('')}
          </div>
          <input type="hidden" id="eoColor" value="${o.color||APP.colors[0]}">
        </div>
      </div>
      <div>
        <div class="form-group">
          <label>Texto personalizado</label>
          <input type="text" class="form-input" id="eoText" value="${o.customText||''}">
        </div>
        <div class="form-group">
          <label>Total (€)</label>
          <input type="number" class="form-input" id="eoTotal" value="${o.total}" step="0.01" min="0">
        </div>
        <div class="form-group">
          <label>Notas</label>
          <textarea class="form-textarea" id="eoNotes">${o.notes||''}</textarea>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button class="btn btn-primary" onclick="saveEditedOrder(${idx})">Guardar Cambios</button>
      <button class="btn btn-secondary" onclick="showAdminSection('orders',document.querySelectorAll('.admin-nav-btn')[0])">Cancelar</button>
    </div>
  `;
}

function saveEditedOrder(idx) {
  const o = APP.orders[idx];
  o.user = document.getElementById('eoEmail')?.value || o.user;
  o.material = document.getElementById('eoMaterial')?.value || o.material;
  o.color = document.getElementById('eoColor')?.value || o.color;
  o.customText = document.getElementById('eoText')?.value || '';
  o.total = document.getElementById('eoTotal')?.value || o.total;
  o.notes = document.getElementById('eoNotes')?.value || '';
  simulateEmail(o.user, 'orderModified', { nombre: o.clientName || o.user, id: o.id });
  simulateEmail(APP.adminSettings.adminEmail, 'orderModified', { nombre: o.clientName || o.user, id: o.id }, { adminOnly: true });
  showToast('Pedido ' + o.id + ' actualizado');
  showAdminSection('orders', document.querySelectorAll('.admin-nav-btn')[0]);
}

function renderAdminQuotesMgmt() {
  const quoteStatusMap = { pending:'Pendiente', approved:'Aprobado', rejected:'Rechazado', invoiced:'Facturado', cancelled:'Anulado' };
  const quoteStatusClass = { pending:'status-pending', approved:'status-completed', rejected:'status-cancelled', invoiced:'status-shipped', cancelled:'status-cancelled' };

  return `
    <h3>GESTIÓN DE PRESUPUESTOS</h3>
    <div style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary btn-small" onclick="adminAddQuote()">+ Crear Presupuesto</button>
      <button class="btn btn-secondary btn-small" onclick="adminGenerateQuoteDoc()">Generar Presupuesto Detallado</button>
      <button class="btn btn-secondary btn-small" onclick="adminSearchClientForQuote()">🔍 Buscar Cliente para Presupuesto</button>
    </div>
    ${APP.quotes.length === 0 ? '<p style="color:var(--text3);">No hay presupuestos</p>' : `
    <div class="table-responsive"><table class="data-table">
      <thead><tr><th>ID</th><th>USUARIO</th><th>FECHA</th><th>MATERIAL</th><th>DIMENSIONES</th><th>TOTAL</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
      <tbody>${APP.quotes.map((q,i)=>`<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${q.id}</td>
        <td style="font-size:0.82rem;">${q.user}</td>
        <td>${q.date}</td>
        <td>${q.material}</td>
        <td style="font-size:0.82rem;">${q.dimensions.w}x${q.dimensions.h}x${q.dimensions.d}mm</td>
        <td style="font-family:var(--font-display);">${q.total}€</td>
        <td><span class="status-badge ${quoteStatusClass[q.status]||'status-pending'}">${quoteStatusMap[q.status]||q.status}</span>${q.clientConfirmedDate ? '<br><span style="font-size:0.68rem;color:var(--text3);">Confirmado: '+q.clientConfirmedDate+'</span>' : ''}</td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-small" onclick="adminQuotePreview(${i})">Vista</button>
            <button class="btn btn-secondary btn-small" onclick="adminEditQuote(${i})">Editar</button>
            ${q.status==='pending' ? `
              <button class="btn btn-primary btn-small" onclick="adminApproveQuote(${i})">Aprobar</button>
              <button class="btn btn-danger btn-small" onclick="adminRejectQuote(${i})">Rechazar</button>
            ` : ''}
            ${q.status==='approved' ? `
              <button class="btn btn-gold btn-small" onclick="adminConvertToInvoice(${i})">Facturar</button>
              <button class="btn btn-danger btn-small" onclick="adminAnnulQuote(${i})">Anular</button>
            ` : ''}
            ${q.status==='invoiced' ? `<span style="font-size:0.72rem;color:var(--cyan);">${q.invoiceId}</span>` : ''}
            ${q.status!=='invoiced' ? `<button class="btn btn-danger btn-small" onclick="adminDeleteQuote(${i})">Eliminar</button>` : ''}
          </div>
        </td>
      </tr>`).join('')}</tbody>
    </table></div>`}
  `;
}

function adminAddQuote() {
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>CREAR PRESUPUESTO</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div>
        <div class="form-group"><label>Email cliente</label><input type="email" class="form-input" id="aqEmail" placeholder="cliente@email.com"></div>
        <div class="form-group"><label>Material</label>
          <select class="form-select" id="aqMaterial">${Object.keys(allMats).map(k=>`<option value="${k}">${k}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Descripción</label><textarea class="form-textarea" id="aqDesc" placeholder="Detalles del presupuesto..."></textarea></div>
      </div>
      <div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div class="form-group"><label>Ancho</label><input type="number" class="form-input" id="aqW" value="0" min="0"></div>
          <div class="form-group"><label>Alto</label><input type="number" class="form-input" id="aqH" value="0" min="0"></div>
          <div class="form-group"><label>Fondo</label><input type="number" class="form-input" id="aqD" value="0" min="0"></div>
        </div>
        <div class="form-group"><label>Total (€)</label><input type="number" class="form-input" id="aqTotal" value="0" step="0.01" min="0"></div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn btn-primary" onclick="adminSaveNewQuote()">Crear Presupuesto</button>
      <button class="btn btn-secondary" onclick="showAdminSection('quotesmgmt',document.querySelector('.admin-nav-btn.active'))">Cancelar</button>
    </div>
  `;
}

function adminSaveNewQuote() {
  const email = document.getElementById('aqEmail')?.value?.trim();
  if (!email) { showToast('Introduce el email'); return; }
  const q = {
    id: 'PRE-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    user: email,
    model: 'custom',
    material: document.getElementById('aqMaterial')?.value||'PLA',
    dimensions: { w: document.getElementById('aqW')?.value||0, h: document.getElementById('aqH')?.value||0, d: document.getElementById('aqD')?.value||0 },
    description: document.getElementById('aqDesc')?.value||'',
    total: document.getElementById('aqTotal')?.value||'0.00',
    status: 'pending', invoiceId: null
  };
  APP.quotes.push(q);
  showToast('Presupuesto creado: ' + q.id);
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminEditQuote(idx) {
  const q = APP.quotes[idx];
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>EDITAR PRESUPUESTO <span style="color:var(--cyan);">${q.id}</span></h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div>
        <div class="form-group"><label>Email</label><input type="email" class="form-input" id="eqEmail" value="${q.user}"></div>
        <div class="form-group"><label>Material</label>
          <select class="form-select" id="eqMaterial">${Object.keys(allMats).map(k=>`<option value="${k}" ${k===q.material?'selected':''}>${k}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Descripción</label><textarea class="form-textarea" id="eqDesc">${q.description||''}</textarea></div>
      </div>
      <div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div class="form-group"><label>Ancho</label><input type="number" class="form-input" id="eqW" value="${q.dimensions.w}"></div>
          <div class="form-group"><label>Alto</label><input type="number" class="form-input" id="eqH" value="${q.dimensions.h}"></div>
          <div class="form-group"><label>Fondo</label><input type="number" class="form-input" id="eqD" value="${q.dimensions.d}"></div>
        </div>
        <div class="form-group"><label>Total (€)</label><input type="number" class="form-input" id="eqTotal" value="${q.total}" step="0.01"></div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn btn-primary" onclick="adminSaveEditedQuote(${idx})">Guardar</button>
      <button class="btn btn-secondary" onclick="showAdminSection('quotesmgmt',document.querySelector('.admin-nav-btn.active'))">Cancelar</button>
    </div>
  `;
}

function adminSaveEditedQuote(idx) {
  const q = APP.quotes[idx];
  q.user = document.getElementById('eqEmail')?.value||q.user;
  q.material = document.getElementById('eqMaterial')?.value||q.material;
  q.description = document.getElementById('eqDesc')?.value||'';
  q.dimensions = { w: document.getElementById('eqW')?.value||0, h: document.getElementById('eqH')?.value||0, d: document.getElementById('eqD')?.value||0 };
  q.total = document.getElementById('eqTotal')?.value||q.total;
  simulateEmail(q.user, 'quoteModified', { nombre: q.clientName || q.user, id: q.id });
  simulateEmail(APP.adminSettings.adminEmail, 'quoteModified', { nombre: q.clientName || q.user, id: q.id }, { adminOnly: true });
  showToast('Presupuesto actualizado');
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminAnnulQuote(idx) {
  APP.quotes[idx].status = 'cancelled';
  const q = APP.quotes[idx];
  simulateEmail(q.user, 'quoteAnnulled', { nombre: q.clientName || q.user, id: q.id });
  simulateEmail(APP.adminSettings.adminEmail, 'quoteAnnulled', { nombre: q.clientName || q.user, id: q.id }, { adminOnly: true });
  showToast('Presupuesto anulado');
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminDeleteQuote(idx) {
  if (confirm('¿Eliminar presupuesto ' + APP.quotes[idx].id + '?')) {
    const q = APP.quotes[idx];
    simulateEmail(q.user, 'quoteDeleted', { nombre: q.clientName || q.user, id: q.id });
    simulateEmail(APP.adminSettings.adminEmail, 'quoteDeleted', { nombre: q.clientName || q.user, id: q.id }, { adminOnly: true });
    APP.quotes.splice(idx, 1);
    showToast('Presupuesto eliminado');
    showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
  }
}

function adminQuotePreview(idx) {
  const q = APP.quotes[idx];
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(q.total);
  const taxAmount = subtotal * s.taxRate / 100;
  const totalWithTax = subtotal + taxAmount;
  const previewData = {
    id: q.id,
    date: q.date,
    user: q.user,
    concept: q.description || 'Servicio de impresión 3D — ' + q.material,
    description: q.description || '',
    material: q.material,
    dimensions: q.dimensions,
    total: q.total,
    taxRate: s.taxRate,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    status: q.status,
    clientName: q.clientName || q.user,
    clientNIF: q.clientNIF || '',
    clientAddress: q.clientAddress || '',
    validUntil: q.validUntil || ''
  };
  adminRenderInvoicePreview(previewData, 'quote');
}

function adminGenerateQuoteDoc() {
  const allMats = {...APP.materials, ...APP.specialMaterials, ...(APP.technicalMaterials||{})};
  const s = APP.invoiceSettings;
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>GENERAR PRESUPUESTO DETALLADO</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;">
      <div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Datos del Cliente</h4>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Email cliente</label><input type="email" class="form-input" id="gqEmail" placeholder="cliente@email.com"></div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Nombre completo</label><input type="text" class="form-input" id="gqName" placeholder="Nombre del cliente"></div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">NIF/DNI</label><input type="text" class="form-input" id="gqNIF" placeholder="12345678A"></div>
          <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Dirección</label><input type="text" class="form-input" id="gqAddress" placeholder="Calle, Ciudad, CP"></div>
        </div>
      </div>
      <div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Detalles del Presupuesto</h4>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Concepto / Descripción</label><textarea class="form-input" id="gqDesc" rows="2" placeholder="Descripción del servicio..."></textarea></div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Material</label>
            <select class="form-select" id="gqMaterial">${Object.keys(allMats).map(k=>'<option value="'+k+'">'+k+'</option>').join('')}</select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Ancho (mm)</label><input type="number" class="form-input" id="gqW" value="0" min="0"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Alto (mm)</label><input type="number" class="form-input" id="gqH" value="0" min="0"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Fondo (mm)</label><input type="number" class="form-input" id="gqD" value="0" min="0"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Subtotal (sin IVA)</label><input type="number" class="form-input" id="gqTotal" value="0" step="0.01" min="0" oninput="adminUpdateQuoteDocTax()"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Total con ${s.taxLabel} (${s.taxRate}%)</label><input type="text" class="form-input" id="gqTotalTax" value="0.00" readonly style="background:var(--bg3);"></div>
          </div>
          <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Validez</label><input type="text" class="form-input" id="gqValidity" value="30 días" style="font-size:0.85rem;"></div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn btn-primary" onclick="adminSaveGeneratedQuote()">Guardar y Enviar</button>
      <button class="btn btn-secondary" onclick="adminPreviewGeneratedQuote()">Vista Previa en Tiempo Real</button>
      <button class="btn btn-secondary" onclick="showAdminSection('quotesmgmt',document.querySelector('.admin-nav-btn.active'))">Cancelar</button>
    </div>
  `;
}

function adminUpdateQuoteDocTax() {
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(document.getElementById('gqTotal')?.value) || 0;
  const total = subtotal + (subtotal * s.taxRate / 100);
  const el = document.getElementById('gqTotalTax');
  if (el) el.value = total.toFixed(2);
}

function adminPreviewGeneratedQuote() {
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(document.getElementById('gqTotal')?.value) || 0;
  const taxAmount = subtotal * s.taxRate / 100;
  const previewObj = {
    id: 'PRE-BORRADOR',
    date: new Date().toLocaleDateString('es-ES'),
    user: document.getElementById('gqEmail')?.value || 'sin-email',
    concept: document.getElementById('gqDesc')?.value || 'Servicio de impresión 3D',
    description: document.getElementById('gqDesc')?.value || '',
    material: document.getElementById('gqMaterial')?.value || 'PLA',
    dimensions: { w: document.getElementById('gqW')?.value||0, h: document.getElementById('gqH')?.value||0, d: document.getElementById('gqD')?.value||0 },
    total: subtotal.toFixed(2),
    taxRate: s.taxRate,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: (subtotal + taxAmount).toFixed(2),
    status: 'pending',
    clientName: document.getElementById('gqName')?.value || '',
    clientNIF: document.getElementById('gqNIF')?.value || '',
    clientAddress: document.getElementById('gqAddress')?.value || '',
    validUntil: document.getElementById('gqValidity')?.value || '30 días'
  };
  adminRenderInvoicePreview(previewObj, 'quote');
}

function adminSaveGeneratedQuote() {
  const email = document.getElementById('gqEmail')?.value?.trim();
  if (!email) { showToast('Introduce el email del cliente'); return; }
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(document.getElementById('gqTotal')?.value) || 0;
  const taxAmount = subtotal * s.taxRate / 100;
  const q = {
    id: 'PRE-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    user: email,
    model: 'custom',
    material: document.getElementById('gqMaterial')?.value || 'PLA',
    dimensions: { w: document.getElementById('gqW')?.value||0, h: document.getElementById('gqH')?.value||0, d: document.getElementById('gqD')?.value||0 },
    description: document.getElementById('gqDesc')?.value || '',
    total: subtotal.toFixed(2),
    status: 'pending',
    invoiceId: null,
    clientName: document.getElementById('gqName')?.value || '',
    clientNIF: document.getElementById('gqNIF')?.value || '',
    clientAddress: document.getElementById('gqAddress')?.value || '',
    validUntil: document.getElementById('gqValidity')?.value || '30 días'
  };
  APP.quotes.push(q);
  simulateEmail(email, 'newQuote', { nombre: q.clientName || email, id: q.id, email: email });
  simulateEmail(APP.adminSettings.adminEmail, 'newQuote', { nombre: q.clientName || email, id: q.id, email: email }, { adminOnly: true });
  showToast('Presupuesto ' + q.id + ' generado y email enviado a ' + email);
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminApproveQuote(idx) {
  APP.quotes[idx].status = 'approved';
  const q = APP.quotes[idx];
  simulateEmail(q.user, 'quoteApproved', { nombre: q.clientName || q.user, id: q.id });
  simulateEmail(APP.adminSettings.adminEmail, 'quoteApproved', { nombre: q.clientName || q.user, id: q.id }, { adminOnly: true });
  showToast('Presupuesto aprobado: ' + q.id);
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminRejectQuote(idx) {
  APP.quotes[idx].status = 'rejected';
  const q = APP.quotes[idx];
  simulateEmail(q.user, 'quoteRejected', { nombre: q.clientName || q.user, id: q.id });
  simulateEmail(APP.adminSettings.adminEmail, 'quoteRejected', { nombre: q.clientName || q.user, id: q.id }, { adminOnly: true });
  showToast('Presupuesto rechazado');
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function adminConvertToInvoice(idx) {
  const q = APP.quotes[idx];
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(q.total);
  const taxAmount = subtotal * s.taxRate / 100;
  const totalWithTax = subtotal + taxAmount;
  const invoiceId = s.invoicePrefix + '-' + String(s.nextNumber).padStart(4,'0');
  s.nextNumber++;

  const invoice = {
    id: invoiceId,
    date: new Date().toLocaleDateString('es-ES'),
    user: q.user,
    quoteId: q.id,
    material: q.material,
    dimensions: q.dimensions,
    concept: q.description || 'Impresión 3D personalizada',
    description: q.description || '',
    total: subtotal.toFixed(2),
    taxRate: s.taxRate,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    status: 'pending',
    clientName: q.user,
    clientNIF: '',
    clientAddress: ''
  };
  APP.invoices.push(invoice);
  q.status = 'invoiced';
  q.invoiceId = invoiceId;
  simulateEmail(q.user, 'newInvoice', { nombre: q.user, id: invoiceId, total: totalWithTax.toFixed(2), fecha: invoice.date });
  simulateEmail(APP.adminSettings.adminEmail, 'newInvoice', { nombre: q.user, id: invoiceId, total: totalWithTax.toFixed(2), fecha: invoice.date }, { adminOnly: true });
  showToast('Factura ' + invoiceId + ' generada y email enviado');
  showAdminSection('quotesmgmt', document.querySelector('.admin-nav-btn.active'));
}

function renderAdminInvoicesMgmt() {
  const invStatusMap = { pending:'Pendiente', paid:'Pagada', overdue:'Vencida', cancelled:'Anulada' };

  return `
    <h3>GESTIÓN DE FACTURAS</h3>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center;">
      <button class="btn btn-primary btn-small" onclick="adminAddInvoice()">+ Nueva Factura</button>
      <button class="btn btn-secondary btn-small" onclick="adminConvertQuoteToInvoicePanel()">Convertir Presupuesto</button>
      <button class="btn btn-secondary btn-small" onclick="adminInvoiceConfig()">Configurar Factura</button>
      <button class="btn btn-secondary btn-small" onclick="adminSearchClientForInvoice()">🔍 Buscar Cliente para Factura</button>
      <p style="color:var(--text2);font-size:0.85rem;margin:0 0 0 auto;">Total: <span style="color:var(--cyan);font-family:var(--font-display);">${APP.invoices.length}</span> — Importe: <span style="color:var(--cyan);font-family:var(--font-display);">${APP.invoices.reduce((s,inv)=>s+parseFloat(inv.total||0),0).toFixed(2)}€</span></p>
    </div>
    ${APP.invoices.length===0 ? '<p style="color:var(--text3);">No hay facturas. Crea una nueva, genera desde presupuestos o usa "Convertir Presupuesto".</p>' : `
    <div class="table-responsive"><table class="data-table">
      <thead><tr><th>FACTURA</th><th>PRESUPUESTO</th><th>USUARIO</th><th>CONCEPTO</th><th>FECHA</th><th>SUBTOTAL</th><th>${APP.invoiceSettings.taxLabel}</th><th>TOTAL</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
      <tbody>${APP.invoices.map((inv,i)=>{
        const subtotal = parseFloat(inv.total||0);
        const tax = inv.taxAmount !== undefined ? parseFloat(inv.taxAmount) : 0;
        const totalWithTax = inv.totalWithTax !== undefined ? parseFloat(inv.totalWithTax) : subtotal;
        return `<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${inv.id}</td>
        <td style="font-family:var(--font-display);font-size:0.78rem;">${inv.quoteId||'—'}</td>
        <td style="font-size:0.82rem;">${inv.user}</td>
        <td style="font-size:0.8rem;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${inv.concept||inv.description||'—'}</td>
        <td style="font-size:0.8rem;">${inv.date}</td>
        <td style="font-family:var(--font-display);font-size:0.82rem;">${subtotal.toFixed(2)}€</td>
        <td style="font-size:0.8rem;">${tax.toFixed(2)}€</td>
        <td style="font-family:var(--font-display);color:var(--cyan);">${totalWithTax.toFixed(2)}€</td>
        <td>
          <select class="form-select" style="width:auto;padding:4px 8px;font-size:0.75rem;" onchange="updateInvoiceStatus(${i},this.value)">
            ${Object.keys(invStatusMap).map(s=>`<option value="${s}" ${inv.status===s?'selected':''}>${invStatusMap[s]}</option>`).join('')}
          </select>
        </td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-small" onclick="adminPreviewInvoice(${i})" style="font-size:0.72rem;padding:3px 7px;">Vista</button>
            <button class="btn btn-secondary btn-small" onclick="adminEditInvoice(${i})" style="font-size:0.72rem;padding:3px 7px;">Editar</button>
            <button class="btn btn-danger btn-small" onclick="adminAnnulInvoice(${i})" style="font-size:0.72rem;padding:3px 7px;">Anular</button>
            <button class="btn btn-danger btn-small" onclick="adminDeleteInvoice(${i})" style="font-size:0.72rem;padding:3px 7px;">Eliminar</button>
          </div>
        </td>
      </tr>`}).join('')}</tbody>
    </table></div>`}
  `;
}

// ===== CONVERT QUOTE TO INVOICE PANEL =====
function adminConvertQuoteToInvoicePanel() {
  const el = document.getElementById('adminContent');
  const pendingQuotes = APP.quotes.filter(q=>q.status==='approved'||q.status==='pending');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CONVERTIR PRESUPUESTO A FACTURA</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('invoicesmgmt',document.querySelectorAll('.admin-nav-btn')[3])">Volver</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;" id="convertInvLayout">
      <!-- Left: Search/Select -->
      <div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;">Buscar por email o ID de presupuesto</h4>
          <div class="form-group" style="margin-bottom:8px;">
            <input type="text" class="form-input" id="convertSearchInput" placeholder="Email del cliente o ID del presupuesto (ej: QT-...)" oninput="adminSearchQuoteForConvert()">
          </div>
          <div id="convertSearchResults"></div>
        </div>

        ${pendingQuotes.length > 0 ? `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;">Presupuestos aprobados/pendientes</h4>
          <div style="max-height:300px;overflow-y:auto;">
            ${pendingQuotes.map((q,qi)=>{
              const realIdx = APP.quotes.indexOf(q);
              return `<div style="padding:10px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'" onclick="adminSelectQuoteForConvert(${realIdx})">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-family:var(--font-display);font-size:0.78rem;color:var(--cyan);">${q.id}</span>
                <span class="status-badge ${q.status==='approved'?'status-completed':'status-pending'}" style="font-size:0.68rem;">${q.status==='approved'?'Aprobado':'Pendiente'}</span>
              </div>
              <p style="font-size:0.82rem;margin:4px 0 0;">${q.user} — ${q.total}€ · ${q.material}</p>
            </div>`}).join('')}
          </div>
        </div>` : ''}
      </div>

      <!-- Right: Selected quote details & convert form -->
      <div id="convertDetailPanel">
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center;">
          <p style="color:var(--text3);font-size:0.88rem;">Selecciona un presupuesto de la lista o busca por email/ID para convertirlo en factura.</p>
        </div>
      </div>
    </div>
  `;
}

function adminSearchQuoteForConvert() {
  const query = document.getElementById('convertSearchInput')?.value?.trim().toLowerCase();
  const resultsDiv = document.getElementById('convertSearchResults');
  if (!query || query.length < 2) { resultsDiv.innerHTML = ''; return; }

  const matches = APP.quotes.filter(q =>
    q.user.toLowerCase().includes(query) ||
    q.id.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    resultsDiv.innerHTML = '<p style="font-size:0.82rem;color:var(--text3);padding:8px 0;">No se encontraron presupuestos.</p>';
    return;
  }

  resultsDiv.innerHTML = matches.map(q => {
    const realIdx = APP.quotes.indexOf(q);
    return `<div style="padding:8px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:4px;cursor:pointer;" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'" onclick="adminSelectQuoteForConvert(${realIdx})">
      <span style="font-family:var(--font-display);font-size:0.75rem;color:var(--cyan);">${q.id}</span>
      <span style="font-size:0.8rem;margin-left:8px;">${q.user}</span>
      <span style="font-size:0.8rem;float:right;color:var(--text2);">${q.total}€</span>
    </div>`;
  }).join('');
}

function adminSelectQuoteForConvert(idx) {
  const q = APP.quotes[idx];
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(q.total);
  const taxAmount = (subtotal * s.taxRate / 100);
  const totalWithTax = subtotal + taxAmount;

  const panel = document.getElementById('convertDetailPanel');
  panel.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--cyan);border-radius:var(--radius);padding:20px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;color:var(--cyan);margin-bottom:16px;">Verificación del presupuesto</h4>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
        <div style="padding:8px;background:var(--surface);border-radius:var(--radius);">
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);">PRESUPUESTO</p>
          <p style="font-size:0.9rem;color:var(--cyan);">${q.id}</p>
        </div>
        <div style="padding:8px;background:var(--surface);border-radius:var(--radius);">
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);">ESTADO</p>
          <p style="font-size:0.9rem;">${q.status==='approved'?'Aprobado':q.status==='pending'?'Pendiente':q.status}</p>
        </div>
        <div style="padding:8px;background:var(--surface);border-radius:var(--radius);">
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);">CLIENTE</p>
          <p style="font-size:0.9rem;">${q.user}</p>
        </div>
        <div style="padding:8px;background:var(--surface);border-radius:var(--radius);">
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);">MATERIAL</p>
          <p style="font-size:0.9rem;">${q.material}</p>
        </div>
      </div>

      ${q.dimensions ? `<p style="font-size:0.82rem;color:var(--text2);margin-bottom:8px;">Dimensiones: ${q.dimensions.w}×${q.dimensions.h}×${q.dimensions.d} mm</p>` : ''}
      ${q.description ? `<p style="font-size:0.82rem;color:var(--text2);margin-bottom:12px;">Descripción: ${q.description}</p>` : ''}

      <div style="border-top:1px solid var(--border);padding-top:12px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:0.85rem;color:var(--text2);">Subtotal:</span>
          <span style="font-family:var(--font-display);">${subtotal.toFixed(2)}€</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:0.85rem;color:var(--text2);">${s.taxLabel} (${s.taxRate}%):</span>
          <span style="font-family:var(--font-display);">${taxAmount.toFixed(2)}€</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid var(--border);">
          <span style="font-size:0.95rem;font-family:var(--font-heading);">TOTAL:</span>
          <span style="font-family:var(--font-display);color:var(--cyan);font-size:1.1rem;">${totalWithTax.toFixed(2)}€</span>
        </div>
      </div>

      <div class="form-group" style="margin-bottom:8px;">
        <label style="font-size:0.78rem;">Nombre del cliente (verificación)</label>
        <input type="text" class="form-input" id="convertClientName" placeholder="Nombre completo">
      </div>
      <div class="form-group" style="margin-bottom:8px;">
        <label style="font-size:0.78rem;">NIF/DNI del cliente</label>
        <input type="text" class="form-input" id="convertClientNIF" placeholder="12345678A">
      </div>
      <div class="form-group" style="margin-bottom:8px;">
        <label style="font-size:0.78rem;">Dirección de facturación</label>
        <input type="text" class="form-input" id="convertClientAddress" placeholder="Dirección completa">
      </div>
      <div class="form-group" style="margin-bottom:12px;">
        <label style="font-size:0.78rem;">Concepto adicional (opcional)</label>
        <input type="text" class="form-input" id="convertConcept" value="${q.description || 'Servicio de impresión 3D — ' + q.material}">
      </div>

      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="adminExecuteConvertQuote(${idx})">Generar Factura y Enviar Email</button>
      </div>
    </div>
  `;
}

function adminExecuteConvertQuote(idx) {
  const q = APP.quotes[idx];
  const s = APP.invoiceSettings;
  const clientName = document.getElementById('convertClientName')?.value?.trim();
  const clientNIF = document.getElementById('convertClientNIF')?.value?.trim();
  const clientAddress = document.getElementById('convertClientAddress')?.value?.trim();
  const concept = document.getElementById('convertConcept')?.value?.trim();

  if (!clientName) { showToast('Introduce el nombre del cliente para verificación'); return; }

  const subtotal = parseFloat(q.total);
  const taxAmount = (subtotal * s.taxRate / 100);
  const totalWithTax = subtotal + taxAmount;

  const invoiceId = s.invoicePrefix + '-' + String(s.nextNumber).padStart(4,'0');
  s.nextNumber++;

  const invoice = {
    id: invoiceId,
    date: new Date().toLocaleDateString('es-ES'),
    user: q.user,
    quoteId: q.id,
    material: q.material,
    dimensions: q.dimensions,
    concept: concept || 'Impresión 3D personalizada',
    description: q.description || '',
    total: subtotal.toFixed(2),
    taxRate: s.taxRate,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    status: 'pending',
    clientName: clientName,
    clientNIF: clientNIF,
    clientAddress: clientAddress,
    notes: ''
  };
  APP.invoices.push(invoice);
  q.status = 'invoiced';
  q.invoiceId = invoiceId;

  simulateEmail(q.user, 'newInvoice', { nombre: clientName, id: invoiceId, total: totalWithTax.toFixed(2), fecha: invoice.date });
  simulateEmail(APP.adminSettings.adminEmail, 'newInvoice', { nombre: clientName, id: invoiceId, total: totalWithTax.toFixed(2), fecha: invoice.date }, { adminOnly: true });
  showToast('Factura ' + invoiceId + ' generada y email enviado a ' + q.user);
  showAdminSection('invoicesmgmt', document.querySelectorAll('.admin-nav-btn')[3]);
}

// ===== INVOICE CONFIGURATION =====
function adminInvoiceConfig() {
  const s = APP.invoiceSettings;
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CONFIGURACIÓN DE FACTURAS</h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-small" onclick="adminPreviewInvoiceTemplate()">Vista Previa</button>
        <button class="btn btn-secondary btn-small" onclick="showAdminSection('invoicesmgmt',document.querySelectorAll('.admin-nav-btn')[3])">Volver</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;">
      <!-- Company data -->
      <div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Datos de la Empresa</h4>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Nombre de empresa</label><input type="text" class="form-input" id="icfgName" value="${s.companyName}" style="font-size:0.85rem;"></div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">NIF/CIF</label><input type="text" class="form-input" id="icfgNIF" value="${s.companyNIF}" style="font-size:0.85rem;"></div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Dirección</label><input type="text" class="form-input" id="icfgAddress" value="${s.companyAddress}" style="font-size:0.85rem;"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Ciudad</label><input type="text" class="form-input" id="icfgCity" value="${s.companyCity}" style="font-size:0.85rem;"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">C.P.</label><input type="text" class="form-input" id="icfgPostal" value="${s.companyPostal}" style="font-size:0.85rem;"></div>
          </div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Teléfono</label><input type="text" class="form-input" id="icfgPhone" value="${s.companyPhone}" style="font-size:0.85rem;"></div>
          <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Email</label><input type="text" class="form-input" id="icfgEmail" value="${s.companyEmail}" style="font-size:0.85rem;"></div>
        </div>
      </div>

      <!-- Invoice settings -->
      <div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Configuración de Factura</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Prefijo factura</label><input type="text" class="form-input" id="icfgPrefix" value="${s.invoicePrefix}" style="font-size:0.85rem;"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Siguiente nº</label><input type="number" class="form-input" id="icfgNextNum" value="${s.nextNumber}" min="1" style="font-size:0.85rem;"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">% Impuesto</label><input type="number" class="form-input" id="icfgTaxRate" value="${s.taxRate}" min="0" max="100" step="0.5" style="font-size:0.85rem;"></div>
            <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Etiqueta impuesto</label><input type="text" class="form-input" id="icfgTaxLabel" value="${s.taxLabel}" style="font-size:0.85rem;"></div>
          </div>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Condiciones de pago</label><input type="text" class="form-input" id="icfgPayTerms" value="${s.paymentTerms}" style="font-size:0.85rem;"></div>
          <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Cuenta bancaria (IBAN)</label><input type="text" class="form-input" id="icfgBank" value="${s.bankAccount}" style="font-size:0.85rem;"></div>
        </div>

        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Logo y Marca</h4>
          <div class="form-group" style="margin-bottom:8px;"><label style="font-size:0.75rem;">Texto del logo</label><input type="text" class="form-input" id="icfgLogoText" value="${s.logoText}" style="font-size:0.85rem;"></div>
          <div class="form-group" style="margin-bottom:8px;">
            <label style="font-size:0.75rem;">Logo (imagen)</label>
            <div style="display:flex;gap:10px;align-items:center;">
              ${s.logoImage ? '<img src="'+s.logoImage+'" style="max-height:50px;max-width:150px;border-radius:4px;border:1px solid #ccc;">' : '<span style="font-size:0.78rem;color:var(--text3);">Sin logo cargado</span>'}
              <input type="file" id="icfgLogoFile" accept="image/*" onchange="adminUploadLogo(this)" style="font-size:0.78rem;">
              ${s.logoImage ? '<button class="btn btn-danger btn-small" onclick="adminRemoveLogo()" style="font-size:0.7rem;">Quitar</button>' : ''}
            </div>
            <p style="font-size:0.7rem;color:var(--text3);margin-top:4px;">Se usará en facturas y presupuestos. Formatos: PNG, JPG, SVG. Máx. recomendado: 300x100px.</p>
          </div>
        </div>

        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;color:var(--cyan);">Textos al Pie de Factura</h4>
          <div style="display:flex;gap:16px;margin-bottom:12px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;cursor:pointer;">
              <input type="checkbox" id="icfgShowFooter" ${s.showFooterNote?'checked':''} onchange="document.getElementById('icfgFooterWrap').style.opacity=this.checked?'1':'0.4'"> Mostrar nota personalizada
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:0.82rem;cursor:pointer;">
              <input type="checkbox" id="icfgShowLegal" ${s.showLegalText?'checked':''} onchange="document.getElementById('icfgLegalWrap').style.opacity=this.checked?'1':'0.4'"> Mostrar texto legal
            </label>
          </div>
          <div id="icfgFooterWrap" style="opacity:${s.showFooterNote?'1':'0.4'};margin-bottom:10px;">
            <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Nota personalizada al pie</label><textarea class="form-input" id="icfgFooter" rows="2" style="font-size:0.82rem;">${s.footerNote}</textarea></div>
          </div>
          <div id="icfgLegalWrap" style="opacity:${s.showLegalText?'1':'0.4'};">
            <div class="form-group" style="margin-bottom:0;"><label style="font-size:0.75rem;">Texto legal</label><textarea class="form-input" id="icfgLegal" rows="3" style="font-size:0.82rem;">${s.legalText||''}</textarea></div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top:20px;">
      <button class="btn btn-primary" onclick="adminSaveInvoiceConfig()">Guardar Configuración</button>
    </div>
  `;
}

function adminSaveInvoiceConfig() {
  const s = APP.invoiceSettings;
  s.companyName = document.getElementById('icfgName')?.value || s.companyName;
  s.companyNIF = document.getElementById('icfgNIF')?.value || s.companyNIF;
  s.companyAddress = document.getElementById('icfgAddress')?.value || s.companyAddress;
  s.companyCity = document.getElementById('icfgCity')?.value || s.companyCity;
  s.companyPostal = document.getElementById('icfgPostal')?.value || s.companyPostal;
  s.companyPhone = document.getElementById('icfgPhone')?.value || s.companyPhone;
  s.companyEmail = document.getElementById('icfgEmail')?.value || s.companyEmail;
  s.invoicePrefix = document.getElementById('icfgPrefix')?.value || s.invoicePrefix;
  s.nextNumber = parseInt(document.getElementById('icfgNextNum')?.value) || s.nextNumber;
  s.taxRate = parseFloat(document.getElementById('icfgTaxRate')?.value) || s.taxRate;
  s.taxLabel = document.getElementById('icfgTaxLabel')?.value || s.taxLabel;
  s.paymentTerms = document.getElementById('icfgPayTerms')?.value || s.paymentTerms;
  s.bankAccount = document.getElementById('icfgBank')?.value || s.bankAccount;
  s.logoText = document.getElementById('icfgLogoText')?.value || s.logoText;
  s.footerNote = document.getElementById('icfgFooter')?.value || s.footerNote;
  s.legalText = document.getElementById('icfgLegal')?.value ?? s.legalText;
  s.showFooterNote = document.getElementById('icfgShowFooter')?.checked ?? s.showFooterNote;
  s.showLegalText = document.getElementById('icfgShowLegal')?.checked ?? s.showLegalText;
  showToast('Configuración de facturas guardada');
}

function adminUploadLogo(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 500000) { showToast('La imagen es demasiado grande (máx 500KB)'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    APP.invoiceSettings.logoImage = e.target.result;
    showToast('Logo cargado correctamente');
    adminInvoiceConfig(); // re-render to show preview
  };
  reader.readAsDataURL(file);
}

function adminRemoveLogo() {
  APP.invoiceSettings.logoImage = '';
  showToast('Logo eliminado');
  adminInvoiceConfig();
}

// ===== INVOICE PREVIEW =====
function adminPreviewInvoice(idx) {
  const inv = APP.invoices[idx];
  adminRenderInvoicePreview(inv, 'invoice');
}

function adminPreviewInvoiceTemplate() {
  // Save config first
  adminSaveInvoiceConfig();
  const sample = {
    id: APP.invoiceSettings.invoicePrefix + '-0001',
    date: new Date().toLocaleDateString('es-ES'),
    user: 'cliente@ejemplo.com',
    concept: 'Servicio de impresión 3D — PLA',
    material: 'PLA',
    total: '50.00',
    taxRate: APP.invoiceSettings.taxRate,
    taxAmount: (50 * APP.invoiceSettings.taxRate / 100).toFixed(2),
    totalWithTax: (50 + 50 * APP.invoiceSettings.taxRate / 100).toFixed(2),
    clientName: 'Juan Ejemplo García',
    clientNIF: '12345678A',
    clientAddress: 'Calle Ejemplo 10, 19001 Guadalajara',
    status: 'pending'
  };
  adminRenderInvoicePreview(sample, 'invoice');
}

function adminRenderInvoicePreview(inv, docType) {
  const s = APP.invoiceSettings;
  const isQuote = docType === 'quote';
  const docTitle = isQuote ? 'PRESUPUESTO' : 'FACTURA';
  const subtotal = parseFloat(inv.total || 0);
  const taxRate = inv.taxRate !== undefined ? inv.taxRate : s.taxRate;
  const taxAmount = inv.taxAmount !== undefined ? parseFloat(inv.taxAmount) : (subtotal * taxRate / 100);
  const totalWithTax = inv.totalWithTax !== undefined ? parseFloat(inv.totalWithTax) : (subtotal + taxAmount);
  const statusNames = isQuote
    ? { pending:'Pendiente de confirmación', approved:'Aprobado', rejected:'Rechazado', invoiced:'Facturado', cancelled:'Anulado' }
    : { pending:'Pendiente de pago', paid:'Pagada', overdue:'Vencida', cancelled:'Anulada' };

  const logoHtml = s.logoImage
    ? `<img src="${s.logoImage}" style="max-height:60px;max-width:180px;margin-bottom:6px;">`
    : `<h1 style="font-family:'Orbitron',sans-serif;font-size:1.4rem;color:#0a0a1a;margin:0 0 4px;">${s.logoText}</h1>`;

  let footerHtml = '';
  if (s.showFooterNote && s.footerNote) {
    footerHtml += `<p style="font-size:0.75rem;color:#999;margin:2px 0;">${s.footerNote}</p>`;
  }
  if (s.showLegalText && s.legalText) {
    footerHtml += `<p style="font-size:0.68rem;color:#bbb;margin:6px 0 0;font-style:italic;">${s.legalText}</p>`;
  }

  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">VISTA PREVIA DE ${docTitle}</h3>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-small" onclick="showAdminSection('${isQuote?'quotesmgmt':'invoicesmgmt'}',document.querySelectorAll('.admin-nav-btn')[${isQuote?2:3}])">Volver</button>
      </div>
    </div>

    <div style="max-width:700px;margin:0 auto;background:#fff;color:#222;border-radius:8px;padding:40px;font-family:'Exo 2',sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.3);">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #00f0ff;">
        <div>
          ${logoHtml}
          <p style="font-size:0.78rem;color:#666;margin:2px 0;">${s.companyName}</p>
          <p style="font-size:0.78rem;color:#666;margin:2px 0;">NIF: ${s.companyNIF}</p>
          <p style="font-size:0.78rem;color:#666;margin:2px 0;">${s.companyAddress}</p>
          <p style="font-size:0.78rem;color:#666;margin:2px 0;">${s.companyCity} · ${s.companyPostal}</p>
          <p style="font-size:0.78rem;color:#666;margin:2px 0;">${s.companyPhone} · ${s.companyEmail}</p>
        </div>
        <div style="text-align:right;">
          <h2 style="font-family:'Orbitron',sans-serif;font-size:1.1rem;color:#00b8cc;margin:0 0 8px;">${docTitle}</h2>
          <p style="font-size:0.85rem;color:#333;margin:2px 0;"><strong>Nº:</strong> ${inv.id}</p>
          <p style="font-size:0.85rem;color:#333;margin:2px 0;"><strong>Fecha:</strong> ${inv.date}</p>
          <p style="font-size:0.85rem;color:#333;margin:2px 0;"><strong>Estado:</strong> ${statusNames[inv.status]||inv.status}</p>
          ${isQuote && inv.validUntil ? `<p style="font-size:0.85rem;color:#333;margin:2px 0;"><strong>Válido hasta:</strong> ${inv.validUntil}</p>` : ''}
        </div>
      </div>

      <!-- Client -->
      <div style="background:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:24px;">
        <p style="font-family:'Orbitron',sans-serif;font-size:0.7rem;color:#999;margin-bottom:6px;">DATOS DEL CLIENTE</p>
        <p style="font-size:0.9rem;color:#222;margin:2px 0;"><strong>${inv.clientName||inv.user}</strong></p>
        ${inv.clientNIF ? `<p style="font-size:0.82rem;color:#555;margin:2px 0;">NIF: ${inv.clientNIF}</p>` : ''}
        <p style="font-size:0.82rem;color:#555;margin:2px 0;">${inv.user}</p>
        ${inv.clientAddress ? `<p style="font-size:0.82rem;color:#555;margin:2px 0;">${inv.clientAddress}</p>` : ''}
      </div>

      <!-- Description for quotes -->
      ${inv.description ? `<div style="margin-bottom:16px;padding:12px;background:#fafafa;border-radius:6px;border-left:3px solid #00b8cc;"><p style="font-size:0.82rem;color:#444;"><strong>Descripción:</strong> ${inv.description}</p></div>` : ''}

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#0a0a1a;color:#fff;">
            <th style="padding:10px 12px;text-align:left;font-family:'Orbitron',sans-serif;font-size:0.72rem;">CONCEPTO</th>
            <th style="padding:10px 12px;text-align:left;font-family:'Orbitron',sans-serif;font-size:0.72rem;">MATERIAL</th>
            ${inv.dimensions ? `<th style="padding:10px 12px;text-align:left;font-family:'Orbitron',sans-serif;font-size:0.72rem;">DIMENSIONES</th>` : ''}
            <th style="padding:10px 12px;text-align:right;font-family:'Orbitron',sans-serif;font-size:0.72rem;">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #e0e0e0;">
            <td style="padding:12px;font-size:0.85rem;">${inv.concept||inv.description||'Servicio de impresión 3D'}</td>
            <td style="padding:12px;font-size:0.85rem;">${inv.material||'—'}</td>
            ${inv.dimensions ? `<td style="padding:12px;font-size:0.85rem;">${inv.dimensions.w}×${inv.dimensions.h}×${inv.dimensions.d} mm</td>` : ''}
            <td style="padding:12px;font-size:0.85rem;text-align:right;">${subtotal.toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;">
        <div style="width:250px;">
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.85rem;">
            <span style="color:#666;">Subtotal:</span>
            <span>${subtotal.toFixed(2)} €</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.85rem;">
            <span style="color:#666;">${s.taxLabel} (${taxRate}%):</span>
            <span>${taxAmount.toFixed(2)} €</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #0a0a1a;font-size:1.05rem;font-weight:700;">
            <span>TOTAL:</span>
            <span style="color:#00b8cc;">${totalWithTax.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <!-- Payment info -->
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;">
        <p style="font-size:0.78rem;color:#666;margin:2px 0;"><strong>${isQuote?'Validez':'Condiciones de pago'}:</strong> ${isQuote?(inv.validUntil||'30 días'):s.paymentTerms}</p>
        ${!isQuote ? `<p style="font-size:0.78rem;color:#666;margin:2px 0;"><strong>Cuenta bancaria:</strong> ${s.bankAccount}</p>` : ''}
      </div>

      <!-- Footer -->
      ${footerHtml ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;text-align:center;">${footerHtml}</div>` : ''}
    </div>
  `;
}

function adminAddInvoice() {
  const s = APP.invoiceSettings;
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">NUEVA FACTURA</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('invoicesmgmt',document.querySelectorAll('.admin-nav-btn')[3])">Cancelar</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:650px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>Cliente (email)</label><input type="text" class="form-input" id="invUser" placeholder="email@ejemplo.com"></div>
        <div class="form-group"><label>Nombre del cliente</label><input type="text" class="form-input" id="invClientName" placeholder="Nombre completo"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>NIF/DNI</label><input type="text" class="form-input" id="invClientNIF" placeholder="12345678A"></div>
        <div class="form-group"><label>Dirección facturación</label><input type="text" class="form-input" id="invClientAddress" placeholder="Dirección completa"></div>
      </div>
      <div class="form-group"><label>Concepto</label><input type="text" class="form-input" id="invConcept" placeholder="Descripción del servicio"></div>
      <div class="form-group"><label>Material</label>
        <select class="form-select" id="invMaterial">
          ${Object.keys(APP.materials).map(m=>`<option value="${m}">${m}</option>`).join('')}
          ${Object.keys(APP.specialMaterials).map(m=>`<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>Subtotal (€)</label><input type="number" class="form-input" id="invTotal" value="0" min="0" step="0.01" oninput="adminCalcInvoiceTax()"></div>
        <div class="form-group"><label>${s.taxLabel} (${s.taxRate}%)</label><input type="text" class="form-input" id="invTaxDisplay" value="0.00€" readonly style="background:var(--surface);"></div>
      </div>
      <div style="padding:10px;background:var(--surface);border-radius:var(--radius);margin-bottom:12px;text-align:right;">
        <span style="font-size:0.85rem;color:var(--text2);">Total con ${s.taxLabel}: </span>
        <span style="font-family:var(--font-display);font-size:1.1rem;color:var(--cyan);" id="invTotalWithTax">0.00€</span>
      </div>
      <div class="form-group"><label>Notas</label><textarea class="form-input" id="invNotes" rows="2" placeholder="Notas adicionales (opcional)"></textarea></div>
      <button class="btn btn-primary" onclick="adminSaveNewInvoice()" style="margin-top:8px;">Guardar Factura y Enviar Email</button>
    </div>
  `;
}

function adminCalcInvoiceTax() {
  const s = APP.invoiceSettings;
  const subtotal = parseFloat(document.getElementById('invTotal')?.value || 0);
  const tax = subtotal * s.taxRate / 100;
  const total = subtotal + tax;
  const taxEl = document.getElementById('invTaxDisplay');
  const totalEl = document.getElementById('invTotalWithTax');
  if (taxEl) taxEl.value = tax.toFixed(2) + '€';
  if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
}

function adminSaveNewInvoice() {
  const s = APP.invoiceSettings;
  const user = document.getElementById('invUser')?.value?.trim();
  const clientName = document.getElementById('invClientName')?.value?.trim();
  const clientNIF = document.getElementById('invClientNIF')?.value?.trim();
  const clientAddress = document.getElementById('invClientAddress')?.value?.trim();
  const concept = document.getElementById('invConcept')?.value?.trim();
  const material = document.getElementById('invMaterial')?.value;
  const subtotal = parseFloat(document.getElementById('invTotal')?.value || 0);
  const notes = document.getElementById('invNotes')?.value?.trim();
  if (!user) { showToast('Introduce el email del cliente'); return; }
  if (subtotal <= 0) { showToast('Introduce un importe válido'); return; }

  const taxAmount = subtotal * s.taxRate / 100;
  const totalWithTax = subtotal + taxAmount;
  const invoiceId = s.invoicePrefix + '-' + String(s.nextNumber).padStart(4,'0');
  s.nextNumber++;

  APP.invoices.push({
    id: invoiceId,
    quoteId: null,
    user: user,
    clientName: clientName || user,
    clientNIF: clientNIF || '',
    clientAddress: clientAddress || '',
    concept: concept || 'Servicio de impresión 3D',
    material: material,
    total: subtotal.toFixed(2),
    taxRate: s.taxRate,
    taxAmount: taxAmount.toFixed(2),
    totalWithTax: totalWithTax.toFixed(2),
    date: new Date().toLocaleDateString('es-ES'),
    status: 'pending',
    notes: notes || ''
  });
  simulateEmail(user, 'newInvoice', { nombre: clientName || user, id: invoiceId, total: totalWithTax.toFixed(2), fecha: new Date().toLocaleDateString('es-ES') });
  simulateEmail(APP.adminSettings.adminEmail, 'newInvoice', { nombre: clientName || user, id: invoiceId, total: totalWithTax.toFixed(2), fecha: new Date().toLocaleDateString('es-ES') }, { adminOnly: true });
  showToast('Factura ' + invoiceId + ' creada y email enviado');
  showAdminSection('invoicesmgmt', document.querySelectorAll('.admin-nav-btn')[3]);
}

function adminEditInvoice(idx) {
  const inv = APP.invoices[idx];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>EDITAR FACTURA <span style="color:var(--cyan)">${inv.id}</span></h3>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:600px;">
      <div class="form-group">
        <label>Cliente (email)</label>
        <input type="text" class="form-input" id="invEditUser" value="${inv.user}">
      </div>
      <div class="form-group">
        <label>Concepto</label>
        <input type="text" class="form-input" id="invEditConcept" value="${inv.concept||''}">
      </div>
      <div class="form-group">
        <label>Material</label>
        <select class="form-select" id="invEditMaterial">
          ${Object.keys(APP.materials).map(m=>`<option value="${m}" ${inv.material===m?'selected':''}>${m}</option>`).join('')}
          ${Object.keys(APP.specialMaterials).map(m=>`<option value="${m}" ${inv.material===m?'selected':''}>${m}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Total (€)</label>
        <input type="number" class="form-input" id="invEditTotal" value="${inv.total}" min="0" step="0.01">
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea class="form-input" id="invEditNotes" rows="3">${inv.notes||''}</textarea>
      </div>
      <div class="form-group">
        <label>Estado</label>
        <select class="form-select" id="invEditStatus">
          <option value="pending" ${inv.status==='pending'?'selected':''}>Pendiente</option>
          <option value="paid" ${inv.status==='paid'?'selected':''}>Pagada</option>
          <option value="overdue" ${inv.status==='overdue'?'selected':''}>Vencida</option>
          <option value="cancelled" ${inv.status==='cancelled'?'selected':''}>Anulada</option>
        </select>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="btn btn-primary" onclick="adminSaveEditedInvoice(${idx})">Guardar Cambios</button>
        <button class="btn btn-secondary" onclick="showAdminSection('invoicesmgmt',document.querySelectorAll('.admin-nav-btn')[3])">Cancelar</button>
      </div>
    </div>
  `;
}

function adminSaveEditedInvoice(idx) {
  const user = document.getElementById('invEditUser')?.value?.trim();
  const concept = document.getElementById('invEditConcept')?.value?.trim();
  const material = document.getElementById('invEditMaterial')?.value;
  const total = document.getElementById('invEditTotal')?.value;
  const notes = document.getElementById('invEditNotes')?.value?.trim();
  const status = document.getElementById('invEditStatus')?.value;
  if (!user) { showToast('Introduce el email del cliente'); return; }

  APP.invoices[idx].user = user;
  APP.invoices[idx].concept = concept;
  APP.invoices[idx].material = material;
  APP.invoices[idx].total = parseFloat(total).toFixed(2);
  APP.invoices[idx].notes = notes;
  APP.invoices[idx].status = status;
  const inv = APP.invoices[idx];
  simulateEmail(inv.user, 'invoiceModified', { nombre: inv.clientName || inv.user, id: inv.id });
  simulateEmail(APP.adminSettings.adminEmail, 'invoiceModified', { nombre: inv.clientName || inv.user, id: inv.id }, { adminOnly: true });
  showToast('Factura actualizada');
  showAdminSection('invoicesmgmt', document.querySelectorAll('.admin-nav-btn')[3]);
}

function adminAnnulInvoice(idx) {
  if (confirm('¿Anular la factura ' + APP.invoices[idx].id + '?')) {
    APP.invoices[idx].status = 'cancelled';
    const inv = APP.invoices[idx];
    const statusNames = { pending:'Pendiente', paid:'Pagada', overdue:'Vencida', cancelled:'Anulada' };
    simulateEmail(inv.user, 'invoiceStatusChanged', { nombre: inv.clientName || inv.user, id: inv.id, estado: 'Anulada' });
    simulateEmail(APP.adminSettings.adminEmail, 'invoiceStatusChanged', { nombre: inv.clientName || inv.user, id: inv.id, estado: 'Anulada' }, { adminOnly: true });
    showToast('Factura anulada');
    showAdminSection('invoicesmgmt', document.querySelectorAll('.admin-nav-btn')[3]);
  }
}

function adminDeleteInvoice(idx) {
  if (confirm('¿Eliminar permanentemente la factura ' + APP.invoices[idx].id + '?')) {
    const inv = APP.invoices[idx];
    simulateEmail(inv.user, 'invoiceDeleted', { nombre: inv.clientName || inv.user, id: inv.id });
    simulateEmail(APP.adminSettings.adminEmail, 'invoiceDeleted', { nombre: inv.clientName || inv.user, id: inv.id }, { adminOnly: true });
    APP.invoices.splice(idx, 1);
    showToast('Factura eliminada');
    showAdminSection('invoicesmgmt', document.querySelectorAll('.admin-nav-btn')[3]);
  }
}

function updateInvoiceStatus(idx, status) {
  APP.invoices[idx].status = status;
  const inv = APP.invoices[idx];
  const statusNames = { pending:'Pendiente', paid:'Pagada', overdue:'Vencida', cancelled:'Anulada' };
  simulateEmail(inv.user, 'invoiceStatusChanged', { nombre: inv.clientName || inv.user, id: inv.id, estado: statusNames[status] || status });
  simulateEmail(APP.adminSettings.adminEmail, 'invoiceStatusChanged', { nombre: inv.clientName || inv.user, id: inv.id, estado: statusNames[status] || status }, { adminOnly: true });
  showToast('Estado de factura actualizado — guardado automáticamente');
}

function updateOrderStatus(idx, status) {
  APP.orders[idx].status = status;
  const o = APP.orders[idx];
  const statusNames = { awaiting_payment:'Esperando Pago', pending:'Pendiente', processing:'Procesando', shipped:'Enviado', completed:'Completado', cancelled:'Cancelado' };
  simulateEmail(o.user, 'orderStatusChanged', { nombre: o.clientName || o.user, id: o.id, estado: statusNames[status] || status });
  simulateEmail(APP.adminSettings.adminEmail, 'orderStatusChanged', { nombre: o.clientName || o.user, id: o.id, estado: statusNames[status] || status }, { adminOnly: true });
  if (status === 'cancelled') {
    simulateEmail(o.user, 'orderCancelled', { nombre: o.clientName || o.user, id: o.id });
  }
  showToast('Estado actualizado — guardado automáticamente');
}

// ===== SHOP MANAGEMENT =====
function renderAdminShop() {
  const cats = APP.shopCategories || [];
  return `
    <h3>GESTIÓN DE TIENDA ONLINE</h3>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center;">
      <button class="btn btn-primary btn-small" onclick="adminAddProduct()">+ Nuevo Producto</button>
      <button class="btn btn-secondary btn-small" onclick="adminShopCategories()">Categorías</button>
      <p style="color:var(--text2);font-size:0.85rem;margin:0 0 0 auto;">Productos: <span style="color:var(--cyan);font-family:var(--font-display);">${APP.products.length}</span> — Categorías: <span style="color:var(--cyan);font-family:var(--font-display);">${cats.length}</span></p>
    </div>

    <!-- Filter by category -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
      <button class="btn btn-secondary btn-small" style="font-size:0.75rem;" onclick="adminFilterProducts('all')">Todos</button>
      ${cats.map(c=>`<button class="btn btn-secondary btn-small" style="font-size:0.75rem;" onclick="adminFilterProducts('${c.id}')">${c.icon} ${c.name}</button>`).join('')}
    </div>

    <div class="table-responsive"><table class="data-table" id="adminProductsTable">
      <thead><tr><th></th><th>NOMBRE</th><th>CATEGORÍA</th><th>MATERIAL</th><th>PRECIO</th><th>DESCRIPCIÓN</th><th>ACCIONES</th></tr></thead>
      <tbody>${APP.products.map((p,i)=>{
        const cat = cats.find(c=>c.id===p.category);
        return `<tr data-cat="${p.category}">
        <td style="font-size:1.3rem;text-align:center;">${p.icon}</td>
        <td style="font-size:0.85rem;font-weight:600;">${p.name}</td>
        <td style="font-size:0.8rem;">${cat ? cat.icon+' '+cat.name : p.category}</td>
        <td style="font-family:var(--font-display);font-size:0.78rem;">${p.material}</td>
        <td style="font-family:var(--font-display);color:var(--cyan);">${p.price.toFixed(2)}€</td>
        <td style="font-size:0.78rem;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2);">${p.desc}</td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-small" onclick="adminEditProduct(${i})" style="font-size:0.72rem;padding:3px 7px;">Modificar</button>
            <button class="btn btn-danger btn-small" onclick="adminDeleteProduct(${i})" style="font-size:0.72rem;padding:3px 7px;">Eliminar</button>
          </div>
        </td>
      </tr>`}).join('')}</tbody>
    </table></div>
  `;
}

function adminFilterProducts(cat) {
  const rows = document.querySelectorAll('#adminProductsTable tbody tr');
  rows.forEach(row => {
    row.style.display = (cat === 'all' || row.dataset.cat === cat) ? '' : 'none';
  });
}

function adminAddProduct() {
  const cats = APP.shopCategories || [];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">NUEVO PRODUCTO</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('shopmgmt',document.querySelectorAll('.admin-nav-btn')[6])">Cancelar</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:650px;">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;">
        <div class="form-group"><label>Nombre del producto</label><input type="text" class="form-input" id="npName" placeholder="Ej: Soporte para Móvil"></div>
        <div class="form-group"><label>Icono (emoji)</label><input type="text" class="form-input" id="npIcon" value="📦" style="font-size:1.2rem;text-align:center;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>Categoría</label>
          <select class="form-select" id="npCategory">
            ${cats.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Material</label>
          <select class="form-select" id="npMaterial">
            ${Object.keys(APP.materials).map(m=>`<option value="${m}">${m}</option>`).join('')}
            ${Object.keys(APP.specialMaterials).map(m=>`<option value="${m}">${m}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group"><label>Precio (€)</label><input type="number" class="form-input" id="npPrice" value="0" min="0" step="0.50"></div>
      <div class="form-group"><label>Descripción</label><textarea class="form-input" id="npDesc" rows="3" placeholder="Descripción del producto..."></textarea></div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px;">
        <h4 style="font-family:var(--font-heading);font-size:0.85rem;margin-bottom:8px;">Vista previa</h4>
        <div style="display:flex;gap:16px;align-items:center;" id="npPreview">
          <span style="font-size:2.2rem;" id="npPreviewIcon">📦</span>
          <div>
            <p style="font-size:0.95rem;font-weight:600;" id="npPreviewName">Nuevo Producto</p>
            <p style="font-size:0.82rem;color:var(--text2);" id="npPreviewDesc">Descripción del producto</p>
            <p style="font-family:var(--font-display);color:var(--cyan);" id="npPreviewPrice">0.00€</p>
          </div>
        </div>
      </div>

      <button class="btn btn-primary" onclick="adminSaveNewProduct()">Crear Producto</button>
    </div>
    <script>
      document.getElementById('npName').addEventListener('input',function(){document.getElementById('npPreviewName').textContent=this.value||'Nuevo Producto';});
      document.getElementById('npIcon').addEventListener('input',function(){document.getElementById('npPreviewIcon').textContent=this.value||'📦';});
      document.getElementById('npDesc').addEventListener('input',function(){document.getElementById('npPreviewDesc').textContent=this.value||'Descripción';});
      document.getElementById('npPrice').addEventListener('input',function(){document.getElementById('npPreviewPrice').textContent=(parseFloat(this.value)||0).toFixed(2)+'€';});
    </script>
  `;
}

function adminSaveNewProduct() {
  const name = document.getElementById('npName')?.value?.trim();
  const icon = document.getElementById('npIcon')?.value?.trim() || '📦';
  const category = document.getElementById('npCategory')?.value;
  const material = document.getElementById('npMaterial')?.value;
  const price = parseFloat(document.getElementById('npPrice')?.value || 0);
  const desc = document.getElementById('npDesc')?.value?.trim();

  if (!name) { showToast('Introduce el nombre del producto'); return; }
  if (price <= 0) { showToast('Introduce un precio válido'); return; }

  const newId = APP.products.length > 0 ? Math.max(...APP.products.map(p=>p.id)) + 1 : 1;
  APP.products.push({ id: newId, name, category, material, price, icon, desc: desc || '' });
  showToast('Producto "' + name + '" creado correctamente');
  showAdminSection('shopmgmt', document.querySelectorAll('.admin-nav-btn')[6]);
}

function adminEditProduct(idx) {
  const p = APP.products[idx];
  const cats = APP.shopCategories || [];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">MODIFICAR PRODUCTO <span style="color:var(--cyan)">${p.name}</span></h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('shopmgmt',document.querySelectorAll('.admin-nav-btn')[6])">Cancelar</button>
    </div>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:650px;">
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px;">
        <div class="form-group"><label>Nombre</label><input type="text" class="form-input" id="epName" value="${p.name}"></div>
        <div class="form-group"><label>Icono</label><input type="text" class="form-input" id="epIcon" value="${p.icon}" style="font-size:1.2rem;text-align:center;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>Categoría</label>
          <select class="form-select" id="epCategory">
            ${cats.map(c=>`<option value="${c.id}" ${p.category===c.id?'selected':''}>${c.icon} ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Material</label>
          <select class="form-select" id="epMaterial">
            ${Object.keys(APP.materials).map(m=>`<option value="${m}" ${p.material===m?'selected':''}>${m}</option>`).join('')}
            ${Object.keys(APP.specialMaterials).map(m=>`<option value="${m}" ${p.material===m?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group"><label>Precio (€)</label><input type="number" class="form-input" id="epPrice" value="${p.price}" min="0" step="0.50"></div>
      <div class="form-group"><label>Descripción</label><textarea class="form-input" id="epDesc" rows="3">${p.desc}</textarea></div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px;">
        <h4 style="font-family:var(--font-heading);font-size:0.85rem;margin-bottom:8px;">Vista previa del producto</h4>
        <div style="display:flex;gap:16px;align-items:center;">
          <span style="font-size:2.2rem;">${p.icon}</span>
          <div>
            <p style="font-size:0.95rem;font-weight:600;">${p.name}</p>
            <p style="font-size:0.82rem;color:var(--text2);">${p.desc}</p>
            <p style="font-family:var(--font-display);color:var(--cyan);">${p.price.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      <button class="btn btn-primary" onclick="adminSaveEditedProduct(${idx})">Guardar Cambios</button>
    </div>
  `;
}

function adminSaveEditedProduct(idx) {
  const name = document.getElementById('epName')?.value?.trim();
  const icon = document.getElementById('epIcon')?.value?.trim() || '📦';
  const category = document.getElementById('epCategory')?.value;
  const material = document.getElementById('epMaterial')?.value;
  const price = parseFloat(document.getElementById('epPrice')?.value || 0);
  const desc = document.getElementById('epDesc')?.value?.trim();

  if (!name) { showToast('El nombre es obligatorio'); return; }
  if (price <= 0) { showToast('Introduce un precio válido'); return; }

  APP.products[idx].name = name;
  APP.products[idx].icon = icon;
  APP.products[idx].category = category;
  APP.products[idx].material = material;
  APP.products[idx].price = price;
  APP.products[idx].desc = desc || '';
  showToast('Producto "' + name + '" actualizado');
  showAdminSection('shopmgmt', document.querySelectorAll('.admin-nav-btn')[6]);
}

function adminDeleteProduct(idx) {
  const p = APP.products[idx];
  if (!confirm('¿Eliminar el producto "' + p.name + '"? Se eliminará de la tienda.')) return;
  APP.products.splice(idx, 1);
  showToast('Producto eliminado');
  showAdminSection('shopmgmt', document.querySelectorAll('.admin-nav-btn')[6]);
}

// ===== SHOP CATEGORIES MANAGEMENT =====
function adminShopCategories() {
  const cats = APP.shopCategories || [];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CATEGORÍAS DE TIENDA</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('shopmgmt',document.querySelectorAll('.admin-nav-btn')[6])">Volver a Tienda</button>
    </div>
    <p style="font-size:0.82rem;color:var(--text2);margin-bottom:16px;">Gestiona las categorías de productos. Los productos se organizan por estas categorías en la tienda online. Si eliminas una categoría, los productos asignados mantendrán su categoría actual.</p>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-bottom:24px;">
      ${cats.map((c,i) => {
        const productCount = APP.products.filter(p=>p.category===c.id).length;
        return `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:1.5rem;">${c.icon}</span>
            <div style="display:flex;gap:4px;align-items:center;">
              <span style="font-size:0.72rem;color:var(--text3);font-family:var(--font-display);">${productCount} productos</span>
              <button class="btn btn-danger btn-small" onclick="adminDeleteShopCategory(${i})" style="font-size:0.68rem;padding:2px 6px;">Eliminar</button>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">ID</label>
            <input type="text" class="form-input" value="${c.id}" onchange="adminUpdateShopCategoryField(${i},'id',this.value)" style="font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">Nombre</label>
            <input type="text" class="form-input" value="${c.name}" onchange="adminUpdateShopCategoryField(${i},'name',this.value)" style="font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.72rem;">Icono (emoji)</label>
            <input type="text" class="form-input" value="${c.icon}" onchange="adminUpdateShopCategoryField(${i},'icon',this.value)" style="font-size:0.82rem;width:60px;">
          </div>
        </div>`;
      }).join('')}
    </div>

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">
      <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;">Añadir Nueva Categoría</h4>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">
        <div class="form-group" style="margin-bottom:0;min-width:100px;">
          <label style="font-size:0.72rem;">ID</label>
          <input type="text" class="form-input" id="newShopCatId" placeholder="ej: juguetes" style="font-size:0.82rem;">
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:160px;flex:1;">
          <label style="font-size:0.72rem;">Nombre</label>
          <input type="text" class="form-input" id="newShopCatName" placeholder="Juguetes" style="font-size:0.82rem;">
        </div>
        <div class="form-group" style="margin-bottom:0;width:60px;">
          <label style="font-size:0.72rem;">Icono</label>
          <input type="text" class="form-input" id="newShopCatIcon" value="🏷️" style="font-size:0.82rem;">
        </div>
        <button class="btn btn-primary btn-small" onclick="adminAddShopCategory()" style="height:40px;">Añadir</button>
      </div>
    </div>
  `;
}

function adminUpdateShopCategoryField(idx, field, value) {
  const oldId = APP.shopCategories[idx].id;
  APP.shopCategories[idx][field] = value;
  // If changing ID, update products that reference the old ID
  if (field === 'id' && oldId !== value) {
    APP.products.forEach(p => { if (p.category === oldId) p.category = value; });
  }
  showToast('Categoría actualizada');
}

function adminDeleteShopCategory(idx) {
  if (!confirm('¿Eliminar la categoría "' + APP.shopCategories[idx].name + '"?')) return;
  APP.shopCategories.splice(idx, 1);
  showToast('Categoría eliminada');
  adminShopCategories();
}

function adminAddShopCategory() {
  const id = document.getElementById('newShopCatId')?.value?.trim();
  const name = document.getElementById('newShopCatName')?.value?.trim();
  const icon = document.getElementById('newShopCatIcon')?.value?.trim() || '🏷️';
  if (!id || !name) { showToast('ID y nombre son obligatorios'); return; }
  if (APP.shopCategories.find(c=>c.id===id)) { showToast('Ya existe una categoría con ese ID'); return; }
  APP.shopCategories.push({ id, name, icon });
  showToast('Categoría "' + name + '" añadida');
  adminShopCategories();
}

function renderAdminTracking() {
  const shippedOrders = APP.orders.filter(o => o.status === 'shipped');
  return `
    <h3>SEGUIMIENTO DE ENVÍOS</h3>

    <!-- Assign tracking to orders -->
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:24px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:12px;">Asignar número de seguimiento</h4>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
        <div class="form-group" style="min-width:160px;margin-bottom:0;">
          <label>Pedido</label>
          <select class="form-select" id="adminTrackOrder">
            <option value="">Seleccionar pedido...</option>
            ${APP.orders.filter(o=>o.status==='shipped'||o.status==='processing').map(o => `<option value="${o.id}">${o.id} — ${o.user}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="min-width:130px;margin-bottom:0;">
          <label>Transportista</label>
          <select class="form-select" id="adminTrackCarrier">
            <option value="GLS">GLS</option>
            <option value="UPS">UPS</option>
            <option value="SEUR">SEUR</option>
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:180px;margin-bottom:0;">
          <label>Nº Seguimiento</label>
          <input type="text" class="form-input" id="adminTrackNumber" placeholder="Número de seguimiento">
        </div>
        <button class="btn btn-primary btn-small" onclick="adminAssignTracking()" style="height:44px;">Asignar</button>
      </div>
    </div>

    <!-- Search tracking -->
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:24px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:12px;">Buscar envío por número de seguimiento</h4>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">
        <div class="form-group" style="flex:1;min-width:200px;margin-bottom:0;">
          <label>Número de seguimiento</label>
          <input type="text" class="form-input" id="adminSearchTrack" placeholder="Ej: 1Z999AA10123456784">
        </div>
        <div class="form-group" style="min-width:130px;margin-bottom:0;">
          <label>Transportista</label>
          <select class="form-select" id="adminSearchCarrier">
            <option value="GLS">GLS</option>
            <option value="UPS">UPS</option>
            <option value="SEUR">SEUR</option>
          </select>
        </div>
        <button class="btn btn-secondary btn-small" onclick="adminSearchTracking()" style="height:44px;">Buscar</button>
      </div>
      <div id="adminTrackResult" style="margin-top:16px;display:none;"></div>
    </div>

    <!-- List of shipped orders with tracking -->
    <h4 style="font-family:var(--font-display);font-size:0.8rem;letter-spacing:1px;color:var(--text3);margin-bottom:12px;">PEDIDOS ENVIADOS</h4>
    ${shippedOrders.length === 0 ? `
      <div style="text-align:center;padding:28px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);">
        <p style="color:var(--text3);font-size:0.88rem;">No hay pedidos enviados actualmente. Cambia el estado de un pedido a "Enviado" y asígnale un número de seguimiento.</p>
      </div>
    ` : `
    <div class="table-responsive"><table class="data-table">
      <thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>FECHA</th><th>TRANSPORTISTA</th><th>Nº SEGUIMIENTO</th><th>ACCIONES</th></tr></thead>
      <tbody>${shippedOrders.map(o => `<tr>
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${o.id}</td>
        <td style="font-size:0.82rem;">${o.user}</td>
        <td>${o.date}</td>
        <td><span style="font-family:var(--font-display);font-size:0.78rem;">${o.carrier||'Sin asignar'}</span></td>
        <td style="font-size:0.85rem;">${o.trackingNumber||'—'}</td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${o.trackingNumber && o.carrier ? `
              <button class="btn btn-primary btn-small" onclick="openTrackingUrl('${o.carrier}','${o.trackingNumber}')">Rastrear</button>
            ` : ''}
            <button class="btn btn-danger btn-small" onclick="adminRemoveTracking('${o.id}')">Quitar</button>
          </div>
        </td>
      </tr>`).join('')}</tbody>
    </table></div>`}
  `;
}

function adminAssignTracking() {
  const orderId = document.getElementById('adminTrackOrder')?.value;
  const carrier = document.getElementById('adminTrackCarrier')?.value;
  const trackNum = document.getElementById('adminTrackNumber')?.value?.trim();

  if (!orderId) { showToast('Selecciona un pedido'); return; }
  if (!trackNum) { showToast('Introduce el número de seguimiento'); return; }

  const order = APP.orders.find(o => o.id === orderId);
  if (order) {
    order.carrier = carrier;
    order.trackingNumber = trackNum;
    order.status = 'shipped';
    showToast('Seguimiento asignado: ' + carrier + ' — ' + trackNum);
    showAdminSection('tracking', document.querySelector('.admin-nav-btn.active'));
  }
}

function adminSearchTracking() {
  const num = document.getElementById('adminSearchTrack')?.value?.trim();
  const carrier = document.getElementById('adminSearchCarrier')?.value;
  const resultDiv = document.getElementById('adminTrackResult');
  if (!num) { showToast('Introduce un número de seguimiento'); return; }

  // Check if this tracking number is associated with a local order
  const matchedOrder = APP.orders.find(o => o.trackingNumber === num);

  resultDiv.style.display = 'block';
  if (matchedOrder) {
    resultDiv.innerHTML = `
      <div style="padding:16px;background:var(--surface);border:1px solid var(--cyan);border-radius:var(--radius);">
        <p style="color:var(--cyan);font-family:var(--font-display);font-size:0.8rem;margin-bottom:8px;">PEDIDO ENCONTRADO</p>
        <p style="font-size:0.9rem;margin-bottom:4px;">Pedido: <strong style="color:var(--cyan);">${matchedOrder.id}</strong> — Cliente: ${matchedOrder.user}</p>
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:12px;">Transportista: ${matchedOrder.carrier||carrier} — Nº: ${num}</p>
        <button class="btn btn-primary btn-small" onclick="openTrackingUrl('${matchedOrder.carrier||carrier}','${num}')">Abrir Seguimiento en ${matchedOrder.carrier||carrier}</button>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div style="padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
        <p style="color:var(--warning);font-family:var(--font-display);font-size:0.8rem;margin-bottom:8px;">NO ENCONTRADO EN EL SISTEMA</p>
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:12px;">No hay pedidos registrados con ese número de seguimiento. Puedes buscarlo directamente en la web del transportista:</p>
        <button class="btn btn-secondary btn-small" onclick="openTrackingUrl('${carrier}','${num}')">Buscar en ${carrier}</button>
      </div>
    `;
  }
}

function adminRemoveTracking(orderId) {
  const order = APP.orders.find(o => o.id === orderId);
  if (order) {
    delete order.carrier;
    delete order.trackingNumber;
    showToast('Seguimiento eliminado del pedido ' + orderId);
    showAdminSection('tracking', document.querySelector('.admin-nav-btn.active'));
  }
}

function editOrder(idx) {
  editOrderFull(idx);
}

function deleteOrder(idx) {
  if (confirm('¿Eliminar pedido ' + APP.orders[idx].id + '?')) {
    const o = APP.orders[idx];
    simulateEmail(o.user, 'orderDeleted', { nombre: o.clientName || o.user, id: o.id });
    simulateEmail(APP.adminSettings.adminEmail, 'orderDeleted', { nombre: o.clientName || o.user, id: o.id }, { adminOnly: true });
    APP.orders.splice(idx, 1);
    showAdminSection('orders', document.querySelector('.admin-nav-btn.active'));
    showToast('Pedido eliminado');
  }
}

function renderAdminColors() {
  const colorNames = {
    '#FF0000':'Rojo','#00FF00':'Verde','#0066FF':'Azul','#FFFF00':'Amarillo',
    '#FF00FF':'Magenta','#00FFFF':'Cian','#FFFFFF':'Blanco','#000000':'Negro',
    '#FF6600':'Naranja','#8B4513':'Marrón','#808080':'Gris','#C0C0C0':'Plata'
  };
  function getColorName(hex) {
    if (colorNames[hex.toUpperCase()]) return colorNames[hex.toUpperCase()];
    return hex;
  }
  function isLight(hex) {
    const c = hex.replace('#','');
    const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
    return (r*0.299 + g*0.587 + b*0.114) > 160;
  }

  return `
    <h3>GESTIÓN DE COLORES</h3>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:24px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:8px;">Paleta de Colores Disponibles</h4>
      <p style="font-size:0.82rem;color:var(--text3);margin-bottom:16px;">Estos son los colores de filamento que los clientes pueden elegir al realizar sus pedidos. Puedes añadir nuevos colores, editar sus nombres o eliminarlos. Los cambios se reflejan inmediatamente en la tienda, editor 3D y formularios de presupuesto.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;">
        ${APP.colors.map((c,i) => `
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;text-align:center;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <div style="background:${c};height:70px;position:relative;display:flex;align-items:center;justify-content:center;">
              <span style="color:${isLight(c)?'#000':'#fff'};font-family:var(--font-display);font-size:0.7rem;text-shadow:0 0 4px rgba(0,0,0,0.5);">${c}</span>
              <button onclick="removeColor(${i})" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.5);color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:0.7rem;line-height:22px;">✕</button>
            </div>
            <div style="padding:8px;">
              <input type="text" value="${getColorName(c)}" onchange="adminRenameColor(${i},this.value)" style="background:transparent;border:1px solid var(--border);border-radius:4px;color:var(--text1);font-size:0.78rem;width:100%;text-align:center;padding:4px;" placeholder="Nombre">
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:24px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:8px;">Añadir Nuevo Color</h4>
      <p style="font-size:0.82rem;color:var(--text3);margin-bottom:12px;">Selecciona un color del selector o introduce el código hexadecimal directamente. Asegúrate de que el color corresponde a un filamento disponible en tu inventario.</p>
      <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap;">
        <div class="form-group" style="margin-bottom:0;">
          <label>Color</label>
          <input type="color" id="newColorInput" value="#FF5500" style="width:60px;height:44px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;">
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:120px;">
          <label>Código HEX</label>
          <input type="text" class="form-input" id="newColorHex" value="#FF5500" oninput="document.getElementById('newColorInput').value=this.value" placeholder="#FF5500">
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:120px;">
          <label>Nombre (opcional)</label>
          <input type="text" class="form-input" id="newColorName" placeholder="Ej: Turquesa">
        </div>
        <button class="btn btn-primary btn-small" onclick="addColor()" style="height:44px;">+ Añadir</button>
      </div>
    </div>

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">
      <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:8px;">Información</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
        <div style="padding:12px;background:var(--surface);border-radius:var(--radius);border-left:3px solid var(--cyan);">
          <p style="font-family:var(--font-display);font-size:0.75rem;color:var(--cyan);margin-bottom:4px;">TOTAL COLORES</p>
          <p style="font-size:1.4rem;font-family:var(--font-display);color:var(--text1);">${APP.colors.length}</p>
        </div>
        <div style="padding:12px;background:var(--surface);border-radius:var(--radius);border-left:3px solid var(--magenta);">
          <p style="font-family:var(--font-display);font-size:0.75rem;color:var(--magenta);margin-bottom:4px;">MULTI-COLOR</p>
          <p style="font-size:0.82rem;color:var(--text2);">Los clientes pueden elegir varios colores (+15% por cada color extra)</p>
        </div>
        <div style="padding:12px;background:var(--surface);border-radius:var(--radius);border-left:3px solid var(--success);">
          <p style="font-family:var(--font-display);font-size:0.75rem;color:var(--success);margin-bottom:4px;">SINCRONIZACIÓN</p>
          <p style="font-size:0.82rem;color:var(--text2);">Los cambios se aplican automáticamente en toda la web</p>
        </div>
      </div>
    </div>
  `;
}

// Color name storage
if (!window._colorNames) window._colorNames = {};

function adminRenameColor(idx, name) {
  window._colorNames[APP.colors[idx]] = name;
  showToast('Nombre de color actualizado');
}

function addColor() {
  const colorInput = document.getElementById('newColorInput').value;
  const hexInput = document.getElementById('newColorHex')?.value?.trim();
  const nameInput = document.getElementById('newColorName')?.value?.trim();
  const color = hexInput && hexInput.startsWith('#') ? hexInput : colorInput;
  if (!APP.colors.includes(color.toUpperCase()) && !APP.colors.includes(color.toLowerCase()) && !APP.colors.includes(color)) {
    APP.colors.push(color);
    if (nameInput) window._colorNames[color] = nameInput;
    showAdminSection('colors', document.querySelector('.admin-nav-btn.active'));
    showToast('Color añadido: ' + (nameInput || color));
  } else {
    showToast('Este color ya existe');
  }
}

function removeColor(idx) {
  if (confirm('¿Eliminar este color de la paleta?')) {
    APP.colors.splice(idx, 1);
    showAdminSection('colors', document.querySelector('.admin-nav-btn.active'));
    showToast('Color eliminado');
  }
}

function renderAdminUsers() {
  if (!APP.registeredUsers) {
    APP.registeredUsers = [
      { email: 'cliente1@email.com', name: 'Carlos García', phone: '+34 600 111 222', address: 'Calle Mayor 15', city: 'Guadalajara', status: 'active', joined: '15/01/2026' },
      { email: 'cliente2@email.com', name: 'Ana López', phone: '+34 600 333 444', address: 'Av. de la Constitución 3', city: 'Madrid', status: 'active', joined: '20/02/2026' },
      { email: 'test@email.com', name: 'Usuario Test', phone: '', address: '', city: '', status: 'disabled', joined: '01/03/2026' }
    ];
  }
  const users = APP.registeredUsers;
  return `
    <h3>GESTIÓN DE USUARIOS</h3>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;align-items:center;">
      <button class="btn btn-primary btn-small" onclick="adminCreateUser()">+ Nuevo Usuario</button>
      <p style="color:var(--text2);font-size:0.88rem;margin:0;">Usuarios registrados: <span style="color:var(--cyan);font-family:var(--font-display);">${users.length}</span> — Activos: <span style="color:var(--success);">${users.filter(u=>u.status==='active').length}</span></p>
    </div>
    <div class="table-responsive"><table class="data-table">
      <thead><tr><th>NOMBRE</th><th>EMAIL</th><th>TELÉFONO</th><th>CIUDAD</th><th>FECHA</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
      <tbody>${users.map((u,i) => `<tr>
        <td style="font-size:0.85rem;">${u.name}</td>
        <td style="color:var(--cyan);font-size:0.82rem;">${u.email}</td>
        <td style="font-size:0.82rem;">${u.phone||'—'}</td>
        <td style="font-size:0.82rem;">${u.city||'—'}</td>
        <td>${u.joined}</td>
        <td><span class="status-badge ${u.status==='active'?'status-completed':u.status==='disabled'?'status-pending':'status-cancelled'}">${u.status==='active'?'Activo':u.status==='disabled'?'Desactivado':'Baneado'}</span></td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-small" onclick="adminEditUser(${i})">Modificar</button>
            ${u.status==='active' ? `<button class="btn btn-secondary btn-small" onclick="adminToggleUserStatus(${i},'disabled')">Desactivar</button>` : `<button class="btn btn-secondary btn-small" onclick="adminToggleUserStatus(${i},'active')">Activar</button>`}
            ${APP.bannedEmails.includes(u.email) ? `<button class="btn btn-primary btn-small" onclick="adminUnbanUser(${i})">Desbanear</button>` : `<button class="btn btn-danger btn-small" onclick="adminBanUser(${i})">Banear</button>`}
            <button class="btn btn-danger btn-small" onclick="adminDeleteUser(${i})">Eliminar</button>
          </div>
        </td>
      </tr>`).join('')}</tbody>
    </table></div>
    <p style="font-size:0.78rem;color:var(--text3);margin-top:16px;">* Banear impide crear nuevas cuentas con el mismo email. Desbanear restaura el acceso. Editar permite modificar todos los datos del usuario.</p>
  `;
}

function adminEditUser(idx) {
  const u = APP.registeredUsers[idx];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>MODIFICAR USUARIO <span style="color:var(--cyan)">${u.email}</span></h3>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:600px;">
      <div class="form-group">
        <label>Nombre completo</label>
        <input type="text" class="form-input" id="editUserName" value="${u.name}">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-input" id="editUserEmail" value="${u.email}">
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="text" class="form-input" id="editUserPhone" value="${u.phone||''}">
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" class="form-input" id="editUserAddress" value="${u.address||''}">
      </div>
      <div class="form-group">
        <label>Ciudad</label>
        <input type="text" class="form-input" id="editUserCity" value="${u.city||''}">
      </div>
      <div class="form-group">
        <label>Estado</label>
        <select class="form-select" id="editUserStatus">
          <option value="active" ${u.status==='active'?'selected':''}>Activo</option>
          <option value="disabled" ${u.status==='disabled'?'selected':''}>Desactivado</option>
          <option value="banned" ${u.status==='banned'?'selected':''}>Baneado</option>
        </select>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px;margin-bottom:16px;">
        <p style="font-size:0.78rem;color:var(--text3);">Fecha de registro: ${u.joined}</p>
        <p style="font-size:0.78rem;color:var(--text3);">Pedidos realizados: ${APP.orders.filter(o=>o.user===u.email).length}</p>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="adminSaveUser(${idx})">Guardar Cambios</button>
        <button class="btn btn-secondary" onclick="showAdminSection('users',document.querySelectorAll('.admin-nav-btn')[7])">Cancelar</button>
      </div>
    </div>
  `;
}

function adminSaveUser(idx) {
  const name = document.getElementById('editUserName')?.value?.trim();
  const email = document.getElementById('editUserEmail')?.value?.trim();
  const phone = document.getElementById('editUserPhone')?.value?.trim();
  const address = document.getElementById('editUserAddress')?.value?.trim();
  const city = document.getElementById('editUserCity')?.value?.trim();
  const status = document.getElementById('editUserStatus')?.value;
  if (!name || !email) { showToast('Nombre y email son obligatorios'); return; }

  APP.registeredUsers[idx].name = name;
  APP.registeredUsers[idx].email = email;
  APP.registeredUsers[idx].phone = phone;
  APP.registeredUsers[idx].address = address;
  APP.registeredUsers[idx].city = city;
  APP.registeredUsers[idx].status = status;
  simulateEmail(email, 'userModified', { nombre: name });
  simulateEmail(APP.adminSettings.adminEmail, 'userModified', { nombre: name }, { adminOnly: true });
  showToast('Datos del usuario actualizados');
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function adminToggleUserStatus(idx, status) {
  APP.registeredUsers[idx].status = status;
  const u = APP.registeredUsers[idx];
  if (status === 'disabled') {
    simulateEmail(u.email, 'userDisabled', { nombre: u.name });
    simulateEmail(APP.adminSettings.adminEmail, 'userDisabled', { nombre: u.name }, { adminOnly: true });
  }
  if (status === 'active') {
    simulateEmail(u.email, 'userActivated', { nombre: u.name });
    simulateEmail(APP.adminSettings.adminEmail, 'userActivated', { nombre: u.name }, { adminOnly: true });
  }
  showToast(`Usuario ${status==='active'?'activado':'desactivado'}`);
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function adminBanUser(idx) {
  const email = APP.registeredUsers[idx].email;
  if (!APP.bannedEmails.includes(email)) APP.bannedEmails.push(email);
  APP.registeredUsers[idx].status = 'banned';
  simulateEmail(email, 'userBanned', { nombre: APP.registeredUsers[idx].name });
  simulateEmail(APP.adminSettings.adminEmail, 'userBanned', { nombre: APP.registeredUsers[idx].name }, { adminOnly: true });
  showToast(`Usuario ${email} baneado permanentemente`);
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function adminUnbanUser(idx) {
  const email = APP.registeredUsers[idx].email;
  APP.bannedEmails = APP.bannedEmails.filter(e=>e!==email);
  APP.registeredUsers[idx].status = 'active';
  simulateEmail(email, 'userUnbanned', { nombre: APP.registeredUsers[idx].name });
  simulateEmail(APP.adminSettings.adminEmail, 'userUnbanned', { nombre: APP.registeredUsers[idx].name }, { adminOnly: true });
  showToast(`Usuario ${email} desbaneado correctamente`);
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function adminDeleteUser(idx) {
  const u = APP.registeredUsers[idx];
  if (!confirm('¿Eliminar permanentemente al usuario ' + u.name + ' (' + u.email + ')? Esta acción no se puede deshacer.')) return;
  simulateEmail(u.email, 'userDeleted', { nombre: u.name });
  simulateEmail(APP.adminSettings.adminEmail, 'userDeleted', { nombre: u.name }, { adminOnly: true });
  APP.registeredUsers.splice(idx, 1);
  showToast('Usuario eliminado permanentemente');
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function adminCreateUser() {
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>CREAR NUEVO USUARIO</h3>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:600px;">
      <div class="form-group"><label>Nombre completo</label><input type="text" class="form-input" id="newUserName"></div>
      <div class="form-group"><label>Email</label><input type="email" class="form-input" id="newUserEmail"></div>
      <div class="form-group"><label>Teléfono</label><input type="text" class="form-input" id="newUserPhone"></div>
      <div class="form-group"><label>Dirección</label><input type="text" class="form-input" id="newUserAddress"></div>
      <div class="form-group"><label>Ciudad</label><input type="text" class="form-input" id="newUserCity"></div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="btn btn-primary" onclick="adminSaveNewUser()">Crear Usuario</button>
        <button class="btn btn-secondary" onclick="showAdminSection('users',document.querySelectorAll('.admin-nav-btn')[7])">Cancelar</button>
      </div>
    </div>
  `;
}

function adminSaveNewUser() {
  const name = document.getElementById('newUserName')?.value?.trim();
  const email = document.getElementById('newUserEmail')?.value?.trim();
  const phone = document.getElementById('newUserPhone')?.value?.trim();
  const address = document.getElementById('newUserAddress')?.value?.trim();
  const city = document.getElementById('newUserCity')?.value?.trim();
  if (!name || !email) { showToast('Nombre y email son obligatorios'); return; }
  if (!APP.registeredUsers) APP.registeredUsers = [];
  APP.registeredUsers.push({ name, email, phone: phone||'', address: address||'', city: city||'', status: 'active', joined: new Date().toLocaleDateString('es-ES') });
  simulateEmail(email, 'newUser', { nombre: name });
  simulateEmail(APP.adminSettings.adminEmail, 'newUser', { nombre: name }, { adminOnly: true });
  showToast('Usuario creado correctamente');
  showAdminSection('users', document.querySelectorAll('.admin-nav-btn')[7]);
}

function simulateEmail(to, templateKey, vars, opts) {
  const tpl = APP.emailTemplates[templateKey];
  if (!tpl) return;
  // Check if this notification type is enabled
  const nots = APP.adminSettings.emailNotifications || {};
  const notifKeyMap = {
    newOrder: 'orderCreated', orderModified: 'orderModified', orderCancelled: 'orderStatusChanged',
    orderStatusChanged: 'orderStatusChanged', orderDeleted: 'orderDeleted',
    newQuote: 'quoteCreated', quoteModified: 'quoteModified', quoteApproved: 'quoteApproved',
    quoteRejected: 'quoteRejected', quoteAnnulled: 'quoteAnnulled', quoteDeleted: 'quoteDeleted',
    newInvoice: 'invoiceCreated', invoiceModified: 'invoiceModified',
    invoiceStatusChanged: 'invoiceStatusChanged', invoiceDeleted: 'invoiceDeleted',
    ticketCreated: 'ticketCreated', ticketAnswered: 'ticketAnswered',
    ticketClosed: 'ticketClosed', ticketReopened: 'ticketReopened',
    ticketDeleted: 'ticketDeleted', ticketPriorityChanged: 'ticketPriorityChanged',
    ticketCategoryChanged: 'ticketCategoryChanged',
    newUser: 'userCreated', userModified: 'userModified',
    userBanned: 'userBanned', userUnbanned: 'userUnbanned',
    userDisabled: 'userDisabled', userActivated: 'userActivated',
    userDeleted: 'userDeleted', abandonedCart: 'abandonedCart'
  };
  const notifKey = notifKeyMap[templateKey];
  if (notifKey && nots[notifKey] === false) return; // disabled by admin

  let subject = tpl.subject;
  let body = tpl.body;
  if (vars) {
    Object.keys(vars).forEach(k => {
      subject = subject.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      body = body.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    });
  }
  const adminEmail = APP.adminSettings.adminEmail || 'manuguada19@gmail.com';
  const sendCopy = nots.adminCopyEnabled !== false;
  const skipAdminToast = opts && opts.adminOnly;
  if (skipAdminToast) {
    _originalShowToast('Email privado enviado a ' + adminEmail + ': ' + subject);
  } else if (sendCopy) {
    _originalShowToast('Email enviado a ' + to + ' (+ copia privada a ' + adminEmail + ')');
  } else {
    _originalShowToast('Email enviado a ' + to);
  }
}

function renderAdminSettings() {
  const s = APP.adminSettings;
  const allMats = { ...APP.materials, ...APP.specialMaterials };
  function toggleSwitch(key, label, desc) {
    const val = s[key];
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px;">
      <div><h4 style="font-family:var(--font-heading);font-size:1rem;">${label}</h4><p style="font-size:0.82rem;color:var(--text3);">${desc}</p></div>
      <label style="position:relative;display:inline-block;width:52px;height:28px;flex-shrink:0;">
        <input type="checkbox" ${val?'checked':''} onchange="APP.adminSettings['${key}']=this.checked;if('${key}'==='view3d')APP.admin3dEnabled=this.checked;this.parentElement.querySelector('.toggle-track').style.background=this.checked?'var(--cyan)':'var(--border)';this.parentElement.querySelector('.toggle-dot').style.left=this.checked?'26px':'4px';showToast('${label} '+(this.checked?'habilitado':'deshabilitado'))" style="opacity:0;width:0;height:0;">
        <span class="toggle-track" style="position:absolute;cursor:pointer;inset:0;background:${val?'var(--cyan)':'var(--border)'};border-radius:28px;transition:0.3s;"></span>
        <span class="toggle-dot" style="position:absolute;left:${val?'26px':'4px'};top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:0.3s;"></span>
      </label>
    </div>`;
  }
  return `
    <h3>CONFIGURACIÓN</h3>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Ajustes Generales del Sitio</h4>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;max-width:600px;">
      <div class="form-group"><label>Nombre del sitio</label><input type="text" class="form-input" id="settSiteName" value="${s.siteName}" onchange="APP.adminSettings.siteName=this.value"></div>
      <div class="form-group"><label>Descripción del sitio</label><textarea class="form-input" id="settSiteDesc" rows="3" onchange="APP.adminSettings.siteDescription=this.value">${s.siteDescription||''}</textarea></div>
      <div class="form-group"><label>Teléfono de contacto</label><input type="text" class="form-input" id="settPhone" value="${s.contactPhone}" onchange="APP.adminSettings.contactPhone=this.value;updateFooterContact();showToast('Teléfono actualizado en toda la web')"></div>
      <div class="form-group"><label>Email de contacto</label><input type="email" class="form-input" id="settContactEmail" value="${s.contactEmail}" onchange="APP.adminSettings.contactEmail=this.value;updateFooterContact();showToast('Email actualizado en toda la web')"></div>
      <div class="form-group"><label>Email del administrador</label><input type="email" class="form-input" id="settAdminEmail" value="${s.adminEmail}" onchange="APP.adminSettings.adminEmail=this.value"></div>
      <button class="btn btn-primary btn-small" onclick="showToast('Ajustes generales guardados')">Guardar Ajustes Generales</button>
    </div>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Secciones y Funcionalidades</h4>
    <div style="margin-bottom:24px;">
      ${toggleSwitch('view3d', 'Vista 3D del Editor', 'Habilitar/deshabilitar la vista previa 3D para los usuarios')}
      ${toggleSwitch('shopEnabled', 'Tienda online', 'Habilitar/deshabilitar la tienda de productos')}
      ${toggleSwitch('chatEnabled', 'Chat en vivo', 'Habilitar/deshabilitar el widget de chat')}
      ${toggleSwitch('ticketsEnabled', 'Sistema de tickets', 'Habilitar/deshabilitar el sistema de soporte por tickets')}
      ${toggleSwitch('quotesEnabled', 'Sistema de presupuestos', 'Habilitar/deshabilitar la generación de presupuestos')}
      ${toggleSwitch('maintenanceMode', 'Modo mantenimiento', 'Activar modo mantenimiento (sitio no accesible para usuarios)')}
    </div>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Precios y Recargos</h4>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;max-width:600px;">
      <div class="form-group">
        <label>Recargo multicolor (%)</label>
        <input type="number" class="form-input" value="${s.multiColorSurcharge}" onchange="APP.adminSettings.multiColorSurcharge=parseFloat(this.value)||0" style="max-width:120px;">
      </div>
      <div class="form-group">
        <label>Recargo fosforescente — brilla en la oscuridad (%)</label>
        <input type="number" class="form-input" value="${s.glowInDarkSurcharge || 25}" onchange="APP.adminSettings.glowInDarkSurcharge=parseFloat(this.value)||0" style="max-width:120px;">
        <small style="font-size:0.72rem;color:var(--text3);margin-top:4px;display:block;">Coste adicional aplicado cuando el cliente selecciona la opción "Brilla en la oscuridad".</small>
      </div>
      <h5 style="margin:16px 0 8px;font-family:var(--font-heading);">Precios base por material (€/cm³)</h5>
      ${Object.keys(allMats).map(k => `<div class="form-group" style="display:flex;align-items:center;gap:12px;">
        <label style="min-width:120px;margin:0;">${k}</label>
        <input type="number" step="0.01" class="form-input" value="${allMats[k].base}" onchange="if(APP.materials['${k}'])APP.materials['${k}'].base=parseFloat(this.value);if(APP.specialMaterials['${k}'])APP.specialMaterials['${k}'].base=parseFloat(this.value);if(APP.technicalMaterials&&APP.technicalMaterials['${k}'])APP.technicalMaterials['${k}'].base=parseFloat(this.value)" style="max-width:120px;">
      </div>`).join('')}
      <button class="btn btn-primary btn-small" onclick="showToast('Precios actualizados')">Guardar Precios</button>
    </div>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Pasarela de Pago</h4>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;">
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">Configura los métodos de pago disponibles para los clientes al realizar un pedido.</p>
      <button class="btn btn-primary btn-small" onclick="showAdminSection('paymentgateway',document.querySelectorAll('.admin-nav-btn')[11])" style="margin-bottom:12px;">Configurar Métodos de Pago</button>
    </div>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Plantillas de Email</h4>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:24px;">
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:12px;">Gestiona las plantillas de email para notificaciones automáticas.</p>
      <button class="btn btn-primary btn-small" onclick="showAdminSection('emailtemplates',document.querySelectorAll('.admin-nav-btn')[12])">Gestionar Plantillas de Email</button>
    </div>

    <h4 style="font-family:var(--font-heading);margin:24px 0 12px;color:var(--cyan);">Configuración de Envío de Correos</h4>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;">
      <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">Activa o desactiva las notificaciones por email para cada tipo de acción. Los emails se envían al cliente y una copia privada a <strong style="color:var(--cyan);">${s.adminEmail}</strong>.</p>

      ${_renderEmailToggleGroup('Copia privada al administrador', [
        ['adminCopyEnabled', 'Copia al administrador', 'Enviar copia privada de todos los emails a ' + s.adminEmail]
      ])}

      ${_renderEmailToggleGroup('Pedidos', [
        ['orderCreated', 'Pedido creado', 'Al crear un nuevo pedido'],
        ['orderModified', 'Pedido modificado', 'Al editar datos de un pedido'],
        ['orderStatusChanged', 'Estado de pedido cambiado', 'Al cambiar el estado de un pedido'],
        ['orderDeleted', 'Pedido eliminado', 'Al eliminar un pedido']
      ])}

      ${_renderEmailToggleGroup('Presupuestos', [
        ['quoteCreated', 'Presupuesto creado', 'Al generar un nuevo presupuesto'],
        ['quoteModified', 'Presupuesto modificado', 'Al editar un presupuesto'],
        ['quoteApproved', 'Presupuesto aprobado', 'Al aprobar un presupuesto'],
        ['quoteRejected', 'Presupuesto rechazado', 'Al rechazar un presupuesto'],
        ['quoteAnnulled', 'Presupuesto anulado', 'Al anular un presupuesto'],
        ['quoteDeleted', 'Presupuesto eliminado', 'Al eliminar un presupuesto']
      ])}

      ${_renderEmailToggleGroup('Facturas', [
        ['invoiceCreated', 'Factura creada', 'Al generar una nueva factura'],
        ['invoiceModified', 'Factura modificada', 'Al editar una factura'],
        ['invoiceStatusChanged', 'Estado de factura cambiado', 'Al cambiar el estado de una factura'],
        ['invoiceDeleted', 'Factura eliminada', 'Al eliminar una factura']
      ])}

      ${_renderEmailToggleGroup('Tickets', [
        ['ticketCreated', 'Ticket creado', 'Al crear un nuevo ticket'],
        ['ticketAnswered', 'Ticket respondido', 'Al responder a un ticket'],
        ['ticketClosed', 'Ticket cerrado', 'Al cerrar un ticket'],
        ['ticketReopened', 'Ticket reabierto', 'Al reabrir un ticket'],
        ['ticketDeleted', 'Ticket eliminado', 'Al eliminar un ticket'],
        ['ticketPriorityChanged', 'Prioridad cambiada', 'Al cambiar la prioridad de un ticket'],
        ['ticketCategoryChanged', 'Categoría cambiada', 'Al cambiar la categoría de un ticket']
      ])}

      ${_renderEmailToggleGroup('Usuarios', [
        ['userCreated', 'Usuario creado', 'Al registrar un nuevo usuario'],
        ['userModified', 'Usuario modificado', 'Al editar datos de un usuario'],
        ['userBanned', 'Usuario baneado', 'Al banear un usuario'],
        ['userUnbanned', 'Usuario desbaneado', 'Al desbanear un usuario'],
        ['userActivated', 'Usuario activado', 'Al activar un usuario'],
        ['userDisabled', 'Usuario desactivado', 'Al desactivar un usuario'],
        ['userDeleted', 'Usuario eliminado', 'Al eliminar un usuario']
      ])}

      ${_renderEmailToggleGroup('Otros', [
        ['abandonedCart', 'Carrito abandonado', 'Al detectar un carrito abandonado (+5 min)']
      ])}

      <button class="btn btn-primary btn-small" onclick="showToast('Configuración de correos guardada')" style="margin-top:12px;">Guardar Configuración de Correos</button>
    </div>
  `;
}

function _renderEmailToggleGroup(title, items) {
  const nots = APP.adminSettings.emailNotifications || {};
  return '<div style="margin-bottom:16px;"><h5 style="font-family:var(--font-heading);font-size:0.88rem;margin-bottom:8px;color:var(--text1);">' + title + '</h5>' +
    items.map(function(item) {
      const key = item[0], label = item[1], desc = item[2];
      const val = nots[key] !== false;
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;">' +
        '<div><span style="font-size:0.88rem;font-weight:600;">' + label + '</span><br><span style="font-size:0.75rem;color:var(--text3);">' + desc + '</span></div>' +
        '<label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;">' +
          '<input type="checkbox" ' + (val ? 'checked' : '') + ' onchange="if(!APP.adminSettings.emailNotifications)APP.adminSettings.emailNotifications={};APP.adminSettings.emailNotifications[\'' + key + '\']=this.checked;this.parentElement.querySelector(\'.toggle-track\').style.background=this.checked?\'var(--cyan)\':\'var(--border)\';this.parentElement.querySelector(\'.toggle-dot\').style.left=this.checked?\'22px\':\'3px\';showToast(\'' + label + ' \'+(this.checked?\'activado\':\'desactivado\'))" style="opacity:0;width:0;height:0;">' +
          '<span class="toggle-track" style="position:absolute;cursor:pointer;inset:0;background:' + (val ? 'var(--cyan)' : 'var(--border)') + ';border-radius:24px;transition:0.3s;"></span>' +
          '<span class="toggle-dot" style="position:absolute;left:' + (val ? '22px' : '3px') + ';top:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:0.3s;"></span>' +
        '</label></div>';
    }).join('') + '</div>';
}

// ===== PAYMENT GATEWAY ADMIN CONFIG =====
function adminPaymentConfig() {
  showAdminSection('paymentgateway', document.querySelectorAll('.admin-nav-btn')[11]);
}

function renderAdminPaymentGateway() {
  const pm = APP.adminSettings.paymentMethods || {};
  const el = document.getElementById('adminContent');

  // Count enabled methods
  const enabledCount = Object.values(pm).filter(m => m.enabled !== false).length;
  const totalMethods = Object.keys(pm).length;

  // Pending payment orders
  const pendingPayOrders = APP.orders.filter(o => o.paymentStatus === 'pending' || o.status === 'awaiting_payment');

  el.innerHTML = `
    <h3 style="margin-bottom:4px;">PASARELA DE PAGO</h3>
    <p style="font-size:0.85rem;color:var(--text2);margin-bottom:20px;">Configura los métodos de pago disponibles para los pedidos de los clientes.</p>

    <!-- Stats cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px;">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;">
        <div style="font-family:var(--font-display);font-size:1.6rem;color:var(--cyan);">${enabledCount}/${totalMethods}</div>
        <div style="font-size:0.78rem;color:var(--text3);margin-top:4px;">Métodos activos</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;">
        <div style="font-family:var(--font-display);font-size:1.6rem;color:${pendingPayOrders.length > 0 ? 'var(--gold)' : 'var(--success)'};">${pendingPayOrders.length}</div>
        <div style="font-size:0.78rem;color:var(--text3);margin-top:4px;">Pagos pendientes</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center;">
        <div style="font-family:var(--font-display);font-size:1.6rem;color:var(--text1);">${APP.orders.filter(o => o.paymentStatus === 'completed').length}</div>
        <div style="font-size:0.78rem;color:var(--text3);margin-top:4px;">Pagos completados</div>
      </div>
    </div>

    ${pendingPayOrders.length > 0 ? `
    <div style="background:rgba(255,165,0,0.08);border:1px solid rgba(255,165,0,0.3);border-radius:var(--radius);padding:16px;margin-bottom:24px;">
      <h4 style="font-family:var(--font-heading);font-size:0.9rem;color:#FFA500;margin-bottom:10px;">⏳ Pedidos con pago pendiente de confirmación</h4>
      <div class="table-responsive"><table class="data-table" style="font-size:0.82rem;">
        <thead><tr><th>Pedido</th><th>Cliente</th><th>Método</th><th>Total</th><th>Fecha</th><th>Acción</th></tr></thead>
        <tbody>${pendingPayOrders.map((o, idx) => {
          const realIdx = APP.orders.indexOf(o);
          const methodIcons = { card:'💳', transfer:'🏦', bizum:'📱', crypto:'🌐' };
          return `<tr>
            <td><strong style="color:var(--cyan);">${o.id}</strong></td>
            <td>${o.clientName || o.user}</td>
            <td>${methodIcons[o.paymentMethod]||'—'} ${o.paymentMethodLabel || o.paymentMethod || '—'}</td>
            <td style="font-weight:600;">${o.total ? o.total.toFixed(2) + '€' : '—'}</td>
            <td>${o.date || '—'}</td>
            <td><button class="btn btn-primary btn-small" onclick="adminConfirmPayment(${realIdx})" style="font-size:0.72rem;padding:4px 10px;background:var(--success);border-color:var(--success);">✓ Confirmar Pago</button></td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>
    </div>
    ` : ''}

    <h4 style="font-family:var(--font-heading);font-size:0.95rem;margin-bottom:16px;color:var(--cyan);">Configuración de Métodos de Pago</h4>

    ${_renderPaymentMethodConfig('card', pm.card || {})}
    ${_renderPaymentMethodConfig('transfer', pm.transfer || {})}
    ${_renderPaymentMethodConfig('bizum', pm.bizum || {})}
    ${_renderPaymentMethodConfig('crypto', pm.crypto || {})}

    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="adminSavePaymentConfig()">Guardar Toda la Configuración de Pago</button>
    </div>

    <div style="margin-top:32px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
      <h4 style="font-family:var(--font-heading);font-size:0.9rem;color:var(--text1);margin-bottom:10px;">ℹ️ Información sobre los métodos de pago</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
        <div style="font-size:0.82rem;color:var(--text2);">
          <strong style="color:var(--text1);">💳 Tarjeta de crédito/débito</strong><br>
          Pago instantáneo. El pedido se procesa de inmediato tras la confirmación. Compatible con Visa, Mastercard y American Express.
        </div>
        <div style="font-size:0.82rem;color:var(--text2);">
          <strong style="color:var(--text1);">🏦 Transferencia bancaria</strong><br>
          El cliente realiza una transferencia a la cuenta indicada. El pedido queda en estado "Esperando pago" hasta confirmar la recepción (máx. 72h laborables). Tras confirmar, se emite factura y se envía el producto.
        </div>
        <div style="font-size:0.82rem;color:var(--text2);">
          <strong style="color:var(--text1);">📱 Bizum</strong><br>
          Pago instantáneo desde el móvil del cliente. El pedido se procesa de inmediato tras recibir el Bizum en el teléfono configurado.
        </div>
        <div style="font-size:0.82rem;color:var(--text2);">
          <strong style="color:var(--text1);">🌐 Worldcoin (Criptomonedas)</strong><br>
          Pago en la red Optimism (OP Mainnet). El pedido queda en estado "Esperando pago" hasta confirmar la recepción en blockchain (máx. 72h laborables). Tras confirmar, se emite factura, comprobante y nº de seguimiento.
        </div>
      </div>
    </div>
  `;
}

function _renderPaymentMethodConfig(key, m) {
  const defaults = {
    card: { label: 'Tarjeta de crédito/débito', icon: '💳', description: 'Pago seguro con Visa, Mastercard o similar.' },
    transfer: { label: 'Transferencia bancaria', icon: '🏦', description: '' },
    bizum: { label: 'Bizum', icon: '📱', description: 'Envía un Bizum al número indicado.' },
    crypto: { label: 'Criptomonedas (Worldcoin)', icon: '🌐', description: '' }
  };
  const def = defaults[key] || {};
  const enabled = m.enabled !== false;
  const label = m.label || def.label;
  const icon = m.icon || def.icon;

  let fields = '';
  if (key === 'card') {
    const s = m.stripe || {};
    fields = `
      <div class="form-group"><label style="font-size:0.78rem;">Descripción para el cliente</label>
        <input type="text" class="form-input" id="pm_card_desc" value="${(m.description||def.description).replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>

      <div style="margin-top:16px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <svg viewBox="0 0 60 25" style="height:20px;flex-shrink:0;"><rect width="60" height="25" rx="4" fill="#635BFF"/><text x="30" y="17" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Arial,sans-serif">stripe</text></svg>
          <h5 style="font-family:var(--font-heading);font-size:0.88rem;margin:0;color:var(--text1);">Configuración de Stripe</h5>
          <span style="font-size:0.7rem;padding:2px 8px;border-radius:4px;background:${s.mode==='live'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'};color:${s.mode==='live'?'var(--success)':'var(--warning)'};">${s.mode==='live'?'PRODUCCIÓN':'TEST'}</span>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Modo</label>
          <select class="form-input" id="pm_stripe_mode" style="font-size:0.85rem;">
            <option value="test" ${s.mode!=='live'?'selected':''}>Test (pruebas)</option>
            <option value="live" ${s.mode==='live'?'selected':''}>Live (producción)</option>
          </select>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Publishable Key (clave pública)</label>
          <input type="text" class="form-input" id="pm_stripe_pk" value="${(s.publishableKey||'').replace(/"/g,'&quot;')}" placeholder="pk_test_..." style="font-size:0.82rem;font-family:monospace;">
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Comienza por pk_test_ (test) o pk_live_ (producción). Se usa en el navegador del cliente.</small>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Secret Key (clave secreta)</label>
          <input type="password" class="form-input" id="pm_stripe_sk" value="${(s.secretKey||'').replace(/"/g,'&quot;')}" placeholder="sk_test_..." style="font-size:0.82rem;font-family:monospace;">
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Comienza por sk_test_ (test) o sk_live_ (producción). Se usa en el servidor para crear cargos.</small>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Webhook Secret</label>
          <input type="password" class="form-input" id="pm_stripe_wh" value="${(s.webhookSecret||'').replace(/"/g,'&quot;')}" placeholder="whsec_..." style="font-size:0.82rem;font-family:monospace;">
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Para verificar los webhooks de Stripe (payment_intent.succeeded, charge.refunded, etc.).</small>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Moneda</label>
          <select class="form-input" id="pm_stripe_currency" style="font-size:0.85rem;max-width:200px;">
            <option value="eur" ${(s.currency||'eur')==='eur'?'selected':''}>EUR (Euro)</option>
            <option value="usd" ${s.currency==='usd'?'selected':''}>USD (Dólar)</option>
            <option value="gbp" ${s.currency==='gbp'?'selected':''}>GBP (Libra)</option>
          </select>
        </div>
        <div style="padding:10px;background:rgba(0,240,255,0.04);border:1px solid var(--border);border-radius:var(--radius);margin-top:8px;">
          <p style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;"><strong style="color:var(--text2);">Flujo de pago Stripe:</strong></p>
          <p style="font-size:0.72rem;color:var(--text3);">1. El cliente introduce los datos de su tarjeta en el formulario seguro de Stripe Elements.<br>
          2. Se genera un token con Stripe.js (los datos de la tarjeta nunca pasan por tu servidor).<br>
          3. El servidor crea un cargo (PaymentIntent) con la Secret Key.<br>
          4. Stripe notifica el resultado vía webhook.<br>
          5. El pedido se confirma o se rechaza automáticamente.</p>
        </div>
      </div>
    `;
  } else if (key === 'transfer') {
    fields = `
      <div class="form-group"><label style="font-size:0.78rem;">Titular de la cuenta</label>
        <input type="text" class="form-input" id="pm_transfer_holder" value="${(m.bankHolder||'3D Guadalajara').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">IBAN / Número de cuenta</label>
        <input type="text" class="form-input" id="pm_transfer_account" value="${(m.bankAccount||'').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">Referencia / Concepto</label>
        <input type="text" class="form-input" id="pm_transfer_ref" value="${(m.bankReference||'Indicar nº de pedido como concepto').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">Descripción / Aviso para el cliente</label>
        <textarea class="form-textarea" id="pm_transfer_desc" rows="3" style="font-size:0.82rem;">${m.description||'El producto será enviado con el nº de seguimiento del transportista una vez recibido el pago, que puede tardar hasta 72 horas máximo (sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.'}</textarea>
      </div>
    `;
  } else if (key === 'bizum') {
    const r = m.redsys || {};
    fields = `
      <div class="form-group"><label style="font-size:0.78rem;">Teléfono para recibir Bizum (modo manual)</label>
        <input type="text" class="form-input" id="pm_bizum_phone" value="${(m.bizumPhone||'+34 659 919 485').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
        <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Se usa como fallback si Redsys no está configurado.</small>
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">Descripción para el cliente</label>
        <input type="text" class="form-input" id="pm_bizum_desc" value="${(m.description||def.description).replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>

      <div style="margin-top:16px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <div style="background:#0066FF;border-radius:6px;padding:2px 10px;">
            <span style="font-size:0.72rem;font-weight:700;color:#fff;font-family:var(--font-heading);letter-spacing:0.5px;">REDSYS</span>
          </div>
          <h5 style="font-family:var(--font-heading);font-size:0.88rem;margin:0;color:var(--text1);">Configuración de Redsys para Bizum</h5>
          <span style="font-size:0.7rem;padding:2px 8px;border-radius:4px;background:${r.mode==='live'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'};color:${r.mode==='live'?'var(--success)':'var(--warning)'};">${r.mode==='live'?'PRODUCCIÓN':'TEST'}</span>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Modo</label>
          <select class="form-input" id="pm_redsys_mode" style="font-size:0.85rem;">
            <option value="test" ${r.mode!=='live'?'selected':''}>Test (pruebas)</option>
            <option value="live" ${r.mode==='live'?'selected':''}>Live (producción)</option>
          </select>
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Test: sis-t.redsys.es | Producción: sis.redsys.es</small>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label style="font-size:0.78rem;">Código de comercio (Ds_Merchant_MerchantCode)</label>
            <input type="text" class="form-input" id="pm_redsys_merchant" value="${(r.merchantCode||'').replace(/"/g,'&quot;')}" placeholder="999008881" style="font-size:0.82rem;font-family:monospace;">
          </div>
          <div class="form-group">
            <label style="font-size:0.78rem;">Terminal (Ds_Merchant_Terminal)</label>
            <input type="text" class="form-input" id="pm_redsys_terminal" value="${(r.terminal||'1').replace(/"/g,'&quot;')}" placeholder="1" style="font-size:0.82rem;font-family:monospace;max-width:120px;">
          </div>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Clave secreta (SHA-256)</label>
          <input type="password" class="form-input" id="pm_redsys_secret" value="${(r.secretKey||'').replace(/"/g,'&quot;')}" placeholder="sq7HjrUO..." style="font-size:0.82rem;font-family:monospace;">
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">Clave de cifrado proporcionada por Redsys para firmar las peticiones con HMAC SHA-256.</small>
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Nombre del comercio (Ds_Merchant_MerchantName)</label>
          <input type="text" class="form-input" id="pm_redsys_name" value="${(r.merchantName||'3D Guadalajara').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
        </div>
        <div class="form-group">
          <label style="font-size:0.78rem;">Moneda (Ds_Merchant_Currency)</label>
          <select class="form-input" id="pm_redsys_currency" style="font-size:0.85rem;max-width:200px;">
            <option value="978" ${(r.currency||'978')==='978'?'selected':''}>978 — EUR (Euro)</option>
            <option value="840" ${r.currency==='840'?'selected':''}>840 — USD (Dólar)</option>
            <option value="826" ${r.currency==='826'?'selected':''}>826 — GBP (Libra)</option>
          </select>
        </div>
        <h6 style="font-family:var(--font-heading);font-size:0.8rem;margin:16px 0 8px;color:var(--text2);">URLs de respuesta</h6>
        <div class="form-group">
          <label style="font-size:0.78rem;">URL de notificación (Ds_Merchant_MerchantURL)</label>
          <input type="text" class="form-input" id="pm_redsys_notifurl" value="${(r.notificationURL||'').replace(/"/g,'&quot;')}" placeholder="https://tudominio.com/api/redsys/notification" style="font-size:0.82rem;font-family:monospace;">
          <small style="font-size:0.7rem;color:var(--text3);margin-top:4px;display:block;">URL a la que Redsys envía la confirmación del pago (server-to-server).</small>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label style="font-size:0.78rem;">URL de éxito (Ds_Merchant_UrlOK)</label>
            <input type="text" class="form-input" id="pm_redsys_okurl" value="${(r.successURL||'').replace(/"/g,'&quot;')}" placeholder="https://tudominio.com/pago-ok" style="font-size:0.82rem;font-family:monospace;">
          </div>
          <div class="form-group">
            <label style="font-size:0.78rem;">URL de error (Ds_Merchant_UrlKO)</label>
            <input type="text" class="form-input" id="pm_redsys_kourl" value="${(r.errorURL||'').replace(/"/g,'&quot;')}" placeholder="https://tudominio.com/pago-error" style="font-size:0.82rem;font-family:monospace;">
          </div>
        </div>
        <div style="padding:10px;background:rgba(0,240,255,0.04);border:1px solid var(--border);border-radius:var(--radius);margin-top:8px;">
          <p style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;"><strong style="color:var(--text2);">Flujo de pago Bizum vía Redsys:</strong></p>
          <p style="font-size:0.72rem;color:var(--text3);">1. El cliente introduce su teléfono asociado a Bizum.<br>
          2. Se envía la solicitud a Redsys con Ds_Merchant_PayMethods = 'z' (Bizum).<br>
          3. El cliente recibe una notificación push en su app bancaria.<br>
          4. El cliente autoriza el pago desde su app bancaria.<br>
          5. Redsys envía la confirmación a la URL de notificación del servidor.<br>
          6. El pedido se confirma automáticamente.</p>
        </div>
      </div>
    `;
  } else if (key === 'crypto') {
    fields = `
      <div class="form-group"><label style="font-size:0.78rem;">Dirección de la wallet</label>
        <input type="text" class="form-input" id="pm_crypto_wallet" value="${(m.walletAddress||'').replace(/"/g,'&quot;')}" style="font-size:0.85rem;font-family:monospace;">
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">Red blockchain</label>
        <input type="text" class="form-input" id="pm_crypto_network" value="${(m.network||'Optimism (OP Mainnet)').replace(/"/g,'&quot;')}" style="font-size:0.85rem;">
      </div>
      <div class="form-group"><label style="font-size:0.78rem;">Descripción / Aviso para el cliente</label>
        <textarea class="form-textarea" id="pm_crypto_desc" rows="3" style="font-size:0.82rem;">${m.description||'Pago con Worldcoin (WLD) u otras criptomonedas. El producto será enviado con el nº de seguimiento del transportista una vez recibido y confirmado el pago en la blockchain, lo cual puede tardar hasta 72 horas máximo (sin incluir fines de semana ni festivos). Una vez recibido el pago, se emitirá factura y comprobante seguido del nº de seguimiento del transportista cuando nos lo facilite.'}</textarea>
      </div>
    `;
  }

  return `
    <div style="background:var(--bg2);border:1px solid ${enabled?'var(--cyan)':'var(--border)'};border-radius:var(--radius);padding:20px;margin-bottom:16px;transition:border-color 0.3s;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.5rem;">${icon}</span>
          <div>
            <h4 style="font-family:var(--font-heading);font-size:0.95rem;">${label}</h4>
            <span style="font-size:0.75rem;color:${enabled?'var(--success)':'var(--text3)'};">${enabled?'Activado':'Desactivado'}</span>
          </div>
        </div>
        <label style="position:relative;display:inline-block;width:52px;height:28px;flex-shrink:0;">
          <input type="checkbox" id="pm_${key}_enabled" ${enabled?'checked':''} onchange="this.parentElement.querySelector('.toggle-track').style.background=this.checked?'var(--cyan)':'var(--border)';this.parentElement.querySelector('.toggle-dot').style.left=this.checked?'26px':'4px';this.closest('div[style*=background]').style.borderColor=this.checked?'var(--cyan)':'var(--border)';this.closest('div[style*=background]').querySelector('span[style*=color]').textContent=this.checked?'Activado':'Desactivado';this.closest('div[style*=background]').querySelector('span[style*=color]').style.color=this.checked?'var(--success)':'var(--text3)'" style="opacity:0;width:0;height:0;">
          <span class="toggle-track" style="position:absolute;cursor:pointer;inset:0;background:${enabled?'var(--cyan)':'var(--border)'};border-radius:28px;transition:0.3s;"></span>
          <span class="toggle-dot" style="position:absolute;left:${enabled?'26px':'4px'};top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:0.3s;"></span>
        </label>
      </div>
      ${fields}
    </div>
  `;
}

function adminSavePaymentConfig() {
  const pm = APP.adminSettings.paymentMethods;

  // Card + Stripe
  pm.card.enabled = document.getElementById('pm_card_enabled')?.checked ?? true;
  pm.card.description = document.getElementById('pm_card_desc')?.value || pm.card.description;
  pm.card.gateway = 'stripe';
  if (!pm.card.stripe) pm.card.stripe = {};
  pm.card.stripe.mode = document.getElementById('pm_stripe_mode')?.value || 'test';
  pm.card.stripe.publishableKey = document.getElementById('pm_stripe_pk')?.value || pm.card.stripe.publishableKey;
  pm.card.stripe.secretKey = document.getElementById('pm_stripe_sk')?.value || pm.card.stripe.secretKey;
  pm.card.stripe.webhookSecret = document.getElementById('pm_stripe_wh')?.value || pm.card.stripe.webhookSecret;
  pm.card.stripe.currency = document.getElementById('pm_stripe_currency')?.value || 'eur';

  // Transfer
  pm.transfer.enabled = document.getElementById('pm_transfer_enabled')?.checked ?? true;
  pm.transfer.bankHolder = document.getElementById('pm_transfer_holder')?.value || pm.transfer.bankHolder;
  pm.transfer.bankAccount = document.getElementById('pm_transfer_account')?.value || pm.transfer.bankAccount;
  pm.transfer.bankReference = document.getElementById('pm_transfer_ref')?.value || pm.transfer.bankReference;
  pm.transfer.description = document.getElementById('pm_transfer_desc')?.value || pm.transfer.description;

  // Bizum + Redsys
  pm.bizum.enabled = document.getElementById('pm_bizum_enabled')?.checked ?? true;
  pm.bizum.bizumPhone = document.getElementById('pm_bizum_phone')?.value || pm.bizum.bizumPhone;
  pm.bizum.description = document.getElementById('pm_bizum_desc')?.value || pm.bizum.description;
  pm.bizum.gateway = 'redsys';
  if (!pm.bizum.redsys) pm.bizum.redsys = {};
  pm.bizum.redsys.mode = document.getElementById('pm_redsys_mode')?.value || 'test';
  pm.bizum.redsys.merchantCode = document.getElementById('pm_redsys_merchant')?.value || pm.bizum.redsys.merchantCode;
  pm.bizum.redsys.terminal = document.getElementById('pm_redsys_terminal')?.value || pm.bizum.redsys.terminal;
  pm.bizum.redsys.secretKey = document.getElementById('pm_redsys_secret')?.value || pm.bizum.redsys.secretKey;
  pm.bizum.redsys.merchantName = document.getElementById('pm_redsys_name')?.value || pm.bizum.redsys.merchantName;
  pm.bizum.redsys.currency = document.getElementById('pm_redsys_currency')?.value || '978';
  pm.bizum.redsys.notificationURL = document.getElementById('pm_redsys_notifurl')?.value || '';
  pm.bizum.redsys.successURL = document.getElementById('pm_redsys_okurl')?.value || '';
  pm.bizum.redsys.errorURL = document.getElementById('pm_redsys_kourl')?.value || '';

  // Crypto
  pm.crypto.enabled = document.getElementById('pm_crypto_enabled')?.checked ?? true;
  pm.crypto.walletAddress = document.getElementById('pm_crypto_wallet')?.value || pm.crypto.walletAddress;
  pm.crypto.network = document.getElementById('pm_crypto_network')?.value || pm.crypto.network;
  pm.crypto.description = document.getElementById('pm_crypto_desc')?.value || pm.crypto.description;

  showToast('Configuración de pasarela de pago guardada correctamente');
}

// ===== ADMIN: CONFIRM PAYMENT FOR DEFERRED ORDERS =====
function adminConfirmPayment(idx) {
  const o = APP.orders[idx];
  if (!o) return;
  o.paymentStatus = 'completed';
  if (o.status === 'awaiting_payment') o.status = 'pending';
  const pm = APP.adminSettings.paymentMethods || {};
  const m = pm[o.paymentMethod] || {};
  simulateEmail(o.user, 'paymentConfirmed', { nombre: o.clientName || o.user, id: o.id, total: o.total, metodo: o.paymentMethodLabel || o.paymentMethod });
  simulateEmail(APP.adminSettings.adminEmail, 'paymentConfirmed', { nombre: o.clientName || o.user, id: o.id, total: o.total, metodo: o.paymentMethodLabel || o.paymentMethod }, { adminOnly: true });
  showToast('Pago confirmado para ' + o.id + '. Email enviado al cliente.');
  showAdminSection('paymentgateway', document.querySelectorAll('.admin-nav-btn')[11]);
}

// ===== EDITOR 3D - FULL IMPLEMENTATION =====
let editorCanvas, editorCtx;
let editorObjects = [];
let selectedObjectId = null;
let currentTool = null;
let editorBgImage = null;
let paintLayer = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isPainting = false;

function buildEditor() {
  const es = APP.editorState;
  const allMats = { ...APP.materials, ...APP.specialMaterials };
  const fontsAvailable = ['Arial','Georgia','Courier New','Verdana','Impact','Comic Sans MS','Trebuchet MS','Palatino','Garamond','Lucida Console'];

  document.getElementById('page-editor').innerHTML = `
    <div class="container editor-section">
      <div class="section-header">
        <h2>EDITOR <span>3D</span></h2>
        <p>Personaliza tu diseño de impresión 3D con textos, imágenes y colores</p>
      </div>
      <div class="editor-layout">
        <!-- LEFT TOOLBAR -->
        <div class="editor-toolbar">
          <h3>HERRAMIENTAS</h3>

          <div class="tool-group">
            <div class="tool-group-title">Imagen Base</div>
            <button class="tool-btn" onclick="editorUploadImage()">
              <span class="tool-icon">📤</span>
              <div><span>Subir Imagen</span><div class="tool-desc">Carga una imagen como base del diseño</div></div>
            </button>
            <button class="tool-btn" onclick="editorClearBg()">
              <span class="tool-icon">🗑️</span>
              <div><span>Quitar Imagen</span><div class="tool-desc">Eliminar la imagen de fondo</div></div>
            </button>
          </div>

          <div class="tool-group">
            <div class="tool-group-title">Edición</div>
            <button class="tool-btn" id="toolSelect" onclick="setTool('select')">
              <span class="tool-icon">👆</span>
              <div><span>Seleccionar</span><div class="tool-desc">Seleccionar y mover objetos</div></div>
            </button>
            <button class="tool-btn" id="toolText" onclick="setTool('text')">
              <span class="tool-icon">✏️</span>
              <div><span>Añadir Texto</span><div class="tool-desc">Añade texto personalizable al diseño</div></div>
            </button>
            <button class="tool-btn" id="toolImage" onclick="setTool('image')">
              <span class="tool-icon">🖼️</span>
              <div><span>Añadir Imagen</span><div class="tool-desc">Inserta fotos o imágenes decorativas</div></div>
            </button>
            <button class="tool-btn" id="toolPaint" onclick="setTool('paint')">
              <span class="tool-icon">🎨</span>
              <div><span>Pintar</span><div class="tool-desc">Colorea zonas de la imagen con detección inteligente</div></div>
            </button>
          </div>

          <div class="tool-group">
            <div class="tool-group-title">Pintura</div>
            <div class="prop-row">
              <label>Color</label>
              <input type="color" id="paintColorInput" value="${es.paintColor}" onchange="APP.editorState.paintColor=this.value">
            </div>
            <div class="prop-row">
              <label>Tamaño</label>
              <input type="range" min="2" max="40" value="${es.brushSize}" oninput="APP.editorState.brushSize=parseInt(this.value)">
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
              ${APP.colors.slice(0,10).map(c=>`<div style="width:28px;height:28px;border-radius:6px;background:${c};border:2px solid var(--border);cursor:pointer;" onclick="document.getElementById('paintColorInput').value='${c}';APP.editorState.paintColor='${c}'"></div>`).join('')}
            </div>
          </div>

          ${APP.admin3dEnabled ? `
          <div class="tool-group">
            <div class="tool-group-title">Vista 3D</div>
            <button class="tool-btn" onclick="show3DPreview()">
              <span class="tool-icon">🔮</span>
              <div><span>Vista Previa 3D</span><div class="tool-desc">Rota el modelo 360° con el ratón</div></div>
            </button>
          </div>` : ''}
        </div>

        <!-- CENTER CANVAS -->
        <div class="editor-canvas-area" id="editorCanvasArea">
          <canvas id="editorCanvas" width="600" height="500"></canvas>
          <div class="canvas-overlay-msg" id="canvasMsg" style="display:none;">
            <h3>Arrastra o sube una imagen</h3>
            <p>O usa las herramientas para crear desde cero</p>
          </div>
          <input type="file" id="editorFileInput" accept="image/*" style="display:none" onchange="handleEditorFile(event)">
          <input type="file" id="editorImgInsert" accept="image/*" style="display:none" onchange="handleInsertImage(event)">
        </div>

        <!-- RIGHT PROPERTIES -->
        <div class="editor-properties">
          <h3>PROPIEDADES</h3>

          <div class="tool-group">
            <div class="tool-group-title">Dimensiones del Objeto (mm)</div>
            <div class="dimension-inputs">
              <div class="dim-input">
                <label>ANCHO</label>
                <input type="number" id="edDimW" value="${es.width}" min="0" max="500" onchange="updateEditorDimensions()">
              </div>
              <div class="dim-input">
                <label>ALTO</label>
                <input type="number" id="edDimH" value="${es.height}" min="0" max="500" onchange="updateEditorDimensions()">
              </div>
              <div class="dim-input">
                <label>FONDO</label>
                <input type="number" id="edDimD" value="${es.depth}" min="0" max="300" onchange="updateEditorDimensions()">
              </div>
            </div>
          </div>

          <div class="tool-group">
            <div class="tool-group-title">Material</div>
            <select class="form-select" id="edMaterial" onchange="updateEditorPrice();_refreshEditorColorPalette()" style="width:100%;margin-bottom:10px;">
              ${Object.entries(allMats).map(([k,v])=>`<option value="${k}" ${k===es.material?'selected':''}>${k} (${v.base.toFixed(2)}€/cm³)</option>`).join('')}
            </select>
          </div>

          <div class="tool-group">
            <div class="tool-group-title">Color base</div>
            <div class="stock-color-palette" id="editorColorPalette">
              ${_stockAwareColorPalette(APP.editorState.material || 'PLA', APP.editorState.color, 'single', 0)}
            </div>
          </div>

          <!-- Selected Object Properties -->
          <div id="selectedObjProps" style="display:none;">
            <div class="tool-group">
              <div class="tool-group-title">Objeto Seleccionado</div>
              <div class="prop-row">
                <label>Color Texto</label>
                <input type="color" id="selObjColor" value="#ffffff" onchange="updateSelectedColor(this.value)">
              </div>
              <div class="prop-row">
                <label>Tamaño</label>
                <input type="range" id="selObjSize" min="8" max="120" value="24" oninput="updateSelectedSize(parseInt(this.value))">
              </div>
              <div class="prop-row">
                <label>Fuente</label>
                <select class="form-select" id="selObjFont" onchange="updateSelectedFont(this.value)" style="width:140px;padding:6px 8px;font-size:0.82rem;">
                  ${fontsAvailable.map(f=>`<option value="${f}">${f}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex;gap:6px;margin-top:8px;">
                <button class="btn btn-danger btn-small" onclick="deleteSelected()" style="flex:1;">Eliminar</button>
              </div>
            </div>
          </div>

          <div class="price-estimate">
            <div class="price-label">PRECIO ESTIMADO</div>
            <div class="price-value" id="editorPrice">0.00€</div>
          </div>

          <div class="editor-actions">
            <button class="btn btn-primary" onclick="editorSubmitOrder()" style="width:100%;">Enviar Pedido</button>
            <button class="btn btn-secondary" onclick="editorSaveDesign()" style="width:100%;">Guardar para Después</button>
            <button class="btn btn-danger btn-small" onclick="editorReject()" style="width:100%;">Descartar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D Preview Modal -->
    <div class="modal-overlay" id="preview3dModal">
      <div class="modal-content">
        <button class="modal-close" onclick="close3DPreview()">✕</button>
        <h3 style="font-family:var(--font-display);font-size:1.1rem;letter-spacing:1px;margin-bottom:16px;">VISTA PREVIA <span style="color:var(--cyan)">360°</span></h3>
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:16px;">Arrastra con el ratón para rotar el modelo</p>
        <div id="preview3dContainer"></div>
      </div>
    </div>
  `;

  initEditorCanvas();
  updateEditorPrice();
}

function initEditorCanvas() {
  editorCanvas = document.getElementById('editorCanvas');
  if (!editorCanvas) return;
  editorCtx = editorCanvas.getContext('2d');

  // Create paint layer
  paintLayer = document.createElement('canvas');
  paintLayer.width = editorCanvas.width;
  paintLayer.height = editorCanvas.height;

  redrawEditor();
  setupEditorEvents();
}

function setupEditorEvents() {
  const c = editorCanvas;
  let lastClick = 0;

  c.addEventListener('mousedown', (e) => {
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (currentTool === 'paint') {
      isPainting = true;
      paintAt(x, y);
      return;
    }

    if (currentTool === 'text') {
      addTextObject(x, y);
      setTool('select');
      return;
    }

    if (currentTool === 'image') {
      document.getElementById('editorImgInsert').click();
      return;
    }

    // Select / drag
    const now = Date.now();
    const isDoubleClick = (now - lastClick) < 300;
    lastClick = now;

    const hit = findObjectAt(x, y);
    if (hit) {
      selectedObjectId = hit.id;
      isDragging = true;
      dragOffset.x = x - hit.x;
      dragOffset.y = y - hit.y;
      showObjectProps(hit);

      if (isDoubleClick && hit.type === 'text') {
        editTextInPlace(hit);
      }
    } else {
      selectedObjectId = null;
      hideObjectProps();
    }
    redrawEditor();
  });

  c.addEventListener('mousemove', (e) => {
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isPainting && currentTool === 'paint') {
      paintAt(x, y);
      return;
    }

    if (isDragging && selectedObjectId !== null) {
      const obj = editorObjects.find(o => o.id === selectedObjectId);
      if (obj) {
        obj.x = x - dragOffset.x;
        obj.y = y - dragOffset.y;
        redrawEditor();
      }
    }
  });

  c.addEventListener('mouseup', () => { isDragging = false; isPainting = false; });
  c.addEventListener('mouseleave', () => { isDragging = false; isPainting = false; });

  // Touch events for mobile
  c.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', { clientX: touch.clientX, clientY: touch.clientY });
    c.dispatchEvent(mouseEvent);
  }, { passive: false });

  c.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', { clientX: touch.clientX, clientY: touch.clientY });
    c.dispatchEvent(mouseEvent);
  }, { passive: false });

  c.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup');
    editorCanvas.dispatchEvent(mouseEvent);
  });
}

function paintAt(x, y) {
  if (!paintLayer) return;
  const ctx = paintLayer.getContext('2d');
  const brushSize = APP.editorState.brushSize;

  // Smart painting: only paint within image boundaries
  if (editorBgImage) {
    const imgData = editorCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    // Check if we're on a non-background pixel (smart detection)
    if (imgData[3] < 10) return; // transparent = outside image
  }

  ctx.fillStyle = APP.editorState.paintColor;
  ctx.beginPath();
  ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
  ctx.fill();
  redrawEditor();
}

function redrawEditor() {
  if (!editorCtx) return;
  const ctx = editorCtx;
  const w = editorCanvas.width;
  const h = editorCanvas.height;

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);

  // Grid pattern
  ctx.strokeStyle = 'rgba(0,240,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  // Background image
  if (editorBgImage) {
    const scale = Math.min(w / editorBgImage.width, h / editorBgImage.height, 1);
    const iw = editorBgImage.width * scale;
    const ih = editorBgImage.height * scale;
    const ix = (w - iw) / 2;
    const iy = (h - ih) / 2;
    ctx.drawImage(editorBgImage, ix, iy, iw, ih);
  }

  // Paint layer
  if (paintLayer) {
    ctx.drawImage(paintLayer, 0, 0);
  }

  // Objects
  editorObjects.forEach(obj => {
    if (obj.type === 'text') {
      ctx.font = `${obj.size}px ${obj.font}`;
      ctx.fillStyle = obj.color;
      ctx.fillText(obj.text, obj.x, obj.y);

      if (obj.id === selectedObjectId) {
        const metrics = ctx.measureText(obj.text);
        ctx.strokeStyle = 'var(--cyan)';
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(obj.x - 4, obj.y - obj.size - 2, metrics.width + 8, obj.size + 12);
        ctx.setLineDash([]);

        // Resize handles
        drawResizeHandle(ctx, obj.x - 4, obj.y - obj.size - 2);
        drawResizeHandle(ctx, obj.x + metrics.width + 4, obj.y - obj.size - 2);
        drawResizeHandle(ctx, obj.x - 4, obj.y + 10);
        drawResizeHandle(ctx, obj.x + metrics.width + 4, obj.y + 10);
      }
    } else if (obj.type === 'image' && obj.img) {
      ctx.drawImage(obj.img, obj.x, obj.y, obj.w, obj.h);

      if (obj.id === selectedObjectId) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(obj.x - 2, obj.y - 2, obj.w + 4, obj.h + 4);
        ctx.setLineDash([]);

        drawResizeHandle(ctx, obj.x - 2, obj.y - 2);
        drawResizeHandle(ctx, obj.x + obj.w + 2, obj.y - 2);
        drawResizeHandle(ctx, obj.x - 2, obj.y + obj.h + 2);
        drawResizeHandle(ctx, obj.x + obj.w + 2, obj.y + obj.h + 2);
      }
    }
  });
}

function drawResizeHandle(ctx, x, y) {
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(x - 4, y - 4, 8, 8);
}

function findObjectAt(x, y) {
  for (let i = editorObjects.length - 1; i >= 0; i--) {
    const obj = editorObjects[i];
    if (obj.type === 'text') {
      editorCtx.font = `${obj.size}px ${obj.font}`;
      const metrics = editorCtx.measureText(obj.text);
      if (x >= obj.x - 4 && x <= obj.x + metrics.width + 4 &&
          y >= obj.y - obj.size - 2 && y <= obj.y + 12) {
        return obj;
      }
    } else if (obj.type === 'image') {
      if (x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h) {
        return obj;
      }
    }
  }
  return null;
}

function addTextObject(x, y) {
  const text = prompt('Introduce el texto:');
  if (!text) return;
  editorObjects.push({
    id: Date.now(),
    type: 'text',
    text: text,
    x: x, y: y,
    size: 24,
    color: '#ffffff',
    font: 'Arial'
  });
  redrawEditor();
}

function editTextInPlace(obj) {
  const newText = prompt('Editar texto:', obj.text);
  if (newText !== null) {
    obj.text = newText;
    redrawEditor();
  }
}

function showObjectProps(obj) {
  const panel = document.getElementById('selectedObjProps');
  if (!panel) return;
  panel.style.display = 'block';

  if (obj.type === 'text') {
    document.getElementById('selObjColor').value = obj.color;
    document.getElementById('selObjSize').value = obj.size;
    const fontSelect = document.getElementById('selObjFont');
    if (fontSelect) {
      for (let opt of fontSelect.options) {
        if (opt.value === obj.font) { opt.selected = true; break; }
      }
    }
  }
}

function hideObjectProps() {
  const panel = document.getElementById('selectedObjProps');
  if (panel) panel.style.display = 'none';
}

function updateSelectedColor(color) {
  const obj = editorObjects.find(o => o.id === selectedObjectId);
  if (obj && obj.type === 'text') { obj.color = color; redrawEditor(); }
}

function updateSelectedSize(size) {
  const obj = editorObjects.find(o => o.id === selectedObjectId);
  if (obj) {
    if (obj.type === 'text') obj.size = size;
    else if (obj.type === 'image') {
      const ratio = obj.h / obj.w;
      obj.w = size * 4;
      obj.h = obj.w * ratio;
    }
    redrawEditor();
  }
}

function updateSelectedFont(font) {
  const obj = editorObjects.find(o => o.id === selectedObjectId);
  if (obj && obj.type === 'text') { obj.font = font; redrawEditor(); }
}

function deleteSelected() {
  editorObjects = editorObjects.filter(o => o.id !== selectedObjectId);
  selectedObjectId = null;
  hideObjectProps();
  redrawEditor();
}

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tool' + tool.charAt(0).toUpperCase() + tool.slice(1));
  if (btn) btn.classList.add('active');

  if (tool === 'paint') {
    editorCanvas.style.cursor = 'crosshair';
  } else if (tool === 'select') {
    editorCanvas.style.cursor = 'default';
  } else {
    editorCanvas.style.cursor = 'crosshair';
  }
}

function editorUploadImage() {
  document.getElementById('editorFileInput').click();
}

function handleEditorFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      editorBgImage = img;
      // Reset paint layer
      paintLayer = document.createElement('canvas');
      paintLayer.width = editorCanvas.width;
      paintLayer.height = editorCanvas.height;

      redrawEditor();
      showToast('Imagen cargada — introduce las medidas del objeto manualmente');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function handleInsertImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 200;
      const scale = Math.min(maxW / img.width, 1);
      editorObjects.push({
        id: Date.now(),
        type: 'image',
        img: img,
        x: 100, y: 100,
        w: img.width * scale,
        h: img.height * scale
      });
      setTool('select');
      redrawEditor();
      showToast('Imagen insertada');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function editorClearBg() {
  editorBgImage = null;
  paintLayer = document.createElement('canvas');
  paintLayer.width = editorCanvas.width;
  paintLayer.height = editorCanvas.height;
  // Reset dimensions to 0
  APP.editorState.width = 0;
  APP.editorState.height = 0;
  APP.editorState.depth = 0;
  const elW = document.getElementById('edDimW');
  const elH = document.getElementById('edDimH');
  const elD = document.getElementById('edDimD');
  if (elW) elW.value = 0;
  if (elH) elH.value = 0;
  if (elD) elD.value = 0;
  updateEditorPrice();
  redrawEditor();
}

function updateEditorDimensions() {
  APP.editorState.width = parseInt(document.getElementById('edDimW')?.value || 0);
  APP.editorState.height = parseInt(document.getElementById('edDimH')?.value || 0);
  APP.editorState.depth = parseInt(document.getElementById('edDimD')?.value || 0);
  updateEditorPrice();
}

function updateEditorPrice() {
  const es = APP.editorState;
  const mat = document.getElementById('edMaterial')?.value || es.material;
  es.material = mat;
  const w = parseInt(document.getElementById('edDimW')?.value || es.width);
  const h = parseInt(document.getElementById('edDimH')?.value || es.height);
  const d = parseInt(document.getElementById('edDimD')?.value || es.depth);
  const price = calcPrice(w, h, d, mat);
  const el = document.getElementById('editorPrice');
  if (el) el.textContent = price + '€';
}

function editorSubmitOrder() {
  if (!APP.user) { navigateTo('auth'); showToast('Inicia sesión para enviar el pedido'); return; }
  const es = APP.editorState;
  const price = calcPrice(es.width, es.height, es.depth, es.material);
  const order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    items: [{ name: 'Diseño Personalizado', material: es.material }],
    total: price,
    status: 'pending',
    user: APP._adminEditorMode ? 'admin-editor@3dguadalajara.com' : APP.user.email,
    material: es.material,
    color: es.color,
    customText: editorObjects.filter(o=>o.type==='text').map(o=>o.text).join(', '),
    dimensions: { w: es.width, h: es.height, d: es.depth },
    source: APP._adminEditorMode ? 'admin-editor' : 'editor'
  };
  APP.orders.push(order);

  if (APP._adminEditorMode) {
    APP._adminEditorMode = false;
    showToast('Pedido creado desde editor: ' + order.id);
    navigateTo('admin');
  } else {
    showToast('Pedido enviado: ' + order.id);
    navigateTo('dashboard');
  }
}

function editorSaveDesign() {
  if (!APP.user) { navigateTo('auth'); showToast('Inicia sesión para guardar'); return; }
  APP.designs.push({
    name: 'Diseño ' + (APP.designs.length + 1),
    date: new Date().toLocaleDateString('es-ES'),
    material: APP.editorState.material,
    user: APP.user.email
  });
  showToast('Diseño guardado correctamente');
}

function editorReject() {
  editorObjects = [];
  selectedObjectId = null;
  editorBgImage = null;
  if (paintLayer) {
    const ctx = paintLayer.getContext('2d');
    ctx.clearRect(0, 0, paintLayer.width, paintLayer.height);
  }
  redrawEditor();
  showToast('Diseño descartado');
}

// ===== 3D PREVIEW WITH THREE.JS =====
let threeScene, threeCamera, threeRenderer, threeMesh;
let isRotating = false;
let prevMouseX = 0, prevMouseY = 0;

function show3DPreview() {
  if (!APP.admin3dEnabled) { showToast('Vista 3D deshabilitada por el administrador'); return; }
  const modal = document.getElementById('preview3dModal');
  modal.classList.add('active');

  const container = document.getElementById('preview3dContainer');
  container.innerHTML = '';

  // Setup Three.js
  threeScene = new THREE.Scene();
  threeScene.background = new THREE.Color(0x0a0a1a);

  const w = container.clientWidth || 600;
  const h = 400;
  threeCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
  threeCamera.position.z = 5;

  threeRenderer = new THREE.WebGLRenderer({ antialias: true });
  threeRenderer.setSize(w, h);
  container.appendChild(threeRenderer.domElement);

  // Create textured box from canvas
  const es = APP.editorState;
  const scaleW = (es.width || 100) / 100;
  const scaleH = (es.height || 100) / 100;
  const scaleD = (es.depth || 20) / 100;

  // Create texture from editor canvas
  let texture;
  if (editorCanvas) {
    texture = new THREE.CanvasTexture(editorCanvas);
  } else {
    texture = null;
  }

  const geometry = new THREE.BoxGeometry(scaleW * 2, scaleH * 2, scaleD * 2);
  const materials = [];
  const baseMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(APP.editorState.color),
    shininess: 60
  });
  const texMat = texture ? new THREE.MeshPhongMaterial({ map: texture, shininess: 60 }) : baseMat;

  // Front face gets texture, others get base color
  for (let i = 0; i < 6; i++) {
    materials.push(i === 4 ? texMat : baseMat.clone());
  }

  threeMesh = new THREE.Mesh(geometry, materials);
  threeScene.add(threeMesh);

  // Lighting
  const ambLight = new THREE.AmbientLight(0x404060, 0.6);
  threeScene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
  dirLight.position.set(5, 5, 5);
  threeScene.add(dirLight);
  const dirLight2 = new THREE.DirectionalLight(0xff2d95, 0.3);
  dirLight2.position.set(-5, -3, 2);
  threeScene.add(dirLight2);

  // Grid helper
  const gridHelper = new THREE.GridHelper(10, 20, 0x00f0ff, 0x112233);
  gridHelper.position.y = -scaleH - 0.5;
  threeScene.add(gridHelper);

  // Mouse rotation
  const el = threeRenderer.domElement;
  el.addEventListener('mousedown', (e) => { isRotating = true; prevMouseX = e.clientX; prevMouseY = e.clientY; });
  el.addEventListener('mousemove', (e) => {
    if (!isRotating) return;
    const dx = e.clientX - prevMouseX;
    const dy = e.clientY - prevMouseY;
    threeMesh.rotation.y += dx * 0.01;
    threeMesh.rotation.x += dy * 0.01;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });
  el.addEventListener('mouseup', () => isRotating = false);
  el.addEventListener('mouseleave', () => isRotating = false);

  // Touch support
  el.addEventListener('touchstart', (e) => {
    isRotating = true;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    if (!isRotating) return;
    const dx = e.touches[0].clientX - prevMouseX;
    const dy = e.touches[0].clientY - prevMouseY;
    threeMesh.rotation.y += dx * 0.01;
    threeMesh.rotation.x += dy * 0.01;
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', () => isRotating = false);

  animate3D();
}

function animate3D() {
  if (!document.getElementById('preview3dModal')?.classList.contains('active')) return;
  requestAnimationFrame(animate3D);
  if (!isRotating && threeMesh) {
    threeMesh.rotation.y += 0.005;
  }
  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}

function close3DPreview() {
  document.getElementById('preview3dModal').classList.remove('active');
  if (threeRenderer) {
    threeRenderer.dispose();
    threeRenderer = null;
  }
}

// ===== PRIVACY PAGE =====
function renderPrivacy() {
  document.getElementById('page-privacy').innerHTML = `
    <div class="container legal-content">
      <h2>POLÍTICA DE <span>PRIVACIDAD</span></h2>
      <p style="color:var(--text3);font-size:0.82rem;margin-bottom:24px;">Última actualización: 26 de mayo de 2026</p>

      <h3>1. Responsable del tratamiento</h3>
      <p>3D Guadalajara, con domicilio en Guadalajara, España. Teléfono de contacto: <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a>. Email: info@3dguadalajara.com</p>

      <h3>2. Datos que recopilamos</h3>
      <p>Recopilamos los datos que nos proporcionas voluntariamente al registrarte, realizar un pedido o contactar con nosotros:</p>
      <ul>
        <li>Datos identificativos: nombre, dirección de email, teléfono.</li>
        <li>Datos de envío: dirección postal, ciudad.</li>
        <li>Datos de pedidos: productos solicitados, diseños personalizados, presupuestos y facturas.</li>
        <li>Datos técnicos: dirección IP, tipo de navegador, datos de navegación (cookies).</li>
      </ul>

      <h3>3. Finalidad del tratamiento</h3>
      <ul>
        <li>Gestión de tu cuenta de usuario y área privada.</li>
        <li>Procesamiento de pedidos, presupuestos y facturación.</li>
        <li>Comunicación sobre el estado de tus pedidos y envíos (transportista y número de seguimiento).</li>
        <li>Atención al cliente mediante el sistema de tickets y chat de soporte.</li>
        <li>Mejora de nuestros servicios y experiencia de usuario.</li>
      </ul>

      <h3>4. Base legal</h3>
      <p>El tratamiento de tus datos se basa en el consentimiento que nos otorgas al registrarte y utilizar nuestros servicios, así como en la ejecución del contrato de compraventa de productos y servicios de impresión 3D.</p>

      <h3>5. Conservación de datos</h3>
      <p>Conservaremos tus datos mientras mantengas tu cuenta activa y durante los plazos legalmente exigidos para el cumplimiento de obligaciones fiscales y mercantiles.</p>

      <h3>6. Destinatarios</h3>
      <p>Tus datos podrán ser comunicados a:</p>
      <ul>
        <li>Empresas de transporte (GLS, UPS, SEUR) para la gestión de envíos.</li>
        <li>Administraciones públicas cuando exista obligación legal.</li>
      </ul>
      <p>No se realizan transferencias internacionales de datos.</p>

      <h3>7. Derechos del usuario</h3>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un email a info@3dguadalajara.com o llamando al +34 659 919 485.</p>

      <h3>8. Seguridad</h3>
      <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, la pérdida o la destrucción.</p>

      <h3>9. Modificaciones</h3>
      <p>Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado en esta página con la fecha de actualización.</p>
    </div>
  `;
}

// ===== COOKIES PAGE =====
function renderCookies() {
  document.getElementById('page-cookies').innerHTML = `
    <div class="container legal-content">
      <h2>POLÍTICA DE <span>COOKIES</span></h2>
      <p style="color:var(--text3);font-size:0.82rem;margin-bottom:24px;">Última actualización: 26 de mayo de 2026</p>

      <h3>1. ¿Qué son las cookies?</h3>
      <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten recordar tus preferencias, mejorar la experiencia de navegación y recopilar información analítica.</p>

      <h3>2. Tipos de cookies que utilizamos</h3>

      <h3>2.1 Cookies técnicas (necesarias)</h3>
      <p>Imprescindibles para el funcionamiento del sitio web. Permiten la navegación, el inicio de sesión, el carrito de compras y la gestión de pedidos.</p>
      <ul>
        <li><strong>session_id</strong> — Identificación de sesión de usuario. Duración: sesión.</li>
        <li><strong>cart_data</strong> — Datos del carrito de compras. Duración: 30 días.</li>
        <li><strong>cookie_consent</strong> — Registro de tu elección sobre cookies. Duración: 12 meses.</li>
      </ul>

      <h3>2.2 Cookies de preferencias</h3>
      <p>Permiten recordar tus configuraciones como idioma, tema visual o preferencias del editor 3D.</p>
      <ul>
        <li><strong>user_prefs</strong> — Preferencias de interfaz. Duración: 12 meses.</li>
        <li><strong>editor_settings</strong> — Configuración del editor 3D. Duración: 12 meses.</li>
      </ul>

      <h3>2.3 Cookies analíticas</h3>
      <p>Nos ayudan a entender cómo los usuarios interactúan con el sitio web para mejorar nuestros servicios.</p>
      <ul>
        <li><strong>_analytics</strong> — Datos de navegación anónimos. Duración: 24 meses.</li>
      </ul>

      <h3>3. Gestión de cookies</h3>
      <p>Puedes aceptar o rechazar las cookies no esenciales mediante el banner que aparece al visitar el sitio. También puedes configurar tu navegador para bloquear o eliminar cookies, aunque esto podría afectar a la funcionalidad del sitio.</p>

      <h3>4. Cómo eliminar cookies</h3>
      <ul>
        <li><strong>Chrome:</strong> Configuración > Privacidad y seguridad > Cookies</li>
        <li><strong>Firefox:</strong> Configuración > Privacidad > Cookies y datos del sitio</li>
        <li><strong>Safari:</strong> Preferencias > Privacidad > Gestionar datos</li>
        <li><strong>Edge:</strong> Configuración > Privacidad > Cookies</li>
      </ul>

      <h3>5. Contacto</h3>
      <p>Para cualquier consulta sobre nuestra política de cookies, contacta con nosotros en info@3dguadalajara.com o al <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a>.</p>
    </div>
  `;
}

// ===== SITEMAP PAGE =====
function renderSitemap() {
  const payCardSvg = `<svg viewBox="0 0 48 32" fill="none"><rect x="1" y="1" width="46" height="30" rx="4" stroke="var(--cyan)" stroke-width="1.2" fill="rgba(0,240,255,0.04)"/><rect x="1" y="7" width="46" height="5" fill="rgba(0,240,255,0.15)"/><rect x="6" y="18" width="16" height="3" rx="1" fill="rgba(0,240,255,0.25)"/><rect x="6" y="23" width="10" height="2" rx="1" fill="rgba(0,240,255,0.15)"/><circle cx="36" cy="18" r="5" fill="rgba(255,0,128,0.2)" stroke="var(--magenta)" stroke-width="0.8"/><circle cx="40" cy="18" r="5" fill="rgba(0,240,255,0.15)" stroke="var(--cyan)" stroke-width="0.8"/></svg>`;
  const payTransferSvg = `<svg viewBox="0 0 48 32" fill="none"><rect x="1" y="1" width="46" height="30" rx="4" stroke="var(--cyan)" stroke-width="1.2" fill="rgba(0,240,255,0.04)"/><rect x="8" y="6" width="32" height="6" rx="2" fill="rgba(0,240,255,0.12)" stroke="var(--cyan)" stroke-width="0.6"/><path d="M14 12 V26" stroke="var(--cyan)" stroke-width="0.8" stroke-dasharray="2 2"/><path d="M24 12 V26" stroke="var(--cyan)" stroke-width="0.8" stroke-dasharray="2 2"/><path d="M34 12 V26" stroke="var(--cyan)" stroke-width="0.8" stroke-dasharray="2 2"/><rect x="8" y="22" width="32" height="4" rx="1" fill="rgba(0,240,255,0.08)"/><text x="24" y="10" text-anchor="middle" font-size="4" fill="var(--cyan)" font-family="var(--font-heading)">IBAN</text></svg>`;
  const payBizumSvg = `<svg viewBox="0 0 48 32" fill="none"><rect x="1" y="1" width="46" height="30" rx="4" stroke="var(--cyan)" stroke-width="1.2" fill="rgba(0,240,255,0.04)"/><circle cx="24" cy="14" r="8" fill="rgba(0,240,255,0.08)" stroke="var(--cyan)" stroke-width="0.8"/><text x="24" y="16.5" text-anchor="middle" font-size="7" font-weight="bold" fill="var(--cyan)" font-family="var(--font-heading)">B</text><rect x="14" y="24" width="20" height="3" rx="1.5" fill="rgba(0,240,255,0.12)"/><text x="24" y="26.5" text-anchor="middle" font-size="3.5" fill="var(--cyan)" font-family="var(--font-heading)">BIZUM</text></svg>`;
  const payCryptoSvg = `<svg viewBox="0 0 48 32" fill="none"><rect x="1" y="1" width="46" height="30" rx="4" stroke="var(--cyan)" stroke-width="1.2" fill="rgba(0,240,255,0.04)"/><circle cx="24" cy="14" r="9" fill="none" stroke="var(--cyan)" stroke-width="0.8"/><circle cx="24" cy="14" r="5" fill="rgba(0,240,255,0.1)" stroke="var(--magenta)" stroke-width="0.6"/><circle cx="24" cy="14" r="2" fill="var(--cyan)" opacity="0.4"/><path d="M24 5 L24 2" stroke="var(--cyan)" stroke-width="0.6"/><path d="M24 23 L24 26" stroke="var(--cyan)" stroke-width="0.6"/><path d="M15 14 L12 14" stroke="var(--cyan)" stroke-width="0.6"/><path d="M33 14 L36 14" stroke="var(--cyan)" stroke-width="0.6"/><text x="24" y="28.5" text-anchor="middle" font-size="3" fill="var(--magenta)" font-family="var(--font-heading)">WORLDCOIN</text></svg>`;

  document.getElementById('page-sitemap').innerHTML = `
    <div class="container sitemap-content">
      <div class="section-header">
        <h2>MAPA DEL <span>SITIO</span></h2>
        <p>Navegación completa de 3D Guadalajara</p>
      </div>

      <div class="sitemap-grid">
        <div class="sitemap-section">
          <h3>🏠 Navegación Principal</h3>
          <a href="#" onclick="navigateTo('home')">Inicio</a>
          <a href="#" onclick="navigateTo('pricing')">Tarifas y Precios</a>
          <a href="#" onclick="navigateTo('shop')">Tienda de Productos</a>
          <a href="#" onclick="navigateTo('editor')">Editor 3D</a>
          <a href="#" onclick="navigateTo('quote')">Solicitar Presupuesto</a>
        </div>

        <div class="sitemap-section">
          <h3>👤 Área de Usuario</h3>
          <a href="#" onclick="navigateTo('auth')">Iniciar Sesión / Registro</a>
          <a href="#" onclick="navigateTo('dashboard')">Panel de Usuario</a>
          <a href="#" onclick="navigateTo('cart')">Carrito de Compras</a>
          <a href="#" onclick="navigateTo('tickets')">Tickets de Soporte</a>
        </div>

        <div class="sitemap-section">
          <h3>⚙️ Administración</h3>
          <a href="#" onclick="navigateTo('admin')">Panel de Administración</a>
          <p style="font-size:0.78rem;color:var(--text3);margin-top:4px;">Pedidos, Presupuestos, Facturas, Usuarios, Tickets, Configuración, Métodos de Pago</p>
        </div>

        <div class="sitemap-section">
          <h3>📋 Legal</h3>
          <a href="#" onclick="navigateTo('privacy')">Política de Privacidad</a>
          <a href="#" onclick="navigateTo('cookies')">Política de Cookies</a>
        </div>

        <div class="sitemap-section" style="grid-column: 1 / -1;">
          <h3>💳 Formas de Pago</h3>
          <p style="font-size:0.84rem;color:var(--text2);margin-bottom:14px;">Aceptamos los siguientes métodos de pago para tu comodidad y seguridad.</p>
          <div class="sitemap-pay-grid">
            <div class="sitemap-pay-card">
              <div class="footer-pay-icon">${payCardSvg}</div>
              <div class="sitemap-pay-card-info">
                <strong>Tarjeta de crédito / débito</strong>
                <span>Visa, Mastercard, American Express. Pago seguro e instantáneo. Tu pedido se procesa inmediatamente tras la confirmación del pago.</span>
              </div>
            </div>
            <div class="sitemap-pay-card">
              <div class="footer-pay-icon">${payTransferSvg}</div>
              <div class="sitemap-pay-card-info">
                <strong>Transferencia bancaria</strong>
                <span>Realiza una transferencia directa a nuestra cuenta bancaria. El producto será enviado con nº de seguimiento del transportista una vez recibido el pago (hasta 72h laborables, sin incluir fines de semana ni festivos). Tras confirmar el pago se emitirá factura y comprobante.</span>
              </div>
            </div>
            <div class="sitemap-pay-card">
              <div class="footer-pay-icon">${payBizumSvg}</div>
              <div class="sitemap-pay-card-info">
                <strong>Bizum</strong>
                <span>Pago instantáneo desde tu móvil al número de teléfono de 3D Guadalajara. Rápido, sencillo y seguro. Tu pedido se procesa de inmediato.</span>
              </div>
            </div>
            <div class="sitemap-pay-card">
              <div class="footer-pay-icon">${payCryptoSvg}</div>
              <div class="sitemap-pay-card-info">
                <strong>Worldcoin (Criptomonedas)</strong>
                <span>Pago con criptomonedas en la red Optimism (OP Mainnet). El producto será enviado con nº de seguimiento del transportista una vez recibido el pago (hasta 72h laborables, sin incluir fines de semana ni festivos). Tras confirmar el pago se emitirá factura y comprobante.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sitemap-section">
          <h3>📞 Contacto</h3>
          <p style="font-size:0.84rem;color:var(--text2);">Guadalajara, España</p>
          <p style="font-size:0.84rem;"><a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a></p>
          <p style="font-size:0.84rem;color:var(--text2);">info@3dguadalajara.com</p>
        </div>
      </div>
    </div>
  `;
}

// ===== TICKET SYSTEM =====
function renderTickets() {
  const userTickets = APP.user ? APP.tickets.filter(t => t.user === APP.user.email) : [];

  document.getElementById('page-tickets').innerHTML = `
    <div class="container" style="padding-top:40px;padding-bottom:80px;">
      <div class="section-header">
        <h2>SOPORTE <span>TÉCNICO</span></h2>
        <p>Crea un ticket y te responderemos lo antes posible</p>
      </div>

      ${!APP.user ? `
        <div style="text-align:center;padding:40px;">
          <p style="color:var(--text2);margin-bottom:16px;">Inicia sesión para crear y gestionar tus tickets de soporte.</p>
          <button class="btn btn-primary" onclick="navigateTo('auth')">Iniciar Sesión</button>
        </div>
      ` : `
        <!-- New ticket form -->
        <div style="max-width:700px;margin:0 auto 40px;">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;">
            <h3 style="font-family:var(--font-display);font-size:0.9rem;letter-spacing:1px;color:var(--cyan);margin-bottom:18px;">NUEVO TICKET</h3>
            <div class="form-group">
              <label>Categoría</label>
              <select class="form-select" id="ticketCategory">
                ${(APP.ticketCategories||[]).map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Asunto</label>
              <input type="text" class="form-input" id="ticketSubject" placeholder="Describe brevemente tu consulta">
            </div>
            <div class="form-group">
              <label>Mensaje</label>
              <textarea class="form-textarea" id="ticketMessage" placeholder="Explica tu problema o consulta con detalle..." style="min-height:120px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="submitTicket()">Enviar Ticket</button>
          </div>
        </div>

        <!-- Tickets list -->
        <div style="max-width:700px;margin:0 auto;">
          <h3 style="font-family:var(--font-display);font-size:0.9rem;letter-spacing:1px;color:var(--text3);margin-bottom:16px;">MIS TICKETS (${userTickets.length})</h3>
          ${userTickets.length === 0 ? `
            <div style="text-align:center;padding:32px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);">
              <p style="color:var(--text3);">No tienes tickets abiertos</p>
            </div>
          ` : userTickets.map(t => renderTicketCard(t)).join('')}
        </div>

        <div style="text-align:center;margin-top:32px;">
          <p style="color:var(--text2);font-size:0.88rem;">También puedes contactarnos por teléfono: <a href="tel:+34659919485" style="color:var(--cyan);text-decoration:none;">+34 659 919 485</a></p>
        </div>
      `}
    </div>
  `;
}

function renderTicketCard(t) {
  const statusMap = { open: 'Abierto', answered: 'Respondido', closed: 'Cerrado' };
  const statusClass = { open: 'status-pending', answered: 'status-completed', closed: 'status-shipped' };
  const catMap = { pedido:'Pedido', envio:'Envío', editor:'Editor 3D', facturacion:'Facturación', cuenta:'Cuenta', otro:'Otro' };

  return `
    <div class="ticket-card">
      <div class="ticket-header">
        <div>
          <span class="ticket-id">${t.id}</span>
          <span style="font-size:0.75rem;color:var(--text3);margin-left:10px;">${t.date}</span>
          <span style="font-size:0.72rem;color:var(--text3);margin-left:8px;background:var(--bg2);padding:2px 8px;border-radius:10px;">${catMap[t.category]||t.category}</span>
        </div>
        <span class="status-badge ${statusClass[t.status]||'status-pending'}">${statusMap[t.status]||t.status}</span>
      </div>
      <div class="ticket-subject">${t.subject}</div>
      <div class="ticket-body">${t.message}</div>
      ${t.replies && t.replies.length > 0 ? t.replies.map(r => `
        <div class="ticket-reply">
          <div class="ticket-reply-header">${r.from === 'admin' ? 'SOPORTE 3D GUADALAJARA' : 'TÚ'} — ${r.date}</div>
          <p style="font-size:0.85rem;color:var(--text2);">${r.message}</p>
        </div>
      `).join('') : ''}
      ${t.status !== 'closed' ? `
        <div style="margin-top:12px;display:flex;gap:8px;">
          <input type="text" class="form-input" id="reply-${t.id}" placeholder="Escribe una respuesta..." style="flex:1;">
          <button class="btn btn-secondary btn-small" onclick="replyTicket('${t.id}')">Responder</button>
        </div>
      ` : ''}
    </div>
  `;
}

function submitTicket() {
  const category = document.getElementById('ticketCategory')?.value;
  const subject = document.getElementById('ticketSubject')?.value?.trim();
  const message = document.getElementById('ticketMessage')?.value?.trim();

  if (!subject || !message) { showToast('Completa el asunto y el mensaje'); return; }

  const ticket = {
    id: 'TK-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('es-ES'),
    user: APP.user.email,
    category, subject, message,
    status: 'open',
    priority: APP.ticketSettings.defaultPriority || 'normal',
    replies: []
  };

  // Auto-reply if enabled
  if (APP.ticketSettings.autoReplyEnabled && APP.ticketSettings.autoReplyMessage) {
    ticket.replies.push({
      from: 'admin',
      date: new Date().toLocaleDateString('es-ES'),
      message: APP.ticketSettings.autoReplyMessage
    });
    ticket.status = 'answered';
  }

  APP.tickets.push(ticket);
  simulateEmail(APP.user.email, 'ticketCreated', { nombre: APP.user.name || APP.user.email, id: ticket.id, asunto: subject, categoria: category });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketCreated', { nombre: APP.user.name || APP.user.email, id: ticket.id, asunto: subject, categoria: category }, { adminOnly: true });
  showToast('Ticket enviado: ' + ticket.id);
  renderTickets();
}

function replyTicket(ticketId) {
  const input = document.getElementById('reply-' + ticketId);
  const msg = input?.value?.trim();
  if (!msg) return;

  const ticket = APP.tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.replies.push({
      from: 'user',
      date: new Date().toLocaleDateString('es-ES'),
      message: msg
    });
    showToast('Respuesta enviada');
    renderTickets();
  }
}

// ===== CHAT WIDGET =====
let chatOpen = false;
let chatInitialized = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  const icon = document.getElementById('chatToggleIcon');
  if (chatOpen) {
    win.classList.add('open');
    icon.textContent = '✕';
    if (!chatInitialized) {
      chatInitialized = true;
      addBotMessage('Hola, bienvenido a 3D Guadalajara. Soy el asistente virtual. ¿En qué puedo ayudarte?');
      setTimeout(() => {
        addBotMessage('Puedes preguntarme sobre pedidos, materiales, presupuestos, envíos o cualquier duda. También puedes llamarnos al +34 659 919 485.');
      }, 1000);
    }
    document.getElementById('chatInput')?.focus();
  } else {
    win.classList.remove('open');
    icon.textContent = '💬';
  }
}

function addBotMessage(text) {
  const container = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = text + '<div class="msg-time">' + time + '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = text + '<div class="msg-time">' + time + '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const msg = input?.value?.trim();
  if (!msg) return;

  addUserMessage(msg);
  input.value = '';

  setTimeout(() => {
    const response = getChatResponse(msg);
    addBotMessage(response);
  }, 600);
}

function getChatResponse(msg) {
  const lower = msg.toLowerCase();
  for (let i = 0; i < APP.chatbotRules.length; i++) {
    const rule = APP.chatbotRules[i];
    const kws = rule.keywords.split(',').map(k => k.trim()).filter(k => k);
    if (kws.some(kw => lower.includes(kw))) {
      return rule.response;
    }
  }
  return APP.chatbotDefaultResponse;
}

// ===== COOKIE BANNER =====
function showCookieBanner() {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.add('show');
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  closeCookieBanner();
  showToast('Preferencias de cookies guardadas');
}

function closeCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('show');
}

// ===== ADMIN TICKET MANAGEMENT =====
function renderAdminTickets() {
  const cats = APP.ticketCategories || [];
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c);
  const priorityColors = { urgent:'#FF4444', high:'#FF8800', normal:'var(--cyan)', low:'var(--text3)' };
  const priorityNames = { urgent:'Urgente', high:'Alta', normal:'Normal', low:'Baja' };
  const statusNames = { open:'Abierto', answered:'Respondido', closed:'Cerrado', reopened:'Reabierto' };
  const statusClass = { open:'status-pending', answered:'status-completed', closed:'status-cancelled', reopened:'status-pending' };

  const openCount = APP.tickets.filter(t=>t.status==='open'||t.status==='reopened').length;
  const answeredCount = APP.tickets.filter(t=>t.status==='answered').length;
  const closedCount = APP.tickets.filter(t=>t.status==='closed').length;

  return `
    <h3>GESTIÓN AVANZADA DE TICKETS</h3>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px;">
      <div style="padding:14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);border-left:3px solid var(--warning);">
        <p style="font-family:var(--font-display);font-size:0.7rem;color:var(--warning);margin-bottom:2px;">ABIERTOS</p>
        <p style="font-size:1.5rem;font-family:var(--font-display);color:var(--text1);">${openCount}</p>
      </div>
      <div style="padding:14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);border-left:3px solid var(--success);">
        <p style="font-family:var(--font-display);font-size:0.7rem;color:var(--success);margin-bottom:2px;">RESPONDIDOS</p>
        <p style="font-size:1.5rem;font-family:var(--font-display);color:var(--text1);">${answeredCount}</p>
      </div>
      <div style="padding:14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);border-left:3px solid var(--text3);">
        <p style="font-family:var(--font-display);font-size:0.7rem;color:var(--text3);margin-bottom:2px;">CERRADOS</p>
        <p style="font-size:1.5rem;font-family:var(--font-display);color:var(--text1);">${closedCount}</p>
      </div>
      <div style="padding:14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);border-left:3px solid var(--cyan);">
        <p style="font-family:var(--font-display);font-size:0.7rem;color:var(--cyan);margin-bottom:2px;">TOTAL</p>
        <p style="font-size:1.5rem;font-family:var(--font-display);color:var(--text1);">${APP.tickets.length}</p>
      </div>
    </div>

    <!-- Actions bar -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
      <button class="btn btn-primary btn-small" onclick="adminCreateTicket()">+ Nuevo Ticket</button>
      <button class="btn btn-secondary btn-small" onclick="adminTicketCategories()">Categorías</button>
      <button class="btn btn-secondary btn-small" onclick="adminTicketConfig()">Configuración</button>
    </div>

    <!-- Filters -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center;">
      <select class="form-select" style="width:auto;padding:6px 10px;font-size:0.8rem;" onchange="adminFilterTickets(this.value)" id="ticketFilterStatus">
        <option value="all">Todos los estados</option>
        <option value="open">Abiertos</option>
        <option value="answered">Respondidos</option>
        <option value="closed">Cerrados</option>
        <option value="reopened">Reabiertos</option>
      </select>
      <select class="form-select" style="width:auto;padding:6px 10px;font-size:0.8rem;" onchange="adminFilterTickets()" id="ticketFilterCategory">
        <option value="all">Todas las categorías</option>
        ${cats.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
      </select>
      <select class="form-select" style="width:auto;padding:6px 10px;font-size:0.8rem;" onchange="adminFilterTickets()" id="ticketFilterPriority">
        <option value="all">Todas las prioridades</option>
        <option value="urgent">Urgente</option>
        <option value="high">Alta</option>
        <option value="normal">Normal</option>
        <option value="low">Baja</option>
      </select>
    </div>

    ${APP.tickets.length === 0 ? '<p style="color:var(--text3);">No hay tickets. Crea uno nuevo para empezar.</p>' : `
    <div class="table-responsive"><table class="data-table" id="adminTicketsTable">
      <thead><tr><th>ID</th><th>PRIORIDAD</th><th>USUARIO</th><th>CATEGORÍA</th><th>ASUNTO</th><th>FECHA</th><th>RESPUESTAS</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
      <tbody>${APP.tickets.map((t,i)=>{
        const cat = catMap[t.category];
        const pColor = priorityColors[t.priority||'normal'];
        const pName = priorityNames[t.priority||'normal'];
        return `<tr data-status="${t.status}" data-category="${t.category}" data-priority="${t.priority||'normal'}">
        <td style="font-family:var(--font-display);color:var(--cyan);font-size:0.78rem;">${t.id}</td>
        <td><span style="color:${pColor};font-family:var(--font-display);font-size:0.72rem;padding:2px 8px;border:1px solid ${pColor};border-radius:4px;">${pName}</span></td>
        <td style="font-size:0.82rem;">${t.user}</td>
        <td style="font-size:0.82rem;">${cat ? cat.icon+' ' : ''}${cat ? cat.name : t.category}</td>
        <td style="font-size:0.82rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.subject}</td>
        <td style="font-size:0.8rem;">${t.date}</td>
        <td style="text-align:center;font-family:var(--font-display);">${(t.replies||[]).length}</td>
        <td><span class="status-badge ${statusClass[t.status]||'status-pending'}">${statusNames[t.status]||t.status}</span></td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-small" onclick="adminViewTicket(${i})" style="font-size:0.72rem;padding:4px 8px;">Ver</button>
            ${t.status==='closed' && APP.ticketSettings.allowReopenClosed ? `<button class="btn btn-secondary btn-small" onclick="adminReopenTicket(${i})" style="font-size:0.72rem;padding:4px 8px;">Reabrir</button>` : ''}
            ${t.status!=='closed' ? `<button class="btn btn-secondary btn-small" onclick="adminCloseTicket(${i})" style="font-size:0.72rem;padding:4px 8px;">Cerrar</button>` : ''}
            <button class="btn btn-danger btn-small" onclick="adminDeleteTicket(${i})" style="font-size:0.72rem;padding:4px 8px;">Eliminar</button>
          </div>
        </td>
      </tr>`}).join('')}</tbody>
    </table></div>`}
  `;
}

function adminFilterTickets() {
  const status = document.getElementById('ticketFilterStatus')?.value || 'all';
  const category = document.getElementById('ticketFilterCategory')?.value || 'all';
  const priority = document.getElementById('ticketFilterPriority')?.value || 'all';
  const rows = document.querySelectorAll('#adminTicketsTable tbody tr');
  rows.forEach(row => {
    const s = row.dataset.status;
    const c = row.dataset.category;
    const p = row.dataset.priority;
    const show = (status==='all'||s===status) && (category==='all'||c===category) && (priority==='all'||p===priority);
    row.style.display = show ? '' : 'none';
  });
}

function updateTicketStatus(idx, status) {
  const prev = APP.tickets[idx].status;
  APP.tickets[idx].status = status;
  const t = APP.tickets[idx];
  if (status==='closed' && prev!=='closed') {
    simulateEmail(t.user, 'ticketClosed', { nombre: t.user, id: t.id });
    simulateEmail(APP.adminSettings.adminEmail, 'ticketClosed', { nombre: t.user, id: t.id }, { adminOnly: true });
  }
  if (status==='open' && prev==='closed') {
    simulateEmail(t.user, 'ticketReopened', { nombre: t.user, id: t.id });
    simulateEmail(APP.adminSettings.adminEmail, 'ticketReopened', { nombre: t.user, id: t.id }, { adminOnly: true });
  }
  showToast('Estado del ticket actualizado');
}

function adminCreateTicket() {
  const cats = APP.ticketCategories || [];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <h3>CREAR NUEVO TICKET</h3>
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;max-width:650px;">
      <div class="form-group"><label>Email del usuario</label><input type="email" class="form-input" id="newTicketUser" placeholder="usuario@email.com"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label>Categoría</label>
          <select class="form-select" id="newTicketCategory">
            ${cats.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Prioridad</label>
          <select class="form-select" id="newTicketPriority">
            <option value="low">Baja</option>
            <option value="normal" selected>Normal</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label>Asunto</label><input type="text" class="form-input" id="newTicketSubject"></div>
      <div class="form-group"><label>Mensaje</label><textarea class="form-input" id="newTicketMessage" rows="5" placeholder="Describe el asunto..."></textarea></div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="btn btn-primary" onclick="adminSaveNewTicket()">Crear Ticket</button>
        <button class="btn btn-secondary" onclick="showAdminSection('ticketsmgmt',document.querySelectorAll('.admin-nav-btn')[8])">Cancelar</button>
      </div>
    </div>
  `;
}

function adminSaveNewTicket() {
  const user = document.getElementById('newTicketUser')?.value?.trim();
  const category = document.getElementById('newTicketCategory')?.value;
  const priority = document.getElementById('newTicketPriority')?.value || 'normal';
  const subject = document.getElementById('newTicketSubject')?.value?.trim();
  const message = document.getElementById('newTicketMessage')?.value?.trim();
  if (!user || !subject || !message) { showToast('Todos los campos son obligatorios'); return; }
  const id = 'TK-' + Date.now().toString(36).toUpperCase();
  APP.tickets.push({ id, user, category, subject, message, date: new Date().toLocaleDateString('es-ES'), status: 'open', priority, replies: [] });
  simulateEmail(user, 'ticketCreated', { nombre: user, id, asunto: subject, categoria: category });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketCreated', { nombre: user, id, asunto: subject, categoria: category }, { adminOnly: true });
  showToast('Ticket ' + id + ' creado correctamente');
  showAdminSection('ticketsmgmt', document.querySelectorAll('.admin-nav-btn')[8]);
}

function adminViewTicket(idx) {
  const t = APP.tickets[idx];
  const cats = APP.ticketCategories || [];
  const catMap = {};
  cats.forEach(c => catMap[c.id] = c);
  const cat = catMap[t.category];
  const priorityColors = { urgent:'#FF4444', high:'#FF8800', normal:'var(--cyan)', low:'var(--text3)' };
  const priorityNames = { urgent:'Urgente', high:'Alta', normal:'Normal', low:'Baja' };
  const statusNames = { open:'Abierto', answered:'Respondido', closed:'Cerrado', reopened:'Reabierto' };

  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">TICKET <span style="color:var(--cyan)">${t.id}</span></h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('ticketsmgmt',document.querySelectorAll('.admin-nav-btn')[8])">Volver a lista</button>
    </div>

    <!-- Ticket info -->
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;margin-bottom:16px;">
        <div>
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);margin-bottom:2px;">USUARIO</p>
          <p style="font-size:0.9rem;">${t.user}</p>
        </div>
        <div>
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);margin-bottom:2px;">CATEGORÍA</p>
          <p style="font-size:0.9rem;">${cat ? cat.icon+' '+cat.name : t.category}</p>
        </div>
        <div>
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);margin-bottom:2px;">PRIORIDAD</p>
          <p style="font-size:0.9rem;color:${priorityColors[t.priority||'normal']}">${priorityNames[t.priority||'normal']}</p>
        </div>
        <div>
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);margin-bottom:2px;">FECHA</p>
          <p style="font-size:0.9rem;">${t.date}</p>
        </div>
        <div>
          <p style="font-family:var(--font-display);font-size:0.68rem;color:var(--text3);margin-bottom:2px;">ESTADO</p>
          <p style="font-size:0.9rem;">${statusNames[t.status]||t.status}</p>
        </div>
      </div>

      <!-- Edit ticket properties inline -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--border);">
        <div class="form-group" style="margin-bottom:0;min-width:120px;">
          <label style="font-size:0.72rem;">Cambiar prioridad</label>
          <select class="form-select" style="padding:4px 8px;font-size:0.8rem;" onchange="adminUpdateTicketPriority(${idx},this.value)">
            <option value="low" ${t.priority==='low'?'selected':''}>Baja</option>
            <option value="normal" ${(t.priority||'normal')==='normal'?'selected':''}>Normal</option>
            <option value="high" ${t.priority==='high'?'selected':''}>Alta</option>
            <option value="urgent" ${t.priority==='urgent'?'selected':''}>Urgente</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:120px;">
          <label style="font-size:0.72rem;">Cambiar categoría</label>
          <select class="form-select" style="padding:4px 8px;font-size:0.8rem;" onchange="adminUpdateTicketCategory(${idx},this.value)">
            ${cats.map(c=>`<option value="${c.id}" ${t.category===c.id?'selected':''}>${c.icon} ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:120px;">
          <label style="font-size:0.72rem;">Cambiar estado</label>
          <select class="form-select" style="padding:4px 8px;font-size:0.8rem;" onchange="adminUpdateTicketStatusAndRefresh(${idx},this.value)">
            <option value="open" ${t.status==='open'?'selected':''}>Abierto</option>
            <option value="answered" ${t.status==='answered'?'selected':''}>Respondido</option>
            <option value="closed" ${t.status==='closed'?'selected':''}>Cerrado</option>
            <option value="reopened" ${t.status==='reopened'?'selected':''}>Reabierto</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Original message -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px;">
      <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:8px;">${t.subject}</h4>
      <p style="font-size:0.85rem;color:var(--text2);white-space:pre-wrap;">${t.message||'(Sin mensaje)'}</p>
      <p style="font-size:0.72rem;color:var(--text3);margin-top:10px;">— ${t.user} · ${t.date}</p>
    </div>

    <!-- Replies thread -->
    ${(t.replies && t.replies.length > 0) ? `
      <h4 style="font-family:var(--font-heading);font-size:0.85rem;margin-bottom:10px;">Conversación (${t.replies.length} ${t.replies.length===1?'respuesta':'respuestas'})</h4>
      ${t.replies.map((r,ri) => `<div style="background:${r.from==='admin'?'rgba(0,255,255,0.04)':'var(--surface)'};border:1px solid ${r.from==='admin'?'rgba(0,255,255,0.15)':'var(--border)'};border-radius:var(--radius);padding:14px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-family:var(--font-display);font-size:0.72rem;color:${r.from==='admin'?'var(--cyan)':'var(--magenta)'};">${r.from==='admin'?'ADMIN':'CLIENTE'}</span>
          <span style="font-size:0.72rem;color:var(--text3);">${r.date}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text2);white-space:pre-wrap;">${r.message}</p>
      </div>`).join('')}
    ` : '<p style="font-size:0.82rem;color:var(--text3);margin-bottom:16px;">Sin respuestas aún.</p>'}

    <!-- Reply form -->
    ${t.status!=='closed' ? `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-top:16px;">
      <h4 style="font-family:var(--font-heading);font-size:0.85rem;margin-bottom:10px;">Responder al ticket</h4>
      <textarea class="form-input" id="adminTicketReplyMsg" rows="4" placeholder="Escribe tu respuesta..."></textarea>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="adminSendTicketReply(${idx})">Enviar Respuesta</button>
        <button class="btn btn-secondary" onclick="adminSendAndCloseTicket(${idx})">Responder y Cerrar</button>
      </div>
    </div>
    ` : `<p style="font-size:0.82rem;color:var(--text3);margin-top:16px;padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border);">Este ticket está cerrado. ${APP.ticketSettings.allowReopenClosed ? '<a style="color:var(--cyan);cursor:pointer;" onclick="adminReopenTicket('+idx+')">Reabrir ticket</a>' : ''}</p>`}

    <!-- Action buttons -->
    <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
      ${t.status!=='closed' ? `<button class="btn btn-secondary" onclick="adminCloseTicket(${idx})">Cerrar Ticket</button>` : ''}
      ${t.status==='closed' && APP.ticketSettings.allowReopenClosed ? `<button class="btn btn-secondary" onclick="adminReopenTicket(${idx})">Reabrir Ticket</button>` : ''}
      <button class="btn btn-danger" onclick="adminDeleteTicket(${idx})">Eliminar Ticket</button>
    </div>
  `;
}

function adminUpdateTicketPriority(idx, priority) {
  APP.tickets[idx].priority = priority;
  const t = APP.tickets[idx];
  const pName = {urgent:'Urgente',high:'Alta',normal:'Normal',low:'Baja'}[priority];
  simulateEmail(t.user, 'ticketPriorityChanged', { nombre: t.user, id: t.id, prioridad: pName });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketPriorityChanged', { nombre: t.user, id: t.id, prioridad: pName }, { adminOnly: true });
  showToast('Prioridad actualizada a ' + pName);
}

function adminUpdateTicketCategory(idx, category) {
  APP.tickets[idx].category = category;
  const t = APP.tickets[idx];
  const cats = APP.ticketCategories || [];
  const cat = cats.find(c=>c.id===category);
  const catName = cat ? cat.name : category;
  simulateEmail(t.user, 'ticketCategoryChanged', { nombre: t.user, id: t.id, categoria: catName });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketCategoryChanged', { nombre: t.user, id: t.id, categoria: catName }, { adminOnly: true });
  showToast('Categoría del ticket actualizada');
}

function adminUpdateTicketStatusAndRefresh(idx, status) {
  updateTicketStatus(idx, status);
  adminViewTicket(idx);
}

function adminSendTicketReply(idx) {
  const msg = document.getElementById('adminTicketReplyMsg')?.value?.trim();
  if (!msg) { showToast('Escribe un mensaje de respuesta'); return; }
  if (!APP.tickets[idx].replies) APP.tickets[idx].replies = [];
  APP.tickets[idx].replies.push({ from: 'admin', date: new Date().toLocaleDateString('es-ES'), message: msg });
  APP.tickets[idx].status = 'answered';
  const t = APP.tickets[idx];
  simulateEmail(t.user, 'ticketAnswered', { nombre: t.user, id: t.id });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketAnswered', { nombre: t.user, id: t.id }, { adminOnly: true });
  showToast('Respuesta enviada al ticket ' + t.id);
  adminViewTicket(idx);
}

function adminSendAndCloseTicket(idx) {
  const msg = document.getElementById('adminTicketReplyMsg')?.value?.trim();
  if (!msg) { showToast('Escribe un mensaje de respuesta'); return; }
  if (!APP.tickets[idx].replies) APP.tickets[idx].replies = [];
  APP.tickets[idx].replies.push({ from: 'admin', date: new Date().toLocaleDateString('es-ES'), message: msg });
  APP.tickets[idx].status = 'closed';
  const t = APP.tickets[idx];
  simulateEmail(t.user, 'ticketAnswered', { nombre: t.user, id: t.id });
  simulateEmail(t.user, 'ticketClosed', { nombre: t.user, id: t.id });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketClosed', { nombre: t.user, id: t.id }, { adminOnly: true });
  showToast('Respuesta enviada y ticket cerrado');
  showAdminSection('ticketsmgmt', document.querySelectorAll('.admin-nav-btn')[8]);
}

function adminReopenTicket(idx) {
  APP.tickets[idx].status = 'reopened';
  const t = APP.tickets[idx];
  simulateEmail(t.user, 'ticketReopened', { nombre: t.user, id: t.id });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketReopened', { nombre: t.user, id: t.id }, { adminOnly: true });
  showToast('Ticket ' + t.id + ' reabierto');
  showAdminSection('ticketsmgmt', document.querySelectorAll('.admin-nav-btn')[8]);
}

function adminCloseTicket(idx) {
  APP.tickets[idx].status = 'closed';
  const t = APP.tickets[idx];
  simulateEmail(t.user, 'ticketClosed', { nombre: t.user, id: t.id });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketClosed', { nombre: t.user, id: t.id }, { adminOnly: true });
  showToast('Ticket ' + t.id + ' cerrado');
  showAdminSection('ticketsmgmt', document.querySelectorAll('.admin-nav-btn')[8]);
}

function adminDeleteTicket(idx) {
  const t = APP.tickets[idx];
  if (!confirm('¿Eliminar el ticket ' + t.id + '? Esta acción no se puede deshacer.')) return;
  simulateEmail(t.user, 'ticketDeleted', { nombre: t.user, id: t.id });
  simulateEmail(APP.adminSettings.adminEmail, 'ticketDeleted', { nombre: t.user, id: t.id }, { adminOnly: true });
  APP.tickets.splice(idx, 1);
  showToast('Ticket eliminado');
  showAdminSection('ticketsmgmt', document.querySelectorAll('.admin-nav-btn')[8]);
}

function adminReplyTicket(idx) {
  adminViewTicket(idx);
}

// ===== TICKET CATEGORIES MANAGEMENT =====
function adminTicketCategories() {
  const cats = APP.ticketCategories || [];
  const el = document.getElementById('adminContent');
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CATEGORÍAS DE TICKETS</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('ticketsmgmt',document.querySelectorAll('.admin-nav-btn')[8])">Volver a Tickets</button>
    </div>
    <p style="font-size:0.82rem;color:var(--text2);margin-bottom:20px;">Gestiona las categorías disponibles para los tickets de soporte. Los clientes podrán seleccionar estas categorías al crear un ticket.</p>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:24px;">
      ${cats.map((c,i) => `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:1.4rem;">${c.icon}</span>
            <button class="btn btn-danger btn-small" onclick="adminDeleteTicketCategory(${i})" style="font-size:0.7rem;padding:2px 8px;">Eliminar</button>
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">ID</label>
            <input type="text" class="form-input" value="${c.id}" onchange="adminUpdateTicketCategory_field(${i},'id',this.value)" style="font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">Nombre</label>
            <input type="text" class="form-input" value="${c.name}" onchange="adminUpdateTicketCategory_field(${i},'name',this.value)" style="font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.72rem;">Icono (emoji)</label>
            <input type="text" class="form-input" value="${c.icon}" onchange="adminUpdateTicketCategory_field(${i},'icon',this.value)" style="font-size:0.82rem;width:60px;">
          </div>
        </div>
      `).join('')}
    </div>

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;">
      <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:12px;">Añadir Nueva Categoría</h4>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">
        <div class="form-group" style="margin-bottom:0;min-width:80px;">
          <label style="font-size:0.72rem;">ID</label>
          <input type="text" class="form-input" id="newCatId" placeholder="soporte" style="font-size:0.82rem;">
        </div>
        <div class="form-group" style="margin-bottom:0;min-width:160px;flex:1;">
          <label style="font-size:0.72rem;">Nombre</label>
          <input type="text" class="form-input" id="newCatName" placeholder="Soporte técnico" style="font-size:0.82rem;">
        </div>
        <div class="form-group" style="margin-bottom:0;width:60px;">
          <label style="font-size:0.72rem;">Icono</label>
          <input type="text" class="form-input" id="newCatIcon" value="📌" style="font-size:0.82rem;">
        </div>
        <button class="btn btn-primary btn-small" onclick="adminAddTicketCategory()" style="height:40px;">Añadir</button>
      </div>
    </div>
  `;
}

function adminUpdateTicketCategory_field(idx, field, value) {
  APP.ticketCategories[idx][field] = value;
  showToast('Categoría actualizada');
}

function adminDeleteTicketCategory(idx) {
  if (!confirm('¿Eliminar la categoría "' + APP.ticketCategories[idx].name + '"?')) return;
  APP.ticketCategories.splice(idx, 1);
  showToast('Categoría eliminada');
  adminTicketCategories();
}

function adminAddTicketCategory() {
  const id = document.getElementById('newCatId')?.value?.trim();
  const name = document.getElementById('newCatName')?.value?.trim();
  const icon = document.getElementById('newCatIcon')?.value?.trim() || '📌';
  if (!id || !name) { showToast('ID y nombre son obligatorios'); return; }
  if (APP.ticketCategories.find(c=>c.id===id)) { showToast('Ya existe una categoría con ese ID'); return; }
  APP.ticketCategories.push({ id, name, icon });
  showToast('Categoría añadida');
  adminTicketCategories();
}

// ===== TICKET CONFIGURATION PANEL =====
function adminTicketConfig() {
  const s = APP.ticketSettings;
  const el = document.getElementById('adminContent');

  function cfgToggle(key, label, desc) {
    const val = s[key];
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px;">
      <div style="flex:1;margin-right:16px;">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:2px;">${label}</h4>
        <p style="font-size:0.78rem;color:var(--text3);">${desc}</p>
      </div>
      <label style="position:relative;display:inline-block;width:52px;height:28px;flex-shrink:0;">
        <input type="checkbox" ${val?'checked':''} onchange="APP.ticketSettings.${key}=this.checked;this.parentElement.querySelector('.toggle-track').style.background=this.checked?'var(--cyan)':'var(--border)';this.parentElement.querySelector('.toggle-dot').style.left=this.checked?'26px':'4px';showToast('Configuración guardada')" style="opacity:0;width:0;height:0;">
        <span class="toggle-track" style="position:absolute;cursor:pointer;inset:0;background:${val?'var(--cyan)':'var(--border)'};border-radius:28px;transition:0.3s;"></span>
        <span class="toggle-dot" style="position:absolute;left:${val?'26px':'4px'};top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:0.3s;"></span>
      </label>
    </div>`;
  }

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
      <h3 style="margin:0;">CONFIGURACIÓN DE TICKETS</h3>
      <button class="btn btn-secondary btn-small" onclick="showAdminSection('ticketsmgmt',document.querySelectorAll('.admin-nav-btn')[8])">Volver a Tickets</button>
    </div>

    <div style="max-width:700px;">
      <h4 style="font-family:var(--font-display);font-size:0.75rem;letter-spacing:1px;color:var(--text3);margin-bottom:12px;">OPCIONES GENERALES</h4>
      ${cfgToggle('autoReplyEnabled', 'Respuesta automática', 'Enviar un mensaje automático al cliente cuando crea un nuevo ticket')}
      ${cfgToggle('allowReopenClosed', 'Permitir reabrir tickets cerrados', 'Los tickets cerrados pueden ser reabiertos por el administrador')}
      ${cfgToggle('priorityLevels', 'Niveles de prioridad', 'Permitir asignar prioridad (Urgente, Alta, Normal, Baja) a los tickets')}

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:8px;">
          <label style="font-size:0.82rem;">Máximo de tickets abiertos por usuario</label>
          <input type="number" class="form-input" value="${s.maxTicketsPerUser}" min="1" max="100" onchange="APP.ticketSettings.maxTicketsPerUser=parseInt(this.value);showToast('Límite actualizado')" style="width:100px;">
        </div>
      </div>

      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;">
        <div class="form-group" style="margin-bottom:8px;">
          <label style="font-size:0.82rem;">Prioridad por defecto</label>
          <select class="form-select" style="width:auto;" onchange="APP.ticketSettings.defaultPriority=this.value;showToast('Prioridad por defecto actualizada')">
            <option value="low" ${s.defaultPriority==='low'?'selected':''}>Baja</option>
            <option value="normal" ${s.defaultPriority==='normal'?'selected':''}>Normal</option>
            <option value="high" ${s.defaultPriority==='high'?'selected':''}>Alta</option>
            <option value="urgent" ${s.defaultPriority==='urgent'?'selected':''}>Urgente</option>
          </select>
        </div>
      </div>

      <h4 style="font-family:var(--font-display);font-size:0.75rem;letter-spacing:1px;color:var(--text3);margin:20px 0 12px;">MENSAJE DE RESPUESTA AUTOMÁTICA</h4>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;">
        <textarea class="form-input" id="ticketAutoReplyMsg" rows="3" style="font-size:0.85rem;">${s.autoReplyMessage}</textarea>
        <button class="btn btn-primary btn-small" onclick="APP.ticketSettings.autoReplyMessage=document.getElementById('ticketAutoReplyMsg').value;showToast('Mensaje guardado')" style="margin-top:8px;">Guardar Mensaje</button>
      </div>

      <h4 style="font-family:var(--font-display);font-size:0.75rem;letter-spacing:1px;color:var(--text3);margin:20px 0 12px;">PLANTILLAS DE EMAIL PARA TICKETS</h4>
      <p style="font-size:0.78rem;color:var(--text3);margin-bottom:12px;">Variables: <code style="color:var(--cyan);">{nombre}</code>, <code style="color:var(--cyan);">{id}</code>, <code style="color:var(--cyan);">{asunto}</code>, <code style="color:var(--cyan);">{categoria}</code></p>
      ${['ticketCreated','ticketAnswered','ticketClosed','ticketReopened'].map(key => {
        const names = { ticketCreated:'Ticket creado', ticketAnswered:'Ticket respondido', ticketClosed:'Ticket cerrado', ticketReopened:'Ticket reabierto' };
        const tpl = APP.emailTemplates[key];
        return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;">
          <h5 style="font-family:var(--font-heading);font-size:0.85rem;color:var(--cyan);margin-bottom:8px;">${names[key]}</h5>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">Asunto</label>
            <input type="text" class="form-input" id="tcfg_${key}_subj" value="${tpl?tpl.subject:''}" style="font-size:0.82rem;">
          </div>
          <div class="form-group" style="margin-bottom:6px;">
            <label style="font-size:0.72rem;">Cuerpo</label>
            <textarea class="form-input" id="tcfg_${key}_body" rows="3" style="font-size:0.82rem;">${tpl?tpl.body:''}</textarea>
          </div>
          <button class="btn btn-primary btn-small" onclick="adminSaveTicketEmailTemplate('${key}')" style="font-size:0.75rem;">Guardar</button>
        </div>`;
      }).join('')}
    </div>
  `;
}

function adminSaveTicketEmailTemplate(key) {
  const subj = document.getElementById('tcfg_'+key+'_subj')?.value;
  const body = document.getElementById('tcfg_'+key+'_body')?.value;
  if (!APP.emailTemplates[key]) APP.emailTemplates[key] = {};
  APP.emailTemplates[key].subject = subj;
  APP.emailTemplates[key].body = body;
  showToast('Plantilla de ticket guardada');
}

// ===== ADMIN CHATBOT MANAGEMENT =====
function renderAdminChatbot() {
  return `
    <h3>GESTIÓN DEL CHAT BOT</h3>
    <p style="font-size:0.85rem;color:var(--text2);margin-bottom:20px;">Configura las reglas de respuesta automática del chatbot. El bot buscará las palabras clave en el mensaje del usuario y responderá con la respuesta asociada.</p>
    <div style="margin-bottom:20px;">
      <button class="btn btn-primary btn-small" onclick="adminAddChatbotRule()">+ Añadir Regla</button>
    </div>
    ${APP.chatbotRules.map((rule, i) => `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
        <strong style="font-family:var(--font-heading);font-size:0.85rem;color:var(--cyan);">Regla #${i + 1}</strong>
        <button class="btn btn-danger btn-small" onclick="adminDeleteChatbotRule(${i})">Eliminar</button>
      </div>
      <div class="form-group" style="margin-bottom:8px;">
        <label style="font-size:0.78rem;">Palabras clave (separadas por coma)</label>
        <input type="text" class="form-input" value="${rule.keywords}" onchange="APP.chatbotRules[${i}].keywords=this.value" style="font-size:0.85rem;">
      </div>
      <div class="form-group" style="margin-bottom:4px;">
        <label style="font-size:0.78rem;">Respuesta</label>
        <textarea class="form-input" rows="3" onchange="APP.chatbotRules[${i}].response=this.value" style="font-size:0.85rem;">${rule.response.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
      </div>
    </div>`).join('')}

    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-top:24px;">
      <h4 style="font-family:var(--font-heading);margin-bottom:8px;">Mensaje por defecto</h4>
      <p style="font-size:0.78rem;color:var(--text3);margin-bottom:8px;">Se muestra cuando ninguna regla coincide.</p>
      <textarea class="form-input" rows="4" onchange="APP.chatbotDefaultResponse=this.value" style="font-size:0.85rem;">${APP.chatbotDefaultResponse.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
    </div>
    <div style="margin-top:16px;">
      <button class="btn btn-primary" onclick="showToast('Reglas del chatbot guardadas')">Guardar Cambios</button>
    </div>
  `;
}

function adminAddChatbotRule() {
  APP.chatbotRules.push({ keywords: '', response: '' });
  showAdminSection('chatbot', document.querySelectorAll('.admin-nav-btn')[9]);
}

function adminDeleteChatbotRule(idx) {
  APP.chatbotRules.splice(idx, 1);
  showToast('Regla eliminada');
  showAdminSection('chatbot', document.querySelectorAll('.admin-nav-btn')[9]);
}

// ===== ADMIN EMAIL TEMPLATES =====
function renderAdminEmailTemplates() {
  const templateNames = {
    newUser: 'Nuevo usuario registrado',
    userModified: 'Datos de usuario modificados',
    userBanned: 'Usuario baneado',
    userUnbanned: 'Usuario desbaneado',
    userDisabled: 'Usuario desactivado',
    userActivated: 'Usuario activado',
    userDeleted: 'Usuario eliminado',
    newOrder: 'Nuevo pedido',
    orderModified: 'Pedido modificado',
    orderCancelled: 'Pedido cancelado',
    newQuote: 'Nuevo presupuesto',
    newInvoice: 'Nueva factura',
    ticketCreated: 'Ticket de soporte creado',
    ticketAnswered: 'Ticket respondido',
    ticketClosed: 'Ticket cerrado',
    ticketReopened: 'Ticket reabierto',
    ticketPriorityChanged: 'Prioridad de ticket cambiada',
    ticketCategoryChanged: 'Categoría de ticket cambiada',
    ticketDeleted: 'Ticket eliminado',
    abandonedCart: 'Carrito abandonado'
  };
  return `
    <h3>PLANTILLAS DE EMAIL</h3>
    <p style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;">Gestiona las plantillas de email para notificaciones automáticas.</p>
    <p style="font-size:0.78rem;color:var(--text3);margin-bottom:8px;">Variables disponibles: <code style="color:var(--cyan);">{nombre}</code>, <code style="color:var(--cyan);">{email}</code>, <code style="color:var(--cyan);">{id}</code>, <code style="color:var(--cyan);">{fecha}</code>, <code style="color:var(--cyan);">{total}</code></p>
    <p style="font-size:0.78rem;color:var(--text3);margin-bottom:20px;">Todos los emails envían copia a <span style="color:var(--cyan);">manuguada19@gmail.com</span></p>
    ${Object.keys(APP.emailTemplates).map(key => {
      const tpl = APP.emailTemplates[key];
      const label = templateNames[key] || key;
      return `
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px;">
        <h4 style="font-family:var(--font-heading);font-size:0.9rem;margin-bottom:10px;color:var(--cyan);">${label}</h4>
        <div class="form-group" style="margin-bottom:8px;">
          <label style="font-size:0.78rem;">Asunto</label>
          <input type="text" class="form-input" id="emailTpl_${key}_subject" value="${tpl.subject}" style="font-size:0.85rem;">
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <label style="font-size:0.78rem;">Cuerpo del email</label>
          <textarea class="form-input" id="emailTpl_${key}_body" rows="4" style="font-size:0.85rem;">${tpl.body}</textarea>
        </div>
        <button class="btn btn-primary btn-small" onclick="adminSaveEmailTemplate('${key}')">Guardar Cambios</button>
      </div>`;
    }).join('')}
  `;
}

function adminSaveEmailTemplate(key) {
  const subject = document.getElementById('emailTpl_' + key + '_subject')?.value;
  const body = document.getElementById('emailTpl_' + key + '_body')?.value;
  if (subject !== undefined) APP.emailTemplates[key].subject = subject;
  if (body !== undefined) APP.emailTemplates[key].body = body;
  showToast('Plantilla "' + key + '" guardada correctamente');
}

// ===== ABANDONED CART DETECTION =====
let _abandonedCartTimer = null;
let _abandonedCartNotified = false;

function startAbandonedCartTimer() {
  clearAbandonedCartTimer();
  _abandonedCartNotified = false;
  // Check every 30 seconds if cart has been idle for 5+ minutes
  _abandonedCartTimer = setInterval(() => {
    if (APP.cart.length > 0 && APP._cartLastUpdate) {
      const elapsed = Date.now() - APP._cartLastUpdate;
      if (elapsed >= 300000 && !_abandonedCartNotified) { // 5 minutes = 300000ms
        _abandonedCartNotified = true;
        notifyAbandonedCart();
      }
    }
  }, 30000);
}

function clearAbandonedCartTimer() {
  if (_abandonedCartTimer) { clearInterval(_abandonedCartTimer); _abandonedCartTimer = null; }
}

function notifyAbandonedCart() {
  if (APP.cart.length === 0) return;
  const items = APP.cart.map(ci => {
    const p = APP.products.find(x=>x.id===ci.productId);
    return p ? p.name : 'Producto';
  }).join(', ');
  showToast('Tienes productos olvidados en tu carrito: ' + items);
  if (APP.user) {
    simulateEmail(APP.user.email, 'abandonedCart', { nombre: APP.user.name || APP.user.email });
    _storeAbandonedCart(APP.user.email, APP.user.name || APP.user.email, APP.cart);
  }
}

function checkAbandonedCart() {
  if (APP.cart.length > 0 && APP.user) {
    const items = APP.cart.map(ci => {
      const p = APP.products.find(x=>x.id===ci.productId);
      return p ? p.name : 'Producto';
    }).join(', ');
    showToast('Recuerda: tienes productos en el carrito (' + items + ')');
    simulateEmail(APP.user.email, 'abandonedCart', { nombre: APP.user.name || APP.user.email });
    _storeAbandonedCart(APP.user.email, APP.user.name || APP.user.email, APP.cart);
  }
}

// Detect page close
window.addEventListener('beforeunload', function() {
  if (APP.cart.length > 0 && APP.user && APP._cartLastUpdate) {
    const elapsed = Date.now() - APP._cartLastUpdate;
    if (elapsed >= 300000) {
      // Use sendBeacon or just save state
      try { localStorage.setItem('3dguadalajara_abandoned_cart', JSON.stringify({ email: APP.user.email, cart: APP.cart, time: Date.now() })); } catch(e) {}
      // Also store into APP.abandonedCarts
      _storeAbandonedCart(APP.user.email, APP.user.name || APP.user.email, APP.cart);
    }
  }
});

function _storeAbandonedCart(email, userName, cartItems) {
  if (!APP.abandonedCarts) APP.abandonedCarts = [];
  const items = cartItems.map(ci => {
    const p = APP.products.find(x => x.id === ci.productId);
    return {
      productId: ci.productId,
      name: p ? p.name : 'Producto #' + ci.productId,
      material: ci.material || 'PLA',
      qty: ci.qty || 1,
      price: ci.price || (p ? p.price : 0)
    };
  });
  // Check if there's already an abandoned cart for this email
  const existing = APP.abandonedCarts.find(ac => ac.email === email && ac.status === 'abandoned');
  if (existing) {
    existing.items = items;
    existing.timestamp = new Date().toISOString();
  } else {
    APP.abandonedCarts.push({
      email: email,
      userName: userName,
      items: items,
      timestamp: new Date().toISOString(),
      status: 'abandoned'
    });
  }
  try { adminAutoSave(); } catch(e) {}
}

// ===== AUTO-SAVE (localStorage) =====
function adminAutoSave() {
  try {
    const data = {
      orders: APP.orders,
      quotes: APP.quotes,
      invoices: APP.invoices,
      colors: APP.colors,
      tickets: APP.tickets,
      registeredUsers: APP.registeredUsers || [],
      bannedEmails: APP.bannedEmails,
      admin3dEnabled: APP.admin3dEnabled,
      colorNames: window._colorNames || {},
      adminSettings: APP.adminSettings,
      chatbotRules: APP.chatbotRules,
      chatbotDefaultResponse: APP.chatbotDefaultResponse,
      emailTemplates: APP.emailTemplates,
      ticketCategories: APP.ticketCategories,
      ticketSettings: APP.ticketSettings,
      invoiceSettings: APP.invoiceSettings,
      shopCategories: APP.shopCategories,
      products: APP.products,
      abandonedCarts: APP.abandonedCarts || []
    };
    localStorage.setItem('3dguadalajara_admin', JSON.stringify(data));
  } catch(e) { /* silently fail if storage full */ }
}

function adminAutoLoad() {
  try {
    const saved = localStorage.getItem('3dguadalajara_admin');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.orders) APP.orders = data.orders;
      if (data.quotes) APP.quotes = data.quotes;
      if (data.invoices) APP.invoices = data.invoices;
      if (data.colors) APP.colors = data.colors;
      if (data.tickets) APP.tickets = data.tickets;
      if (data.registeredUsers) APP.registeredUsers = data.registeredUsers;
      if (data.bannedEmails) APP.bannedEmails = data.bannedEmails;
      if (data.admin3dEnabled !== undefined) APP.admin3dEnabled = data.admin3dEnabled;
      if (data.colorNames) window._colorNames = data.colorNames;
      if (data.adminSettings) APP.adminSettings = { ...APP.adminSettings, ...data.adminSettings };
      if (data.chatbotRules) APP.chatbotRules = data.chatbotRules;
      if (data.chatbotDefaultResponse) APP.chatbotDefaultResponse = data.chatbotDefaultResponse;
      if (data.emailTemplates) APP.emailTemplates = { ...APP.emailTemplates, ...data.emailTemplates };
      if (data.ticketCategories) APP.ticketCategories = data.ticketCategories;
      if (data.ticketSettings) APP.ticketSettings = { ...APP.ticketSettings, ...data.ticketSettings };
      if (data.invoiceSettings) APP.invoiceSettings = { ...APP.invoiceSettings, ...data.invoiceSettings };
      if (data.shopCategories) APP.shopCategories = data.shopCategories;
      if (data.products) APP.products = data.products;
      if (data.abandonedCarts) APP.abandonedCarts = data.abandonedCarts;
    }
  } catch(e) { /* silently fail */ }
}

// Wrap showToast to auto-save on admin changes
const _originalShowToast = showToast;
showToast = function(msg) {
  _originalShowToast(msg);
  if (APP.user?.isAdmin) adminAutoSave();
};

// ===== LANGUAGE DETECTION & ACCESSIBILITY =====
const _langData = {
  es: { flag:'🇪🇸', name:'Español (España)', greeting:'Bienvenido a 3D Guadalajara', prompt:'Hemos detectado tu idioma:', accept:'Aceptar idioma', change:'Cambiar idioma', save:'Guardar preferencia', once:'Solo esta vez', listen:'Escuchar', selectLang:'Seleccionar idioma' },
  en: { flag:'🇬🇧', name:'English', greeting:'Welcome to 3D Guadalajara', prompt:'We detected your language:', accept:'Accept language', change:'Change language', save:'Save preference', once:'Just this time', listen:'Listen', selectLang:'Select language' },
  fr: { flag:'🇫🇷', name:'Français', greeting:'Bienvenue chez 3D Guadalajara', prompt:'Nous avons détecté votre langue:', accept:'Accepter la langue', change:'Changer de langue', save:'Enregistrer la préférence', once:'Juste cette fois', listen:'Écouter', selectLang:'Sélectionner la langue' },
  de: { flag:'🇩🇪', name:'Deutsch', greeting:'Willkommen bei 3D Guadalajara', prompt:'Wir haben Ihre Sprache erkannt:', accept:'Sprache akzeptieren', change:'Sprache ändern', save:'Einstellung speichern', once:'Nur dieses Mal', listen:'Anhören', selectLang:'Sprache auswählen' },
  pt: { flag:'🇵🇹', name:'Português', greeting:'Bem-vindo ao 3D Guadalajara', prompt:'Detectámos o seu idioma:', accept:'Aceitar idioma', change:'Alterar idioma', save:'Guardar preferência', once:'Apenas desta vez', listen:'Ouvir', selectLang:'Selecionar idioma' },
  it: { flag:'🇮🇹', name:'Italiano', greeting:'Benvenuto a 3D Guadalajara', prompt:'Abbiamo rilevato la tua lingua:', accept:'Accetta lingua', change:'Cambia lingua', save:'Salva preferenza', once:'Solo questa volta', listen:'Ascoltare', selectLang:'Seleziona lingua' },
  ca: { flag:'🇪🇸', name:'Català', greeting:'Benvingut a 3D Guadalajara', prompt:'Hem detectat el teu idioma:', accept:'Acceptar idioma', change:'Canviar idioma', save:'Desar preferència', once:'Només aquest cop', listen:'Escoltar', selectLang:'Seleccionar idioma' },
  gl: { flag:'🇪🇸', name:'Galego', greeting:'Benvido a 3D Guadalajara', prompt:'Detectamos o teu idioma:', accept:'Aceptar idioma', change:'Cambiar idioma', save:'Gardar preferencia', once:'Só esta vez', listen:'Escoitar', selectLang:'Seleccionar idioma' },
  eu: { flag:'🇪🇸', name:'Euskara', greeting:'Ongi etorri 3D Guadalajara-ra', prompt:'Zure hizkuntza detektatu dugu:', accept:'Hizkuntza onartu', change:'Hizkuntza aldatu', save:'Hobespena gorde', once:'Aldi honetarako bakarrik', listen:'Entzun', selectLang:'Hizkuntza aukeratu' },
  zh: { flag:'🇨🇳', name:'中文', greeting:'欢迎来到 3D Guadalajara', prompt:'我们检测到您的语言：', accept:'接受语言', change:'更改语言', save:'保存偏好', once:'仅本次', listen:'收听', selectLang:'选择语言' },
  ja: { flag:'🇯🇵', name:'日本語', greeting:'3D Guadalajaraへようこそ', prompt:'言語を検出しました：', accept:'言語を承認', change:'言語を変更', save:'設定を保存', once:'今回のみ', listen:'聞く', selectLang:'言語を選択' },
  ko: { flag:'🇰🇷', name:'한국어', greeting:'3D Guadalajara에 오신 것을 환영합니다', prompt:'언어가 감지되었습니다:', accept:'언어 수락', change:'언어 변경', save:'설정 저장', once:'이번만', listen:'듣기', selectLang:'언어 선택' },
  ar: { flag:'🇸🇦', name:'العربية', greeting:'مرحبا بكم في 3D Guadalajara', prompt:'تم اكتشاف لغتك:', accept:'قبول اللغة', change:'تغيير اللغة', save:'حفظ التفضيل', once:'هذه المرة فقط', listen:'استمع', selectLang:'اختر اللغة' },
  ru: { flag:'🇷🇺', name:'Русский', greeting:'Добро пожаловать в 3D Guadalajara', prompt:'Мы определили ваш язык:', accept:'Принять язык', change:'Изменить язык', save:'Сохранить настройку', once:'Только сейчас', listen:'Слушать', selectLang:'Выбрать язык' },
  nl: { flag:'🇳🇱', name:'Nederlands', greeting:'Welkom bij 3D Guadalajara', prompt:'We hebben uw taal gedetecteerd:', accept:'Taal accepteren', change:'Taal wijzigen', save:'Voorkeur opslaan', once:'Alleen deze keer', listen:'Luisteren', selectLang:'Taal selecteren' },
  pl: { flag:'🇵🇱', name:'Polski', greeting:'Witamy w 3D Guadalajara', prompt:'Wykryliśmy Twój język:', accept:'Akceptuj język', change:'Zmień język', save:'Zapisz preferencję', once:'Tylko teraz', listen:'Słuchaj', selectLang:'Wybierz język' },
  ro: { flag:'🇷🇴', name:'Română', greeting:'Bun venit la 3D Guadalajara', prompt:'Am detectat limba ta:', accept:'Acceptă limba', change:'Schimbă limba', save:'Salvează preferința', once:'Doar acum', listen:'Ascultă', selectLang:'Selectează limba' },
  uk: { flag:'🇺🇦', name:'Українська', greeting:'Ласкаво просимо до 3D Guadalajara', prompt:'Ми виявили вашу мову:', accept:'Прийняти мову', change:'Змінити мову', save:'Зберегти налаштування', once:'Лише цього разу', listen:'Слухати', selectLang:'Обрати мову' }
};

const _regionFlags = {
  ES:'🇪🇸',US:'🇺🇸',GB:'🇬🇧',FR:'🇫🇷',DE:'🇩🇪',PT:'🇵🇹',IT:'🇮🇹',MX:'🇲🇽',AR:'🇦🇷',CO:'🇨🇴',CL:'🇨🇱',PE:'🇵🇪',
  BR:'🇧🇷',CN:'🇨🇳',JP:'🇯🇵',KR:'🇰🇷',SA:'🇸🇦',RU:'🇷🇺',NL:'🇳🇱',PL:'🇵🇱',RO:'🇷🇴',UA:'🇺🇦',VE:'🇻🇪',EC:'🇪🇨',
  BO:'🇧🇴',UY:'🇺🇾',PY:'🇵🇾',CR:'🇨🇷',PA:'🇵🇦',DO:'🇩🇴',GT:'🇬🇹',HN:'🇭🇳',SV:'🇸🇻',NI:'🇳🇮',CU:'🇨🇺',
  CA:'🇨🇦',AU:'🇦🇺',NZ:'🇳🇿',IE:'🇮🇪',AT:'🇦🇹',CH:'🇨🇭',BE:'🇧🇪',IN:'🇮🇳',PH:'🇵🇭',ZA:'🇿🇦',
  SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',FI:'🇫🇮',CZ:'🇨🇿',HU:'🇭🇺',GR:'🇬🇷',TR:'🇹🇷',IL:'🇮🇱',EG:'🇪🇬',MA:'🇲🇦'
};

const _regionNames = {
  ES:'España',US:'Estados Unidos',GB:'Reino Unido',FR:'Francia',DE:'Alemania',PT:'Portugal',IT:'Italia',MX:'México',AR:'Argentina',CO:'Colombia',CL:'Chile',PE:'Perú',
  BR:'Brasil',CN:'China',JP:'Japón',KR:'Corea del Sur',SA:'Arabia Saudita',RU:'Rusia',NL:'Países Bajos',PL:'Polonia',RO:'Rumanía',UA:'Ucrania',
  VE:'Venezuela',EC:'Ecuador',BO:'Bolivia',UY:'Uruguay',PY:'Paraguay',CR:'Costa Rica',PA:'Panamá',DO:'República Dominicana',
  CA:'Canadá',AU:'Australia',NZ:'Nueva Zelanda',IE:'Irlanda',AT:'Austria',CH:'Suiza',BE:'Bélgica',IN:'India',
  SE:'Suecia',NO:'Noruega',DK:'Dinamarca',FI:'Finlandia',CZ:'Chequia',HU:'Hungría',GR:'Grecia',TR:'Turquía'
};

function _detectUserLocale() {
  const navLang = navigator.language || navigator.userLanguage || 'es-ES';
  const parts = navLang.split('-');
  const langCode = parts[0].toLowerCase();
  const regionCode = (parts[1] || '').toUpperCase();
  return { langCode, regionCode, full: navLang };
}

function _getLangInfo(langCode) {
  return _langData[langCode] || _langData['es'];
}

function _showLanguageModal() {
  // Check if user already saved preference
  const savedLang = localStorage.getItem('3dguadalajara_lang');
  if (savedLang) {
    APP._userLang = savedLang;
    return; // Don't show modal if user saved preference
  }

  const locale = _detectUserLocale();
  const lang = _getLangInfo(locale.langCode);
  const regionFlag = _regionFlags[locale.regionCode] || lang.flag;
  const regionName = _regionNames[locale.regionCode] || '';
  const displayName = lang.name + (regionName ? ' — ' + regionName : '');

  APP._userLang = locale.langCode;
  APP._detectedLocale = locale;

  const modal = document.createElement('div');
  modal.id = 'langModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);animation:fadeIn 0.3s ease;';
  modal.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--cyan);border-radius:var(--radius-lg);padding:36px 32px;max-width:480px;width:90%;text-align:center;position:relative;box-shadow:0 0 40px rgba(0,240,255,0.15);">
      <div style="font-size:4rem;margin-bottom:12px;line-height:1;">${regionFlag}</div>
      <h3 style="font-family:var(--font-heading);font-size:1.2rem;margin-bottom:6px;color:var(--cyan);">${lang.greeting}</h3>
      <p style="font-size:0.92rem;color:var(--text2);margin-bottom:4px;">${lang.prompt}</p>
      <p style="font-size:1.1rem;font-weight:700;color:var(--text1);margin-bottom:8px;">${regionFlag} ${displayName}</p>

      <button onclick="_langListen('${locale.langCode}')" style="background:none;border:1px solid var(--border);border-radius:20px;padding:6px 16px;color:var(--cyan);cursor:pointer;font-size:0.82rem;margin-bottom:20px;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='var(--border)'">
        🔊 ${lang.listen}
      </button>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
        <button class="btn btn-primary" onclick="_langAcceptAndSave()" style="width:100%;">${lang.accept} — ${lang.save}</button>
        <button class="btn btn-secondary" onclick="_langAcceptOnce()" style="width:100%;">${lang.accept} — ${lang.once}</button>
        <button class="btn btn-secondary" onclick="_langShowChanger()" style="width:100%;font-size:0.85rem;">${lang.change}</button>
      </div>

      <div id="langChangerPanel" style="display:none;margin-top:16px;border-top:1px solid var(--border);padding-top:16px;">
        <p style="font-size:0.85rem;color:var(--text2);margin-bottom:10px;">${lang.selectLang}:</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;max-height:260px;overflow-y:auto;padding:4px;">
          ${Object.entries(_langData).map(([code, l]) => `
            <button onclick="_langSelect('${code}')" style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:${code===locale.langCode?'rgba(0,240,255,0.1)':'var(--surface)'};border:1px solid ${code===locale.langCode?'var(--cyan)':'var(--border)'};border-radius:var(--radius);cursor:pointer;color:var(--text1);font-size:0.82rem;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--cyan)'" onmouseout="this.style.borderColor='${code===locale.langCode?'var(--cyan)':'var(--border)'}'">${l.flag} ${l.name}</button>
          `).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-primary btn-small" onclick="_langSaveSelected()" style="flex:1;">💾 ${_langData.es.save}</button>
          <button class="btn btn-secondary btn-small" onclick="_langOnceSelected()" style="flex:1;">${_langData.es.once}</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

let _selectedLangCode = null;

function _langListen(langCode) {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no soporta síntesis de voz');
    return;
  }
  window.speechSynthesis.cancel();
  const lang = _getLangInfo(langCode);
  const locale = APP._detectedLocale || _detectUserLocale();
  const regionName = _regionNames[locale.regionCode] || '';
  const text = lang.greeting + '. ' + lang.prompt + ' ' + lang.name + (regionName ? ', ' + regionName : '') + '.';

  const utterance = new SpeechSynthesisUtterance(text);
  // Map language codes to BCP 47 for speech synthesis
  const speechLangMap = { es:'es-ES', en:'en-GB', fr:'fr-FR', de:'de-DE', pt:'pt-PT', it:'it-IT', ca:'ca-ES', gl:'gl-ES', eu:'eu-ES', zh:'zh-CN', ja:'ja-JP', ko:'ko-KR', ar:'ar-SA', ru:'ru-RU', nl:'nl-NL', pl:'pl-PL', ro:'ro-RO', uk:'uk-UA' };
  utterance.lang = speechLangMap[langCode] || langCode;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function _langAcceptAndSave() {
  const locale = APP._detectedLocale || _detectUserLocale();
  APP._userLang = locale.langCode;
  localStorage.setItem('3dguadalajara_lang', locale.langCode);
  _langCloseModal();
  const lang = _getLangInfo(locale.langCode);
  showToast(lang.flag + ' ' + lang.name + ' — Guardado');
}

function _langAcceptOnce() {
  const locale = APP._detectedLocale || _detectUserLocale();
  APP._userLang = locale.langCode;
  _langCloseModal();
}

function _langShowChanger() {
  const panel = document.getElementById('langChangerPanel');
  if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function _langSelect(code) {
  _selectedLangCode = code;
  const btns = document.querySelectorAll('#langChangerPanel button[onclick^="_langSelect"]');
  btns.forEach(b => {
    b.style.background = 'var(--surface)';
    b.style.borderColor = 'var(--border)';
  });
  event.currentTarget.style.background = 'rgba(0,240,255,0.1)';
  event.currentTarget.style.borderColor = 'var(--cyan)';
  // Preview: listen to selected language
  _langListen(code);
}

function _langSaveSelected() {
  const code = _selectedLangCode || (APP._detectedLocale ? APP._detectedLocale.langCode : 'es');
  APP._userLang = code;
  localStorage.setItem('3dguadalajara_lang', code);
  _langCloseModal();
  const lang = _getLangInfo(code);
  showToast(lang.flag + ' ' + lang.name + ' — Guardado');
}

function _langOnceSelected() {
  const code = _selectedLangCode || (APP._detectedLocale ? APP._detectedLocale.langCode : 'es');
  APP._userLang = code;
  _langCloseModal();
}

function _langCloseModal() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  const modal = document.getElementById('langModal');
  if (modal) modal.remove();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  _initMaterialStock();
  _startStockAutoRefresh();
  adminAutoLoad();
  navigateTo('home');
  updateNav();
  updateFooterContact();
  startAbandonedCartTimer();
  // Show language detection modal
  setTimeout(_showLanguageModal, 600);
  // Check if there was an abandoned cart from a previous session
  try {
    const ac = localStorage.getItem('3dguadalajara_abandoned_cart');
    if (ac) {
      const data = JSON.parse(ac);
      if (Date.now() - data.time < 86400000) { // within 24 hours
        showToast('Tienes productos pendientes en tu carrito de una sesión anterior');
      }
      localStorage.removeItem('3dguadalajara_abandoned_cart');
    }
  } catch(e) {}
});
