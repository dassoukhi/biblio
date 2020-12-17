import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILivre } from 'app/shared/model/livre.model';
import { IExemplaire } from 'app/shared/model/exemplaire.model';

@Component({
  selector: 'jhi-livre-detail',
  templateUrl: './livre-detail.component.html',
})
export class LivreDetailComponent implements OnInit {
  livre: ILivre | null = null;
  exemplaires?: IExemplaire[];

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livre }) => (this.livre = livre));
  }

  previousState(): void {
    window.history.back();
  }

  getExem(id?: number): string {
    if (this.exemplaires) {
      const tab = this.exemplaires.filter(exem => exem.livre?.id === id && exem.disponibilite === true);
      if (tab) {
        return tab.length > 0 ? 'Oui' : 'Non';
      }
    }
    return '';
  }
}
