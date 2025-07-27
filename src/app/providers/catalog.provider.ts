import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { mapBanknotes, mapIssuersLookup } from '../mappers/catalog-provider.mappers';
import { Banknote } from '../models/banknote.model';
import { CatalogProviderResponse } from '../models/catalog-provider-response.model';
import { CounterType } from '../models/counter-type.model';
import { Country } from '../models/country.model';
import { Issuer } from '../models/issuer.model';
import { Region } from '../models/region.model';
import { Subregion } from '../models/subregion.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogProvider {
  private http: HttpClient = inject(HttpClient);
  private catalogJsonUrl = 'assets/data/catalog.json';
  private issuersJsonUrl = 'assets/data/issuers.json';

  private regions$ = this.http.get<Region[]>(this.issuersJsonUrl).pipe(shareReplay(1));
  private _regions = toSignal(this.regions$, { initialValue: []});
  public regions = computed<Region[]>(() => {
    const counters = this.counters();
    
    return this._regions().map<Region>((r) => ({
      ...r,
      counter: counters.get(this.getCounterKey(CounterType.RegionCode, r.code)) ?? 0,
      subregions: r.subregions.map<Subregion>((sr) => ({
        ...sr,
        counter: counters.get(this.getCounterKey(CounterType.SubregionCode, sr.code)) ?? 0,
      })),
    }))
  });
    
  
  private issuersLookup$ = this.regions$.pipe(
    map((regions) => mapIssuersLookup(regions)),
    shareReplay(1)
  );
  private _issuersLookup = toSignal(this.issuersLookup$, { initialValue: new Map<string, Issuer>()});
  private _issuers = computed<Issuer[]>(() => 
    Array.from(this._issuersLookup().values())
    .sort((a, b) => a.country.name.localeCompare(b.country.name)));
  public countries = computed<Country[]>(() => {
    const counters = this.counters();

    return this._issuers().map<Country>(i => ({
      ...i.country,
      counter: counters.get(this.getCounterKey(CounterType.IssuerCode, i.country.code)) ?? 0,
    }))  
  });
     
  
  private catalogApiResponse$ = this.http.get<CatalogProviderResponse[]>(this.catalogJsonUrl);
  private catalog$ = forkJoin([
    this.issuersLookup$,
    this.catalogApiResponse$,
  ])
    .pipe<Banknote[]>(
      map(([issuersLookup, apiResponse]) => mapBanknotes(issuersLookup, apiResponse))
    );
  public banknotes = toSignal(this.catalog$, { initialValue: [] });
  
  

  counters = computed<Map<string,number>>(() => {
    const countMap = new Map<string, number>();
    
    this.banknotes().forEach(b => {

      const regionKey = this.getCounterKey(CounterType.RegionCode, b.regionCode);
      const subregionKey = this.getCounterKey(CounterType.SubregionCode, b.subregionCode);
      const issuerKey = this.getCounterKey(CounterType.IssuerCode, b.issuerCode);
      const issuerSubcodeKey = this.getCounterKey(CounterType.IssuerSubcode, b.issuerSubcode);
      const volumeKey = this.getCounterKey(CounterType.VolumeCode, b.volume ?? "unclassified");

      countMap.set(regionKey, (countMap.get(regionKey) || 0) + 1);
      countMap.set(subregionKey, (countMap.get(subregionKey) || 0) + 1);
      countMap.set(issuerKey, (countMap.get(issuerKey) || 0) + 1);
      countMap.set(issuerSubcodeKey, (countMap.get(issuerSubcodeKey) || 0) + 1);
      countMap.set(volumeKey, (countMap.get(volumeKey) || 0) + 1)
    });

    return countMap;
  });

  getCounterKey(type: CounterType, code: string): string {
    switch(type) {
      case CounterType.RegionCode: return `rc_${code}`;
      case CounterType.SubregionCode: return `src_${code}`;
      case CounterType.IssuerCode: return `ic_${code}`;
      case CounterType.IssuerSubcode: return `isc_${code}`;
      case CounterType.VolumeCode: return `vc_${code}`;
    }  
  }
    
  private readonly _selectedBanknote = signal<Banknote | undefined>(undefined);
  readonly selectedBanknote = this._selectedBanknote.asReadonly();

  selectBanknote(id: string) {
    const foundBanknote = this.banknotes().find((x) => x.id === id);
    this._selectedBanknote.set(foundBanknote);
  }
}
