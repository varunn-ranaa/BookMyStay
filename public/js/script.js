// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()


//Toast notification

  document.addEventListener("DOMContentLoaded", function () {
    
    const successToast = document.getElementById("successToast");
    const errorToast = document.getElementById("errorToast");

    if (successToast) {
      const toast = new bootstrap.Toast(successToast, {
        delay: 3000   // ⏱️ 5 sec
      });
      toast.show();
    }

    if (errorToast) {
      const toast = new bootstrap.Toast(errorToast, {
        delay: 3000
      });
      toast.show();
    }

  });
