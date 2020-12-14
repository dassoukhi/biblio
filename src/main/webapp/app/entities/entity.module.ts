import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'livre',
        loadChildren: () => import('./livre/livre.module').then(m => m.BiblioLivreModule),
      },
      {
        path: 'auteur',
        loadChildren: () => import('./auteur/auteur.module').then(m => m.BiblioAuteurModule),
      },
      {
        path: 'emplacement',
        loadChildren: () => import('./emplacement/emplacement.module').then(m => m.BiblioEmplacementModule),
      },
      {
        path: 'theme',
        loadChildren: () => import('./theme/theme.module').then(m => m.BiblioThemeModule),
      },
      {
        path: 'exemplaire',
        loadChildren: () => import('./exemplaire/exemplaire.module').then(m => m.BiblioExemplaireModule),
      },
      {
        path: 'emprunt',
        loadChildren: () => import('./emprunt/emprunt.module').then(m => m.BiblioEmpruntModule),
      },
      {
        path: 'biblio',
        loadChildren: () => import('../biblio/biblio.module').then(m => m.BiblioBiblioModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class BiblioEntityModule {}
