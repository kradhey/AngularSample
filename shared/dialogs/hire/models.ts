
import { DialogHeader } from '../header/DialogHeader';



export class HireProfileDialog {
  public id: number;
  public header: DialogHeader;
  public projectType: string;
  public crewRoles: string[]
  public message: string;
  public dates: string[];
  public city: string;
  public state: string;
  public showTitle: boolean;
  public productionCompany: string;
  public songTitle:string;
  public artistTitle: string;
  public episodeTitle: string;
  public seriesTitle: string;
  public rate: number;
  public rateType: string;
  public newModeType:any;
  public projectName: string;
  constructor() {
    this.state = "";
    this.rateType="";
  }

}

export class HireProfileRequest {
  public projectType: string;
  public crewRoles: string[]
  public message: string;
  public productionCompany: string;
  public city: string;
  public state: string;
  public showTitle: boolean;
  public songTitle: string;
  public artistTitle: string;
  public episodeTitle: string;
  public seriesTitle: string;
  public dates: string[];
  public rate: number;
  public rateType: string;
  public projectName: string;
}


