export default class ApiResponse{
    success:boolean;
    message:string;
    data?:any;
    error?:any;
    constructor(success:boolean,message:string,data?:any,error?:any){
        this.success=success;
        this.message=message;
        if(data){
            this.data=data
        }

        if(error){
            this.error=error
        }
    }
}