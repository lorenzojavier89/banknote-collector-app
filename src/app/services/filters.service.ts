import { computed, inject, Injectable, signal } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { Filter } from '../models/filters/filter.model';
import { Banknote } from '../models/banknote.model';
import { Issuer } from '../models/issuer.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);

  private readonly _appliedFilter = signal<Filter>({
    regionCode: '',
    subregionCode: '',
    countryCode: ''
  });

  regionsFilter = computed<FilterItem[]>(() =>
    this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: this._appliedFilter().regionCode === r.code,
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: this._appliedFilter().subregionCode === sr.code,
        highlighted: false,
      })),
    }))
  );

  private _issuers = computed<Issuer[]>(() => 
    Array.from(this.catalogService.issuers().values())
      .sort((a, b) => a.country.name.localeCompare(b.country.name)));
  
  issuersFilter = computed<FilterItem[]>(() => 
    this._issuers().map<FilterItem>(i => ({
      ...i.country,
      selected: this._appliedFilter().countryCode === i.country.code,
      highlighted: false
    }))
  );

  filteredBanknotes = computed<Banknote[]>(() => {
    const appliedFilter = this._appliedFilter();
    const banknotes = this.catalogService.banknotes();
    
    if(appliedFilter.regionCode){
      return banknotes.filter((b) => b.issuer.regionCode === appliedFilter.regionCode);
    }

    if(appliedFilter.subregionCode){
      return banknotes.filter((b) => b.issuer.subregionCode === appliedFilter.subregionCode);
    }

    if(appliedFilter.countryCode){
      return banknotes.filter((b) => b.issuer.country.code === appliedFilter.countryCode);
    }   

    return banknotes;
  });

  applyRegionFilter(selected: boolean, code: string) {
    const regionCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode,
      subregionCode: '',
      countryCode: '' 
    });
  }

  applySubregionFilter(selected: boolean, code: string) {
    const subregionCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode: '',
      subregionCode,
      countryCode: '' 
    });
  }

  applyCountryFilter(selected: boolean, code: string) {
    const countryCode = selected ? code : '';
    
    this._appliedFilter.set({ 
      regionCode: '',
      subregionCode: '',
      countryCode 
    });
  }
}
