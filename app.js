//DOM Elements
const mainScreen=document.querySelector('.main-screen');
const pokeName=document.querySelector('.poke-name');
const pokeId=document.querySelector('.poke-id');
const pokeFrontImage=document.querySelector('.poke-front-image');
const pokeBackImage=document.querySelector('.poke-back-image');
const pokeTypeOne=document.querySelector('.poke-type-one');
const pokeTypeTwo=document.querySelector('.poke-type-two');
const pokeWeight=document.querySelector('.poke-weight');
const pokeHeight=document.querySelector('.poke-height');
const pokeListItem=document.querySelectorAll('.list-item');
const prevButton=document.querySelector('.left-button');
const nextButton=document.querySelector('.right-button');

//All 18 Pokémon Types
const TYPES = [
    'fairy','dark','dragon',
    'ice','psychic','electric',
    'grass','water','fire',
    'steel','ghost','bug',
    'rock','ground','poison',
    'flying','fighting','normal'
];

let prevUrl=null;
let nextUrl=null;
let pokemonToDisplay=null;

//Functions

//Function to Capitalize the first letter of the String
const capitalize = (str) => str[0].toUpperCase()+str.substr(1);

//Function to Display the Pokémon List on the Right Side of Pokédex
const fetchPokeList= urlToFetch =>{
    fetch(urlToFetch)
    .then(res=>res.json())
    .then(data=>{
        //Update the Previous and Next URLs
        prevUrl=data['previous'];
        nextUrl=data['next'];
        //Extracting the next 20 Pokémon data from res.json()
        const next20Pokemon=data['results'];    
        for(let i=0; i<pokeListItem.length; i++){
            if(next20Pokemon[i]){
                //UrlRes will have the Id Number of the Pokémon
                let urlRes=next20Pokemon[i]['url'];
                urlRes=urlRes.substr(34);
                urlRes=urlRes.substring(0,urlRes.length-1);
                //There are only 898 Pokémon
                if(Number(urlRes)<=Number('898'))
                    pokeListItem[i].textContent='#'+urlRes.toString().padStart(3,'0')+'  '+capitalize(next20Pokemon[i]['name']);
                else
                    pokeListItem[i].textContent='';
            }
            else
                pokeListItem[i].textContent='';
        }
    });
}

//Display Pokémon data of Left Side of Pokédex
const ListItemDisplay = pokemonToShow => {
    fetch(pokemonToShow)
    .then(res => res.json())
    .then(data => {
        //Remove all Pre-existing mainScreen classes
        //If it doesn't exists this won't do anything
        for(let i=0; i<TYPES.length; i++){
            mainScreen.classList.remove(TYPES[i]);
        }
        //Extract Datatype of Pokémon displayed from the res.json
        const dataTypes=data['types'];
        pokeTypeOne.textContent=capitalize(dataTypes[0]['type']['name']);
        //Check if Pokémon has a Second type
        if(dataTypes.length>1){
            //Remove the hidden class to allow the display of Second Type
            pokeTypeTwo.classList.remove('hide');
            pokeTypeTwo.textContent=capitalize(dataTypes[1]['type']['name']);
        }
        else{
            //Add a Class to hide because Pokémon doesn't have a Second Type
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent='';
        }
        //Adding Background of the First Pokémon Type
        mainScreen.classList.add(dataTypes[0]['type']['name']);
        mainScreen.classList.remove('hide');
        pokeName.textContent=capitalize(data['name']);
        pokeId.textContent='#'+(data['id']).toString().padStart(3,'0');
        pokeWeight.textContent=(data['weight'])/10;
        pokeHeight.textContent=(data['height'])*(10);
        pokeFrontImage.src=data['sprites']['front_default'] || '';
        pokeBackImage.src=data['sprites']['back_default'] || '';
    });
}

//Handle Next Button Click Function
const handleNextButtonClick = () =>{
    if(nextUrl){
        fetchPokeList(nextUrl);
    }
}

//Handle Previous Button Click Function
const handlePrevButtonClick = () =>{
    if(prevUrl){
        fetchPokeList(prevUrl);
    }
}

//Handle List Item Click Function
const handleListItemClick = (e) =>{
    if(!e.target)
        return;
    const listItem=e.target;
    if(!listItem.textContent)
        return;
    let inVal=listItem.textContent;
    inVal=inVal.substring(1,4);
    let num=Number(inVal);
    pokemonToDisplay='https://pokeapi.co/api/v2/pokemon/'+num.toString();
    ListItemDisplay(pokemonToDisplay);    
}

//Event Handling
prevButton.addEventListener('click',handlePrevButtonClick);
nextButton.addEventListener('click',handleNextButtonClick);
for(let i=0; i<pokeListItem.length; i++){
    pokeListItem[i].addEventListener('click',handleListItemClick);
}

//Initalizing App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
ListItemDisplay('https://pokeapi.co/api/v2/pokemon/1');
