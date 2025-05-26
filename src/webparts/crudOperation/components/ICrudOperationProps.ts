import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudOperationProps {
siteurl:string;
ListName:string;
context:WebPartContext;
}
