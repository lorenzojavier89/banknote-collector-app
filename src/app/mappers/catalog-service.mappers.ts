import { Banknote } from '../models/banknote.model';
import { CatalogApiResponse } from '../models/catalog-api-response.model';
import { Issuer } from '../models/issuer.model';
import { Orientation } from '../models/orientation.enum';
import { Region } from '../models/region.model';
import { Volume } from '../models/volume.enum';

export function mapIssuersLookup(regions: Region[]): Map<string, Issuer> {
  const issuerLookup = new Map<string, Issuer>();

  regions.forEach((region) => {
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
}

export function mapBanknotes(issuersLookup: Map<string, Issuer>, catalogApiResponse: CatalogApiResponse[]): Banknote[] {
  return catalogApiResponse.map((item) => {
    const issuer = issuersLookup.get(item.issuerCode);
    const volume = getVolume(item.volume);
    const orientation = getOrientation(item.orientation);
    const { name, issuerName, issuerSubname, flagIcons } = getNamesAndFlags(
      issuer,
      item.issuerCode,
      item.issuerSubcode
    );

    return {
      ...item,
      name,
      issuerName,
      issuerSubname,
      volume,
      flagIcons,
      regionCode: issuer?.regionCode,
      subregionCode: issuer?.subregionCode,
      orientation,
    } as Banknote;
  });
}

function getNamesAndFlags(issuer: Issuer | undefined, issuerCode: string, issuerSubcode?: string): 
  { name: string; issuerName: string, issuerSubname: string, flagIcons: string[] } {
  if (!issuer) {
    return { name: '', issuerName: '', issuerSubname: '', flagIcons: [] };
  }

  if (!issuerSubcode) {
    return {
      name: issuer.country.name,
      issuerName: issuer.country.name,
      issuerSubname: '',
      flagIcons: issuer.country.flagIcons,
    };
  }

  if (issuerSubcode.startsWith(issuerCode)) {
    const historicalPeriod = issuer.country.historicalPeriods.find(
      (x) => x.code === issuerSubcode
    );
    return {
      name: historicalPeriod?.name ?? '',
      issuerName: issuer.country.name,
      issuerSubname: historicalPeriod?.name ?? '',
      flagIcons: historicalPeriod?.flagIcons ?? [],
    };
  }

  const subgroup = issuer.country.subgroups.find(
    (x) => x.code === issuerSubcode
  );
  return {
    name: subgroup?.name ?? '',
    issuerName: issuer.country.name,
    issuerSubname: subgroup?.name ?? '',
    flagIcons: subgroup?.flagIcons ?? [],
  };
}

function getOrientation(value: string): Orientation {
  return value === 'v' ? Orientation.Vertical : Orientation.Horizontal;
}

function getVolume(value: string): Volume | null {
  const isValidStatus = Object.values(Volume).includes(value as Volume);
  if (isValidStatus) {
    return value as Volume;
  }

  return null;
}
