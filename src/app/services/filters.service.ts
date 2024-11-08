import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);

  private readonly _appliedFilter = signal<AppliedFilter>(this.buildEmtpy());
  readonly appliedFilter = this._appliedFilter.asReadonly();

  constructor() {
    effect(() => {
      console.log(this._appliedFilter());
    });
  }

  regionsFilter = computed<FilterItem[]>(() =>{
    const { regionFilterCodes, subregionFilterCodes } = { ...this._appliedFilter() };

    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: regionFilterCodes.includes(r.code),
      highlighted: false,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: subregionFilterCodes.includes(sr.code),
        highlighted: false,
      })),
    }))
  });

  issuersFilter = computed<FilterItem[]>(() => {
    const { issuerFilterCode } = { ...this._appliedFilter() };

    return this.catalogService.issuers().map<FilterItem>(i => ({
      ...i.country,
      selected: issuerFilterCode === i.country.code,
      highlighted: false
    }))
  });

  filteredBanknotes = computed<Banknote[]>(() => {
    const appliedFilter = this._appliedFilter();
    const banknotes = this.catalogService.banknotes();

    if(appliedFilter.noFiltersApplied) {
      return banknotes;
    }

    return banknotes.filter((b) => {
        const matchesRegion = appliedFilter.regionFilters && appliedFilter.regionFilterCodes.includes(b.issuer.regionCode);
        const matchesSubregion = appliedFilter.subregionFilters && appliedFilter.subregionFilterCodes.includes(b.issuer.subregionCode);
        const matchesCountry = appliedFilter.issuerFilter && appliedFilter.issuerFilterCode === b.issuer.country.code;

        return matchesRegion || matchesSubregion || matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, clickedRegionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this._appliedFilter() };
    
    if(selected) {
      regionFilters.push(clickedRegionFilter);
      subregionFilters.push(...clickedRegionFilter.subItems || []);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code)
      subregionFilters = subregionFilters.filter(srf => !clickedRegionFilter.subItems?.map(i => i.code).includes(srf.code));
    }
    
    this._appliedFilter.set(this.buildFromRegions(regionFilters, subregionFilters));
  }

  applySubregionFilter(selected: boolean, clickedRegionFilter: FilterItem, clickedSubregionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this._appliedFilter() };
    
    if(selected) {
      subregionFilters.push(clickedSubregionFilter);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code);
      subregionFilters = subregionFilters.filter(srf => srf.code != clickedSubregionFilter.code);
    }

    this._appliedFilter.set(this.buildFromRegions(regionFilters, subregionFilters));
  }

  applyCountryFilter(selected: boolean, issuerFilterItem: FilterItem) {
    const issuerFilter = selected ? issuerFilterItem : null;
    
    this._appliedFilter.set(this.buildFromIssuer(issuerFilter));
  }

  removeAllFilters() {
    this._appliedFilter.set(this.buildEmtpy());
  }

  private buildFromRegions(regionFilters: FilterItem[], subregionFilters: FilterItem[]): AppliedFilter {
    const dRegionFilters = this.Distinct(regionFilters);
    const dSubregionFilters = this.Distinct(subregionFilters);
    const someFiltersApplied = dRegionFilters.length > 0 || dSubregionFilters.length > 0;
    const noFiltersApplied = !someFiltersApplied;
        
    return {
      regionFilters: dRegionFilters,
      regionFilterCodes: dRegionFilters.map(rf => rf.code),
      subregionFilters: dSubregionFilters,
      subregionFilterCodes: dSubregionFilters.map(srf => srf.code),
      issuerFilter: null,
      issuerFilterCode: null,
      someFiltersApplied,
      noFiltersApplied
    }    
  }

  private buildFromIssuer(issuerFilterItem: FilterItem | null): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: issuerFilterItem,
      issuerFilterCode: issuerFilterItem? issuerFilterItem.code : null,
      someFiltersApplied: issuerFilterItem !== null,
      noFiltersApplied: issuerFilterItem === null
    }    
  }

  private buildEmtpy(): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: null,
      issuerFilterCode: null,
      someFiltersApplied: false,
      noFiltersApplied: true
    }  
  }

  private Distinct(filters: FilterItem[]): FilterItem[] {
    let codes = new Set<string>();
    let results: FilterItem[] = []; 

    filters.forEach(f => {
        if(!codes.has(f.code)) {
            codes.add(f.code);
            results.push(f);
        }
    });

    return results;
  }
}
