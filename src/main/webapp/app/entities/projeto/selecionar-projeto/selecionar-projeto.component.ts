import { Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'ng-jhipster';
import { Response } from '@angular/http';
import {Projeto, ProjetoService} from '../';

@Component({
    selector: 'jhi-selecionar-projeto',
    templateUrl: './selecionar-projeto.component.html',
    styleUrls: ['./selecionar-projeto.scss']
})
export class SelecionarProjetoComponent implements OnInit {

    projetos: Projeto[];
    visivel = false;
    titulo = 'Selecione um projeto...';
    projeto: Projeto = null;

    constructor(
        private alertService: AlertService,
        private projetoService: ProjetoService,
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.projetoService.query({
            page: 0,
            size: 100,
            sort: ['id']}).subscribe(
            (res: Response) => this.onSuccess(res.json()),
            (res: Response) => this.onError(res.json())
        );
    }

    private onSuccess(data) {
        this.projetos = data;

        if (data.length === 0) {
            this.onError({message: 'Crie um projeto primeiro!'});
            return;
        }
        if (data.length === 1) {
            this.projetoService.setProjetoAtivo(data[0]);
            this.close();
        }
    }
    private onError(error) {
        this.alertService.error(error.message);
    }
    toogleDropdown() {
        this.visivel = !this.visivel;
    }
    close() {
        this.activeModal.dismiss('closed');
    }
    alterarProjeto() {
        if (!this.projeto) {
            this.alertService.warning('selecione um projeto!');
        }else {
            this.projetoService.setProjetoAtivo(this.projeto);
            this.close();
        }
    }
    selecionar(projeto: Projeto) {
        this.titulo = projeto.nome;
        this.projeto = projeto;
    }
}
