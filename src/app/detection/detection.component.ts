import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface Detection {
  email:string;
  detectionResult:DetectionResult[];
}
interface DetectionResult{
  results:string;
  files:File;
}
@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.css']
})
export class DetectionComponent {
  posterName: string[] = [];
  fileAsBase64: (string | undefined)[] = [];
  files: File[] = [];
  Detection: Detection = { email: '', detectionResult: [] }; // Initialize Detection
 test:any
 response:any
  constructor(private http: HttpClient) {}


  // uploadImages(): void {
  //   const formData = new FormData();
  //   for (let file of this.files) {
  //     formData.append('files', file, file.name);
  //   }

  //   this.http.post('http://127.0.0.1:8000/detect/', formData).subscribe({
  //     next: (response: any) => {
  //           this.response=response

  //       },
  //     error: (error) => {
  //       console.error('Error uploading files:', error);
  //     }
  //   });
  //   const detectionForm = new FormData();

  //   var email=localStorage.getItem("email");
  //     if(email)
  //     detectionForm.append("doctorEmail",email)
  //     for (let j = 0; j < this.response.length; j++) {
  //       const fileToAppend = this.files.find(file => file.name === this.response.filename);
  //     if(fileToAppend){
  //     detectionForm.append('detectionResult['+j+'].File',fileToAppend)
  //     detectionForm.append('detectionResult['+j+'].Result',this.response[j].class)
  //     }
  //   }
  //   console.log(detectionForm)


  //   this.http.post('https://localhost:7213/api/Doctor/detect', detectionForm).subscribe({
  //     next: (response: any) => {
  //       console.log('Detection results:', response);
  //       response.forEach((result: any, index: number) => {
  //         this.posterName[index] = `${result.filename}: ${result.class}`;
  //         this.test=response
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error uploading files:', error);
  //     }
  //   });
  // }
  uploadImages(): void {
    const formData = new FormData();

    // Append files to formData for the first POST request
    for (let file of this.files) {
      formData.append('files', file, file.name);
    }

    // First POST request to http://127.0.0.1:8000/detect/
    this.http.post<any[]>('http://127.0.0.1:8000/detect/', formData).subscribe({
      next: (response: any[]) => { // Assuming response is an array of detection results
        console.log('Detection results:', response);
        this.response = response; // Store response for later use

        // Initialize detectionForm as FormData for the second POST request
        const detectionForm = new FormData();

        // Append doctorEmail if available in localStorage
        const email = localStorage.getItem("email");
        if (email) {
          detectionForm.append("doctorEmail", email);
          detectionForm.append("patientEmail", '');
        }

        // Append detectionResult to detectionForm
        response.forEach((result, j) => {
          const fileToAppend = this.files.find(file => file.name === result.filename);
          if (fileToAppend) {
            detectionForm.append(`detectionResult[${j}].File`, fileToAppend);
            detectionForm.append(`detectionResult[${j}].Result`, result.result);
          } else {
            console.warn(`File '${result.filename}' not found in 'this.files'. Skipping.`);
          }
        });

        console.log(detectionForm); // Log detectionForm for debugging

        // Second POST request to https://localhost:7213/api/Doctor/detect
        this.http.post<any[]>('https://localhost:7213/api/Doctor/detect', detectionForm).subscribe({
          next: (secondResponse: any[]) => {
            console.log('Detection results from https://localhost:7213/api/Doctor/detect', secondResponse);
            secondResponse.forEach((result: any, index: number) => {
              this.posterName[index] = `${result.filename}: ${result.class}`;
            });
          },
          error: (secondError) => {
            console.error('Error uploading files to https://localhost:7213/api/Doctor/detect:', secondError);
          }
        });

      },
      error: (error) => {
        console.error('Error uploading files:', error);
      }
    });
  }

  processFiles(files: FileList): void {
    this.files = [...this.files, ...Array.from(files)];
        this.fileAsBase64 = new Array(this.files.length);

    this.files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileAsBase64[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onchange(event: any): void {
    if (event.target.files) {
      this.processFiles(event.target.files);
    }
  }




  formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  removeMRI(index: number): void {
    // Ensure the index is within the bounds of the array
    if (index > -1 && index < this.files.length) {
      this.files.splice(index, 1);
    }
  }

}
