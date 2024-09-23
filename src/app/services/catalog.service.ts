import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BanknoteApiResponse } from '../models/banknote-api-response.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Country } from '../models/country.model';
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
      
      data.forEach(region => {
        region.subregions.forEach(subregion => {
          subregion.countries.forEach(country => {
            issuerLookup.set(country.code, {
              country: {
                code: country.code,
                name: country.name,
              },
              subregion: {
                code: subregion.code,
                name: subregion.name,
                countries: [],
              },
              region: {
                code: region.code,
                name: region.name,
                subregions: []
              }
            });
          });
        });
      });

      return issuerLookup;
    })
  );

  private banknotesApiResponse$ = this.http.get<BanknoteApiResponse[]>(this.banknotesJsonUrl);
  private banknotes$ = forkJoin([this.issuersLookup$, this.banknotesApiResponse$]).pipe(
    map(([issuerLookup, apiResponse]) => {
      return apiResponse.map(item => {
        const issuer = issuerLookup.get(item.issuerCode);
        debugger;

        return item;
      });
    })
  ).subscribe();
  
  
  banknotes = toSignal(this.banknotesApiResponse$, { initialValue: [] });
  selectedBanknote = signal<BanknoteApiResponse | undefined>(undefined);

  setSelectedBanknote(id: string) {
    const foundBanknote = this.banknotes().find(x => x.id === id); 
    this.selectedBanknote.set(foundBanknote);
  }
}
