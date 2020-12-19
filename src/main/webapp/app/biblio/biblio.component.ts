import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { ILivre } from 'app/shared/model/livre.model';
import { IUser } from 'app/core/user/user.model';
import { IEmprunt } from 'app/shared/model/emprunt.model';
import { EmpruntService } from '../entities/emprunt/emprunt.service';
import { IExemplaire, Exemplaire } from 'app/shared/model/exemplaire.model';
import { ExemplaireService } from 'app/entities/exemplaire/exemplaire.service';
import { UserService } from '../core/user/user.service';
import { BiblioService } from './biblio.service';
import { IAuteur } from '../shared/model/auteur.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuteurService } from '../entities/auteur/auteur.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-livre',
  templateUrl: './biblio.component.html',
  styleUrls: ['./biblio.component.scss'],
})
export class BiblioComponent implements OnInit {
  account: Account | null = null;
  users?: IUser[];
  user?: IUser;
  authSubscription?: Subscription;
  emprunts?: IEmprunt[];
  livres?: ILivre[];
  livre?: ILivre;
  auteurs?: IAuteur[];
  exemplaires: IExemplaire[] = [];
  auteur?: IAuteur;
  on = true;
  isSaving = false;
  eventSubscriber?: Subscription;
  public titre?: string;
  nombreEmprunts = 0;

  constructor(
    protected livreService: BiblioService,
    protected activatedRoute: ActivatedRoute,
    protected auteurSevice: AuteurService,
    protected exemplaireService: ExemplaireService,
    protected empruntService: EmpruntService,
    protected userService: UserService,
    private accountService: AccountService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.livreService.query().subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    this.auteurSevice.query().subscribe((res: HttpResponse<IAuteur[]>) => (this.auteurs = res.body || []));
    this.exemplaireService.query().subscribe((res: HttpResponse<IExemplaire[]>) => (this.exemplaires = res.body || []));
    this.empruntService.query().subscribe((res: HttpResponse<IEmprunt[]>) => (this.emprunts = res.body || []));
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
  }

  parAuteur(): void {
    if (this.titre) {
      this.livre = undefined;
      this.on = false;
      this.livreService.parAuteur(this.titre).subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    }
  }

  getAuteur(id?: number): string {
    if (this.auteurs) {
      for (let i = 0; i < this.auteurs.length; i++) {
        if (this.auteurs[i].livres) {
          const tab = this.auteurs[i].livres?.find(li => li.id === id);
          if (tab) {
            return this.auteurs[i].auteur || '';
          }
        }
      }
    }
    return '';
  }

  getExem(id?: number): string {
    if (this.exemplaires) {
      const tab = this.exemplaires.filter(exem => exem.livre?.id === id && exem.disponibilite === true);
      if (tab) {
        return tab.length > 0 ? 'Oui' : 'Non';
      }
    }

    // const exemplaire = this.createFromFormExemplaire(id);
    // this.subscribeToSaveResponse(this.exemplaireService.update(exemplaire));

    return '';
  }

  isEmprunt(id?: number): number {
    // return t?.user?.login || "nop";
    this.user = this.users?.find(u => String(u.login) === String(this.account?.login)) || {};
    const t = this.emprunts?.filter(e => e.user?.id === this.user?.id) || [];
    this.nombreEmprunts = t.length;
    const k = t?.find(e => e.exemplaire?.livre?.id === id && e.exemplaire?.disponibilite === false && e.user?.id === this.user?.id);

    return k?.id || 0;
  }

  rendre(id: number): void {
    const test = this.emprunts?.find(e => e.id === id);

    const exemplaire = {
      ...new Exemplaire(),
      id: test?.exemplaire?.id,
      disponibilite: true,
      livre: test?.exemplaire?.livre,
    };
    this.subscribeToSaveResponse(this.exemplaireService.update(exemplaire));

    if (test?.id)
      this.empruntService.delete(test?.id).subscribe(() => {
        // this.eventManager.broadcast('livreListModification');
      });
  }
  loadAllParTheme(): void {
    if (this.titre) {
      this.livre = undefined;
      this.on = false;
      this.livreService.parTheme(this.titre).subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    }
  }

  loadLivre(): void {
    alert(this.nombreEmprunts);
    if (this.titre) {
      this.livres = [];
      this.on = false;
      this.livreService.parTitre(this.titre).subscribe((res: HttpResponse<ILivre>) => (this.livre = res.body || undefined));
    }
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInLivres();
    setTimeout(() => {
      this.nombreEmprunts >= 5
        ? alert(
            "Vous avez atteint le nombre maximum d'emprunt, pour pouvoir emprunter à nouveau vous devez rendre au moins un des livres empruntés. \n\n\nRappel : Vous avez droit à 5 emprunts par adhérent"
          )
        : '';
    }, 300);
  }

  trackId(index: number, item: ILivre): number {
    return item.id!;
  }

  registerChangeInLivres(): void {
    this.eventSubscriber = this.eventManager.subscribe('livreListModification', () => this.loadAll());
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmprunt>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  previousState(): void {
    window.history.back();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  private createFromFormExemplaire(id?: number): IExemplaire {
    const ex = this.getExemplaire(id);
    return {
      ...new Exemplaire(),
      id: ex.id,
      disponibilite: true,
      livre: ex.livre,
    };
  }

  getExemplaire(id?: number): IExemplaire {
    let ex = new Exemplaire();
    ex = this.exemplaires.find(e => e.disponibilite === true && e.livre?.id === id) || {};
    return ex;
  }

  listLivreByUser(): Boolean {
    this.emprunts = this.emprunts?.filter(e => e.user === this.user);
    return false;
  }
}
