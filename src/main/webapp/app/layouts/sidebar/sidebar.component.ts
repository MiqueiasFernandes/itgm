import {Component, OnInit} from '@angular/core';

import {EventManager} from 'ng-jhipster';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Account, Principal} from '../../shared';
import {SidebarService} from './sidebar.service';

import {
    ProjetoService,
    Projeto,
    CenarioService,
    Cenario,
    Base,
    BaseService,
    Modelo,
    ModeloService,
    SelecionarProjetoComponent,
    SelecionarCenarioComponent,
    ModeloExclusivoService,
    MapearModeloComponent
} from '../../entities/';

import { Router } from '@angular/router';
import {ModeloExclusivo} from "../../entities/modelo-exclusivo/modelo-exclusivo.model";

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {

    isSidebarFixed = false;
    nome = '';
    email = '';
    image = null;
    projeto: Projeto;
    cenario: Cenario;
    isbasesOpen = false;
    bases: Base[] = null;
    modelos: Modelo[] = null;
    isModelosOpen = false;
    modelosMapeados: number[] = [];

    constructor(
        private principal: Principal,
        private eventManager: EventManager,
        private sidebarService: SidebarService,
        private projetoService: ProjetoService,
        private cenarioService: CenarioService,
        private router: Router,
        private baseService: BaseService,
        private modalService: NgbModal,
        private modeloService: ModeloService,
        private modeloExclusivoService: ModeloExclusivoService
    ) {
        this.isSidebarFixed = sidebarService.isLock();
        sidebarService.lockedObserver$.subscribe((lock: boolean) => {
            this.isSidebarFixed = lock;
        });
        this.sidebarService.sidebarObserver$.subscribe(
            () => this.updateProjetoECenario()
        );
        projetoService.observeProjeto$
            .subscribe(() => this.updateProjetoECenario());
        cenarioService.observeCenario$
            .subscribe(() => this.updateProjetoECenario());
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

    private registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account: Account) => {
                this.getDados(account);
                this.openSidebar();
            });
        });
    }

    private getDados(account: Account) {
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

    private toogleBlockSideBar() {
        this.sidebarService.toogleSidebarFixed();
        if (!this.sidebarService.isLock()) {
            this.closeSidebar();
        }
    }

    private openSidebar() {
        this.sidebarService.openSidebar();
    }

    private closeSidebar() {
        this.sidebarService.closeSidebar();
    }

    private isUserAuthenticated() {
        return this.principal.isAuthenticated();
    }

    private configurar() {
        if (!this.nome || this.nome === ' ' || !this.image) {
            this.router.navigate(['/settings']);
        }
    }

    trackId(index: number, item: any) {
        return item.id;
    }

    loadAllBases() {
        this.closeMenuModelos();
        if (this.bases === null) {
            this.baseService
                .getBasesByProjeto(this.projetoService.getProjetoAtivo())
                .subscribe(
                    (bases: Base[]) => {
                        this.bases = bases;
                        this.isbasesOpen = true;
                    },
                    () => {
                        this.bases = null;
                        this.isbasesOpen = false;
                    });
        } else {
            this.bases = null;
            this.isbasesOpen = false;
        }
    }

    loadAllModelos() {
        this.closeMenuBases();
        if (this.modelos === null) {
            this.modeloService.getAllModelos().subscribe(
                (modelos: Modelo[]) => {
                    this.modelos = modelos;
                    this.isModelosOpen = true;
                    modelos.forEach((modelo) => {
                        this.modeloExclusivoService
                            .getModeloExclusivoByModeloAndCenario(modelo, this.cenario)
                            .subscribe((modelosExclusivos: ModeloExclusivo[]) => {
                                if (
                                    modelosExclusivos !== null &&
                                    modelosExclusivos !== undefined &&
                                    modelosExclusivos.length > 0) {
                                    this.modelosMapeados.push(modelo.id);
                                }
                            });
                    });
                }
            );
        } else {
            this.isModelosOpen = false;
            this.modelos = null;
        }
    }

    private selecionarProjeto() {
        this.modalService.open(SelecionarProjetoComponent);
    }

    private selecionarCenario() {
        if (this.projetoService.getProjetoAtivo()) {
            this.modalService.open(SelecionarCenarioComponent);
        }
    }

    private updateProjetoECenario() {
        this.projeto = this.projetoService.getProjetoAtivo();
        this.cenario = this.cenarioService.getCenarioAtivo();
        this.closeMenuBases();
        this.closeMenuModelos();
    }

    closeMenuModelos() {
        this.isModelosOpen = false;
        this.modelosMapeados = [];
        this.modelos = null;
    }

    closeMenuBases() {
        this.isbasesOpen = false;
        this.bases = null;
    }

    isModeloMapeado(modelo: Modelo): boolean {
        return (this.modelosMapeados.indexOf(modelo.id) > -1);
    }

    mapear(modelo: Modelo) {
        if (!this.isModeloMapeado(modelo) && this.cenario) {
            let ref: NgbModalRef;
            ref = this.modalService.open(MapearModeloComponent);
            ref.componentInstance.setModelo(modelo);
            ref.componentInstance.setCenario(this.cenario);
            ref.componentInstance.setProjeto(this.projeto);
        }
    }

    excluirModelo(modelo: Modelo) {
        this.modeloService.delete(modelo.id);
    }

    excluirBase(base: Base) {
        this.baseService.delete(base.id).subscribe(() => {
            alert('base excluida com sucesso!');
        });
    }

    excluirMapeamento(modelo: Modelo) {
        this.modeloExclusivoService.getModeloExclusivoByModeloAndCenario(modelo, this.cenario)
            .subscribe(
                (modelosExclusivos: ModeloExclusivo[]) => {
                    modelosExclusivos.forEach((modeloEx: ModeloExclusivo) => {
                        this.modeloExclusivoService.delete(modeloEx.id)
                            .subscribe(() => {
                                alert('o modelo foi desassociado!');
                                this.closeMenuModelos();
                            });
                    });
                }
            );
    }
}
