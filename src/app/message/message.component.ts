import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
chatDelay: number = 0;
doctorId:string|undefined='';
massageContent:string=''
messages:Message[]=[]
message: Message = {
  id: 0, // You may handle ID generation on the server-side
  content: '',
  time: new Date(),
  senderId: '',
  senderType: SenderType.Admin, // Directly assign SenderType.Admin to senderType
  receiverId: '', // Will be set based on conditions in sendMessage()
  status: false
};
constructor(private http:HttpClient,private activatedroute:ActivatedRoute){}


  ngOnInit(): void {
    this.doctorId=(this.activatedroute.snapshot.paramMap.get("bid"))?.toString().toLowerCase().replaceAll(' ','-');
    if(this.doctorId)
  this.loadMessages();

  
  }





  sendMessege(){
    if(this.massageContent){
    this.message.content=this.massageContent
    if(this.doctorId)
    this.message.receiverId=this.doctorId
  const email=localStorage.getItem('email')
  if(email)
    this.message.senderId=email
    this.message.status=false
    if(email)
    this.chatMessages.push({
      
      name: email,
      msg: this.message.content,
      delay: 0,
      align: 'right',
      showTime: true,
      time: new Date(),
      showSpinner: false
    });
  var Role=localStorage.getItem('Role')
  if(Role&&Role==='Pateint')
    this.http.post("https://localhost:7213/UserService/send-message",this.message).subscribe(
      (response)=>{
        this.massageContent=''
      }
  
    );
  else if(Role&&Role==='Doctor')
    this.http.post("https://localhost:7213/api/Doctor/send-message",this.message).subscribe(
      (response)=>{
        this.massageContent=''
      }
  
    );
  }
  this.scrollToBottom();

  }
  loadMessages(): void {
    this.chatMessages = [
    ];
  
    const email = localStorage.getItem('email');
    if (email && this.doctorId) {
      this.http.get<ReceivedMessage[]>(`https://localhost:7213/Admin/admins-and-doctors?senderEmail=${encodeURIComponent(email)}&receiverId=${this.doctorId}`)
        .subscribe(
          (response: ReceivedMessage[]) => {
            response.forEach(r => {

              this.messages.push({content:r.content,id:r.id,receiverId:r.receiverId,time:r.time,senderType:SenderType.Admin,status:true,senderId:''})
              var Role=localStorage.getItem('Role');
              var align=''
              if(Role&&Role==='Doctor')
               align = r.senderType === 2||r.senderType === 0 ? "left" : "right"; // Determine alignment based on senderType
              else if(Role&&Role==='Pateint')
               align =r.senderType === 1 ? "left":"right" ; // Determine alignment based on senderType


              this.chatMessages.push({
                name: r.senderId,
                msg: r.content,
                delay: 0,
                align: align,
                showTime: true,
                time: new Date(r.time),
                showSpinner: false
              });
            });
            this.chatMessages.forEach((message, index) => {
              setTimeout(() => {
                this.scrollToBottom();
              }, this.chatDelay);
              this.chatDelay += message.delay;
            });
            this.http.post("https://localhost:7213/api/Doctor/seen-messages",this.messages).subscribe(
              (response)=>{
                
              }
          
            );
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
    Patient = 'Patient',
    Doctor = 'Doctor',
    Admin = 'Admin'
  }
  interface ChatMessage {
    name: string;
    msg: string;
    delay: number;
    align: string;
    showTime: boolean;
    time: Date;
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