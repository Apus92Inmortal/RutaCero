# ESTADO: DEROGADO / REEMPLAZADO

Este documento queda derogado y reemplazado por el Manual_UIUX_Ruta_Cero_v1_1_Oficial. A partir de esta actualizacion, la version v1.1 es la unica referencia oficial para criterios UI/UX, componentes, tokens visuales, navegacion, formularios, accesibilidad, landing, auth, checkout y revisiones futuras del producto Ruta Cero.

Ubicacion vigente: `docs/manuals/official/Manual_UIUX_Ruta_Cero_v1_1_Oficial.pdf`

---

# Ruta Cero - Manual UI/UX oficial

Ultima actualizacion: 2026-06-08

Este manual es la referencia oficial para disenar, revisar e implementar interfaces de Ruta Cero. Su objetivo es mantener una experiencia consistente, clara y confiable para personas que estan organizando deudas, tomando decisiones financieras y pagando por un acceso vitalicio de una sola vez.

## 1. Identidad del producto

Ruta Cero es una aplicacion web fintech en espanol que ayuda a organizar, analizar y eliminar deudas mediante planes personalizados.

- Nombre de marca: `Ruta Cero`
- Slogan: `Tu plan inteligente para salir de deudas`
- Producto comercial: `Ruta Cero - Acceso Vitalicio`
- Precio oficial: `$49.900 COP`
- Promesa comercial obligatoria: `Paga una sola vez y recibe acceso de por vida. Sin suscripciones. Sin cobros mensuales.`

Regla comercial principal:

- La UI nunca debe presentar planes mensuales, membresias recurrentes, suscripciones, cobros mensuales ni comparativas de planes por mes.
- El producto se comunica siempre como pago unico con acceso vitalicio.
- Si se muestra precio, debe reforzar claridad: una sola compra, sin recurrencia y sin costos ocultos.

## 2. Principios de experiencia

Ruta Cero debe sentirse como una herramienta financiera seria, calmada y accionable. El usuario suele llegar con estres financiero, informacion incompleta y miedo a equivocarse. La interfaz debe reducir carga mental y ayudar a decidir el siguiente paso.

Principios:

- Claridad antes que densidad: cada pantalla debe responder que esta pasando, que significa y que hacer despues.
- Accion sobre decoracion: el espacio visual se reserva para datos, formularios, alertas, recomendaciones y decisiones.
- Calma financiera: los colores de alerta se usan con intencion, sin alarmismo visual innecesario.
- Mobile-first: las tareas principales deben poder completarse comodamente desde celular.
- Confianza: los numeros importantes deben estar formateados, etiquetados y contextualizados.
- Progreso visible: la app debe mostrar avance, estimaciones y cambios de estado con lenguaje comprensible.
- Cero sorpresas comerciales: el acceso vitalicio debe ser consistente en landing, registro, checkout y app protegida.

## 3. Tema oficial

Los tokens actuales viven en `src/app/globals.css` y son la base visual obligatoria.

| Token | Valor | Uso |
| --- | --- | --- |
| `--primary` | `#0B2C4A` | Marca, titulos, navegacion activa, acciones principales, datos financieros clave |
| `--success` | `#2ECC71` | Progreso positivo, acceso activo, recomendaciones favorables, confirmaciones |
| `--background` | `#F4F7FA` | Fondo general de producto y superficies secundarias |
| `--foreground` | `#1F2937` | Texto principal |
| `--secondary-text` | `#52616B` | Texto auxiliar, descripciones, etiquetas secundarias |
| `--danger` | `#E74C3C` | Mora, errores, riesgo alto, acciones destructivas |
| `--warning` | `#F1C40F` | Riesgo medio, vencimientos proximos, revisar antes de actuar |
| `--surface` | `#FFFFFF` | Cards, formularios, tablas, modales |
| `--border` | `#D9E2EC` | Bordes, divisores, contornos sutiles |

Colores auxiliares permitidos:

- Hover claro: `#EEF4F8`
- Fondo de tabla suave: `#F7FAFC`
- Fondo de metrica suave: `#F8FBFD`
- Fondo de progreso inactivo: `#E1E9F0`
- Placeholder: `#8B9AA5`
- Info badge: `#E9F5FF` con texto `#0C5C93`

Reglas de uso:

- `primary` comunica estructura, marca y jerarquia. No debe dominar todas las superficies.
- `success` comunica avance o accion positiva. No usarlo para decorar secciones sin significado.
- `danger` se reserva para errores, mora, cobranza, riesgo alto o estados irreversibles.
- `warning` indica atencion, no fracaso.
- Los fondos principales deben alternar entre `background` y `surface`; evitar fondos saturados en areas de trabajo.
- No usar gradientes decorativos, orbes, bokeh ni ilustraciones abstractas como fondo de producto.

## 4. Tipografia

Fuente recomendada:

- Sans: `Inter`, con fallback `ui-sans-serif, system-ui, sans-serif`.
- Mono: solo para valores tecnicos o identificadores cuando sea necesario.

Escala actual:

| Elemento | Clase orientativa | Uso |
| --- | --- | --- |
| H1 de pagina app | `text-2xl sm:text-3xl font-bold text-primary` | Titulo principal de pantalla protegida |
| H1 landing | `text-4xl sm:text-5xl lg:text-6xl font-black` | Solo para hero comercial |
| H2 card destacada | `text-2xl font-black` | Recomendacion principal o bloque critico |
| Card title | `text-base font-semibold` | Titulos internos de cards |
| Metric value | `text-2xl font-black text-primary` | Montos, score, fecha estimada |
| Body | `text-sm leading-6 text-muted` | Descripciones y explicaciones |
| Label | `text-sm font-semibold` | Formularios y etiquetas de datos |
| Badge/table heading | `text-xs font-semibold uppercase` | Estados, encabezados compactos |

Reglas:

- Usar `tracking-normal` en titulos grandes. No aplicar tracking negativo.
- Reservar `font-black` para marca, metricas principales y promesas comerciales.
- Mantener parrafos descriptivos en `text-sm` o `text-base` con `leading-6` o `leading-7`.
- No escalar fuentes con ancho de viewport.
- El contenido financiero debe ser legible antes que llamativo.

## 5. Espaciado, radios y elevacion

Sistema de espaciado:

- Contenedor app: `px-4 py-6` en movil, `md:px-8 md:py-8` en desktop.
- Stack entre secciones: `space-y-6`.
- Gaps de grid: `gap-4` para colecciones compactas, `gap-6` para bloques principales.
- Padding de card: `p-5`.
- Header de card: `px-5 py-4`.
- Forms: `grid gap-4 md:grid-cols-2`.

Radios:

- Radio estandar: `rounded-lg`.
- Componentes repetidos, cards, inputs, badges y barras usan radios consistentes.
- No aumentar radios para crear un estilo "pill" salvo badges o elementos naturalmente circulares.

Elevacion:

- Card base: `shadow-sm`.
- Landing puede usar `shadow-2xl` solo en mockups o bloques comerciales destacados.
- Evitar capas flotantes dentro de otras cards. Las cards pueden contener metricas o filas, pero no deben convertirse en una pila decorativa de paneles anidados.

## 6. Layout de aplicacion

La app protegida usa `AppShell`.

Desktop:

- Sidebar fija de `w-72` a la izquierda.
- Contenido con `md:pl-72`.
- Header superior sticky con saludo, estado de acceso y badge comercial.
- Navegacion vertical con icono + label.
- Main con ancho fluido y padding consistente.

Movil:

- Header sticky superior.
- Bottom navigation fija de 5 items.
- Padding inferior `pb-20` para evitar que la navegacion tape contenido.
- Tablas y bloques anchos deben usar scroll horizontal o reorganizarse en una columna.

Reglas:

- La primera seccion de una pagina protegida debe empezar con `PageHeader`.
- Las pantallas operativas no deben tener heroes grandes.
- Los grids deben degradar a una columna en movil.
- Las acciones primarias deben aparecer cerca del contexto donde se necesitan.
- En desktop, los paneles laterales son utiles para resumen, cuenta, filtros o variables de simulacion.

## 7. Navegacion oficial

Orden de navegacion protegida:

1. Dashboard
2. Perfil
3. Deudas
4. Resumen
5. Simulador
6. Estrategias
7. Calendario
8. Alertas
9. Recomendaciones
10. Educacion
11. Metas
12. Reporte

Bottom nav movil:

- Dashboard
- Perfil
- Deudas
- Simulador
- Alertas

Reglas:

- No agregar mas de 5 items al bottom nav.
- Mantener iconos de `lucide-react`.
- La ruta activa usa `primary`; en desktop, fondo `primary` y texto blanco.
- `Perfil` es la ubicacion permanente para actualizar el plan financiero, no un ajuste escondido.
- `Cerrar sesion` vive al final del sidebar y no debe competir visualmente con acciones financieras.

## 8. Estructura de pagina

Patron recomendado para paginas protegidas:

```tsx
<div className="space-y-6">
  <PageHeader title="..." description="..." action={...} />
  <SeccionPrincipal />
  <GridDeMetricas />
  <ContenidoSecundario />
</div>
```

Uso de `PageHeader`:

- `title`: claro, corto y orientado a tarea.
- `description`: explica para que sirve la pantalla y como impacta el plan.
- `action`: una accion contextual o un badge de estado, no multiples acciones.

Ejemplos de tono:

- Correcto: `Agrega tus deudas una por una. Mientras mas exacta sea la informacion, mas preciso sera tu plan.`
- Correcto: `Compara rutas posibles y elige con contexto, no con intuicion suelta.`
- Evitar: `Administra recursos financieros avanzados desde este modulo.`

## 9. Componentes base

### Button

Variantes oficiales:

- `primary`: accion principal.
- `secondary`: accion alternativa o regreso.
- `success`: compra, confirmacion o avance positivo.
- `danger`: accion destructiva o riesgo.
- `ghost`: accion secundaria de bajo peso.

Tamanos:

- `sm`: acciones de card o tabla.
- `md`: acciones normales.
- `lg`: landing, checkout o CTA comercial.

Reglas:

- Los botones deben tener iconos cuando la accion se beneficie de reconocimiento visual.
- Usar `disabled` durante guardado o procesamiento.
- Texto de loading: `Guardando...`, `Procesando...` o equivalente corto.
- No usar botones para navegacion si el destino es una ruta; usar `ButtonLink`.

### Card

Card base:

- `rounded-lg border border-line bg-white shadow-sm`.
- Header con titulo, descripcion opcional y accion opcional.
- Content con `p-5`.

Usos:

- Metricas.
- Formularios.
- Comparaciones.
- Resumenes financieros.
- Estados de cuenta.
- Bloques comerciales de checkout.

Reglas:

- Una card debe tener una responsabilidad clara.
- No meter cards decorativas dentro de cards salvo que sean metricas internas simples con fondo suave.
- No usar cards para dividir secciones completas de pagina cuando un layout sin marco sea suficiente.

### Badge

Variantes:

- `default`: informacion neutra.
- `success`: activo, al dia, sostenible, recomendado.
- `warning`: proximo, revisar, riesgo medio.
- `danger`: mora, cobranza, alto riesgo, error.
- `info`: datos demo o informacion contextual.

Reglas:

- El badge debe describir estado, no decorar.
- Mantener textos breves: `Al dia`, `Proxima`, `En mora`, `Datos demo`, `Acceso vitalicio`.
- Combinar icono + texto solo cuando mejore reconocimiento.

### Field, Input, Select y Textarea

Patron:

- Label visible.
- Control de `h-11`, borde `line`, fondo blanco.
- Focus con `border-primary` y `ring-primary/10`.
- Error debajo del campo en `text-danger`.

Reglas:

- Todos los inputs financieros deben definir `type="number"`, `min`, y `step` cuando aplique.
- Montos en COP usan incrementos de `1000` o `10000` segun contexto.
- Selects deben usar opciones con labels humanos, no valores tecnicos.
- Checkboxes se presentan como filas tocables con borde y `accent-primary`.
- Los formularios largos usan dos columnas desde `md`; en movil una columna.

### ProgressBar

Tonos:

- `success`: nivel sostenible o progreso positivo.
- `warning`: presion media.
- `danger`: presion alta o riesgo.
- `primary`: progreso neutral de marca.

Reglas:

- Siempre normalizar a 0-100.
- Acompanar con label si el porcentaje no es autoexplicativo.
- No usar barras sin contexto financiero claro.

### EmptyState

Uso:

- Sin deudas.
- Sin alertas.
- Sin metas.
- Sin registros de pago.
- Sin recomendaciones precisas antes de ingresar informacion.

Reglas:

- Titulo directo.
- Descripcion con siguiente accion clara.
- CTA opcional centrado.
- No culpar al usuario por falta de datos.

## 10. Formularios financieros

Los formularios son una parte critica de confianza. Deben pedir solo lo necesario, mostrar labels claros y aceptar incertidumbre cuando el usuario no sabe un dato.

Reglas:

- Usar lenguaje cotidiano: `Saldo pendiente`, `Cuota mensual`, `Fecha de pago`, `Nivel de urgencia financiera`.
- Si un dato puede ser desconocido, ofrecer opcion explicita como `No la se`.
- Validar en cliente con React Hook Form + Zod y reforzar en server actions.
- Mostrar errores por campo cuando existan.
- El error general del servidor va al final del formulario, sobre las acciones o ocupando todo el ancho.
- Los formularios no deben borrar datos ya ingresados despues de un error.
- Para onboarding y plan financiero, reutilizar el mismo patron para que la actualizacion desde Perfil se sienta familiar.

Acciones:

- Onboarding inicial: `Crear mi plan financiero`.
- Actualizacion desde Perfil: `Guardar cambios` o `Actualizar mi plan financiero`.
- Nueva deuda: `Agregar deuda`.
- Durante pending: `Guardando...`.

## 11. Tablas y listas de deuda

Tabla de deudas:

- Contenedor con borde, fondo blanco y `shadow-sm`.
- Header con titulo, descripcion y CTA `Agregar deuda`.
- Tabla con `min-w-[840px]` y `overflow-x-auto`.
- Encabezado en mayusculas pequenas con fondo `#F7FAFC`.
- Filas con hover suave `#F9FBFD`.

Columnas actuales:

- Nombre
- Saldo
- Cuota
- Tasa
- Vence
- Estado
- Prioridad
- Accion

Reglas:

- Las cifras monetarias importantes usan `formatCurrency`.
- El saldo debe destacar en `text-primary` y `font-semibold`.
- Los estados usan badge:
  - `Al dia`: success
  - `Proxima`: warning
  - `En mora`: danger
  - `Cobranza`: danger
- La prioridad debe traducir la logica financiera a lenguaje accionable:
  - `Urgente`
  - `Tasa alta`
  - `Cierre rapido`
  - `Seguimiento`

## 12. Metricas y dashboard

MetricCard:

- Altura minima `min-h-32`.
- Titulo en texto muted.
- Valor principal en `text-2xl font-black text-primary`.
- Helper opcional para contexto.
- Icono opcional en contenedor `#EEF4F8`.

Metricas principales:

- Total adeudado.
- Total cuotas mensuales.
- Ingresos mensuales.
- Capacidad disponible.
- Fecha estimada de salida de deudas.
- Score de salud financiera.

Reglas:

- Una metrica sin contexto puede inducir mala decision; agregar helper cuando el numero necesite interpretacion.
- El score no debe reemplazar recomendaciones concretas.
- Las fechas estimadas deben mostrarse en formato humano: mes y ano.
- Las comparaciones deben indicar escenario base o criterio usado.

## 13. Recomendaciones y estrategias

La recomendacion mensual es el bloque de mayor jerarquia en el dashboard.

Patron:

- Card con fondo `primary`, texto blanco y acento `success`.
- Titulo accionable.
- Cuerpo breve con razon.
- Impacto en bloque destacado.
- Panel interno blanco con estrategia y deuda objetivo.

Reglas:

- La recomendacion debe decir que pagar primero, por que y que impacto tiene.
- No debe prometer resultados garantizados.
- Cuando no haya deudas, explicar que se necesitan datos para activar recomendaciones precisas.
- Las estrategias deben mostrar ventajas, riesgos, cuando conviene y resultado estimado.
- Las palabras `Bola de nieve`, `Avalancha`, `Consolidacion`, `Refinanciacion`, `Plan agresivo`, `Plan equilibrado`, `Plan de emergencia` y `Plan hibrido` deben mantenerse consistentes.

## 14. Graficas

Libreria oficial: `Recharts`.

Paleta de graficas:

1. `#0B2C4A`
2. `#2ECC71`
3. `#E74C3C`
4. `#F1C40F`
5. `#52616B`
6. `#7FB3D5`

Reglas:

- Usar `ResponsiveContainer`.
- Altura estandar: `h-72`.
- Grid cartesiano en `#D9E2EC`, sin lineas verticales salvo necesidad.
- Tooltips con `formatCurrency`.
- Eje Y para COP puede abreviar millones cuando mejore lectura.
- No usar graficas 3D.
- No mostrar graficas vacias sin estado alternativo.
- Las graficas deben responder una pregunta concreta: concentracion de deuda, distribucion, presion sobre ingresos, progreso o comparacion.

## 15. Estados de carga, error y vacio

Loading:

- Usar skeletons con `animate-pulse`.
- Mantener la forma aproximada del contenido real.
- Evitar spinners como unica senal en pantallas de datos.

Error:

- Card blanca con titulo claro.
- Descripcion breve.
- Accion primaria de recuperacion: `Reintentar`.
- Mensaje tecnico solo si ayuda a resolver configuracion local o soporte.

Vacio:

- Usar `EmptyState`.
- Dar siguiente accion concreta.
- En datos demo, etiquetar con badge `Datos demo`.

Mensajes:

- Error generico app: `Algo no cargo bien`.
- Supabase/config local: indicar revisar conexion o `.env.local` solo en contextos de desarrollo.
- Pago fallido o pendiente: explicar estado y proximo paso sin culpar al usuario.

## 16. Accesibilidad

Reglas obligatorias:

- Todos los controles interactivos deben ser alcanzables por teclado.
- El foco visible debe mantenerse con ring, no eliminarse.
- Inputs deben tener label visible, no depender solo de placeholder.
- Iconos decorativos no deben reemplazar texto esencial.
- El color no puede ser la unica forma de comunicar estado; usar texto de badge o label.
- Mantener contraste alto en texto sobre `primary`.
- Los botones deshabilitados deben verse inactivos y no ejecutar acciones.
- Tablas deben preservar encabezados claros.
- No superponer texto sobre componentes de datos.

## 17. Responsive behavior

Breakpoints usados:

- Base: movil.
- `sm`: ajustes de filas, acciones junto a titulos.
- `md`: sidebar desktop, grids de formulario a dos columnas, padding ampliado.
- `lg`: layouts de contenido + panel lateral.
- `xl`: grids de metricas mas densos.

Reglas:

- Disenar primero en una columna.
- No esconder acciones esenciales en desktop ni movil.
- Bottom nav movil requiere espacio inferior suficiente.
- Tablas anchas deben permitir scroll horizontal.
- Cards con acciones deben apilar accion debajo del titulo en movil.
- Textos largos en botones deben poder partir linea o usar copy mas corto.

## 18. Copy y tono

Ruta Cero habla en espanol claro, directo y empatico. El tono debe sonar como una herramienta que ayuda a decidir, no como banco tradicional ni como coach motivacional exagerado.

Voz:

- Clara.
- Calmada.
- Practica.
- Orientada a decisiones.
- Respetuosa con la situacion financiera del usuario.

Buenas practicas:

- Usar `tu`, `tus`, `agrega`, `compara`, `actualiza`, `revisa`.
- Explicar beneficio financiero real: reducir intereses, evitar mora, priorizar pagos, mejorar flujo.
- Preferir frases cortas.
- Nombrar el siguiente paso.
- Reconocer incertidumbre: `si no conoces la tasa`, `revisar antes de aceptar`.

Evitar:

- Culpa: `no has sido responsable`.
- Promesas absolutas: `saldras de deudas garantizado`.
- Jerga bancaria innecesaria.
- Urgencia falsa: `solo hoy`, `ultima oportunidad`.
- Mensajes de suscripcion, mensualidad, plan premium mensual o renovacion automatica.

## 19. Landing, auth y checkout

Landing:

- Debe mostrar marca, promesa de salida de deudas y producto vitalicio en primer viewport.
- Puede usar un mockup visual del producto, siempre basado en datos reales de la app.
- CTA principal: obtener acceso vitalicio.
- CTA secundario: iniciar sesion.
- Debe repetir pago unico y ausencia de suscripciones.

Auth:

- Login y registro usan card centrada `max-w-md`.
- La marca aparece arriba.
- El registro debe explicar que primero se crea cuenta pendiente de pago y luego se activa el acceso vitalicio.

Checkout:

- Debe reforzar que la cuenta ya fue creada y falta completar el pago unico.
- Resumen comercial en panel lateral o bloque claro.
- Beneficios breves con icono de confirmacion.
- Nunca presentar planes alternativos recurrentes.

Pagos:

- Success: confirmar acceso vitalicio y llevar a onboarding.
- Pending: explicar espera de confirmacion.
- Failed: ofrecer reintento o soporte.
- Required: explicar que se necesita activar acceso para usar app.

## 20. Implementacion y revisiones futuras

Checklist antes de aceptar una nueva pantalla:

- Usa tokens oficiales, no colores sueltos innecesarios.
- Empieza con `PageHeader` si es pantalla protegida.
- Respeta sidebar desktop y bottom nav movil.
- Tiene estado vacio, loading y error cuando aplica.
- Usa `formatCurrency`, `formatPercent`, `monthLabel` o `estimateDebtFreeDate` para datos financieros.
- No mezcla calculos financieros complejos dentro de componentes visuales.
- Usa componentes base antes de crear nuevos estilos.
- Las acciones principales son claras y estan cerca del contexto.
- La pantalla funciona en movil sin solapes.
- No introduce suscripciones, mensualidades ni copy contrario a acceso vitalicio.
- Los labels y mensajes estan en espanol claro.
- Los estados de riesgo usan badge o texto, no solo color.

Checklist para nuevos componentes:

- Define anatomia, variantes y estados.
- Usa `rounded-lg`, `border-line`, `bg-white` o tokens oficiales.
- Mantiene foco visible.
- Acepta `className` cuando sea util para composicion.
- No contiene logica financiera que pertenezca a `src/lib/financial-engine.ts`.
- Tiene copy breve y consistente con este manual.

## 21. Archivos fuente relacionados

- Tokens globales: `src/app/globals.css`
- Marca y navegacion: `src/lib/constants.ts`
- Shell de aplicacion: `src/components/app-shell.tsx`
- Botones: `src/components/ui/button.tsx`
- Cards: `src/components/ui/card.tsx`
- Badges: `src/components/ui/badge.tsx`
- Campos: `src/components/ui/field.tsx`
- Header de pagina: `src/components/ui/page-header.tsx`
- Progreso: `src/components/ui/progress-bar.tsx`
- Estado vacio: `src/components/ui/empty-state.tsx`
- Metricas: `src/components/dashboard/metric-card.tsx`
- Recomendacion: `src/components/dashboard/recommendation-card.tsx`
- Tabla de deudas: `src/components/debt-table.tsx`
- Graficas: `src/components/charts/debt-charts.tsx`
- Motor financiero: `src/lib/financial-engine.ts`
