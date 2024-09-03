const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const e = require('express')

const app = express()
const PORT = 3000
const URL = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const urlAnchorBase = 'http://127.0.0.1:3000/'
//const urlAnchorBase = 'http://127.0.0.1:3000/'
const singers = []
const objectSorted = {}

const createTemplate = (char) =>{
   
    
    
    let div = []
   
    let num = 0
    for (const [key,values] of Object.entries(objectSorted)) {
        
        let splitChar = key.split('[').join('').split(']').join('')[0]
 
        
        values.forEach(value => {
            
            
            const endPoint = value.url.split('/wiki/').join('')
            
            
            if(char.toLowerCase()[0] === splitChar.toLowerCase()){
                
                div.push(` <li><a href=${urlAnchorBase+endPoint}>${value.name}</a></li> `)
            }
        })
           
    }
    
    
    return div
}

const renderDataRapper = async(url) => {
    
    
    try {
        const endPoint = url
        
        const response = await axios.get('https://es.wikipedia.org//wiki' + endPoint)
        if (response.status === 200) {
        
            const html = response.data
            
            const $ = cheerio.load(html)
            const titleh1 = $('h1').text()
            const languages = $('#p-lang-btn-label span').text()
            const leftSpan = []
            const rightSpan = []
            const parragraph = []
            const image = $('.imagen img').attr('src')
            const subtitle = $('.imagen div').text()
            const leftNavigator = $('#p-associated-pages span').each((i,element)=> {
                leftSpan.push($(element).text())
            })
            const rightNavigator = $('[aria-label="Vistas"] span').each((i,element)=> {
                rightSpan.push($(element).text())
            })
            const tools = $('#vector-page-tools-dropdown-label span').text()
            const articleText = $('#mw-content-text p').each((i,element) => {
                parragraph.push($(element).text());
                
            })
            
            const tbody = $('tbody')
            const tbodyInfo = []
            tbody.find('tr').each((index,element)=>{
                //console.log($(element));
                const row = $(element).find(('th,td')).map((i,ele)=>{
                    return $(ele).text().trim()
                }).get() // para convertir el map en un array
                
                tbodyInfo.push(row)
            })
            const information = tbodyInfo.slice(3).map(item => `<div class='inforDiv'> <div>${item[0]}</div> <div>${item[1]}</div>  </div>`).join('')
            //console.log(tbody);
            
            
    
            return(`
            
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                    *{
                        box-sizing: border-box;
                        padding: 0;
                        margin: 0;
                    }
                     nav{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                        border-bottom: 1px solid #202122;
                        
                    }
                    .left,.right{
                        height:100%
                        display: flex
                        align-items: center;
                    }
                    .left ul,.right ul{
                        display: flex;
                        list-style-type: none;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                    }
                    .left ul a,.right ul a{
                        text-decoration:none;
                    }
                    section{
                        height: calc(100% - 90px) ;
                    }
                    article{
                        display: flex;
                        
                        padding-top:20px;
                    }
                    .bio {
                       padding: 0 10px; 
                       
                        
                    }
                    .bio p{
                    margin-bottom: 20px;
                    font-size:20px;
                    }
                    .personalData{
                    border: 1px solid #202122;
                    padding:10px;
                    max-width:300px;
                    width:100%;
                    }
                    .name{
                    height:50px;
                        background-color: #4c6099;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight:bold;
                        color:white;
                        font-size:20px
                    }
                    .image{
                        padding:1px 20px;
                    }
    
                    .image img{
                        width: 100%;
                    }
                    .subtitle{
                    text-align: center;
                    }
                    .inforDiv{
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 20px;
                    
                    }
                    .inforDiv div:nth-child(2){
                    text-align: end;
                    }
                    </style>
                </head>
                <body style="padding:20px ; height: 100vh;">
                    
                    <header  style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid black; ">
                        <h1>${titleh1}</h1>    
                        <div>    
                            <a href='/'>
                            <span>${languages}</span>
                            <span style="display:inline-block ;background: url('https://es.wikipedia.org/w/skins/Vector/resources/skins.vector.styles/images/arrow-down.svg?f88ee');width:12px; height: 8px;);"></span>
                            </a>
                        </div>
                    </header>
    
    
                    <nav>
                        <div class="left">
                            <ul>
                                ${leftSpan.map(element => `<li> <a href="${'https://es.wikipedia.org//wiki' + endPoint}">${element} </a></li>`).join('')}
                            </ul>
                        </div>
    
                        <div class="right">
                            <ul>
                                ${rightSpan.map(element => `<li> <a href="${'https://es.wikipedia.org//wiki' + endPoint}">${element} </a></li>`).join('')}
    
                                <li>
                                ${tools}
                                <span style="display:inline-block ;background: url('https://es.wikipedia.org/w/skins/Vector/resources/skins.vector.styles/images/arrow-down.svg?f88ee');width:12px; height: 8px;);"></span>
                                </li>
                            </ul>
                        </div>
                    </nav>
    
                    
                    <section>
                        <article>
                            <div class="bio">
                                ${parragraph.map(parr => `<p>${parr}</p>`).join('')}
                            </div>
                            
                            <div class="personalData">
                                <div class="name">
                                ${titleh1}
                                </div>
    
                                <div class='image'>
                                <img src="https:${image}" alt="${titleh1}">
                                </div>
    
                                <div class="subtitle"> ${subtitle}</div>
                                
                                <div class="info-container">
                                
                                ${information}
                                </div>
                            </div>
                            
                            
                        </article>
                    </section>
    
    
                </body>
                </html>`)
    }
    } catch (error) {
        
    }

}


app.get('/',(req,res)=>{
   
    axios.get(URL).then(response => {
        if (response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
            const headerTitle = $('title').text()
            const title = $('#mw-pages h2').text()
            const parragraph = $('#mw-pages p').text()
            const h3 = $('#mw-pages h3').text()
            const anchors = $('#mw-pages a').each((i,element) => {
                const anchor = $(element).attr('href')
                const anchorName = $(element).attr('title')
                
                
                const singer = {
                    firstLetter : anchorName[0],
                    name : anchorName,
                    url : anchor
                }
                singers.push(singer)
            })
            
            
            const characters = [h3.slice(0,3),...h3.slice(3)]
            
            
            singers.forEach(sing => {
               
                if (!isNaN(Number(sing.firstLetter))) {
                !objectSorted["[0-9]"] ? objectSorted["[0-9]"] = [sing]  : objectSorted["[0-9]"].push(sing)
                }else{
                    !objectSorted[sing.firstLetter] ? objectSorted[sing.firstLetter] = [sing]  : objectSorted[sing.firstLetter].push(sing)
                }
            })

            
            
            //console.log(objectSorted);
            
            
            res.send(`
                
                    <!DOCTYPE html>
                        <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>${headerTitle}</title>
                                </head>
                        <body>
                         <h1>${title}</h1>
                            <hr>
                            <br>
                            <p>${parragraph}</p>
                            <br>
                            <br>

                            <div style=" display: flex; flex-direction: column; flex-wrap: wrap; height: 500px";>
                               
                                ${characters.map(char => {
                                    return `<div> <h3>${char}</h3>  <ul>${createTemplate(char)}</ul> </div>`
                                }).join('')}
                            
                            </div>           
                        </body>
                        </html>

                `)
        }
    })

    
})

app.get('/2_Chainz', async (req,res) => {
    try {
        const endPoint = req.url
        
        const response = await axios.get('https://es.wikipedia.org//wiki' + endPoint)
        
        if (response.status === 200) {
            
            const html = response.data
            
            const $ = cheerio.load(html)
            const titleh1 = $('h1').text()
            const languages = $('#p-lang-btn-label span').text()
            const leftSpan = []
            const rightSpan = []
            const parragraph = []
            const image = $('.imagen img').attr('src')
            const subtitle = $('.imagen div').text()
            const leftNavigator = $('#p-associated-pages span').each((i,element)=> {
                leftSpan.push($(element).text())
            })
            const rightNavigator = $('[aria-label="Vistas"] span').each((i,element)=> {
                rightSpan.push($(element).text())
            })
            const tools = $('#vector-page-tools-dropdown-label span').text()
            const articleText = $('#mw-content-text p').each((i,element) => {
                parragraph.push($(element).text());
                
            })
            
            const tbody = $('tbody')
            const tbodyInfo = []
            tbody.find('tr').each((index,element)=>{
                //console.log($(element));
                const row = $(element).find(('th,td')).map((i,ele)=>{
                    return $(ele).text().trim()
                }).get() // para convertir el map en un array
                
                tbodyInfo.push(row)
            })
            const information = tbodyInfo.slice(3).map(item => `<div class='inforDiv'> <div>${item[0]}</div> <div>${item[1]}</div>  </div>`).join('')
            //console.log(tbody);
            
            

            res.send(`
            
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                    *{
                        box-sizing: border-box;
                        padding: 0;
                        margin: 0;
                    }
                     nav{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 50px;
                        border-bottom: 1px solid #202122;
                        
                    }
                    .left,.right{
                        height:100%
                        display: flex
                        align-items: center;
                    }
                    .left ul,.right ul{
                        display: flex;
                        list-style-type: none;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                    }
                    .left ul a,.right ul a{
                        text-decoration:none;
                    }
                    section{
                        height: calc(100% - 90px) ;
                    }
                    article{
                        display: flex;
                        
                        padding-top:20px;
                    }
                    .bio {
                       padding: 0 10px; 
                       
                        
                    }
                    .bio p{
                    margin-bottom: 20px;
                    font-size:20px;
                    }
                    .personalData{
                    border: 1px solid #202122;
                    padding:10px;
                    max-width:300px;
                    width:100%;
                    }
                    .name{
                    height:50px;
                        background-color: #4c6099;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight:bold;
                        color:white;
                        font-size:20px
                    }
                    .image{
                        padding:1px 20px;
                    }

                    .image img{
                        width: 100%;
                    }
                    .subtitle{
                    text-align: center;
                    }
                    .inforDiv{
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    margin-bottom: 20px;
                    
                    }
                    .inforDiv div:nth-child(2){
                    text-align: end;
                    }
                    </style>
                </head>
                <body style="padding:20px ; height: 100vh;">
                    
                    <header  style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid black; ">
                        <h1>${titleh1}</h1>    
                        <div>    
                            <a href='/'>
                            <span>${languages}</span>
                            <span style="display:inline-block ;background: url('https://es.wikipedia.org/w/skins/Vector/resources/skins.vector.styles/images/arrow-down.svg?f88ee');width:12px; height: 8px;);"></span>
                            </a>
                        </div>
                    </header>


                    <nav>
                        <div class="left">
                            <ul>
                                ${leftSpan.map(element => `<li> <a href="${'https://es.wikipedia.org//wiki' + endPoint}">${element} </a></li>`).join('')}
                            </ul>
                        </div>

                        <div class="right">
                            <ul>
                                ${rightSpan.map(element => `<li> <a href="${'https://es.wikipedia.org//wiki' + endPoint}">${element} </a></li>`).join('')}

                                <li>
                                ${tools}
                                <span style="display:inline-block ;background: url('https://es.wikipedia.org/w/skins/Vector/resources/skins.vector.styles/images/arrow-down.svg?f88ee');width:12px; height: 8px;);"></span>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    
                    <section>
                        <article>
                            <div class="bio">
                                ${parragraph.map(parr => `<p>${parr}</p>`).join('')}
                            </div>
                            
                            <div class="personalData">
                                <div class="name">
                                ${titleh1}
                                </div>

                                <div class='image'>
                                <img src="https:${image}" alt="${titleh1}">
                                </div>

                                <div class="subtitle"> ${subtitle}</div>
                                
                                <div class="info-container">
                                
                                ${information}
                                </div>
                            </div>
                            
                            
                        </article>
                    </section>


                </body>
                </html>
                `)
        }else{

        }
        
        
        
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Alexis_Chaires', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Blackbear', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Bugz', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Coco_Jones', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/C-Kan', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Coi_Leray', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Daara_J', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Danger_Mouse_:tipo', async (req,res) => { // para evitar codificar los parentesis creamoss rutas dinamicas
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Dee_Dee_Ramone', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Grandson_:tipo', async (req,res) => {
    try {
        const endPoint = req.url
        
        
        res.send(await renderDataRapper(req.url))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Ghostface_Killah', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Juantxo_Arakama', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Junior_Jein', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Jason_Popson', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Krayzie_Bone', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/K.Flay', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Kae_Tempest', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Lil_Tjay', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/MC_Aese', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Maikel_Delacalle', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Ms._Jade', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Madvillain', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Mac_Miller', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/NF_:tipo', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/RJD2', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Roots_Manuva', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Sir_Mix-a-Lot', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Sergio_Rockstar', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Sandy_MC', async (req,res) => {
    try {
        const endPoint = req.url
        
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Sirah_:tipo', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})
app.get('/Subliminal_:tipo', async (req,res) => {
    try {
        const endPoint = req.url
        
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Trevor_Daniel', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/Tech_N9ne', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})

app.get('/WC_:tipo', async (req,res) => {
    try {
        const endPoint = req.url
        
        res.send(await renderDataRapper(endPoint))
        
    } catch (error) {
        console.log(error.message);
        
    }
})


app.listen(PORT,()=>{
    console.log(`Server listening on port 127.0.0.1:${PORT}`);
    
})

//${tbody}