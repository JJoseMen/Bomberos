# Warnings de Sass (@import vs @use)

## Qué son

Al compilar (`vite build`) aparecen avisos:

> DEPRECATION WARNING [import]: Sass @import rules are deprecated
> and will be removed in Dart Sass 3.0.0.

Son **avisos, no errores**: el build termina con exit 0 y el CSS
se genera correctamente.

## Por qué aparecen

- Los `.module.scss` y `global.scss` usan `@import` para compartir
  `variables.scss` / `mixins.scss`.
- `vite.config.ts` inyecta `@import "@/assets/styles/variables.scss";`
  vía `css.preprocessorOptions.scss.additionalData`.
- Dart Sass 2.x marca `@import` como obsoleto; lo eliminará en Sass 3.0.

## Cómo migrarlos a @use (fase de limpieza posterior)

1. En cada `.module.scss`, reemplazar:
   `@import './variables';` → `@use '@/assets/styles/variables' as *;`
   (o con namespace: `@use '...' as v;` y prefijar `v.$color-...`).
2. En `vite.config.ts`, cambiar `additionalData` a:
   `@use "@/assets/styles/variables.scss" as *;`
3. Verificar que no haya colisiones de nombres entre `variables` y `mixins`
   al usar `as *`; si las hay, usar namespaces.
4. Recompilar y confirmar que desaparecen los warnings.

## Prioridad

**Baja.** No bloquea build, tests ni despliegue. Dejar para una fase
de limpieza dedicada, cuando se toque el sistema de estilos.
