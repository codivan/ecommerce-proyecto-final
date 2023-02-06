const { initializeApp } = require('firebase/app');
const { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
} = require('firebase/storage');

//model
const { ProductImgs } = require('../models/productImgs.model');
const { Product } = require('../models/product.model');



const dotenv = require('dotenv');

dotenv.config({ path: './config.env'});

const firebaseConfig = {

    apiKey: process.env.FIREBASE_API_KEY,  
    projectId: process.env.FIREBASE_PROYECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,    
    appId: process.env.FIREBASE_APP_ID
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  //storage service
  const storage = getStorage(firebaseApp);

  const uploadProductImgs = async ( imgs, productId ) => {
    //Tecnica Map Async permite realizar operaciones asincronas con arreglos
    const imgsPromises = imgs.map( async img => {
      //create firebase reference
      const [originalName, ext] = img.originalname.split('.');  //---->[] --->[pug, jpg]
  
      const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
      const imgRef = ref(storage, filename);	
  
      //upload image to firebase
    const result = await uploadBytes(imgRef, img.buffer);
  
    await ProductImgs.create({ 
      productId, 
      imgUrl: result.metadata.fullPath, 	
    });    
    }); 

    await Promise.all(imgsPromises);
  };


  const  getProductsImgsUrls = async products => {
    //recorrer el arreglo de los posts para obtener la url de la img
	  const productsWithImgsPromises = products.map( async product => {
		//getr imgs urls
		const productImgsPromises = product.productImgs.map(async productImgs  => {
			const imgRef = ref(storage, productImgs.imgUrl);
			const imgUrl = await getDownloadURL(imgRef); 
			productImgs.imgUrl = imgUrl;
			return productImgs;			
		});		
		//permite resolver un arreglo de promesas
		const productImgs = await Promise.all(productImgsPromises);	
		
		//update  old postImgs array with new array
		product.productImgs = productImgs;
		return product;
	});
	
	return  await Promise.all(productsWithImgsPromises);
  }

  module.exports = { storage, uploadProductImgs, getProductsImgsUrls };