// =====================================
// 1. تعرفه خودروها
// =====================================
// برای تغییر قیمت ها فقط عددهای این قسمت را عوض کن.
// قیمت ها به تومان هستند.

const carPrices = {

    "پژو ۴۰۵": 12000,

    "آریو": 14000,

    "جک J4": 16000,

    "تویوتا کمری": 18000,

    "سمند سورن": 13000

};


// =====================================
// 2. اطلاعات خودروها
// =====================================

const cars = {

    "تهران": [

        {
            name: "آریو",
            image: "images/ario.jpg"
        },

        {
            name: "پژو ۴۰۵",
            image: "images/405.jpg"
        }

    ],

    "ساری": [

        {
            name: "تویوتا کمری",
            image: "images/camry.jpg"
        },

        {
            name: "جک J4",
            image: "images/jac-j4.jpg"
        },

        {
            name: "سمند سورن",
            image: "images/samand.jpg"
        }

    ]

};


// =====================================
// 3. کیلومترهای دستی مبدأ تهران
// =====================================
// این کیلومترها نسبت به محاسبه نقشه اولویت دارند.

const manualDistances = {

    "تهران": {

        "مشهد": 904,

        "ساری": 278,

        "شیراز": 845,

        "قزوین": 152,

        "زنجان": 338

    },

    "ساری": {

        // کیلومترهای ساری را بعداً اینجا اضافه می‌کنیم.

    }

};


// =====================================
// 4. مختصات مبدأها
// =====================================

const originCoordinates = {

    "تهران": [35.6892, 51.3890],

    "ساری": [36.5633, 53.0601]

};


// =====================================
// 5. عناصر HTML
// =====================================

const originInput = document.getElementById("origin");

const destinationInput = document.getElementById("destination");

const carInput = document.getElementById("car");

const calculateBtn = document.getElementById("calculateBtn");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const priceElement = document.getElementById("price");

const mapBtn = document.getElementById("mapBtn");

const mapSection = document.getElementById("mapSection");

const carsContainer = document.getElementById("carsContainer");


// =====================================
// 6. نمایش خودروهای هر مبدأ
// =====================================

function updateCars() {

    const origin = originInput.value;

    const availableCars = cars[origin];

    carInput.innerHTML = "";

    carsContainer.innerHTML = "";


    // خودروهای قابل انتخاب برای محاسبه سفر

    availableCars.forEach(car => {

        const option = document.createElement("option");

        option.value = car.name;

        option.textContent = car.name;

        carInput.appendChild(option);

    });


    // نمایش تمام خودروهای ناوگان همسفر

    const allCars = [

    
    {
        name: "پژو ۴۰۵",
        image: "Cars/405.webp"
    },
    {
        name: "جک J4",
        image: "Cars/Jac j4.webp"
    },
    {
        name: "آریو",
        image: "Cars/اریووو.webp"
    },
    {
        name: "تویوتا کمری",
        image: "Cars/تویوتا کمری.webp"
    },
    {
        name: "سمند سورن",
        image: "Cars/سووورن.jpg"
    }


    ];


    allCars.forEach((car, index) => {

        const card = document.createElement("div");

        card.className = "car-card modern-car";

        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `

            <div class="car-image-box">

                <img
                    src="${car.image}"
                    alt="${car.name}"
                    onerror="this.parentElement.classList.add('image-error')"
                >

              
            </div>

            <div class="car-info">

                <h3>${car.name}</h3>

                <div class="car-line"></div>

                <p>همراه مطمئن شما در سفر</p>

            </div>

        `;

        carsContainer.appendChild(card);

    });

}


// =====================================
// 7. تغییر مبدأ
// =====================================

originInput.addEventListener("change", function() {

    updateCars();

    result.style.display = "none";

    mapBtn.style.display = "none";

});


// =====================================
// 8. نقشه
// =====================================

const map = L.map("map").setView([32.5, 53.5], 5);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution: "© OpenStreetMap"
    }
).addTo(map);


let routeLayer = null;


// =====================================
// 9. تبدیل نام شهر به مختصات
// =====================================

async function getCoordinates(city) {

    const url =
        "https://nominatim.openstreetmap.org/search?format=jsonv2&q="
        + encodeURIComponent(city + ", Iran")
        + "&limit=1&accept-language=fa";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات شهر");
    }

    const data = await response.json();

    if (!data.length) {

        throw new Error(
            "شهر مورد نظر پیدا نشد. نام شهر را بررسی کنید."
        );

    }

    return {

        lat: Number(data[0].lat),

        lon: Number(data[0].lon)

    };

}


// =====================================
// 10. دریافت مسیر جاده‌ای
// =====================================

async function getRoadDistance(start, end) {

    const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${start.lon},${start.lat};${end.lon},${end.lat}` +
        "?overview=full&geometries=geojson";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("سرویس مسیریابی در دسترس نیست.");
    }

    const data = await response.json();

    if (
        data.code !== "Ok" ||
        !data.routes ||
        !data.routes.length
    ) {

        throw new Error("مسیر جاده‌ای پیدا نشد.");

    }

    return {

        distance: data.routes[0].distance / 1000,

        geometry: data.routes[0].geometry

    };

}


// =====================================
// 11. رسم مسیر روی نقشه
// =====================================

async function drawRoute(start, end, geometry) {

    if (routeLayer) {

        map.removeLayer(routeLayer);

    }

    const routePoints = geometry.coordinates.map(point => {

        return [point[1], point[0]];

    });

    routeLayer = L.featureGroup([

        L.polyline(routePoints, {

            color: "#c49c4f",

            weight: 5

        }),

        L.marker([start.lat, start.lon])
            .bindPopup("مبدأ سفر"),

        L.marker([end.lat, end.lon])
            .bindPopup("مقصد سفر")

    ]).addTo(map);

    map.fitBounds(routeLayer.getBounds(), {

        padding: [30, 30]

    });

}


// =====================================
// 12. محاسبه هزینه سفر
// =====================================

let lastRoute = null;


async function calculatePrice() {

    const origin = originInput.value;

    const destination = destinationInput.value.trim();

    const car = carInput.value;

    const rate = carPrices[car];


    if (!destination) {

        alert("لطفاً مقصد سفر را وارد کنید.");

        return;

    }


    if (destination === origin) {

        alert("مبدأ و مقصد نمی‌توانند یکسان باشند.");

        return;

    }


    if (rate === null || rate === undefined) {

        alert("تعرفه این خودرو هنوز ثبت نشده است.");

        return;

    }


    calculateBtn.disabled = true;

    loading.style.display = "block";

    result.style.display = "none";

    mapBtn.style.display = "none";


    try {

        let distance;

        let geometry = null;

        let start;

        let end;


        // ---------------------------------
        // اول بررسی کیلومترهای دستی
        // ---------------------------------

        const knownDistance =
            manualDistances[origin]?.[destination];


        if (knownDistance !== undefined) {

            distance = knownDistance;

            start = {

                lat: originCoordinates[origin][0],

                lon: originCoordinates[origin][1]

            };

            end = await getCoordinates(destination);


        } else {

            // ---------------------------------
            // اگر کیلومتر دستی نبود:
            // دریافت خودکار مسیر از نقشه
            // ---------------------------------

            start = {

                lat: originCoordinates[origin][0],

                lon: originCoordinates[origin][1]

            };

            end = await getCoordinates(destination);


            const route = await getRoadDistance(start, end);

            distance = route.distance;

            geometry = route.geometry;

        }


        // ---------------------------------
        // محاسبه قیمت
        // ---------------------------------

       // محاسبه قیمت پایه
let finalPrice = distance * rate;

// دریافت تعداد مسافران
const passengers = Number(
    document.getElementById("passengers").value
);

// از ۴ مسافر به بالا، ۱۵ درصد افزایش قیمت
if (passengers >= 4) {
    finalPrice = finalPrice * 1.15;
}

// گرد کردن قیمت نهایی
finalPrice = Math.round(finalPrice);

// نمایش قیمت
priceElement.textContent =
    finalPrice.toLocaleString("fa-IR") + " تومان";

        result.style.display = "block";


        // ---------------------------------
        // آماده کردن نقشه
        // ---------------------------------

        if (geometry) {

            lastRoute = {

                start,

                end,

                geometry

            };

            mapBtn.style.display = "block";

        } else {

            // مسیرهای دارای کیلومتر دستی هم
            // روی نقشه از سرویس مسیریابی دریافت می‌شوند.

            try {

                const route = await getRoadDistance(start, end);

                lastRoute = {

                    start,

                    end,

                    geometry: route.geometry

                };

                mapBtn.style.display = "block";

            } catch (mapError) {

                lastRoute = null;

            }

        }


    } catch (error) {

        alert(error.message);

    }


    finally {

        calculateBtn.disabled = false;

        loading.style.display = "none";

    }

}


// =====================================
// 13. نمایش نقشه
// =====================================

mapBtn.addEventListener("click", function() {

    if (!lastRoute) {

        alert("مسیر برای نمایش روی نقشه آماده نیست.");

        return;

    }

    mapSection.style.display = "block";

    drawRoute(

        lastRoute.start,

        lastRoute.end,

        lastRoute.geometry

    );

    setTimeout(() => {

        map.invalidateSize();

        mapSection.scrollIntoView({

            behavior: "smooth"

        });

    }, 300);

});


// =====================================
// 14. دکمه محاسبه
// =====================================

calculateBtn.addEventListener("click", calculatePrice);


// =====================================
// 15. شروع سایت
// =====================================

updateCars();
// =====================================
// ارسال اطلاعات سفر به واتساپ
// =====================================

document.getElementById("whatsappBtn").addEventListener("click", function(e) {

    e.preventDefault();

    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const car = document.getElementById("car").value;
    const passengers = document.getElementById("passengers").value;
    const luggage = document.getElementById("luggage").value;
    const price = document.getElementById("price").innerText;

    if (!destination) {
        alert("لطفاً ابتدا مقصد سفر را وارد کنید.");
        return;
    }

    if (!price || price === "۰ تومان") {
        alert("لطفاً ابتدا هزینه سفر را محاسبه کنید.");
        return;
    }

    const message = `
سلام، برای رزرو سفر از سایت همسفر پیام می‌دهم.

مبدأ: ${origin}
مقصد: ${destination}
خودرو: ${car}
تعداد مسافران: ${passengers} نفر
میزان بار همراه: ${luggage}
هزینه نهایی سفر: ${price}

لطفاً برای هماهنگی با من تماس بگیرید.

شماره تماس همسفر: 09333004532
`;

    const whatsappURL =
        "https://wa.me/989333004532?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

});