/* ============================================================
   CROWN STONE HOTEL
   HOTEL MANAGEMENT SYSTEM
   FINAL JAVASCRIPT
   ============================================================ */


/* ============================================================
   ROOM DATA
   ============================================================ */

const roomData = {

    "Single Bedroom": {
        price: 75,
        capacity: 1,
        rating: 4,
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80"
        ]
    },

    "Twin Bedroom": {
        price: 120,
        capacity: 2,
        rating: 5,
        images: [
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1587985064135-0366536eab42?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80"
        ]
    },

    "Deluxe Room": {
        price: 160,
        capacity: 3,
        rating: 5,
        images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80"
        ]
    },

    "Executive Suite": {
        price: 220,
        capacity: 4,
        rating: 5,
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
        ]
    }
};


/* ============================================================
   GLOBAL VARIABLES
   ============================================================ */

let selectedRoom = "Single Bedroom";
let selectedPrice = 75;

let currentUser = null;
let currentBooking = null;

let pendingRoom = null;
let selectedPaymentMethod = "Net Banking";


/* ============================================================
   PAGE NAVIGATION
   ============================================================ */

function showPage(pageName) {

    const page = document.getElementById(pageName);

    if (!page) {
        console.error("Page not found:", pageName);
        return;
    }

    document.querySelectorAll(".page").forEach(function(section) {
        section.classList.add("hidden");
    });

    page.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateHeader();
}


/* ============================================================
   HEADER NAVIGATION
   ============================================================ */

function setupNavigation() {

    const links = document.querySelectorAll(".header nav a");

    links.forEach(function(link) {

        link.addEventListener("click", function(event) {

            event.preventDefault();

            const page = this.innerText
                .trim()
                .toLowerCase();

            if (page === "home") {

                showPage("home");

            } else if (page === "rooms") {

                showPage("home");

            } else if (page === "booking") {

                if (!currentUser) {

                    alert("Please login as a guest before booking.");

                    pendingRoom = selectedRoom;

                    showPage("login");

                } else {

                    showPage("booking");
                }

            } else if (page === "admin") {

                if (
                    currentUser &&
                    currentUser.role === "admin"
                ) {

                    showPage("admin");

                } else {

                    alert("Please login as administrator.");

                    showPage("login");
                }
            }
        });
    });
}


/* ============================================================
   HEADER STATE
   ============================================================ */

function updateHeader() {

    const adminLink =
        document.querySelector(
            '.header nav a[href="#"]'
        );

    /* Navigation remains visible.
       Access is checked when clicked. */
}


/* ============================================================
   LOGIN ROLE SELECTION
   ============================================================ */

function setupRoleButtons() {

    const roleButtons =
        document.querySelectorAll(".role");

    roleButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            roleButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            const loginTitle =
                document.querySelector(".login-box h2");

            const smallText =
                document.querySelector(".login-box .small-text");

            if (this.innerText.trim() === "Admin") {

                loginTitle.innerText = "Admin Login";

                smallText.innerText =
                    "Login with administrator credentials";

            } else {

                loginTitle.innerText = "Guest Login";

                smallText.innerText =
                    "Select your role to continue";
            }
        });
    });
}


/* ============================================================
   LOGIN
   ============================================================ */

function setupLogin() {

    const loginButton =
        document.querySelector("#login .main-button");

    if (!loginButton) return;

    loginButton.addEventListener("click", function(event) {

        event.preventDefault();

        const inputs =
            document.querySelectorAll(
                "#login .login-box input"
            );

        const username =
            inputs[0].value.trim();

        const password =
            inputs[1].value;

        const activeRole =
            document.querySelector(".role.active");

        const role =
            activeRole
                ? activeRole.innerText.trim()
                : "Guest";


        if (!username || !password) {

            alert("Please enter username and password.");

            return;
        }


        /* ================= ADMIN ================= */

        if (role === "Admin") {

            if (
                username === "admin" &&
                password === "admin123"
            ) {

                currentUser = {
                    username: username,
                    role: "admin"
                };

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                alert("Admin login successful.");

                showPage("admin");

            } else {

                alert(
                    "Invalid admin credentials.\n\n" +
                    "Demo login:\n" +
                    "Username: admin\n" +
                    "Password: admin123"
                );
            }

            return;
        }


        /* ================= GUEST ================= */

        const users =
            JSON.parse(
                localStorage.getItem("hotelUsers")
            ) || [];


        const registeredUser =
            users.find(function(user) {

                return (
                    user.username === username &&
                    user.password === password
                );
            });


        /*
           Existing registered user is accepted.
           For the college/demo version, any
           non-empty guest login is also accepted.
        */

        if (
            registeredUser ||
            username.length >= 3
        ) {

            currentUser = {

                username: username,

                name:
                    registeredUser
                        ? registeredUser.name
                        : username,

                role: "guest"
            };


            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );


            alert("Guest login successful.");


            if (pendingRoom) {

                selectedRoom =
                    pendingRoom;

                selectedPrice =
                    roomData[
                        selectedRoom
                    ].price;

                pendingRoom = null;

                updateBookingForm();

                showPage("booking");

            } else {

                showPage("home");
            }

        } else {

            alert("Invalid username or password.");
        }
    });
}


/* ============================================================
   REGISTRATION
   ============================================================ */

function setupRegistration() {

    const registerLink =
        document.querySelector(
            ".register-text a"
        );

    if (!registerLink) return;

    registerLink.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            showRegistrationForm();
        }
    );
}


function showRegistrationForm() {

    if (
        document.getElementById(
            "registrationModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");


    modal.id =
        "registrationModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.65);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
        padding:20px;
    `;


    modal.innerHTML = `

        <div style="
            background:white;
            width:420px;
            max-width:100%;
            padding:30px;
            border-radius:14px;
            box-shadow:0 15px 40px rgba(0,0,0,.25);
        ">

            <h2>Create Guest Account</h2>

            <p style="
                color:#687477;
                margin:8px 0 20px;
            ">
                Register to continue with your booking.
            </p>

            <label>Full Name</label>

            <input
                id="registerName"
                type="text"
                placeholder="Enter full name"
            >

            <label>Username</label>

            <input
                id="registerUsername"
                type="text"
                placeholder="Create username"
            >

            <label>Password</label>

            <input
                id="registerPassword"
                type="password"
                placeholder="Create password"
            >

            <label>Confirm Password</label>

            <input
                id="registerConfirm"
                type="password"
                placeholder="Confirm password"
            >

            <button
                id="registerButton"
                class="main-button"
            >
                REGISTER
            </button>

            <button
                id="closeRegister"
                class="secondary-button"
                style="margin-top:10px;"
            >
                CANCEL
            </button>

        </div>
    `;


    document.body.appendChild(modal);


    document
        .getElementById("closeRegister")
        .addEventListener(
            "click",
            function() {

                modal.remove();
            }
        );


    document
        .getElementById("registerButton")
        .addEventListener(
            "click",
            function() {

                const name =
                    document
                        .getElementById(
                            "registerName"
                        )
                        .value
                        .trim();


                const username =
                    document
                        .getElementById(
                            "registerUsername"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "registerPassword"
                        )
                        .value;


                const confirmPassword =
                    document
                        .getElementById(
                            "registerConfirm"
                        )
                        .value;


                if (
                    !name ||
                    !username ||
                    !password ||
                    !confirmPassword
                ) {

                    alert(
                        "Please complete all fields."
                    );

                    return;
                }


                if (
                    password.length < 6
                ) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Passwords do not match."
                    );

                    return;
                }


                let users =
                    JSON.parse(
                        localStorage.getItem(
                            "hotelUsers"
                        )
                    ) || [];


                const exists =
                    users.some(
                        function(user) {

                            return (
                                user.username
                                    .toLowerCase() ===
                                username.toLowerCase()
                            );
                        }
                    );


                if (exists) {

                    alert(
                        "This username already exists."
                    );

                    return;
                }


                users.push({

                    name: name,

                    username: username,

                    password: password
                });


                localStorage.setItem(
                    "hotelUsers",
                    JSON.stringify(users)
                );


                currentUser = {

                    name: name,

                    username: username,

                    role: "guest"
                };


                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );


                modal.remove();


                alert(
                    "Registration successful!"
                );


                if (pendingRoom) {

                    selectedRoom =
                        pendingRoom;

                    selectedPrice =
                        roomData[
                            selectedRoom
                        ].price;

                    pendingRoom = null;

                    updateBookingForm();

                    showPage("booking");

                } else {

                    showPage("home");
                }
            }
        );
}


/* ============================================================
   FORGOT PASSWORD
   ============================================================ */

function setupForgotPassword() {

    const forgot =
        document.querySelector(".forgot");

    if (!forgot) return;

    forgot.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            alert(
                "For this demo system, please contact the hotel administrator to reset your password."
            );
        }
    );
}


/* ============================================================
   ROOM SELECTION
   ============================================================ */

function selectRoom(room, price) {

    selectedRoom = room;

    selectedPrice = price;


    /*
       Requirement:
       Guest can explore rooms freely,
       but must login/register before booking.
    */

    if (!currentUser) {

        pendingRoom = room;

        alert(
            "Please login or register before booking this room."
        );

        showPage("login");

        return;
    }


    selectedPrice =
        roomData[room]
            ? roomData[room].price
            : price;


    updateBookingForm();

    showPage("booking");
}


/* ============================================================
   UPDATE BOOKING FORM
   ============================================================ */

function updateBookingForm() {

    const roomSelect =
        document.getElementById(
            "roomType"
        );

    if (!roomSelect) return;


    roomSelect.value =
        selectedRoom;


    const summary =
        document.getElementById(
            "summaryRoom"
        );


    if (summary) {

        summary.innerText =
            selectedRoom;
    }


    const roomImage =
        document.querySelector(
            ".booking-summary img"
        );


    if (
        roomImage &&
        roomData[selectedRoom]
    ) {

        roomImage.src =
            roomData[selectedRoom]
                .images[0];
    }


    calculateBooking();
}


/* ============================================================
   BOOKING FORM SETUP
   ============================================================ */

function setupBookingForm() {

    const bookingForm =
        document.querySelector(
            ".booking-form"
        );

    if (!bookingForm) return;


    const roomSelect =
        document.getElementById(
            "roomType"
        );


    const selects =
        bookingForm.querySelectorAll(
            "select"
        );


    const dateInputs =
        bookingForm.querySelectorAll(
            'input[type="date"]'
        );


    const timeInputs =
        bookingForm.querySelectorAll(
            'input[type="time"]'
        );


    /* ROOM CHANGE */

    if (roomSelect) {

        roomSelect.addEventListener(
            "change",
            function() {

                selectedRoom =
                    this.value;

                selectedPrice =
                    roomData[
                        selectedRoom
                    ].price;

                updateBookingForm();
            }
        );
    }


    /* NUMBER OF ROOMS */

    if (selects[1]) {

        selects[1].addEventListener(
            "change",
            calculateBooking
        );
    }


    /* NUMBER OF GUESTS */

    if (selects[2]) {

        selects[2].addEventListener(
            "change",
            validateGuestCapacity
        );
    }


    dateInputs.forEach(
        function(input) {

            input.addEventListener(
                "change",
                calculateBooking
            );
        }
    );


    timeInputs.forEach(
        function(input) {

            input.addEventListener(
                "change",
                calculateBooking
            );
        }
    );


    const continueButton =
        bookingForm.querySelector(
            ".main-button"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                processBooking();
            }
        );
    }


    setMinimumDates();

    validateGuestCapacity();
}


/* ============================================================
   DATE RESTRICTION
   ============================================================ */

function setMinimumDates() {

    const today =
        new Date();

    const yyyy =
        today.getFullYear();

    const mm =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const dd =
        String(
            today.getDate()
        ).padStart(2, "0");


    const todayString =
        `${yyyy}-${mm}-${dd}`;


    const dates =
        document.querySelectorAll(
            '#booking input[type="date"]'
        );


    dates.forEach(
        function(input) {

            input.min =
                todayString;

        }
    );
}


/* ============================================================
   GUEST CAPACITY
   ============================================================ */

function validateGuestCapacity() {

    const bookingForm =
        document.querySelector(
            ".booking-form"
        );

    if (!bookingForm) return;


    const selects =
        bookingForm.querySelectorAll(
            "select"
        );


    const guestSelect =
        selects[2];


    if (!guestSelect) return;


    const capacity =
        roomData[
            selectedRoom
        ].capacity;


    Array.from(
        guestSelect.options
    ).forEach(
        function(option) {

            const number =
                parseInt(
                    option.value
                );


            option.disabled =
                number > capacity;
        }
    );


    const selectedGuests =
        parseInt(
            guestSelect.value
        );


    if (
        selectedGuests >
        capacity
    ) {

        guestSelect.value =
            "1 Guest";
    }
}


/* ============================================================
   BOOKING CALCULATION
   ============================================================ */

function calculateBooking() {

    const bookingForm =
        document.querySelector(
            ".booking-form"
        );

    if (!bookingForm) return;


    const selects =
        bookingForm.querySelectorAll(
            "select"
        );


    const dateInputs =
        bookingForm.querySelectorAll(
            'input[type="date"]'
        );


    const timeInputs =
        bookingForm.querySelectorAll(
            'input[type="time"]'
        );


    const roomType =
        selects[0]
            ? selects[0].value
            : selectedRoom;


    const numberOfRooms =
        selects[1]
            ? parseInt(selects[1].value) || 1
            : 1;


    const checkInDate =
        dateInputs[0]
            ? dateInputs[0].value
            : "";


    const checkOutDate =
        dateInputs[1]
            ? dateInputs[1].value
            : "";


    let nights = 1;


    if (
        checkInDate &&
        checkOutDate
    ) {

        const start =
            new Date(
                checkInDate
            );

        const end =
            new Date(
                checkOutDate
            );


        const difference =
            end - start;


        nights =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        if (nights < 1) {

            nights = 1;
        }
    }


    const price =
        roomData[
            roomType
        ]
        ? roomData[roomType].price
        : selectedPrice;


    const roomTotal =
        price *
        nights *
        numberOfRooms;


    const tax =
        roomTotal * 0.10;


    const total =
        roomTotal + tax;


    const summaryRoom =
        document.getElementById(
            "summaryRoom"
        );


    const summaryPrice =
        document.getElementById(
            "summaryPrice"
        );


    const summaryTax =
        document.getElementById(
            "summaryTax"
        );


    const summaryTotal =
        document.getElementById(
            "summaryTotal"
        );


    if (summaryRoom) {

        summaryRoom.innerText =
            roomType;
    }


    if (summaryPrice) {

        summaryPrice.innerText =
            "$" +
            roomTotal.toFixed(2);
    }


    if (summaryTax) {

        summaryTax.innerText =
            "$" +
            tax.toFixed(2);
    }


    if (summaryTotal) {

        summaryTotal.innerText =
            "$" +
            total.toFixed(2);
    }


    const stayText =
        document.querySelector(
            ".booking-summary .summary-row strong"
        );


    if (stayText) {

        stayText.innerText =
            nights +
            (nights === 1
                ? " night"
                : " nights");
    }


    return {

        roomType,
        numberOfRooms,
        checkInDate,
        checkOutDate,
        nights,
        roomTotal,
        tax,
        total
    };
}


/* ============================================================
   PROCESS BOOKING
   ============================================================ */

function processBooking() {

    if (!currentUser) {

        pendingRoom =
            selectedRoom;

        alert(
            "Please login or register before booking."
        );

        showPage("login");

        return;
    }


    const bookingForm =
        document.querySelector(
            ".booking-form"
        );


    const inputs =
        bookingForm.querySelectorAll(
            "input"
        );


    const selects =
        bookingForm.querySelectorAll(
            "select"
        );


    const checkInDate =
        inputs[0].value;


    const checkInTime =
        inputs[1].value;


    const checkOutDate =
        inputs[2].value;


    const checkOutTime =
        inputs[3].value;


    const guestName =
        inputs[4].value.trim();


    const age =
        parseInt(
            inputs[5].value
        );


    const idProofNumber =
        inputs[6].value.trim();


    const roomType =
        selects[0].value;


    const numberOfRooms =
        parseInt(
            selects[1].value
        );


    const guests =
        parseInt(
            selects[2].value
        );


    const idProofType =
        selects[3].value;


    /* ================= VALIDATION ================= */

    if (
        !checkInDate ||
        !checkInTime ||
        !checkOutDate ||
        !checkOutTime
    ) {

        alert(
            "Please select check-in and check-out date and time."
        );

        return;
    }


    const checkIn =
        new Date(
            checkInDate +
            "T" +
            checkInTime
        );


    const checkOut =
        new Date(
            checkOutDate +
            "T" +
            checkOutTime
        );


    const now =
        new Date();


    if (checkIn < now) {

        alert(
            "Check-in cannot be in the past."
        );

        return;
    }


    if (checkOut <= checkIn) {

        alert(
            "Check-out must be after check-in."
        );

        return;
    }


    if (!guestName) {

        alert(
            "Please enter guest name."
        );

        return;
    }


    if (
        isNaN(age) ||
        age < 1 ||
        age > 120
    ) {

        alert(
            "Please enter a valid age."
        );

        return;
    }


    if (!idProofNumber) {

        alert(
            "Please enter ID proof number."
        );

        return;
    }


    const capacity =
        roomData[
            roomType
        ].capacity;


    if (guests > capacity) {

        alert(
            roomType +
            " allows maximum " +
            capacity +
            " guest(s)."
        );

        return;
    }


    /* ================= CALCULATE ================= */

    const difference =
        checkOut - checkIn;


    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const price =
        roomData[
            roomType
        ].price;


    const roomTotal =
        price *
        nights *
        numberOfRooms;


    const tax =
        roomTotal * 0.10;


    const total =
        roomTotal + tax;


    /* ================= CREATE BOOKING ================= */

    currentBooking = {

        bookingId:
            generateBookingId(),

        username:
            currentUser.username,

        guestName:
            guestName,

        age:
            age,

        idProofType:
            idProofType,

        idProofNumber:
            idProofNumber,

        roomType:
            roomType,

        numberOfRooms:
            numberOfRooms,

        guests:
            guests,

        checkInDate:
            checkInDate,

        checkInTime:
            checkInTime,

        checkOutDate:
            checkOutDate,

        checkOutTime:
            checkOutTime,

        nights:
            nights,

        roomPricePerNight:
            price,

        roomTotal:
            roomTotal,

        tax:
            tax,

        total:
            total,

        paymentMethod:
            null,

        paymentStatus:
            "Pending",

        bookingStatus:
            "Pending",

        createdAt:
            new Date().toISOString()
    };


    saveBooking();


    updatePaymentPage();


    showPage("payment");
}


/* ============================================================
   BOOKING ID
   ============================================================ */

function generateBookingId() {

    return (
        "CSH-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );
}


/* ============================================================
   PAYMENT PAGE
   ============================================================ */

function updatePaymentPage() {

    if (!currentBooking) return;


    const paymentAmount =
        document.getElementById(
            "paymentAmount"
        );


    const paymentRoom =
        document.getElementById(
            "paymentRoom"
        );


    const paymentTotal =
        document.getElementById(
            "paymentSummaryTotal"
        );


    if (paymentAmount) {

        paymentAmount.innerText =
            "$" +
            currentBooking.total.toFixed(2);
    }


    if (paymentRoom) {

        paymentRoom.innerText =
            currentBooking.roomType;
    }


    if (paymentTotal) {

        paymentTotal.innerText =
            "$" +
            currentBooking.total.toFixed(2);
    }


    const summary =
        document.querySelector(
            "#payment .booking-summary"
        );


    if (!summary) return;


    const rows =
        summary.querySelectorAll(
            ".summary-row"
        );


    if (rows[0]) {

        rows[0].querySelector(
            "strong"
        ).innerText =
            currentBooking.guestName;
    }


    if (rows[2]) {

        rows[2].querySelector(
            "strong"
        ).innerText =
            formatDate(
                currentBooking.checkInDate
            ) +
            " · " +
            formatTime(
                currentBooking.checkInTime
            );
    }


    if (rows[3]) {

        rows[3].querySelector(
            "strong"
        ).innerText =
            formatDate(
                currentBooking.checkOutDate
            ) +
            " · " +
            formatTime(
                currentBooking.checkOutTime
            );
    }
}


/* ============================================================
   PAYMENT METHOD
   ============================================================ */

function setupPaymentMethods() {

    const options =
        document.querySelectorAll(
            ".payment-option"
        );


    options.forEach(
        function(option) {

            option.addEventListener(
                "click",
                function() {

                    const radio =
                        this.querySelector(
                            "input"
                        );


                    if (radio) {

                        radio.checked =
                            true;
                    }


                    selectedPaymentMethod =
                        this.innerText
                            .trim();
                }
            );
        }
    );
}


/* ============================================================
   PAYMENT PROCESSING
   ============================================================ */

function setupPayment() {

    const paymentBox =
        document.querySelector(
            ".payment-box"
        );


    if (!paymentBox) return;


    const button =
        paymentBox.querySelector(
            ".main-button"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            if (!currentBooking) {

                alert(
                    "No booking found."
                );

                showPage("booking");

                return;
            }


            const selectedRadio =
                document.querySelector(
                    '.payment-option input[name="payment"]:checked'
                );


            if (!selectedRadio) {

                alert(
                    "Please select a payment method."
                );

                return;
            }


            const paymentDetails =
                paymentBox.querySelector(
                    'input[type="text"]'
                );


            if (
                !paymentDetails ||
                !paymentDetails.value.trim()
            ) {

                alert(
                    "Please enter payment details."
                );

                return;
            }


            const option =
                selectedRadio.closest(
                    ".payment-option"
                );


            selectedPaymentMethod =
                option
                    ? option.innerText.trim()
                    : "Net Banking";


            currentBooking.paymentMethod =
                selectedPaymentMethod;


            currentBooking.paymentStatus =
                "Paid";


            currentBooking.bookingStatus =
                "Confirmed";


            currentBooking.paymentReference =
                "PAY-" +
                Date.now();


            saveBooking();


            updateConfirmationPage();


            showPage("confirmation");


            alert(
                "Payment successful!\n\n" +
                "Booking ID: " +
                currentBooking.bookingId
            );
        }
    );
}


/* ============================================================
   CONFIRMATION PAGE
   ============================================================ */

function updateConfirmationPage() {

    if (!currentBooking) return;


    const booking =
        currentBooking;


    const confirmationRoom =
        document.getElementById(
            "confirmationRoom"
        );


    const confirmationAmount =
        document.getElementById(
            "confirmationAmount"
        );


    if (confirmationRoom) {

        confirmationRoom.innerText =
            booking.roomType;
    }


    if (confirmationAmount) {

        confirmationAmount.innerText =
            "$" +
            booking.total.toFixed(2);
    }


    const grid =
        document.querySelector(
            ".confirmation-grid"
        );


    if (!grid) return;


    const cells =
        grid.querySelectorAll(
            "div"
        );


    if (cells[0]) {

        cells[0].querySelector(
            "strong"
        ).innerText =
            booking.guestName;
    }


    if (cells[2]) {

        cells[2].querySelector(
            "strong"
        ).innerText =
            "$" +
            booking.total.toFixed(2);
    }


    if (cells[3]) {

        cells[3].querySelector(
            "strong"
        ).innerText =
            booking.bookingStatus;
    }


    if (cells[4]) {

        cells[4].querySelector(
            "strong"
        ).innerText =
            formatDate(
                booking.checkInDate
            ) +
            " · " +
            formatTime(
                booking.checkInTime
            );
    }


    if (cells[5]) {

        cells[5].querySelector(
            "strong"
        ).innerText =
            formatDate(
                booking.checkOutDate
            ) +
            " · " +
            formatTime(
                booking.checkOutTime
            );
    }


    if (cells[6]) {

        cells[6].querySelector(
            "strong"
        ).innerText =
            booking.guests;
    }


    if (cells[7]) {

        cells[7].querySelector(
            "strong"
        ).innerText =
            booking.paymentStatus;
    }


    let bookingIdBox =
        document.getElementById(
            "bookingIdDisplay"
        );


    if (!bookingIdBox) {

        bookingIdBox =
            document.createElement(
                "div"
            );

        bookingIdBox.id =
            "bookingIdDisplay";

        bookingIdBox.style.cssText = `
            margin:20px 0;
            padding:15px;
            background:#f3f7f7;
            border-radius:8px;
            text-align:center;
        `;

        grid.parentNode.insertBefore(
            bookingIdBox,
            grid
        );
    }


    bookingIdBox.innerHTML = `
        <small>Booking ID</small>
        <br>
        <strong style="font-size:18px;">
            ${booking.bookingId}
        </strong>
    `;


    updateCancellationButton();
}


/* ============================================================
   CANCELLATION
   ============================================================ */

function updateCancellationButton() {

    const note =
        document.querySelector(
            ".cancel-note"
        );


    if (!note) return;


    let button =
        document.getElementById(
            "cancelBookingButton"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );

        button.id =
            "cancelBookingButton";

        button.innerText =
            "CANCEL BOOKING";


        button.style.cssText = `
            width:100%;
            padding:13px;
            margin-top:10px;
            border:none;
            border-radius:5px;
            background:#ffe0e0;
            color:#8d3333;
            font-weight:bold;
            cursor:pointer;
        `;


        button.addEventListener(
            "click",
            cancelBooking
        );


        note.parentNode.insertBefore(
            button,
            note
        );
    }


    if (
        currentBooking &&
        currentBooking.bookingStatus ===
        "Cancelled"
    ) {

        button.disabled = true;

        button.innerText =
            "BOOKING CANCELLED";

    } else {

        button.disabled = false;

        button.innerText =
            "CANCEL BOOKING";
    }
}


function cancelBooking() {

    if (!currentBooking) {

        alert(
            "No active booking found."
        );

        return;
    }


    const checkIn =
        new Date(
            currentBooking.checkInDate +
            "T" +
            currentBooking.checkInTime
        );


    if (new Date() >= checkIn) {

        alert(
            "Booking cannot be cancelled after check-in."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to cancel booking " +
            currentBooking.bookingId +
            "?"
        );


    if (!confirmation) return;


    currentBooking.bookingStatus =
        "Cancelled";


    saveBooking();


    updateConfirmationPage();


    alert(
        "Your booking has been cancelled successfully."
    );
}


/* ============================================================
   ROOM IMAGE SLIDESHOW
   ============================================================ */

function setupRoomSlideshows() {

    const cards =
        document.querySelectorAll(
            ".room-card"
        );


    cards.forEach(
        function(card) {

            const title =
                card.querySelector(
                    "h2"
                );


            const image =
                card.querySelector(
                    ".room-image img"
                );


            if (!title || !image)
                return;


            const room =
                title.innerText.trim();


            if (
                !roomData[room]
            )
                return;


            let index = 0;


            setInterval(
                function() {

                    index++;

                    if (
                        index >=
                        roomData[room]
                            .images.length
                    ) {

                        index = 0;
                    }


                    image.src =
                        roomData[room]
                            .images[index];

                },
                3500
            );
        }
    );
}


/* ============================================================
   ROOM SEARCH
   ============================================================ */

function setupRoomSearch() {

    const search =
        document.querySelector(
            ".search-box input"
        );


    const button =
        document.querySelector(
            ".search-button"
        );


    if (!search || !button)
        return;


    function performSearch() {

        const query =
            search.value
                .trim()
                .toLowerCase();


        const cards =
            document.querySelectorAll(
                ".room-card"
            );


        cards.forEach(
            function(card) {

                const title =
                    card.querySelector(
                        "h2"
                    );


                if (!title)
                    return;


                const roomName =
                    title.innerText
                        .toLowerCase();


                if (
                    query === "" ||
                    roomName.includes(query)
                ) {

                    card.style.display =
                        "";

                } else {

                    card.style.display =
                        "none";
                }
            }
        );
    }


    button.addEventListener(
        "click",
        performSearch
    );


    search.addEventListener(
        "keyup",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                performSearch();
            }
        }
    );
}


/* ============================================================
   ADMIN ROOM MANAGEMENT
   ============================================================ */

const defaultRoomStatus = {

    "101": "Available",
    "102": "Occupied",
    "201": "Available",
    "301": "Cleaning"
};


function getRoomStatus() {

    return (
        JSON.parse(
            localStorage.getItem(
                "roomStatus"
            )
        ) ||
        { ...defaultRoomStatus }
    );
}


function saveRoomStatus(status) {

    localStorage.setItem(
        "roomStatus",
        JSON.stringify(status)
    );
}


function setupAdmin() {

    const table =
        document.querySelector(
            "#admin table"
        );


    if (!table) return;


    updateAdminTable();


    const buttons =
        table.querySelectorAll(
            ".small-button"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const row =
                        this.closest("tr");


                    if (!row)
                        return;


                    const roomNumber =
                        row.children[0]
                            .innerText
                            .trim();


                    changeRoomStatus(
                        roomNumber
                    );
                }
            );
        }
    );


    setupStaffAssignment();
}


function changeRoomStatus(roomNumber) {

    const statuses = [

        "Available",

        "Occupied",

        "Cleaning",

        "Unavailable"
    ];


    const roomStatus =
        getRoomStatus();


    const current =
        roomStatus[
            roomNumber
        ] ||
        "Available";


    let index =
        statuses.indexOf(
            current
        );


    index++;


    if (
        index >=
        statuses.length
    ) {

        index = 0;
    }


    roomStatus[
        roomNumber
    ] =
        statuses[index];


    saveRoomStatus(
        roomStatus
    );


    updateAdminTable();


    alert(
        "Room " +
        roomNumber +
        " is now " +
        statuses[index] +
        "."
    );
}


/* ============================================================
   ADMIN TABLE UPDATE
   ============================================================ */

function updateAdminTable() {

    const table =
        document.querySelector(
            "#admin table"
        );


    if (!table) return;


    const roomStatus =
        getRoomStatus();


    const rows =
        table.querySelectorAll(
            "tr"
        );


    let available = 0;
    let occupied = 0;


    rows.forEach(
        function(row, index) {

            if (index === 0)
                return;


            const roomNumber =
                row.children[0]
                    ?.innerText
                    .trim();


            const statusCell =
                row.children[2];


            if (
                !roomNumber ||
                !statusCell
            )
                return;


            const status =
                roomStatus[
                    roomNumber
                ] ||
                "Available";


            statusCell.innerHTML =
                createStatusHTML(
                    status
                );


            if (
                status ===
                "Available"
            ) {

                available++;

            } else if (
                status ===
                "Occupied"
            ) {

                occupied++;
            }
        }
    );


    const cards =
        document.querySelectorAll(
            ".admin-card h2"
        );


    if (cards.length >= 3) {

        cards[0].innerText =
            "60";

        cards[1].innerText =
            available;

        cards[2].innerText =
            occupied;
    }
}


function createStatusHTML(status) {

    let className =
        "available";


    if (
        status ===
        "Occupied"
    ) {

        className =
            "occupied";

    } else if (
        status ===
        "Cleaning"
    ) {

        className =
            "cleaning";

    } else if (
        status ===
        "Unavailable"
    ) {

        className =
            "occupied";
    }


    return `
        <span class="${className}">
            ${status}
        </span>
    `;
}


/* ============================================================
   CLEANING STAFF
   ============================================================ */

function setupStaffAssignment() {

    const staffBox =
        document.querySelector(
            ".staff-box"
        );


    if (!staffBox)
        return;


    const button =
        staffBox.querySelector(
            ".main-button"
        );


    if (!button)
        return;


    button.addEventListener(
        "click",
        function() {

            const selects =
                staffBox.querySelectorAll(
                    "select"
                );


            const room =
                selects[0].value;


            const staff =
                selects[1].value;


            let assignments =
                JSON.parse(
                    localStorage.getItem(
                        "cleaningAssignments"
                    )
                ) || {};


            assignments[room] =
                staff;


            localStorage.setItem(
                "cleaningAssignments",
                JSON.stringify(
                    assignments
                )
            );


            updateCleaningStaff(
                room,
                staff
            );


            alert(
                staff +
                " has been assigned to room " +
                room +
                "."
            );
        }
    );
}


function updateCleaningStaff(
    roomNumber,
    staff
) {

    const rows =
        document.querySelectorAll(
            "#admin table tr"
        );


    rows.forEach(
        function(row, index) {

            if (index === 0)
                return;


            if (
                row.children[0]
                    ?.innerText
                    .trim() ===
                roomNumber
            ) {

                row.children[3]
                    .innerText =
                    staff;
            }
        }
    );
}


/* ============================================================
   PRINT / DOWNLOAD CONFIRMATION
   ============================================================ */

function setupConfirmationPrint() {

    const buttons =
        document.querySelectorAll(
            ".confirmation-buttons button"
        );


    if (!buttons.length)
        return;


    const printButton =
        buttons[0];


    printButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            window.print();
        }
    );
}


/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatDate(dateString) {

    if (!dateString)
        return "";


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


/* ============================================================
   FORMAT TIME
   ============================================================ */

function formatTime(timeString) {

    if (!timeString)
        return "";


    const parts =
        timeString.split(":");


    let hour =
        parseInt(
            parts[0]
        );


    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return (
        hour +
        ":" +
        minute +
        " " +
        period
    );
}


/* ============================================================
   SAVE BOOKING
   ============================================================ */

function saveBooking() {

    if (!currentBooking)
        return;


    localStorage.setItem(
        "currentBooking",
        JSON.stringify(
            currentBooking
        )
    );


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "hotelBookings"
            )
        ) || [];


    const existing =
        bookings.findIndex(
            function(booking) {

                return (
                    booking.bookingId ===
                    currentBooking.bookingId
                );
            }
        );


    if (existing >= 0) {

        bookings[existing] =
            currentBooking;

    } else {

        bookings.push(
            currentBooking
        );
    }


    localStorage.setItem(
        "hotelBookings",
        JSON.stringify(
            bookings
        )
    );
}


/* ============================================================
   LOAD USER
   ============================================================ */

function loadCurrentUser() {

    const saved =
        localStorage.getItem(
            "currentUser"
        );


    if (!saved)
        return;


    try {

        currentUser =
            JSON.parse(
                saved
            );

    } catch {

        currentUser = null;
    }
}


/* ============================================================
   LOAD BOOKING
   ============================================================ */

function loadCurrentBooking() {

    const saved =
        localStorage.getItem(
            "currentBooking"
        );


    if (!saved)
        return;


    try {

        currentBooking =
            JSON.parse(
                saved
            );


        selectedRoom =
            currentBooking.roomType;


        selectedPrice =
            currentBooking.roomPricePerNight;


    } catch {

        currentBooking = null;
    }
}


/* ============================================================
   LOGOUT
   ============================================================ */

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "currentUser"
    );


    alert(
        "You have been logged out."
    );


    showPage("login");
}


/* ============================================================
   OPTIONAL LOGOUT BUTTON SUPPORT
   ============================================================ */

function setupLogoutSupport() {

    document
        .querySelectorAll(
            ".logout"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        logout();
                    }
                );
            }
        );
}


/* ============================================================
   PAGE INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* Load saved information */

        loadCurrentUser();

        loadCurrentBooking();


        /* Setup all functionality */

        setupNavigation();

        setupRoleButtons();

        setupLogin();

        setupRegistration();

        setupForgotPassword();

        setupBookingForm();

        setupPaymentMethods();

        setupPayment();

        setupConfirmationPrint();

        setupRoomSlideshows();

        setupRoomSearch();

        setupAdmin();

        setupLogoutSupport();


        /* Update existing data */

        if (currentBooking) {

            updatePaymentPage();

            updateConfirmationPage();
        }


        if (currentUser) {

            if (
                currentUser.role ===
                "admin"
            ) {

                showPage("admin");

            } else {

                showPage("home");
            }

        } else {

            showPage("login");
        }
    }
);