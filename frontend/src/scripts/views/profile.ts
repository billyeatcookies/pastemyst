import { getUser, getUserPastes } from "api/user";
import User from "data/user";
import { deleteCookie } from "security/cookies";
import View from "renderer/view";
import Router from "router/router";
import { isLoggedIn } from "api/auth";
import { Paste } from "data/paste";

export default class Profile extends View
{
    private router: Router;

    private user: User;

    public constructor (router: Router)
    {
        super ();

        this.router = router;
    }

    public render (): string
    {
        /* tslint:disable:max-line-length */
        return `<div id="profile-header"><img class="avatar"/><p class="username"></p><a class="logout">logout</a></div><ul id="profile-pastes"><li class="paste"><a route=""><p class="title"></p><p class="info"><span class="created-at"></span></p></a></li></ul>`;
        /* tslint:enable:max-line-length */        
    }

    public async run (): Promise<void>
    {
        if (!(await isLoggedIn ()))
        {
            this.router.navigate ("/");
            return;
        }

        this.user = await getUser ();

        this.initHeader ();

        await this.initPastes ();
    }

    private initHeader (): void
    {
        const header: HTMLElement = document.getElementById ("profile-header");

        header.getElementsByClassName ("avatar") [0].setAttribute ("src", this.user.avatar);
        header.getElementsByClassName ("username") [0].textContent = this.user.username;

        header.getElementsByClassName ("logout") [0].addEventListener ("click", (event) =>
        {
            deleteCookie ("github", "/");
            this.router.navigate ("/");
            location.reload ();
        });
    }

    private async initPastes (): Promise<void>
    {
        const pastes: HTMLElement = document.getElementById ("profile-pastes");

        const userPastes: Paste [] = (await getUserPastes ()).sort ((a, b) => b.createdAt - a.createdAt);
        
        userPastes.forEach ((paste) =>
        {
            const pasteTemplate: HTMLElement = pastes.children [0].cloneNode (true) as HTMLElement;

            pasteTemplate.getElementsByTagName ("a") [0].setAttribute ("route", `/${paste._id}`);
            
            (pasteTemplate.getElementsByClassName ("title") [0] as HTMLElement).innerText =
            paste.title ? paste.title : "no title";

            const date: Date = new Date (paste.createdAt * 1000);
            
            (pasteTemplate.getElementsByClassName ("created-at") [0] as HTMLElement).innerText =
                `${date.toDateString ()} ${date.toLocaleTimeString ()}`;
            
            const el = pastes.appendChild (pasteTemplate);
            this.router.registerLink (el.getElementsByTagName ("a") [0]);
        });

        pastes.removeChild (pastes.children [0]);
    }
}