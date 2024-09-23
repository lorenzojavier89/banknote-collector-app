import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BanknoteApiResponse } from '../models/banknote-api-response.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private http: HttpClient = inject(HttpClient);
  private jsonUrl = 'assets/data/banknotes.json';

  private banknotes$ = this.http.get<BanknoteApiResponse[]>(this.jsonUrl);
  banknotes = toSignal(this.banknotes$, { initialValue: [] });
  selectedBanknote = signal<BanknoteApiResponse | undefined>(undefined);

  setSelectedBanknote(id: string) {
    const foundBanknote = this.banknotes().find(x => x.id === id); 
    this.selectedBanknote.set(foundBanknote);
  }
}
