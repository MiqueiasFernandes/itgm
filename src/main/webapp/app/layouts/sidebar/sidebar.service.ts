import {Injectable} from '@angular/core';

import {Subject} from 'rxjs/Subject';

import {EventManager} from 'ng-jhipster';

import {Principal} from '../../shared';


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
        private eventManager: EventManager
    ) {
        this.openSidebar();
        this.registerAuthenticationSuccess();
        this.lockSidebar();
    }

    private registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.openSidebar();
        });
    }


    openSidebar() {
        this.isSidebarOpen = this.principal.isAuthenticated();
        this.updateSidebarOpen();
    }

    closeSidebar(force?: Boolean) {
        /// Sidebar  / bloqueado
        ///   V      &    V     => v => aberto
        ///   V      &    f     => f => fechado
        ///   f      &    V     => f => fechado
        ///   f      &    f     => f => fechado
        this.isSidebarOpen = (force ? false : (this.isSidebarOpen && this.isLockedSidebar));
        this.updateSidebarOpen();
    }

    toogleSidebar() {
        if (this.isSidebarOpen)
            this.closeSidebar();
        else
            this.openSidebar();
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

    updateSidebarOpen() {
        this.observeSidebarStatus.next(this.isSidebarOpen);
    }

    updateLockedSidebar() {
        this.observeLockedStatus.next(this.isLockedSidebar);
    }

    isOpen() {
        return this.isSidebarOpen;
    }

    isLock() {
        return this.isLockedSidebar;
    }
}
