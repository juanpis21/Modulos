const fs = require('fs');
const path = require('path');

const mappings = [
    { html: 'inicio.html', comp: 'inicio', css: 'Estilos-Inicio.css' },
    { html: 'sobrenosotros.html', comp: 'sobre-nosotros', css: 'Estilos-SNosotros.css' },
    { html: 'adopcion.html', comp: 'adopcion', css: 'Estilos-Adopciones.css' },
    { html: 'tienda.html', comp: 'tienda', css: 'Estilos-Tienda.css' },
    { html: 'reporte.html', comp: 'reporte', css: 'Estilos-Reporte.css' },
    { html: 'calificacion.html', comp: 'calificacion', css: 'CSS-Calificaciones.css' },
    { html: 'veterinario.html', comp: 'veterinario', css: 'Css-Veterinario.css' },
    { html: 'perfil-veterinario.html', comp: 'perfil-veterinario', css: 'Css-Veterinario.css' },
    { html: 'perfilusuario.html', comp: 'perfil-usuario', css: 'Estilos-Usuario.css' },
    { html: 'perfil.html', comp: 'perfil', css: 'Estilos-Usuario.css' },
    { html: 'panelAdmin.html', comp: 'panel-admin', css: 'CSS-Admin.css' },
    { html: 'pasarela-pagos.html', comp: 'pasarela-pagos', css: 'Estilos-Pasarela.css' },
    { html: 'recovery.html', comp: 'recovery', css: 'Estilos-recovery.css' },
    { html: 'recovery-contra.html', comp: 'recovery-contra', css: 'Estilos-recovery.css' },
    { html: 'registro.html', comp: 'register', css: 'Estilos-registro.css' },
    { html: 'servicios.html', comp: 'servicios', css: 'CSS-Servicios.css' }
];

const vistasPath = path.join(__dirname, 'vistas finales');
const srcCompPath = path.join(__dirname, 'src/app/component');
const cssPath = path.join(__dirname, 'vistas finales/assets/CSS');

mappings.forEach(map => {
    try {
        const fullHtmlPath = path.join(vistasPath, map.html);
        if (fs.existsSync(fullHtmlPath)) {
            let htmlContent = fs.readFileSync(fullHtmlPath, 'utf8');
            
            // Extract body content
            const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                let innerHtml = bodyMatch[1];
                
                // Remove scripts
                innerHtml = innerHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                // Also remove head and body tags just in case
                
                const targetHtmlPath = path.join(srcCompPath, map.comp, `${map.comp}.html`);
                
                if (fs.existsSync(targetHtmlPath)) {
                    fs.writeFileSync(targetHtmlPath, innerHtml, 'utf8');
                    console.log(`Updated HTML for ${map.comp}`);
                }
            }
        }

        const fullCssPath = path.join(cssPath, map.css);
        if (fs.existsSync(fullCssPath)) {
            const cssContent = fs.readFileSync(fullCssPath, 'utf8');
            const targetScssPath = path.join(srcCompPath, map.comp, `${map.comp}.scss`);
            
            if (fs.existsSync(targetScssPath)) {
                fs.writeFileSync(targetScssPath, cssContent, 'utf8');
                console.log(`Updated SCSS for ${map.comp}`);
            }
        }
    } catch (e) {
        console.error(`Failed to process ${map.comp}`, e);
    }
});
