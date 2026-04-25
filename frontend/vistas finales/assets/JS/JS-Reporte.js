document.addEventListener('DOMContentLoaded', function () {
    // Mostrar/ocultar información del denunciante según checkbox anónimo
    const anonymousCheckbox = document.getElementById('anonymous');
    const reporterInfoSection = document.getElementById('reporterInfo');

    anonymousCheckbox.addEventListener('change', function () {
        if (this.checked) {
            reporterInfoSection.style.display = 'none';
            // Limpiar los campos cuando se marca como anónimo
            document.getElementById('reporterName').value = '';
            document.getElementById('reporterPhone').value = '';
            document.getElementById('reporterEmail').value = '';
        } else {
            reporterInfoSection.style.display = 'block';
        }
    });

    // Mostrar/ocultar campo para tipo de animal "Otro"
    const animalTypeSelect = document.getElementById('animalType');
    const otherAnimalContainer = document.getElementById('otherAnimalContainer');
    const otherAnimalInput = document.getElementById('otherAnimalType');

    animalTypeSelect.addEventListener('change', function () {
        if (this.value === 'otro') {
            otherAnimalContainer.style.display = 'block';
            otherAnimalInput.setAttribute('required', '');
        } else {
            otherAnimalContainer.style.display = 'none';
            otherAnimalInput.removeAttribute('required');
            otherAnimalInput.value = '';
        }
    });


    reportForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar tipo de animal si es "Otro"
        if (animalTypeSelect.value === 'otro' && !otherAnimalInput.value) {
            alert('Por favor especifique el tipo de animal');
            return;
        }

        // Obtener el tipo de animal (incluyendo el campo "otro" si aplica)
        let animalType = animalTypeSelect.value;
        if (animalType === 'otro') {
            animalType = otherAnimalInput.value;
        }

        // Aquí puedes usar animalType en tu lógica de envío
        console.log('Tipo de animal:', animalType);

        // Mostrar modal de confirmación
        confirmationModal.style.display = 'flex';

        // Limpiar formulario después de enviar
        setTimeout(() => {
            this.reset();
            filePreview.innerHTML = '';
            reporterInfoSection.style.display = 'block';
            otherAbuseDescription.style.display = 'none';
            otherAnimalContainer.style.display = 'none';
        }, 1000);
    });

    // Manejo de la subida de archivos
    const evidenceInput = document.getElementById('evidence');
    const filePreview = document.getElementById('filePreview');
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    evidenceInput.addEventListener('change', function () {
        filePreview.innerHTML = '';
        const files = Array.from(this.files);
        let totalSize = 0;

        // Validar número de archivos
        if (files.length > maxFiles) {
            alert(`Solo puedes subir un máximo de ${maxFiles} archivos.`);
            this.value = '';
            return;
        }

        // Validar tamaño total
        files.forEach(file => {
            totalSize += file.size;
        });

        if (totalSize > maxSize) {
            alert(`El tamaño total de los archivos no debe exceder los 10MB.`);
            this.value = '';
            return;
        }

        // Mostrar previsualización
        files.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                previewItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                previewItem.appendChild(video);
            } else {
                // Si no es imagen ni video, mostrar icono
                const fileIcon = document.createElement('div');
                fileIcon.innerHTML = `<i class="fas fa-file"></i> ${file.name}`;
                previewItem.appendChild(fileIcon);
            }

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => removeFile(index));

            previewItem.appendChild(removeBtn);
            filePreview.appendChild(previewItem);
        });
    });

    function removeFile(index) {
        const dt = new DataTransfer();
        const files = Array.from(evidenceInput.files);

        files.splice(index, 1);
        files.forEach(file => dt.items.add(file));

        evidenceInput.files = dt.files;
        evidenceInput.dispatchEvent(new Event('change'));
    }

    // Manejo del formulario
    const reportForm = document.getElementById('abuseReportForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    reportForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Aquí iría la lógica para enviar el formulario a un servidor
        // Por ahora solo mostramos el modal de confirmación
        confirmationModal.style.display = 'flex';

        //Manejo del envío del formulario con SweetAlert
        const reportForm = document.getElementById('abuseReportForm');

        reportForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validar campo "Otro" si está seleccionado
            if (animalTypeSelect.value === 'otro' && !otherAnimalInput.value.trim()) {
                Swal.fire({
                    title: 'Campo requerido',
                    text: 'Por favor especifique el tipo de animal',
                    icon: 'warning',
                });
                return;
            }

            // Mostrar alerta de éxito
            Swal.fire({
                title: '¡Reporte Enviado!',
                html: `
                <p>Hemos recibido tu denuncia correctamente.</p>
                <p><i class="fas fa-lock" style="color: #4a6fa5;"></i> Tu información está protegida y será tratada con confidencialidad.</p>
            `,
                icon: 'success',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4a6fa5',
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: `
                rgba(0,0,0,0.7)
                url("https://cdn.pixabay.com/photo/2016/04/01/08/29/animal-1300084_640.png")
                center top
                no-repeat
            `
            }).then((result) => {
                if (result.isConfirmed) {
                    // Limpiar formulario
                    reportForm.reset();
                    document.getElementById('filePreview').innerHTML = '';
                    document.getElementById('reporterInfo').style.display = 'block';
                    document.getElementById('otherAnimalContainer').style.display = 'none';

                    // Ocultar otros campos si es necesario
                    const otherAbuseDescription = document.getElementById('otherAbuseDescription');
                    if (otherAbuseDescription) {
                        otherAbuseDescription.style.display = 'none';
                    }
                }
            });
        });

        // Cerrar modal
        modalCloseBtn.addEventListener('click', function () {
            confirmationModal.style.display = 'none';
        });

        document.querySelector('.close-modal').addEventListener('click', function () {
            confirmationModal.style.display = 'none';
        });

        window.addEventListener('click', function (e) {
            if (e.target === confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });

        // Botón de reporte urgente
        const urgentReportBtn = document.getElementById('urgentReport');

        urgentReportBtn.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que este es un caso de maltrato animal urgente que requiere atención inmediata?')) {
                // Aquí podrías agregar lógica adicional para reportes urgentes
                alert('Hemos marcado tu reporte como URGENTE. Las autoridades correspondientes serán notificadas.');
            }
        });
    });
});    