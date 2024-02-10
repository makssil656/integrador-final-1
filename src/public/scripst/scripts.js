const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const content = document.getElementById("content");

// Login
$(document).ready(function() {
  $('.login-container [data-toggle="flip"]').click(function() {
    $('.login-box').toggleClass('flipped');
    return false;
  });
});



// Sidebar
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('closed');

    if (window.matchMedia("(max-width: 768px)").matches) {
      // Vista de celular
      if ($('#sidebar').hasClass('closed')) {
        // Cuando #sidebar está cerrado en vista de celular
        $('#contenido').css('margin-left', '0px');
      } else {
        // Cuando #sidebar está activeo en vista de celular
        $('#contenido').css('margin-left', '120px');
      }
    } else {
      // Vista de escritorio
      if ($('#sidebar').hasClass('closed')) {
        // Cuando #sidebar está cerrado en vista de escritorio
        $('#contenido').css('margin-left', '0px');
      } else {
        // Cuando #sidebar está activeo en vista de escritorio
        $('#contenido').css('margin-left', '250px');
      }
    }
  });
});

$(document).ready(function () {
  $('#sidebarCollapse').hover(
    function () {
      // Cuando el ratón entra, añade la clase 'expand' para activear la animación
      $(this).find('.navbar-toggler-icon').addClass('expand');
    },
    function () {
      // Cuando el ratón sale, quita la clase 'expand' para detener la animación
      $(this).find('.navbar-toggler-icon').removeClass('expand');
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtener todos los elementos que tienen submenús
    var toggles = document.querySelectorAll('[data-toggle="collapse"]');
    
    // Iterar sobre los elementos y agregar un evento de clic
    toggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            // Cerrar todos los submenús excepto el actual
            toggles.forEach(function (otherToggle) {
                if (otherToggle !== toggle) {
                    var target = document.querySelector(otherToggle.getAttribute("href"));
                    if (target.classList.contains("show")) {
                        otherToggle.click(); // Cerrar el submenú
                    }
                }
            });
          // Alternar la clase para rotar el ícono y mostrar/ocultar el menú
          toggle.classList.toggle('open');
        });
    });
});


$(document).ready(function() {
  // Remover la clase 'active' de todos los elementos al cargar la página
  $('.list-unstyled li').removeClass('active');
  $('.list-unstyled ul li').removeClass('active');

  // Agregar la clase 'active' a la opción correspondiente
  let path = window.location.pathname;
  // Utilizar un switch para manejar diferentes rutas
  switch (path) {
    case '/':
      $('.list-unstyled li:has(a[href="/"])').addClass('active');
      break;
    case '/pacientes/listar':
      $('#pacientes').addClass('active')
      $('.list-unstyled ul li:has(a[href="/pacientes/listar"])').addClass('active');
      break;
    case '/pacientes/Agregar':
      $('#pacientes').addClass('active')
      $('.list-unstyled ul li:has(a[href="/pacientes/Agregar"])').addClass('active');
      break;
    case '/horarios/listar':
      $('#horarios').addClass('active')
      $('.list-unstyled ul li:has(a[href="/horarios/listar"])').addClass('active');
      break;
    case '/horarios/agregar':
      $('#horarios').addClass('active')
      $('.list-unstyled ul li:has(a[href="/horarios/agregar"])').addClass('active');
      break;
    case '/citas/listar':
      $('#citas').addClass('active')
      $('.list-unstyled ul li:has(a[href="/citas/listar"])').addClass('active');
      break;
    case '/citas/agregar':
      $('#citas').addClass('active')
      $('.list-unstyled ul li:has(a[href="/citas/agregar"])').addClass('active');
      break;
    case '/historias/listar':
      $('#historias').addClass('active')
      $('.list-unstyled ul li:has(a[href="/historias/listar"])').addClass('active');
      break;
    case '/cuenta':
      $('.list-unstyled li:has(a[href="/cuenta"])').addClass('active');
      break;
    case '/ayuda':
      $('.list-unstyled li:has(a[href="/ayuda"])').addClass('active');
      break;
  }
  // Repite este bloque para otras rutas

  // Puedes personalizar el color de fondo aquí
  $('.active').css('background-color', '#3aa0c2');
})



$(document).ready(function () {
  $("#myModal").modal("show");
});

$(document).ready(function () {
  $("#confirmDeleteModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var nombreCompleto = button.data("nombre");
    var modal = $(this);
    modal
      .find(".modal-body p")
      .text("¿Estás seguro de que deseas eliminar a " + nombreCompleto + "?");

    var form = modal.find("form");
    form.attr(
      "action",
      "/pacientes/Eliminar/" + button.data("id") + "?_method=DELETE"
    );
  });
});

$(document).ready(function () {
  $("#myModal").modal("show");
});

$(document).ready(function () {
  $("#confirmDeleteModalHistoria").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var nombreCompleto = button.data("nombre");
    var modal = $(this);
    modal
      .find(".modal-body p")
      .text("¿Estás seguro de que deseas eliminar a " + nombreCompleto + "?");

    var form = modal.find("form");
    form.attr(
      "action",
      "/historias/Eliminar/" + button.data("id") + "?_method=DELETE"
    );
  });
});

const submenu = document.querySelector("show.collapse");

$(document).ready(function () {
  // Cuando se hace clic en un elemento con un submenú
  $('[data-bs-toggle="collapse"]').click(function () {
    // Cerrar todos los submenús abiertos
    $(".collapse.show").collapse("hide");
  });
});

$(document).ready(function () {
  $("#tabla1").DataTable({
    language: {
      sProcessing: "Procesando...",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "No se encontraron resultados",
      sEmptyTable: "Ningún dato disponible en esta tabla",
      sInfo:
        "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Buscar:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending:
          ": Activear para ordenar la columna de manera ascendente",
        sSortDescending:
          ": Activear para ordenar la columna de manera descendente",
      },
    },
     
  });
});

// $(document).ready(function () {
//   $("#tabla2").DataTable({
//     language: {
//       sProcessing: "Procesando...",
//       sLengthMenu: "Mostrar _MENU_ registros",
//       sZeroRecords: "No se encontraron resultados",
//       sEmptyTable: "Ningún dato disponible en esta tabla",
//       sInfo:
//         "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
//       sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
//       sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
//       sInfoPostFix: "",
//       sSearch: "Buscar:",
//       sUrl: "",
//       sInfoThousands: ",",
//       sLoadingRecords: "Cargando...",
//       oPaginate: {
//         sFirst: "Primero",
//         sLast: "Último",
//         sNext: "Siguiente",
//         sPrevious: "Anterior",
//       },
//       oAria: {
//         sSortAscending:
//           ": Activear para ordenar la columna de manera ascendente",
//         sSortDescending:
//           ": Activear para ordenar la columna de manera descendente",
//       },
//     },
//   });
// });

const currentDate = new Date();

// Set the time part of the date to midnight
currentDate.setHours(0, 0, 0, 0);

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendario");
  var calendar;

  function cargarCalendario(events) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "es",
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,today,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
      events: events,
      eventClick: function (info) {
        console.log(info.event.extendedProps.citaId);
        // Redireccionar a otra página con la información de la cita
        window.location.href = '/citas/detalle/' + info.event.extendedProps.citaId;
      },
    });

    calendar.render();
  }
// Definir la función filtrarCitas en el ámbito global
window.filtrarCitas = function(estado) {
  fetch('/citas/events/' + estado)
    .then(response => response.json())
    .then(events => {
      calendar.destroy(); // Destruye el calendario actual
      cargarCalendario(events); // Carga el calendario con nuevos eventos filtrados
    })
    .catch(error => console.error('Error fetching filtered events:', error));
}

window.mostrarTodasCitas = function() {
    fetch('/citas/events')
      .then(response => response.json())
      .then(events => {
        calendar.destroy(); // Destruye el calendario actual
        cargarCalendario(events); // Carga el calendario con todos los eventos
      })
      .catch(error => console.error('Error fetching all events:', error));
  }

  // Cargar todas las citas al inicio
  fetch('/citas/events')
    .then(response => response.json())
    .then(events => cargarCalendario(events))
    .catch(error => console.error('Error fetching all events:', error.message));
});


document.getElementById("formularioCitas").addEventListener("submit", function(event) {
  var dniInput = document.getElementById("dniInput").value;
  var fechaCita = document.getElementById("fechaCita").value;
  var motivo = document.getElementById("motivo").value;

  if (!dniInput || !fechaCita || !motivo) {
    alert("Por favor, complete los campos obligatorios: DNI, Fecha de Cita y Motivo.");
    event.preventDefault(); // Evita que se envíe el formulario si faltan campos.
  }
});