import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Script } from './script.model';
import { ScriptPopupService } from './script-popup.service';
import { ScriptService } from './script.service';

@Component({
    selector: 'jhi-script-delete-dialog',
    templateUrl: './script-delete-dialog.component.html'
})
export class ScriptDeleteDialogComponent {

    script: Script;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private scriptService: ScriptService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['script']);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.scriptService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'scriptListModification',
                content: 'Deleted an script'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-script-delete-popup',
    template: ''
})
export class ScriptDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private scriptPopupService: ScriptPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.scriptPopupService
                .open(ScriptDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
