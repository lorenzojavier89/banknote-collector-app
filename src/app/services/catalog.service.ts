import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Banknote } from '../models/banknote.model';
import { CounterType } from '../models/counter-type.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { FilterItem } from '../models/filters/filter-item.model';
import { SortState, SortStateKey } from '../models/sort-state.model';
import { Volume } from '../models/volume.enum';
import { CatalogApiService } from './catalog-api.service';
import { FiltersBuilderService } from './filters-builder.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private catalogApiService: CatalogApiService = inject(CatalogApiService);
  private filtersBuilder: FiltersBuilderService = inject(FiltersBuilderService);

  private readonly _appliedFilter = signal<AppliedFilter>(JSON.parse(localStorage.getItem('appliedFilter')!) as AppliedFilter);
  appliedFilter = computed<AppliedFilter>(() => {
    return this._appliedFilter() ?? this.filtersBuilder.buildEmtpy();
  });

  private readonly _sortState = signal<SortState>({ active: 'order', direction: '' });
  sortStateKey = computed<SortStateKey>(() => {
    const { active, direction } = this._sortState();
    return `${active}-${direction}`;
  });

  constructor() {
    effect(() => {
      localStorage.setItem('appliedFilter', JSON.stringify(this.appliedFilter()));
    });
  }

  private _loadedRegions = computed<FilterItem[]>(() => {
    const counters = this.catalogApiService.counters();
    
    return this.catalogApiService.regions().map<FilterItem>((r) => ({
      ...r,
      counter: counters.get(this.catalogApiService.getCounterKey(CounterType.RegionCode, r.code)) ?? 0,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        counter: counters.get(this.catalogApiService.getCounterKey(CounterType.SubregionCode, sr.code)) ?? 0,
      })),
    }))
  });

  regions = computed<FilterItem[]>(() =>{
    const { regionFilterCodes, subregionFilterCodes } = { ...this.appliedFilter() };

    return this._loadedRegions().map((r) => ({
      ...r,
      selected: regionFilterCodes.includes(r.code),
      subItems: r.subItems?.map<FilterItem>((si) => ({ 
        ...si,
        selected: subregionFilterCodes.includes(si.code)
      }))
    }))
  });

  private _loadedIssuers = computed<FilterItem[]>(() => {
    const counters = this.catalogApiService.counters();

    return this.catalogApiService.issuers().map<FilterItem>(i => ({
      ...i.country,
      counter: counters.get(this.catalogApiService.getCounterKey(CounterType.IssuerCode, i.country.code)) ?? 0,
      subItems: [
        ...i.country.historicalPeriods.map<FilterItem>(hp => ({ ...hp })),
        ...i.country.subgroups.map<FilterItem>(sg => ({ ...sg }))
      ]
    }))  
  });

  issuers = computed<FilterItem[]>(() => {
    const { issuerFilterCode } = { ...this.appliedFilter() };

    return this._loadedIssuers().map<FilterItem>(i => ({
      ...i,
      selected: issuerFilterCode === i.code,
    }))  
  });

  private _loadedVolumes = computed<FilterItem[]>(() => {
    const counters = this.catalogApiService.counters();
    
    return Object.values(Volume).map<FilterItem>(v => ({
      code: v,
      name: v,
      counter: counters.get(this.catalogApiService.getCounterKey(CounterType.VolumeCode, v)) ?? 0
    }));
  });

  volumes = computed<FilterItem[]>(() => { 
    const { volumeFilterCode } = { ...this.appliedFilter() };

    return this._loadedVolumes().map<FilterItem>(i => ({
      ...i,
      selected: volumeFilterCode === i.code,
    }))  
  });

  banknotes = computed<Banknote[]>(() => {
    const appliedFilter = this.appliedFilter();
    const banknotes = this.catalogApiService.banknotes();

    if(appliedFilter.noFiltersApplied) {
      return banknotes;
    }

    return banknotes.filter((b) => {
        const matchesRegion = appliedFilter.regionFilters && appliedFilter.regionFilterCodes.includes(b.regionCode);
        const matchesSubregion = appliedFilter.subregionFilters && appliedFilter.subregionFilterCodes.includes(b.subregionCode);
        const matchesIssuer = appliedFilter.issuerFilter && appliedFilter.issuerFilterCode === b.issuerCode;
        const matchesVolume = appliedFilter.volumeFilter && appliedFilter.volumeFilterCode === b.volume;

        return matchesRegion || matchesSubregion || matchesIssuer || matchesVolume;
    });
  });

  sortedBanknotes = computed<Banknote[]>(() => {
    const sortKey = this.sortStateKey();
    const banknotesCopy = [...this.banknotes()];

    const sortedBanknotes = banknotesCopy.sort((a, b) => {
      switch (sortKey) {
        case 'order-asc':
          return a.order - b.order;
        case 'order-desc':
          return b.order - a.order;
        case 'issueDate-asc':
          const issueMinDateDifference = a.issueMinDate - b.issueMinDate;
          if (issueMinDateDifference !== 0) {
            return issueMinDateDifference;
          }
          return a.issueMaxDate - b.issueMaxDate;
        case 'issueDate-desc':
          const issueMaxDateDifference = b.issueMaxDate - a.issueMaxDate;
          if (issueMaxDateDifference !== 0) {
            return issueMaxDateDifference;
          }
          return b.issueMinDate - a.issueMinDate;
        default:
          return 0;
      }
    });

    return sortedBanknotes;
  });

  replaceRegionFilter(clickedRegionFilter: FilterItem) {
    this._appliedFilter.set(this.filtersBuilder.buildFromRegion(clickedRegionFilter));
  }

  appendRegionFilter(clickedRegionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
    
    regionFilters.push(clickedRegionFilter);
    subregionFilters.push(...clickedRegionFilter.subItems || []);
    
    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  removeRegionFilter(clickedRegionFilter: FilterItem) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };

    regionFilters = regionFilters.filter(rf => rf.code != clickedRegionFilter.code)
    subregionFilters = subregionFilters.filter(srf => !clickedRegionFilter.subItems?.map(i => i.code).includes(srf.code));

    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
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

    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  applyIssuerFilter(selected: boolean, issuerFilterItem: FilterItem) {
    const issuerFilter = selected ? issuerFilterItem : null;
    
    this._appliedFilter.set(this.filtersBuilder.buildFromIssuer(issuerFilter));
  }

  applyVolumeFilter(volumeFilterItem: FilterItem) {
    this._appliedFilter.set(this.filtersBuilder.buildFromVolume(volumeFilterItem))
  }

  removeAllFilters() {
    this._appliedFilter.set(this.filtersBuilder.buildEmtpy());
  }

  setSortState(sortState: SortState) {
    this._sortState.set(sortState);
  }
}

