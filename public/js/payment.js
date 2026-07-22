const form = document.getElementById("paymentForm");
const photo = document.getElementById("photo");
const preview = document.getElementById("preview");

// Image Preview
photo.addEventListener("change", () => {

    const file = photo.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        Swal.fire({
            icon: "error",
            title: "Invalid File",
            text: "Please select an image file."
        });

        photo.value = "";
        preview.style.display = "none";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {

        Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Maximum file size is 5 MB."
        });

        photo.value = "";
        preview.style.display = "none";
        return;
    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

});

// Submit Form
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    try {

        Swal.fire({
            title: "Submitting...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("/payment-verification", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        Swal.close();

        if (data.success) {

            Swal.fire({
                icon: "success",
                title: "Request Submitted",
                text: data.message
            });

            form.reset();
            preview.style.display = "none";

        } else {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message
            });

        }

    } catch (err) {

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: err.message
        });

    }

});