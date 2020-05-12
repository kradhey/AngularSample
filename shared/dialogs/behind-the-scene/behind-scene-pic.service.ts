import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ISiteApiResponse } from 'shared/services/SiteApiResponse';
import { environment } from 'environments/environment';

@Injectable()
export class BehindScenePicService {
    constructor (
        private http: HttpClient
    ) { }
 

    uploadProfilePicture(image:any[]) {
     debugger
        const url = environment.endpoints.upload.behindScene;
        // image.forEach(element => {
           
    
        let params = new HttpParams()
        // .set("payload", image);
        const formData=new FormData();
        //  image.forEach(img => {
        //    params=params.append("payload",img)
        // // formData.append("payload",img);
        //   });


             
              for (var i = 0; i < image.length; i++) { 
                formData.append("payload", image[i]);
              }
              


        const headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded");
       



        return this.http
            .post<ISiteApiResponse>(url, formData)
            .map(r => this.onGetSuccessful(r));

        // });
    }

    private onGetSuccessful(response: ISiteApiResponse) {
        return response.data || null;
    }
}