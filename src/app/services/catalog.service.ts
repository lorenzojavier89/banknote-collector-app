import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogApiResponse } from '../models/catalog-api-response.model';
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
  private catalogJsonUrl = 'assets/data/catalog.json';
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
                flagIcon: country.flagIcon
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

  private catalogApiResponse$ = this.http.get<CatalogApiResponse[]>(this.catalogJsonUrl);
  private catalog$ = forkJoin([
    this.issuersLookup$,
    this.catalogApiResponse$,
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
            imageUrl: item.imageUrl,
            comment: item.comment
          } as Banknote;
        });
      })
    );

  banknotes = toSignal(this.catalog$, { initialValue: [] });
  
  
  private selectedBanknoteSignal = signal<Banknote | undefined>(undefined);
  readonly selectedBanknote = this.selectedBanknoteSignal.asReadonly();

  selectBanknote(id: string) {
    const foundBanknote = this.banknotes().find((x) => x.id === id);
    this.selectedBanknoteSignal.set(foundBanknote);
  }
}
