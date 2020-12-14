import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { BiblioSharedModule } from 'app/shared/shared.module';
import { BiblioCoreModule } from 'app/core/core.module';
import { BiblioAppRoutingModule } from './app-routing.module';
import { BiblioHomeModule } from './home/home.module';
import { BiblioEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    BiblioSharedModule,
    BiblioCoreModule,
    BiblioHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    BiblioEntityModule,
    BiblioAppRoutingModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent],
})
export class BiblioAppModule {}
