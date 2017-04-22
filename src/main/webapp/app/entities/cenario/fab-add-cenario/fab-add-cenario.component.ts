import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Response} from '@angular/http';
import {AlertService} from 'ng-jhipster';
import {CenarioService, Cenario} from '../';
import {ProjetoService} from '../../projeto/projeto.service';

@Component({
    selector: 'jhi-fab-add-cenario',
    templateUrl: './fab-add-cenario.component.html',
    styles: []
})
export class FabAddCenarioComponent implements OnInit {

    cenario: Cenario;

    constructor(
        public activeModal: NgbActiveModal,
        private projetoService: ProjetoService,
        private alertService: AlertService,
        private cenarioService: CenarioService,
    ) {
        this.cenario = new Cenario;
    }

    ngOnInit() {
    }


    criarCenario() {
        this.cenario.projeto = this.projetoService.getProjetoAtivo();
        if (!this.cenario.projeto) {
            this.onError({message: 'ative um projeto!'});
            return;
        }
        this.cenarioService.create(this.cenario)
            .subscribe(
                (res: Cenario) =>
                    this.onSaveSuccess(res),
                (res: Response) => this.onError(res.json()));
    }

    onSaveSuccess(cenario: Cenario) {
        this.cenarioService.setCenarioAtivo(cenario);
        this.close();
    }

    private onError(error) {
        this.alertService.error(error.message);
    }

    private close() {
        this.activeModal.dismiss('closed');
    }
}
