// =====================================
// 1. تعرفه خودروها
// =====================================
// برای تغییر قیمت ها فقط عددهای این قسمت را عوض کن.
// قیمت ها به تومان هستند.

// نرخ‌های قدیمی مخصوص سفر رفت و برگشت
const oldCarPrices = {

    "پژو ۴۰۵": 12000,

    "آریو": 14000,

    "جک J4": 16000,

    "تویوتا کمری": 18000,

    "سمند سورن": 13000

};


// نرخ‌های جدید اتحادیه مخصوص سفر یک‌طرفه
const carPrices = {

    "پژو ۴۰۵": 14500,

    "آریو": 16500,

    "جک J4": 17500,

    "تویوتا کمری": 21000,

    "سمند سورن": 15500

};

// =====================================
// 2. اطلاعات خودروها
// =====================================

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
        },

        {
            name: "جک J4",
            image: "images/jac-j4.jpg"
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

const originProvinceInput = document.getElementById("originProvince");

const destinationProvinceInput = document.getElementById("destinationProvince");

const destinationInput = document.getElementById("destination");

const carInput = document.getElementById("car");

const calculateBtn = document.getElementById("calculateBtn");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const priceElement = document.getElementById("price");

const mapBtn = document.getElementById("mapBtn");

const mapSection = document.getElementById("mapSection");

const carsContainer = document.getElementById("carsContainer");

let lastTripDetails = null;

function invalidateTripDetails() {

    lastTripDetails = null;

    result.style.display = "none";

    mapBtn.style.display = "none";

}
[
    originInput,
    originProvinceInput,
    destinationInput,
    destinationProvinceInput,
    carInput,
    document.getElementById("passengers"),
    document.getElementById("baggage"),
    document.getElementById("roundTrip")
].forEach(input => {

    input.addEventListener("change", invalidateTripDetails);

    input.addEventListener("input", invalidateTripDetails);

});

// شهرهای استان‌های مبدأ

const provinceCities = {

    "مازندران": [
        "ساری", "آمل", "بابل", "قائم‌شهر", "بابلسر",
        "نوشهر", "چالوس", "تنکابن", "بهشهر", "نکا",
        "جویبار", "فریدون‌کنار", "محمودآباد", "نور",
        "رامسر", "کلاردشت", "عباس‌آباد", "گلوگاه",
        "زیرآب", "پل‌سفید", "شیرگاه", "مرزن‌آباد",
        "کیاسر", "سلمان‌شهر", "سرخرود", "ایزدشهر",
        "گتاب", "زرگرمحله", "امیرکلا", "خوش‌رودپی"
    ],

    "تهران": [
        "تهران", "اسلامشهر", "شهریار", "پردیس",
        "دماوند", "ورامین", "پاکدشت", "رباط‌کریم",
        "ملارد", "قدس", "قرچک", "پیشوا", "فیروزکوه",
        "شمیرانات", "بومهن", "رودهن", "اندیشه",
        "فردوسیه", "صباشهر", "چهاردانگه",
        "کهریزک", "فشم", "لواسان", "آبسرد"
    ],

    "آذربایجان شرقی": [
        "تبریز", "مراغه", "مرند", "میانه", "اهر",
        "بناب", "سراب", "شبستر", "اسکو", "عجب‌شیر",
        "جلفا", "کلیبر", "هریس"
    ],

    "آذربایجان غربی": [
        "ارومیه", "خوی", "بوکان", "مهاباد", "میاندوآب",
        "سلماس", "نقده", "پیرانشهر", "سردشت",
        "تکاب", "شاهین‌دژ", "ماکو"
    ],

    "اردبیل": [
        "اردبیل", "مشگین‌شهر", "پارس‌آباد", "خلخال",
        "گرمی", "نمین", "بیله‌سوار", "سرعین", "نیر"
    ],

    "اصفهان": [
        "اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر",
        "شاهین‌شهر", "فلاورجان", "زرین‌شهر", "مبارکه",
        "گلپایگان", "نطنز", "اردستان", "نائین",
        "فریدون‌شهر", "شهرضا"
    ],

    "البرز": [
        "کرج", "فردیس", "هشتگرد", "نظرآباد",
        "طالقان", "محمدشهر", "ماهدشت", "اشتهارد",
        "چهارباغ"
    ],

    "ایلام": [
        "ایلام", "دهلران", "آبدانان", "مهران",
        "دره‌شهر", "ایوان", "چرداول", "بدره"
    ],

    "بوشهر": [
        "بوشهر", "برازجان", "گناوه", "کنگان",
        "دیر", "جم", "عسلویه", "خورموج", "دلوار"
    ],

    "چهارمحال و بختیاری": [
        "شهرکرد", "بروجن", "فارسان", "لردگان",
        "اردل", "سامان", "فرخ‌شهر", "کوهرنگ"
    ],

    "خراسان جنوبی": [
        "بیرجند", "قائن", "فردوس", "طبس",
        "نهبندان", "سربیشه", "درمیان", "بشرویه"
    ],

    "خراسان رضوی": [
        "مشهد", "نیشابور", "سبزوار", "تربت حیدریه",
        "کاشمر", "قوچان", "تربت جام", "گناباد",
        "چناران", "خواف", "تایباد", "سرخس"
    ],

    "خراسان شمالی": [
        "بجنورد", "شیروان", "اسفراین", "جاجرم",
        "فاروج", "آشخانه", "گرمه", "راز"
    ],

    "خوزستان": [
        "اهواز", "آبادان", "خرمشهر", "دزفول",
        "ماهشهر", "اندیمشک", "شوش", "شوشتر",
        "بهبهان", "ایذه", "رامهرمز", "مسجدسلیمان"
    ],

    "زنجان": [
        "زنجان", "ابهر", "خرمدره", "قیدار",
        "طارم", "ماهنشان", "سلطانیه"
    ],

    "سمنان": [
        "سمنان", "شاهرود", "دامغان", "گرمسار",
        "مهدی‌شهر", "آرادان", "میامی"]
        ,

    "سیستان و بلوچستان": [
        "زاهدان", "چابهار", "زابل", "ایرانشهر",
        "خاش", "سراوان", "کنارک", "نیک‌شهر",
        "راسک", "میرجاوه"
    ],

    "فارس": [
        "شیراز", "مرودشت", "کازرون", "جهرم",
        "فسا", "لار", "داراب", "آباده",
        "اقلید", "فیروزآباد", "نی‌ریز", "ممسنی"
    ],

    "قزوین": [
        "قزوین", "تاکستان", "آبیک", "الوند",
        "بوئین‌زهرا", "محمدیه", "اقبالیه"
    ],

    "قم": [
        "قم", "جعفریه", "کهک", "دستجرد",
        "سلفچگان", "قنوات"
    ],

    "کردستان": [
        "سنندج", "سقز", "مریوان", "بانه",
        "قروه", "بیجار", "کامیاران", "دیواندره",
        "دهگلان"
    ],

    "کرمان": [
        "کرمان", "رفسنجان", "سیرجان", "جیرفت",
        "بم", "زرند", "کهنوج", "شهربابک",
        "بافت", "راور", "بردسیر"
    ],

    "کرمانشاه": [
        "کرمانشاه", "اسلام‌آباد غرب", "هرسین",
        "کنگاور", "سنقر", "جوانرود", "پاوه",
        "سرپل ذهاب", "قصر شیرین"
    ],

    "کهگیلویه و بویراحمد": [
        "یاسوج", "دهدشت", "گچساران", "لیکک",
        "سی‌سخت", "چرام", "باشت"
    ],

    "گلستان": [
        "گرگان", "گنبد کاووس", "علی‌آباد کتول",
        "بندر ترکمن", "آق‌قلا", "کردکوی",
        "بندر گز", "مینودشت", "کلاله", "آزادشهر"
    ],

    "گیلان": [
        "رشت", "بندر انزلی", "لاهیجان", "لنگرود",
        "آستارا", "تالش", "رودسر", "فومن",
        "صومعه‌سرا", "آستانه اشرفیه", "رودبار"
    ],

    "لرستان": [
        "خرم‌آباد", "بروجرد", "دورود", "الیگودرز",
        "ازنا", "کوهدشت", "نورآباد", "پلدختر"
    ],

    "مرکزی": [
        "اراک", "ساوه", "خمین", "محلات",
        "دلیجان", "تفرش", "شازند", "آشتیان",
        "کمیجان"
    ],

    "هرمزگان": [
        "بندرعباس", "قشم", "کیش", "میناب",
        "بندر لنگه", "جاسک", "رودان", "حاجی‌آباد",
        "پارسیان", "بستک"
    ],

    "همدان": [
        "همدان", "ملایر", "نهاوند", "تویسرکان",
        "کبودرآهنگ", "اسدآباد", "رزن", "بهار"
    ],

    "یزد": [
        "یزد", "میبد", "اردکان", "بافق",
        "مهریز", "ابرکوه", "تفت", "اشکذر"
    ]

};

// نمایش شهرهای استان انتخاب‌شده



function updateOriginCities() {

    const province = originProvinceInput.value;

    const cities = provinceCities[province] || [];

    originInput.innerHTML = "";

    cities.forEach(city => {

        const option = document.createElement("option");

        option.value = city;

        option.textContent = city;

        originInput.appendChild(option);

    });

}

function updateDestinationCities() {

    const province = destinationProvinceInput.value;

    const cities = provinceCities[province];

    const cityList = document.getElementById("destination");

    cityList.innerHTML = '<option value="">شهر مقصد را انتخاب کنید</option>';

    if (cities) {

        cities.forEach(city => {

            const option = document.createElement("option");

            option.value = city;
            option.textContent = city;

            cityList.appendChild(option);

        });

    }

    destinationInput.value = "";
    destinationInput.disabled = false;

}

// =====================================
// 6. نمایش خودروهای هر مبدأ
// =====================================

function updateCars() {

   const province = originProvinceInput.value;

   const origin = province === "مازندران" ? "ساری" : "تهران";

   const availableCars = cars[origin];

   carInput.innerHTML = '<option value="">انتخاب خودرو</option>';

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

    // خودروهای مبدأ تهران
    {
        name: "پژو ۴۰۵",
        image: "Cars/405.webp",
        origin: "تهران"
    },
    {
        name: "جک J4",
        image: "Cars/Jac j4.webp",
        origin: "تهران"
    },
    {
        name: "آریو",
        image: "Cars/اریووو.webp",
        origin: "تهران"
    },

    // خودروهای مبدأ ساری
    {
        name: "تویوتا کمری",
        image: "Cars/تویوتا کمری.webp",
        origin: "ساری"
    },
    {
        name: "جک J4",
        image: "Cars/Jac j4.webp",
        origin: "ساری"
    },
    {
        name: "سمند سورن",
        image: "Cars/سووورن.jpg",
        origin: "ساری"
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

originProvinceInput.addEventListener("change", function() {
    updateOriginCities();
    updateCars();

    result.style.display = "none";
    mapBtn.style.display = "none";
});
destinationProvinceInput.addEventListener("change", function() {

    updateDestinationCities();

    result.style.display = "none";
    mapBtn.style.display = "none";

});

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
    "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" +
    encodeURIComponent(city + ", Iran") +
    "&limit=1&accept-language=fa";

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

    const province = originProvinceInput.value;

    const destination = destinationInput.value.trim();

    const destinationProvince = destinationProvinceInput.value;

    const car = carInput.value;

// بررسی انتخاب سفر رفت و برگشت
const isRoundTrip = document.getElementById("roundTrip").checked;

// انتخاب نرخ مناسب
const rate = isRoundTrip
    ? oldCarPrices[car]
    : carPrices[car];

    if (!destination) {

       alert("لطفاً شهر مقصد را انتخاب کنید.");

        return;

    }
    if (!destinationProvince) {

    alert("لطفاً استان مقصد را انتخاب کنید.");

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

if (originCoordinates[origin]) {
    start = {
        lat: originCoordinates[origin][0],
        lon: originCoordinates[origin][1]
    };
} else {
    start = await getCoordinates(`${origin}, ${province}`);
}



        

        if (knownDistance !== undefined) {

            distance = knownDistance;

           

           end = await getCoordinates(`${destination}, ${destinationProvince}`);


        } else {

            // ---------------------------------
            // اگر کیلومتر دستی نبود:
            // دریافت خودکار مسیر از نقشه
            // ---------------------------------

           

           end = await getCoordinates(`${destination}, ${destinationProvince}`);


            const route = await getRoadDistance(start, end);

            distance = route.distance;

            geometry = route.geometry;

        }


        // ---------------------------------
        // محاسبه قیمت
        // ---------------------------------

  // =====================================
// محاسبه قیمت سفر + تعداد مسافران + بار
// =====================================

// محاسبه مسافت کل
const totalDistance = isRoundTrip
    ? distance * 2
    : distance;

// محاسبه قیمت پایه
let basePrice = totalDistance * rate;

// دریافت تعداد مسافران
const passengers = Number(
    document.getElementById("passengers").value
);

// افزایش ۱۵ درصدی برای ۴ مسافر به بالا
if (passengers >= 4) {
    basePrice = basePrice * 1.15;
}

// دریافت درصد بار
const baggagePercent = Number(
    document.getElementById("baggage").value
);

// محاسبه هزینه اضافه بار
const baggagePrice = basePrice * baggagePercent / 100;

// محاسبه قیمت نهایی
let finalPrice = Math.round(
    basePrice + baggagePrice
);
// ذخیره اطلاعات سفر برای پیام واتساپ
lastTripDetails = {

    originProvince: province,
    origin: origin,

    destinationProvince: destinationProvince,
    destination: destination,

    car: car,

    distance: distance,
    totalDistance: totalDistance,

    isRoundTrip: isRoundTrip,

    passengers: passengers,

    baggagePercent: baggagePercent,

    rate: rate,

    finalPrice: finalPrice

};

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
console.log("WhatsApp button connected");


document.getElementById("whatsappBtn").addEventListener("click", function(e) {

    e.preventDefault();

    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;
    const car = document.getElementById("car").value;
    const passengers = document.getElementById("passengers").value;
    const luggage = document.getElementById("baggage").selectedOptions[0].text;
    const price = document.getElementById("price").innerText;

    if (!destination) {
        alert("لطفاً ابتدا مقصد سفر را وارد کنید.");
        return;
    }

    if (!lastTripDetails) {
    alert("لطفاً ابتدا هزینه سفر را محاسبه کنید.");
    return;
}

    if (!price || price === "۰ تومان") {
        alert("لطفاً ابتدا هزینه سفر را محاسبه کنید.");
        return;
    }

    const trip = lastTripDetails;

const message = `
سلام، برای رزرو سفر از سایت همسفر پیام می‌دهم.

اطلاعات سفر:

استان مبدأ: ${trip.originProvince}
شهر مبدأ: ${trip.origin}

استان مقصد: ${trip.destinationProvince}
شهر مقصد: ${trip.destination}

خودرو: ${trip.car}

نوع سفر: ${trip.isRoundTrip ? "رفت و برگشت" : "یک‌طرفه"}

مسافت یک‌طرفه: ${trip.distance.toLocaleString("fa-IR")} کیلومتر
مسافت کل: ${trip.totalDistance.toLocaleString("fa-IR")} کیلومتر

تعداد مسافران: ${trip.passengers} نفر

میزان بار همراه: ${luggage}

اضافه‌بهای بار: ${trip.baggagePercent} درصد

نرخ هر کیلومتر: ${trip.rate.toLocaleString("fa-IR")} تومان

هزینه نهایی سفر: ${trip.finalPrice.toLocaleString("fa-IR")} تومان

لطفاً برای هماهنگی با من تماس بگیرید.

شماره تماس همسفر: 09333004532
`;

    const whatsappURL =
        "https://wa.me/989333004532?text=" +
        encodeURIComponent(message);
console.log("WhatsApp URL:", whatsappURL);

window.open(whatsappURL, "_blank");

});
function calculateBaggagePrice(basePrice) {

    const baggagePercent = Number(
        document.getElementById("baggage").value
    );

    const extraPrice = basePrice * baggagePercent / 100;

    return Math.round(basePrice + extraPrice);
}
// نمایش پیام پیشنهاد ویژه سفر رفت و برگشت

const roundTripCheckbox = document.getElementById("roundTrip");

const roundTripMessage = document.getElementById("roundTripMessage");

roundTripCheckbox.addEventListener("change", function () {

    if (this.checked) {

        roundTripMessage.style.display = "block";

    } else {

        roundTripMessage.style.display = "none";

    }

});
updateOriginCities();
updateCars();
