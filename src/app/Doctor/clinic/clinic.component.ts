import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Mode } from '../register-doctor/Mode';
import { ReceivedData } from '../register-doctor/received-data';
import { Clinic } from './Clinic';
import { Observable } from 'rxjs';
import { Assist } from './Assistant';
import { LoaderService } from 'src/app/Service/loader.service';
interface AssistGet {
  id: number;
  phone: string;
  name: string;
}

interface ClinicGet {
  id: number;
  name: string;
  description: string;
  examination: number;
  phone: string;
  location: string;
    imagesURL: string[];

  assist: AssistGet[];
  images: ImageDto[];
}
export interface ClinicForm{
  id:number;
  email:string;
  name:string;
  location:string;
  Phone:string;
  description:string;
  examination:number;
  files: File[] ;

  assist:Assist[];
  fileAsBase64: string[];
  imagesURL: string[];
  images: any[]; // Add an array to store images

}
interface ImageDto {
  id: number;
  imageUrl: string;
}
interface Image {
  id: number;
  imageUrl: File;
}
// Define a TypeScript interface for the data sent to the API
interface DoctorReturn {
  email: string;
}
@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements OnInit{
  base64:string|undefined='assets/profile1.png'
  userName:string=''
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  selectResult: number = 0;
form:ClinicForm[]=[]
revMessage:string=''
reviewed:boolean=false;
clinicGet: ClinicGet[] = []
  constructor(private http:HttpClient,private activatedroute:ActivatedRoute,public loader:LoaderService) {
   }





    ngOnInit(): void {
      this.userName = String(this.activatedroute.snapshot.paramMap.get("Name"));

      this.fetchClinicData();


    }
    fetchClinicData(): void {
      const email = localStorage.getItem("email");

      this.http.post<ClinicGet[]>('https://localhost:7213/api/Doctor/get-clinices', { 'email': email }).subscribe(
        (response) => {
          // Clear existing form data
          this.form = [];

          // Push each clinic into the form array
          response.forEach((clinic) => {
            // Modify image URLs here
            const imagesURL = clinic.images.map((image) => {
              return image.imageUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\');
            });

            this.form.push({
              id: clinic.id,
              email: '', // Make sure to adjust this based on your requirements
              name: clinic.name,
              location: clinic.location,
              Phone: clinic.phone,
              examination: clinic.examination,
              description: clinic.description,
              assist: clinic.assist,
              imagesURL: imagesURL,
              images:[],
              fileAsBase64:[],
              files:[]
            });
          });
          for(let i =0;i<this.form.length;i++){
            this.currentIndex.push(0)
            this.currentIndexGet.push(0)

          }
        },
        (error) => {
          console.error('Error fetching clinic data:', error);
        }
      );
    }



    send(i: number): void {
      const patientEmail = localStorage.getItem("email");
      if (patientEmail) {
          this.form[i].email = patientEmail;
      }

      console.log(this.form[i]);

      const form = new FormData();
      form.append('id', this.form[i].id.toString());
      form.append('name', this.form[i].name);
      form.append('location', this.form[i].location);
      form.append('Phone', this.form[i].Phone);
      form.append('description', this.form[i].description);
      form.append('examination', this.form[i].examination.toString());

      // Append each Assist object individually to the FormData
      for (let j = 0; j < this.form[i].assist.length; j++) {
          form.append('assist[' + j + '].Id', this.form[i].assist[j].id.toString());
          form.append('assist[' + j + '].Name', this.form[i].assist[j].name);
          form.append('assist[' + j + '].Phone', this.form[i].assist[j].phone);
      }

      for (let j = 0; j < this.form[i].images.length; j++) {
        form.append('images[' + j + '].Id', this.form[i].images[j].id.toString());
        form.append('images[' + j + '].Image', this.form[i].images[j].imageUrl);
    }

      this.form[i].imagesURL.forEach((image, index) => {
          form.append('imagesURL', image);
      });

      form.append('email', this.form[i].email);

      console.log(form);

      this.update(form).subscribe(
          (response) => {
            this.revMessage="Clinic Added Successfully"
            this.reviewed = true;
            setTimeout(() => {
              this.reviewed = false;
            }, 5000);
          },
          (error) => {
              console.error('Error updating clinic:', error);
          }
      );
  }



  update(form:FormData):Observable<ClinicGet>{
    return this.http.post<ClinicGet>('https://localhost:7213/api/Doctor/update-clinic',form);
  }
  processFiles(files: FileList, id: number): void {
    // Add the new files to the existing files array
    this.form[id].files = [...this.form[id].files, ...Array.from(files)];
    console.log(this.form[id].files)
    // Add the new files to the images array
// Assuming files is an array of files
Array.from(files).forEach((file, index) => {
  this.form[id].images.push({ id: index, imageUrl: file });
});
console.log(this.form[id].images)
    // Process each new file to generate its Base64 URL
    this.form[id].files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Push the Base64 URL of the new file to the imagesURL array
        this.form[id].imagesURL.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
    this.currentIndexGet[id]=this.form[id].imagesURL.length-1;
  }




  onDrop(event: DragEvent,id:number): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files,id);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onchange(event: any,id:number): void {
    if (event.target.files) {
      this.processFiles(event.target.files,id);

    }
  }

  removeImage(clinicIndex: number, imageIndex: number): void {
    console.log(clinicIndex)
    if (imageIndex > -1 && imageIndex < this.form[clinicIndex].files.length) {
        this.form[clinicIndex].files.splice(imageIndex, 1);
        this.form[clinicIndex].fileAsBase64.splice(imageIndex, 1);
        this.form[clinicIndex].images.splice(imageIndex, 1);
        if(this.currentIndex[clinicIndex]!==0)
          this.currentIndex[clinicIndex]--;
          else
          this.currentIndex[clinicIndex]++;
    }
}
removeImageGet(clinicIndex: number, imageIndex: number): void {
  console.log(clinicIndex)
  if (imageIndex > -1 && imageIndex < this.form[clinicIndex].imagesURL.length) {
      this.form[clinicIndex].files.splice(imageIndex, 1);
      this.form[clinicIndex].fileAsBase64.splice(imageIndex, 1);
      this.form[clinicIndex].imagesURL.splice(imageIndex, 1);
      if(this.currentIndexGet[clinicIndex]!==0)
      this.currentIndexGet[clinicIndex]--;
      else
      this.currentIndexGet[clinicIndex]++;

  }
}


  currentIndex: number[] = [];
  currentIndexGet: number[] = [];

    nextImage(id:number): void {
        this.currentIndex[id] = (this.currentIndex[id] + 1) % this.form[id].files.length;
    }
    nextImageGet(i:number){
      this.currentIndexGet[i] = (this.currentIndexGet[i] + 1) % this.form[i].imagesURL.length;

    }
    previousImage(id:number): void {
        this.currentIndex[id] = (this.currentIndex[id] - 1 + this.form[id].files.length) % this.form[id].files.length;
    }
    previousImageGet(i:number){
      this.currentIndexGet[i] = (this.currentIndexGet[i] - 1 + this.form[i].imagesURL.length) % this.form[i].imagesURL.length;

    }
    addClinic(): void {
      this.form.push({
        id:0,
        email:'',
        name: '',
        location: '',
        Phone: '',
        examination: 0,
        description: '',
        assist: [{id:0, name: '', phone: '' }],
        images:[],
        fileAsBase64:[],
        files:[],
        imagesURL:[]
      });
    }
    addAssistant(id:number): void {
      this.form[id].assist.push({id:0, name: '', phone: '' });
  }

  removeAssistant(index: number,id:number): void {
      if (this.form[id].assist.length > 1) {
          this.form[id].assist.splice(index, 1);
      }
  }

  isFormValid(index: number): boolean {
    const clinic = this.form[index];
    // console.log(clinic.name.length < 3,clinic.name , clinic.location.length < 11 , clinic.Phone.length !== 11 , clinic.examination > 9 , clinic.description.length < 50 , clinic.images.length < 1,index)
    if (!clinic) {
      return false; // Check if clinic exists
    }

    // Check if any field is empty
    if (!clinic.name || !clinic.location || !clinic.Phone || !clinic.examination || !clinic.description || !clinic.images) {
      return false;
    }

    // Check if any field does not meet the length requirements
    if (clinic.name.length < 3 || clinic.location.length < 11 || clinic.Phone.length !== 11 || clinic.examination < 100 || clinic.description.length < 50 || clinic.images.length < 1) {
      return false;
    }

    return true; // Return true if all fields are valid
  }


  // isFormValid(index: number): boolean {
  //   const clinic=this.form[index]
  //   if(index===0){
  //   console.log(clinic)
  //   console.log(clinic.name.length < 3 ,
  //      clinic.location.length < 11 , clinic.Phone.length !== 11 ,
  //       clinic.examination > 9 ,
  //        clinic.description.length < 50,clinic.images.length<1,index)
  //   }
  //   if (!clinic.name || !clinic.location || !clinic.Phone || !clinic.examination || !clinic.description||!clinic.images) {
  //     return false; // Check if any field is empty
  //   }
  //   if (clinic.name.length < 3 || clinic.location.length < 11 || clinic.Phone.length !== 11 || clinic.examination > 9 || clinic.description.length < 50,clinic.images.length<1) {
  //     return false; // Check if any field does not meet the length requirements
  //   }
  // return true; // Return true if all fields are valid

  // }



}
