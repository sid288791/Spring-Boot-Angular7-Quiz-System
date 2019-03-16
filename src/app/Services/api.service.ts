import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, RequestOptions, RequestMethod } from '@angular/http';
import { environment } from '../../environments/environment'
import {Observable, from} from "rxjs/index";

@Injectable({
    providedIn:'root'
})

export class QuizService{
	constructor(private httpClient:HttpClient){

    }
	
	//for getting questiong using get rest call
	public getQuizQuestion(){
        return this.httpClient.get(environment.baseURL+'questions');
    }
	
	//for submitting answers
	public sendQuizAnswer(quizUserAnswer:any){
    console.log(quizUserAnswer);
    let headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    
    let options = { headers: headers };
    return this.httpClient.post(environment.baseURL+'submitQuiz',JSON.stringify({
        "quizUserAnswer":quizUserAnswer
    }),options);
}
}