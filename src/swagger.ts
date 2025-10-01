const Options={
    definition: {
    openepi:"3.0.0",
    info:{
         title:"Product CRUD REST API",
         version:"1.0.0",
         description:"This is simple CRUD API node with Express and documented with swagger"
    },
     servers: [
        {
        url:"http://localhost:5000",
        description:"Development servers"
     }
    ],
    components:{
         schemaa: {
            Product: {
                type: "object",
                require: ["name","description","price","imageUrl","category"],
                properties: {
                name:{
                    type:"string",
                    description:"The name of product"
                },
               description: {
                type: "string",
                description: "The description of the product"
               },
               price:{

              type: "integer",
               description: "The price of product"
               },
               imageUrl: {
                type: "string",
                description:"The image of product"
               },
               category :{
                type: "string",
                description:"The category of product"
               },
                }
            }
         }
    },
    responses: {
    400: {
        
    }
    }
    }
    }
