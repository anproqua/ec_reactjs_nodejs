class APIFilters {
    //query : Product, queryStr : keyword  =
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword? {
            name:{
                $regex: this.queryStr.keyword,
                $options: "i",
            }
        }
        : {};
        this.query = this.query.find({...keyword});
        return this;
    };

    filters(){
        const queryCopy = { ...this.queryStr};
       // filter remove 
       const fieldsToRemove = ["keyword"];
       fieldsToRemove.forEach((el)=>delete queryCopy[el]);

       // filter for prices, rate
      // JSON.stringify : chuyen thanh chuoi json
       let queryStr = JSON.stringify(queryCopy);
       // thay the gt || gte || lt || lte => $gt || $gte || $lt || $lte
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

       console.log("===================");
       console.log(queryStr);
       console.log("===================");
      // this.query = this.query.find(queryCopy);
      this.query = this.query.find(JSON.parse(queryStr));
       return this;
    };
//resPerPage : so item tren 1 trang
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage-1);
        this.query = this.query.find({}).limit(resPerPage).skip(skip);     
        return this;
    };
}
export default APIFilters;