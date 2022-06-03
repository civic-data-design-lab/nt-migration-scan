// window.onload = function() {

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/home": "../home.html",
    "/about": "../about.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    if (path == "/") {
        console.log("default migrant page")
    }
    else {
        // console.log("FULL PATH:", full_path)
        // const path = full_path.split('/')[1]
        console.log("PATH:", path)
        const route = routes[path] || routes[404];
        // window.location.href = route;
        const html = await fetch(route).then((data) => data.text());
        document.getElementById("page-content").innerHTML = html;
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

// }
