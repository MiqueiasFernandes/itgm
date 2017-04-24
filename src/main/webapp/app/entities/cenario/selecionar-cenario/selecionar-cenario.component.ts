import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'ng-jhipster';
import { Response } from '@angular/http';
import { Cenario, CenarioService } from '../';
import {ProjetoService} from "../../projeto/projeto.service";

@Component({
    selector: 'jhi-selecionar-cenario',
    templateUrl: './selecionar-cenario.component.html',
    styleUrls: ['./selecionar-cenario.scss']
})
export class SelecionarCenarioComponent implements OnInit {

    cenarios: Cenario[];
    visivel = false;
    titulo = 'Selecione um cenario...';
    cenario: Cenario = null;

    constructor(
        private alertService: AlertService,
        private cenarioService: CenarioService,
        private projetoService: ProjetoService,
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.cenarioService
            .getCenariosByProjeto(this.projetoService.getProjetoAtivo())
            .subscribe(
                (cenarios: Cenario[]) => this.onSuccess(cenarios),
                (res: Response) => this.onError(res.json())
            );
    }

    private onSuccess(cenarios) {
        this.cenarios = cenarios;

        if (cenarios.length === 0) {
            this.onError({message: 'Crie um cenario primeiro!'});
            return;
        }
        if (cenarios.length === 1) {
            this.cenarioService.setCenarioAtivo(cenarios[0]);
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

    alterarCenario() {
        if (!this.cenario) {
            this.alertService.warning('selecione um cenario!');
        }else {
            this.cenarioService.setCenarioAtivo(this.cenario);
            this.close();
        }
    }

    selecionar(cenario: Cenario) {
        this.titulo = cenario.nome;
        this.cenario = cenario;
    }
}
