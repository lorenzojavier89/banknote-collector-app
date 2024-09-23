import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banknote } from '../models/banknote.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private http: HttpClient = inject(HttpClient);
  private jsonUrl = 'assets/data/catalog.json';

  private banknotes$ = this.http.get<Banknote[]>(this.jsonUrl);
  banknotes = toSignal(this.banknotes$, { initialValue: [] });
}
