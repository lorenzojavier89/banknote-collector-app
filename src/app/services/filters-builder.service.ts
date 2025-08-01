import { Injectable } from '@angular/core';
import { Country } from '../models/country.model';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { Region } from '../models/region.model';
import { Subregion } from '../models/subregion.model';
import { VolumeDetails } from '../models/volume-details.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersBuilderService {

  buildFromRegion(regionFilter: Region): AppliedFilter {
    return this.buildFromRegions([regionFilter], regionFilter.subregions ?? []);
  }

  buildFromSubregion(subregionFilter: Subregion): AppliedFilter {
    return this.buildFromRegions([], [subregionFilter]);
  }

  buildFromRegions(regionFilters: Region[], subregionFilters: Subregion[]): AppliedFilter {
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
      volumeFilter: null,
      volumeFilterName: null,
      someFiltersApplied,
      noFiltersApplied
    }    
  }

  buildFromIssuer(issuerFilter: Country | null): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: issuerFilter,
      issuerFilterCode: issuerFilter? issuerFilter.code : null,
      volumeFilter: null,
      volumeFilterName: null,
      someFiltersApplied: issuerFilter !== null,
      noFiltersApplied: issuerFilter === null
    }    
  }

  buildFromVolume(volumeFilter: VolumeDetails): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: null,
      issuerFilterCode: null,
      volumeFilter: volumeFilter,
      volumeFilterName: volumeFilter.name,
      someFiltersApplied: true,
      noFiltersApplied: false
    }  
  }

  buildEmtpy(): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: null,
      issuerFilterCode: null,
      volumeFilter: null,
      volumeFilterName: null,
      someFiltersApplied: false,
      noFiltersApplied: true
    }  
  }

  private Distinct(filters: any[]): any[] {
    let codes = new Set<string>();
    let results: any[] = []; 

    filters.forEach(f => {
        if(!codes.has(f.code)) {
            codes.add(f.code);
            results.push(f);
        }
    });

    return results;
  }
}
