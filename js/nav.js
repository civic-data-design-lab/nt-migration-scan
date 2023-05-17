let idleTime = 0;
const navTabs = ['home', 'motivations', 'costs', 'about'];
let currentTab = 'motivations';

window.onload = function() {
    const id_with_hash = window.location.hash

    if (id_with_hash.length != 0) {
        console.log("item has been scanned")
    }

    else {
        const defaultText = "Scan a fragment of the data tapestry <br/>to learn about a migrant."
        $(".m_narrative_1").html(defaultText); // narrative 1 text content
        $(".m_narrative_2").html(defaultText); // narrative 2 text content
        $(".c_narrative_1").html(defaultText); // narrative 3 text content
        $(".c_narrative_2").html(defaultText); // narrative 4 text content

        $(".carousel-caption").css("display","flex");
        $(".carousel-caption").css("align-items","center");
        $(".carousel-caption").css("justify-content","center");
        $(".carousel-caption").css("font-size","4vmin");

        toggle_home_on(); // default to load home page if no item has been scanned
        currentTab = 'home';
        // Increment the idle time counter every 10 seconds.
        var idleInterval = setInterval(timerIncrement, 10000); // 10 seconds

        // Zero the idle timer on mouse movement.
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });
    }
}

window.onhashchange = function() { 
    console.log("HASH CHANGED")
    location.reload()  
}

// timer for idle time - change tabs when screen is idle
function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > 6) { // 60 seconds
      let nextTabIndex = navTabs.indexOf(currentTab) + 1;
      let nextTab = (nextTabIndex == navTabs.length) ? navTabs[0] : navTabs[nextTabIndex];
      // console.log(nextTab);
      if (nextTab == "home") {
        toggle_home_on();
      }
      else if (nextTab == "motivations") {
        toggle_motivation_on();
      }
      else if (nextTab == "costs") {
        toggle_cost_on();
      }
      else {
        toggle_about_on();
      }

      // reset timer and current tab
      idleTime = 0;
      currentTab = nextTab;
  }
}

function toggle_home_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-home").addClass("active");
    $("#home-container").css("display", "block");
    $("#carousel").css("display", "none");
    $("#viz-container").css("display", "none");
    $("#about-container").css("display", "none");

    $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
}

function toggle_motivation_on () {
    // update carousel position
    $("#nav-tabs").on("click", function() {
        const currentCarouselPos = $(".carousel-item.active").attr("id").split("-")[1];
        if (currentCarouselPos > 2) {
            $(".carousel-item").removeClass("active");
            $("#narrative-1").addClass("active");
            $(".nav-dot").removeClass("active");
            $("#nav-dot-1").addClass("active");
        }
    });

    // tab styles
    // $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
    $("#tab-home").css("border-right", "solid 2px white");
    $("#tab-motivations").css("border-right", "solid 2px #28448c");
    $("#tab-costs").css("border-right", "solid 2px black");
    $("#carousel").css("display", "block");
    if (!$("#carousel").hasClass("motivations")) {
        $("#carousel").removeClass("costs");
        $("#carousel").addClass("motivations");
    };

    $("#nav-tabs .btn").removeClass("active");
    $("#tab-motivations").addClass("active");
    $("#home-container").css("display", "none");
    $("#viz-container").css("display", "block");
    $("#motivations-container").css("display", "block");
    $("#cost-container").css("display", "none");
    $("#about-container").css("display", "none");
}

function toggle_cost_on () {
    // update carousel position
    $("#nav-tabs").on("click", function() {
        const currentCarouselPos = $(".carousel-item.active").attr("id").split("-")[1];
        if (currentCarouselPos < 3) {
            $(".carousel-item").removeClass("active");
            $("#narrative-3").addClass("active");
            $(".nav-dot").removeClass("active");
            $("#nav-dot-3").addClass("active");
        }
    });

    // tab styles
    $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
    $("#tab-motivations").css("border-right", "solid 2px white");
    $("#tab-costs").css("border-right", "solid 2px #d2a214");
    if (!$("#carousel").hasClass("costs")) {
        $("#carousel").removeClass("motivations");
        $("#carousel").addClass("costs");
    };

    $("#nav-tabs .btn").removeClass("active");
    $("#tab-costs").addClass("active");
    $("#carousel").css("display", "block");
    $("#home-container").css("display", "none");
    $("#viz-container").css("display", "block");
    $("#motivations-container").css("display", "none");
    $("#cost-container").css("display", "block");
    $("#about-container").css("display", "none");
}

function toggle_about_on () {
    $("#nav-tabs .btn").removeClass("active");
    $("#tab-about").addClass("active");
    $("#home-container").css("display", "none");
    $("#carousel").css("display", "none");
    $("#viz-container").css("display", "none");
    $("#about-container").css("display", "block");

    $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
    $("#tab-costs").css("border-right", "solid 2px white");
}

function updateCarouselProgress() {

}

// toggle visibility on carousel arrow click
$(".carousel-control").on("click", function() {
    const carouselPos = $(".carousel-item.active").attr("id").split("-")[1];
    const clickDirection = $(this).attr("class").split("carousel-control-")[1];
    const prevCarouselPos = parseInt(carouselPos) - 1;
    const nextCarouselPos = parseInt(carouselPos) + 1;
    
    // toggle visibility for nav tabs
    if ((carouselPos == 2 && clickDirection == "next") || (carouselPos == 1 && clickDirection == "prev")) {
        toggle_cost_on();
    }
    else if (carouselPos == 1 && clickDirection == "prev") {
        toggle_cost_on();
    }
    else if (carouselPos == 4 && clickDirection == "next") {
        toggle_motivation_on();
    }
    else if (carouselPos == 3 && clickDirection == "prev") {
        toggle_motivation_on();
    }

    // update carousel position
    if (clickDirection == "next") {
        $(".nav-dot").removeClass("active");
        if (nextCarouselPos == 5) {
            $("#nav-dot-1").addClass("active");
        }
        else {
            $("#nav-dot-" + nextCarouselPos).addClass("active");
        }
    }
    else if (clickDirection == "prev") {
        $(".nav-dot").removeClass("active");
        if (prevCarouselPos == 0) {
            $("#nav-dot-4").addClass("active");
        }
        else {
            $("#nav-dot-" + prevCarouselPos).addClass("active");
        }
    }
});

// toggle visibility on carousel arrow click
$(".nav-dot").on("click", function() {
    const carouselPos = parseInt($(".carousel-item.active").attr("id").split("-")[1]);
    const navClickedPos = parseInt($(this).attr("id").split("-")[2]);
    const currentTab = $("#nav-tabs").find(".active").attr("id").split("-")[1];
    console.log("nav tab: " + currentTab);

        if (carouselPos == navClickedPos) {
            return;
        }
        else {
            if (navClickedPos < 3 && currentTab !== "motivations") {
                $("#carousel").removeClass("costs");
                $("#carousel").addClass("motivations");

                // tab styles
                $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
                $("#tab-home").css("border-right", "solid 2px #28448c");
                $("#tab-motivations").css("border-right", "solid 2px #28448c");

                // tab visibility
                $("#nav-tabs .btn").removeClass("active");
                $("#tab-motivations").addClass("active");
                $("#motivations-container").css("display", "block");
                $("#cost-container").css("display", "none");
            }
            else if (navClickedPos > 2 && currentTab !== "costs") {
                $("#carousel").removeClass("motivations");
                $("#carousel").addClass("costs");

                // tab styles
                $("#nav-tabs .btn:not(#tab-about)").css("border-right", "solid 2px #000");
                $("#tab-motivations").css("border-right", "solid 2px #d2a214");
                $("#tab-costs").css("border-right", "solid 2px #d2a214");

                // tab visibility
                $("#nav-tabs .btn").removeClass("active");
                $("#tab-costs").addClass("active");
                $("#motivations-container").css("display", "none");
                $("#cost-container").css("display", "block");
            }
            $(".nav-dot").removeClass("active");
            $("#nav-dot-" + navClickedPos).addClass("active");
            $(".carousel-item").removeClass("active");
            $("#narrative-" + navClickedPos).addClass("active");
        }
    
//     else if (carouselPos == 1 && clickDirection == "prev") {
//         toggle_cost_on();
//     }
//     else if (carouselPos == 4 && clickDirection == "next") {
//         toggle_motivation_on();
//     }
//     else if (carouselPos == 3 && clickDirection == "prev") {
//         toggle_motivation_on();
//     }
});

$(document).ready(function() {
    $("#tab-home").css("border-right", "solid 2px white");
    $("#tab-motivations").css("border-right", "solid 2px #28448c");
});