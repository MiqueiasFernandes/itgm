import { Component, OnInit } from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Response} from '@angular/http';
import {AlertService} from 'ng-jhipster';
import {Modelo, ModeloService} from '../';
import {Principal, User, UserService, Account} from '../../../shared';

@Component({
    selector: 'jhi-fab-add-modelo',
    templateUrl: './fab-add-modelo.component.html',
    styles: []
})
export class FabAddModeloComponent implements OnInit {

    modelo: Modelo;

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private principal: Principal,
        private modeloService: ModeloService,
        private alertService: AlertService

    ) {
        this.modelo = new Modelo();
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.extrairUsuario(account);
        });
    }

    private extrairUsuario(account: Account) {
        this.userService
            .getUser(account)
            .subscribe(
                (user: User) => {
                    this.modelo.user = user;
                },
                (error) => {
                    this.onError(error.json());
                });
    }

    private onError(error) {
        this.alertService.error(error.message);
    }

    private close() {
        this.activeModal.dismiss('closed');
    }

    criarModelo() {
        this.modeloService.create(this.modelo).subscribe(
            (modelo: Modelo) => {
                this.close();
            },
            (error) => this.onError(error)
        );
    }

}
