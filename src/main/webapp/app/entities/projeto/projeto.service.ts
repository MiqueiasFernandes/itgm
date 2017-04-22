import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';

import { Projeto } from './projeto.model';
@Injectable()
export class ProjetoService {

    private resourceUrl = 'api/projetos';
    private observeProjeto = new Subject<Projeto>();
    observeProjeto$ = this.observeProjeto.asObservable();
    private projetoAtivo: Projeto = null;
    constructor(private http: Http) { }

    create(projeto: Projeto): Observable<Projeto> {
        const copy: Projeto = Object.assign({}, projeto);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(projeto: Projeto): Observable<Projeto> {
        const copy: Projeto = Object.assign({}, projeto);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Projeto> {
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

    setProjetoAtivo(projeto: Projeto) {
        this.projetoAtivo = projeto;
        this.observeProjeto.next(projeto);
    }

    getProjetoAtivo(): Projeto {
        return this.projetoAtivo;
    }

}
