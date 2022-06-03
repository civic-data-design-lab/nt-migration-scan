// window.onload = function() {

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/": "../migrant.html",
};

// const handleLocation = async () => {
//     const full_path = window.location.pathname;
//     console.log("FULL PATH:", full_path)
//     const path = full_path.split('/')[1]
//     console.log("PATH:", path)
//     const route = routes[path] || routes[404];
//     // window.location.href = route;
//     const html = await fetch(route).then((data) => data.text());
//     document.getElementById("page-content").innerHTML = html;
// };

// window.onpopstate = handleLocation;
// window.route = route;

// handleLocation();

// }

//todo: instead use for when migrant pages load -> replace data