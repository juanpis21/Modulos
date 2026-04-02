// Obtener ID del usuario logeado
const usuarioId = localStorage.getItem("usuarioId");

/* ============================
   CARGAR PERFIL
============================ */
function cargarPerfil() {
    fetch(`/usuario/buscar/${usuarioId}`)
        .then(r => r.json())
        .then(u => {
            document.getElementById("nombrePerfil").value = u.nombres;
            document.getElementById("apellidoPerfil").value = u.apellidos;
            document.getElementById("correoPerfil").value = u.correo;
            document.getElementById("telefonoPerfil").value = u.telefono;
            document.getElementById("direccionPerfil").value = u.direccion;

            document.getElementById("fotoPerfil").src =
                u.imagen ? `/${u.imagen}` : "/img/default.png";
        });
}

/* ============================
   ACTUALIZAR PERFIL
============================ */
function actualizarPerfil() {

    const data = {
        nombres: document.getElementById("nombrePerfil").value,
        apellidos: document.getElementById("apellidoPerfil").value,
        correo: document.getElementById("correoPerfil").value,
        telefono: document.getElementById("telefonoPerfil").value,
        direccion: document.getElementById("direccionPerfil").value
    };

    fetch(`/usuario/actualizar/${usuarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(() => alert("Perfil actualizado correctamente"));
}

/* ============================
   ACTUALIZAR FOTO
============================ */
function actualizarFotoPerfil() {
    const input = document.getElementById("inputFoto");

    if (input.files.length === 0) {
        alert("Seleccione una foto");
        return;
    }

    const formData = new FormData();
    formData.append("file", input.files[0]);

    fetch(`/usuario/${usuarioId}/foto`, {
        method: "POST",
        body: formData
    })
    .then(() => {
        alert("Foto actualizada");
        cargarPerfil();
    });
}

/* ============================
   ELIMINAR FOTO
============================ */
function eliminarFotoPerfil() {
    fetch(`/usuario/${usuarioId}/foto`, { method: "DELETE" })
        .then(() => {
            alert("Foto eliminada");
            cargarPerfil();
        });
}

/* ============================
   ACTUALIZAR CONTRASEÑA
============================ */
function actualizarPassword() {
    const nuevaPass = document.getElementById("passwordNueva").value;

    fetch(`/usuario/${usuarioId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaPass)
    })
    .then(() => alert("Contraseña actualizada"));
}

window.onload = cargarPerfil;
