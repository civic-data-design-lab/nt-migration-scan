// window.onload = function() {

const id_route = (event) => {
    console.log("IN ID_ROUTE")
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    id_handleLocation();
};

// const routes = {
//     "/id": "../index.html",
// };

const id_handleLocation = async () => {
    const path = window.location.pathname;
    console.log("path:", path)
    const html = await fetch("../index.html").then((data) => data.text());
        document.getElementById("page-content").innerHTML = html;
        // document.getElementById("text-content").innerHTML = <div>{path}</div>;
};


// window.onpopstate = id_handleLocation;
window.route = id_route;

// id_handleLocation();

// }
    
