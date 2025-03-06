import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { CatalogService } from './catalog.service';
import { FiltersBuilderService } from './filters-builder.service';
import { FilterItem } from '../models/filters/filter-item.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { Banknote } from '../models/banknote.model';
import { CounterType } from '../models/counter-type.model';
import { Volume } from '../models/volume.enum';

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

  private _loadedRegions = computed<FilterItem[]>(() => {
    const counters = this.catalogService.counters();
    
    return this.catalogService.regions().map<FilterItem>((r) => ({
      ...r,
      counter: counters.get(this.catalogService.getCounterKey(CounterType.RegionCode, r.code)) ?? 0,
      subItems: r.subregions.map<FilterItem>((sr) => ({
        ...sr,
        counter: counters.get(this.catalogService.getCounterKey(CounterType.SubregionCode, sr.code)) ?? 0,
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
    const counters = this.catalogService.counters();

    return this.catalogService.issuers().map<FilterItem>(i => ({
      ...i.country,
      counter: counters.get(this.catalogService.getCounterKey(CounterType.IssuerCode, i.country.code)) ?? 0,
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
    const counters = this.catalogService.counters();
    
    return Object.values(Volume).map<FilterItem>(v => ({
      code: v,
      name: v,
      counter: counters.get(this.catalogService.getCounterKey(CounterType.VolumeCode, v)) ?? 0
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
    const banknotes = this.catalogService.banknotes();

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

  applyVolumeFilter(volumeFilterItem: FilterItem) {
    this._appliedFilter.set(this.builderService.buildFromVolume(volumeFilterItem))
  }

  removeAllFilters() {
    this._appliedFilter.set(this.builderService.buildEmtpy());
  }
}

