import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItgmSharedModule } from '../../shared';
import {
    CenarioService,
    CenarioPopupService,
    CenarioComponent,
    CenarioDetailComponent,
    CenarioDialogComponent,
    CenarioPopupComponent,
    CenarioDeletePopupComponent,
    CenarioDeleteDialogComponent,
    cenarioRoute,
    cenarioPopupRoute,
    CenarioResolvePagingParams,
    FabAddCenarioComponent,
    SelecionarCenarioComponent,
} from './';

const ENTITY_STATES = [
    ...cenarioRoute,
    ...cenarioPopupRoute,
];

@NgModule({
    imports: [
        ItgmSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CenarioComponent,
        CenarioDetailComponent,
        CenarioDialogComponent,
        CenarioDeleteDialogComponent,
        CenarioPopupComponent,
        CenarioDeletePopupComponent,
        FabAddCenarioComponent,
        SelecionarCenarioComponent,
    ],
    entryComponents: [
        CenarioComponent,
        CenarioDialogComponent,
        CenarioPopupComponent,
        CenarioDeleteDialogComponent,
        CenarioDeletePopupComponent,
        FabAddCenarioComponent,
        SelecionarCenarioComponent,
    ],
    providers: [
        CenarioService,
        CenarioPopupService,
        CenarioResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItgmCenarioModule {}
