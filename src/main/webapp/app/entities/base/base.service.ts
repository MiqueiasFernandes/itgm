import { Injectable } from '@angular/core';
import {Http, Response, URLSearchParams, BaseRequestOptions, RequestOptions, RequestMethod} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Base } from './base.model';
import {Projeto, ProjetoService} from '../projeto/';

@Injectable()
export class BaseService {

    private resourceUrl = 'api/bases';

    constructor(
        private http: Http,
        private projetoService: ProjetoService,
    ) { }

    create(base: Base): Observable<Base> {
        const copy: Base = Object.assign({}, base);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(base: Base): Observable<Base> {
        const copy: Base = Object.assign({}, base);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Base> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<Response> {
        const options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options);
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
    sendBase(base: Base, file: File): Observable<Response> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('usuario', base.projeto.user.login);
        formData.append('projeto', base.projeto.nome);
        formData.append('nome', base.nome);
        formData.append('id', base.id);
        return this.http.post(this.resourceUrl + '/send', formData);
    }

    getBasesByProjeto(projeto: Projeto): Observable<Base[]> {
        return this.query({
            page: 0,
            size: 100,
            sort: ['id']
        }).map(
            (res: Response) => {
                if (!projeto) {
                    return [];
                }
                const bas: Base[] = res.json();
                const bases: Base[] = [];
                bas.forEach((base) => {
                    if (base.projeto.id === projeto.id) {
                        bases.push(base);
                    }
                });
                return bases;
            });
    }

    getFieldsOfBase(base: Base): Observable<string[]> {
        return this.http.get(`${this.resourceUrl}/campos/${base.id}`)
            .map((res: Response) => res.json() )
            .map((data) => data.campos);
    }
}
