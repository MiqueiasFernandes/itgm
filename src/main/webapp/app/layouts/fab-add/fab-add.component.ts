import {Component, OnInit} from '@angular/core';
import {SidebarService} from '../sidebar/sidebar.service';

import {FabAddModalService} from './fab-add-modal.service';

import {
    FabAddProjetoComponent,
    FabAddCenarioComponent,
    FabAddBaseComponent,
    FabAddModeloComponent
} from '../../entities/';

@Component({
    selector: 'jhi-fab-add',
    templateUrl: './fab-add.component.html',
    styleUrls: [
        'fab-add.scss'
    ],
    providers: [
        FabAddModalService,
    ]
})
export class FabAddComponent implements OnInit {

    menuOpen = false;
    aberto = false;

    constructor(
        private sidebarService: SidebarService,
        private fabAddModalService: FabAddModalService
    ) {
        sidebarService.sidebarObserver$.subscribe((open: boolean) => {
            this.aberto = open;
            this.menuOpen = false;
        });
    }

    ngOnInit() {
    }

    toogleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    addNewProjeto() {
        this.fabAddModalService.open(FabAddProjetoComponent);
    }

    addNewCenario() {
        this.fabAddModalService.open(FabAddCenarioComponent);
    }

    addNewBase() {
        this.fabAddModalService.open(FabAddBaseComponent);
    }

    addNewModelo() {
        this.fabAddModalService.open(FabAddModeloComponent);
    }
}
