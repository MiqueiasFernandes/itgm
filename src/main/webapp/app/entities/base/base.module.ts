import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItgmSharedModule } from '../../shared';
import {
    BaseService,
    BasePopupService,
    BaseComponent,
    BaseDetailComponent,
    BaseDialogComponent,
    BasePopupComponent,
    BaseDeletePopupComponent,
    BaseDeleteDialogComponent,
    baseRoute,
    basePopupRoute,
    BaseResolvePagingParams,
    FabAddBaseComponent
} from './';

const ENTITY_STATES = [
    ...baseRoute,
    ...basePopupRoute,
];

@NgModule({
    imports: [
        ItgmSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        BaseComponent,
        BaseDetailComponent,
        BaseDialogComponent,
        BaseDeleteDialogComponent,
        BasePopupComponent,
        BaseDeletePopupComponent,
        FabAddBaseComponent,
    ],
    entryComponents: [
        BaseComponent,
        BaseDialogComponent,
        BasePopupComponent,
        BaseDeleteDialogComponent,
        BaseDeletePopupComponent,
        FabAddBaseComponent,
    ],
    providers: [
        BaseService,
        BasePopupService,
        BaseResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmBaseModule {}
