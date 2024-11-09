import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FiltersBuilderService } from './filters-builder.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private catalogService: CatalogService = inject(CatalogService);
  private builderService: FiltersBuilderService = inject(FiltersBuilderService);

  private readonly _appliedFilter = signal<AppliedFilter>(JSON.parse(localStorage.getItem('appliedFilter')!) as AppliedFilter);
  appliedFilter = computed<AppliedFilter>(() => {
    return this._appliedFilter() ?? this.builderService.buildEmtpy();
  });
  
  constructor() {
    effect(() => {
      localStorage.setItem('appliedFilter', JSON.stringify(this.appliedFilter()));
    });
  }

  regions = computed<FilterItem[]>(() =>{
    const { regionFilterCodes, subregionFilterCodes } = { ...this.appliedFilter() };
    const counters = this.catalogService.counters();

    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      selected: regionFilterCodes.includes(r.code),
      counter: counters.get(`rc_${r.code}`) ?? 0,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        selected: subregionFilterCodes.includes(sr.code),
        counter: counters.get(`src_${sr.code}`) ?? 0,
      })),
    }))
  });

  issuers = computed<FilterItem[]>(() => {
    const { issuerFilterCode } = { ...this.appliedFilter() };
    const counters = this.catalogService.counters();

    return this.catalogService.issuers().map<FilterItem>(i => ({
      ...i.country,
      selected: issuerFilterCode === i.country.code,
      counter: counters.get(`ic_${i.country.code}`) ?? 0,
    }))  
  });

  banknotes = computed<Banknote[]>(() => {
    const appliedFilter = this.appliedFilter();
    const banknotes = this.catalogService.banknotes();

    if(appliedFilter.noFiltersApplied) {
      return banknotes;
    }

    return banknotes.filter((b) => {
        const matchesRegion = appliedFilter.regionFilters && appliedFilter.regionFilterCodes.includes(b.regionCode);
        const matchesSubregion = appliedFilter.subregionFilters && appliedFilter.subregionFilterCodes.includes(b.subregionCode);
        const matchesCountry = appliedFilter.issuerFilter && appliedFilter.issuerFilterCode === b.issuerCode;

        return matchesRegion || matchesSubregion || matchesCountry;
    });
  });

  applyRegionFilter(selected: boolean, clickedRegionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
    
    if(selected) {
      regionFilters.push(clickedRegionFilter);
      subregionFilters.push(...clickedRegionFilter.subItems || []);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code)
      subregionFilters = subregionFilters.filter(srf => !clickedRegionFilter.subItems?.map(i => i.code).includes(srf.code));
    }
    
    this._appliedFilter.set(this.builderService.buildFromRegions(regionFilters, subregionFilters));
  }

  applySubregionFilter(selected: boolean, clickedRegionFilter: FilterItem, clickedSubregionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
    
    if(selected) {
      subregionFilters.push(clickedSubregionFilter);
    }
    else {
      regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code);
      subregionFilters = subregionFilters.filter(srf => srf.code != clickedSubregionFilter.code);
    }

    this._appliedFilter.set(this.builderService.buildFromRegions(regionFilters, subregionFilters));
  }

  applyIssuerFilter(selected: boolean, issuerFilterItem: FilterItem) {
    const issuerFilter = selected ? issuerFilterItem : null;
    
    this._appliedFilter.set(this.builderService.buildFromIssuer(issuerFilter));
  }

  removeAllFilters() {
    this._appliedFilter.set(this.builderService.buildEmtpy());
  }
}
