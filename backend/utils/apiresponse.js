class apiresponse{
    constructor(statuscode,data,message="Success"){
        this.data=data
        this.statuscode=statuscode
        this.message=message
        this.success
    }

}
export {apiresponse}