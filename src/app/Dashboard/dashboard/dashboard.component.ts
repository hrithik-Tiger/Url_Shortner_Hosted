import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  NgForm,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { ClipboardService } from 'ngx-clipboard';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  longUrl:string="";
  
  fetchedUrl =""
  fetchedUrlList:any=[];
  isloading = false;
  formShorter!: FormGroup;

  //Expression to check the validity of Url entered by user
  reg =
    "((http|https)://)(www.)?" +
    "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
    "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";
    error: string = "";
  text = "";
  constructor(
    public fb: FormBuilder,
    private apiService : ApiService,
    private clipboardApi: ClipboardService

  ) {}


  //Checking the Validity of Url entered
  ngOnInit(): void {
    this.formShorter = this.fb.group({
      longLink: ["", [Validators.required, Validators.pattern(this.reg)]],
      shortLink: new FormControl({ value: null, disabled: true })
    });
  }


  //Async fn to make code run asyncronusly to pass values until its fetched from the source
  async onSubmit(form: FormGroup) 
  {
    
    if (form.valid) {

      this.isloading = true;
      this.longUrl = form.value.longLink;
 
      this.error = "";
      this.apiService.getShortUrl(this.longUrl)
      .subscribe((res:any)=>{

        this.isloading = false;
        this.fetchedUrl = res.result.short_link;
        this.fetchedUrlList.push(this.fetchedUrl)
        
      });
   
      
 

//If the Url entered by user is Invalid 


    } else {
      const errorMessage =`Invalid URL!`;
      this.error = errorMessage;
      this.isloading = false;
    }

  }
  
//To copy Items present in Input Box
copyClipboard(input:any){

   
    // Select the text field
    input.select();
    input.setSelectionRange(0, 99999); //Select range of input field
  
     // Copy the text inside the input field
    navigator.clipboard.writeText(input.value);
  
    // Alert the copied text
    alert("Text Copied " + input.value);


}


}
