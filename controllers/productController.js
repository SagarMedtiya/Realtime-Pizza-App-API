import  {Product}  from '../models'
import multer from 'multer';
import path from 'path'
import CustomErrorHandler from '../services/CustomErrorHandler';
import  fs from 'fs';
import productSchema from '../validators/productValidator';



const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'uploads/'),
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    } 
});

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 }}).single('image');


const productController={
    async create(req,res,next){
        //multipart form data
        handleMultipartData(req,res, async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            const filepath =req.file.path.replace(/\\/g, '/');
            //validation
            const { error } = productSchema.validate(req.body);

            if(error){
                //delete the uploaded file
               
                fs.unlink(`${appRoot}/${filepath}`,(err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                //rootfolder/uploads/filename.png
                return next(error);
            }

            const { name, price, size } = req.body;
            let document ;
            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filepath
                });
            }catch(err){
                return next(err);
            }
            res.status(201).json(document);
        });

    },
    async update(req, res, next){
        handleMultipartData(req,res, async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            let filepath;
            if(req.file){
                filepath = req.file.path;
            }
           

            //validation
            const { error } = productSchema.validate(req.body);

            if(error){
                //delete the uploaded file
               
                if(req.file){
                    fs.unlink(`${approot}/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                }
                //rootfolder/uploads/filename.png
                return next(error);
            }

            const { name, price, size } = req.body;
            let document ;
            try{
                document = await Product.findOneAndUpdate(({id:req.params.id}),{
                    name,
                    price,
                    size,
                    ...(req.file && {image: filepath})
                }, {new:true});
            }catch(err){
                return next(err);
            }
            console.log(document);
            res.json(document);
        });
    },
    async delete(req,res,next){
        const document = await Product.findOneAndRemove({ _id:req.params.id  });
        if(!document){
            return next(new Error('Nothing to delete'));
        }
        //delete an image
        const imagePath = document._doc.image;
        console.log(imagePath);
        fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        })
        res.json(document);
    },
    async index(req, res, next){
        let documents;
        //mongoose-pagination
        try{
            documents = await Product.find().select('-updatedAt -__v').sort({ createdAt: -1});
        }catch(err){
            return next(err);
        }
        return res.json(documents);
    },
    async show(req, res, next){
        let documents;
        //mongoose-pagination
        try{
            documents = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v').sort({ createdAt: -1});
        }catch(err){
            return next(err);
        }
        return res.json(documents);
    }
};

export default productController;