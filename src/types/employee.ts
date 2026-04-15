export interface Vehicle {
  id:number;
  TsId: number;
  plate: string;
  type: string;
  sub_fleet: string;
  subFleet:string;
  fleet: string;
  isGarbageTruck: boolean;
  company: string;
  containerSize: string;
  fuelAlertPercentage: number;
}
