import Model from './model.js';

export default class CollectionFilter{

    constructor(){

    }


    static Filter(DataBind,httpContext){

        let DataModifier = DataBind;
        DataModifier.sort((x, y) => x.Id > y.Id ? 1 : -1);


        DataModifier = this.Sort(DataModifier,httpContext);
        DataModifier = this.Limit(DataModifier,httpContext);
        DataModifier = this.Fields(DataModifier,httpContext);

       return DataModifier;
    }

    static Sort(DataModifier, httpContext) {
      if(httpContext.path.params != undefined){
        if(httpContext.path.params["sort"] != undefined){
            let value =httpContext.path.params["sort"];
            if(value.includes(",desc"))
            {
                value = value.replace(',desc','');
                DataModifier.sort((nameX, nameY) => {
                    if (nameX[value] < nameY[value]) {
                      return 1;
                    }
                    if (nameX[value] > nameY[value]) {
                      return -1;
                    }
                    return 0;
                  });
            }
            else{
                DataModifier.sort((nameX, nameY) => {
                    if (nameX[value] > nameY[value]) {
                      return 1;
                    }
                    if (nameX[value] < nameY[value]) {
                      return -1;
                    }
    
                    return 0;
                  });
            }
            

          }
       }
       return DataModifier
    }



    static Limit(DataBind,httpContext){
      if(httpContext.path.params != undefined){
        if(httpContext.path.params["limit"] != undefined && httpContext.path.params["offset"] != undefined){
         
          let offset =httpContext.path.params["offset"];          
          var data=[];
          let limit =httpContext.path.params["limit"];

          let Index = limit*offset;


          for(let i=Index;i<parseInt(Index)+parseInt(limit);i++){
            data.push(DataBind[i]);
          }
          return data;
        }
      }
      return DataBind;
    }



    static Fields(DataBind,httpContext){
      if(httpContext.path.params != undefined){
        if(httpContext.path.params["fields"] != undefined){

            let fields = httpContext.path.params["fields"].split(',');
            let allFields = Object.keys(DataBind[0]);
            let change =  allFields.filter((element) => !fields.includes(element)); 

            for(let i=0;i<DataBind.length;i++){
                for(let l=0;l<change.length;l++){
                    delete DataBind[i][change[l]];
                }  
            }

            const vue = new Set();

            const filter = DataBind.filter(element => {
              let info ="";
              for(let i=0;i<fields.length;i++){
                info =info+element[fields[i]];
              }
              const dup = vue.has(info);
              vue.add(info);
              return !dup;
            });
            return filter;         
        }
      }
      return DataBind;
    }




}
