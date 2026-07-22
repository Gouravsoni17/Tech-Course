const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = {
        name: form.name.value,
        email: form.email.value,
        mobile: form.mobile.value,
        message: form.message.value
    };

    try {

        Swal.fire({
            title: "Sending...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        Swal.close();

        if (data.success) {

            Swal.fire({
                icon: "success",
                title: "Success",
                text: data.message
            });

            form.reset();

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