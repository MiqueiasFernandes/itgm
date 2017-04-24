import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { Cenario } from './cenario.model';
import { EventManager } from 'ng-jhipster';
import {Customize, CustomizeService} from '../customize/';
import {Projeto} from "../projeto/projeto.model";
@Injectable()
export class CenarioService {

    private resourceUrl = 'api/cenarios';
    private cenario: Cenario;
    private observeCenario = new Subject<Cenario>();
    observeCenario$ = this.observeCenario.asObservable();

    constructor(
        private http: Http,
        private eventManager: EventManager,
        private customizeService: CustomizeService,
    ) {
        this.eventManager.subscribe('logout', () => { this.setCenarioAtivo(null); });
        this.eventManager.subscribe('authenticationSuccess', () => {
            this.customizeService.getCustomize().subscribe((customize: Customize) => {
                if (!customize) {
                    this.setCenarioAtivo(null);
                } else {
                    this.find(customize.cenario)
                        .subscribe(
                            (cenario: Cenario) => this.setCenarioAtivo(cenario),
                            () => this.setCenarioAtivo(null)
                        );
                }
            });
        });
    }

    create(cenario: Cenario): Observable<Cenario> {
        const copy: Cenario = Object.assign({}, cenario);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(cenario: Cenario): Observable<Cenario> {
        const copy: Cenario = Object.assign({}, cenario);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Cenario> {
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

    setCenarioAtivo(cenario: Cenario) {
        this.cenario = cenario;
        this.observeCenario.next(cenario);
        this.customizeService.customizeCenario(cenario ? cenario.id : 0);
    }

    getCenarioAtivo(): Cenario {
        return this.cenario;
    }

    getCenariosByProjeto(projeto: Projeto): Observable<Cenario[]> {
        return this.query({
            page: 0,
            size: 100,
            sort: ['id']
        }).map(
            (res: Response) => {
                if (!projeto) {
                    return [];
                }
                const cens: Cenario[] = res.json();
                const cenarios: Cenario[] = [];
                cens.forEach((cenario) => {
                    if (cenario.projeto.id === projeto.id) {
                        cenarios.push(cenario);
                    }
                });
                return cenarios;
            });
    }
}
