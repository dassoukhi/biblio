import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BiblioSharedModule } from '../shared/shared.module';
import { biblioRoutes } from './biblio.route';
import { LivresearchautorComponent } from './livre-search-autor/livresearchautor.component';
import { LivreSearchThemComponent } from './livre-search-them/livresearchthem.component';
import { LivreSearchTitreComponent } from './livre-search-titre/livresearchtitre.component';
import { LivreAddEmpruntComponent } from './livre-add-emprunt/livreaddemprunt.component';
import { BiblioComponent } from '../biblio/biblio.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BiblioSharedModule, FormsModule, RouterModule.forChild(biblioRoutes)],
  declarations: [LivresearchautorComponent, LivreSearchThemComponent, LivreSearchTitreComponent, LivreAddEmpruntComponent, BiblioComponent],
})
export class BiblioBiblioModule {}
