const { Category } = require("../db.js");

async function searchCategory (category){
    try{
      const categories= await Category.findAll({
        where:{name:category}
      })
      return categories;
    }
    catch(e){   
      console.log(e);
    }
};

module.exports = searchCategory;