import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CatalogApiResponse } from '../models/catalog-api-response.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';
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
  private issuersJsonUrl = 'assets/data/issuers.json';

  private regions$ = this.http.get<Region[]>(this.issuersJsonUrl).pipe(shareReplay(1));
  private issuers$ = this.regions$.pipe(
    map((data) => {
      const issuerLookup = new Map<string, Issuer>();

      data.forEach((region) => {
        region.subregions.forEach((subregion) => {
          subregion.issuers.forEach((country) => {
            issuerLookup.set(country.code, {
              country,
              subregionCode: subregion.code,
              subregionName: subregion.name,
              regionCode: region.code,
              regionName: region.name,
            });
          });
        });
      });

      return issuerLookup;
    }),
    shareReplay(1)
  );
  
  private catalogApiResponse$ = this.http.get<CatalogApiResponse[]>(this.catalogJsonUrl);
  private catalog$ = forkJoin([
    this.issuers$,
    this.catalogApiResponse$,
  ])
    .pipe<Banknote[]>(
      map(([issuerLookup, apiResponse]) => {
        return apiResponse.map((item) => {
          const issuer = issuerLookup.get(item.issuerCode);
          const { name, flagIcons } = this.getNameAndFlags(issuer,item.issuerCode,item.issuerSubcode);

          return {
            ...item,
            name,
            flagIcons,
            regionCode: issuer?.regionCode,
            subregionCode: issuer?.subregionCode,
          } as Banknote;
        });
      })
    );

  private getNameAndFlags(
    issuer: Issuer | undefined,
    issuerCode: string,
    issuerSubcode?: string
  ): { name: string; flagIcons: string[] } {
    if (!issuer) {
      return { name: '', flagIcons: [] };
    }
  
    if (!issuerSubcode) {
      return {
        name: issuer.country.name,
        flagIcons: issuer.country.flagIcons,
      };
    }
  
    if (issuerSubcode.startsWith(issuerCode)) {
      const historicalPeriod = issuer.country.historicalPeriods.find((x) => x.code === issuerSubcode);
      return {
        name: historicalPeriod?.name ?? '',
        flagIcons: historicalPeriod?.flagIcons ?? [],
      };
    }
  
    const subgroup = issuer.country.subgroups.find((x) => x.code === issuerSubcode);
    return {
      name: subgroup?.name ?? '',
      flagIcons: subgroup?.flagIcons ?? [],
    };
  }  

  banknotes = toSignal(this.catalog$, { initialValue: [] });
  regions = toSignal(this.regions$, { initialValue: []});
  issuersLookup = toSignal(this.issuers$, { initialValue: new Map<string, Issuer>()});
  issuers = computed<Issuer[]>(() => 
    Array.from(this.issuersLookup().values())
    .sort((a, b) => a.country.name.localeCompare(b.country.name)));

  counters = computed<Map<string,number>>(() => {
    const countMap = new Map<string, number>();
    this.banknotes().forEach(b => {
      countMap.set(b.regionCode, (countMap.get(b.regionCode) || 0) + 1);
      countMap.set(b.subregionCode, (countMap.get(b.subregionCode) || 0) + 1);
      countMap.set(b.issuerCode, (countMap.get(b.issuerCode) || 0) + 1);
      countMap.set(b.issuerSubcode, (countMap.get(b.issuerSubcode) || 0) + 1);
    });

    return countMap;
  });
    
  private readonly _selectedBanknote = signal<Banknote | undefined>(undefined);
  readonly selectedBanknote = this._selectedBanknote.asReadonly();

  selectBanknote(id: string) {
    const foundBanknote = this.banknotes().find((x) => x.id === id);
    this._selectedBanknote.set(foundBanknote);
  }
}
