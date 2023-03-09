require("dotenv").config();

//Frame work
const express= require("express");
const mongoose=require("mongoose");
//Database
const database =require("./database/index");

//Models
const Bookmodel=require("./database/book");
const Authormodel=require("./database/author");
const Publicationmodel=require("./database/publications");

//Initializing express
const mybook =express();

//Configuration
mybook.use(express.json());

//Establishing database connection
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connection established"));

/*Route      /
Description  to get all books 
Access       public
Parameters   NONE
Method       GET
 */
mybook.get("/",async (req,res)=>{
    const getallbooks= await Bookmodel.find();
    return res.json(getallbooks);
});

/*Route      /
Description  to get specific book based on isbn 
Access       public
Parameters   isbn
Method       GET
 */
mybook.get("/i/:isbn",async (req,res)=>{
    const getspecificBook=await Bookmodel.findOne({ISBN:req.params.isbn})
   // const getspecificBook=database.books.filter((book)=>book.ISBN===req.params.isbn);
    if(!getspecificBook){
        return res.json({error:`No book found for isbn ${req.params.isbn}`});
    }
    return res.json({book:getspecificBook});
});

/*Route      /c/
Description  to get specific books based on category
Access       public
Parameters   category
Method       GET
 */

mybook.get("/c/:category",async (req,res)=>{
    const getspecificBooks=await Bookmodel.findOne({category:req.params.category})
   // const getspecificBooks=database.books.filter((book)=>book.category.includes(req.params.category));
    if(!getspecificBooks){
        return res.json({error:`No book found for category ${req.params.category}`});
    }
    return res.json({book:getspecificBooks});
});

/*Route      /a/
Description  to get specific books based on author
Access       public
Parameters   author
Method       GET
 */
mybook.get("/a/:author",(req,res)=>
{
    const auth=req.params.author;
    const getspecificBooks=database.books.filter((book)=>book.authors.includes(parseInt(auth)));
    if(getspecificBooks.length===0){
        return res.json({error:`No book found for author ${req.params.author}`});
    }
    return res.json({book:getspecificBooks});
});

/*Route      /authors
Description  to get all authors
Access       public
Parameters   None
Method       GET
 */
mybook.get("/authors",async (req,res)=>{
    const getallauthors=await Authormodel.find();
    return res.json({authors:getallauthors});
})

/*Route      /author
Description  to get specific author
Access       public
Parameters   author id
Method       GET
 */
mybook.get("/author/:a",async (req,res)=>{
    const getspecificauthor= await Authormodel.findOne({id:req.params.a});
    //const getspecificauthor=database.authors.filter((auth)=>auth.id==req.params.a);
    if(!getspecificauthor){
        return res.json({error:`No author found for authorid${req.params.a}`});
    }
    return res.json({author:getspecificauthor});
});

/*Route      /author
Description  to get list of authors based on a book's isbn
Access       public
Parameters   isbn 
Method       GET
 */
mybook.get("/authors/:isbn",(req,res)=>{
    const getspecificauthors=database.authors.filter((auth)=>auth.books.includes(req.params.isbn));
    if(getspecificauthors.length==0){
        return res.json({error:`No author found for book ${req.params.isbn}`});
    }
    return res.json({authors:getspecificauthors});
});

/*Route      /publications
Description  to get all publications
Access       public
Parameters   None
Method       GET
 */
mybook.get("/publications",(req,res)=>{
    return res.json({publications:database.publication})
});

/*Route      /publication
Description  to get specific publication
Access       public
Parameters   publication id
Method       GET
 */
mybook.get("/publication/:pid",(req,res)=>{
    const getspecificpublication=database.publication.filter((publication)=>publication.id==req.params.pid);
    if(getspecificpublication.length==0){
        return res.json({error:`No specific publication for id ${req.params.pid}`});
    }
    return res.json({publication:getspecificpublication});
});

/*Route      /publications
Description  to get list of publications based on a book
Access       public
Parameters   isbn
Method       GET
 */
mybook.get("/publications/:isbn",(req,res)=>{
    const getspecificpublications=database.publication.filter((publication)=>publication.books.includes(req.params.isbn));
    if(getspecificpublications.length==0){
        return res.json({eror:`No publication with book isbn ${req.params.isbn}`});
    }
    return res.json({publication:getspecificpublications});
});

/*Route      /book/new
Description  add new books
Access       public
Parameters   NONE
Method       POST
 */
mybook.post("/book/new",async(req,res)=>{
    const {newbook}=req.body;
    const addnewbook=Bookmodel.create(newbook);
    //database.books.push(newbook);
    return res.json({books:addnewbook,message:"book was added"});
});

/*Route      /author/new
Description  add new author
Access       public
Parameters   NONE
Method       POST
 */
mybook.post("/author/new",(req,res)=>{
    const {newauthor}=req.body;
    Authormodel.create(newauthor);
    //database.authors.push(newauthor);
    return res.json({message:"author was added"});
});

/*Route      /publication/new
Description  add new publication
Access       public
Parameters   NONE
Method       POST
 */
mybook.post("/publication/new",(req,res)=>{
    const {newpublication}=req.body;
    Publicationmodel.create(newpublication);
   // database.publication.push(newpublication);
    return res.json({message:"publication was added"});
});

/*Route      /book/update
Description  update title of a book
Access       public
Parameters   isbn
Method       PUT
 */
mybook.put("/book/update/:isbn",async(req,res)=>{
    const updatedBook=await Bookmodel.findOneAndUpdate(
        {ISBN:req.params.isbn},
        {
            title:req.body.bookTitle
        },
        {
            new:true  // to get updated data
        }
    );
   // database.books.forEach((book)=>{
     //   if(book.ISBN==req.params.isbn){
       //     book.title=req.body.bookTitle;
         //   return;
        //}
   // });
    return res.json({books:updatedBook});
});

/*Route      /book/author/update
Description  update or add new author
Access       public
Parameters   isbn
Method       PUT
 */
mybook.put("/book/author/update/:isbn",async (req,res)=>{
    //update book
    const updatedBook=await Bookmodel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $addToSet:{
                authors:req.body.newAuthor
            }
        },
        {
            new:true
        }
        );
   /* database.books.forEach((book)=>{
        if(book.ISBN==req.params.isbn){
            book.authors.push(req.body.newAuthor);
            return;
        }
    });*/
    //update author
    const updatedAuthor= await Authormodel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }
    );
   // database.authors.forEach((author)=>{
     //   if(author.id==req.body.newAuthor) return author.books.push(req.params.isbn);
    //});

    return res.json({books:updatedBook,authors:updatedAuthor,message:"new author was added"});
});

/*Route      /author/update
Description  update name of author
Access       public
Parameters   author id
Method       PUT
 */
mybook.put("/author/update/:idn",(req,res)=>{
    database.authors.forEach((author)=>{
        if(author.id==req.params.idn){
            author.name=req.body.newauthorname;
            return;
        }
    });
    return res.json({authors:database.authors});
});
/*Route      /publication/update
Description  update name of publication
Access       public
Parameters   publication id
Method       PUT
 */
mybook.put("/publication/update/:idn",(req,res)=>{
    database.publication.forEach((publication)=>{
        if(publication.id==req.params.idn){
            publication.name=req.body.newpublicationname;
            return;
        }
    });
    return res.json({publication:database.publication});
});
/*Route      /publication/update/book
Description  update/add new book to the publication 
Access       public
Parameters   isbn
Method       PUT
 */
mybook.put("/publication/update/book/:isbn",(req,res)=>{
    //update publication database
    database.publication.forEach((publication)=>{
        if(publication.id===req.body.pubid){
            return publication.books.push(req.params.isbn);
        }
    });

    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=req.body.pubid;
            return;
        }
    });
    return res.json({books:database.books,publication:database.publication,message:"Successfully updated publication"});
});

/*Route      /book/delete
Description  delete a book
Access       public
Parameters   isbn
Method       DELETE
 */
mybook.delete("/book/delete/:isbn",(req,res)=>{
    const updatedBookDB=database.books.filter((book)=>
        (book.ISBN!==req.params.isbn)
    );
    database.books=updatedBookDB;
    return res.json({books:database.books});
});
/*Route      /book/delete/author
Description  delete an author from  book
Access       public
Parameters   isbn,authorid
Method       DELETE
 */
mybook.delete("/book/delete/author/:isbn/:authorid",(req,res)=>{
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newauthorlist=book.authors.filter(
                (author)=>author!==parseInt(req.params.authorid));
            book.authors=newauthorlist;
            return;
            }
    });

    //update author database
    database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.authorid)){
            const newBookslist=author.books.filter((book)=>book!==req.params.isbn);
            author.books=newBookslist;
            return;
        }
    });
    return res.json({books:database.books,authors:database.authors,message:"author deleted!"});
});
/*Route      /author/delete
Description  delete an author 
Access       public
Parameters   authorid
Method       DELETE
 */
mybook.delete("/author/delete/:authorid",(req,res)=>{
    const updatedauthordb=database.authors.filter(
        (author)=>author.id!==parseInt(req.params.authorid));
    database.authors=updatedauthordb;
    return res.json({authors:database.authors});
});
/*Route      /publication/delete
Description  delete a publication 
Access       public
Parameters   publicationid
Method       DELETE
 */
mybook.delete("/publication/delete/:pubid",(req,res)=>{
    const updatedpubdb=database.publication.filter(
        (pub)=>pub.id!==parseInt(req.params.pubid));
    database.publication=updatedpubdb;
    return res.json({publication:database.publication});
});
/*Route      /publication/delete/book
Description  delete a book from publication
Access       public
Parameters   isbn,publicationid
Method       DELETE
 */
mybook.delete("/publication/delete/book/:isbn/:pubid",(req,res)=>{
    //update publication database
    database.publication.forEach((pub)=>{
        if(pub.id===parseInt(req.params.pubid)){
            const newbookslist=pub.books.filter((book)=>book!==req.params.isbn);
            pub.books=newbookslist;
            return;
        }
    });
    //update book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publication=0;
        }
    });
    return res.json({books:database.books,publications:database.publication,message:"book is deleted from publication"})
});
mybook.listen(3000,()=>console.log("server running"));
