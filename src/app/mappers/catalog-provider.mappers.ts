import { Banknote } from '../models/banknote.model';
import { CatalogProviderResponse } from '../models/catalog-provider-response.model';
import { ConditionType } from '../models/condition-type.enum';
import { Condition } from '../models/condition.model';
import { Issuer } from '../models/issuer.model';
import { Orientation } from '../models/orientation.enum';
import { Region } from '../models/region.model';
import { VolumeType } from '../models/volume-type.enum';

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

export function mapBanknotes(issuersLookup: Map<string, Issuer>, catalogApiResponse: CatalogProviderResponse[]): Banknote[] {
  return catalogApiResponse.map((item) => {
    const issuer = issuersLookup.get(item.issuerCode);
    const volume = getVolume(item.volume);
    const orientation = getOrientation(item.orientation);
    const { name, issuerName, issuerSubname, flagIcons } = getNamesAndFlags(
      issuer,
      item.issuerCode,
      item.issuerSubcode
    );
    const { issueMinDate, issueMaxDate } = getDates(item.issueDate);
    const condition = getCondition(item.condition);

    return {
      ...item,
      name,
      issuerName,
      issuerSubname,
      volume,
      flagIcons,
      regionCode: issuer?.regionCode,
      regionName: issuer?.regionName,
      subregionCode: issuer?.subregionCode,
      subregionName: issuer?.subregionName,
      orientation,
      issueMinDate,
      issueMaxDate,
      condition
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

function getVolume(value: string): VolumeType | null {
  const isValidStatus = Object.values(VolumeType).includes(value as VolumeType);
  if (isValidStatus) {
    return value as VolumeType;
  }

  return null;
}

function getDates(issueDate: string): { issueMinDate: number, issueMaxDate: number } {
  const issueDateNumber = Number(issueDate);
  if(isNaN(issueDateNumber)){
    const [issueMinDate, issueMaxDate] = issueDate.split('-').map(Number);
    return { issueMinDate, issueMaxDate };  
  }
  
  return { issueMinDate: issueDateNumber, issueMaxDate: issueDateNumber };
}

function getCondition(value: string): Condition | null {
  if (!value) {
    return null;
  }
  
  switch (value) {
    case 'Sin Circular':
      return { type: ConditionType.UNC, name: 'Sin Circular', shortName: 'SC', badgeClass: 'badge-condition-unc' };
    case 'Muy bueno':
      return { type: ConditionType.VeryGood, name: 'Muy bueno', shortName: 'MB', badgeClass: 'badge-condition-vgood' };
    case 'Bueno':
      return { type: ConditionType.Good, name: 'Bueno', shortName: 'B', badgeClass: 'badge-condition-good' };
    case 'Regular':
      return { type: ConditionType.Regular, name: 'Regular', shortName: 'R', badgeClass: 'badge-condition-reg' };
    case 'Malo':
      return { type: ConditionType.Bad, name: 'Malo', shortName: 'M', badgeClass: 'badge-condition-bad' };
    default:
      return null;
  }
}
