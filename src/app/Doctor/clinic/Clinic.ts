import { Assist } from "./Assistant";

export interface Clinic{
  id:number;
  email:string;
  name:string;
  location:string;
  Phone:string;
  description:string;
  examination:number;

  assist:Assist[];

  images: Image[]; // Add an array to store images

}
export interface Image{
  id:number;
  ImageUrl:File;
}
