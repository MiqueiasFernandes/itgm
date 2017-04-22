import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Response} from '@angular/http';
import {AlertService} from 'ng-jhipster';
import {Principal, User, UserService, Account} from '../../../shared';

import {ProjetoService, Projeto} from '../index';

@Component({
    selector: 'jhi-fab-add-projeto',
    templateUrl: './fab-add-projeto.component.html',
    styles: [],
})
export class FabAddProjetoComponent implements OnInit {

    nome: string;
    projeto: Projeto;
    user: User;

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService,
        private principal: Principal,
        private projetoService: ProjetoService,
        private alertService: AlertService
    ) {
        this.projeto = new Projeto;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.extrairUsuario(account);
        });
    }

    extrairUsuario(account: Account) {
        this.userService.query().subscribe(
            (res: Response) => {
                let users: User[] = res.json();
                for (let i = 0; i < users.length; i++) {
                    let user: User = users[i];
                    if (user.login === account.login && user.email === account.email) {
                        this.projeto.user = user;
                        return;
                    }
                }
                this.onError({message: 'impossivel localizar o usuario, reefetue o login.'})
            }, (res: Response) => this.onError(res.json()));
    }

    criarProjeto() {
        this.projetoService.create(this.projeto)
            .subscribe(
                (res: Projeto) => {
                    this.projetoService.setProjetoAtivo(res);
                    this.close();
                },
                (res: Response) => this.onError(res.json()));
    }

    private onError(error) {
        this.alertService.error(error.message);
    }


    private close() {
        this.activeModal.dismiss('closed');
    }

}
