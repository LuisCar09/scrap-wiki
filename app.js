const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()
const PORT = 3000
const URL = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
const urlAnchorBase = 'https://es.wikipedia.org/wiki/'

const singers = []
const objectSorted = {}
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
                console.log(anchor,anchorName);
                const singer = {
                    firstLetter : anchorName[0],
                    name : anchorName,
                    url : anchor
                }
                singers.push(singer)
            })
            const characters = [h3.slice(0,3),...h3.slice(3)]
            
            
            singers.forEach(sing => {
                if (Number(sing.firstLetter)) {
                !objectSorted["[0-9]"] ? objectSorted["[0-9]"] = [sing]  : objectSorted["[0-9]"].push(sing)
                }else{
                    !objectSorted[sing.firstLetter] ? objectSorted[sing.firstLetter] = [sing]  : objectSorted[sing.firstLetter].push(sing)
                }
            })

            console.log(objectSorted);
            
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
                                    return `<div style=width:50%><h3>${char}</h3></div>`
                                }).join('')}
                            
                            </div>           
                        </body>
                        </html>

                `)
        }
    })

    
})

app.listen(PORT,()=>{
    console.log(`Server listening on port 127.0.0.1:${PORT}`);
    
})