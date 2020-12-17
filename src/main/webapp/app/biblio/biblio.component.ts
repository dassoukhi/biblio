import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { ILivre } from 'app/shared/model/livre.model';
import { IUser, User } from 'app/core/user/user.model';
import { IEmprunt, Emprunt } from 'app/shared/model/emprunt.model';
import { EmpruntService } from '../entities/emprunt/emprunt.service';
import { IExemplaire, Exemplaire } from 'app/shared/model/exemplaire.model';
import { ExemplaireService } from 'app/entities/exemplaire/exemplaire.service';
import { UserService } from 'app/core/user/user.service';
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
  users: IUser[] = [];
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
  // list : any[] = [];

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
    this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
    this.livreService.query().subscribe((res: HttpResponse<ILivre[]>) => (this.livres = res.body || []));
    this.auteurSevice.query().subscribe((res: HttpResponse<IAuteur[]>) => (this.auteurs = res.body || []));
    this.exemplaireService.query().subscribe((res: HttpResponse<IExemplaire[]>) => (this.exemplaires = res.body || []));
    this.empruntService.query().subscribe((res: HttpResponse<IEmprunt[]>) => (this.emprunts = res.body || []));
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
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
            // alert(this.auteurs[i].auteur || "rien");
            return this.auteurs[i].auteur || '';
          }
        }
      }
    }
    return '';
  }

  getExem(id?: number): string {
    const t = this.emprunts?.find(e => e.user === this.user && e.exemplaire?.disponibilite === false) || null;
    //alert(id + " : " + this.user?.login + "/" + t)
    if (t === null) {
      if (this.exemplaires) {
        const tab = this.exemplaires.filter(exem => exem.livre?.id === id && exem.disponibilite === true);
        if (tab) {
          return tab.length > 0 ? 'Oui' : 'Non';
        }
      }
    } else {
      const exemplaire = this.createFromFormExemplaire(id);
      this.subscribeToSaveResponse(this.exemplaireService.update(exemplaire));
      return 'retour';
    }
    return '';
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
    this.user = this.users.find(u => String(u.login) === String(this.account?.login)) || {};
  }

  trackId(index: number, item: ILivre): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
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
