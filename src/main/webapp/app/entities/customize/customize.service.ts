import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Customize } from './customize.model';
import {  UserService, User, Principal} from '../../shared/';
import { EventManager } from 'ng-jhipster';
@Injectable()
export class CustomizeService {

    private resourceUrl = 'api/customizes';

    constructor(
        private http: Http,
        private principal: Principal,
        private userService: UserService,
        private eventManager: EventManager,
    ) { }

    create(customize: Customize): Observable<Customize> {
        const copy: Customize = Object.assign({}, customize);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(customize: Customize): Observable<Customize> {
        const copy: Customize = Object.assign({}, customize);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Customize> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }
    private createRequestOption(req?: any): BaseRequestOptions {
        const options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            const params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }

    getCustomize(): Observable<Customize> {
        return this.query({
            page: 0,
            size: 1,
            sort: ['id']
        }).map((res: Response ) => {
            const customize: Customize = res.json()[0];
            if (!customize ) {
                this.principal.identity().then((account) => {
                    this.userService
                        .getUser(account)
                        .subscribe((user: User) => {
                            const newCustomize: Customize =
                                new Customize(undefined, true, 'green', 0, 0, '', user);
                            newCustomize.sidebar = true;
                            this.create(newCustomize).subscribe(
                                () => { alert('Sessão personalizada...'); },
                                // () => { alert('Houve um erro ao personalizar sessão!'); }
                            );
                            this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'});
                        });
                });
                return null;
            }
            return customize;
        });
    }

    customizeSidebar(
        sidebar: boolean
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize = new Customize(
                    customize.id,
                    sidebar,
                    customize.color,
                    customize.projeto,
                    customize.cenario,
                    customize.desktop,
                    customize.user
                );
                newCustomize.sidebar = sidebar;
                this.update(newCustomize).subscribe(
                    () => {
                        // this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'}); //(loop)
                    }
                );
            }
        );
    }

    customizeColor(
        color: string
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize = new Customize(
                    customize.id,
                    customize.sidebar,
                    color,
                    customize.projeto,
                    customize.cenario,
                    customize.desktop,
                    customize.user
                );
                this.update(newCustomize).subscribe(
                    () => {
                        // this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'}); //(loop)
                    }
                );
            }
        );
    }

    customizeProjeto(
        projeto: number
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize = new Customize(
                    customize.id,
                    customize.sidebar,
                    customize.color,
                    projeto ,
                    customize.cenario,
                    customize.desktop,
                    customize.user
                );
                this.update(newCustomize).subscribe(
                    () => {
                        // this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'}); //(loop)
                    }
                );
            }
        );
    }

    customizeCenario(
        cenario: number
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize = new Customize(
                    customize.id,
                    customize.sidebar,
                    customize.color,
                    customize.projeto,
                    cenario,
                    customize.desktop,
                    customize.user
                );
                this.update(newCustomize).subscribe(
                    () => {
                        // this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'}); //(loop)
                    }
                );
            }
        );
    }

    customizeDesktop(
        desktop: string,
    ) {
        this.getCustomize().subscribe(
            (customize: Customize) => {
                const newCustomize: Customize = new Customize(
                    customize.id,
                    customize.sidebar,
                    customize.color,
                    customize.projeto,
                    customize.cenario,
                    desktop,
                    customize.user
                );
                this.update(newCustomize).subscribe(
                    () => {
                        // this.eventManager.broadcast({ name: 'customizeListModification', content: 'OK'}); //(loop)
                    }
                );
            }
        );
    }
}
