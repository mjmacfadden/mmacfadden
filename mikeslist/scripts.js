// Array of products
const products = [
    {
        name: "Yeti Rambler*",
        category: ["misc"],
        image: "yeti_rambler.jpg",
        link: "https://amzn.to/4fXnuRf"
    },
    {
        name: "Takyea 32 oz. Vacuum Insulated Water Bottle*",
        category: ["misc"],
        image: "takeya_water_bottle.jpg",
        link: "https://www.amazon.com/dp/B01GW2GQOI"
    },
    {
        name: "Yeti Colster",
        category: ["happy_hour"],
        image: "yeti_colster.jpg",
        link: "https://amzn.to/3D7wt3v"
    },
    {
        name: "Stanley Flask",
        category: ["happy_hour"],
        image: "stanley_flask.jpg",
        link: "https://amzn.to/3ZmpRpL"
    },
    {
        name: "The Office Mug",
        category: ["office"],
        image: "the_office_mug.jpg",
        link: "https://amzn.to/4eYRr24"
    },
    {
        name: "Smart Plug",
        category: ["office"],
        image: "smart_plug.jpg",
        link: "https://amzn.to/4gl8vAt"
    },
    {
        name: "Fender Harmonica*",
        category: ["music"],
        image: "harmonica.jpg",
        link: "https://amzn.to/4giaGVq"
    },
    {
        name: "Yeti Bottle Opener",
        category: ["happy_hour"],
        image: "yeti_bottle_opener.jpg",
        link: "https://amzn.to/3BghbZP"
    },
    {
        name: "Gerber Pocket Knife*",
        category: ["edc"],
        image: "gerber_pocket_knife.jpg",
        link: "https://amzn.to/4igsRfL"
    },
    {
        name: "Key Organizer",
        category: ["edc"],
        image: "key_organizer.jpg",
        link: "https://amzn.to/3Vo2Kto"
    },
    {
        name: "Zebra Pen F-301*",
        category: ["office", "edc"],
        image: "zebra_f-301.jpg",
        link: "https://amzn.to/41BPtSj"
    },
    {
        name: "Leatherman",
        category: ["edc"],
        image: "leatherman.jpg",
        link: "https://amzn.to/3D0lWXY"
    },
    {
        name: "Guitar Pick Punch",
        category: ["music"],
        image: "pick_punch.jpg",
        link: "https://amzn.to/3OCsU8f"
    },
    {
        name: "Phone Case Wallet*",
        category: ["edc", "misc"],
        image: "wallet_case.jpg",
        link: "https://amzn.to/4f3tHKf"
    },
    {
        name: "Cell Phone Car Mount*",
        category: ["electronics"],
        image: "cell_phone_car_mount.jpg",
        link: "https://amzn.to/4fWqddL"
    },
    {
        name: "Headphone Desk Hook*",
        category: ["office"],
        image: "headphone_desk_hook.jpg",
        link: "https://amzn.to/41cM106"
    },
    {
        name: "Bluetooth Earbuds*",
        category: ["electronics"],
        image: "bluetooth_earbuds.jpg",
        link: "https://amzn.to/3B3WIaK"
    },
    {
        name: "Wireless Charger*",
        category: ["electronics", "office", "misc"],
        image: "wireless_charger.jpg",
        link: "https://amzn.to/41ddu1H"
    },
    {
        name: "Kershaw Chill*",
        category: ["edc"],
        image: "kershaw_chill.jpg",
        link: "https://amzn.to/3ZBkd46"
    },
    {
        name: "Tactical Flashlight*",
        category: ["edc", "misc"],
        image: "tactical_flashlight.jpg",
        link: "https://amzn.to/3ZGlYw3"
    },
    {
        name: "Carharrt Hat*",
        category: ["apparel"],
        image: "carharrt_hat.jpg",
        link: "https://amzn.to/3ZB69Yl"
    },
    {
        name: "Northface Hoodie",
        category: ["apparel"],
        image: "northface_hoodie.jpg",
        link: "https://amzn.to/3Zl0btp"
    },
    {
        name: "Pair of Thieves*",
        category: ["apparel"],
        image: "pair_of_thieves.jpg",
        link: "https://amzn.to/4idIqVH"
    },
    {
        name: "Herschel Duffle",
        category: ["misc"],
        image: "herschel_duffle.jpg",
        link: "https://amzn.to/4f4OBIN"
    },
    {
        name: "Cast Iron Skillet",
        category: ["outdoors"],
        image: "cast_iron_skillet.jpg",
        link: "https://amzn.to/3VntVF4"
    },
    {
        name: "Desk Pad*",
        category: ["office"],
        image: "desk_pad.jpg",
        link: "https://amzn.to/4imYN20"
    },
    {
        name: "Baseball Glove",
        category: ["sport"],
        image: "baseball_glove.jpg",
        link: "https://amzn.to/4idKSvn"
    },
    {
        name: "Wool Baseball Cap",
        category: ["apparel"],
        image: "wool_baseball_cap.jpg",
        link: "https://amzn.to/3Zzv2ns"
    },
    {
        name: "Timex Scout Watch",
        category: ["edc", "misc", "apparel"],
        image: "timex_scout.jpg",
        link: "https://amzn.to/3CXrG4O"
    },
    {
        name: "Fingerless Gloves",
        category: ["apparel"],
        image: "fingerless_gloves.jpg",
        link: "https://amzn.to/3CW9AQP"
    },
    {
        name: "Hammock",
        category: ["outdoors"],
        image: "hammock.jpg",
        link: "https://amzn.to/3ZzvlyC"
    },
    {
        name: "Opinel No. 8 Pocket Knife*",
        category: ["edc"],
        image: "opinel.jpg",
        link: "https://amzn.to/3ZzvlyC"
    },
    {
        name: "Jack Black Lip Balm*",
        category: ["outdoors", "misc"],
        image: "lip_balm.jpg",
        link: "https://amzn.to/3D042op"
    },
    {
        name: "Jump Rope*",
        category: ["sport"],
        image: "jump_rope.jpg",
        link: "https://amzn.to/4fWvGRP"
    },
    {
        name: "Foam Roller",
        category: ["sport"],
        image: "foam_roller.jpg",
        link: "https://amzn.to/3ZCpzw3"
    },
    {
        name: "Thera Cane*",
        category: ["sport"],
        image: "thera_cane.jpg",
        link: "https://amzn.to/49nFa63"
    },
    {
        name: "Ping Pong Paddle*",
        category: ["sport", "misc"],
        image: "ping_pong_paddle.jpg",
        link: "https://amzn.to/4gj3LuX"
    },
    {
        name: "Football",
        category: ["sport"],
        image: "football.jpg",
        link: "https://amzn.to/3OG7gzW"
    },
    {
        name: "Herschel Dop Kit",
        category: ["misc"],
        image: "herschel_dop_kit.jpg",
        link: "https://amzn.to/3Bf66IE"
    },
    {
        name: "Waxed Canvas Lunch Bag",
        category: ["misc"],
        image: "waxed_canvas_lunch_bag.jpg",
        link: "https://amzn.to/3ZARJaU"
    },
    {
        name: "Tenor Ukulele",
        category: ["music"],
        image: "tenor_ukulele.jpg",
        link: "https://amzn.to/4fUSdhV"
    },
    {
        name: "Field Notes*",
        category: ["edc", "misc"],
        image: "field_notes.jpg",
        link: "https://amzn.to/3ZCtx7V"
    },
    {
        name: "Growler",
        category: ["happy_hour"],
        image: "growler.jpg",
        link: "https://amzn.to/3ViBAEf"
    },
    {
        name: "Salt Lamp",
        category: ["office", "misc"],
        image: "salt_lamp.jpg",
        link: "https://amzn.to/3VkvFPa"
    },
    {
        name: "Plasma Lighter",
        category: ["edc"],
        image: "plasma_lighter.jpg",
        link: "https://amzn.to/49pzd8Q"
    },
    {
        name: "Dog Toy",
        category: ["misc"],
        image: "dog_toy.jpg",
        link: "https://amzn.to/3D38uTq"
    },
    {
        name: "Mini Basketball Hoop",
        category: ["office", "sport", "misc"],
        image: "mini_basketball_hoop.jpg",
        link: "https://amzn.to/4imjNGs"
    },
    {
        name: "Orange Crush Guitar Amp",
        category: ["music"],
        image: "orange_crush_amp.jpg",
        link: "https://amzn.to/3VpV4XH"
    },
    {
        name: "Work Gloves",
        category: ["outdoors", "apparel", "misc"],
        image: "work_gloves.jpg",
        link: "https://amzn.to/3ZAWvoQ"
    },
    {
        name: "Bucket Boss Mug Organizer",
        category: ["offivce"],
        image: "bucket_boss_mug_organizer.jpg",
        link: "https://amzn.to/3D8R9rU"
    },
    {
        name: "Aviators",
        category: ["apparel"],
        image: "aviators.jpg",
        link: "https://amzn.to/3VmZmPN"
    },
    {
        name: "Record Player",
        category: ["music"],
        image: "record_player.jpg",
        link: "https://amzn.to/3Znx0WM"
    },
    {
        name: "Moon Lamp",
        category: ["office", "misc"],
        image: "moon_lamp.jpg",
        link: "https://amzn.to/3ZijnIl"
    },
    {
        name: "Pickleball Set",
        category: ["sport"],
        image: "pickleball.jpg",
        link: "https://amzn.to/49iQXm5"
    },
    {
        name: "Selfie Stick",
        category: ["electronics", "misc"],
        image: "selfie_stick.jpg",
        link: "https://amzn.to/3D0qbCT"
    },
    {
        name: "Yeti Handle",
        category: ["happy_hour", "misc"],
        image: "yeti_handle.jpg",
        link: "https://amzn.to/3B2zim9"
    },
    {
        name: "Spikeball",
        category: ["sport", "misc", "outdoors"],
        image: "spikeball.jpg",
        link: "https://amzn.to/4fUUiuf"
    },
    {
        name: "Bluetooth Speaker",
        category: ["electronics"],
        image: "bluetooth_speaker.jpg",
        link: "https://amzn.to/41k4Y14"
    },
    {
        name: "Adidas Slides",
        category: ["apparel"],
        image: "adidas_slides.jpg",
        link: "https://amzn.to/4gl7hF4"
    },
    {
        name: "Nike Ratchet Belt",
        category: ["apparel"],
        image: "nike_ratchet_belt.jpg",
        link: "https://amzn.to/3OE6T8T"
    },
    {
        name: "prokadima",
        category: ["sport"],
        image: "prokadima.jpg",
        link: "https://amzn.to/3ZAxrhM"
    },
    {
        name: "Yeti Bucket",
        category: ["outdoors"],
        image: "yeti_bucket.jpg",
        link: "https://amzn.to/4fixuDD"
    },
    {
        name: "Ultimate Frisbee",
        category: ["misc", "sport"],
        image: "ultimate_frisbee.jpg",
        link: "https://amzn.to/49jxBNL"
    },
    {
        name: "Disc Golf Set",
        category: ["outdoors", "sport"],
        image: "disc_golf.jpg",
        link: "https://amzn.to/49jxBNL"
    },
    {
        name: "Klein Tools Bottle Opener",
        category: ["misc"],
        image: "klein_bottle_opener.jpg",
        link: "https://amzn.to/4fZxcCu"
    },
    {
        name: "Weber Smoker Box",
        category: ["misc"],
        image: "weber_smoker_box.jpg",
        link: "https://amzn.to/3BbqHNY"
    },
    {
        name: "Retro Controller",
        category: ["electronics"],
        image: "retro_controller.jpg",
        link: "https://amzn.to/3CVG4dI"
    },
    {
        name: "Cornhole Bags",
        category: ["misc", "sport"],
        image: "cornhole_bags.jpg",
        link: "https://amzn.to/41mzfMv"
    },
    {
        name: "Gooseneck Electric Kettle",
        category: ["misc"],
        image: "electric_kettle.jpg",
        link: "https://amzn.to/4idTXUZ"
    },
    {
        name: "Pour Over Coffee Maker",
        category: ["misc"],
        image: "pour_over_coffee_maker.jpg",
        link: "https://amzn.to/3ZDIOpd"
    },
    {
        name: "Cajon",
        category: ["music"],
        image: "cajon.jpg",
        link: "https://amzn.to/49jxJwL"
    },
    {
        name: "Hatchet",
        category: ["outdoors"],
        image: "hatchet.jpg",
        link: "https://amzn.to/41imG4Y"
    },
    {
        name: "Endurance",
        category: ["books"],
        image: "endurance.jpg",
        link: "https://amzn.to/4iwd2ls"
    },
    {
        name: "The Godfather",
        category: ["books"],
        image: "the_godfather.jpg",
        link: "https://amzn.to/49jzwBX"
    },
    {
        name: "The Terminal List",
        category: ["books"],
        image: "the_terminal_list.jpg",
        link: "https://amzn.to/3VpYV77"
    },
    {
        name: "The Martian",
        category: ["books"],
        image: "the_martian.jpg",
        link: "https://amzn.to/4inrbkE"
    },
    {
        name: "The Storyteller",
        category: ["books"],
        image: "the_storyteller.jpg",
        link: "https://amzn.to/4eXNyu1"
    },
    {
        name: "Yeager",
        category: ["books"],
        image: "yeager.jpg",
        link: "https://amzn.to/4eWfkXW"
    },
];
// Function to dynamically render products
function renderProducts(productArray) {
    const container = document.getElementById("array-values");
    container.innerHTML = ""; // Clear existing content

    productArray.forEach(({ name, category, image, link }) => {
        // Create a card element for each product
        const productCard = document.createElement("div");
        const classes = Array.isArray(category) ? category.join(" ") : category;

        productCard.className = `col-sm-6 col-md-4 col-lg-2 mb-4 py-3 ${classes}`;

        productCard.innerHTML = `
            <a href="${link}" target="_blank" class="card border-0 h-100 text-decoration-none">
                <img src="img/${image}" class="card-img-top mt-4" alt="${name}" />
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                </div>
            </a>
        `;
        container.appendChild(productCard);
    });
}

// Function to filter products by name (search functionality)
function searchProducts() {
    const query = document.getElementById("search-input").value.trim().toLowerCase();
    const filteredProducts = products.filter(({ name }) =>
        name.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts); // Show filtered products
}

// Function to filter products by category
function filterProducts(filterClass) {
    if (filterClass === "all") {
        renderProducts(products); // Show all products
    } else {
        const filteredProducts = products.filter(({ category }) => {
            const categories = Array.isArray(category) ? category : [category];
            return categories.includes(filterClass);
        });
        renderProducts(filteredProducts); // Show filtered products
    }
}

// Initial render of all products
renderProducts(products);
