window.onload = function() {
    const id_with_hash = window.location.hash

    if (id_with_hash.length != 0) {
        console.log("item has been scanned")
    }

    else {
        const narrative1_textContent = $(".m_narrative_1");
        narrative1_textContent.html("Scan an item to get started")
        const narrative2_textContent = $(".m_narrative_2");
        narrative2_textContent.html("Scan an item to get started")
        const narrative3_textContent = $(".c_narrative_1");
        narrative3_textContent.html("Scan an item to get started")
        const narrative4_textContent = $(".c_narrative_2");
        narrative4_textContent.html("Scan an item to get started")
    }

}

window.onhashchange = function() { 
    console.log("HASH CHANGED")
    location.reload()  
}

function toggle_home_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-home").addClass("active");
    $("#home-container").css("display", "block");
    $("#viz-container").css("display", "none");
    $("#about-container").css("display", "none");

    $("#nav-tabs .btn:not(#tab-about)").css("border-color", "#000");
}

function toggle_motivation_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-motivations").addClass("active");
    $("#home-container").css("display", "none");
    $("#viz-container").css("display", "block");
    $("#motivations-container").css("display", "block");
    $("#cost-container").css("display", "none");
    $("#about-container").css("display", "none");

    // update carousel position
    const currentCarouselPos = $(".carousel-item.active").attr("id").split("-")[1];
    if (currentCarouselPos > 2) {
        $(".carousel-item").removeClass("active");
        $("#narrative-1").addClass("active");
    }

    // styles
    $("#nav-tabs .btn:not(#tab-about)").css("border-color", "#000");
    $("#tab-home").css("border-color", "#28448c");
    $("#tab-motivations").css("border-color", "#28448c");
    if (!$("#carousel").hasClass("motivations")) {
        $("#carousel").removeClass("costs");
        $("#carousel").addClass("motivations");
    };
}

function toggle_cost_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-costs").addClass("active");
    $("#home-container").css("display", "none");
    $("#viz-container").css("display", "block");
    $("#motivations-container").css("display", "none");
    $("#cost-container").css("display", "block");
    $("#about-container").css("display", "none");

    // update carousel position
    const currentCarouselPos = $(".carousel-item.active").attr("id").split("-")[1];
    if (currentCarouselPos < 3) {
        $(".carousel-item").removeClass("active");
        $("#narrative-3").addClass("active");
    }

    // styles
    $("#nav-tabs .btn:not(#tab-about)").css("border-color", "#000");
    $("#tab-motivations").css("border-color", "#d2a214");
    $("#tab-costs").css("border-color", "#d2a214");
    if (!$("#carousel").hasClass("costs")) {
        $("#carousel").removeClass("motivations");
        $("#carousel").addClass("costs");
    };
}

function toggle_about_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-about").addClass("active");
    $("#home-container").css("display", "none");
    $("#viz-container").css("display", "none");
    $("#about-container").css("display", "block");

    $("#nav-tabs .btn:not(#tab-about)").css("border-color", "#000");
}

$(".carousel-item")