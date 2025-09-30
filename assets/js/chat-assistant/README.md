# 🤖 Chat Assistant con Cuervo Compañero

Sistema modular de chat inteligente con IA (Groq API) y un cuervo animado que sigue al usuario.

## 📁 Estructura del Proyecto

```
assets/
├── css/
│   ├── chat-assistant/          # Estilos del chat
│   │   ├── main.css            # Estilos principales del chat
│   │   ├── messages.css        # Burbujas de mensajes
│   │   └── input.css           # Área de entrada de texto
│   └── raven-companion/         # Estilos del cuervo
│       ├── main.css            # Estilos principales del cuervo
│       ├── animations.css      # Animaciones del cuervo
│       └── bubble.css          # Burbujas de diálogo del cuervo
└── js/
    ├── chat-assistant/          # Lógica del chat
    │   ├── main.js             # Controlador principal
    │   └── groq-api.js         # Cliente API de Groq
    └── raven-companion/         # Lógica del cuervo
        └── main.js             # Animaciones y comportamiento
```

## 🚀 Implementación

### 1. Incluir archivos CSS
```html
<!-- Chat Assistant Styles -->
<link rel="stylesheet" href="assets/css/chat-assistant/main.css">
<link rel="stylesheet" href="assets/css/chat-assistant/messages.css">
<link rel="stylesheet" href="assets/css/chat-assistant/input.css">

<!-- Raven Companion Styles -->
<link rel="stylesheet" href="assets/css/raven-companion/main.css">
<link rel="stylesheet" href="assets/css/raven-companion/animations.css">
<link rel="stylesheet" href="assets/css/raven-companion/bubble.css">
```

### 2. Incluir archivos JavaScript
```html
<!-- Chat Assistant Scripts -->
<script src="assets/js/chat-assistant/groq-api.js"></script>
<script src="assets/js/raven-companion/main.js"></script>
<script src="assets/js/chat-assistant/main.js"></script>
```

### 3. Inicializar el sistema
```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Chat Assistant
  const chatAssistant = new ChatAssistant({
    apiKey: 'TU_API_KEY_DE_GROQ', // Opcional: sin esto usa respuestas predefinidas
    autoOpen: false,
    position: 'bottom-right'
  });
  
  console.log('💬 Chat Assistant con Cuervo inicializado');
});
</script>
```

## 🔧 Configuración

### API Key de Groq (Opcional)
```javascript
const chatAssistant = new ChatAssistant({
  apiKey: 'gsk_...', // Tu API key de Groq
  maxMessages: 50,   // Máximo mensajes en historial
  autoOpen: false    // No abrir automáticamente
});
```

### Sin API Key
El sistema funciona perfectamente sin API key usando respuestas predefinidas inteligentes.

## ✨ Características

### 🤖 Chat Assistant
- **Interface moderna** con animaciones suaves
- **Respuestas inteligentes** sobre Edgar y sus proyectos
- **Quick actions** para preguntas frecuentes
- **Typing indicators** y efectos visuales
- **Responsive** para móviles y desktop
- **Fallback** a respuestas predefinidas sin API

### 🐦‍⬛ Raven Companion
- **Sigue el mouse** del usuario por toda la página
- **Animaciones fluidas** (flotar, volar, posarse)
- **Burbujas de diálogo** con mensajes contextuales
- **Estados reactivos** al chat (escuchando, pensando, etc.)
- **Efectos de estela** durante el movimiento
- **Easter egg** (click en el cuervo para sorpresa)

## 🎨 Personalización

### Cambiar colores del chat
```css
/* En main.css */
:root {
  --chat-primary: #10b981;    /* Verde esmeralda */
  --chat-bg: #0f172a;         /* Fondo oscuro */
  --chat-text: #e2e8f0;       /* Texto claro */
}
```

### Modificar frases del cuervo
```javascript
// En raven-companion/main.js
this.phrases = [
  "¡Hola! Soy Edgar AI 🤖",
  "¿Necesitas ayuda? 💡",
  "Tu frase personalizada aquí"
];
```

## 🔒 Seguridad

- **API Key del cliente**: Solo funciona en tu dominio
- **Rate limiting**: Groq API incluye límites automáticos
- **Validación de entrada**: Previene inyecciones
- **Timeouts**: Evita requests colgados

## 📱 Responsive Design

- **Mobile first**: Optimizado para dispositivos móviles
- **Breakpoints**: Adapta tamaños y posiciones
- **Touch friendly**: Botones grandes para touch

## 🐛 Troubleshooting

### Chat no aparece
1. Verificar que todos los CSS estén cargados
2. Comprobar errores en consola del navegador
3. Asegurar que los scripts estén en orden correcto

### Cuervo no se mueve
1. Verificar que `RavenCompanion` esté cargado
2. Comprobar que no hay errores de JavaScript
3. Revisar permisos de animaciones en el navegador

### API no responde
1. Verificar API key de Groq
2. Comprobar límites de rate limiting
3. El sistema tiene fallback automático a respuestas predefinidas

## 📊 Performance

- **Lazy loading**: Solo carga cuando se necesita
- **Debounced animations**: Optimiza el rendimiento
- **Memory cleanup**: Limpia elementos no usados
- **Minimal DOM**: Estructura ligera y eficiente

## 🔄 Actualizaciones Futuras

- [ ] Soporte para más APIs de IA
- [ ] Temas personalizables
- [ ] Más animaciones del cuervo
- [ ] Integración con analíticas
- [ ] Modo offline mejorado

---

**¡Ya tienes un chat assistant completo con cuervo compañero! 🎉**

Para activarlo, solo incluye los archivos y agrega el script de inicialización.