import Router from "router/router";
import Route from "router/route";
import { HomePage } from "views/home";
import { LoggedPage } from "views/logged";
import { PastePage } from "views/paste";

let router: Router;

function initRouter ()
{
    router = new Router ();
    router.addRoute (new Route ("/", "Home", new HomePage ()));
    router.addRoute (new Route ("/logged", "Logged In Page", new LoggedPage ()));
    router.addRoute (new Route ("/:id", "Paste", new PastePage ()));
    router.init ();
}

window.addEventListener ("popstate", () => initRouter ());

initRouter ();