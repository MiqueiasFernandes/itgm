import {Component, OnInit} from '@angular/core';

import {EventManager, AlertService} from 'ng-jhipster';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Account, Principal} from '../../shared';
import { Response } from '@angular/http';
import {SidebarService} from './sidebar.service';

import {ProjetoService, Projeto, CenarioService, Cenario, Base, BaseService, SelecionarProjetoComponent} from '../../entities/';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {

    isSidebarFixed = false;
    nome = '';
    email = '';
    image = null;
    projeto: Projeto;
    cenario: Cenario;
    bases: Base[];

    constructor(
        private principal: Principal,
        private eventManager: EventManager,
        private sidebarService: SidebarService,
        private projetoService: ProjetoService,
        private cenarioService: CenarioService,
        private router: Router,
        private baseService: BaseService,
        private alertService: AlertService,
        private modalService: NgbModal,
    ) {
        this.isSidebarFixed = sidebarService.isLock();
        sidebarService.lockedObserver$.subscribe((lock: boolean) => {
            this.isSidebarFixed = lock;
        });
        projetoService.observeProjeto$.subscribe((projeto: Projeto) => this.projeto = projeto);
        cenarioService.observeCenario$.subscribe((cenario: Cenario) => this.cenario = cenario);
    }

    ngOnInit() {
        this.principal.identity().then((account: Account) => {
            this.getDados(account);
        });
        this.registerAuthenticationSuccess();
        this.openSidebar();
        this.principal.getAuthenticationState().subscribe((account) => {
            this.getDados(account);
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account: Account) => {
                this.getDados(account);
                this.openSidebar();
            });
        });
    }

    getDados(account: Account) {
        if (!account) {
            this.closeSidebar();
        } else {
            this.nome =
                (account.firstName ? account.firstName : '') + ' ' +
                (account.lastName ? account.lastName : '');
            this.email = account.email;
            this.image = account.imageUrl;
        }
    }

    toogleBlockSideBar() {
        this.sidebarService.toogleSidebarFixed();
        if (!this.sidebarService.isLock()) {
            this.closeSidebar();
        }
    }

    openSidebar() {
        this.sidebarService.openSidebar();
    }

    closeSidebar() {
        this.sidebarService.closeSidebar();
    }

    isUserAuthenticated() {
        return this.principal.isAuthenticated();
    }

    configurar() {
        if (!this.nome || this.nome === ' ' || !this.image) {
            this.router.navigate(['/settings']);
        }
    }

    trackId(index: number, item: Base) {
        return item.id;
    }

    loadAll() {
        this.baseService.query({
            page: 1,
            size: 100,
            sort: ['id']
        }).subscribe(
            (res: Response) => this.onSuccess(res.json()),
            (res: Response) => this.onError(res.json())
        );
    }

    private onSuccess(data) {
        this.bases = data;
    }
    private onError(error) {
        this.alertService.error(error.message);
    }

    selecionar() {
        const modalRef = this.modalService.open(SelecionarProjetoComponent);
    }
}
