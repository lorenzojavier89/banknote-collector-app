import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Banknote } from '../models/banknote.model';
import { CounterType } from '../models/counter-type.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { FilterItem } from '../models/filters/filter-item.model';
import { Region } from '../models/region.model';
import { SortState, SortStateKey } from '../models/sort-state.model';
import { Subregion } from '../models/subregion.model';
import { VolumeType } from '../models/volume-type.enum';
import { CatalogApiService } from './catalog-api.service';
import { FiltersBuilderService } from './filters-builder.service';
import { VolumesService } from './volumes.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private catalogApiService: CatalogApiService = inject(CatalogApiService);
  private filtersBuilder: FiltersBuilderService = inject(FiltersBuilderService);
  private volumeService: VolumesService = inject(VolumesService);

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

  private _loadedRegions = computed<Region[]>(() => {
    const counters = this.catalogApiService.counters();
    
    return this.catalogApiService.regions().map<Region>((r) => ({
      ...r,
      counter: counters.get(this.catalogApiService.getCounterKey(CounterType.RegionCode, r.code)) ?? 0,
      subregions: r.subregions.map<Subregion>((sr) => ({
        ...sr,
        counter: counters.get(this.catalogApiService.getCounterKey(CounterType.SubregionCode, sr.code)) ?? 0,
      })),
    }))
  });

  regions = computed<Region[]>(() =>{
    const { regionFilterCodes, subregionFilterCodes } = { ...this.appliedFilter() };

    return this._loadedRegions().map((r) => ({
      ...r,
      selected: regionFilterCodes.includes(r.code),
      subregions: r.subregions?.map<Subregion>((sr) => ({ 
        ...sr,
        selected: subregionFilterCodes.includes(sr.code)
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
    const volumeDetails = this.volumeService.volumeDetails();
    
    return Object.values(VolumeType).map<FilterItem>(v => ({
      code: v,
      name: v,
      counter: counters.get(this.catalogApiService.getCounterKey(CounterType.VolumeCode, v)) ?? 0,
      subItems: volumeDetails.find(d => d.name === v)?.details.map<FilterItem>(d => ({
        code: d,
        name: d,
      })) || [],
    }))
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
        case 'rarityIndex-asc':
          if (a.rarityIndex == null && b.rarityIndex == null) return 0;
          if (a.rarityIndex == null) return 1;
          if (b.rarityIndex == null) return -1;
          return a.rarityIndex - b.rarityIndex;
        case 'rarityIndex-desc':
          if (a.rarityIndex == null && b.rarityIndex == null) return 0;
          if (a.rarityIndex == null) return 1;
          if (b.rarityIndex == null) return -1;
          return b.rarityIndex - a.rarityIndex;
        default:
          return 0;
      }
    });

    return sortedBanknotes;
  });

  changeRegion(region: Region) {
    this._appliedFilter.set(this.filtersBuilder.buildFromRegion(region));
  }

  addAnotherRegion(region: Region) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
    
    regionFilters.push(region);
    subregionFilters.push(...region.subregions || []);
    
    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  removeRegion(region: Region) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };

    regionFilters = regionFilters.filter(rf => rf.code != region.code)
    subregionFilters = subregionFilters.filter(srf => !region.subregions?.map(i => i.code).includes(srf.code));

    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  changeSubregion(subregion: Subregion) {
    this._appliedFilter.set(this.filtersBuilder.buildFromSubregion(subregion));
  }

  addAnotherSubregion(subregion: Subregion) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
    
    subregionFilters.push(subregion);
    
    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  removeSubregion(region: Region, subregion: Subregion) {
    let { regionFilters, subregionFilters } = { ...this.appliedFilter() };
        
    regionFilters = regionFilters.filter(rf => rf.code != region.code);
    subregionFilters = subregionFilters.filter(srf => srf.code != subregion.code);
    
    this._appliedFilter.set(this.filtersBuilder.buildFromRegions(regionFilters, subregionFilters));
  }

  changeIssuer(selected: boolean, issuer: FilterItem) {
    const issuerFilter = selected ? issuer : null;
    
    this._appliedFilter.set(this.filtersBuilder.buildFromIssuer(issuerFilter));
  }

  changeVolume(volume: FilterItem) {
    this._appliedFilter.set(this.filtersBuilder.buildFromVolume(volume))
  }

  removeAllFilters() {
    this._appliedFilter.set(this.filtersBuilder.buildEmtpy());
  }

  setSortState(sortState: SortState) {
    this._sortState.set(sortState);
  }
}

