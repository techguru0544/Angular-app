import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewsEntityComponent } from './News/News-entity/News-entity.component';

/**
 * All pages routes module
 */
const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            component: DashboardComponent,
            data: {
                breadcrumb: 'Home'
            }
        },
        {
            path: 'News-entity/:id',
            component: NewsEntityComponent,
            data: {
                breadcrumb: 'Detail'
            }
        },
    ],
    runGuardsAndResolvers: 'always',
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
