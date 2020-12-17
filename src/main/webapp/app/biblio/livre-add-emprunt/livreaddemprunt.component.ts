import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEmprunt, Emprunt } from 'app/shared/model/emprunt.model';
import { EmpruntService } from '../../entities/emprunt/emprunt.service';
import { IExemplaire, Exemplaire } from 'app/shared/model/exemplaire.model';
import { ExemplaireService } from 'app/entities/exemplaire/exemplaire.service';
import { IUser, User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

type SelectableEntity = IExemplaire | IUser;

@Component({
  selector: 'jhi-livreaddemprunt',
  templateUrl: './livreaddemprunt.component.html',
  styleUrls: ['./livreaddemprunt.component.scss'],
})
export class LivreAddEmpruntComponent implements OnInit {
  account: Account | null = null;
  authSubscription?: Subscription;
  isSaving = false;
  exemplaires: IExemplaire[] = [];
  exemplaire: IExemplaire = {};
  users: IUser[] = [];
  dateEmpruntDp: any;

  editForm = this.fb.group({
    id: [],
    dateEmprunt: [null, [Validators.required]],
    exemplaire: [],
    user: [],
  });

  constructor(
    protected empruntService: EmpruntService,
    protected exemplaireService: ExemplaireService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emprunt }) => {
      this.updateForm(emprunt);

      this.exemplaireService
        .query({ filter: 'emprunt-is-null' })
        .pipe(
          map((res: HttpResponse<IExemplaire[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IExemplaire[]) => {
          if (!emprunt.exemplaire || !emprunt.exemplaire.id) {
            this.exemplaires = resBody;
          } else {
            this.exemplaireService
              .find(emprunt.exemplaire.id)
              .pipe(
                map((subRes: HttpResponse<IExemplaire>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IExemplaire[]) => (this.exemplaires = concatRes));
          }
        });

      this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => (this.users = res.body || []));
      this.exemplaireService.query().subscribe((res: HttpResponse<IExemplaire[]>) => (this.exemplaires = res.body || []));
    });
  }

  updateForm(emprunt: IEmprunt): void {
    this.editForm.patchValue({
      id: emprunt.id,
      dateEmprunt: emprunt.dateEmprunt,
      exemplaire: emprunt.exemplaire,
      user: emprunt.user,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emprunt = this.createFromFormEmprunt();
    this.subscribeToSaveResponse(this.empruntService.create(emprunt));
    const exemplaire = this.createFromFormExemplaire();
    this.subscribeToSaveResponse(this.exemplaireService.update(exemplaire));
  }

  getExemplaire(): IExemplaire {
    let ex = new Exemplaire();
    ex =
      this.exemplaires.find(e => e.disponibilite === true && e.livre?.id === Number(this.activatedRoute.snapshot.params['idlivre'])) || {};
    return ex;
  }

  getUser(): IUser {
    let user = new User();
    this.users.forEach(u => {
      if (u.login === this.account?.login) {
        user = u;
      }
    });
    return user;
  }

  private createFromFormEmprunt(): IEmprunt {
    const ex = this.getExemplaire();
    const u = this.getUser();
    return {
      ...new Emprunt(),
      dateEmprunt: this.editForm.get(['dateEmprunt'])!.value,
      exemplaire: ex,
      user: u,
    };
  }

  private createFromFormExemplaire(): IExemplaire {
    const ex = this.getExemplaire();
    return {
      ...new Exemplaire(),
      id: ex.id,
      disponibilite: false,
      livre: ex.livre,
    };
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

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
