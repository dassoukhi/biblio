import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILivre } from 'app/shared/model/livre.model';
import { BiblioService } from './biblio.service';
import { IAuteur } from '../shared/model/auteur.model';
import { IExemplaire } from '../shared/model/exemplaire.model';
import {AuteurService} from '../entities/auteur/auteur.service';
import {ExemplaireService} from '../entities/exemplaire/exemplaire.service';


@Component({
  selector: 'jhi-livre',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
})
export class BiblioComponent implements OnInit {
  livres?: ILivre[];
  livre?: ILivre;
  auteurs?: IAuteur[];
  exemplaires?: IExemplaire[];
  auteur?: IAuteur;
  on = true;
  eventSubscriber?: Subscription;
  public titre?: string;
  // list : any[] = [];

  constructor(protected livreService: BiblioService,protected auteurSevice: AuteurService, protected exemplaireService: ExemplaireService,protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
   
    this.livreService.query().subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    this.auteurSevice.query().subscribe((res: HttpResponse<IAuteur[]>) => (this.auteurs = res.body || []));
    this.exemplaireService.query().subscribe((res: HttpResponse<IExemplaire[]>) => (this.exemplaires = res.body || []));
    
  }

  parAuteur(): void {
    if (this.titre) {
      this.livre = undefined;
      this.on = false;
      this.livreService.parAuteur(this.titre).subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    }
  }

  getAuteur(id?: number): string {
    if(this.auteurs)
    {
      
       
      for (let i = 0; i < this.auteurs.length; i++) {
        if(this.auteurs[i].livres)
        {
          const tab = this.auteurs[i].livres?.find(li => li.id === id);
          if(tab)
          {
            // alert(this.auteurs[i].auteur || "rien");
           return this.auteurs[i].auteur || "";
              
          }
         
          
        }
         
        
      }
    }
    return  "failed" + id;
  }


  getExem(id?: number): string{
    if(this.exemplaires)
    {
      const tab = this.exemplaires.filter(exem => exem.livre?.id === id && exem.disponibilite ===true);
      if(tab)
      {
        return tab.length > 0 ? "Oui" : "Non" ;
      }
    }
    return "";
  }

  loadAllParTheme(): void {
    if (this.titre) {
      this.livre = undefined;
      this.on = false;
      this.livreService.parTheme(this.titre).subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    }
  }

  loadLivre(): void {
    if (this.titre) {
      this.livres = [];
      this.on = false;
      this.livreService.parTitre(this.titre).subscribe((res: HttpResponse<ILivre>) => (this.livre = res.body || undefined));
    }
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInLivres();

  }

  trackId(index: number, item: ILivre): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInLivres(): void {
    this.eventSubscriber = this.eventManager.subscribe('livreListModification', () => this.loadAll());
  }
}
