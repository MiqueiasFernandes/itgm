import {Injectable} from '@angular/core';
import { Response } from '@angular/http';
import {Subject} from 'rxjs/Subject';

import {EventManager} from 'ng-jhipster';

import {Principal} from '../../shared';

import {CustomizeService, Customize} from '../../entities/customize/';

@Injectable()
export class SidebarService {

    private isSidebarOpen = false;
    private isLockedSidebar = true;

    private observeSidebarStatus = new Subject<boolean>();
    private observeLockedStatus = new Subject<boolean>();

    sidebarObserver$ = this.observeSidebarStatus.asObservable();
    lockedObserver$ = this.observeLockedStatus.asObservable();

    constructor(
        private principal: Principal,
        private eventManager: EventManager,
        private customizeService: CustomizeService,
    ) {
        this.registerAuthenticationSuccess();
        this.registerLogout();
        this.registerCustomizacao();
    }

    private registerLogout() {
        this.eventManager.subscribe('logout', () => {
            this.isSidebarOpen = false;
            this.updateSidebarOpen();
        });
    }

    private registerCustomizacao() {
        this.eventManager.subscribe('customizeListModification',
            ()  => {
                this.updateFromCustomize();
            });
    }

    private registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', () => {
            this.updateFromCustomize();
        });
    }

    private updateFromCustomize() {
        this.customizeService.getCustomize().subscribe((customize: Customize) => {
            if (!customize) {
                return;
            }
            this.isLockedSidebar = customize.sidebar;
            this.updateLockedSidebar();
            this.openSidebar();
        });
    }

    openSidebar() {
        this.isSidebarOpen = this.principal.isAuthenticated();
        this.updateSidebarOpen();
    }

    closeSidebar() {
        /// Sidebar  / bloqueado
        ///   V      &    V     => v => aberto
        ///   V      &    f     => f => fechado
        ///   f      &    V     => f => fechado
        ///   f      &    f     => f => fechado
        this.isSidebarOpen =
            this.principal.isAuthenticated() ?
                (this.isSidebarOpen && this.isLockedSidebar) : false;
        this.updateSidebarOpen();
    }

    toogleSidebar() {
        if (this.isSidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    toogleSidebarFixed() {
        this.isLockedSidebar = !this.isLockedSidebar;
        this.updateLockedSidebar();
    }

    lockSidebar() {
        this.isLockedSidebar = true;
        this.updateLockedSidebar();
    }

    unLockSidebar() {
        this.isLockedSidebar = false;
        this.updateLockedSidebar();
    }

    private updateSidebarOpen() {
        this.observeSidebarStatus.next(this.isSidebarOpen);
    }

    private updateLockedSidebar() {
        this.observeLockedStatus.next(this.isLockedSidebar);
        this.customizeService.customizeSidebar(this.isLockedSidebar);
    }

    isOpen() {
        return this.isSidebarOpen;
    }

    isLock() {
        return this.isLockedSidebar;
    }
}
