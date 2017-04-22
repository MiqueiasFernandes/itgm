import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Response} from '@angular/http';
import {AlertService} from 'ng-jhipster';
import {ProjetoService} from '../../projeto/projeto.service';
import {BaseService, Base} from '../index';

@Component({
    selector: 'jhi-fab-add-base',
    templateUrl: './fab-add-base.component.html',
    styles: []
})
export class FabAddBaseComponent implements OnInit {

    file: File;
    tipo: number;
    onLoad = false;

    constructor(
        public activeModal: NgbActiveModal,
        private projetoService: ProjetoService,
        private alertService: AlertService,
        private baseService: BaseService
    ) {}

    ngOnInit() {
    }

    adicionarBase() {
        if (!this.file) {
            this.onError({message: 'selecione o arquivo!'});
            return;
        }
        let base: Base =
            new Base(null, this.file.name, null, this.projetoService.getProjetoAtivo());
        if (!base.projeto || base.projeto === null || base.projeto === undefined) {
            this.onError({message: 'ative um projeto!'});
            return;
        }
        this.baseService.create(base)
            .subscribe(
                (res: Base) => this.onSaveSuccess(res),
                (res: Response) => this.onError(res.json()));
    }

    setFile($event) {
        this.file = $event.target.files[0];
        if (!(this.file.name.endsWith('.csv') || this.file.name.endsWith('.RData'))) {
            this.onError({message: 'arquivo invalido!'});
            this.file = null;
            return;
        }
        this.tipo = this.file.name.endsWith('.csv') ? 1 : 2;
    }



    onSaveSuccess(base: Base) {
        this.onLoad = true;
        this.baseService.sendBase(base, this.file).subscribe(
            (res) => {
                this.alertService.success(res.toString());
                this.close();
            },
            (err) => {
                this.onError(err);
            }
        )
    }

    private onError(error) {
        this.alertService.error(error.message);
    }

    private close() {
        this.activeModal.dismiss('closed');
    }
}
