# Mein Matheheft

Cuaderno interactivo de matemáticas de sexto, con toda la interfaz y los ejercicios en alemán. Adaptado de los PDF de ejercicios y soluciones facilitados por el usuario.

Incluye un índice con fecha y descripción, siete capítulos, 106 respuestas comprobables, rectángulo editable, reparto de chocolate y rectas numéricas. No necesita cuentas, bases de datos, bibliotecas externas ni conexión a Internet una vez abierto.

## Abrirlo en este Mac o en la red local

Haz doble clic en `Matheheft starten.command`. Se abrirá el navegador y una ventana de Terminal. Mantén esa ventana abierta mientras uses el cuaderno. Para terminar, pulsa Ctrl+C.

La terminal muestra el enlace para este ordenador y, cuando se puede detectar, el enlace para otros dispositivos conectados a la misma red. Si macOS solicita acceso a la red para Python, será necesario permitirlo para abrirlo desde otro dispositivo.

También puedes ejecutar:

```sh
python3 serve.py
```

O limitarlo a este equipo: `python3 serve.py --local-only`. El puerto predeterminado es 8765; se puede cambiar con `--port 8766`.

Como alternativa, abre `dist/index.html` directamente. Funciona sin servidor, aunque la persistencia de `localStorage` en archivos `file://` depende del navegador. El servidor local o Pages ofrecen un origen estable.

## Guardado y corrección

- Se guardan automáticamente las respuestas, los dibujos, las notas y el último capítulo abierto.
- Los datos pertenecen al navegador y a la dirección exacta utilizada. Cambiar de dispositivo, navegador, puerto o entre localhost y la dirección de red crea un espacio de respuestas distinto. No hay sincronización.
- Borrar los datos del navegador también borra las respuestas. El modo privado puede eliminarlas al cerrar la sesión.
- «Antworten prüfen» solo se activa cuando están completas las 106 respuestas. Para el rectángulo hay que marcar «Mein Rechteck ist fertig»; todas las piezas del chocolate deben estar asignadas.
- La corrección marca aciertos y errores, sin mostrar la solución. Permite modificar respuestas y volver a comprobar.
- Se aceptan coma y punto decimal. Los períodos se escriben entre paréntesis; los números mixtos, como `2 1/3`. Las fracciones deben estar simplificadas cuando el enunciado lo pide.
- «Alles löschen» solicita confirmación y borra solo esta ficha. No vacía los datos de otras webs.

## GitHub Pages

Todo el sitio público está en `dist/`. Las rutas son relativas, por lo que funcionan bajo un subdirectorio de Pages. `main` conserva el proyecto completo y `gh-pages` contiene únicamente los archivos públicos de `dist/`.

En Settings → Pages, elige **Deploy from a branch**, rama **gh-pages**, carpeta **/(root)**. La dirección del cuaderno será https://deigote.github.io/matheheft/.

Para publicar futuras actualizaciones, confirma primero los cambios con Git y ejecuta desde la carpeta del proyecto:

```sh
node --test tests/math.test.cjs
git push origin HEAD:main
git subtree push --prefix=dist origin gh-pages
```

Referencia del despliegue: [documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch).

Los PDF originales y las respuestas del alumno no forman parte del repositorio ni del despliegue. Las soluciones que usa el corrector están en JavaScript: este cuaderno es para practicar, no para exámenes con respuestas secretas.

## Archivos y comprobaciones

- `dist/app.js`: enunciados, índice, navegación, dibujos, persistencia y resultados.
- `dist/math.js`: comparación exacta de fracciones y decimales periódicos y validación de dibujos.
- `dist/styles.css`: diseño adaptable a ordenador y móvil.
- `tests/math.test.cjs`: pruebas de equivalencias, formato de respuestas y dibujos.

```sh
node --test tests/math.test.cjs
```

La revisión en navegador incluye completar las 106 respuestas, corrección con un error intencionado, reintento correcto, persistencia tras recargar, bloqueo con una sola respuesta pendiente y borrado con confirmación.
