import { LivresearchautorComponent } from './livre-search-autor/livresearchautor.component';
import { LivreSearchThemComponent } from './livre-search-them/livresearchthem.component';
import { LivreSearchTitreComponent } from './livre-search-titre/livresearchtitre.component';
import { BiblioComponent } from './biblio.component';
import { UserRouteAccessService } from '../core/auth/user-route-access-service';
import { LivreAddEmpruntComponent } from '../biblio/livre-add-emprunt/livreaddemprunt.component';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { IEmprunt, Emprunt } from 'app/shared/model/emprunt.model';
import { EmpruntService } from '../entities/emprunt/emprunt.service';

@Injectable({ providedIn: 'root' })
export class EmpruntResolve implements Resolve<IEmprunt> {
  constructor(private service: EmpruntService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmprunt> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((emprunt: HttpResponse<Emprunt>) => {
          if (emprunt.body) {
            return of(emprunt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Emprunt());
  }
}

export const biblioRoutes: Routes = [
  {
    path: 'livreadd/:idlivre',
    component: LivreAddEmpruntComponent,
    resolve: {
      emprunt: EmpruntResolve,
    },
    data: {
      authorities: [],
      pageTitle: 'biblio.Emprunts',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'search',
    component: BiblioComponent,
    data: {
      authorities: [],
      pageTitle: 'biblio.search',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'searchbyautor',
    component: LivresearchautorComponent,
    data: {
      authorities: [],
      pageTitle: 'biblio.search',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'searchbythem',
    component: LivreSearchThemComponent,
    data: {
      authorities: [],
      pageTitle: 'biblio.search',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'searchbytitre',
    component: LivreSearchTitreComponent,
    data: {
      authorities: [],
      pageTitle: 'biblio.search',
    },
    canActivate: [UserRouteAccessService],
  },
];
