import { Component,OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { QuizService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular7-crud';
  
  ngOnInit() {
	  this.getQuizQuestionList(); 
  
 }
 
  constructor(private quizService:QuizService){
  }
  
  activeQuiz:boolean = false;
  resultActive:boolean = false;
  numCorrect:number = 0;
  correctAnswer:any = [];
  public quizQuestion:any = [];
  activeQuestion:number = 0;
  question:any;
  quest:any;
  possibleAns:any;
  numQuestionAnswered = 0;
  error = false;
  finlize = false;
  correctAnswers:any;
  totalNumOfQuestion:any;
  
  //for getting quiz list
  public getQuizQuestionList():any{
    this.quizService.getQuizQuestion().subscribe((resp)=>{
          this.quizQuestion = resp;
          this.activeQuestion = 0;
          this.question = this.quizQuestion;
          this.quest = this.quizQuestion[this.activeQuestion];
          this.possibleAns = this.quizQuestion[this.activeQuestion].quizOption;
          this.numQuestionAnswered = 0;
          this.error = false;
          this.finlize = false;
         
          this.totalNumOfQuestion = this.quizQuestion.length;
         
    })
  }
  
  //to start quiz
  public quizActivate(){
         
         this.activeQuiz = this.changeState("quiz",true);
         console.log("inside quiz active..." +this.activeQuiz);
       };
	   
	   //changing the state of quiz waether we need to show quiz or result
	   public changeState(metric,state){		
         if(metric === "quiz"){
           return this.activeQuiz = state;
         }
         else if(metric === "result"){
           return this.resultActive = state;
         }
         else{
           return false;
         }
       };
	   
	   //for selecting the option
	    public selectAnswer(index){
         this.quizQuestion[ this.activeQuestion].selected = index;
          this.quest = this.quizQuestion[ this.activeQuestion];
            this.possibleAns = this.quizQuestion[ this.activeQuestion].quizOption;
           
       };
	   
	   // for answering quiz
	    public questionAnswered(){
         var quizLength = this.quizQuestion.length;
         console.log(quizLength);
         
         if(this.quizQuestion[this.activeQuestion].selected !== null){
           this.numQuestionAnswered++;	
           if(this.numQuestionAnswered>= quizLength){
 
             for(var i = 0; i < quizLength; i++){
 
               if(this.quizQuestion[i].selected === null){
                 this.setActiveQuestion(i);
                 return;
               }	
             }
             this.error = false;
             this.finlize = true;
             return;
           }	
         }
          this.setActiveQuestion(undefined);
          this.quest = this.quizQuestion[ this.activeQuestion];
          this.possibleAns = this.quizQuestion[ this.activeQuestion].quizOption;
         
       }
	   
	   //FOR CHECKING WHICH ARE THE QUESTION THAT ARE NOT ANSWERED
	    public setActiveQuestion(index){
         if(index === undefined){
         var breakOut = false;
         var quizLength = this.quizQuestion.length - 1;
         while(!breakOut){
           this.activeQuestion = (this.activeQuestion)<quizLength?++(this.activeQuestion):0;
           if(this.activeQuestion === 0){
             this.error = true;
           }
           if(this.quizQuestion[this.activeQuestion].selected === null){
             breakOut = true;
           }
           }
         }
         else{
            this.activeQuestion = index;
            this.quest = this.quizQuestion[ this.activeQuestion];
            this.possibleAns = this.quizQuestion[ this.activeQuestion].quizOption;
           
         }
       }
	   
	   //Final submitting the all answer
	    public finalAnswer(){
         alert("finalAnswer");
          this.finlize = false;
          this.activeQuestion = 0;
          this.numQuestionAnswered = 0;
           this.markQuiz();
           this.quest =  this.quizQuestion[this.activeQuestion];
           console.log(this.quest);
          this.possibleAns =  this.quizQuestion[ this.activeQuestion].quizOption;
          console.log(this.possibleAns);
          this.activeQuiz =  this.changeState("quiz",false);
          this.resultActive =  this.changeState("result",true);
       };
	   
	   quizUserAnswer:any = [];
	   //Taking question Id and Option Id of marked question and option
	   public markQuiz(){
         for(var i=0;i<this.quizQuestion.length;i++){
          
           let jsonStr = {
              optionId:this.quizQuestion[i].quizOption[this.quizQuestion[i].selected].optionId,
              questionId:this.quizQuestion[i].quizOption[this.quizQuestion[i].selected].questionId
           }
           this.quizUserAnswer.push(jsonStr);

           
         }
		 
		 //submitting the quiz response
		 this.quizService.sendQuizAnswer(this.quizUserAnswer).subscribe((resp)=>{
               this.getQuizResult(resp);
           })
	   }
	   
	   //Comparing the option id with correctoption id
	   public getQuizResult(responseList:any){
        for(var i=0;i<responseList.length;i++){
          this.correctAnswer.push(responseList[i].correctVal);
          console.log(this.correctAnswer);
          if(responseList[i].correctVal === this.quizUserAnswer[i].optionId){
            this.quizQuestion[i].correct = true;
            this.numCorrect++;
          }
          else{
            this.quizQuestion[i].correct = false;
          }
        }
       
       }
	   
	   //how many correct answers are there
	   correctAnsOutOfQuestion = function(){
         return ( this.numCorrect);
       }
	   
	   //Calculating Percentage
	   public calculatePercent(){
         return (this.numCorrect/this.totalNumOfQuestion*100);
       }
	   
	   //Calculating Grade
	    public getGrade = function(){
 
         if((this.numCorrect/ this.totalNumOfQuestion*100)>75 || (this.numCorrect/ this.totalNumOfQuestion*100)>=60){
           return "A";
         }
         else if(( this.numCorrect/ this.totalNumOfQuestion*100)>60 || ( this.numCorrect/ this.totalNumOfQuestion*100)>=45){
           return "B";
         }
         else if(( this.numCorrect/ this.totalNumOfQuestion*100)>45 || ( this.numCorrect/ this.totalNumOfQuestion*100)>=35){
           return "C";
         }
         else{
           return "D";
         }
     };
	   
}
