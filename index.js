//Frame work
const express= require("express");
//Database
const database =require("./database/index");

//Initializing express
const mybook =express();

//Configuration
mybook.use(express.json());

/*Route      /
Description  to get all books 
Access       public
Parameters   NONE
Methos       GET
 */
mybook.get("/",(req,res)=>{
    return res.json({books:database.books});
});

/*Route      /
Description  to get specific book based on isbn 
Access       public
Parameters   isbn
Methos       GET
 */
mybook.get("/i/:isbn",(req,res)=>{
    const getspecificBook=database.books.filter((book)=>book.ISBN===req.params.isbn);
    if(getspecificBook.length===0){
        return res.json({error:`No book found for isbn ${req.params.isbn}`});
    }
    return res.json({book:getspecificBook});
});

/*Route      /c/
Description  to get specific books based on category
Access       public
Parameters   category
Methos       GET
 */

mybook.get("/c/:category",(req,res)=>{
    const getspecificBooks=database.books.filter((book)=>book.category.includes(req.params.category));
    if(getspecificBooks.length===0){
        return res.json({error:`No book found for category ${req.params.category}`});
    }
    return res.json({book:getspecificBooks});
});

/*Route      /a/
Description  to get specific books based on author
Access       public
Parameters   author
Methos       GET
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
Methos       GET
 */
mybook.get("/authors",(req,res)=>{
    return res.json({authors:database.authors});
})

/*Route      /author
Description  to get specific author
Access       public
Parameters   author id
Methos       GET
 */
mybook.get("/author/:a",(req,res)=>{
    const getspecificauthor=database.authors.filter((auth)=>auth.id==req.params.a);
    if(getspecificauthor.length==0){
        return res.json({error:`No author found for authorid${req.params.a}`});
    }
    return res.json({author:getspecificauthor});
});

/*Route      /author
Description  to get list of authors based on a book's isbn
Access       public
Parameters   isbn 
Methos       GET
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
Methos       GET
 */
mybook.get("/publications",(req,res)=>{
    return res.json({publications:database.publication})
});

/*Route      /publication
Description  to get specific publication
Access       public
Parameters   publication id
Methos       GET
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
Methos       GET
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
Methos       POST
 */
mybook.post("/book/new",(req,res)=>{
    const {newbook}=req.body;
    database.books.push(newbook);
    return res.json({books:database.books,message:"book was added"});
});

/*Route      /author/new
Description  add new author
Access       public
Parameters   NONE
Methos       POST
 */
mybook.post("/author/new",(req,res)=>{
    const {newauthor}=req.body;
    database.authors.push(newauthor);
    return res.json({books:database.authors,message:"author was added"});
});

/*Route      /publication/new
Description  add new publication
Access       public
Parameters   NONE
Methos       POST
 */
mybook.post("/publication/new",(req,res)=>{
    const {newpublication}=req.body;
    database.publication.push(newpublication);
    return res.json({books:database.publication,message:"publication was added"});
});

/*Route      /book/update
Description  update title of a book
Access       public
Parameters   isbn
Methos       PUT
 */
mybook.put("/book/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN==req.params.isbn){
            book.title=req.body.bookTitle;
            return;
        }
    });
    return res.json({books:database.books});
});

/*Route      /book/author/update
Description  update or add new author
Access       public
Parameters   isbn
Methos       PUT
 */
mybook.put("/book/author/update/:isbn",(req,res)=>{
    //update book
    database.books.forEach((book)=>{
        if(book.ISBN==req.params.isbn){
            book.authors.push(req.body.newAuthor);
            return;
        }
    });
    //update author
    database.authors.forEach((author)=>{
        if(author.id==req.body.newAuthor) return author.books.push(req.params.isbn);
    });

    return res.json({books:database.books,authors:database.authors,message:"new author was added"});
});

/*Route      /author/update
Description  update name of author
Access       public
Parameters   author id
Methos       PUT
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
Methos       PUT
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
Methos       PUT
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
})
mybook.listen(3000,()=>console.log("server running"));
