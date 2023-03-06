const books =[
    {
        ISBN:"1234",
        title:"Getting started with Mern",
        authors:[1,2,3],
        language:"en",
        pubDate:"2021-07-07",
        numOfPage:300,
        category:["fiction","programming","tech","webdev"],
        publication:1,
},
{
    ISBN:"12345",
    title:"Getting started with Python",
    authors:[1,2,3],
    language:"en",
    pubDate:"2021-07-07",
    numOfPage:300,
    category:["fiction","tech","webdev"],
    publication:1,
},
];

const authors=[{
    id:1,
    name:"naveen",
    books:["1234"]
},
{
    id:2,
    name:"reddy",
    books:["1234","12345"]
}
];

const publication=[
    {
    id:1,
    name:"Chakra",
    books:["1234"]
    },
    {
        id:2,
        name:"abcd",
        books:[]
    }
];
module.exports={books,authors,publication};