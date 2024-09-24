import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BanknoteApiResponse } from '../models/banknote-api-response.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Region } from '../models/region.model';
import { Issuer } from '../models/issuer.model';
import { forkJoin } from 'rxjs';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private http: HttpClient = inject(HttpClient);
  private banknotesJsonUrl = 'assets/data/banknotes.json';
  private countriesJsonUrl = 'assets/data/countries.json';

  private regions$ = this.http.get<Region[]>(this.countriesJsonUrl);
  private issuersLookup$ = this.regions$.pipe<Map<string, Issuer>>(
    map((data) => {
      const issuerLookup = new Map<string, Issuer>();

      data.forEach((region) => {
        region.subregions.forEach((subregion) => {
          subregion.countries.forEach((country) => {
            issuerLookup.set(country.code, {
              country: {
                code: country.code,
                name: country.name,
              },
              subregionCode: subregion.code,
              subregionName: subregion.name,
              regionCode: region.code,
              regionName: region.name,
            });
          });
        });
      });

      return issuerLookup;
    })
  );

  private banknotesApiResponse$ = this.http.get<BanknoteApiResponse[]>(this.banknotesJsonUrl);
  private banknotes$ = forkJoin([
    this.issuersLookup$,
    this.banknotesApiResponse$,
  ])
    .pipe<Banknote[]>(
      map(([issuerLookup, apiResponse]) => {
        return apiResponse.map((item) => {
          const issuer = issuerLookup.get(item.issuerCode);
          return {
            id: item.id,
            order: item.order,
            volume: item.volume,
            issuer,
            issueDate: item.issueDate,
            denomination: item.denomination,
            onlineCatalog: item.onlineCatalog,
            comment: item.comment
          } as Banknote;
        });
      })
    );

  banknotes = toSignal(this.banknotes$, { initialValue: [] });
  selectedBanknote = signal<Banknote | undefined>(undefined);

  setSelectedBanknote(id: string) {
    const foundBanknote = this.banknotes().find((x) => x.id === id);
    this.selectedBanknote.set(foundBanknote);
  }
}
