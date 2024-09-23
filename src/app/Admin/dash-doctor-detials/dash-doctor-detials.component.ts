import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/Service/loader.service';
interface Clinic {
  id: number;
  location: string;
  examination: number;
  discription: string;
  name: string;
  phone: string;
  images: Image[];
  assistants: Assistant[];
}
  interface AppointmentDto {
      bookingToOther: boolean;
      patientName: string;
      patientPhone: string;
      patientEmail: string;
      date: Date;
      shiftId: number;
      doctorId: string;
  }


interface Image {
  imageUrl: string;
}

interface Assistant {
  number: string;
  name: string;
}

interface Schedule {
  thisWeek: boolean;
  nextWeek: boolean;
  nextTwoWeek: boolean;
  nextTreeWeek: boolean;
  clinicId:number;
  satShifts: DayShift[];
  sunShifts: DayShift[];
  monShifts: DayShift[];
  tueShifts: DayShift[];
  wedShifts: DayShift[];
  thuShifts: DayShift[];
  friShifts: DayShift[];
}
interface DayShift{
  id:number;
  shiftId:number;
  endTime:string;
  startTime:string;
  day:string;
  available:boolean;
}
interface DoctorData {
  email: string;
  name: string;
  specialization: string;
  smallTip: any; // Define the type if known
  aboutDoctor: any; // Define the type if known
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  phoneNumber: string;
  imgUrl: string;
  clinics: Clinic[];
  review: Review[]; // Define the type if known
  schedule: Schedule[];
}
interface Review {
  date: string;
  id: number;
  name: string;
  patientId: number;
  imgUrl: string;
  likes: number;
  numOfStars:number;
  dislikes: number;
  review: string;
}
interface AddReview {
  doctorId: string;
  patientEmail: string|null;

  numOfStars:number;

  review: string;
}
interface Increment {
  newNumber: number;
  id: number;

}



@Component({
  selector: 'app-dash-doctor-detials',
  templateUrl: './dash-doctor-detials.component.html',
  styleUrls: ['./dash-doctor-detials.component.css']
})
export class DashDoctorDetialsComponent {

  doctorId:string|undefined='';
  reviewed:boolean=false;
  percentageRating:number=0
  data:DoctorData
  RemPercentage:number=0;
  addReview:AddReview
  chatMessages: ChatMessage[] = [];
chatDelay: number = 0;
  constructor(private http:HttpClient,private activatedroute:ActivatedRoute,public loader:LoaderService) {
    this.data={
      email: '',
      name: '',
      specialization: '',
      smallTip: '', // Define the type if known
      aboutDoctor: '', // Define the type if known
      rate1: 0,
      rate2: 0,
      rate3: 0,
      rate4: 0,
      rate5: 0,
      phoneNumber: '',
      imgUrl: '',
      clinics: [],
      review: [], // Define the type if known
      schedule: []
    }

    this.addReview={
      doctorId:'',
      patientEmail:'',
      numOfStars:0,
      review:''
    }


  }

  ngOnInit(): void {

    this.doctorId=(this.activatedroute.snapshot.paramMap.get("bid"))?.toString().toLowerCase().replaceAll(' ','-');
    if(this.doctorId)
  this.loadMessages();
    if(this.doctorId)

this.getDoctorByEmail(this.doctorId).subscribe(
(response) =>{
    this.data=response
    if(this.data.imgUrl)
    this.data.imgUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\').replace(/\\/g, '/');
    for (let i = 0; i < this.data.clinics.length; i++) {
      for (let j = 0; j < this.data.clinics[i].images.length; j++) {
          // Remove the initial DoctorData\\mh21562@fayoum.edu.eg\\ from the imageUrl
          let imageUrl = this.data.clinics[i].images[j].imageUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\');

          // Replace backslashes with forward slashes
          imageUrl = imageUrl.replace(/\\/g, '/');

          // Update the imageUrl with the corrected path
          this.data.clinics[i].images[j].imageUrl = imageUrl;
      }
  }


  });


}
getDoctorByEmail(id: string): Observable<DoctorData> {
  return this.http.get<DoctorData>(`https://localhost:7213/UserService/get-doctor-by-id?id=${id}`);
}





Delete(){
  this.http.delete(`https://localhost:7213/Admin/delete-doctor?id=${this.doctorId}`).subscribe(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );
}
Accept(){
  this.http.get(`https://localhost:7213/Admin/accept?id=${this.doctorId}`).subscribe(
    (response) => {
      this.revMessage=`Docotor ${this.data.name} accepted successfully`;
        this.reviewed = true;
        setTimeout(() => {
          this.reviewed = false;
        }, 5000);
    },
    (error) => {
    }
  );
}

getMessagesFromAdminAndDoctors(): Observable<any[]> {
  return this.http.get<any[]>(`https://localhost:7213/Admin/admins-and-doctors`);
}
      isModalOpen = false;

      openModal() {
        this.isModalOpen = true;
      }

      closeModal() {
        this.isModalOpen = false;
      }

      @HostListener('document:keydown', ['$event'])
      handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.isModalOpen) {
          this.closeModal();
        }
      }
      checkboxStates: boolean[] = [false, false, false, false, false]; // Array to store checkbox states

  updateSelectedRating(index: number) {
    // Update checkbox states array
    this.checkboxStates = this.checkboxStates.map((state, i) => i === index);
    for(let i=0;i<5;i++)
      if(this.checkboxStates[i]===true)
        this.numOfStar=i+1;
  }
  calcRating(rate1: number, rate2: number, rate3: number, rate4: number, rate5: number): number {
    var totalRatings = rate1 + rate2 + rate3 + rate4 + rate5;

    // Check if the total number of ratings is zero to avoid division by zero
    if (totalRatings === 0) {
      return 0; // or some other value that indicates no ratings are available
    }
    var percentageRating = Math.floor((rate1 + (2 * rate2) + (3 * rate3) + (4 * rate4) + (5 * rate5)) /
      totalRatings / 5 * 100);
    percentageRating = Math.floor(100 - ((percentageRating - Math.floor(percentageRating)) * 100));
    percentageRating = Math.floor(percentageRating);
    this.percentageRating= percentageRating / 100 * 5;
    return percentageRating / 100 * 5;
  }

    revMessage:string=''
    numOfStar:number=0;
increment: Increment = { id: 0, newNumber: 0 };
liked:boolean[]=[]
disliked:boolean[]=[]
incrementLikes(rate: any) {
  console.log(rate);
  if (this.liked[rate]) {
    this.data.review[rate].likes--;
    this.liked[rate] = false;




  } else {
    this.data.review[rate].likes++;
    this.liked[rate] = true;
  }
  this.increment.id=this.data.review[rate].id
  this.increment.newNumber=this.data.review[rate].likes;
  console.log(this.increment)
  this.http.post("https://localhost:7213/UserService/increment-likes",this.increment).subscribe(
    (response)=>{
      this.revMessage=response.toString()
      this.ngOnInit();
    }
  )
}


incrementDislikes(rate: any) {
  if (this.disliked[rate]) {
    this.data.review[rate].dislikes--;
    this.disliked[rate] = false;

  } else {
    this.data.review[rate].dislikes++;
    this.disliked[rate] = true;
  }
  this.increment.id=this.data.review[rate].id
  this.increment.newNumber=this.data.review[rate].dislikes;
  this.http.post("https://localhost:7213/UserService/increment-dislikes",this.increment).subscribe(
    (response)=>{

      this.ngOnInit();
    }
  )
}












massageContent:string=''
message: Message = {
  id: 0, // You may handle ID generation on the server-side
  content: '',
  time: new Date(),
  senderId: '',
  senderType: SenderType.Admin, // Directly assign SenderType.Admin to senderType
  receiverId: '', // Will be set based on conditions in sendMessage()
  status: false
};
sendMessege(){
  if(this.massageContent){
  this.message.content=this.massageContent
  if(this.doctorId)
  this.message.receiverId=this.doctorId
const email=localStorage.getItem('email')
if(email)
  this.message.senderId=email
  this.message.status=false


  this.http.post("https://localhost:7213/Admin/send-message",this.message).subscribe(
    (response)=>{
      this.massageContent=''
      this.ngOnInit();
    }

  );
}
}












///////////////////////////////














loadMessages(): void {
  this.chatMessages = [
  ];

  const email = localStorage.getItem('email');
  if (email && this.doctorId) {
    this.http.get<ReceivedMessage[]>(`https://localhost:7213/Admin/admins-and-doctors?senderEmail=${encodeURIComponent(email)}&receiverId=${this.doctorId}`)
      .subscribe(
        (response: ReceivedMessage[]) => {
          response.forEach(r => {
            const align = r.senderType === 2 ? "right" : "left"; // Determine alignment based on senderType

            this.chatMessages.push({
              name: r.senderId,
              msg: r.content,
              delay: 0,
              align: align,
              showTime: true,
              time: new Date(r.time).getHours().toString()+':'+new Date(r.time).getMinutes().toString(),
              showSpinner: false
            });
          });

          this.chatMessages.forEach((message, index) => {
            setTimeout(() => {
              this.scrollToBottom();
            }, this.chatDelay);
            this.chatDelay += message.delay;
          });
        },
        (error) => {
          console.error('Error fetching messages:', error);
          // Handle error, show error message, etc.
        }
      );
  }
}


getMessageClasses(message: ChatMessage): string {
  return `message-${message.align} ${message.name}`;
}

scrollToBottom(): void {
  setTimeout(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
}

}
// message.interface.ts

export interface Message {
  id: number;
  content: string;
  time: Date;
  senderId: string;
  senderType: SenderType;
  receiverId: string;
  status: boolean;
}

export enum SenderType {
  Admin = 'Admin',
  Doctor = 'Doctor'
}
interface ChatMessage {
  name: string;
  msg: string;
  delay: number;
  align: string;
  showTime: boolean;
  time: string;
  showSpinner: boolean;
}
export interface ReceivedMessage{
  content:string;
  id:number;
  receiverId:string;
  senderId:string;
  senderType:number;
  time:Date
}
