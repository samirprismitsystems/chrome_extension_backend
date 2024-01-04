export interface ISetting {
    appID: string;
    secretKey: string;
}


export interface ISettingInfo {
    settingID: string;
    aliExpress: ISetting;
    sallaAccount: ISetting;

}